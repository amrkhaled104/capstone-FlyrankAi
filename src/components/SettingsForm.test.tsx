import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsForm from "./SettingsForm";
import { beforeEach, describe, expect, it } from "vitest";

const STORAGE_KEY = "settings";

beforeEach(() => {
  localStorage.clear();
});

describe("SettingsForm", () => {
  it("loads initial data from localStorage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name: "Bob", email: "bob@example.com" }),
    );
    render(<SettingsForm />);

    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe(
      "Bob",
    );
    expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe(
      "bob@example.com",
    );
  });

  it("shows validation errors for invalid input", async () => {
    render(<SettingsForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), "A");
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/at least 2 characters/i)).toBeTruthy();
    expect(await screen.findByText(/email must be valid/i)).toBeTruthy();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("saves valid data to localStorage and shows success message", async () => {
    render(<SettingsForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(screen.getByText(/saved\./i)).toBeTruthy());
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(parsed).toEqual({ name: "Alice", email: "alice@example.com" });
  });
});
