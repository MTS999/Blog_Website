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
import { Divider } from "@mui/material";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


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
    <Typography variant={type} color="text.secondary" style={style} dangerouslySetInnerHTML={{ __html: content }} />

  );
};


const Blogs = () => {

  const [SearchBy, setSearchBy] = React.useState('');

  const handleChange = (event) => {
    setSearchBy(event.target.value);
  };

    const [userData, setUserData] = React.useState(null)
  const [Search, setSearch] = React.useState("")
  const [Blogs, setBlogs] = React.useState([])
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [userRole, setUserRole] = React.useState('');
  const [recentBlogs, setRecentBlogs] = React.useState([]);
  // console.log(Blogs);
  const navigate = useNavigate()

  console.log(Search);
  console.log(SearchBy);
  const queryParams = new URLSearchParams(location.search);
  const blogParam = queryParams.get('blog');
  const qcategory = queryParams.get('category');
  const following = queryParams.get('feed');
  // console.log(blogParam);
  // console.log(qcategory);

  // console.log("blog",blogParam);
  // console.log("category",qcategory);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId")

  useEffect(() => {


    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/userdata`, {
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
    if (token) {
      fetchData()
    }
  }, [userId, token])

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
        if (following) {
          url += `?feed=${following}`;
          console.log("mts");
        }

        // if(following){
        //   url ='http://localhost:5003/blogs';

        // }

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
  }, [location.state, blogParam, qcategory, following]);

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
  useEffect(() => {
    const fetchBlogs = async () => {
      let body
      if (SearchBy === "" || SearchBy === "title") {
        body = { title: Search }
      }
      else if (SearchBy === "user_name") {
        body = { user_name: Search }

      }
      try {

        const response = await axios.post("http://localhost:5003/search",
          body, {
          headers: {
            Authorization: `Bearer ${token}`

          }
        })


        console.log(response.data);
        setBlogs(response.data)
      } catch (error) {
        console.log("mts", error);
      }
    }

    if (token) {
      fetchBlogs();
    }

  }, [Search, token, SearchBy])

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
  async function handle_reading_list(postId) {
    const token = localStorage.getItem("token");

    try {

      const response = await axios.post(`http://localhost:5003/reading-list/${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      })
      console.log(response.data.userData);
      // Update the state with the updated Blogs array
      setUserData(response.data.userData);

    }
    catch (error) {
      console.error('Error liking post:', error);

    }
  }

  const BlogData = Blogs.map((blog) => {
    return (

      <Card key={blog._id} sx={{
        width: "100%", maxWidth: 700, marginBottom: "20px",
        //  backgroundColor: "green",
        padding: "15px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, .3)", // Black boxShadow
        display: "flex",
        justifyContent: "space-around"
        , alignItems: "center"
      }}
      //         display={"flex"}
      // justifyContent={"spa "}
      //        alignItems={"center"}
      >
        <Box
          // display={"inline-block"}
          displayPrint={{sm:"inline-block" ,xs:"flex"}}
        width={"100%"}

        >

          <Typography variant="h5" color="red" fontWeight={"bold"} mb={3}>{blog.category}</Typography>
          <Typography variant="h5" color="initial" fontWeight={"600"} mb={3}>{blog.title}</Typography>


          <Box
          display={{ sm: 'none', xs: 'inline-block' }}
          // maxWidth={300}
          width={"100%"}
          >

          <img
            src={blog.image}
            alt="green iguana"
            height="200"
            width={"100%"}


          />
        </Box>
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

            { userData  && 

              <IconButton aria-label="add or delete from reading_list" onClick={() => handle_reading_list(blog._id)}
              sx={{
                color: userData.reading_list?.includes(blog._id) ? "brown" : "inherit"
              }} >
              <LibraryAddIcon />
            </IconButton>
              }


            <Button size="small" variant="contained" onClick={() => navigate(`/blog/${blog._id}`)}>more</Button>

            {userId === blog.authorId && blogParam && <Button size="small" variant="contained"
              onClick={() => navigate(`/addblog`, { state: blog })}
            >Edit</Button>}


          </CardActions>
        </Box>
        <Box
          display={{ xs: 'none', sm: 'inline-block' }}
          maxWidth={400}
          minWidth={300}
          >

          <img
            src={blog.image}
            alt="green iguana"
            height="200"
            width={"100%"}


          />
        </Box>
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

        <Box mb={3} display={"flex"}
          alignItems={"center"}
          textAlign={"center"} sx={{ padding: "10px" }} >

          {/* {userRole === "author" &&

            <Button
              variant="contained"
              onClick={() => navigate("/addblog")}
              sx={{ textTransform: "none" }}
            >
              + Add Blog
            </Button>
          } */}
          <TextField
            sx={{
              maxWidth: "150px" // Adjust the width value as needed

            }}
            margin='normal'
            required
            id="search"
            name="search"
            label="Search"
            value={Search}
            onChange={(e) => setSearch(e.target.value)}

            size="small"
            // small
            autoComplete="search"
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
          <div>
            <FormControl sx={{ m: 1, minWidth: 80, padding: "0px" }}>
              <InputLabel id="demo-simple-select-autowidth-label">by</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={SearchBy}
                onChange={handleChange}
                autoWidth
                label="search by"
              >
                {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
                <MenuItem value={"title"}>title</MenuItem>
                <MenuItem value={"user_name"}> username</MenuItem>
                {/* <MenuItem value={22}>Twenty one and a </MenuItem> */}
              </Select>
            </FormControl>
          </div>
        </Box>
        <Box pl={6} mb={1} display={"block"} >
          <Button varient="contained" onClick={() => navigate(`/`)}> For You</Button>
          <Button varient="contained" onClick={() => navigate(`/?feed=${"following"}`)}> Following</Button>


        </Box>
        <Divider
        

        />
        <Grid container mt={4} >


          <Divider />
          <Grid item
            sx={{
              padding: "10px", paddingTop: "0px", width: "100%", display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
            xs={12} lg={7}
          >


            {BlogData && BlogData}

          </Grid>

          <Grid item
            sx={{
              padding: "10px", paddingTop: "0px", width: "100%",
              display: "flex", alignItems: "center", flexDirection: "column",

            }}
            xs={12} lg={4}
          >

            <Typography variant="h3" color="initial">Recent Posts</Typography>
            <Box width={"100%"} maxWidth={700}
              display={"flex"} justifyContent={"space-around"}
              flexWrap={"wrap"}
            >

              {recentBlogs.length > 0 &&

                recentBlogs.map((blog) => {
                  return (
                    <Card key={blog._id} sx={{
                      width: "100%", maxWidth: 300, marginBottom: "20px", minWidth: 200,
                      //  backgroundColor: "green",
                      padding: "15px",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, .3)", // Black boxShadow
                      display: "inline-block"

                    }}
                    // display={"flex"} flexDirectionjustifyContent={"center"} alignItems={"center"}
                    >
                      <Typography variant="h5" color="red" fontWeight={"bold"} mb={1}>{blog.category}</Typography>

                      <Typography variant="h5" color="initial" fontWeight={"600"} mb={1}>
                        <TruncatedContent type="body" content={blog.title} />

                        {/* {blog.title} */}
                      </Typography>
                      <div>
                        <img
                          src={blog.image}
                          alt="green iguana"
                          height="100"
                          width="100%"
                        />
                      </div>
                      <CardContent>

                        {/* <TruncatedContent content={blog.content} /> */}


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
            </Box>

          </Grid>

        </Grid>
      </Box>
    </>

  )
}

export default Blogs