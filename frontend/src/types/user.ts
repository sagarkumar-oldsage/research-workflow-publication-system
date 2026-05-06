export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "researcher" | "reviewer" | "editor";
  is_active: boolean;
  affiliation: string | null;
  orcid_id: string | null;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
