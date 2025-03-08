import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import awsExports from "@/aws-exports";
import graphqlConfig from "./config";

Amplify.configure(awsExports);

const httpLink = createHttpLink({
  uri: graphqlConfig.uri,
});

const authLink = setContext(async (_, { headers }) => {
  let token = "";
  try {
    const { tokens } = await fetchAuthSession();
    token = tokens?.idToken?.toString() || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting auth session", error);
    if (error.message?.includes("not authenticated")) {
      console.log("User not signed in");
    }
  }

  return {
    headers: {
      ...headers,
      Authorization: token ? token : "",
      // Uncomment if using API key authentication as fallback
      // 'x-api-key': awsExports.aws_appsync_apiKey,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
