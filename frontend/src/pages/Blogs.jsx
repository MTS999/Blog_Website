import axios from "axios"
import React from 'react'
import { useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack'


const MAX_LINES = 2; // Maximum number of lines for content

const TruncatedContent = ({ content }) => {
  const style = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: MAX_LINES,
    WebkitBoxOrient: 'vertical',
  };

  return (
    <Typography variant="body2" color="text.secondary" style={style}>
      {content}
    </Typography>
  );
};
const Blogs = () => {
  const [Blogs, setBlogs] = React.useState([])
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [userRole, setUserRole] = React.useState('');
  console.log(userRole);
  const navigate = useNavigate()


  const queryParams = new URLSearchParams(location.search);
  const blogParam = queryParams.get('blog');
  const qcategory = queryParams.get('category');


  // console.log("blog",blogParam);
  // console.log("category",qcategory);

  useEffect(() => {
    const token = localStorage.getItem("token");

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
  }, [location.state]);


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
  const BlogData = Blogs.map((blog) => {

    return (
      <>

        <Card key={blog._id} sx={{ maxWidth: 800, marginBottom: "10px", backgroundColor: "green" }}>

          <CardHeader
            title={blog.category}
            subheader={blog.title}
          />
          <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image={blog.image || "/static/images/cards/default-image.jpg"}
          />
          <CardContent>

            <TruncatedContent content={blog.content} />


          </CardContent>
          <CardActions>
            <IconButton sx={{ color: 'red' }} aria-label="add to favorites">
              <ThumbUpIcon />
            </IconButton>
            <IconButton aria-label="add to dislike" >
              <ThumbDownIcon />
            </IconButton>
            <Button size="small" variant="contained" onClick={() => navigate(`/blog/${blog._id}`)}>Read more</Button>

            {userId === blog.authorId && <Button size="large" variant="contained"
              onClick={() => navigate(`/addblog`, { state: blog })}
            >Edit</Button>}


          </CardActions>
        </Card>
      </>
    )
  }
  )


  return (

    <>
      <Box width={"150px"}>
        <TextField

          margin='normal'
          required
          id="password"
          name="password"
          label="Password"

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
      </Box>
      {userRole === "author" &&

        <Stack direction={"row"} justifyContent="flex-end" alignItems="center">

          <Button
            variant="contained"
            onClick={() => navigate("/addblog")}
            sx={{ textTransform: "none" }}
          >
            + Add Blog
          </Button>
        </Stack>
      }
      {BlogData}
    </>


  )
}

export default Blogs