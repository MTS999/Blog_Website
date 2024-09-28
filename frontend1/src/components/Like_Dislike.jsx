import React from "react";
import PropTypes from "prop-types";

import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import axios from "axios";


import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";

// eslint-disable-next-line react-refresh/only-export-components
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

function Like_Dislike(props) {
  const [open, setOpen] = React.useState(false);
  // console.log(open);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const userId = localStorage.getItem("userId");

  async function handleLike(postId) {
    const token = localStorage.getItem("token");
    if (!token) {
      handleClickOpen();

      console.log("no token there");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5003/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      props.setRefresh((pre) => !pre);

      console.log(response.data.blogPost.likes);
    } catch (error) {
      console.error("Error liking post:", error);
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
      const response = await axios.post(
        `http://localhost:5003/dislike/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      props.setRefresh((pre) => !pre);
    } catch (error) {
      console.error("Error disliking:", error);
    }
  }
  return (
    <>
      <IconButton
        sx={{
          color: props.blog.likes.includes(userId) ? "green" : "inherit",
        }}
        aria-label="add to favorites"
        onClick={() => handleLike(props.blog._id)}
      >
        <ThumbUpIcon /> {props.blog.likes.length}
      </IconButton>
      <IconButton
        aria-label="add to dislike"
        onClick={() => handleDislike(props.blog._id)}
        sx={{
          color: props.blog.dislikes.includes(userId) ? "red" : "inherit",
        }}
      >
        <ThumbDownIcon /> {props.blog.dislikes.length}
      </IconButton>

      <Dialog
        open={open}
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
  );
}

Like_Dislike.propTypes = {
  blog: PropTypes.object,
  setRefresh: PropTypes.func,
};

export default Like_Dislike;
