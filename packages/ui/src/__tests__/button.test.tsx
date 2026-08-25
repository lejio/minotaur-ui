import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../components/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("defaults to type button", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("applies danger variant class", () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn.className).toMatch(/danger|bg-\[var\(--danger\)\]|--danger/);
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Wait</Button>);
    expect(screen.getByRole("button", { name: "Wait" })).toBeDisabled();
  });
});
