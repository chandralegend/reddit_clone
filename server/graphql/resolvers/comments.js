const { UserInputError, AuthenticationError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");

module.exports = {
	Mutation: {
		async createComment(_, { postId, body }, context) {
			const { username } = checkAuth(context);
			if (body.trim() === "") {
				throw new UserInputError("Empty Comment", {
					errors: {
						body: "Body must not be Empty",
					},
				});
			}
			const post = await Post.findById(postId);
			if (post) {
				post.comments.unshift({
					body,
					username,
					createdAt: new Date().toISOString(),
				});
				await post.save();
				return post;
			} else {
				throw new UserInputError("Post not Found");
			}
		},
		async deleteComment(_, { postId, commentId }, context) {
			const { username } = checkAuth(context);
			const post = await Post.findById(postId);
			if (post) {
				const commentIndex = post.comments.findIndex(
					(comment) => comment.id === commentId
				);
				if (post.comments[commentIndex].username === username) {
					post.comments.splice(commentIndex, 1);
					await post.save();
					return post;
				} else {
					throw new AuthenticationError("Action not allowed");
				}
			} else {
				throw new UserInputError("Post not found");
			}
		},
	},
};
