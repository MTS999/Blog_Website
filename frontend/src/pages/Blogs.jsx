import axios from "axios"
import React from 'react'
import { useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { useLocation, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { Divider } from "@mui/material";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import UserProfileAvatar from "../components/UserProfileAvatar"
import LikeDislike from "../components/LikeDislike";
import Loader from '../components/Loader';



import Chip from "@mui/material/Chip";

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
  const [allUserData, setAllUserData] = React.useState([])
  const [loader, setLoader] = React.useState(false);

  const [userData, setUserData] = React.useState(null)
  const [Search, setSearch] = React.useState("")
  const [Blogs, setBlogs] = React.useState([])
  const location = useLocation()
  // const [selectedCategory, setSelectedCategory] = React.useState("");
  const [userRole, setUserRole] = React.useState('');
  const [recentBlogs, setRecentBlogs] = React.useState([]);
  console.log(allUserData);
  const navigate = useNavigate()

  // console.log(Search);
  // console.log(SearchBy);
  const queryParams = new URLSearchParams(location.search);
  const blogParam = queryParams.get('blog');
  const qcategory = queryParams.get('category');
  const following = queryParams.get('feed');

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId")

  const fetchUserData = async () => {
    // setLoader(true)
    try {

      const response = await axios.get("http://localhost:5003/getalluserdata", {
        headers: {
          Authorization: `Bearer ${token}`

        }
      })

      // console.log(response.data);
      setAllUserData(response.data)

    } catch (error) {
      console.log(error);
    }
    finally {
      // setLoader(false)
    }
  }

  useEffect(() => {

    fetchUserData()

  }, [token])

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
  }, [Blogs]);

  // fetch all blogs
  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("mts");

    const fetchData = async () => {

      setLoader(true)
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
          // setSelectedCategory("");
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
      finally {
        setLoader(false)

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


//   const handleDelete = async (id) => {
//     try {
//         const token = localStorage.getItem("token");
//         const response = await axios.delete(`http://localhost:5003/deleteblog/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });
//         console.log(response.data);
//         // Optionally, you can update the UI to remove the deleted blog post
//     } catch (error) {
//         console.error('Error deleting blog post:', error);
//     }
// };
  const BlogData = Blogs.map((blog) => {
    return (

      <Card key={blog._id} sx={{
        width: "100%", maxWidth: 700, marginBottom: "20px",
        padding: "15px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, .3)", // Black boxShadow
        display: "flex",
        justifyContent: "space-around"
        , alignItems: "center",
      }}

      >
        <Box display={"flex"} justifyContent={"space-between"}>

          <Box
            // display={"inline-block"}
            displayPrint={{ sm: "inline-block", xs: "flex" }}
            // width={"50%"}
            width={{ sm: "50%", xs: "99%" }}
            textAlign={"left"}
            display={"flex"}
            justifyContent={"center "}
            //  alignItems={"center"}
            flexDirection={"column"}
          >

            {/* <Typography variant="body1" color="red" fontWeight={"bold"}  >{blog.category}</Typography>  */}

            <Box display="flex" alignItems={"center"} mb={2} >

              <UserProfileAvatar userId={blog.authorId} userName={blog.user_name} />
              {/* <Avatar sx={{ width: 50, height: 50, marginRight: "10px" }} display="inline-block" >
               

                
                
                 </Avatar> */}

              <Box>

                <Typography mr={1} display={"inline-block"} variant="h6" color="initial" fontWeight={"bold"}>{`${blog.user_name}  `}</Typography>
                <Typography display={"inline-block"} variant="body1" color="initial">
                  {new Date(blog.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                 
                  })}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h5" color="initial" fontWeight={"600"} mb={1}>{blog.title}</Typography>


            <Box
              display={{ sm: 'none', xs: 'inline-block' }}
              width={"100%"}
            >

              <img
                src={blog.image}
                alt="green iguana"
                width={"100%"}
                height={"100%"}


              />
            </Box>
            <CardContent sx={{ padding: "0px" }} >

              <TruncatedContent content={blog.content} />


            </CardContent>
            <CardActions>

              <LikeDislike blog={blog} Blogs={Blogs} setBlogs={setBlogs} />


              {userData &&

                <IconButton aria-label="add or delete from reading_list" onClick={() => handle_reading_list(blog._id)}
                  sx={{
                    color: userData.reading_list?.includes(blog._id) ? "brown" : "inherit"
                  }} >
                  <LibraryAddIcon />
                </IconButton>
              }


              <Button size="small" variant="contained" onClick={() => navigate(`/blog/${blog._id}`)}>Read </Button>

              {userId === blog.authorId && blogParam && <Button size="small" variant="contained"
                onClick={() => navigate(`/addblog`, { state: blog })}
              >Edit</Button>}
            


            </CardActions>
          </Box>
          <Box
            display={{ xs: 'none', sm: 'inline-block' }}

            width={{ sm: "50%", xs: "100%" }}
          >
            <Box mb={2} >

              <Chip size="large" label={blog.category} />
            </Box>
            <img
              src={blog.image}
              alt="green iguana"
              height="200"
              width={"100%"}
              style={
                {
                  borderRadius: "5px"
                }
              }


            />
          </Box>
        </Box>

      </Card>


    )
  }
  )



  return (

    <>
      <Box boxSizing={"border-box"}
        mt={10}
        style={{
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
              maxWidth: "150px",
              marginRight: "10PX"
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
          {/* <FormControl sx={{ margin: "0px 3px", minWidth: 80, padding: "0px" }}>
            <InputLabel id="demo-simple2-select-autowidth-label">by</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={SearchBy}
              onChange={handleChange}
              autoWidth
              label="search by"
            >
      
              <MenuItem value={"title"}>title</MenuItem>
              <MenuItem value={"user_name"}> username</MenuItem>
            </Select>
          </FormControl> */}

          <FormControl >
            <RadioGroup

              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={SearchBy} // Set the value of radio group to SearchBy
              onChange={handleChange} // Handle change for radio buttons
            >
              <FormControlLabel value="title" control={<Radio />} label="title" />
              <FormControlLabel value="user_name" control={<Radio />} label="Author" />

            </RadioGroup>
          </FormControl>
        </Box>
        <Box pl={6} display={"block"} >
          <Button varient="contained" onClick={() => navigate(`/`)}> For You</Button>
          <Button varient="contained" onClick={() => navigate(`/?feed=${"following"}`)}> Following</Button>


        </Box>
        <Divider />
        <Grid container mt={4} >


          {/* <Divider /> */}
          <Grid item
            sx={{
              padding: "10px", paddingTop: "0px", width: "100%", display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
            xs={12} lg={7}
          >
            <Typography variant="body1" color="initial"></Typography>

            {BlogData.length === 0 ?
              <>
                {/* <Typography variant="h3" color="initial">Blog no Found</Typography> */}

                <Divider
                  variant="fullWidth"
                  orientation="horizontal"

                />
              </>

              : BlogData}

          </Grid>
          <Divider />

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
                    >
                      <Box mb={2} >

                        <Chip size="large" label={blog.category} />
                      </Box>

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



                      </CardContent>
                      <CardActions>
                        <LikeDislike blog={blog} Blogs={Blogs} setBlogs={setBlogs} />


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