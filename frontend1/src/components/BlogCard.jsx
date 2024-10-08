// components/BlogCard.jsx
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  IconButton,
  Chip,
} from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import UserProfileAvatar from "./UserProfileAvatar";
import Like_Dislike from "./Like_Dislike";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const BlogCard = ({
  blog,
  userData,
  userId,
  blogParam,
  handle_reading_list,
  setRefresh,
}) => {
  // console.log(blog);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [BlogId, setBlogId] = React.useState(null);
  const DeleteBlog = async (blogId) => {
    try {
      console.log("how are you");
      const response = await axios.delete(
        `http://localhost:5003/deleteblog/${blogId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh((pre) => !pre);
      alert("blog delete successfully");
      // console.log(response.data);
    } catch (error) {
      console.error("Error deleting  blog:", error);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id) => {
    setBlogId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function confirmDelete() {
    DeleteBlog(BlogId);
    handleClose();
  }



  const handleReadClick = (blogId) => {
    window.scrollTo(0, 0);
    navigate(`/blog/${blogId}`);
  };
  return (
    <>
      <Card
        key={blog._id}
        sx={{
          borderRadius: "8px",
          width: "100%",
          maxWidth: 750,
          marginBottom: "20px",
          padding: "15px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, .3)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box
            displayPrint={{ sm: "inline-block", xs: "flex" }}
            width={{ sm: "50%", xs: "99%" }}
            textAlign={"left"}
            display={"flex"}
            justifyContent={"center "}
            flexDirection={"column"}
            flexWrap={"wrap"}
          >
            <Box
              display="flex"
              alignItems={"center"}
              mb={2}
              onClick={() => navigate(`/userInfo/${blog.authorId}`)}
            >
              <UserProfileAvatar
                userId={blog.authorId}
                userName={blog.user_name}
              />
              <Box>
                <Typography
                  mr={1}
                  display={"inline-block"}
                  variant="h6"
                  fontWeight={"bold"}
                >
                  {`${blog.user_name}  `}
                </Typography>
                <Typography display={"inline-block"} variant="body1">
                  {new Date(blog.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </Typography>
              </Box>
              <Box display={{ sm: "none", xs: "block" }} ml={"auto"}>
                <CloseIcon
                  onClick={() => handleClickOpen(blog._id)}
                  sx={{
                    marginBottom: "20px",
                    ml: "auto",
                    position: "relative",
                    top: "0px",
                    right: "0px",
                  }}
                />
              </Box>
            </Box>
            <Typography variant="h5" fontWeight={"600"} mb={1}>
              {blog.title}
            </Typography>
            <Box display={{ sm: "none", xs: "inline-block" }} width={"100%"}>
              <img
                src={blog.image}
                alt="green iguana"
                width={"100%"}
                height={"100%"}
              />
            </Box>
            <CardContent sx={{ padding: "0px" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </CardContent>
            <CardActions>
              <Box>
                <Like_Dislike blog={blog} setRefresh={setRefresh} />
                {userData && (
                  <IconButton
                    aria-label="add or delete from reading_list"
                    onClick={() => handle_reading_list(blog._id)}
                    sx={{
                      color: userData.reading_list?.includes(blog._id)
                        ? "brown"
                        : "inherit",
                    }}
                  >
                    <LibraryAddIcon />
                  </IconButton>
                )}
                <Box mr={2} display={"inline-block"}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleReadClick(blog._id)}
                  >
                    Read
                  </Button>
                </Box>
                {userId === blog.authorId && blogParam === "myblog" && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/addblog`, { state: blog })}
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </CardActions>
          </Box>
          <Box
            display={{ xs: "none", sm: "inline-block" }}
            width={{ sm: "50%", xs: "100%" }}
          >
            <Box mb={2} display={"flex"}>
              <Chip size="large" label={blog.category} />
              {(userData?.role === "admin" ||
                (blogParam === "myblog" &&
                  userId === blog.authorId &&
                  blogParam === "myblog")) && (
                // <Button variant="outlined" onClick={handleClickOpen}>
                <CloseIcon
                  // onClick={() => DeleteBlog(blog._id)}
                  onClick={() => handleClickOpen(blog._id)}
                  sx={{
                    marginBottom: "20px",
                    ml: "auto",
                    position: "relative",
                    top: "0px",
                    right: "10px",
                  }}
                />
                // </Button>
              )}
            </Box>
            <img
              src={blog.image}
              alt="green iguana"
              height="200"
              width={"100%"}
              style={{ borderRadius: "5px" }}
            />
          </Box>
        </Box>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {/* {"Use Google's location service?"} */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={confirmDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    user_name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  userData: PropTypes.shape({
    reading_list: PropTypes.arrayOf(PropTypes.string),
    role: PropTypes.string,
  }),
  userId: PropTypes.string,
  blogParam: PropTypes.any,
  handle_reading_list: PropTypes.func.isRequired,
  setRefresh: PropTypes.func.isRequired,
};

export default BlogCard;
