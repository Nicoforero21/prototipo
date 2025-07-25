
import { config } from 'dotenv';
config({ path: '.env' });

import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, UserRecord } from 'firebase-admin/auth';
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

// Initialize Firebase
const serviceAccount = getServiceAccount();

const app = !getApps().length ? initializeApp({
    credential: cert(serviceAccount)
}) : getApp();

const auth = getAdminAuth(app);

export { auth as getAuth };

export async function getAuthenticatedUser(): Promise<UserRecord | null> {
    const session = cookies().get('session')?.value;
    if (!session) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(session, true);
        const user = await auth.getUser(decodedClaims.uid);
        return user;
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        // Clear the invalid cookie
        cookies().delete('session');
        return null;
    }
}


export async function setCookie(idToken: string | null) {
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

export async function signInWithEmail(email:string, password:string):Promise<{idToken: string}>{
    // This is a workaround to sign in with email and password on the server.
    // Firebase Admin SDK does not have a direct signInWithEmailAndPassword method.
    // We use the client SDK REST API for this.
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_FIREBASE_WEB_API_KEY') {
      throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is not set.');
    }
    const signInEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    
    const res = await fetch(signInEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    if (!res.ok) {
        const error = await res.json();
        // Use a generic error code to avoid leaking implementation details.
        // You can log the specific `error.error.message` on the server for debugging.
        console.error('Firebase sign-in error:', error.error.message);
        throw new Error('auth/invalid-credential');
    }
    
    const data = await res.json();
    return { idToken: data.idToken };
}

export async function createAdminAuthUser(properties: { email: string, password?: string, displayName?: string }): Promise<UserRecord> {
    return auth.createUser(properties);
}


export async function signOut() {
    // There is no server-side signOut. The client just needs to clear the cookie.
    // This function is kept for consistency with client-side SDK.
    // The actual sign-out logic is in logoutAction which clears the cookie.
    return Promise.resolve();
}
