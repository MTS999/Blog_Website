import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Avatar, Typography } from "@mui/material";
import BlogCard from "../components/BlogCard";
const AllDataOfUser = () => {
  const [userDadta, setUserData] = React.useState({});
  const [userblogs, setUserBlogs] = React.useState([]);
  const [page] = React.useState(0);
  const [rowsPerPage] = React.useState(4);
  const [refresh, setRefresh] = React.useState(true);

  const token = localStorage.getItem("token");
  //   console.log(user);
  const params = useParams();

  // useEffect(() => {
  //   fetchData();
  // }, [refresh]);
  // how to handle reaing list
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

  // fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5003/userdata/${params.id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data, "sdvdf");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [params.id, token]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5003/userblog/${params.id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setUserBlogs(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [params.id, token, refresh]);
  return (
    <>
      {userDadta && (
        <Box mt={5} sx={{ marginTop: "150px" }} width={"100%"}>
          <Box
           display={"flex"} flexDirection={"column"}
          >
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} mb={2}>

            <Avatar
              sx={{
                width: 100,
                height: 100,
                marginRight: "10px",
                backgroundColor: "green",
                }}
              // display="inline-block"
            >
              {userDadta.image_url ? (
                <img
                  src={userDadta.image_url}
                  width={"100px"}
                  height={"100px"}
                  alt="Profile"
                />
              ) : (
                userDadta.userName?.charAt(0).toUpperCase()
                )}
            </Avatar>

            </Box>
            <Typography
              variant="h4"
              alignContent={"start"}
              display={"inline-block"}
            >
              {userDadta.first_name} {userDadta.last_name}
            </Typography>
            <Typography variant="body1" display={"inline-block"}>
              {userDadta.user_name}
            </Typography>
            <Typography variant="body1" display={"inline-block"}>
              followers : {userDadta.followers?.length}
            </Typography>
            <Typography variant="body1" display={"inline-block"}>
              following : {userDadta.following?.length}
            </Typography>
          </Box>
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} mt={5} padding={5} margin={"auto"}>
            {userblogs && userblogs.length > 0 ? (
              userblogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  userData={userDadta}
                  userId={params.id}
                  // blogParam={params.blog}
                  handle_reading_list={handle_reading_list}
                  setRefresh={setRefresh}
                />
              ))
            ) : (
              <Typography variant="h6">No Blogs Available</Typography>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default AllDataOfUser;
