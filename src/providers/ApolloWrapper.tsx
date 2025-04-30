"use client";

import { ApolloProvider as Provider } from "@apollo/client";
import createApolloClient from "@/lib/apollo-client";

export function ApolloProvider({ children }: any) {
  const client = createApolloClient();
  return <Provider client={client}>{children}</Provider>;
}
