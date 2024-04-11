import React from 'react'
import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import startup from "../images/startup.jpg"
import Logo from "../images/ClubNetlogo-copy.png"
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
// import Loader from '../Load2er';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';



const Signup = () => {
  const theme = useTheme()
  const [formData, setFormData] = React.useState({ first_name: "", last_name: "",user_name:"", email: "", password: "" })
  const [error, setError] = React.useState({ first_name: "", last_name: "",user_name:"", email: "", password: "" });
  const [loader, setLoader] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false);
  const [message, setMessage] = React.useState({ text: "", type: "" })
  const navigate = useNavigate()


  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      navigate("/")
    }
  })

  const handleSubmit = async () => {


    const isValid = handleError();
    setMessage({ text: "", type: "" })
    if (!isValid) {
      return
    }

    setLoader(true)

    try {
      const updatedFormData = { ...formData, role: "reader" };

      const response = await axios.post("http://localhost:5003/signup", updatedFormData)

      console.log(response.data);

      // if (response.data.code === 200) {
        navigate("/login")
        console.log("mts");
      // }

      // else {
        console.error("Login failed:", response.data.message);
        setMessage({ text: response.data.message, type: "error" })
      // }

    }
    catch (error) {
      console.error(error);
      console.error(error.response.data.message);
      setMessage({ text: error.response.data.message, type: "error" })

    }
    setLoader(false)


  }

  console.log(formData);
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
 else   if (!formData.password) {
      newError.password = "Password is required";
      isValid = false;
    }


    setError(newError)
    return isValid



  }




  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      {/* {loader && <Loader />} */}

      <Grid container sx={{ height: "100vh" }}  >

        <Grid item xl={2} lg={2} md={2} sm={3} sx={{
          // backgroundColor: "green",
          display: { xs: 'none', md: 'block' },
        }} textAlign={"end"}>
          <Box

            component={"img"}
            sx={{ width: "150px", height: "auto", mt: "70px" }}

            src={Logo}
            alt="logo"

          />
        </Grid>
        <Grid item xl={5} lg={5} md={5} sm={7} xs={12} sx={{
          backgroundColor: "inherit", display: "flex",
          justifyContent: "start", // Center the child elements horizontally
          // alignItems: "center",
          padding: "0px"
        }} >
          <Box
            sx={{
              mx: 4,
              marginTop: { xs: "0px", md: "150px" },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: "600px",
              width: "100%"
            }}>

            <Box textAlign={"center"}

              component={"img"}
              sx={{
                width: "150px", height: "auto", mt: "50px",
                display: { xs: 'block', md: 'none' },

                marginBottom: "40px"
              }}

              src={Logo}
              alt="logo"

            />
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
                Get started with a   Forever Free Plan                          </Typography>
              <Typography variant="body1" color="initial" textAlign={"start"}>
                Already has an Account?
                {/* <span style={{ color: theme.palette.primary.main }}
                                ><Link style={{ textDecoration: "none" }} to={"/login"}>Login</Link></span> */}
                <span style={{ fontWeight: "bold", marginLeft: "4px" }}>
                  <Link style={{ textDecoration: "none", color: theme.palette.primary.main }} to={"/login"}>Login</Link>
                </span>
              </Typography>

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
                sx={{ width: "100%" }}

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

              />
              {error.email &&
                <Box sx={{ width: "100%" }}>


                  <Typography variant="body1" color="initial" sx={{ color: "red" }}> {error.email}</Typography>
                </Box>

              }

              <TextField

                margin='normal'
                type={showPassword ? "type" : "password"}
                required
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                autoComplete="password"
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}


              />
              {error.password &&


                <Typography variant="body1" color="initial" sx={{ color: "red" }}> {error.password}</Typography>
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

              <Button
                variant='contained'
                fullWidth
                size='large'
                sx={{ mt: 2, mb: 2 }}
                onClick={handleSubmit}

              >
                Sign up
              </Button>


            </Box>

          </Box>

        </Grid>
        <Grid item xl={5} lg={5} md={5} sm={5} xs={false} sx={{
          backgroundImage: `url(${startup})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>


        </Grid>
      </Grid >

    </>
  )
}

export default Signup