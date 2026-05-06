export type UserRole = 'admin' | 'contributor' | 'reviewer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  department?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export type AssignmentType =
  | 'conference_paper'
  | 'journal_paper'
  | 'book_chapter'
  | 'patent'
  | 'copyright'
  | 'research_proposal'
  | 'project'
  | 'review_article'
  | 'survey_paper'
  | 'thesis_work'
  | 'other';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type AssignmentStatus =
  | 'active'
  | 'completed'
  | 'on_hold'
  | 'cancelled';

export type StageStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'review_required'
  | 'rejected'
  | 'accepted';

export interface WorkflowStage {
  id: string;
  name: string;
  assignedTo?: string; // uid
  assignedToName?: string;
  dueDate?: string;
  status: StageStatus;
  remarks?: string;
  attachmentLinks?: string[];
  completedAt?: string;
  order: number;
}

export interface Assignment {
  id: string;
  title: string;
  type: AssignmentType;
  description: string;
  priority: PriorityLevel;
  status: AssignmentStatus;
  startDate: string;
  deadline: string;
  targetVenue?: string; // conference/journal/publisher
  teamMembers: string[]; // uids
  teamMemberNames?: string[];
  leadMember: string; // uid
  leadMemberName?: string;
  tags: string[];
  referenceLinks: string[];
  documentLinks: string[];
  stages: WorkflowStage[];
  currentStageIndex: number;
  progressPercent: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  type: AssignmentType;
  stages: Omit<WorkflowStage, 'id' | 'assignedTo' | 'assignedToName' | 'dueDate' | 'status' | 'remarks' | 'attachmentLinks' | 'completedAt'>[];
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  assignmentId: string;
  stageId?: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  text: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  assignmentId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline' | 'stage_update' | 'assignment' | 'review' | 'general';
  read: boolean;
  assignmentId?: string;
  createdAt: string;
}
