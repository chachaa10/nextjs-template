import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/shared/components/ui/button";

describe("Button", () => {
  test("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  test("applies default variant classes", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-slot", "button");
  });

  test("forwards className", () => {
    render(<Button className="custom-class">Styled</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class");
  });
});
