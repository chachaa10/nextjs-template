import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { mockSignInAction } = vi.hoisted(() => ({
  mockSignInAction: vi.fn(),
}));

vi.mock("../actions/auth-actions.ts", () => ({
  signInAction: mockSignInAction,
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

  test("calls signInAction on valid submit", async () => {
    mockSignInAction.mockResolvedValue({ success: true, data: undefined });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(mockSignInAction).toHaveBeenCalledWith({
      email: VALID_EMAIL,
      password: "password123",
    });
  });

  test("shows auth error on failed submission", async () => {
    mockSignInAction.mockResolvedValue({ success: false, error: "Invalid credentials" });
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
});
