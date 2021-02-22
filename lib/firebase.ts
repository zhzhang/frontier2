import firebase from "firebase";
import { UploadTypeEnum } from "./types";
import { v4 as uuid } from "uuid";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

import { useState, useEffect } from "react";

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
