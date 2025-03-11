const graphqlConfig = {
  uri: process.env.NEXT_PUBLIC_APPSYNC_URL,
  region: "us-east-1",
  defaultAuthMode: "userPool",
};

export default graphqlConfig;
