
import { config } from 'dotenv';
config({ path: '.env' });

import { initializeApp, getApps, cert, getApp, type App } from 'firebase-admin/app';
import { getAuth as getAdminAuth, UserRecord } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

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

function initializeAdminApp(): App {
    if (getApps().length > 0) {
        return getApp();
    }
    
    try {
        const serviceAccount = getServiceAccount();
        return initializeApp({
            credential: cert(serviceAccount)
        });
    } catch (error: any) {
        console.error("Firebase Admin initialization failed:", error.message);
        // Re-throw the error to be caught by functions that need the admin app
        throw new Error(`Firebase Admin SDK could not be initialized. Please check your FIREBASE_CREDENTIALS in .env. Original error: ${error.message}`);
    }
}

const adminApp = initializeAdminApp();
const auth = getAdminAuth(adminApp);
const adminDb = getAdminFirestore(adminApp);


export { auth as getAuth, adminDb };

async function verifyAuth() {
  if (!auth) {
    throw new Error("Firebase Admin SDK has not been initialized. Please check your FIREBASE_CREDENTIALS in .env");
  }
}

export async function getAuthenticatedUser(): Promise<UserRecord | null> {
    const session = cookies().get('session')?.value;
    if (!session) {
        return null;
    }

    try {
        await verifyAuth();
        const decodedClaims = await auth.verifySessionCookie(session, true);
        const user = await auth.getUser(decodedClaims.uid);
        return user;
    } catch (error) {
        // This is expected if the cookie is invalid or admin SDK is not initialized.
        // It's not a server error.
        return null;
    }
}


export async function setCookie(idToken: string | null) {
  await verifyAuth();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  if (idToken) {
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
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
    return auth.createUser(properties);
}
