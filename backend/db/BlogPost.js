import mongoose from 'mongoose';

// Define the schema for the Blog Post collection
const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String, // Assuming image will be stored as a URL
        required: true
    },
    user_name: {
        type: String, // Assuming image will be stored as a URL
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User collection
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Create the model for the Blog Post collection
const BlogPost = mongoose.model('blogPost', blogPostSchema, "blogPost");

export default BlogPost;
