import apiClient from "./apiClient";
import type { Publication, PublicationCreate, Submission, SubmissionCreate } from "../types/publication";

export const publicationsApi = {
  list: (params?: { skip?: number; limit?: number }) =>
    apiClient.get<Publication[]>("/publications", { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Publication>(`/publications/${id}`).then((r) => r.data),

  create: (data: PublicationCreate) =>
    apiClient.post<Publication>("/publications", data).then((r) => r.data),

  update: (id: string, data: Partial<PublicationCreate>) =>
    apiClient.patch<Publication>(`/publications/${id}`, data).then((r) => r.data),

  uploadManuscript: (id: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<Publication>(`/publications/${id}/manuscript`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data);
  },

  createSubmission: (publicationId: string, data: SubmissionCreate) =>
    apiClient.post<Submission>(`/publications/${publicationId}/submissions`, data).then((r) => r.data),

  listSubmissions: (publicationId: string) =>
    apiClient.get<Submission[]>(`/publications/${publicationId}/submissions`).then((r) => r.data),
};
