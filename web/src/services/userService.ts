import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { UserProfile } from '@/types';

const USERS_COL = 'users';

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, USERS_COL));
  return snap.docs.map((d) => d.data() as UserProfile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS_COL, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), { ...data, updatedAt: new Date().toISOString() });
}
