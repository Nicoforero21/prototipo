
import { config } from 'dotenv';
config({ path: '.env' });

import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, UserRecord } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { getAuth, signInWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { app as clientApp } from '@/lib/firebase';

// This function parses the FIREBASE_CREDENTIALS environment variable
// and returns a service account object. It throws an error if the
// environment variable is not set or is invalid.
function getServiceAccount() {
  const credentialsJson = process.env.FIREBASE_CREDENTIALS;
  if (!credentialsJson || credentialsJson === 'YOUR_FIREBASE_CREDENTIALS_JSON_AS_SINGLE_LINE') {
    throw new Error(
      'The FIREBASE_CREDENTIALS environment variable is not set. ' +
      'Please follow the instructions in the README.md file to set it up.'
    );
  }
  try {
    const serviceAccount = JSON.parse(credentialsJson);
    // The private key needs to have newlines restored.
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    return serviceAccount;
  } catch (error) {
    console.error('Failed to parse FIREBASE_CREDENTIALS:', error);
    throw new Error(
      'Failed to parse FIREBASE_CREDENTIALS. ' +
      'Make sure it is a valid, single-line JSON string.'
    );
  }
}

// Initialize Firebase Admin only if it hasn't been initialized yet.
let adminApp;
try {
  const serviceAccount = getServiceAccount();
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    adminApp = getApp();
  }
} catch (error: any) {
  console.error("Firebase Admin initialization failed:", error.message);
  // We don't re-throw the error here, so the app can start.
  // Functions that depend on adminApp will handle the uninitialized state.
  adminApp = null;
}


const auth = adminApp ? getAdminAuth(adminApp) : null;

export { auth as getAuth };

async function verifyAuth() {
  if (!auth) {
    throw new Error("Firebase Admin SDK has not been initialized. Please check your FIREBASE_CREDENTIALS in .env");
  }
}

export async function getAuthenticatedUser(): Promise<UserRecord | null> {
    await verifyAuth();
    const session = cookies().get('session')?.value;
    if (!session) {
        return null;
    }

    try {
        const decodedClaims = await auth!.verifySessionCookie(session, true);
        const user = await auth!.getUser(decodedClaims.uid);
        return user;
    } catch (error) {
        // This is expected if the cookie is invalid.
        // It's not a server error.
        return null;
    }
}


export async function setCookie(idToken: string | null) {
  await verifyAuth();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  if (idToken) {
    const sessionCookie = await auth!.createSessionCookie(idToken, { expiresIn });
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  } else {
    cookies().delete('session');
  }
}

// These are wrappers around firebase-admin functions to be used in server actions
// This is to avoid directly exposing firebase-admin in client components.

export async function createAdminAuthUser(properties: { email: string, password?: string, displayName?: string }): Promise<UserRecord> {
    await verifyAuth();
    return auth!.createUser(properties);
}
