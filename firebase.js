import admin from "firebase-admin";
// import serviceAccount from "./firebase-service-account.json" assert { type: "json" };

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
