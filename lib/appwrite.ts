// lib/appwrite.ts
import { Client, Account, Databases } from "react-native-appwrite";

export const APPWRITE_ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID = "6907c6da00126f6c553f";

// ✅ from your screenshot
export const DATABASE_ID = "fhudirectory";

// ⬇️ you'll fill these in after step 2
export const MEMBERS_COLLECTION_ID = "members";
export const EVENTS_COLLECTION_ID = "users";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
