import React from 'react'
import GroupIcon from '@mui/icons-material/Group';
import DomainIcon from '@mui/icons-material/Domain';
import DomainDisabledIcon from '@mui/icons-material/DomainDisabled';
import { useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import axios from 'axios';
// import Loader from '../Loader';
import Typography from '@mui/material/Typography';

import { Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
const Dashboard = () => {


    const [allUserData, setAllUserData] = React.useState([])
    const [allBlogData, setAllBlogData] = React.useState([])
    const [totalLikes, setTotalLikes] = React.useState(0)
    const [totalDisLikes, setTotalDisLikes] = React.useState(0)
    const token = localStorage.getItem("token")

    // console.log(allUserData);
    const fetchUserData = async () => {

        try {

            const response = await axios.get("http://localhost:5003/getalluserdata", {
                headers: {
                    Authorization: `Bearer ${token}`

                }
            })

            // console.log(response.data);
            setAllUserData(response.data.users)

        } catch (error) {
            console.log(error);
        }
    }
    const fetcBlogData = async () => {

        try {

            const response = await axios.get("http://localhost:5003/getallblogdata", {
                headers: {
                    Authorization: `Bearer ${token}`

                }
            })

            console.log(response.data);
            setAllBlogData(response.data)
            let totalLikes = 0
            response.data.forEach(element => {
                totalLikes += element.likes.length
            });
            setTotalLikes(totalLikes)
            let totalDisLikes = 0
            response.data.forEach(element => {
                totalDisLikes += element.dislikes.length
            });
            setTotalDisLikes(totalDisLikes)


        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        fetchUserData()
        fetcBlogData()
    }, [token])





    return (

        <>

            <Container maxWidth="lg" sx={{ marginTop: "90px" }}>


                <Typography variant="h4" color="initial">Hi Welcome</Typography>
                <Grid container p={4} spacing={3} justifyContent={"space-evenly"}>
                    <Grid item xs={12} md={6} lg={4} >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                    maxWidth: 370,
                                    width: "100%",
                                    height: 220,
                                    backgroundColor: "#E9FCD4"
                                },
                            }}
                        >
                            <Paper sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                            }} >
                                <GroupIcon sx={{ marginBottom: "20px" }} />
                                <Typography variant="h4" color="initial" style={{ fontWeight: 'bold' }}>{allUserData.length}</Typography>
                                <Typography variant="body1" color="initial">Total Users</Typography>

                            </Paper>
                        </Box>



                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                    maxWidth: 370,
                                    width: "100%",
                                    height: 220,
                                    backgroundColor: "#D0F2FF"
                                },
                            }}
                        >
                            <Paper sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                            }} >
                                <GroupIcon sx={{ marginBottom: "20px" }} />
                                <Typography variant="h4" color="initial" style={{ fontWeight: 'bold' }}>
                                    {allUserData.filter(user => user.role === "author").length}
                                </Typography>
                                <Typography variant="body1" color="initial">Total author</Typography>

                            </Paper>
                        </Box>



                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                    maxWidth: 370,
                                    width: "100%",
                                    height: 220,
                                    backgroundColor: "#FFE7D9"
                                },
                            }}
                        >
                            <Paper sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                            }} >
                                <GroupIcon sx={{ marginBottom: "20px" }} />
                                <Typography variant="h4" color="initial" style={{ fontWeight: 'bold' }}>
                                    {allUserData.filter(user => user.role === "reader").length}

                                </Typography>
                                <Typography variant="body1" color="initial">Total Users</Typography>

                            </Paper>
                        </Box>



                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                    maxWidth: 370,
                                    width: "100%",
                                    height: 220,
                                    backgroundColor: "#FFE7D9"
                                },
                            }}
                        >
                            <Paper sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                            }} >
                                <GroupIcon sx={{ marginBottom: "20px" }} />
                                <Typography variant="h4" color="initial" style={{ fontWeight: 'bold' }}>
                                    {allBlogData.length}

                                </Typography>
                                <Typography variant="body1" color="initial">Total blogs</Typography>

                            </Paper>
                        </Box>



                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                    maxWidth: 370,
                                    width: "100%",
                                    height: 220,
                                    backgroundColor: "#FFE7D9"
                                },
                            }}
                        >
                            <Paper sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                            }} >
                                <GroupIcon sx={{ marginBottom: "20px" }} />
                                <Typography variant="h4" color="initial" style={{ fontWeight: 'bold' }}>
                                    {totalLikes}
                                </Typography>
                                <Typography variant="body1" color="initial">Total Likes</Typography>

                            </Paper>
                        </Box>



                    </Grid>
                    <Grid item xs={12} md={6} lg={4} >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                    maxWidth: 370,
                                    width: "100%",
                                    height: 220,
                                    backgroundColor: "#FFE7D9"
                                },
                            }}
                        >
                            <Paper sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                            }} >
                                <GroupIcon sx={{ marginBottom: "20px" }} />
                                <Typography variant="h4" color="initial" style={{ fontWeight: 'bold' }}>
                                    {totalDisLikes}

                                </Typography>
                                <Typography variant="body1" color="initial">Total Dislikes</Typography>

                            </Paper>
                        </Box>



                    </Grid>

                </Grid>
 
            </Container>

        </>
    )
}

export default Dashboard