import  mongoose  from "mongoose";

const {Schema}=mongoose

const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },

    author:{
        type:String,
        required:true
    },
    authorId:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    },

},{
    timestamps: true // Automatically manage createdAt and updatedAt fields
}
)

const Comments=mongoose.model("comments",commentSchema,"comments")

export default Comments