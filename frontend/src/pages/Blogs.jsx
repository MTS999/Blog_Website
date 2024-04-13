import axios from "axios"
import React from 'react'
import { useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
  import IconButton from '@mui/material/IconButton'
  import ThumbUpIcon from '@mui/icons-material/ThumbUp';
  import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { useLocation, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';





const MAX_LINES = 2; // Maximum number of lines for content

const TruncatedContent = ({ type, content, }) => {
  const style = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: MAX_LINES,
    WebkitBoxOrient: 'vertical',
  };

  return (
    <Typography variant={type} color="text.secondary" style={style}>
      {/* {content} */}
      <div dangerouslySetInnerHTML={{ __html: content }} />

    </Typography>
  );
};
const Blogs = () => {
  const [Blogs, setBlogs] = React.useState([])
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [userRole, setUserRole] = React.useState('');
  const [recentBlogs, setRecentBlogs] = React.useState([]);
  console.log(recentBlogs);
  const navigate = useNavigate()


  const queryParams = new URLSearchParams(location.search);
  const blogParam = queryParams.get('blog');
  const qcategory = queryParams.get('category');
  console.log(blogParam);
  // console.log(qcategory);

  // console.log("blog",blogParam);
  // console.log("category",qcategory);
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
        setBlogs([]); // Optionally handle error state
      }
    };

    fetchRecentBlogs();
  }, []);

  // fetch all blogs
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("mts");

    const fetchData = async () => {
      try {
        // const textValue = location.state?.text;

        let url = "http://localhost:5003/blogs";
        if (qcategory) {
          url += `?category=${qcategory}`;
        }
        if (blogParam) {
          url += `?blog=${blogParam}`;
        }

        else {
          setSelectedCategory("");
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBlogs(response.data);
        console.log(response);
      } catch (error) {
        console.error('Error fetching Blogs:', error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [location.state, blogParam, qcategory]);
 
  // gete user-role

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:5003/user-role", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserRole(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    if (token) {
      fetchUserRole();
    }
  }, [userRole]);
  const userId = localStorage.getItem("userId")

   
  async function handleLike(postId) {
    const token = localStorage.getItem("token");

    try {

      const response = await axios.post(`http://localhost:5003/like/${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      })
      const blogIndex = Blogs.findIndex(blog => blog._id === postId);

      // Update the dislike count of the corresponding blog
      const updatedBlogs = [...Blogs];
      updatedBlogs[blogIndex] = {
        ...updatedBlogs[blogIndex],
        likes: response.data.blogPost.likes,
        dislikes: response.data.blogPost.dislikes,

      };

      // Update the state with the updated Blogs array
      setBlogs(updatedBlogs);

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
      const blogIndex = Blogs.findIndex(blog => blog._id === postId);

      // Update the dislike count of the corresponding blog
      const updatedBlogs = [...Blogs];
      updatedBlogs[blogIndex] = {
        ...updatedBlogs[blogIndex],
        dislikes: response.data.blogPost.dislikes,
        likes: response.data.blogPost.likes

      };

      // Update the state with the updated Blogs array
      setBlogs(updatedBlogs);


      console.log(response);
    }
    catch (error) {
      console.error('Error disliking:', error);

    }
  }


  const BlogData = Blogs.map((blog) => {
    return (

      <Card key={blog._id} sx={{
        width: "100%", maxWidth: 700, marginBottom: "20px",
        //  backgroundColor: "green",
        padding: "15px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, .3)" // Black boxShadow

      }}
        display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}
      >
        <Typography variant="h5" color="red" fontWeight={"bold"} mb={3}>{blog.category}</Typography>
        <Typography variant="h5" color="initial" fontWeight={"600"} mb={3}>{blog.title}</Typography>
        <CardMedia
          component="img"
          alt="green iguana"
          height="170"
          image={blog.image || "/static/images/cards/default-image.jpg"}
        />
        <CardContent>

          <TruncatedContent content={blog.content} />


        </CardContent>
        <CardActions>
          <IconButton sx={{
            color: blog.likes.includes(userId) ? "green" : "inherit"
          }} aria-label="add to favorites" onClick={() => handleLike(blog._id)}>
            <ThumbUpIcon /> {blog.likes.length}
          </IconButton>
          <IconButton aria-label="add to dislike" onClick={() => handleDislike(blog._id)}
            sx={{
              color: blog.dislikes.includes(userId) ? "red" : "inherit"
            }} >
            <ThumbDownIcon /> {blog.dislikes.length}
          </IconButton>
          <Button size="small" variant="contained" onClick={() => navigate(`/blog/${blog._id}`)}>Read more</Button>

          {userId === blog.authorId && blogParam && <Button size="small" variant="contained"
            onClick={() => navigate(`/addblog`, { state: blog })}
          >Edit</Button>}


        </CardActions>
      </Card>


    )
  }
  )


  return (

    <>
      <Box boxSizing={"border-box"}
        mt={10} style={{
          width: '100%',
          // backgroundColor:"red",
          overflowX: "hidden",
          // padding:"10px"


        }} >

        <Box mb={3} display={"flex"} justifyContent={"space-between"} alignItems={"center"} textAlign={"center"} sx={{ padding: "10px" }} >
          <TextField
            sx={{
              maxWidth: "150px" // Adjust the width value as needed

            }}
            margin='normal'
            required
            id="password"
            name="password"
            label="Search"

            size="small"
            // small
            autoComplete="password"
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    // onClick={handleTogglePasswordVisibility}
                    edge="start"
                  >
                    <SearchIcon />

                  </IconButton>
                </InputAdornment>
              ),
            }}

          />
          {userRole === "author" &&

            <Button
              variant="contained"
              onClick={() => navigate("/addblog")}
              sx={{ textTransform: "none" }}
            >
              + Add Blog
            </Button>
          }
        </Box>

        <Grid container  >


          <Grid item
            sx={{
              padding: "10px", paddingTop: "0px", width: "100%", display: "flex", alignItems: "center", flexDirection: "column",
            }}
            xs={12} lg={7}
          >
            <Typography variant="h3" color="initial">Blog</Typography>

            {BlogData}

          </Grid>

          <Grid item
            sx={{
              padding: "10px", paddingTop: "0px", width: "100%", display: "flex", alignItems: "center", flexDirection: "column",
            }}
            xs={12} lg={4}
          >
            <Typography variant="h3" color="initial">Recent Posts</Typography>
            {recentBlogs.length > 0 &&

              recentBlogs.map((blog) => {
                return (
                  <Card key={blog._id} sx={{
                    width: "100%", maxWidth: 300, marginBottom: "20px",
                    //  backgroundColor: "green",
                    padding: "15px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, .3)" // Black boxShadow


                  }}
                    display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}
                  >
                    <Typography variant="h5" color="red" fontWeight={"bold"} mb={1}>{blog.category}</Typography>

                    <Typography variant="h5" color="initial" fontWeight={"600"} mb={1}>
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
                      {/* <IconButton sx={{
                        color: blog.likes.includes(userId) ? "green" : "inherit"
                      }} aria-label="add to favorites" onClick={() => handleLike(blog._id)}>
                        <ThumbUpIcon /> {blog.likes.length}
                      </IconButton>
                      <IconButton aria-label="add to dislike" onClick={() => handleDislike(blog._id)}
                        sx={{
                          color: blog.dislikes.includes(userId) ? "red" : "inherit"
                        }} >
                        <ThumbDownIcon /> {blog.dislikes.length}
                      </IconButton> */}
                      <Button size="small" variant="contained" onClick={() => navigate(`/blog/${blog._id}`)}>Read </Button>

                      {userId === blog.authorId && blogParam && <Button size="small" variant="contained"
                        onClick={() => navigate(`/addblog`, { state: blog })}
                      >Edit</Button>}


                    </CardActions>
                  </Card>
                )
              }
              )
            }
          </Grid>

        </Grid>
      </Box>
    </>

  )
}

export default Blogs