import React from 'react'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from 'axios';

function LikeDislike (props){

    const userId = localStorage.getItem("userId")



  async function handleLike(postId) {
    const token = localStorage.getItem("token");

    try {

      const response = await axios.post(`http://localhost:5003/like/${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      })
      const blogIndex = props.Blogs.findIndex(blog => blog._id === postId);

      // Update the dislike count of the corresponding blog
      const updatedBlogs = [...props.Blogs];
      updatedBlogs[blogIndex] = {
        ...updatedBlogs[blogIndex],
        likes: response.data.blogPost.likes,
        dislikes: response.data.blogPost.dislikes,

      };

      // Update the state with the updated Blogs array
//    if(props.setRecentBlogs){
//     props.setRecentBlogs([])
//    }
//    else{

       props.setBlogs(updatedBlogs);
    // }

      console.log(response.data.blogPost.likes);
    }
    catch (error) {
      console.error('Error liking post:', error);

    }
  }
  async function handleDislike(postId) {
    const token = localStorage.getItem("token");

    try {

      const response = await axios.post(`http://localhost:5003/dislike/${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const blogIndex = props.Blogs.findIndex(blog => blog._id === postId);

      // Update the dislike count of the corresponding blog
      const updatedBlogs = [...props.Blogs];
      updatedBlogs[blogIndex] = {
        ...updatedBlogs[blogIndex],
        dislikes: response.data.blogPost.dislikes,
        likes: response.data.blogPost.likes

      };

      // Update the state with the updated Blogs array
    props.setBlogs(updatedBlogs);


      console.log(response);
    }
    catch (error) {
      console.error('Error disliking:', error);

    }
  }
    return (
        <>
        
        <IconButton sx={{
                color: props.blog.likes.includes(userId) ? "green" : "inherit"
              }} aria-label="add to favorites" onClick={() => handleLike(props.blog._id)}>
                <ThumbUpIcon /> {props.blog.likes.length}
              </IconButton>
              <IconButton aria-label="add to dislike" onClick={() => handleDislike(props.blog._id)}
                sx={{
                  color: props.blog.dislikes.includes(userId) ? "red" : "inherit"
                }} >
                <ThumbDownIcon /> {props.blog.dislikes.length}
              </IconButton>
        </>
    )
}

LikeDislike.propTypes = {

   blog:PropTypes.object,
   Blogs:PropTypes.array,
   setBlogs:PropTypes.func,
}

export default LikeDislike