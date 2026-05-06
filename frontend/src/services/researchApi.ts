import apiClient from "./apiClient";
import type { ResearchProject, ResearchProjectCreate, ResearchTask, LiteratureItem } from "../types/research";

export const researchApi = {
  listProjects: (params?: { skip?: number; limit?: number }) =>
    apiClient.get<ResearchProject[]>("/research", { params }).then((r) => r.data),

  getProject: (id: string) =>
    apiClient.get<ResearchProject>(`/research/${id}`).then((r) => r.data),

  createProject: (data: ResearchProjectCreate) =>
    apiClient.post<ResearchProject>("/research", data).then((r) => r.data),

  updateProject: (id: string, data: Partial<ResearchProjectCreate>) =>
    apiClient.patch<ResearchProject>(`/research/${id}`, data).then((r) => r.data),

  deleteProject: (id: string) =>
    apiClient.delete(`/research/${id}`),

  listTasks: (projectId: string) =>
    apiClient.get<ResearchTask[]>(`/research/${projectId}/tasks`).then((r) => r.data),

  createTask: (projectId: string, data: { title: string; description?: string; due_date?: string }) =>
    apiClient.post<ResearchTask>(`/research/${projectId}/tasks`, data).then((r) => r.data),

  listLiterature: (projectId: string) =>
    apiClient.get<LiteratureItem[]>(`/research/${projectId}/literature`).then((r) => r.data),

  addLiteratureItem: (projectId: string, data: Omit<LiteratureItem, "id" | "project_id" | "created_at">) =>
    apiClient.post<LiteratureItem>(`/research/${projectId}/literature`, data).then((r) => r.data),
};
