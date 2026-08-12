export type Weekday =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type TimeString = `${number}:${number}`;

export type ParsedTime = {
  hours: number;
  minutes: number;
  totalMinutes: number;
};

export type UserDayBoundary = {
  dayBoundaryStartTime: TimeString;
};

export type UserWeekBoundary = {
  weekStartsOn: Weekday;
};

export type UserTimePreferences = UserDayBoundary & UserWeekBoundary;

export type UserDayRange = {
  userDayDate: string;
  start: Date;
  end: Date;
};

export type UserWeekRange = {
  userWeekStartDate: string;
  start: Date;
  end: Date;
};
