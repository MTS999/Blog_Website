import axios from "axios";
import React from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Divider } from "@mui/material";

import FormControl from "@mui/material/FormControl";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import RecentBlogCard from "../components/RecentBlogCard";
import { useParams } from "react-router-dom";
import { Select, MenuItem, InputLabel } from "@mui/material";

const Blogs = () => {
  const [SearchBy, setSearchBy] = React.useState("title");

  const handleChange = (event) => {
    setSearchBy(event.target.value);
  };
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };
  const [allUserData, setAllUserData] = React.useState([]);
  const [loader, setLoader] = React.useState(false);

  const [userData, setUserData] = React.useState(null);
  const [Search, setSearch] = React.useState("");
  const [SortBy, setSortBy] = React.useState("recent"); // State to handle sorting

  const [Blogs, setBlogs] = React.useState([]);
  // const [selectedCategory, setSelectedCategory] = React.useState("");
  const [userRole, setUserRole] = React.useState("");
  const [recentBlogs, setRecentBlogs] = React.useState([]);
  const [refresh, setRefresh] = React.useState(true);
  const [underline, setUnderline] = React.useState(true);
  const navigate = useNavigate();
  let params = useParams();
  // console.log("mtsss", params.blog);
  // console.log(SortBy);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  // console.log(userId);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [totalBlogs, setTotalBlogs] = React.useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //// fetch usedata
  const fetchUserData = async () => {
    // setLoader(true)
    try {
      const response = await axios.get("http://localhost:5003/getalluserdata", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(response.data);
      setAllUserData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoader(false)
    }
  };

  const fetchData = async () => {
    try {
      let url = `http://localhost:5003/blogs`;
      if (params.blog) {
        url += `/${params.blog}`;
      } else {
        url += `/all`;
      }

      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", rowsPerPage);
      queryParams.append("sort", SortBy === "most_liked" ? "likes" : "recent");

      if (Search) {
        queryParams.append("searchBy", SearchBy);
        queryParams.append("search", Search);
      }

      url += `?${queryParams.toString()}`;
      console.log(params);
      const response = await axios.post(
        url,
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlogs(response.data.result);
      setTotalBlogs(response.data.totalCount);
      console.log(response.data.totalCount);
      console.log(response.data.result);
    } catch (error) {
      console.error("Error fetching Blogs:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    fetchData();
  }, [params, page, rowsPerPage, SortBy, Search, SearchBy, ]);

  useEffect(() => {
    // setLoader(true);
    fetchData();
  }, [refresh]);

  useEffect(() => {
    setPage(0);
    setRowsPerPage(6);
  }, [params]);
  // fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5003/userdata/${userId}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching data   mts:", error);
      }
    };
    if (token) {
      fetchData();
    }
  }, [userId, token]);

  // fetch recent blgs'

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchRecentBlogs = async () => {
      try {
        // Make the HTTP request using Axios to get recent blogs
        const response = await axios.get("http://localhost:5003/recent-blogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update state with fetched blogs
        setRecentBlogs(response.data);
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
        // setBlogs([]); // Optionally handle error state
      }
    };

    fetchRecentBlogs();
  }, [refresh]);

  // gete user-role

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:5003/user-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRole(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    if (token) {
      fetchUserRole();
    }
  }, [userRole]);
  //    apply search functionality
  useEffect(() => {
    const fetchBlogs = async () => {
      let body;
      if (SearchBy === "" || SearchBy === "title") {
        body = { title: Search };
      } else if (SearchBy === "user_name") {
        body = { user_name: Search };
      }
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", page); // assuming you have 'page' state for the current page number
        queryParams.append("limit", rowsPerPage);
        const response = await axios.post(
          "http://localhost:5003/search",
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log(response.data);
        setBlogs(response.data.result);
        setTotalBlogs(response.data.totalCount);
      } catch (error) {
        console.log("mts", error);
      }
    };

    fetchBlogs();
  }, [Search, token, SearchBy]);

  // handle reading list functionality
  async function handle_reading_list(postId) {
    const token = localStorage.getItem("token");

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page); // assuming you have 'page' state for the current page number
      queryParams.append("limit", rowsPerPage); // assuming you have 'limit' state for the number of blogs per page
      const response = await axios.post(
        `http://localhost:5003/reading-list/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.userData);
      // Update the state with the updated Blogs array
      setUserData(response.data.userData);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  function handleForyou() {
    navigate(`/all`);
    setUnderline(true);
  }
  function handleFollowing() {
    navigate(`/following`);
    setUnderline(false);
  }

  const BlogData =
    Blogs && Blogs.length > 0 ? (
      Blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          blog={blog}
          userData={userData}
          userId={userId}
          blogParam={params.blog}
          handle_reading_list={handle_reading_list}
          setRefresh={setRefresh}
        />
      ))
    ) : (
      <Box
        height={"400px"}
        width={"100%"}
        textAlign={"center"}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Typography variant="h3" fontWeight={"bold"}>
          No Available
        </Typography>
      </Box>
    );

  return (
    <>
      {loader && <Loader />}
      <Box
        boxSizing={"border-box"}
        mt={10}
        style={{
          width: "100%",
          // backgroundColor:"red",
          overflowX: "hidden",
          // padding:"10px"
        }}
      >
        <Box
          mb={3}
          display={"flex"}
          alignItems={"center"}
          textAlign={"center"}
          sx={{ padding: "10px" }}
        >
          <TextField
            sx={{
              maxWidth: "150px",
              marginRight: "10PX",
            }}
            margin="normal"
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
                  <IconButton edge="start">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={SearchBy} // Set the value of radio group to SearchBy
              onChange={handleChange} // Handle change for radio buttons
            >
              <FormControlLabel
                value="title"
                control={<Radio />}
                label="title"
              />
              <FormControlLabel
                value="user_name"
                control={<Radio />}
                label="Author"
              />
            </RadioGroup>
          </FormControl> */}
          <FormControl>
            <InputLabel id="search-by-label">Search</InputLabel>
            <Select
              labelId="search-by-label"
              id="search-by"
              value={SearchBy}
              label="Title"
              onChange={handleChange}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="user_name">Author</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={SortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="recent">Recent</MenuItem>
              <MenuItem value="most_liked">Most Liked</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box pl={6} display={"block"} textAlign={"start"} mb={1}>
          <Button
            sx={{
              fontSize: "18px",
              borderBottom: underline ? "4px solid white" : "",
            }}
            onClick={handleForyou}
            width="large"
            varient="contained"
          >
            {" "}
            For You
          </Button>
          {token && (
            <Button
              sx={{
                fontSize: "18px",
                borderBottom: !underline ? "4px solid white" : "",
              }}
              varient="contained"
              onClick={handleFollowing}
            >
              {" "}
              Following
            </Button>
          )}
        </Box>

        <Divider />
        <Grid container mt={4} justifyContent={"space-around"}>
          {/* <Divider /> */}
          <Grid
            item
            sx={{
              // padding: "40px",
              paddingLeft: { xs: "20px", sm: "40px" },
              paddingRight: { xs: "20px", sm: "40px" },

              paddingTop: "0px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
            xs={12}
            lg={7}
          >
            {/* <Typography variant="h3" mb={3} > Blogs</Typography> */}

            {BlogData.length === 0 ? (
              <>
                <Typography variant="h3">Blog no Found</Typography>

                <Divider variant="fullWidth" orientation="horizontal" />
              </>
            ) : (
              BlogData
            )}
            {BlogData.length > 0 && (
              <Box display={"block"} textAlign={"end"} width={"100%"}>
                <TablePagination
                  rowsPerPageOptions={[6, 8, 20]}
                  component="div"
                  count={totalBlogs}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            )}
          </Grid>

          <Divider />

          <Grid
            item
            sx={{
              // padding: "10px",
              // padding: { xs: '20px', sm: '40px' },

              paddingTop: "0px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
            xs={12}
            lg={4}
          >
            <Typography variant="h4" fontWeight={"bold"} mb={3}>
              Recent Posts
            </Typography>
            <Box
              width={"100%"}
              maxWidth={700}
              display={"flex"}
              justifyContent={"space-around"}
              flexWrap={"wrap"}
            >
              {recentBlogs.length > 0 &&
                recentBlogs.map((blog) => {
                  return (
                    <RecentBlogCard
                      key={blog._id}
                      blog={blog}
                      userId={userId}
                      blogParam={params.blog}
                      setRefresh={setRefresh}
                    />
                  );
                })}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Blogs;
