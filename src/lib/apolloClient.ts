import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import awsExports from "@/aws-exports";
import graphqlConfig from "./config";

// Configure Amplify
Amplify.configure(awsExports);

// Create an HTTP link to your AppSync GraphQL endpoint
const httpLink = createHttpLink({
  uri: graphqlConfig.uri,
});

// Create an auth link that sets the Authorization header with the JWT token
const authLink = setContext(async (_, { headers }) => {
  let token = "";
  try {
    // Use the new fetchAuthSession API
    const { tokens } = await fetchAuthSession();
    token = tokens?.idToken?.toString() || "";
    console.log("JWT token obtained"); // Avoid logging full token in production
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting auth session", error);
    // Handle not authenticated case
    if (error.message?.includes("not authenticated")) {
      console.log("User not signed in");
    }
  }

  return {
    headers: {
      ...headers,
      // For AppSync, just use the token without Bearer prefix
      Authorization: token ? token : "",
      // Uncomment if using API key authentication as fallback
      // 'x-api-key': awsExports.aws_appsync_apiKey,
    },
  };
});

// Create and export the Apollo Client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
