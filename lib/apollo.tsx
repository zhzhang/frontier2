import Spinner from "@/components/FixedSpinner";
import { auth, useAuth } from "@/lib/firebase";
import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/react-hooks";
import DebounceLink from "apollo-link-debounce";
import jwtDecode from "jwt-decode";
import React from "react";

export let apolloClient = null;

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 */
export function withApollo(PageComponent: React.FC, typePolicies = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    if (typeof window === "undefined") {
      return <Spinner animation="border" role="status" />;
    }
    const { user, loading } = useAuth();
    if (loading) {
      return <Spinner animation="border" role="status" />;
    }
    const client = apolloClient || initApolloClient(apolloState, typePolicies);
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
function initApolloClient(initialState, typePolicies) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === "undefined") {
    return createApolloClient(initialState, typePolicies);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState, typePolicies);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
function createApolloClient(initialState = {}, typePolicies = {}) {
  const cache = new InMemoryCache({
    typePolicies,
  }).restore(initialState);
  const authLink = setContext(async (_, { headers }) => {
    const user = auth().currentUser;
    if (!user) {
      return {
        headers: {
          ...headers,
          authorization: "",
        },
      };
    }
    let token;
    token = await auth().currentUser.getIdToken();
    let decoded = jwtDecode(token);
    while (!decoded.name) {
      // Force refetch token to include the name.
      token = await auth().currentUser.getIdToken(true);
      decoded = jwtDecode(token);
    }
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });

  return new ApolloClient({
    link: from([
      new DebounceLink(1000),
      authLink,
      new HttpLink({ uri: "/api" }),
    ]),
    cache,
  });
}
