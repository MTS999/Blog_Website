import express, { response } from "express"
// import express from "express";
import jwt from "jsonwebtoken"

import mongoose from "mongoose";
import cors from "cors"
import Users from "./db/Users.js";
import BlogPost from "./db/BlogPost.js"
import CommentPost from "./db/Comments.js"
import User from "./db/Users.js";
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
    try {


        let Existusername = await Users.findOne({ user_name: request.body.user_name })
        if (Existusername) {
            return response.status(400).json({ error: "Username  already exists" })
        }
        let Existemail = await Users.findOne({ email: request.body.email })
        if (Existemail) {
            return response.status(400).json({ error: "Email  already exists" })
        }

        let user = new Users(request.body)

        let result = await user.save()
        response.send(result)
    }
    catch (error) {
        response.send(error)
    }

})

app.put("/update-user/:id", verifyToken, async (request, response) => {
    try {
        const userId = request.params.id;


        const updatedUser = await Users.findByIdAndUpdate(userId, request.body, { new: true });

        // Check if user is found and updated successfully
        if (!updatedUser) {
            return response.status(404).json({ message: "User not found" });
        }

        // Send the updated user data in the response
        response.json(updatedUser);
    } catch (error) {
        // Handle errors
        console.error("Error updating user:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});


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
            response.status(404).json({ message: "invalid email or password" }); // Send error message as JSON

        }
    }
    else {
        response.status(400).json({ message: "invalid request" })
    }
})

app.get("/getalluserdata",  async (request, response) => {
    try {
        const page = parseInt(request.query.page);
        const limit = parseInt(request.query.limit);

        // const role = request.user.role;
        // if (role !== "admin") {
        //     return response.status(403).json({ message: "Unauthorized - You do not have permission to access this resource" })
        // }

        // Count total number of users
        const totalCount = await Users.countDocuments();

        // Calculate the number of documents to skip based on the page number and limit
        const skip = (page) * limit;

        // Fetch paginated user data
        const users = await Users.find().skip(skip).limit(limit);

        // Send the user data and total count in the response
        response.json({ totalCount, users });
    } catch (error) {
        console.error("Error fetching user data:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});

// app.get("/pending-request", verifyToken, async (request, response) => {

//     try {
//         const role = request.user.role
//         if (role !== "admin") {
//             return response.status(403).json({ message: "Unauthorized - You do not have permission to access this resource" })
//         }
//         // const page = parseInt(request.query.page)||1 ;
//         let page = parseInt(request.query.page, 10);
//         if (isNaN(page) || page < 0) {
//             page = 1;
//         }
//         const limit = parseInt(request.query.limit) || 4;
//         const skip = (page - 1) * limit;

//         totalCount = await Users.countDocuments({ role: "pending" })
//         pendingUsers = await Users.find({ role: "pending" }).skip(skip).limit(limit)




//         response.json({ pendingUsers, totalCount })
//     }

//     catch (error) {
//         console.log("Error fetching pending po:", error);
//         response.status(500).json({ message: "Internal server error" });
//     }

// })
app.get("/pending-request", verifyToken, async (request, response) => {
    try {
        const role = request.user.role;
        // if (role !== "admin") {
        //     return response.status(403).json({ message: "Unauthorized - You do not have permission to access this resource" });
        // }

        let page = parseInt(request.query.page, 10);
        if (isNaN(page) || page < 0) {
            page = 1;
        }
        const limit = parseInt(request.query.limit, 10) || 4;
        const skip = (page) * limit;

        const totalCount = await User.countDocuments({ role: "pending" });
        const pendingUsers = await User.find({ role: "pending" }).skip(skip).limit(limit);

        response.json({ pendingUsers, totalCount });
    } catch (error) {
        console.error("Error fetching pending users:", error);
        response.status(500).json({ message: "Internal server error", error: error.message });
    }
});

app.put("/pending", verifyToken, async (request, response) => {

    try {



        const userId = request.user.id

        const updateuser = await Users.findByIdAndUpdate(userId, { role: "pending" }, { new: true })


        response.json(updateuser)
    } catch (error) {
        response.status(500).json({ message: "interna; servert error" })
    }
})
app.put("/pending-reject/:id", verifyToken, async (request, response) => {

    try {

        const userId = request.params.id

        const updateuser = await Users.findByIdAndUpdate(userId, { role: "reader" }, { new: true })


        response.json(updateuser)
    } catch (error) {
        response.status(500).json({ message: "interna; servert error" })
    }
})
app.put("/pending-accept/:id", verifyToken, async (request, response) => {

    try {

        const userId = request.params.id

        const updateuser = await Users.findByIdAndUpdate(userId, { role: "author" }, { new: true })


        response.json(updateuser)
    } catch (error) {
        response.status(500).json({ message: "interna; servert error" })
    }
})
app.get("/getallblogdata", verifyToken, async (request, response) => {
    try {

        const role = request.user.role
        if (role !== "admin") {
            return response.status(403).json({ message: "Unauthorized - You do not have permission to access this resource" })
        }

        const Blog = await BlogPost.find();

        // Send the user data in the response
        response.json(Blog);
    }
    catch (error) {
        console.error("Error fetching blog data:", error);
        response.status(500).json({ message: "Internal server error" });
    }

})

app.get("/userdata/:id",     async (request, response) => {
    try {
        const userId = request.params.id
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


        // if (role !== "author") {
        //     return response.status(403).json({ message: "Unauthorized - You do not have permission to perform this action" });
        // }

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


// app.get("/blogs/:blog",  async (request, response) => {
//     try {
//         console.log(request.body,"kdcmdc");

//         console.log(request.params.blog);
//         let query = {};
//         let page = parseInt(request.query.page, 10);
//         if (isNaN(page) || page < 0) {
//             page = 1;
//         }
//         const limit = parseInt(request.query.limit, 10);
//         const skip = (page) * limit;


//         if (request.params.blog === "myblog") {
//             const id = request.body.userId;

//             query.authorId = id;
//         }
//         else if (request.params.blog === "reading-list") {
//             const userId = request.body.userId;

//             const currentUser = await Users.findById(userId);

//             if (!currentUser) {
//                 return response.status(404).json({ message: "User not found" });
//             }

//             const readingList = currentUser.reading_list;
//             let totalCount = await BlogPost.countDocuments({ _id: { $in: readingList } });

//             const result = await BlogPost.find({ _id: { $in: readingList } }).limit(limit).skip(skip);

//             return response.send({ result, totalCount });
//         }

//         else if (request.params.blog === "following") {
//             const userId = request.body.userId;
//            console.log(request.body);
//             const currentUser = await Users.findById(userId);

//             if (!currentUser) {
//                 return response.status(404).json({ message: "User not found" });
//             }

//             const followingUsers = currentUser.following;
//             let totalCount = await BlogPost.countDocuments({ authorId: { $in: followingUsers } });

//             const result = await BlogPost.find({ authorId: { $in: followingUsers } }).limit(limit).skip(skip);

//             return response.send({ totalCount, result });

//         }
//         else if (request.params.blog === "all") {
//             let totalCount = await BlogPost.countDocuments();
//             let result = await BlogPost.find().limit(limit).skip(skip);
//             // console.log(result.length,totalCount);
//             if (result.length > 0) {
//                return response.send({ totalCount, result });
//             } else {
//               return  response.send("No blogs found");
//             }
//         }
//         else {
//             query.category = request.params.blog;

//         }
//         let totalCount = await BlogPost.countDocuments(query);
//         let result = await BlogPost.find(query).limit(limit).skip(skip);
//         // console.log(result.length,totalCount);
//         if (result.length > 0) {
//             response.send({ totalCount, result });
//         } else {
//             response.send("No blogs found");
//         }

//     } catch (error) {
//         console.error('Error fetching Blogs:', error);
//         response.status(500).send("Internal Server Error");
//     }
// });
app.post("/blogs/:blog", async (request, response) => {
    try {
        // console.log(request.body, "kdcmdc");
        // console.log(request.body.userId);

        let query = {};
        let page = parseInt(request.query.page, 10);
        if (isNaN(page) || page < 0) {
            page = 1;
        }
        const limit = parseInt(request.query.limit, 10);
        const skip = page * limit;

        if (request.params.blog === "myblog") {
            const id = request.body.userId;
            query.authorId = id;
        } else if (request.params.blog === "reading-list") {
            const userId = request.body.userId;
            const currentUser = await Users.findById(userId);

            if (!currentUser) {
                return response.status(404).json({ message: "User not found" });
            }

            const readingList = currentUser.reading_list;
            let totalCount = await BlogPost.countDocuments({ _id: { $in: readingList } });
            const result = await BlogPost.find({ _id: { $in: readingList } }).limit(limit).skip(skip);

            return response.send({ result, totalCount });
        } else if (request.params.blog === "following") {

            const userId = request.body.userId;
            console.log(request.body, "kdcmdc");

            const currentUser = await Users.findById(userId);

            if (!currentUser) {
                return response.status(404).json({ message: "User not found" });
            }

            const followingUsers = currentUser.following;
            let totalCount = await BlogPost.countDocuments({ authorId: { $in: followingUsers } });
            const result = await BlogPost.find({ authorId: { $in: followingUsers } }).limit(limit).skip(skip);

            return response.send({ totalCount, result });
        } else if (request.params.blog === "all") {
            let totalCount = await BlogPost.countDocuments();
            let result = await BlogPost.find().limit(limit).skip(skip);
            if (result.length > 0) {
                return response.send({ totalCount, result });
            } else {
                return response.send("No blogs found");
            }
        } else {
            query.category = request.params.blog;
        }

        let totalCount = await BlogPost.countDocuments(query);
        let result = await BlogPost.find(query).limit(limit).skip(skip);
        if (result.length > 0) {
            response.send({ totalCount, result });
        } else {
            response.send("No blogs found");
        }
    } catch (error) {
        console.error('Error fetching Blogs:', error);
        response.status(500).send("Internal Server Error");
    }
});

app.get("/followijng-blogs", verifyToken, async (request, response) => {
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

app.get("/recent-blogs",  async (request, response) => {
    try {
        // Directly find and return the 5 most recent blog posts
        let result = await BlogPost.find({})
            .sort({ createdAt: -1 }) // Ensure sorting by createdAt in descending order
            .limit(4); // Limit the results to 5

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
        // console.log("mtsss", request.body);
        let query

        let page = parseInt(request.query.page) || 1; // Get the page number from the query parameters, default to 1 if not provided
        let limit = parseInt(request.query.limit) || 4; // Number of blogs per page, default to 10 if not provided

        let skip = page - 1;
        console.log(skip);
        skip = ((page - 1) * limit);
        if (searchData.title) {

            query = {
                title: { $regex: searchData.title, $options: 'i' }
            };
        }

        else if (searchData.user_name) {
            query = {
                user_name: { $regex: searchData.user_name, $options: 'i' }
            }
        }
        console.log(query);
        // const blogs = await BlogPost.find(query);
        let totalCount = await BlogPost.countDocuments(query);

        let result = await BlogPost.find(query).limit(limit).skip(skip);

        // console.log(blogs);
        response.send({ totalCount, result });
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
app.get("/blog/:id",  async (request, response) => {
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


app.delete("/deleteblog/:id", verifyToken, async (request, response) => {

    try {
        const role = request.user.role
        const blogId = request.params.id
        const userId = request.user.id

        const blogPost = await BlogPost.findById(blogId)

        if (!blogPost) {
            return response.status(404).json({ messege: "blog not found" })
        }
        if (role === "admin" || userId === blogPost.authorId) {
            const result = await BlogPost.findByIdAndDelete(blogId)

            return response.json({ message: "Blog post deleted successfully", result });

        }

        else {
            return response.status(403).json({ message: "Unauthorized - You are not authorized to delete this blog post" });

        }

    } catch (error) {
        console.error("Error deleting blog post:", error);
        response.status(500).json({ message: "Internal server error" });
    }

})
app.delete("/deleteuser/:id", verifyToken, async (request, response) => {
    try {
        // Check if the user making the request is an admin
        if (request.user.role !== "admin") {
            return response.status(403).json({ message: "Unauthorized - Only admin can delete users" });
        }

        const userId = request.params.id;

        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return response.status(404).json({ message: "User not found" });
        }

        response.json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});
app.put("/update-role/:id", verifyToken, async (request, response) => {
    try {
        // Check if the user making the request is an admin
        if (request.user.role !== "admin") {
            return response.status(403).json({ message: "Unauthorized - Only admin can update user roles" });
        }

        const userId = request.params.id;

        // Update the user's role to "author" in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { role: "author" }, { new: true });

        if (!updatedUser) {
            return response.status(404).json({ message: "User not found" });
        }

        response.json({ message: "User role updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating user role:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});


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