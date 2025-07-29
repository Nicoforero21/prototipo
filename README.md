# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Setting up Firebase Credentials

To connect the application to your Firebase project, you need to provide your service account credentials and your web app's configuration.

**IMPORTANT:** The application will not function correctly until you have configured these environment variables in the `.env` file.

### 1. Service Account Credentials (for Server-Side SDK)

This is used for server-side operations (like creating users). The variable for this is `FIREBASE_CREDENTIALS`.

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
    *   Paste it as a single line into the `FIREBASE_CREDENTIALS` variable in the `.env` file. Ensure it's enclosed in double quotes.

### 2. Web App Configuration (for Client-Side SDK)

This is used for client-side operations (like logging in). These variables all start with `NEXT_PUBLIC_`.

1.  **Go to the Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  **Select your Project:** Choose the Firebase project you are working on.
3.  **Go to Project Settings:** Click the gear icon (⚙️) next to "Project Overview" in the top-left sidebar, and select "Project settings".
4.  **Go to the "General" tab:** This is usually the default tab.
5.  **Find your Web App:** Scroll down to the "Your apps" section. If you don't have a web app, you'll need to create one by clicking the `</>` icon.
6.  **Find the Firebase SDK snippet:** In your web app's configuration, look for the "Firebase SDK snippet" section and select the "Config" option.
7.  **Copy the configuration values:** You will see a block of code like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "12345...",
      appId: "1:12345...:web:abcd..."
    };
    ```
8.  **Update the `.env` file:** Copy each value from the `firebaseConfig` object and paste it into the corresponding `NEXT_PUBLIC_` variable in your `.env` file.

### 3. Gemini API Key (for `GEMINI_API_KEY`)

This is used for the AI features of the application, like plant detection.

1.  **Go to Google AI Studio:** Visit [https://aistudio.google.com/](https://aistudio.google.com/).
2.  **Get API Key:** Click on the "Get API key" button in the top left corner.
3.  **Create API Key:** In the menu that opens, click "Create API key in new project". A new key will be generated for you.
4.  **Copy the API Key:** Copy the generated key.
5.  **Update the `.env` file:** Paste the key into the `GEMINI_API_KEY` variable in your `.env` file.
