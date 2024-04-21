import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Alert } from "@mui/material";


export default function Profile() {
  const [loader, setloader] = useState(false);
  const [count, setCount] = useState(0)
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate()
  const location = useLocation()
  const [message, setMessage] = React.useState({ text: '', type: '' });

  // console.log(location.state);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: '',
    profile_image: '',
    contact_number: ""
  });
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId")

  useEffect(() => {


    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/userdata`, {
          headers: {
            authorization: `Bearer ${token}`

          }
        })
        console.log(response.data);
        setUserData(response.data)

        const { first_name, last_name, email, role, image_url, contact_number } = response.data;
        setFormData({
          first_name: first_name || "",
          last_name: last_name || "",
          email: email || "",
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

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  // const handleSave = () => {
  //     setCount(pre => pre + 1)
  //     const token = localStorage.getItem("token");
  //     setloader(true)
  //     axios.put(`http://146.190.164.174:4000/api/admin/edit_admin`,

  //         {
  //             first_name: formData.first_name,
  //             last_name: formData.last_name,
  //             contact_number: formData.contact_number,
  //             profile_image: formData.profile_image,
  //             role: formData.role
  //         }
  //         ,

  //         {
  //             headers: {
  //                 'Content-Type': 'application/json',

  //                 'x-sh-auth': token

  //             }
  //         })
  //         .then(response => {
  //             console.log(response.data); // Handle successful response
  //             setMessage({ text: 'admin updated successfully!', type: 'success' });
  //             setloader(false)

  //         })
  //         .catch(error => {
  //             console.error('Error updating up admin:', error); // Handle error
  //             setMessage({ text: error.response.data.message, type: 'error' });
  //             setloader(false)
  //         });
  // };
  const RequestPending = async () => {
        
    
    try {
        const response = await axios.put(`http://localhost:5003/pending`,{}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })


        console.log(response);
        // fetchData()


    } catch (error) {
        console.log(error);
    }
}
  return (
    <>
      <Grid container spacing={2} justifyContent={"space-around"} m={1} mt={6} mr={5} sx={{ paddingLeft: 0 }}>



        {/* {loader && <Loader />} */}
        <Grid item xs={12}>

          <Typography variant="h4" color="initial">{location.state ? "Edit Admin" : "Admin Detail"}</Typography>
        </Grid>
        {/* <div >
        <img  src={formData.profile_image} alt="mts" />
      </div> */}
        <Grid item xs={12}    display={"flex"}
            justifyContent={"center"} >

          <Box
    
         
            width={"100px"}
            borderRadius={10}
          >

            <img
              src={formData.profile_image}
              alt="green iguana"
              height="100px"
              width={"100%"}
              style={{
                borderRadius: "50%"
              }}


            />
          </Box>
        </Grid>

        <Grid item md={6} xs={12} >




          <TextField
            color="success"
            fullWidth
            label="First Name*"
            id="first_name"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            InputProps={{
              readOnly: !location.state
            }} />
        </Grid>

        <Grid item md={6} xs={12} >
          <TextField
            color="success"
            fullWidth
            label="Last Name"
            id="last_name"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            InputProps={{
              readOnly: !location.state
            }}
          />
        </Grid>

        {/* <Grid item md={6} xs={12} >

          <TextField
            color="success"
            fullWidth
            label="Profile Image"
            id="profile_image"
            name="profile_image"
            onChange={handleChange}
            value={formData.profile_image}
            InputProps={{
              readOnly: !location.state
            }}
          />
        </Grid>

        <Grid item md={6} xs={12} >
          <TextField
            color="success"
            fullWidth
            label="Phone Number"
            id="contact_number"
            name="contact_number"
            onChange={handleChange}
            value={formData.contact_number}
            InputProps={{
              readOnly: !location.state
            }}

          />
        </Grid> */}

        <Grid item md={6} xs={12} >
          <TextField
            color="success"
            fullWidth
            label="role"
            id="role"
            name="role"
            onChange={handleChange}
            value={formData.role}
            InputProps={{
              readOnly: !location.state
            }} />
        </Grid>

        <Grid item md={6} xs={12} >
          <TextField
            color="success"
            fullWidth
            label="Email"
            id="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            InputProps={{
              readOnly: !location.state
            }}
          />

          {
            userData?.role==="reader" &&
            <Button  onClick={RequestPending} variant='contained' >request for Author</Button>
          }
        </Grid>
        {message.text && location.state &&
          <Grid container mt={1} ml={2} spacing={2} justifyContent="space-between">

            <Box mb={1} marginRight={"auto"}>
              <Alert severity={message.type}>
                {message.text}
              </Alert>
            </Box>
          </Grid>
        }
        <Grid container mt={1} spacing={2} justifyContent="space-between">
          <Grid item ml={2}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(-1)}
            // sx={{ display: location.state ? "" : "none" }}

            >
              Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="small"
              sx={{ marginLeft: "8px", display: location.state ? "" : "none" }}
            // onClick={handleSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>

      </Grid >


    </>
  );
}
