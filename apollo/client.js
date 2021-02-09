import React from "react";
import Head from "next/head";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { Auth0Provider } from "@auth0/auth0-react";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "@apollo/client/link/context";
import { useAuth0 } from "@auth0/auth0-react";

let apolloClient = null;

export function withAuthenticatedApollo(PageComponent) {
  const WithAuthenticatedApollo = ({ ...props }) => {
    const ApolloWrapped = withApollo(PageComponent);
    return (
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
        redirectUri={process.env.NEXT_PUBLIC_REDIRECT_URL}
        useRefreshTokens={true}
        cacheLocation={"localstorage"}
      >
        <ApolloWrapped {...props}></ApolloWrapped>
      </Auth0Provider>
    );
  };
  return WithAuthenticatedApollo;
}

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 */
export function withApollo(PageComponent) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const auth = useAuth0();
    if (typeof window === "undefined") {
      return <div>Loading ...</div>;
    }
    if (auth.isLoading) {
      return <div>Loading ...</div>;
    }
    console.log(auth);
    const client = apolloClient || initApolloClient(apolloState, auth);
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";

    if (displayName === "App") {
      console.warn("This withApollo HOC only works with PageComponents.");
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  return WithApollo;
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
function initApolloClient(initialState, auth) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === "undefined") {
    return createApolloClient(initialState, auth);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState, auth);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
function createApolloClient(initialState = {}, auth) {
  const cache = new InMemoryCache().restore(initialState);
  const authLink = setContext(async (_, { headers }) => {
    if (!auth.isAuthenticated) {
      return headers;
    }
    // get the authentication token from local storage if it exists
    const token = await auth.getAccessTokenSilently();
    console.log(token);
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(createIsomorphLink()),
    cache,
  });
}

function createIsomorphLink() {
  const { HttpLink } = require("apollo-link-http");
  return new HttpLink({
    uri: "http://localhost:3000/api",
    credentials: "same-origin",
  });
}
