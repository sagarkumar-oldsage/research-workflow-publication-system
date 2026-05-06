export type ProjectStatus = "planning" | "in_progress" | "on_hold" | "completed" | "archived";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface ResearchProject {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  keywords: string[];
  funding_source: string | null;
  start_date: string | null;
  end_date: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export type ResearchProjectCreate = Omit<ResearchProject, "id" | "owner_id" | "created_at" | "updated_at">;

export interface ResearchTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  assignee_id: string | null;
  created_at: string;
}

export interface LiteratureItem {
  id: string;
  project_id: string;
  title: string;
  authors: string[];
  doi: string | null;
  abstract: string | null;
  notes: string | null;
  tags: string[];
  year: number | null;
  created_at: string;
}
