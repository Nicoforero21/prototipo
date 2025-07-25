import { db } from './firebase';
import { collection, doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import type { User } from '@/types';

// Creates a user document in Firestore.
// The user ID should be the same as the Firebase Auth UID.
export async function createUser(uid: string, data: Omit<User, 'id' | 'password'>): Promise<void> {
  try {
    // Use the user's UID from Firebase Auth as the document ID
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...data,
      trackedCrops: data.trackedCrops || []
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error('Could not create user in Firestore');
  }
}

export async function getUserByUid(uid: string): Promise<User | null> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as User;
    } else {
        console.log("No such user!");
        return null;
    }
}

export async function addCropToUser(uid: string, cropSlug: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  try {
    await updateDoc(userRef, {
      trackedCrops: arrayUnion(cropSlug)
    });
  } catch (e) {
    console.error("Error adding crop to user: ", e);
    throw new Error('Could not add crop to user');
  }
}


export async function hasUserCrop(uid: string, cropSlug: string): Promise<boolean> {
  const user = await getUserByUid(uid);
  if (!user || !user.trackedCrops) {
    return false;
  }
  return user.trackedCrops.includes(cropSlug);
}
