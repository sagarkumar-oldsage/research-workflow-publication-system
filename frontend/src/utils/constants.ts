export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const QUERY_KEYS = {
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  publications: ["publications"] as const,
  publication: (id: string) => ["publications", id] as const,
  submissions: ["submissions"] as const,
  reviews: ["reviews"] as const,
  me: ["me"] as const,
} as const;
