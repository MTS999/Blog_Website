import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Drawer from '@mui/material/Drawer';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import Like_Dislike from '../components/Like_Dislike';


import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}



const MAX_LINES = 2; // Maximum number of lines for content

const TruncatedContent = ({ type, content }) => {
    const style = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: MAX_LINES,
        WebkitBoxOrient: 'vertical',
    };

    return (
        <Typography variant={type} color="text.secondary" style={style} dangerouslySetInnerHTML={{ __html: content }} />

    );
};

export const BlogDetail = () => {


    const [oopen, setOopen] = React.useState(false);
    const handleClickOpen = () => {
      setOopen(true);
    };
  
    const handleClose = () => {
      setOopen(false);
    };
  




    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const [state, setState] = React.useState("");

    const navigate = useNavigate()

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 600) {
                setState("right");
            } else {
                setState("bottom");
            }
        };

        window.addEventListener('resize', handleResize);

        // Initial check
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [userData, setUserData] = React.useState(null)
    const [Blog, setBlog] = React.useState(null)
    const [comments, setComments] = React.useState([]);
    const [content, setAddComment] = React.useState("");
    const [recentBlogs, setRecentBlogs] = React.useState([]);
    const [refresh, setRefresh] = React.useState(true)

    // console.log(recentBlogs);
    const params = useParams()
    // console.log(userData);
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

    //get blog  
    useEffect(() => {


        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5003/userdata/${userId}`, {
                    headers: {
                        authorization: `Bearer ${token}`

                    }
                })
                // console.log(response.data);
                setUserData(response.data)

            }

            catch (error) {
                console.error('Error fetching data   mts:', error);
            }
        }
            fetchData()
        
    }, [userId, token])

    useEffect(() => {


        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5003/blog/${params.id}`, {
                    headers: {
                        authorization: `Bearer ${token}`

                    }
                })
                // console.log(response.data);
                setBlog(response.data)

            }

            catch (error) {
                console.error('Error fetching Blogs:', error);
            }
        }
            fetchData()
        
    }, [params.id])

    useEffect(() => {
        if (token) {
            fetchCommentsForPost()
        }
    }, [content, token])


    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchRecentBlogs = async () => {
            try {
                // Make the HTTP request using Axios to get recent blogs
                const response = await axios.get('http://localhost:5003/recent-blogs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Update state with fetched blogs
                setRecentBlogs(response.data);
            } catch (error) {
                console.error('Error fetching recent blogs:', error);
                // setBlogs([]); // Optionally handle error state
            }
        };

        fetchRecentBlogs();
    }, [refresh]);
  // handle add comment functionality
    async function handleAddComment() {

        if (!token) {
            handleClickOpen();
      
            console.log("no token there");
            return;
          }
        try {
            const response = await axios.post(`http://localhost:5003/comment/${Blog._id}`, { content }, {
                headers: {
                    authorization: `Bearer ${token}`

                }

            }
            );

            // console.log("mtssss", response);
            setAddComment(''); // Clear the content state after adding comment

        } catch (error) {
            console.error('Error fetching comments:', error.response ? error.response.data : error.message);
        }
    }
  // handle add comment functionality

    async function handleDelete(postId) {
        try {
            const response = await axios.delete(`http://localhost:5003/comment/${postId}`, {
                headers: {
                    authorization: `Bearer ${token}`

                }



            }
            );
            fetchCommentsForPost();

            console.log("mtssss", response);
        } catch (error) {
            console.error('Error fetching comments:', error.response ? error.response.data : error.message);
        }
    }
  

    async function handleLike(postId) {
        const token = localStorage.getItem("token");
        if (!token) {
            handleClickOpen();
      
            console.log("no token there");
            return;
          }
        try {

            const response = await axios.post(`http://localhost:5003/like/${postId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            })

            console.log(response.data.blogPost);
            setBlog(response.data.blogPost);
            // Update the state with the updated Blogs array


        }
        catch (error) {
            console.error('Error liking post:', error);

        }
    }


    async function handleDislike(postId) {
        const token = localStorage.getItem("token");
        if (!token) {
            handleClickOpen();
      
            console.log("no token there");
            return;
          }
        try {

            const response = await axios.post(`http://localhost:5003/dislike/${postId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })


            setBlog(response.data.blogPost);

            console.log(response);
        }
        catch (error) {
            console.error('Error disliking:', error);

        }
    }
    async function handleFollow(postId) {
        const token = localStorage.getItem("token");
        if (!token) {
            handleClickOpen();
      
            console.log("no token there");
            return;
          }
        try {

            const response = await axios.post(`http://localhost:5003/follow/${postId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            })

            console.log(response.data);
            setUserData(response.data.userData)
        


        }
        catch (error) {
            console.error('Error liking post:', error);

        }
    }
    const calculateTimeDifference = (timestamp) => {
        const currentTime = new Date();
        const createdAtTime = new Date(timestamp);
        const difference = currentTime - createdAtTime;
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} days ago`;
        } else if (hours > 0) {
            return `${hours} hours ago`;
        } else if (minutes > 0) {
            return `${minutes} minutes ago`;
        } else {
            return `${seconds} seconds ago`;
        }
    };
    return (
        <>
            {Blog &&
                <Box mt={14} sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Grid container
                    //  backgroundColor="#F7F9FA"
                    >


                        <Grid item xs={12} p={3}
                            display={"flex"}
                            justifyContent={"center"}
                        // backgroundColor="#FFFFFF"

                        >
                            <Box maxWidth={700}
                                // border={"2px solid red"}
                                backgroundColor="#202837"

                                sx={{
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, .3)"
                                }}
                                padding={4}>

                                <Box mb={3} >

                                    <Typography mt={3} mb={3} variant="h4" textAlign={"center"} fontWeight={"bold"}>{Blog.title}</Typography>
                                    <Divider color="white" />
                                    <div style={{ width: '100%', padding: "50px 20px" }}>
                                        <img src={Blog.image} alt="Description of your image" style={{ width: '100%', height: 'auto', borderRadius: "10px" }} />
                                    </div>
                                    <Divider color="white" />

                                </Box>
                                <Box mb={2}  >

                                    <Typography variant="body1" > <strong>Author : {Blog.user_name}</strong>

                                        {userId !== Blog.authorId &&
                                            <Button
                                                sx={{ marginLeft: "10px" }}
                                                variant='contained'
                                                size='small'
                                                onClick={() => handleFollow(Blog.authorId)}>
                                                {userData?.following.includes(Blog.authorId) ? "Following" : "Follow"}
                                            </Button>}

                                    </Typography>
                                </Box>
                                {/* <Typography variant="body1" > {Blog.updatedAt !== Blog.createdAt ? `updatedAt :${Blog.updatedAt}` : `createdAt :${Blog.createdAt}`}</Typography> */}
                                <Typography mb={3} variant="body1" >
                                    {Blog.updatedAt !== Blog.createdAt ?
                                        `updatedAt: ${new Date(Blog.updatedAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            // timeZoneName: 'short'
                                        })}` :
                                        `createdAt: ${new Date(Blog.createdAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            // timeZoneName: 'short'
                                        })}`
                                    }
                                </Typography>

                                

                                <Typography mb={1} p={2} variant="h6" sx={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: Blog.content }} />
                                <Divider color="white" />

                                <Box mt={2} mb={3} display={"flex"} >
                             
                                    {Blog && (<>
                                        <IconButton sx={{
                                            color: Blog.likes.includes(userId) ? "green" : "inherit"
                                        }} aria-label="add to favorites"
                                            onClick={() => handleLike(Blog._id)}
                                        >
                                            <ThumbUpIcon /> {Blog.likes.length}
                                        </IconButton>
                                        <IconButton aria-label="add to dislike"
                                            onClick={() => handleDislike(Blog._id)}
                                            sx={{
                                                color: Blog.dislikes.includes(userId) ? "red" : "inherit"
                                            }} >
                                            <ThumbDownIcon /> {Blog.dislikes.length}
                                        </IconButton>
                                        <IconButton aria-label="add to dislike"
                                            onClick={toggleDrawer(true)}
                                        >
                                            <CommentIcon /> {comments.length}
                                        </IconButton>
                                    </>
                                    )
                                    }
                                </Box>



                                <div >
                                    <Drawer
                                        sx={{
                                            '& .MuiDrawer-paper': {
                                                top: "100px",// This adds space at the top
                                                height: 'calc(100% - 100px)',
                                                // width:"50px"// Adjusts height if necessary
                                                width : {sm:"400px"}
                                            }
                                        }}
                                        anchor={state} open={open} onClose={toggleDrawer(false)}>
                                        <Box padding={2} >
                                            <Box
                                                // display={"flex"} textAlign={"center"} justifyContent={"space-between"} flexWrap={"wrap"}
                                                mb={2}>
                                                <Box

                                                    display={"flex"} textAlign={"center"} justifyContent={"end"}
                                                    mb={2}

                                                >
                                                    <CloseIcon onClick={toggleDrawer(false)} />
                                                </Box>
                                                <Box>

                                                    <TextField
                                                        id="addcomment"
                                                        label="addcomment"
                                                        value={content}
                                                        onChange={(e) => setAddComment(e.target.value)}
                                                        fullWidth

                                                    />
                                                </Box>
                                                <Box display="flex"
                                                    alignItems="center" >

                                                    <Button
                                                        sx={{ marginTop: "8px" }}
                                                        variant='contained' size='small' onClick={handleAddComment}>Add </Button>
                                                </Box>
                                            </Box>
                                            <Typography variant="h6" > All Comments ({comments.length})</Typography>
                                            {comments.length > 0 &&
                                                <Box key={"12"} sx={{ width: "100%" }} border={"2px solid #EAEAEA"} borderRadius={3} p={2}>

                                                    {comments.map((comment) => {

                                                        return (
                                                            <>
                                                                <Box key={comment._id} borderBottom={"2px solid #EAEAEA"} mb={2} >
                                                                    <Box display="flex" alignItems={"center"} mb={2} >

                                                                        <Avatar sx={{ width: 50, height: 50, marginRight: "10px" }}
                                                                            display="inline-block" >{comment.author?.charAt(0).toUpperCase()}  </Avatar>

                                                                        <Box>

                                                                            <Typography variant="h6" fontWeight={"bold"}>{comment.author}</Typography>
                                                                            <Typography variant="body1" >{calculateTimeDifference(comment.createdAt)}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                    <Typography variant="body1" >{comment.content}</Typography>
                                                                    <Box mt={2}>

                                                                        {userId === comment.authorId &&
                                                                            <>
                                                                                <IconButton onClick={() => handleDelete(comment._id)}><DeleteIcon /></IconButton>
                                                                                {/* <Button variant='contained' onClick={() => handleEdit(comment._id)} >Edit</Button>

              {/* edit content is pending */}
                                                                            </>

                                                                        }
                                                                    </Box>

                                                                </Box>
                                                            </>

                                                        )
                                                    })


                                                    }
                                                </Box>
                                            }
                                        </Box>
                                    </Drawer>
                                </div>

                            </Box>
                        </Grid>

                        {/* rescrnt */}

                        <Grid item xs={12} p={3}
                            sx={{

                                display: "flex", alignItems: "center", flexDirection: "column",
                            }}
                        >
                            <Typography variant="h3" mb={3}>Recent Posts</Typography>
                            <Box maxWidth={700}
                                display={"flex"} justifyContent={"space-around"}
                                flexWrap={"wrap"}

                            >

                                {recentBlogs.length > 0 &&

                                    recentBlogs.map((blog) => {
                                        return (
                                            <Card key={blog._id} sx={{

                                                width: "100%", maxWidth: 300, marginBottom: "20px", minWidth: 200,
                                                padding: "15px",
                                                boxShadow: "0px 0px 10px rgba(0, 0, 0, .3)", // Black boxShadow
                                                display: "inline-block"

                                            }}
                                            >
                                                {/* <Typography variant="h5" color="red" fontWeight={"bold"} mb={1}>{blog.category}</Typography> */}
                                                <Box mb={2} >

                                                    <Chip size="large" label={blog.category} />
                                                </Box>

                                                <Typography variant="h5" fontWeight={"600"} mb={2}>
                                                    <TruncatedContent type="body" content={blog.title} />


                                                    {/* {blog.title} */}
                                                </Typography>
                                                <CardMedia
                                                    component="img"
                                                    alt="green iguana"
                                                    height="100"
                                                    width="100%"
                                                    image={blog.image || "/static/images/cards/default-image.jpg"}
                                                />
                                                <CardContent>

                                                    {/* <TruncatedContent content={blog.content} /> */}


                                                </CardContent>
                                                <CardActions>
                                                    <Like_Dislike blog={blog} setRefresh={setRefresh} />

                                                    <Button size="small" variant="contained" onClick={() => navigate(`/blog/${blog._id}`)}>Read </Button>




                                                </CardActions>
                                            </Card>
                                        )
                                    }
                                    )
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Box >
            }


<Dialog
        open={oopen}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth={"300px"}
        sx={{ '& .MuiDialog-paper': { width: '300px', maxWidth: '300px' } }} // fixed width
        >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{fontSize:"20px"}}>
            you  have  to 
            
            <Link style={{color:"#90CAF9" , paddingLeft:"5px"}} to="/login">login</Link>  or 


            <Link style={{color:"#90CAF9", paddingLeft:"5px"}} to={"/signup"}>Signup</Link>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          {/* <Button onClick={handleClose}>Subscribe</Button> */}
        </DialogActions>
      </Dialog>
        </>
    )
}
