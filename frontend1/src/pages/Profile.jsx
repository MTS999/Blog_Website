import React from 'react'
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import startup from "../images/startup.jpg"
import Logo from "../images/ClubNetlogo-copy.png"
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
// import Loader from '../Load2er';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from "@mui/material/MenuItem"
import axios from 'axios';
import { useTheme } from '@mui/material/styles';




const Profile = () => {
  const theme = useTheme()
  const [formData, setFormData] = React.useState({ first_name: "", last_name: "", user_name: "", email: "", password: "",role:"" })
  const [error, setError] = React.useState({ first_name: "", last_name: "", user_name: "", email: "", password: "" });
  const [loader, setLoader] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false);
  const [message, setMessage] = React.useState({ text: "", type: "" })
  const [userData, setUserData] = React.useState(null);
  const [Edit, setEdit] = React.useState(false);
  const [userRole, setUserRole] = React.useState('');
  const [role, setRole] = React.useState(["admin", "reader", "author"])

  const params = useParams()
  console.log(Edit);
  //  console.log(params.id);
  const navigate = useNavigate()


  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId")


  //find the user role 
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
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    if (token) {
      fetchUserRole();
    }
  }, [userRole]);
  useEffect(() => {


    const fetchData = async () => {
      try {


        const response = await axios.get(`http://localhost:5003/userdata/${params.id}`, {
          headers: {
            authorization: `Bearer ${token}`

          }
        })
        // console.log(response.data);
        setUserData(response.data)

        const { first_name, user_name, last_name, email, role, image_url, contact_number } = response.data;
        setFormData({
          first_name: first_name || "",
          last_name: last_name || "",
          email: email || "",
          user_name: user_name || "",
          role: role || "",
          profile_image: image_url || "",
          contact_number: contact_number || ""
        });

      }

      catch (error) {
        console.error('Error fetching data   mts:', error);
      }
    }
    if (token) {
      fetchData()
    }
  }, [userId, token])

  

  // console.log(formData);
  function handleChange(event) {
    const { name, value } = event.target

    setFormData(
      {
        ...formData,
        [name]: value
      }
    )

  }

  function handleError() {
    let isValid = true
    const nameFormat = /^[a-zA-Z]+$/;
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newError = { first_name: "", last_name: "", email: "", password: "" };



    if (!formData.first_name) {
      newError.first_name = "First Name is required";
      isValid = false;
    }
    else if (!nameFormat.test(formData.first_name)) {
      newError.first_name = "First Name should only contain alphabets";
      isValid = false;
    }

    else if (!formData.last_name) {
      newError.last_name = "Last Name is required";
      isValid = false;
    }
    else if (!nameFormat.test(formData.last_name)) {
      newError.last_name = "Last Name should only contain alphabets";
      isValid = false;
    }
    else if (!formData.user_name) {
      newError.user_name = "Last Name is required";
      isValid = false;
    }


    else if (!formData.email) {
      newError.email = "Email is required"
      isValid = false
    }
    else if (!emailFormat.test(formData.email)) {
      newError.email = "Invalid email format";
      isValid = false;
    }
    else if (!formData.password) {
      newError.password = "Password is required";
      isValid = false;
    }
    else {
      // Check password conditions
      if (!/[a-z]/.test(formData.password)) {
        newError.password = "Password must contain at least one lowercase character";
        isValid = false;
      }
      else if (!/[A-Z]/.test(formData.password)) {
        newError.password = "Password must contain at least one uppercase character";
        isValid = false;
      }
      else if (!/\d/.test(formData.password)) {
        newError.password = "Password must contain at least one number";
        isValid = false;
      }
      else if (formData.password.length < 8) {
        newError.password = "Password must be at least 8 characters long";
        isValid = false;
      }
    }


    setError(newError)
    return isValid



  }






  return (
    <>
      {/* {loader && <Loader />} */}

      <Grid container sx={{ height: "100vh" }}  >

        <Grid item
          //  xl={5} lg={5} md={5} sm={7} xs={12}
          sx={{
            backgroundColor: "inherit",
            display: "flex",
            justifyContent: "center", // Center the child elements horizontally
            alignItems: "center",
            padding: "0px",
            margin: " 0px auto"
          }} >
          <Box
            sx={{
              mx: 4,
              marginTop: { xs: "100px", md: "100px" },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: "600px",
              width: "100%",
              minWidth: { sm: "500px" }
            }}>


            <Box
              sx={{
                mx: 4,
                // marginTop:{ xs:"50px",md:"150px"  },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                // maxWidth: "450px",
                width: "100%"
              }}
            >

              <Typography component="h6" variant="h4" mb={2} fontWeight={"bold"}>
                Add new user                        </Typography>


              <TextField
                margin='normal'

                required
                id="first_name"
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                autoComplete="email"
                autoFocus
                InputProps={{
                  readOnly: !Edit
                }}
              // sx={{ width: "100%" }}

              />
              {error.first_name && (
                <Box mb={2} minWidth={"100%"}>
                  <Alert severity="error">
                    {error.first_name}
                  </Alert>
                </Box>
              )}
              <TextField
                margin='normal'

                required
                id="last_name"
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                autoComplete="email"
                autoFocus
                InputProps={{
                  readOnly: !Edit
                }}
              />
              {error.last_name && (
                <Box mb={2} minWidth={"100%"}>
                  <Alert severity="error">
                    {error.last_name}
                  </Alert>
                </Box>
              )}
              <TextField
                margin='normal'

                required
                id="user_name"
                name="user_name"
                label="Username"
                value={formData.user_name}
                onChange={handleChange}
                fullWidth
                autoComplete="user_name"
                autoFocus
                InputProps={{
                  readOnly: !Edit
                }}
              />
              {error.user_name && (
                <Box mb={2} minWidth={"100%"}>
                  <Alert severity="error">
                    {error.user_name}
                  </Alert>
                </Box>
              )}
              <TextField
                margin='normal'

                required
                id="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                autoComplete="email"
                autoFocus
                InputProps={{
                  readOnly: !Edit
                }}
              />
              {error.email &&
                <Box sx={{ width: "100%" }}>


                  <Typography variant="body1" color="initial" sx={{ color: "red" }}> {error.email}</Typography>
                </Box>

              }

              <TextField
                id="role"
                name='role'
                onChange={handleChange}
                value={formData.role}
                label="role"
                defaultValue={"mts"}
                fullWidth
                InputProps={{
                  readOnly: !Edit || userRole!=="admin"
                }}
              />
              { userRole==="admin"  &&

                <TextField
                  // fullWidth
                  id="role"
                  name='role'
                  onChange={handleChange}
                  value={formData.role}
                  select
                  label="role"
                  defaultValue={formData.role}
                  fullWidth
                >
                  {role.map((option) => (
                    <MenuItem key={option} value={option} defaultValue={formData.role}>
                      {option}
                    </MenuItem>
                  ))}  
                </TextField>

              }


              {error.password &&

                <Box mb={2}>
                  <Alert severity="error">
                    {error.password}
                  </Alert>
                </Box>
              }
              {message.text && (
                <Box mb={2}>
                  <Alert severity={message.type}>
                    {message.text}
                  </Alert>
                </Box>
              )}

              {Edit === false &&

                <Button
                  variant='contained'
                  fullWidth
                  size='large'
                  sx={{ mt: 2, mb: 2 }}
                  onClick={() => setEdit(pre => !pre)}

                >
                  {Edit ? "Save" : "Edit"}            </Button>}
              {
                Edit &&
                <Button
                  variant='contained'
                  fullWidth
                  size='large'
                  sx={{ mt: 2, mb: 2 }}
                  onClick={handleSubmit}

                >
                  {Edit ? "Save" : "Edit"}            </Button>
              }


            </Box>

          </Box>

        </Grid>
        {/* <Grid item xl={5} lg={5} md={5} sm={5} xs={false} sx={{
            backgroundImage: `url(${startup})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>


        </Grid> */}
      </Grid >

    </>
  )
}

export default Profile