import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

import { useState, useEffect } from "react";

var loading = true;

function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      loading = false;
      if (user != null) {
        setUser(user);
      }
    });
  });

  return { user: user, loading: loading };
}

export default useAuth;
