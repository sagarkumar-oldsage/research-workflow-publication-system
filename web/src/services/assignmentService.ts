import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, Timestamp, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Assignment, WorkflowStage, ActivityLog } from '@/types';
import { WORKFLOW_TEMPLATES } from '@/lib/constants';
import { nanoid } from 'nanoid';

const ASSIGNMENTS_COL = 'assignments';
const ACTIVITY_COL = 'activity_logs';

export async function createAssignment(
  data: Omit<Assignment, 'id' | 'stages' | 'currentStageIndex' | 'progressPercent' | 'createdAt' | 'updatedAt'>,
  createdBy: string
): Promise<string> {
  const templateStages = WORKFLOW_TEMPLATES[data.type] || WORKFLOW_TEMPLATES.other;
  const stages: WorkflowStage[] = templateStages.map((s) => ({
    ...s,
    id: nanoid(),
    status: 'pending' as const,
  }));

  const now = new Date().toISOString();
  const assignment: Omit<Assignment, 'id'> = {
    ...data,
    stages,
    currentStageIndex: 0,
    progressPercent: 0,
    createdBy,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await addDoc(collection(db, ASSIGNMENTS_COL), assignment);
  return ref.id;
}

export async function getAssignment(id: string): Promise<Assignment | null> {
  const snap = await getDoc(doc(db, ASSIGNMENTS_COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Assignment;
}

export async function getAllAssignments(): Promise<Assignment[]> {
  const snap = await getDocs(query(collection(db, ASSIGNMENTS_COL), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment));
}

export async function getAssignmentsByUser(uid: string): Promise<Assignment[]> {
  const snap = await getDocs(
    query(collection(db, ASSIGNMENTS_COL), where('teamMembers', 'array-contains', uid))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment));
}

export async function updateAssignment(id: string, data: Partial<Assignment>): Promise<void> {
  await updateDoc(doc(db, ASSIGNMENTS_COL, id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteAssignment(id: string): Promise<void> {
  await deleteDoc(doc(db, ASSIGNMENTS_COL, id));
}

export async function updateStageStatus(
  assignmentId: string,
  stageId: string,
  status: WorkflowStage['status'],
  remarks?: string,
  updatedByUid?: string,
  updatedByName?: string
): Promise<void> {
  const assignment = await getAssignment(assignmentId);
  if (!assignment) throw new Error('Assignment not found');

  const stageIndex = assignment.stages.findIndex((s) => s.id === stageId);
  if (stageIndex === -1) throw new Error('Stage not found');

  const updatedStages = [...assignment.stages];
  updatedStages[stageIndex] = {
    ...updatedStages[stageIndex],
    status,
    remarks: remarks ?? updatedStages[stageIndex].remarks,
    completedAt: status === 'completed' ? new Date().toISOString() : updatedStages[stageIndex].completedAt,
  };

  // Unlock next stage if current completed
  if (status === 'completed' && stageIndex + 1 < updatedStages.length) {
    updatedStages[stageIndex + 1] = { ...updatedStages[stageIndex + 1], status: 'in_progress' };
  }

  const completedCount = updatedStages.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / updatedStages.length) * 100);
  const currentStageIndex = updatedStages.findIndex((s) => s.status === 'in_progress');

  const overallStatus = progressPercent === 100 ? 'completed' : assignment.status;

  await updateDoc(doc(db, ASSIGNMENTS_COL, assignmentId), {
    stages: updatedStages,
    currentStageIndex: currentStageIndex === -1 ? assignment.currentStageIndex : currentStageIndex,
    progressPercent,
    status: overallStatus,
    updatedAt: new Date().toISOString(),
  });

  // Log activity
  if (updatedByUid && updatedByName) {
    await logActivity(assignmentId, updatedByUid, updatedByName,
      `Stage "${updatedStages[stageIndex].name}" marked as ${status}`
    , '');
  }
}

export async function logActivity(
  assignmentId: string,
  userId: string,
  userName: string,
  action: string,
  details: string
): Promise<void> {
  const log: Omit<ActivityLog, 'id'> = {
    assignmentId, userId, userName, action, details,
    createdAt: new Date().toISOString(),
  };
  await addDoc(collection(db, ACTIVITY_COL), log);
}

export async function getActivityLogs(assignmentId: string): Promise<ActivityLog[]> {
  const snap = await getDocs(
    query(
      collection(db, ACTIVITY_COL),
      where('assignmentId', '==', assignmentId),
      orderBy('createdAt', 'desc')
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
}
