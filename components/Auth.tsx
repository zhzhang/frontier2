import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { uiConfig, auth } from "../lib/firebase";

export const Auth = () => (
  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
);
