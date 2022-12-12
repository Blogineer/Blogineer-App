import { ApolloClient, InMemoryCache } from "@apollo/client";

const gClient = new ApolloClient({
    uri: "http://localhost:8000/graphql",
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      }
});

export default gClient;