import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { VALID_EMAIL, VALID_NAME, VALID_PASSWORD } from "../const/test-constants.ts";

const { mockSignUpAction } = vi.hoisted(() => ({
  mockSignUpAction: vi.fn(),
}));

vi.mock("../actions/auth-actions.ts", () => ({
  signUpAction: mockSignUpAction,
}));

import { SignUpForm } from "./sign-up-form.tsx";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SignUpForm", () => {
  function renderForm() {
    return render(<SignUpForm redirectTo={undefined} />);
  }

  test("renders name, email, and password fields", () => {
    renderForm();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  });

  test("calls signUpAction on valid submit", async () => {
    mockSignUpAction.mockResolvedValue({ success: true, data: undefined });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Name"), VALID_NAME);
    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.type(screen.getByLabelText("Password"), VALID_PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(mockSignUpAction).toHaveBeenCalledWith({
      name: VALID_NAME,
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    });
  });

  test("shows auth error on failed submission", async () => {
    mockSignUpAction.mockResolvedValue({ success: false, error: "Email already in use" });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Name"), VALID_NAME);
    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.type(screen.getByLabelText("Password"), VALID_PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Email already in use")).toBeInTheDocument();
  });

  test("shows name field validation error on blur with empty name after submit", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    await user.type(screen.getByLabelText("Password"), VALID_PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));
    fireEvent.blur(screen.getByLabelText("Name"));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  test("shows email field validation error on blur with invalid email after submit", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Name"), VALID_NAME);
    await user.type(screen.getByLabelText("Password"), VALID_PASSWORD);
    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "not-an-email");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    fireEvent.blur(emailInput);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  test("shows password field validation error on blur with short password after submit", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Name"), VALID_NAME);
    await user.type(screen.getByLabelText("Email"), VALID_EMAIL);
    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    fireEvent.blur(passwordInput);

    expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
  });
});
