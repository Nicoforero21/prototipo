import { adminDb } from './firebase-admin';
import type { User } from '@/types';
import { getDoc, doc as clientDoc } from 'firebase/firestore';
import { db } from './firebase';

const usersCollection = adminDb.collection('users');

// Creates a user document in Firestore using the Admin SDK.
// The user ID should be the same as the Firebase Auth UID.
export async function createUser(uid: string, data: Omit<User, 'id' | 'password'>): Promise<void> {
  try {
    const userRef = usersCollection.doc(uid);
    await userRef.set({
      ...data,
      trackedCrops: data.trackedCrops || []
    });
  } catch (e) {
    console.error("Error adding document with Admin SDK: ", e);
    throw new Error('Could not create user in Firestore');
  }
}

// This function can be called from the server-side to get user data.
export async function getUserByUid(uid: string): Promise<User | null> {
    const userRef = usersCollection.doc(uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
        return { id: userSnap.id, ...userSnap.data() } as User;
    } else {
        console.log("No such user!");
        return null;
    }
}

// This function can be called from the server-side to add a crop.
export async function addCropToUser(uid: string, cropSlug: string): Promise<void> {
  const userRef = usersCollection.doc(uid);
  try {
    // Atomically add a new region to the "regions" array field.
    const { FieldValue } = await import('firebase-admin/firestore');
    await userRef.update({
      trackedCrops: FieldValue.arrayUnion(cropSlug)
    });
  } catch (e) {
    console.error("Error adding crop to user with Admin SDK: ", e);
    throw new Error('Could not add crop to user');
  }
}

// This function uses the CLIENT SDK and should be used on client components
// or in contexts where the admin SDK is not available/necessary.
export async function hasUserCrop(uid: string, cropSlug: string): Promise<boolean> {
  // Note: This uses the client 'db' instance.
  const userRef = clientDoc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
      const user = userSnap.data() as User;
      return user.trackedCrops?.includes(cropSlug) ?? false;
  }
  return false;
}
