export function formatHumanTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatHumanTimeRange(startsAt: Date, endsAt: Date): string {
  return `${formatHumanTime(startsAt)} - ${formatHumanTime(endsAt)}`;
}

export function formatPlanningWindow(startsAt: Date, endsAt: Date): string {
  if (isSameCalendarDay(startsAt, endsAt)) {
    return formatHumanDate(startsAt);
  }

  if (
    startsAt.getFullYear() === endsAt.getFullYear() &&
    startsAt.getMonth() === endsAt.getMonth()
  ) {
    const month = startsAt.toLocaleDateString("en-US", { month: "long" });

    return `${month} ${startsAt.getDate()}-${endsAt.getDate()}, ${startsAt.getFullYear()}`;
  }

  if (startsAt.getFullYear() === endsAt.getFullYear()) {
    return `${formatMonthDay(startsAt)} - ${formatMonthDay(endsAt)}, ${startsAt.getFullYear()}`;
  }

  return `${formatHumanDate(startsAt)} - ${formatHumanDate(endsAt)}`;
}

export function formatPreviewTimestamp(timestamp: string, now: Date = new Date()): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  if (isSameCalendarDay(date, now)) {
    return `Today at ${formatHumanTime(date)}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameCalendarDay(date, yesterday)) {
    return `Yesterday at ${formatHumanTime(date)}`;
  }

  return `${formatHumanDate(date)} at ${formatHumanTime(date)}`;
}

export function formatHumanDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMonthDay(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(date);
}

function isSameCalendarDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}
