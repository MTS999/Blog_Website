import React from "react";
import PropTypes from 'prop-types'

import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
function UserProfileAvatar({ userId, userName }) {
    const [allUserData, setAllUserData] = React.useState([])
    const token = localStorage.getItem("token");
    const imageUrl = getImageUrlById(userId);
    //   console.log(allUserData)
    const fetchUserData = async () => {
        // setLoader(true)
        try {

            const response = await axios.get("http://localhost:5003/getalluserdata", {
                headers: {
                    Authorization: `Bearer ${token}`

                }
            })

            // console.log(response.data);
            setAllUserData(response.data)

        } catch (error) {
            console.log(error);
        }
        finally {
            // setLoader(false)
        }
    }

    useEffect(() => {

        fetchUserData()

    }, [token])

    function getImageUrlById(userId) {
        const user = allUserData.find(user => user._id === userId);
        return user ? user.image_url : null;
    }

    return (
        <>

            <Avatar sx={{
                width: 50, height: 50, marginRight: "10px",
                backgroundColor: "green"
            }} display="inline-block">
                {imageUrl ? (
                    <img src={imageUrl} alt="Profile" />
                ) : (
                    userName?.charAt(0).toUpperCase()
                )}
            </Avatar>
        </>
    )
}

export default UserProfileAvatar;





UserProfileAvatar.propTypes = {

    userId: PropTypes.string,
    userName: PropTypes.string

}

