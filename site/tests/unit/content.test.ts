import { describe, it, expect } from "vitest";
import { site } from "../../src/content/site";

describe("site content", () => {
  it("has the client funnel sections", () => {
    expect(site.hero.title.length).toBeGreaterThan(10);
    expect(site.proof.metrics).toHaveLength(4);
    expect(site.services.items).toHaveLength(4);
    expect(site.howItWorks.steps).toHaveLength(4);
    expect(site.sectors.items.length).toBeGreaterThanOrEqual(5);
    expect(site.cases.items.length).toBeGreaterThanOrEqual(2);
  });

  it("has two-step forms for quote, driver and fulfilment", () => {
    expect(site.quoteForm.steps).toHaveLength(2);
    expect(site.driverForm.steps).toHaveLength(2);
    expect(site.fulfilmentForm.steps).toHaveLength(2);
  });

  it("has the fulfilment vertical", () => {
    expect(site.fulfilment.services.items).toHaveLength(9);
    expect(site.fulfilment.capacity.points).toContain("126 installed pallet positions");
    expect(site.fulfilment.audience.items.length).toBeGreaterThanOrEqual(4);
  });

  it("has the fulfilment band copy", () => {
    expect(site.fulfilmentBand.title.length).toBeGreaterThan(0);
    expect(site.fulfilmentBand.body.length).toBeGreaterThan(0);
    expect(site.fulfilmentBand.ctaLabel).toBe("See fulfilment");
    expect(site.fulfilmentBand.ctaHref).toBe("/fulfilment");
  });

  it("uses no banned copy words", () => {
    const text = JSON.stringify(site).toLowerCase();
    for (const banned of ["solutions", "innovative", "revolutioniz", "excellence"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("keeps real company data", () => {
    expect(site.company.address.postcode).toBe("IP2 0DD");
    expect(site.company.coverage).toEqual(["Norfolk", "Suffolk", "Essex"]);
  });
});
