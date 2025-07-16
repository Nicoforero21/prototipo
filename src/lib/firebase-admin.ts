import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, UserRecord } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Initialize Firebase
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
      secure: true,
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
    const signInEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
    
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

export async function createUser(properties: { email: string, password?: string, displayName?: string }) {
    return auth.createUser(properties);
}


export async function signOut(authInstance: any) {
    // There is no server-side signOut. The client just needs to clear the cookie.
    // This function is kept for consistency with client-side SDK.
    // The actual sign-out logic is in logoutAction which clears the cookie.
    return Promise.resolve();
}
