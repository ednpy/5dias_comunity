import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const search = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { username: { $regex: query, $options: "i" } },
            ],
        }).select("name username profilePicture headline rank");

        const posts = await Post.find({
            content: { $regex: query, $options: "i" },
        }).populate("author", "name username profilePicture headline rank");

        res.json({ users, posts });
    } catch (error) {
        console.error("Error in search controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};