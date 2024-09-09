import postModel from "../models/post.js";

const postCTL = {
    create: async (req, res) => {
        try {

            const { title, content, author, createBy } = req.body;
            const { userID } = req.params;

            const newPost = new postModel({
                title,
                content,
                author,
                createBy: userID
            });
            await newPost.save();

            res.status(201).json(newPost);
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                message: "Failed"
            });
        }
    },

    getPost: async (req, res) => {
        try{
            const post = await postModel.find();
            res.json(post);
        } catch (error) {
            res.status(500).json({
                message: 'Failed'
            });
        }
    },

    getPostById: async (req, res) => {
        try {
            const { postID } = req.params;
            const post = await postModel.findById(postID);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            res.json(post);
          } catch (error) {
            res.status(500).json({ message: 'Failed to fetch post' });
          }
    },

    update: async (req, res) => {
        const { title, content, author } = req.body;
            try {
                const { postID } = req.params;
                const { userID } = req.params;

                const post = await postModel.findById(postID);
                if (!post) {
                    return res.status(404).json({ 
                        message: 'Post not found' 
                    });
                }

                if (post.createBy.toString() !== userID) {
                    return res.status(403).json({ 
                        message: 'Unauthorized access: You can only update posts you created' 
                    });
                }

                const updatedPost = await postModel.findByIdAndUpdate(postID,
                    { title, content, author },
                    { new: true }
                );

                res.json(updatedPost);
                } catch (error) {
                    res.status(500).json({ 
                        message: 'Failed to update post' 
                    });
                }
    },

    delete: async (req, res) => {
        try {
            const { postID } = req.params;
            const { userID } = req.params;

            const post = await postModel.findById(postID);
            if (!post) {
                return res.status(404).json({ 
                    message: 'Post not found' 
                });
            }

            if (post.createBy.toString() !== userID) {
                return res.status(403).json({ 
                    message: 'Unauthorized access: You can only delete posts you created' 
                });
            }

            await postModel.findByIdAndDelete(postID);

            res.json({ 
                message: 'Post deleted successfully' 
            });
          } catch (error) {
            res.status(500).json({ message: 'Failed to delete post' });
          }
    }
}

export default postCTL;