import { parseTimeString } from "../time/userDay.js";
import type { BlockTemplate, BlockTemplateValidationResult, PriorityLevel } from "./types.js";

const PRIORITY_LEVELS: PriorityLevel[] = [1, 2, 3, 4, 5];

export function validateBlockTemplate(blockTemplate: BlockTemplate): BlockTemplateValidationResult {
  const errors: string[] = [];

  if (blockTemplate.title.trim().length === 0) {
    errors.push("title must not be empty");
  }

  if (!Number.isInteger(blockTemplate.durationMinutes) || blockTemplate.durationMinutes <= 0) {
    errors.push("durationMinutes must be a positive integer");
  }

  if (!PRIORITY_LEVELS.includes(blockTemplate.priority)) {
    errors.push("priority must be an integer from 1 to 5");
  }

  validatePreferredWindow(blockTemplate, errors);
  validateResources(blockTemplate, errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validatePreferredWindow(blockTemplate: BlockTemplate, errors: string[]): void {
  if (blockTemplate.placementType === "fixed") {
    if (blockTemplate.fixedStartTime === undefined) {
      errors.push("fixed placementType requires fixedStartTime");
      return;
    }

    parseTimeString(blockTemplate.fixedStartTime);

    if (
      blockTemplate.customWindowStartTime !== undefined ||
      blockTemplate.customWindowEndTime !== undefined
    ) {
      errors.push("custom window times must only be set for flexible custom placement");
    }

    return;
  }

  if (blockTemplate.fixedStartTime !== undefined) {
    errors.push("fixedStartTime must only be set when placementType is fixed");
  }

  if (blockTemplate.preferredWindow === undefined) {
    errors.push("flexible placementType requires preferredWindow");
    return;
  }

  if (blockTemplate.preferredWindow !== "custom") {
    if (
      blockTemplate.customWindowStartTime !== undefined ||
      blockTemplate.customWindowEndTime !== undefined
    ) {
      errors.push("custom window times must only be set when preferredWindow is custom");
    }

    return;
  }

  if (
    blockTemplate.customWindowStartTime === undefined ||
    blockTemplate.customWindowEndTime === undefined
  ) {
    errors.push(
      "custom preferredWindow requires both customWindowStartTime and customWindowEndTime",
    );

    return;
  }

  const startTime = parseTimeString(blockTemplate.customWindowStartTime);
  const endTime = parseTimeString(blockTemplate.customWindowEndTime);

  if (startTime.totalMinutes === endTime.totalMinutes) {
    errors.push("custom window start and end times must not be identical");
  }
}

function validateResources(blockTemplate: BlockTemplate, errors: string[]): void {
  if (blockTemplate.requiresResource && blockTemplate.externalResources.length === 0) {
    errors.push(
      "externalResources must include at least one resource when requiresResource is true",
    );
  }

  for (const resource of blockTemplate.externalResources) {
    if (resource.label.trim().length === 0) {
      errors.push(`external resource ${resource.id} label must not be empty`);
    }

    if (resource.value.trim().length === 0) {
      errors.push(`external resource ${resource.id} value must not be empty`);
    }

    if (resource.type === "integration" && resource.integrationProvider === undefined) {
      errors.push(
        `external resource ${resource.id} must include integrationProvider for integration type`,
      );
    }

    if (resource.type !== "integration" && resource.integrationProvider !== undefined) {
      errors.push(
        `external resource ${resource.id} must not include integrationProvider unless type is integration`,
      );
    }
  }
}
