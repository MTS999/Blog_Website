import express, { response } from "express"
// import express from "express";
import jwt from "jsonwebtoken"

import mongoose from "mongoose";
import cors from "cors"
import Users from "./db/Users.js";
import BlogPost from "./db/BlogPost.js"
import CommentPost from "./db/Comments.js"
import("./db/config.js")


const ObjectId = mongoose.Types.ObjectId; // Import ObjectId from mongoose
const secretKey = 'mts999';



const app = express()
app.use(express.json());

app.use(cors())

const verifyToken = (request, response, next) => {
    // Extract JWT token from the request header
    const authHeader = request.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({ message: "Unauthorized - JWT token missing" });
    }

    // Extract token from the Authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, secretKey);
        // Store decoded payload in request object for further use
        request.user = decoded;
        // console.log(request.user);

        // Proceed to next middleware or route handler
        next();
    } catch (error) {
        // If verification fails, respond with an error message
        response.status(401).json({ message: "Unauthorized   - Invalid JWT token" });
    }
};
app.post("/signup", async (request, response) => {
    let user = new Users(request.body)
    let result = await user.save()
    response.send(result)

})
app.post("/login", async (request, response) => {

    if (request.body.email && request.body.password) {

        let result = await Users.findOne(request.body)
        if (result) {

            // response.send(result)
            //   console.log(result);
            const userPayload = {
                id: result.id,
                user_name: result.user_name,
                e_mail: result.email,
                role: result.role
            }
            const token = jwt.sign(userPayload, secretKey, { expiresIn: '12h' });
            response.status(200).json({ token, userId: result.id }); // Sending token in JSON format

        }
        else {
            response.status(404).json({ message: "User not found" }); // Send error message as JSON

        }
    }
    else {
        response.status(400).json({ message: "invalid request" })
    }
})
app.get("/getalluserdata", verifyToken, async (request, response) => {
    try {

        const role = request.user.role
        if (role !== "admin") {
            return response.status(403).json({ message: "Unauthorized - You do not have permission to access this resource" })
        }

        const users = await Users.find();

        // Send the user data in the response
        response.json(users);
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        response.status(500).json({ message: "Internal server error" });
    }

})

app.get("/userdata", verifyToken, async (request, response) => {
    try {
        const userId = request.user.id
        const userData = await Users.findOne({ _id: userId })

        if (!userData) {
            return response.status(404).json({ message: "User data not found" })
        }

        return response.json(userData)
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        response.status(500).json({ message: "Internal server error" });
    }
})
app.post("/addblog", verifyToken, async (request, response) => {
    try {
        // Extract user role and author ID from the token payload
        const { role, id: authorId } = request.user;

        const user_name = request.user.user_name
        console.log(user_name);


        if (role !== "author") {
            return response.status(403).json({ message: "Unauthorized - You do not have permission to perform this action" });
        }

        // Create a new blog post instance with the request body
        const blog = new BlogPost({
            ...request.body,
            authorId, user_name // Assign the author ID from the token to the blog post
        });
        // console.log("blog", blog);
        // Save the new blog post to the database
        const result = await blog.save();
        console.log(result);
        // Send the newly created blog post as the response
        response.json(result);
    } catch (error) {
        console.error("Error adding new blog post:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});

app.get("/blogs", verifyToken, async (request, response) => {
    try {
        let query = {};
        console.log("mts");
        // Check if category query parameter is present
        if (request.query.category) {
            query.category = request.query.category;
        }
        if (request.query.blog === "myblog") {
            const id = request.user.id

            // Add author ID to the query
            query.authorId = id;
        }
        if (request.query.blog === "reading-list") {
            const userId = request.user.id;

            // Find the current user
            const currentUser = await Users.findById(userId);

            if (!currentUser) {
                return response.status(404).json({ message: "User not found" });
            }

            // Retrieve the reading list of the current user
            const readingList = currentUser.reading_list;

            // Query all blog posts in the reading list
            const readingListBlogs = await BlogPost.find({ _id: { $in: readingList } });

            // Return the blogs from the reading list
            return response.send(readingListBlogs);
        }

        if (request.query.feed === "following") {
            const userId = request.user.id;

            // Find the current user's information
            const currentUser = await Users.findById(userId);

            if (!currentUser) {
                return response.status(404).json({ message: "User not found" });
            }

            // Retrieve the list of users that the current user is following
            const followingUsers = currentUser.following;

            // Query all blog posts from the following users
            const followingBlogs = await BlogPost.find({ authorId: { $in: followingUsers } });

            // Return the blogs from following users
            return response.send(followingBlogs)
        }

        // Find blog posts based on the query
        let result = await BlogPost.find(query);

        if (result.length > 0) {
            response.send(result);
        } else {
            response.send("No blogs found");
        }
    } catch (error) {
        console.error('Error fetching Blogs:', error);
        response.status(500).send("Internal Server Error");
    }
})


// Assuming you have already defined your Express app and imported necessary modules

// Endpoint to get all blogs from following users
app.get("/following-blogs", verifyToken, async (request, response) => {
    try {
        console.log("MTS");
        // Get the current user's ID from the request
        const userId = request.user.id;

        // Find the current user's information
        const currentUser = await Users.findById(userId);

        if (!currentUser) {
            return response.status(404).json({ message: "User not found" });
        }

        // Retrieve the list of users that the current user is following
        const followingUsers = currentUser.following;

        // Query all blog posts from the following users
        const followingBlogs = await BlogPost.find({ authorId: { $in: followingUsers } });

        // Return the blogs from following users
        response.json(followingBlogs);
    } catch (error) {
        console.error("Error fetching following blogs:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});

app.get("/recent-blogs", verifyToken, async (request, response) => {
    try {
        // Directly find and return the 5 most recent blog posts
        let result = await BlogPost.find({})
            .sort({ createdAt: -1 }) // Ensure sorting by createdAt in descending order
            .limit(5); // Limit the results to 5

        // Send results or a no content message
        if (result.length > 0) {
            response.send(result);
        } else {
            response.send("No recent blogs found");
        }
    } catch (error) {
        console.error('Error fetching recent blogs:', error);
        response.status(500).send("Internal Server Error");
    }
});

app.post("/search", async (request, response) => {
    try {
        const searchData = request.body;
        console.log("mtsss", request.body);
        let query


        if (searchData.title) {

            query = {
                title: { $regex: searchData.title, $options: 'i' } // Constructing a regex to match the search term in the `content` field
            };
        }

        else if (searchData.user_name) {
            query = {
                user_name: { $regex: searchData.user_name, $options: 'i' }
            }
        }
        console.log(query);
        const blogs = await BlogPost.find(query);
        // console.log(blogs);
        response.json(blogs); // Send the found blogs as JSON response
    } catch (error) {
        console.error('Error fetching recent blogs:', error);
        response.status(500).send("Internal Server Error");
    }
});


app.post("/like/:postId", verifyToken, async (request, response) => {
    try {
        const postId = request.params.postId
        const userId = request.user.id

        const blogPost = await BlogPost.findById(postId)
        if (!blogPost) {
            return response.status(404).json({ message: "Blog Post not found" })
        }


        const likedIndex = blogPost.likes.indexOf(userId);
        const dislikedIndex = blogPost.dislikes.indexOf(userId)

        if (likedIndex !== -1) {
            blogPost.likes.splice(likedIndex, 1)
        }
        else {

            if (dislikedIndex !== -1) {
                blogPost.dislikes.splice(dislikedIndex, 1)
            }

            blogPost.likes.push(userId)
        }

        await blogPost.save()

        // Fetch the updated blog post after saving changes
        const updatedBlogPost = await BlogPost.findById(postId);

        response.status(200).json({ message: "Post updated successfully", blogPost: updatedBlogPost });
    }
    catch (error) {
        console.error("Error liking blog post:", error);
        response.status(500).json({ message: "Internal server error" });
    }
})

app.post("/dislike/:postId", verifyToken, async (request, response) => {
    try {
        const postId = request.params.postId
        const userId = request.user.id

        const blogPost = await BlogPost.findById(postId)

        if (!blogPost) {
            return response.status(404).json({ messege: "Blog post is not found" })
        }
        const dislikedIndex = blogPost.dislikes.indexOf(userId)
        const likedIndex = blogPost.likes.indexOf(userId)

        if (dislikedIndex !== -1) {
            blogPost.dislikes.splice(dislikedIndex, 1)
        }

        else {
            if (likedIndex !== -1) {
                blogPost.likes.splice(likedIndex, 1)

            }

            blogPost.dislikes.push(userId)
        }

        await blogPost.save()
        const updatedBlogPost = await BlogPost.findById(postId);

        response.status(200).json({ message: "Post updated successfully", blogPost: updatedBlogPost });
        // response.status(200).json({ message: "Post updated successfully" });


    }

    catch (error) {
        console.error("Error liking blog post:", error);
        response.status(500).json({ message: "Internal server error" });
    }
})
app.get("/user-role", verifyToken, async (request, response) => {
    try {
        const role = request.user.role

        response.send(role)

    }

    catch (error) {
        response.send(error)
    }

})
app.get("/blog/:id", verifyToken, async (request, response) => {
    let result = await BlogPost.findOne({ _id: request.params.id })
    if (result) {

        response.send(result)
    }
    else {
        response.send("NO products found")

    }
})


app.put("/update/:id", verifyToken, async (request, response) => {
    try {

        const userRole = request.user.role
        const userId = request.user.id

        const blogPostId = request.params.id

        const blogPost = await BlogPost.findById(blogPostId)


        if (userRole === "author" && blogPost.authorId.toString() === userId) {
            const updatedBlogPost = await BlogPost.findByIdAndUpdate(
                blogPostId,
                { $set: request.body },
                { new: true } // Return the updated document
            );
            response.json(updatedBlogPost);
        } else {
            // User is not authorized to update the blog post
            response.status(403).json({ message: "You are not authorized to update this blog post." });
        }
    } catch (error) {
        // Handle errors
        console.error("Error updating blog post:", error);
        response.status(500).json({ message: "Internal server error" });
    }
})


app.delete("/delete/:id", async (request, response) => {
    let result = await BlogPost.deleteOne({ _id: request.params.id })

    response.send(result)
})
//// add coment
app.post("/comment/:id", verifyToken, async (request, response) => {
    try {
        const postId = request.params.id;
        const authorId = request.user.id
        const author = request.user.user_name
        const content = request.body.content


        const newComment = new CommentPost({
            content,
            authorId,
            postId,
            author
        });

        // Save the new comment to the database
        await newComment.save();

        response.status(201).json(newComment); // Respond with the created comment
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});
app.get('/comments/:postId', verifyToken, async (req, res) => {
    try {
        const postId = req.params.postId;
        // Assuming CommentPost.find() is the method to find comments by postId
        const comments = await CommentPost.find({ postId: postId });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete(`/comment/:commentId`, verifyToken, async (request, response) => {
    try {

        const commentId = request.params.commentId

        const comments = await CommentPost.deleteOne({ _id: commentId });
        response.send(comments)
    }

    catch (error) {
        response.status(500).json({ message: error.message });

    }

})
app.put(`/commentedit/:commentId`, verifyToken, async (request, response) => {
    try {

        const commentId = request.params.commentId
        const content = request.body.content

        const comments = await CommentPost.updateOne({ _id: commentId });
        response.send(comments)
    }

    catch (error) {
        response.status(500).json({ message: error.message });

    }

})

app.post("/follow/:id", verifyToken, async (request, response) => {

    try {
        const userId = request.user.id
        const follwId = request.params.id

        const userData = await Users.findById(userId)

        if (!userData) {
            return response.status(404).json({ messege: "user not found" })
        }
        const blogIdIndex = userData.following.indexOf(follwId)

        if (blogIdIndex !== -1) {
            userData.following.splice(blogIdIndex, 1)
        }
        else {
            userData.following.push(follwId)
        }
        await userData.save()
        const updatedUserData = await Users.findById(userId)
        response.status(200).json({ mesege: "updated succesfully", userData: updatedUserData })


    }

    catch (error) {
        console.error(error);
        response.status(500).json({ message: "Internal server error" });

    }
})

app.post("/reading-list/:id", verifyToken, async (request, response) => {

    try {
        const userId = request.user.id
        const postId = request.params.id

        const userData = await Users.findById(userId)

        if (!userData) {
            return response.status(404).json({ messege: "user not found" })
        }
        const blogIdIndex = userData.reading_list.indexOf(postId)

        if (blogIdIndex !== -1) {
            userData.reading_list.splice(blogIdIndex, 1)
        }
        else {
            userData.reading_list.push(postId)
        }
        await userData.save()
        const updatedUserData = await Users.findById(userId)
        response.status(200).json({ mesege: "updated succesfully", userData: updatedUserData })


    }

    catch (error) {
        console.error(error);
        response.status(500).json({ message: "Internal server error" });

    }
})





app.listen(5003)