export type PublicationType = "journal_article" | "conference_paper" | "book_chapter" | "thesis" | "preprint" | "report" | "dataset";
export type PublicationStatus = "draft" | "under_review" | "revision_requested" | "accepted" | "published" | "rejected" | "withdrawn";
export type SubmissionStatus = "submitted" | "under_review" | "revision_required" | "revision_submitted" | "accepted" | "rejected" | "withdrawn";

export interface Publication {
  id: string;
  title: string;
  abstract: string | null;
  authors: string[];
  keywords: string[];
  pub_type: PublicationType;
  status: PublicationStatus;
  doi: string | null;
  version: number;
  project_id: string | null;
  submitter_id: string;
  created_at: string;
  updated_at: string;
}

export type PublicationCreate = Omit<Publication, "id" | "submitter_id" | "created_at" | "updated_at" | "version">;

export interface Submission {
  id: string;
  publication_id: string;
  venue_name: string;
  venue_type: string;
  status: SubmissionStatus;
  submitted_at: string;
  decision_at: string | null;
  decision_notes: string | null;
  submission_url: string | null;
  created_at: string;
}

export type SubmissionCreate = Omit<Submission, "id" | "publication_id" | "status" | "decision_at" | "decision_notes" | "created_at">;
