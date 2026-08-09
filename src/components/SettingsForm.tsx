import React, { useEffect, useState } from "react";

type FormState = {
  name: string;
  email: string;
};

const STORAGE_KEY = "settings";

export default function SettingsForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "" });
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage("Please enter a name.");
      return;
    }
    if (!form.email.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setMessage("Saved.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 520,
        margin: "24px auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <h2 style={{ margin: 0 }}>Settings</h2>

      <label style={{ display: "flex", flexDirection: "column" }}>
        Name
        <input name="name" value={form.name} onChange={handleChange} />
      </label>

      <label style={{ display: "flex", flexDirection: "column" }}>
        Email
        <input name="email" value={form.email} onChange={handleChange} />
      </label>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button type="submit">Save</button>
        {message ? (
          <div style={{ color: message === "Saved." ? "green" : "red" }}>
            {message}
          </div>
        ) : null}
      </div>
    </form>
  );
}
