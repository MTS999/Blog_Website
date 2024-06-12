import React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import startup from "../images/startup.jpg";
import Logo from "../images/ClubNetlogo-copy.png";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { Link, resolvePath, useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
// import Loader from '../Load2er';
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

const AdminUserprofile = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    password: "",
  });

  console.log(error);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [userData, setUserData] = useState(null);
  const [Edit, setEdit] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [role, setRole] = useState(["admin", "reader", "author"]);

  const params = useParams();
  // const navigate = useNavigate();

  const token = localStorage.getItem("token");
  // const userId = localStorage.getItem("userId");

  //find the user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:5003/user-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRole(response.data);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    if (token) {
      fetchUserRole();
    }
  }, [token]);

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
        setUserData(response.data);

        const {
          first_name,
          user_name,
          last_name,
          email,
          role,
          image_url,
          contact_number,
        } = response.data;
        setFormData({
          first_name: first_name || "",
          last_name: last_name || "",
          email: email || "",
          user_name: user_name || "",
          role: role || "",
          profile_image: image_url || "",
          contact_number: contact_number || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (token) {
      fetchData();
    }
  }, [params.id, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleError = () => {
    let isValid = true;
    const nameFormat = /^[a-zA-Z]+$/;
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newError = { first_name: "", last_name: "", email: "", password: "" };

    if (!formData.first_name) {
      newError.first_name = "First Name is required";
      isValid = false;
    } else if (!nameFormat.test(formData.first_name)) {
      newError.first_name = "First Name should only contain alphabets";
      isValid = false;
    }

    if (!formData.last_name) {
      newError.last_name = "Last Name is required";
      isValid = false;
    } else if (!nameFormat.test(formData.last_name)) {
      newError.last_name = "Last Name should only contain alphabets";
      isValid = false;
    }

    if (!formData.user_name) {
      newError.user_name = "Username is required";
      isValid = false;
    }

    if (!formData.email) {
      newError.email = "Email is required";
      isValid = false;
    } else if (!emailFormat.test(formData.email)) {
      newError.email = "Invalid email format";
      isValid = false;
    }


    setError(newError);
    return isValid;
  };

  const handleSubmit = async () => {
    console.log("how are oyyy");
    const isValid = handleError();
    setMessage({ text: "", type: "" });
    if (!isValid) {
      return;
    }
    
      try {
        const response = await axios.put(
          `http://localhost:5003/update-user/${params.id}`,
          formData,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        console.log("how are oyyyooooooooooooooooooooooooooooooooooo");
        setMessage({ text: "User updated successfully", type: "success" });
        setEdit(false);
        // Optionally, you can fetch the updated data again or update state directly
      } catch (error) {
        setMessage({ text: "Error updating user", type: "error" });
        console.error("Error updating user:", error);
      }
    
  };

  return (
    <>
      {/* {loader && <Loader />} */}
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          item
          sx={{
            backgroundColor: "inherit",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
            margin: " 0px auto",
          }}
        >
          <Box
            sx={{
              mx: 4,
              marginTop: { xs: "100px", md: "100px" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "600px",
              width: "100%",
              minWidth: { sm: "500px" },
            }}
          >
            <Box
              sx={{
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                width: "100%",
              }}
            >
              <Typography
                component="h6"
                variant="h4"
                mb={2}
                fontWeight={"bold"}
              >
                {Edit ? "Edit User" : "User Profile"}
              </Typography>

              <TextField
                margin="normal"
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
                  readOnly: !Edit,
                }}
              />
              {error.first_name && (
                <Box mb={2} minWidth={"100%"}>
                  <Alert severity="error">{error.first_name}</Alert>
                </Box>
              )}

              <TextField
                margin="normal"
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
                  readOnly: !Edit,
                }}
              />
              {error.last_name && (
                <Box mb={2} minWidth={"100%"}>
                  <Alert severity="error">{error.last_name}</Alert>
                </Box>
              )}

              <TextField
                margin="normal"
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
                  readOnly: !Edit,
                }}
              />
              {error.user_name && (
                <Box mb={2} minWidth={"100%"}>
                  <Alert severity="error">{error.user_name}</Alert>
                </Box>
              )}

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
                InputProps={{
                  readOnly: !Edit,
                }}
              />
              {error.email && (
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="body1"
                    color="initial"
                    sx={{ color: "red" }}
                  >
                    {error.email}
                  </Typography>
                </Box>
              )}

              {userRole === "admin" && (
                <TextField
                  // fullWidth
                  id="role"
                  name="role"
                  onChange={handleChange}
                  value={formData.role}
                  select
                  label="role"
                  defaultValue={formData.role}
                  fullWidth
                >
                  {role.map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                      defaultValue={formData.role}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {message.text && (
                <Box mb={2}>
                  <Alert severity={message.type}>{message.text}</Alert>
                </Box>
              )}

              {Edit === false && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2, mb: 2 }}
                  onClick={() => setEdit((pre) => !pre)}
                >
                  Edit
                </Button>
              )}
              {Edit && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              )}
              {Edit && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2, mb: 2 }}
                  onClick={() => setEdit(false)}
                >
                  Cancle
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminUserprofile;
