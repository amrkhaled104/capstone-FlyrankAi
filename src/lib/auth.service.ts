import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { SignUpFormData, LoginFormData, UserProfile } from '@/lib/validators/auth.schema';

/**
 * Translates Firebase Auth and Firestore error codes into clear, user-friendly messages.
 */
export function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in or use a different email.';
    case 'auth/invalid-email':
      return 'The email address format is invalid. Please verify and try again.';
    case 'auth/weak-password':
      return 'The password is too weak. Please ensure it has at least 8 characters with numbers and uppercase letters.';
    case 'auth/operation-not-allowed':
      return 'Email/password authentication is not enabled. Please verify your Firebase project settings.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Access has been temporarily restricted. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    case 'permission-denied':
      return 'Permission denied: Unable to save user profile to Cloud Firestore.';
    case 'unavailable':
      return 'The database service is temporarily unavailable. Please try again shortly.';
    default:
      return 'An unexpected authentication error occurred. Please try again.';
  }
}

/**
 * Backend sign-up operation designed to be passed to SignUpForm's `onSubmit` prop.
 *
 * 1. Uses `createUserWithEmailAndPassword` to register the user in Firebase Auth.
 * 2. Uses `updateProfile` to set the user's `displayName`.
 * 3. Uses `setDoc` with `doc(db, 'users', user.uid)` to store the user profile
 *    (uid, fullName, email, role, and server timestamps) securely in Cloud Firestore.
 */
export async function signUpWithFirebase(
  data: SignUpFormData
): Promise<{ error?: string } | void> {
  try {
    // 1. Create user account in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    // 2. Update user profile displayName
    try {
      await updateProfile(user, {
        displayName: data.fullName,
      });
    } catch (profileError) {
      console.warn('[Firebase Auth] Failed to update displayName:', profileError);
    }

    // 3. Securely store user profile in Cloud Firestore ('users' collection)
    const userRef = doc(db, 'users', user.uid);
    const userProfile: UserProfile = {
      uid: user.uid,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, userProfile);
  } catch (error: unknown) {
    console.error('[Firebase Auth] Sign-up failed:', error);
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError?.code) {
      return { error: getFirebaseErrorMessage(firebaseError.code) };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unexpected registration error occurred. Please try again.' };
  }
}

/**
 * Backend sign-in operation designed to be passed to LoginForm's `onSubmit` prop.
 */
export async function signInWithFirebase(
  data: LoginFormData
): Promise<{ error?: string } | void> {
  try {
    // Configure session persistence if running in browser
    if (typeof window !== 'undefined' && data.rememberMe !== undefined) {
      try {
        await setPersistence(
          auth,
          data.rememberMe ? browserLocalPersistence : browserSessionPersistence
        );
      } catch {
        // Fallback gracefully if storage access is restricted
      }
    }

    await signInWithEmailAndPassword(auth, data.email, data.password);
  } catch (error: unknown) {
    console.error('[Firebase Auth] Sign-in failed:', error);
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError?.code) {
      return { error: getFirebaseErrorMessage(firebaseError.code) };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Invalid email or password. Please verify your credentials.' };
  }
}

/**
 * Sign out currently logged-in user.
 */
export async function signOutFromFirebase(): Promise<void> {
  await signOut(auth);
}
