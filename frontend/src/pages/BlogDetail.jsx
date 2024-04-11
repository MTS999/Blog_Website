import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'


export const BlogDetail = () => {
  const [Blog, setBlog] = React.useState({})
  const [comments, setComments] = React.useState([]);
  const [content, setAddComment] = React.useState("");
  console.log(comments);
  const params = useParams()
  // console.log(Blog);
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")
  const fetchCommentsForPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5003/comments/${params.id}`, {
        headers: {
          authorization: `Bearer ${token}`

        }

      }
      );
      if (response.status === 200) {
        setComments(response.data)
      }
      // console.log('Comments fetched successfully:', response);
      // console.log(response);
    } catch (error) {
      console.error('Error fetching comments:', error.response ? error.response.data : error.message);
    }
  };
  useEffect(() => {


    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/blog/${params.id}`, {
          headers: {
            authorization: `Bearer ${token}`

          }
        })

        setBlog(response.data)

      }

      catch (error) {
        console.error('Error fetching Blogs:', error);
      }
    }
    if (token) {
      fetchData()
      fetchCommentsForPost()
    }
  }, [params.id])

  async function handleAddComment() {
    try {
      const response = await axios.post(`http://localhost:5003/comment/${Blog._id}`, { content }, {
        headers: {
          authorization: `Bearer ${token}`

        }

      }
      );

      console.log("mtssss", response);
    } catch (error) {
      console.error('Error fetching comments:', error.response ? error.response.data : error.message);
    }
  }


  async function handleDelete(postId) {
    try {
      const response = await axios.delete(`http://localhost:5003/comment/${postId}`, {
        headers: {
          authorization: `Bearer ${token}`

        }

      }
      );

      console.log("mtssss", response);
    } catch (error) {
      console.error('Error fetching comments:', error.response ? error.response.data : error.message);
    }
  }
  async function handleEdit(postId) {
    try {
      const response = await axios.delete(`http://localhost:5003/commentedit/${postId}`,{content}, {
        headers: {
          authorization: `Bearer ${token}`

        }

      }
      );

      console.log("mtssss", response);
    } catch (error) {
      console.error('Error fetching comments:', error.response ? error.response.data : error.message);
    }
  }
  return (

    <>
      <Box>
        <Typography variant="h4" color="initial">{Blog.title}</Typography>
        <div>
          <img src={Blog.image} alt="Description of your image" />
        </div>
      </Box>
      <Typography variant="body1" color="initial"> Wrriten by :{Blog.user_name}</Typography>
      <Typography variant="body1" color="initial"> {Blog.updatedAt !== Blog.createdAt ? `updatedAt :${Blog.updatedAt}` : `createdAt :${Blog.createdAt}`}</Typography>

      <Typography variant="body1" color="initial">{Blog.content}</Typography>



      <TextField
        id="addcomment"
        label="addcomment"
        value={content}
        onChange={(e) => setAddComment(e.target.value)}

      />

      <Button onClick={handleAddComment}>Add comment</Button>
      {comments.map((comment) => {

        return (
          <>
            <Box>

              <Typography variant="h4" color="initial">{comment.author}</Typography>
              <Typography variant="h4" color="initial">{comment.content}</Typography>

              {userId === comment.authorId &&
                <>

                  <Button variant='contained' onClick={() => handleDelete(comment._id)} >delete</Button>
                  <Button variant='contained' onClick={() => handleEdit(comment._id)} >Edit</Button>

                  {/* edit content is pending */}
                </>

              }

            </Box>
          </>

        )
      })

 
      }
    </>

  )
}
