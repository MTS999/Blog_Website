import React from 'react'
import PropTypes from 'prop-types'

import IconButton from '@mui/material/IconButton'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from 'axios';

function Like_Dislike (props){

    const userId = localStorage.getItem("userId")



  async function handleLike(postId) {
    const token = localStorage.getItem("token");

    try {

      const response = await axios.post(`http://localhost:5003/like/${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      })
      props.setRefresh(pre=>!pre) 


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

     props.setRefresh(pre=>!pre) 
    }
    catch (error) {
      console.error('Error disliking:', error);

    }
  }
    return (
        <>
        
        <IconButton sx={{
                color: props.blog.likes.includes(userId) ? "black" : "inherit"
              }} aria-label="add to favorites" onClick={() => handleLike(props.blog._id)}>
                <ThumbUpIcon /> {props.blog.likes.length}
              </IconButton>
              <IconButton aria-label="add to dislike" onClick={() => handleDislike(props.blog._id)}
                sx={{
                  color: props.blog.dislikes.includes(userId) ? "black" : "inherit"
                }} >
                <ThumbDownIcon /> {props.blog.dislikes.length}
              </IconButton>
        </>
    )
}

Like_Dislike.propTypes = {

   blog:PropTypes.object,
  setRefresh:PropTypes.func,
}

export default Like_Dislike