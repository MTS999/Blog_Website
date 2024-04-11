import React, { useEffect } from 'react'
import useCategory from "../CategoryContext";
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import  axios  from 'axios';
import { useLocation } from 'react-router-dom';

export const AddBlog = () => {
  const { category, setCategory } = useCategory();

  const [blogData, setBlogData,] = React.useState({ title: "", category: "", image: "https://picsum.photos/seed/picsum8/800/400", content: "" })
  const location=useLocation()

  console.log("mts l,",location.state);
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
  

  useEffect(()=>{
    if(location.state){
      setBlogData(
        {

          title:location.state.title ,
          content:location.state.content,
          image:location.state.image,
          category:location.state.category
        }

      )
    }
  },[location.state])

 async function  handleAdd(){

    try {
      const token = localStorage.getItem("token");
      let response={}
      if(location.state){
        
         response = await axios.put(`http://localhost:5003/update/${location.state._id}`,blogData,{
          headers:{
            Authorization: `Bearer ${token}`
  
          }
        })
      }
      else{
         response = await axios.post(`http://localhost:5003/addblog`,blogData,{
          headers:{
            Authorization: `Bearer ${token}`
  
          }
        })

      }
    
    
      console.log(response);
    } catch (error) {
   console.log(error);
    }


  }
  return (

    <>
      <Container maxWidth="lg">

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


        <TextField
          id="content"
          name='content'
          onChange={handleChange}
          value={blogData.content}
          label="Content"
          multiline
          rows={20}
          fullWidth
          // defaultValue="Default Value"
        />

        <Button variant='contained' onClick={handleAdd}>  { location.state? "Update":"Add"}</Button>
      </Container>


    </>
  )
}
