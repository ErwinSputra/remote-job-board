export const CATEGORIES = [
  "Software Engineering",
  "Product Management",
  "Design",
  "Marketing",
  "Sales",
  "Customer Service",
  "Data & Analytics",
  "DevOps & Infrastructure",
  "Finance & Accounting",
  "Human Resources",
  "Legal",
  "Operations",
  "Content & Writing",
  "Education & Coaching",
  "Healthcare",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
