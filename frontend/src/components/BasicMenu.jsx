import * as React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';

export default function BasicMenu(Props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
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
  const handleEditRole = async () => {

    handleClose()

    try {
      const response = await axios.put(`http://localhost:5003/update-role/${Props.userData._id}`,{}, {
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
        {/* <MenuItem onClick={handleClose}>edit</MenuItem> */}
        <MenuItem onClick={handleEditRole}>Change role</MenuItem>
      </Menu>
    </div>
  );
}

BasicMenu.propTypes = {


  userData: PropTypes.object,
  setRefreshTable: PropTypes.func
};