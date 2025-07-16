import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, DocumentData } from 'firebase/firestore';
import type { User } from '@/types';

// Note: For a real application, you would hash the password before saving.
// For simplicity, we are storing it as plain text here.
export async function createUser(user: Omit<User, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "users"), user);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error('Could not create user');
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
}
