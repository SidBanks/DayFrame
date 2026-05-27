import { describe, expect, it } from "vitest";

import type { BlockTemplate } from "../types.js";
import { validateBlockTemplate } from "../validateBlockTemplate.js";

const baseTemplate: BlockTemplate = {
  id: "template_workout",
  userId: "user_001",
  title: "Workout",
  category: "fitness",
  placementType: "flexible",
  durationMinutes: 60,
  priority: 2,
  preferredWindow: "afterWork",
  rescheduleBehavior: "autoSameUserWeek",
  requiresResource: false,
  externalResources: [],
  enabled: true,
  createdAt: "2026-05-02T00:00:00-05:00",
  updatedAt: "2026-05-02T00:00:00-05:00",
};

describe("validateBlockTemplate", () => {
  it("accepts a valid flexible block template", () => {
    expect(validateBlockTemplate(baseTemplate)).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it("accepts a valid custom preferred window", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      title: "Wind Down",
      category: "recovery",
      preferredWindow: "custom",
      customWindowStartTime: "20:30",
      customWindowEndTime: "22:00",
    });

    expect(result).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it("accepts a valid fixed template with a fixed start time", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      placementType: "fixed",
      fixedStartTime: "07:00",
    });

    expect(result).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it("rejects an empty title and non-positive duration", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      title: "   ",
      durationMinutes: 0,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual([
      "title must not be empty",
      "durationMinutes must be a positive integer",
    ]);
  });

  it("rejects a priority outside the 1 to 5 range", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      priority: 6 as never,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("priority must be an integer from 1 to 5");
  });

  it("requires both custom window times when preferredWindow is custom", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      preferredWindow: "custom",
      customWindowStartTime: "09:00",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "custom preferredWindow requires both customWindowStartTime and customWindowEndTime",
    );
  });

  it("requires fixedStartTime when placementType is fixed", () => {
    const fixedTemplateWithoutStartTime = {
      ...baseTemplate,
      placementType: "fixed" as const,
    };

    const result = validateBlockTemplate(fixedTemplateWithoutStartTime);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("fixed placementType requires fixedStartTime");
  });

  it("rejects fixedStartTime when placementType is flexible", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      fixedStartTime: "07:00",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("fixedStartTime must only be set when placementType is fixed");
  });

  it("requires preferredWindow when placementType is flexible", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      preferredWindow: undefined as never,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("flexible placementType requires preferredWindow");
  });

  it("rejects identical custom window start and end times", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      preferredWindow: "custom",
      customWindowStartTime: "09:00",
      customWindowEndTime: "09:00",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("custom window start and end times must not be identical");
  });

  it("rejects custom window times when preferredWindow is not custom", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      preferredWindow: "afterWork",
      customWindowStartTime: "09:00",
      customWindowEndTime: "10:00",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "custom window times must only be set when preferredWindow is custom",
    );
  });

  it("requires resources when requiresResource is true", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      title: "Medication",
      category: "health",
      requiresResource: true,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "externalResources must include at least one resource when requiresResource is true",
    );
  });

  it("validates external resource fields and integration provider rules", () => {
    const result = validateBlockTemplate({
      ...baseTemplate,
      requiresResource: true,
      externalResources: [
        {
          id: "resource_bad_note",
          type: "note",
          label: "",
          value: "  ",
          integrationProvider: "customUrl",
          createdAt: "2026-05-02T00:00:00-05:00",
          updatedAt: "2026-05-02T00:00:00-05:00",
        },
        {
          id: "resource_bad_integration",
          type: "integration",
          label: "Plan",
          value: "notion://plan",
          createdAt: "2026-05-02T00:00:00-05:00",
          updatedAt: "2026-05-02T00:00:00-05:00",
        },
      ],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual([
      "external resource resource_bad_note label must not be empty",
      "external resource resource_bad_note value must not be empty",
      "external resource resource_bad_note must not include integrationProvider unless type is integration",
      "external resource resource_bad_integration must include integrationProvider for integration type",
    ]);
  });
});
