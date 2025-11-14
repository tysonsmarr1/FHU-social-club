// lib/appwrite.ts
import { Client, Account, Databases, Avatars } from "react-native-appwrite";

export const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"; // change if self-hosted
export const APPWRITE_PROJECT_ID = "6907c6da00126f6c553f";

// TODO: replace these with your real IDs from Appwrite
export const DATABASE_ID = "fhu-social-club-db";
export const MEMBERS_COLLECTION_ID = "members";
export const EVENTS_COLLECTION_ID = "events";
export const CLUBS_COLLECTION_ID = "clubs";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export { client };
