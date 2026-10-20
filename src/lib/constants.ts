export const ROLES = ["ORGANIZER", "STAFF", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ACCOUNT_STATUSES = ["ACTIVE", "PENDING_APPROVAL", "REJECTED", "DEACTIVATED"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

// Organizers may edit their request only while it is in one of these states.
export const EDITABLE_STATUSES = ["SUBMITTED", "CHANGES_REQUESTED"] as const;

export const TIME_ZONE = "America/Regina";

