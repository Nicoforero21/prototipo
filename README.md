# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Setting up Firebase Credentials

To connect the application to your Firebase project, you need to provide your service account credentials and your web app's API Key.

### 1. Service Account Credentials (for `FIREBASE_CREDENTIALS`)

This is used for server-side operations (like creating users and sessions).

1.  **Go to the Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  **Select your Project:** Choose the Firebase project you are working on.
3.  **Go to Project Settings:** Click the gear icon (⚙️) next to "Project Overview" in the top-left sidebar, and select "Project settings".
4.  **Go to the "Service Accounts" tab:** In the Project settings page, click on the "Service Accounts" tab.
5.  **Generate a new private key:**
    *   Click the "Generate new private key" button.
    *   A warning will appear; click "Generate key" to confirm.
6.  **Copy the JSON content:** A JSON file will be downloaded to your computer. Open this file with a text editor.
7.  **Update the `.env` file:**
    *   Copy the entire content of the downloaded JSON file.
    *   Paste it as a single line into the `FIREBASE_CREDENTIALS` variable in the `.env` file in the root of this project. Ensure it's enclosed in double quotes.

### 2. Web App API Key (for `NEXT_PUBLIC_FIREBASE_API_KEY`)

This is used for client-side operations (like logging in with email/password).

1.  **Go to the Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  **Select your Project:** Choose the Firebase project you are working on.
3.  **Go to Project Settings:** Click the gear icon (⚙️) next to "Project Overview" in the top-left sidebar, and select "Project settings".
4.  **Go to the "General" tab:** This is usually the default tab.
5.  **Find your Web App:** Scroll down to the "Your apps" section. If you don't have a web app, you'll need to create one by clicking the `</>` icon.
6.  **Copy the API Key:** In your web app's configuration, find the `apiKey` field. Copy this value.
7.  **Update the `.env` file:** Paste the key into the `NEXT_PUBLIC_FIREBASE_API_KEY` variable in your `.env` file.
