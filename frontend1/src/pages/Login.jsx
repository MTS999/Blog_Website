import React from "react";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import startup from "../images/startup.jpg";
import Logo from "../images/blog3.png";
import blogLogo from "../images/blog3.png";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Alert from "@mui/material/Alert";
// import Loader from '../Loader';
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const theme = useTheme();

  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState({ email: "", password: "" });
  const [loader, setLoader] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [message, setMessage] = React.useState({ text: "", type: "" });
  const navigate = useNavigate();
  console.log("Messege", message);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/all");
    }
  });

  const handleSubmit = async () => {
    // const isValid = handleError();
    // if (!isValid) {
    //     return
    // }
    setLoader(true);

    try {
      // const updatedFormData = { ...formData, type: 0 };

      const response = await axios.post(
        "http://localhost:5003/login",
        formData
      );

      console.log("mtsssssssssssssssssss", response.data);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);

        navigate("/all");
        // console.log("mts");
      } else {
        console.log("Login failed:", response);
        setMessage({ text: response.data.message, type: "error" });
      }
      // console.log("i am amts")
    } catch (error) {
      console.error(error);
      console.error(error.response.data.message);
      setMessage({ text: error.response.data.message, type: "error" });
      // setMessage({ text: "invalid email or password", type: "error" })
    }
    setLoader(false);
  };

  // console.log(formData);
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleError() {
    let isValid = true;
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newError = { email: "", password: "" };

    if (!formData.email) {
      newError.email = "Email is required";
      isValid = false;
    } else if (!emailFormat.test(formData.email)) {
      newError.email = "Invalid email format";
      isValid = false;
    } else if (!formData.password) {
      newError.password = "Password is required";
      isValid = false;
    }

    setError(newError);
    return isValid;
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      {/* {loader && <Loader />} */}

      <Grid container sx={{ height: "100vh" }} height={"100vh"} backgroundColor={"background.default"}>
        <Grid
          item
          xl={2}
          lg={2}
          md={2}
          sm={3}
          sx={{
            display: { xs: "none", md: "block" },
          }}
          textAlign={"center"}
        >
          <Box
            component={"img"}
            sx={{
              width: "250px",
              height: "auto",
              mt: "30px",
              color: "red",
            }}
            src={blogLogo}
            alt="logo"
          />
        </Grid>
        <Grid
          item
          xl={5}
          lg={5}
          md={5}
          sm={7}
          xs={12}
          sx={{
            backgroundColor: "inherit",
            display: "flex",
            justifyContent: "center", // Center the child elements horizontally

            padding: "0px",
          }}
        >
          <Box
            sx={{
              // my: 8,
              mx: 4,
              marginTop: { xs: "50px", md: "200px" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "450px",
              width: "100%",
            }}
          >
            <Box
              textAlign={"center"}
              component={"img"}
              sx={{
                width: "150px",
                height: "auto",
                mt: "50px",
                display: { xs: "block", md: "none" },

                marginBottom: "40px",
              }}
              src={Logo}
              alt="logo"
            />
            <Box
              sx={{
                mx: 4,
                // marginTop:{ xs:"50px",md:"150px"  },
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                maxWidth: "450px",
                width: "100%",
              }}
            >
              <Typography component="h6" variant="h4" mb={2}>
                Sign in to your Mailcub Account
              </Typography>
              <Typography variant="body1" textAlign={"start"} mb={2}>
                Do not have an account yet?{" "}
                <strong>
                  <Link
                    to={"/signup"}
                    style={{
                      textDecoration: "none",
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                    }}
                  >
                    Sign up
                  </Link>
                </strong>
              </Typography>

              <TextField
                margin="normal"
                required
                id="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                autoComplete="email"
                autoFocus
                sx={{ width: "100%" }} // Set width explicitly
              />
              {error.email && (
                <Box mb={2} minWidth={"100%"}>
                  <Alert severity="error">{error.email}</Alert>
                </Box>
              )}
              <TextField
                margin="normal"
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error.password && (
                <Box mb={2} minWidth={"100%"}>
                  <Alert severity="error">{error.password}</Alert>
                </Box>
              )}
              {message.text && (
                <Box mb={2} minWidth={"100%"}>
                  <Alert severity="error">{message.text}</Alert>
                </Box>
              )}

              <Typography
                variant="body1"
                color="initial"
                textAlign={"end"}
                mb={2}
                mt={1}
              >
                <Link
                  to={"#"}
                  style={{
                    textDecoration: "none",
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  <strong>Forgot your password</strong>
                </Link>
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                style={{
                  backgroundColor: theme.palette.primary.main,
                }}
                // sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                {loader ? (
                  <CircularProgress
                    size={24}
                    thickness={8}
                    sx={{ color: "white" }}
                  />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xl={5}
          lg={5}
          md={5}
          sm={5}
          xs={false}
          sx={{
            backgroundImage: `url(${startup})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Grid>
      </Grid>
    </>
  );
};

export default Login;
