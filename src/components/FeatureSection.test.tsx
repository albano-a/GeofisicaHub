import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FeatureSection from "./FeatureSection";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("FeatureSection", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <FeatureSection />
      </MemoryRouter>
    );

  it("renders the section heading", () => {
    renderComponent();
    expect(screen.getByText("Features.PowerfulFeatures")).toBeInTheDocument();
  });

  it("renders all three feature cards", () => {
    renderComponent();

    // Check that all feature titles are rendered
    expect(screen.getByText("Features.StudyMaterials")).toBeInTheDocument();
    expect(
      screen.getByText("Features.CalculatorsResources")
    ).toBeInTheDocument();
    expect(screen.getByText("Features.ScientificPubli")).toBeInTheDocument();
  });

  it("renders Get Started buttons for each feature", () => {
    renderComponent();

    const buttons = screen.getAllByText("HomePage.GetStarted");
    expect(buttons).toHaveLength(3);
  });

  it("renders correct links for each feature", () => {
    renderComponent();

    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("/hub");
    expect(hrefs).toContain("/tools");
    expect(hrefs).toContain("/research");
  });
});
