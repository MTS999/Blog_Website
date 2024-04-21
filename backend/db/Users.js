import mongoose from "mongoose";
const { Schema } = mongoose

const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true,
        unique: true  // Set the unique property to true

    },
    image_url: {
        type: String  // Assuming the image URL will be a string
    },
    email: {
        type: String,
        required: true,
        unique: true  // Set the unique property to true

    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],

    reading_list:[
        {
            type:Schema.Types.ObjectId,
            ref:"blogPost"
        }
    ],


},
{
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

const User = mongoose.model("users", usersSchema, "users")

export default User