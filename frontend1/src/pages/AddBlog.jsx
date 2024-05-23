import React, { useEffect, useState } from 'react'
import useCategory from "../CategoryContext";
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem';
import { Button, Grid, Box } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import Loader from '../components/Loader';
import BlogCard from '../components/BlogCard';

export const AddBlog = () => {
    const [loader, setLoader] = React.useState(false);

    const { category, setCategory } = useCategory();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [blogData, setBlogData,] = React.useState({ title: "", category: "Technology", image: "https://picsum.photos/seed/picsum8/800/400", content: "" })
    const location = useLocation()
     
    console.log(blogData);

    //  show image on page
    useEffect(() => {
        if (image) {
            const imageUrl = URL.createObjectURL(image);
            setImageUrl(imageUrl);
        }
     

    }, [image]);

    // set data of blog to be updated
    useEffect(() => {
        if (image) {
            const imageUrl = URL.createObjectURL(image);
            setImageUrl(imageUrl);
        }
        setBlogData({
            title:location.state?.title,
            category:location.state?.category,
            image:location.state?.image,
            content:location.state?.content
        })
        setImageUrl(location.state?.image);

    }, []);
   
    //function to handle any change in  data
    function handleChange(event) {
        const { name, value } = event.target

        setBlogData(
            {
                ...blogData,
                [name]: value
            }
        )
    }



    async function handleAdd() {

        const token = localStorage.getItem("token");
        const updatedData = { ...blogData }
        if (image) {
            const uploadedImageUrl = await handleClick();
            updatedData.image = uploadedImageUrl
        }
        setLoader(true)
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
        finally {
            setLoader(false)
        }




    }
    async function handleClick() {
        setError(null);
        setLoader(true)
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
            setLoader(false)

        }
    }

 
    return (

        <>
            {
                loader &&

                <Loader />
            }


            <Container maxWidth="md" sx={{ marginTop: "80px" }} >

                <Grid container display={"flex"} justifyContent={"center"} alignItems={"center"} >


                    < Grid item xs={12} textAlign={"center"}>
                        <Typography variant="h3" color="initial">Add New Blog</Typography>
                    </Grid>

                    < Grid item sm={8} xs={12} textAlign={"center"} mt={2}>
                        <Box maxWidth={500}>

                            <TextField
                                id="title"
                                name="title"
                                label="Title"
                                value={blogData.title}
                                onChange={handleChange}
                                fullWidth


                            />
                        </Box>
                    </Grid>
                    < Grid item sm={4} xs={12} textAlign={"center"} mt={2}>

                        <TextField
                            fullWidth
                            id="category"
                            name='category'
                            onChange={handleChange}
                            value={blogData.category}
                            select
                            label="category"
                            defaultValue={"mts"}

                        >
                            {category.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                    </Grid>


                    {/* <input type="file" name="image" id="image" onChange={(e) => setImage(e.target.files[0])} /> */}

                    <Grid item xs={12} textAlign={"center"} mt={4} >
                        

                        <Box>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            {imageUrl && (
                                <img
                                    id="previewImage"
                                    src={imageUrl}
                                    alt="Selected"
                                    style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '5px' }}
                                />
                            )}
                        </Box>
                    </Grid>



                    < Grid item xs={12} textAlign={"center"} mt={4}>
                        <Typography variant="h4" color="initial" mb={4}>Content</Typography>
                        <ReactQuill

                            id="content"
                            value={blogData.content}
                            onChange={(value) => setBlogData({ ...blogData, content: value })}
                            modules={{ toolbar: true }}
                            formats={['bold', 'italic', 'underline', 'list', 'bullet']}
                            style={{ height: '400px', borderRadius: "10px" }} // Adjust the height value as needed

                        />
                    </Grid>
                    < Grid item xs={12} textAlign={"center"} mt={6}>

                        <Button variant='contained' onClick={handleAdd}>  {location.state ? "Update" : "Add"}</Button>
                    </Grid>
                </Grid>

            </Container>


        </>
    )
}
