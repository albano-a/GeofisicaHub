import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: "en",
    },
  }),
}));

// Mock LanguageSelector to simplify tests
vi.mock("./LanguageSelector", () => ({
  default: () => <div data-testid="language-selector">Language Selector</div>,
}));

describe("Navbar", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

  it("renders navigation links", () => {
    renderComponent();

    // Desktop nav buttons
    expect(
      screen.getByRole("link", { name: /Navbar\.Home/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Navbar\.About/i })
    ).toBeInTheDocument();
  });

  it("renders the language selector", () => {
    renderComponent();
    // There are multiple language selectors (desktop + mobile), use getAllBy
    const selectors = screen.getAllByTestId("language-selector");
    expect(selectors.length).toBeGreaterThan(0);
  });

  it("toggles dark mode when theme button is clicked", () => {
    renderComponent();

    // Find and click the dark mode toggle button
    const themeButtons = screen.getAllByRole("button");
    const themeToggle = themeButtons.find(
      (btn) => btn.getAttribute("aria-label") === "toggle dark mode"
    );

    if (themeToggle) {
      fireEvent.click(themeToggle);
      expect(localStorage.getItem("theme")).toBe("dark");
    }
  });

  it("renders the brand logo", () => {
    renderComponent();

    const logo = screen.getByAltText("Brand Logo");
    expect(logo).toBeInTheDocument();
  });
});
