import React, { useState } from 'react';

const Mts = () => {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            setImageUrl(jsonResponse.url); // Store the uploaded image URL

            console.log("Upload successful:", jsonResponse);
        } catch (error) {
            console.error("Error uploading image:", error);
            setError(error.message || 'An error occurred during upload.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={handleClick} disabled={!image || loading}>Upload</button>
            {loading && <p>Uploading...</p>}
            {error && <p>Error: {error}</p>}
            {imageUrl && <img src={imageUrl}  alt='upload'/>}
        </>
    );
}

export default Mts;


// import React from 'react'

// const Mts = () => {

//     const [image,setImage]=React.useState("")
//     console.log(image);
//     console.log("mts");


//   async  function  handleClick(){

//     const data=new FormData()
//     data.append("file",image)
//     data.append("upload_preset","hsgjgqg1")
//     data.append("cloud_name","dwvl4hurg")


//     const response = await fetch("https://api.cloudinary.com/v1_1/dwvl4hurg/image/upload", {
//         method: "POST",
//         body: data
//       });
//   }
//   return (

//     <>
//        <input type="file" onChange={(e)=>setImage(e.target.files[0])}

// />
//                 <button onClick={handleClick}>mts</button>
       
       
       
//     </>
//   )
// }

// export default Mts
