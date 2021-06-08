const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolver = require("./comments");

module.exports = {
	Post: {
		likeCount(parent) {
			return parent.likes.length;
		},
		commentCount(parent) {
			return parent.comments.length;
		},
	},
	Query: {
		...postsResolvers.Query,
	},
	Mutation: {
		...usersResolvers.Mutation,
		...postsResolvers.Mutation,
		...commentsResolver.Mutation,
	},
	Subscription: {
		...postsResolvers.Subscription,
	},
};
