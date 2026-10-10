'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, deleteField } from 'firebase/firestore';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle2,
  Wrench,
  LogOut,
  Globe,
  EyeOff,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { signOutFromFirebase } from '@/lib/auth.service';
import { UserRole, ProfileFormData } from '@/lib/validators/auth.schema';

export default function ProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('customer');
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: 'Amr Khaled',
    email: 'amr@homeservices.ai',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield',
    role: 'customer',
    profession: '',
    yearsOfExperience: '',
    hourlyRate: '',
    bio: '',
    isPublished: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  const isProvider = role === 'technician' || (role as string) === 'provider';

  // Dynamic role detection from Firebase Auth & Cloud Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const rawRole = String(data.role || 'customer').toLowerCase();
            const detectedRole: UserRole = rawRole === 'provider' || rawRole === 'technician' ? 'technician' : 'customer';
            const userIsProvider = detectedRole === 'technician';
            setRole(detectedRole);
            setFormData({
              fullName: data.fullName || user.displayName || 'Amr Khaled',
              email: data.email || user.email || 'amr@homeservices.ai',
              phone: data.phone || '',
              address: data.address || '',
              role: detectedRole,
              // Strictly exclude provider fields from form state if customer
              profession: userIsProvider ? (data.profession || 'Plumbing Services') : '',
              yearsOfExperience: userIsProvider ? (data.yearsOfExperience || '') : '',
              hourlyRate: userIsProvider ? (data.hourlyRate || '') : '',
              bio: userIsProvider ? (data.bio || '') : '',
              isPublished: userIsProvider ? Boolean(data.isPublished) : false,
            });
          } else {
            if (user.displayName) {
              setFormData((prev) => ({ ...prev, fullName: user.displayName! }));
            }
            if (user.email) {
              setFormData((prev) => ({ ...prev, email: user.email! }));
            }
          }
        } catch (err) {
          console.warn('[Profile] Failed to fetch profile from Firestore:', err);
        }
      } else {
        if (typeof window !== 'undefined') {
          const rawSaved = localStorage.getItem('user_role');
          if (rawSaved) {
            const normalizedRole: UserRole = rawSaved === 'provider' || rawSaved === 'technician' ? 'technician' : 'customer';
            const userIsProvider = normalizedRole === 'technician';
            setRole(normalizedRole);
            setFormData((prev) => ({
              ...prev,
              role: normalizedRole,
              profession: userIsProvider ? (prev.profession || 'Plumbing Services') : '',
              yearsOfExperience: userIsProvider ? prev.yearsOfExperience : '',
              hourlyRate: userIsProvider ? prev.hourlyRate : '',
              bio: userIsProvider ? prev.bio : '',
              isPublished: userIsProvider ? Boolean(prev.isPublished) : false,
            }));
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handleTogglePublish = async () => {
    const nextPublished = !formData.isPublished;
    setFormData((prev) => ({ ...prev, isPublished: nextPublished }));
    setSaveSuccess(false);

    if (currentUser && isProvider) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(
          docRef,
          {
            isPublished: nextPublished,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('[Profile] Failed to update publish status:', err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('logged_out', 'true');
      }
      await signOutFromFirebase();
      router.push('/login');
    } catch (error) {
      console.error('[Profile] Sign out failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);

        if (!isProvider) {
          // If Role is 'customer': Save only customer fields (fullName, email, phone, address, role)
          // and explicitly delete/exclude provider-specific fields from Firestore
          const customerPayload = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            role: 'customer' as const,
            profession: deleteField(),
            hourlyRate: deleteField(),
            yearsOfExperience: deleteField(),
            bio: deleteField(),
            isPublished: deleteField(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(docRef, customerPayload, { merge: true });
        } else {
          // If Role is 'provider' / 'technician': Save both personal and provider-specific fields
          const providerPayload = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            role,
            profession: formData.profession?.trim() || '',
            yearsOfExperience: formData.yearsOfExperience?.trim() || '',
            hourlyRate: formData.hourlyRate?.trim() || '',
            bio: formData.bio?.trim() || '',
            isPublished: Boolean(formData.isPublished),
            updatedAt: serverTimestamp(),
          };
          await setDoc(docRef, providerPayload, { merge: true });
        }
      }

      // Strictly ensure the local form state matches the role condition
      if (!isProvider) {
        setFormData((prev) => ({
          ...prev,
          role: 'customer',
          profession: '',
          yearsOfExperience: '',
          hourlyRate: '',
          bio: '',
          isPublished: false,
        }));
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('user_role', role);
      }

      // Brief feedback delay for UI transition
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSaveSuccess(true);
    } catch (error) {
      console.error('[Profile] Failed to save profile:', error);
      setSaveSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-zinc-200/80 pb-6 dark:border-zinc-800 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Account Profile
              </h1>
              {/* Dynamic Role Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                {isProvider ? (
                  <>
                    <Wrench className="h-3 w-3" />
                    <span>Provider Account</span>
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3" />
                    <span>Customer Account</span>
                  </>
                )}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {isProvider
                ? 'Update your personal contact info and public service card details.'
                : 'Manage your personal details and service delivery address.'}
            </p>
          </div>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 shadow-2xs transition hover:bg-rose-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div
            role="status"
            className="mt-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="font-medium">Changes saved successfully!</p>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Section 1: Personal Details (Always visible for both Customer & Provider) */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Personal Details
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isProvider
                    ? 'Your personal contact information and dispatch address.'
                    : 'Personal contact details and home maintenance address.'}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Full Name
                </label>
                <div className="relative mt-2">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3.5 pl-10 text-sm text-zinc-900 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
                    placeholder="Amr Khaled"
                  />
                  <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Email Address
                </label>
                <div className="relative mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3.5 pl-10 text-sm text-zinc-900 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
                    placeholder="amr@example.com"
                  />
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Phone Number
                </label>
                <div className="relative mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3.5 pl-10 text-sm text-zinc-900 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
                    placeholder="+1 (555) 234-5678"
                  />
                  <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Address
                </label>
                <div className="relative mt-2">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3.5 pl-10 text-sm text-zinc-900 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
                    placeholder="Street, City, State"
                  />
                  <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Provider-Specific Fields (Only visible when role is 'provider' or 'technician') */}
          {isProvider && (
            <section className="rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/20 sm:p-7">
              <div className="flex items-center justify-between border-b border-blue-100 pb-4 dark:border-blue-900/40">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      Provider Professional Details
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Populates your public trade service card for client bookings.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  Public Service Card
                </span>
              </div>

              {/* Publication Status Card */}
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                        formData.isPublished
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {formData.isPublished ? (
                        <Globe className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          Directory Visibility (تأكيد الظهور في الخدمات)
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                            formData.isPublished
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              formData.isPublished
                                ? 'bg-emerald-500 animate-pulse'
                                : 'bg-amber-500'
                            }`}
                          />
                          <span>{formData.isPublished ? 'Live in Directory' : 'Hidden from Directory'}</span>
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {formData.isPublished
                          ? 'Your technician card is publicly discoverable and customers can view your profile and book your services.'
                          : 'Your profile is currently hidden from search results. Toggle on to start receiving client booking requests.'}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Controls */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={handleTogglePublish}
                      role="switch"
                      aria-checked={Boolean(formData.isPublished)}
                      aria-label="Toggle profile directory publication"
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        formData.isPublished ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          formData.isPublished ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={handleTogglePublish}
                      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition shadow-2xs ${
                        formData.isPublished
                          ? 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                      }`}
                    >
                      {formData.isPublished ? 'Unpublish' : 'Publish Profile'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Profession / Service Category */}
                <div>
                  <label
                    htmlFor="profession"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                  >
                    Trade Category
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      <option value="Plumbing Services">Plumbing Services</option>
                      <option value="Electrical & Wiring">Electrical & Wiring</option>
                      <option value="AC & HVAC Maintenance">AC & HVAC Maintenance</option>
                      <option value="Appliance Repair">Appliance Repair</option>
                      <option value="Deep Home Cleaning">Deep Home Cleaning</option>
                    </select>
                  </div>
                </div>

                {/* Years of Experience */}
                <div>
                  <label
                    htmlFor="yearsOfExperience"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                  >
                    Experience
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="text"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3.5 pl-10 text-sm text-zinc-900 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      placeholder="8 years"
                    />
                    <Clock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label
                    htmlFor="hourlyRate"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                  >
                    Hourly Rate
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="text"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3.5 pl-10 text-sm text-zinc-900 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      placeholder="$75/hr"
                    />
                    <DollarSign className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Bio / Summary */}
              <div className="mt-6">
                <label
                  htmlFor="bio"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Professional Bio
                </label>
                <div className="relative mt-2">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3.5 text-sm text-zinc-900 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    placeholder="Describe your trade background, certifications, and service guarantees..."
                  />
                </div>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
