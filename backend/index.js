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
            console.log(id);

            // Add author ID to the query
            query.authorId = id;
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

/////
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

    catch(error){
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

    catch(error){
        response.status(500).json({ message: error.message });

    }
    
})



app.listen(5003)