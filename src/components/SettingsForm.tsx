import { useEffect, useState } from "react";
import "./SettingsForm.css";
import { z } from "zod";

const STORAGE_KEY = "settings";

const SettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Email must be valid"),
});

type Settings = z.infer<typeof SettingsSchema>;

export default function SettingsForm() {
  const [form, setForm] = useState<Settings>({ name: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Settings, string>>>(
    {},
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const result = SettingsSchema.safeParse(parsed);
      if (result.success) setForm(result.data);
    } catch (err) {
      // fail silently
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }) as Settings);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = SettingsSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof Settings, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof Settings;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setMessage("Please fix errors");
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
      setMessage("Saved.");
      setErrors({});
    } catch (err) {
      setMessage("Failed to save settings.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="settings-heading"
      className="settings-form"
    >
      <h2 id="settings-heading">Settings</h2>

      <div className="settings-field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name ? (
          <div id="name-error" role="alert" className="settings-error">
            {errors.name}
          </div>
        ) : null}
      </div>

      <div className="settings-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email ? (
          <div id="email-error" role="alert" className="settings-error">
            {errors.email}
          </div>
        ) : null}
      </div>

      <div className="settings-actions">
        <button type="submit">Save</button>
        {message ? (
          <div
            role="status"
            className={
              message === "Saved." ? "settings-success" : "settings-error"
            }
          >
            {message}
          </div>
        ) : null}
      </div>
    </form>
  );
}
