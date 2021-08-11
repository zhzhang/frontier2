import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { UploadTypeEnum } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      setLoading(false);
      if (user != null) {
        setUser(user);
      }
    });
  });

  return { user: user, loading: loading };
}

export function uploadFile(file, type: UploadTypeEnum) {
  const storageRef = firebase.storage().ref();
  var refPath = "";
  switch (type) {
    case UploadTypeEnum.ARTICLE:
      refPath = `articles/${uuid()}.pdf`;
      break;
    case UploadTypeEnum.LOGO:
      refPath = `logos/${uuid()}`;
      break;
  }
  const ref = storageRef.child(refPath);
  const uploadTask = ref.put(file);
  return { uploadTask, refPath };
}

export function useRef(ref) {
  const storage = firebase.storage();
  const pathRef = storage.ref(ref);
  const [url, setURL] = useState();
  pathRef.getDownloadURL().then((url) => setURL(url));
  return url;
}

export async function signOut() {
  await firebase.auth().signOut();
}

export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

export function auth() {
  return firebase.auth();
}
