import admin from "firebase-admin";
import { env } from "./env.ts";

const serviceAccount = JSON.parse(
  env.FIREBASE_CREDENTIALS,
) as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
