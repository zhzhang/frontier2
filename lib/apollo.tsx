import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import useAuth from "../lib/firebase";
import firebase from "firebase";

let apolloClient = null;

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 */
export function withApollo(PageComponent: React.Component) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    if (typeof window === "undefined") {
      return <div>Loading ...</div>;
    }
    const { user, loading } = useAuth();
    if (loading) {
      return <div>Loading auth ...</div>;
    }
    const client = apolloClient || initApolloClient(apolloState);
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
function initApolloClient(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === "undefined") {
    return createApolloClient(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
function createApolloClient(initialState = {}) {
  const cache = new InMemoryCache().restore(initialState);
  const authLink = setContext(async (_, { headers }) => {
    const user = firebase.auth().currentUser;
    const token =
      user == null ? "" : await firebase.auth().currentUser.getIdToken();
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink
      .concat(createIsomorphLink())
      .concat(createUploadLink({ uri: "http://localhost:3000/api" })),
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
