import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@material-ui/core/Button";

const LoginButton = () => {
  const {
    loginWithRedirect,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();
  if (isLoading) {
    return null;
  }
  if (!isAuthenticated) {
    return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
  }
  return null;
};

export default LoginButton;
