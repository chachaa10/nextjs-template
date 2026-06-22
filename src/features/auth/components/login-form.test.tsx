import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { mockSignInEmail, mockPush } = vi.hoisted(() => ({
  mockSignInEmail: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock("@/lib/auth-client.ts", () => ({
  authClient: {
    signIn: { email: mockSignInEmail },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn() }),
}));

import { VALID_EMAIL } from "../const/test-constants.ts";
import { LoginForm } from "./login-form.tsx";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LoginForm", () => {
  function renderForm() {
    return render(<LoginForm redirectTo={undefined} />);
  }

  test("renders email and password fields", () => {
    renderForm();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  test("calls authClient.signIn.email on valid submit", async () => {
    mockSignInEmail.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(mockSignInEmail).toHaveBeenCalledWith({ email: VALID_EMAIL, password: "password123" });
  });

  test("redirects to redirectTo on success", async () => {
    mockSignInEmail.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<LoginForm redirectTo="/todo" />);

    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(mockPush).toHaveBeenCalledWith("/todo");
  });

  test("redirects to / when no redirectTo on success", async () => {
    mockSignInEmail.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("shows auth error on failed submission", async () => {
    mockSignInEmail.mockResolvedValue({ error: { message: "Invalid credentials" } });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  test("shows email field validation error on blur with invalid email after submit", async () => {
    const user = userEvent.setup();
    renderForm();

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "bad-email");
    await user.click(screen.getByRole("button", { name: "Log in" }));
    fireEvent.blur(emailInput);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  test("shows password field validation error on blur with empty password after submit", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.click(screen.getByRole("button", { name: "Log in" }));
    fireEvent.blur(screen.getByLabelText("Password"));

    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  test("shows fallback error message when error has no message", async () => {
    mockSignInEmail.mockResolvedValue({ error: {} });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });
});
