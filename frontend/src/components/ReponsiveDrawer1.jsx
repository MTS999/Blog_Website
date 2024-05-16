import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useCategory from "../CategoryContext";
// import { useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PendingIcon from '@mui/icons-material/Pending';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
// import SchoolIcon from '@mui/icons-material/School';
import FoodBankIcon from '@mui/icons-material/FoodBank';
const drawerWidth = 200;
// import image from "../images/blogLogo.png"
import UserProfileAvatar from "./UserProfileAvatar"

function ReponsiveDrawer1(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const { category, setCategory } = useCategory();
  const [userRole, setUserRole] = React.useState('');
  const [userData, setUserData] = React.useState(null)
  const [pendingUsers, setPendingUsers] = React.useState([])
  const [selectedItem, setSelectedItem] = React.useState('Home'); // Initially selected as 'dashboard'

  const handleListItemClick = (itemName) => {
    setSelectedItem(itemName);

};

  // console.log(pendingUsers)
  const [selectedCategory, setSelectedCategory] = React.useState("Home");
  const userId = localStorage.getItem("userId");
  console.log(userData);


  const navigate = useNavigate()
  //Manu start
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const token = localStorage.getItem("token");

  const fetchData = async () => {

    try {

      const response = await axios.get("http://localhost:5003/pending-request", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response);
      setPendingUsers(response.data)


    }
    catch (error) {

      console.error(error);
    }
  }
  useEffect(() => {


    fetchData()
  }, [token])


  useEffect(() => {


    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/userdata`, {
          headers: {
            Authorization: `Bearer ${token}`

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
  }, [token])
  //  end
  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
    }

  })

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



  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };


  const handleLogout = () => {
    // Clear token and user ID from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Redirect the user to the login page or perform any other necessary action
    navigate("/login")
  };

  const drawer = (
    <div>
      <Toolbar />
      {/* <Toolbar /> */}
      {/* <Divider /> */}
      <List>
        {


          <ListItem key={"home"} disablePadding
          selected={selectedItem === 'Home'}
          onClick={() => handleListItemClick('Home')}

          >
            <ListItemButton onClick={() => navigate(`/`)}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>
        }
        {
          userRole === "admin" &&

          <ListItem key={"dashboard"}
          selected={selectedItem === 'dashboard'}
          onClick={() => handleListItemClick('dashboard')}
          disablePadding>
            <ListItemButton onClick={() => navigate(`/dashboard`)}>
              <ListItemIcon>
                <DashboardIcon />

              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </ListItem>
        }
        {
          userRole === "admin" &&

          <ListItem key={"pending request"} disablePadding
          selected={selectedItem === 'pending'}
          onClick={() => handleListItemClick('pending')}
          >
            <ListItemButton onClick={() => navigate(`/pending-request`)}>
              <ListItemIcon>
                <PendingIcon />

              </ListItemIcon>

              <ListItemText>
                {pendingUsers.length > 0 ?

                  (
                    <Typography sx={{ color: 'red' }}>
                      Pending ({pendingUsers.length})
                    </Typography>
                  ) :
                  (
                    "Pending"
                  )}
              </ListItemText>
            </ListItemButton>
          </ListItem>
}
        {
          userRole === "admin" &&

          <ListItem key={"alllusers"}
          selected={selectedItem === 'allusers'}
          onClick={() => handleListItemClick('allusers')}
          disablePadding>
            <ListItemButton onClick={() => navigate(`/allusers`)}>
              <ListItemIcon>
                <PeopleIcon />

              </ListItemIcon>
              <ListItemText primary={"AllUsers "} />
            </ListItemButton>
          </ListItem>
        }
        {
          userRole === "author" &&

          <ListItem key={"myblogs"}
          selected={selectedItem === 'myblogs'}
          onClick={() => handleListItemClick('myblogs')}
          
          disablePadding>
            <ListItemButton onClick={() => navigate(`/myblog`)}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"myblog"} />
            </ListItemButton>
          </ListItem>
        }


        <ListItem key={"reading-list"}
        
        selected={selectedItem === 'reading'}
        onClick={() => handleListItemClick('reading')}
        disablePadding>
          <ListItemButton onClick={() => navigate(`/reading-list`)}>
            <ListItemIcon>
              <BookmarkAddIcon />
            </ListItemIcon>
            <ListItemText primary={"Reading_list"} />
          </ListItemButton>
        </ListItem>

        {

          userRole === "author" &&

          <ListItem key={"add-blog"} 
          selected={selectedItem === 'addblog'}
          onClick={() => handleListItemClick('addblog')}
          disablePadding>
            <ListItemButton onClick={() => navigate(`/addblog`)}>
              <ListItemIcon>
                <BookmarkAddIcon />
              </ListItemIcon>
              <ListItemText primary={"AddBlog"} />
            </ListItemButton>
          </ListItem>
        }
        {category.map((text, index) => (
          <ListItem key={text} 
          selected={selectedItem === `${text}`}
          onClick={() => handleListItemClick(`${text}`)}
          disablePadding>
            <ListItemButton onClick={() => navigate(`/${text}`)}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <FoodBankIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

    </div>
  );
  function navigatehandle(text) {
    if (text === "Home") {
      navigate("/")
      setSelectedCategory("Home")
    }
    else if (text === "Reading_list") {
      navigate(`/?blog=reading-list`)
      setSelectedCategory("Reading_list")
    }
    else {
      navigate(`/?category=${text}`, { state: { text } })
      setSelectedCategory(text)
    }
  }


  function profileAction() {
    handleClose()
    navigate("/profile")
  }
  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          // width:"100vw",
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: 1234,
          // backgroundColor: "white",
          // color: "black"


        }}
      >
        <Toolbar

          sx={{

            backgroundColor: "#BDBDBD",

          }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* <img src={image} alt=""  width="60px" /> */}
          <Typography variant="h4" noWrap component="div" mr={"auto"} color={"#000000"} fontWeight={"bold"}>
            Blog
          </Typography>


          <div>
            <Stack ml={2} direction="row" spacing={2} onClick={handleClick}
            >

              {userData &&


                <UserProfileAvatar userId={userId} userName={userData.user_name} />
              }


            </Stack>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={profileAction}>Profile</MenuItem>
              {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>

        </Toolbar>
        <Box
          sx={{
            display: { xs: 'none', md: 'none' },

          }}>

          <div>
            <ul style={{ display: "flex", alignItems: "center", justifyContent: "center", listStyle: "none" }}>
              <li
                key={"Home"}
                onClick={() => navigatehandle("Home")}
                style={{
                  borderBottom: selectedCategory === "Home" ? '3px solid green' : 'none',
                }
                }
              >Home  </li>
              <li
                key={"Reading_list"}
                onClick={() => navigatehandle("Reading_list")}
                style={{
                  borderBottom: selectedCategory === "Reading_list" ? '3px solid green' : 'none',
                }
                }
              >Reading List  </li>

              {category.map((item) => (

                <li key={item}
                  onClick={() => navigatehandle(item)}
                  style={{
                    borderBottom: selectedCategory === item ? '3px solid green' : 'none',
                    marginBottom: "4px"
                  }}

                >{item} </li>
                // <li key={item} onClick={() => navigatehandle(`/?category=${item}`, { state: { item } })}  >{item} </li>


              ))}

            </ul>
          </div>
        </Box>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>


        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
      </Box> */}
      {/* <Toolbar /> */}

      <Outlet />
    </Box>
  );
}

ReponsiveDrawer1.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default ReponsiveDrawer1;
