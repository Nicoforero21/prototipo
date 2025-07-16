# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Setting up Firebase Credentials

To connect the application to your Firebase project, you need to provide your service account credentials.

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
