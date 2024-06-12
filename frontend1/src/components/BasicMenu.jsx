import * as React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';



export default function BasicMenu(Props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate=useNavigate()
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // console.log(Props.userData);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const token = localStorage.getItem("token")

  const handleDelete = async () => {

    handleClose()

    try {
      const response = await axios.delete(`http://localhost:5003/deleteuser/${Props.userData._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      Props.setRefreshTable(pre => !pre)

      console.log(response);





    }

    catch (error) {
      console.log(error);
    }

  }

    const handleEdit=()=>{
      navigate(`/adminuserprofile/${Props.userData._id}`)
      handleClose()

    }
    const handleProfile=()=>{
      navigate(`/userInfo/${Props.userData._id}`)
      handleClose()

    }
  return (
    <div>
      <MoreVertIcon
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
      </MoreVertIcon>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleDelete}>delete</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
      </Menu>
    </div>
  );
}

BasicMenu.propTypes = {


  userData: PropTypes.object,
  setRefreshTable: PropTypes.func
};