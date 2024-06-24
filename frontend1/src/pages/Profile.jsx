import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Alert,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

const Profile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    role: "",
    image_url: "",
  });
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [userData, setUserData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [userRole, setUserRole] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:5003/user-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
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
    setLoader(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5003/userdata/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          user_name: response.data.user_name || "",
          role: response.data.role || "",
          image_url: response.data.image_url || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoader(false);
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
    const newError = {};

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
    const isValid = handleError();
    setMessage({ text: "", type: "" });
    if (!isValid) {
      return;
    }
    setLoader(true);

    try {
      let uploadedImageUrl = formData.image_url;
      if (image) {
        uploadedImageUrl = await handleImageUpload();
      }
      const updatedData = { ...formData, image_url: uploadedImageUrl };
      await axios.put(
        `http://localhost:5003/update-user/${params.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({ text: "User updated successfully", type: "success" });
      setEdit(false);
    } catch (error) {
      setMessage({ text: "Error updating user", type: "error" });
      console.error("Error updating user:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setImageUrl(imageUrl);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image_url: imageUrl,
      }));
    }
  }, [image]);

  const handleImageUpload = async () => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "hsgjgqg1");
      data.append("cloud_name", "dwvl4hurg");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwvl4hurg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed: " + response.statusText);
      }

      const jsonResponse = await response.json();
      return jsonResponse.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message || "An error occurred during upload.");
    }
  };
  const handlePending = async () => {
    setLoader(true);
    try {
      const response = await axios.put(
        `http://localhost:5003/pending`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({
        text: "Pending request submitted successfully",
        type: "success",
      });
      setUserRole(response.data.role); // Update the user role in the frontend
    } catch (error) {
      setMessage({ text: "Error submitting pending request", type: "error" });
      console.error("Error submitting pending request:", error);
    } finally {
      setLoader(false);
    }
  };
  return (
    <>
      {loader && <Loader />}
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          item
          sx={{
            backgroundColor: "inherit",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
            margin: "0px auto",
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
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography component="h6" variant="h4" mb={2} fontWeight="bold">
                {edit ? "Edit Profile" : "User Profile"}
              </Typography>

              <Box sx={{ position: "relative", margin: "auto" }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    marginRight: "10px",
                    backgroundColor: "green",
                  }}
                  display="inline-block"
                >
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Profile"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    formData.user_name?.charAt(0).toUpperCase()
                  )}
                </Avatar>
                {edit && (
                  <>
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "green",
                        color: "yellow",
                      }}
                      onClick={() => document.getElementById("image").click()}
                    >
                      <CameraAltIcon />
                    </IconButton>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      style={{ display: "none" }}
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </>
                )}
              </Box>

              <TextField
                margin="normal"
                required
                id="first_name"
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                autoComplete="first_name"
                InputProps={{ readOnly: !edit }}
              />
              {error.first_name && (
                <Box mb={2} minWidth="100%">
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
                autoComplete="last_name"
                InputProps={{ readOnly: !edit }}
              />
              {error.last_name && (
                <Box mb={2} minWidth="100%">
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
                InputProps={{ readOnly: !edit }}
              />
              {error.user_name && (
                <Box mb={2} minWidth="100%">
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
                InputProps={{ readOnly: !edit }}
              />
              {error.email && (
                <Box mb={2} minWidth="100%">
                  <Alert severity="error">{error.email}</Alert>
                </Box>
              )}

              <TextField
                id="role"
                name="role"
                onChange={handleChange}
                value={formData.role}
                label="Role"
                fullWidth
                InputProps={{ readOnly: true }}
              />

              {message.text && (
                <Box mb={2}>
                  <Alert severity={message.type}>{message.text}</Alert>
                </Box>
              )}
              {userData?.role === "reader" &&
                <Button
                  sx={{ mt: 2, mb: 2 }}
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handlePending}
                >
                  
                  Request for author
                </Button>
              }

              {!edit ? (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={() => setEdit(true)}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={() => setEdit(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
