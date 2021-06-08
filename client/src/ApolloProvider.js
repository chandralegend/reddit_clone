import React from "react";
import App from "./App";
import {
	createHttpLink,
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
} from "@apollo/client";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
	uri: "http://localhost:3002",
});

const authLink = setContext(() => {
	const token = localStorage.getItem("jwtToken");
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
