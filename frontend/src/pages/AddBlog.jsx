import React, { useEffect, useState } from 'react'
import useCategory from "../CategoryContext";
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles


export const AddBlog = () => {
  const { category, setCategory } = useCategory();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [blogData, setBlogData,] = React.useState({ title: "", category: "", image: "https://picsum.photos/seed/picsum8/800/400", content: "" })
  const location = useLocation()

  // console.log("mts l,", location.state);
  // console.log(blogData);
  function handleChange(event) {
    const { name, value } = event.target

    setBlogData(
      {
        ...blogData,
        [name]: value
      }
    )
  }


  useEffect(() => {
    if (location.state) {
      setBlogData(
        {

          title: location.state.title,
          content: location.state.content,
          image: location.state.image,
          category: location.state.category
        }

      )
    }
  }, [location.state])

  async function handleAdd() {

    const token = localStorage.getItem("token");
    const updatedData = { ...blogData }
    if (image) {
      const uploadedImageUrl = await handleClick();
      updatedData.image = uploadedImageUrl
    }

    try {
      const apiUrl = location.state ? `http://localhost:5003/update/${location.state._id}` : 'http://localhost:5003/addblog';
      const method = location.state ? 'put' : 'post';

      const response = await axios({
        method,
        url: apiUrl,
        data: updatedData,
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }




  }
  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "hsgjgqg1");
      data.append("cloud_name", "dwvl4hurg");

      const response = await fetch("https://api.cloudinary.com/v1_1/dwvl4hurg/image/upload", {
        method: "POST",
        body: data
      });

      if (!response.ok) {
        throw new Error('Upload failed: ' + response.statusText);
      }

      const jsonResponse = await response.json();
      console.log("Upload successful:", jsonResponse);
      return jsonResponse.url;

      // setImageUrl(jsonResponse.url); // Store the uploaded image URL

    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  }
  return (

    <>
      <Container maxWidth="lg" sx={{ marginTop: "100px" }}>

        <TextField
          id="title"
          name="title"
          label="Title"
          value={blogData.title}
          onChange={handleChange}

        />

        <TextField
          id="category"
          name='category'
          onChange={handleChange}
          value={blogData.category}
          select
          label="category"
          defaultValue={"mts"}
          helperText="Please select your category"
        >
          {category.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>


        <div>
          <input type="file" name="image" id="image" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        {/* <TextField
          id="content"
          name='content'
          onChange={handleChange}
          value={blogData.content}
          label="Content"
          multiline
          rows={20}
          fullWidth
        // defaultValue="Default Value"
        /> */}
        <ReactQuill
          id="content"
          value={blogData.content}
          onChange={(value) => setBlogData({ ...blogData, content: value })}
          modules={{ toolbar: true }}
          formats={['bold', 'italic', 'underline', 'list', 'bullet']}
          
        />


        <Button variant='contained' onClick={handleAdd}>  {location.state ? "Update" : "Add"}</Button>
      </Container>


    </>
  )
}