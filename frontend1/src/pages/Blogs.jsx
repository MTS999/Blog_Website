import axios from "axios"
import React from 'react'
import { useEffect } from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { useLocation, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { Divider } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import BlogCard from "../components/BlogCard";
import Loader from '../components/Loader';
import RecentBlogCard from "../components/RecentBlogCard";
import { useParams } from "react-router-dom";


const Blogs = () => {

    const [SearchBy, setSearchBy] = React.useState('');

    const handleChange = (event) => {
        setSearchBy(event.target.value);
    };
    const [allUserData, setAllUserData] = React.useState([])
    const [loader, setLoader] = React.useState(false);

    const [userData, setUserData] = React.useState(null)
    const [Search, setSearch] = React.useState("")
    const [Blogs, setBlogs] = React.useState([])
    // const [selectedCategory, setSelectedCategory] = React.useState("");
    const [userRole, setUserRole] = React.useState('');
    const [recentBlogs, setRecentBlogs] = React.useState([]);
    const [refresh, setRefresh] = React.useState(true)

    // console.log(allUserData);
    const navigate = useNavigate()
    const params = useParams()
    console.log("mtsss", params.blog);


    // console.log(blogParam);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId")
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const [totalBlogs, setTotalBlogs] = React.useState(0);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    //// fetch usedata
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



    const fetchData = async () => {

        try {
            let url
            if (params.blog) {

                url = `http://localhost:5003/blogs/${params.blog}`;
            }
            else {
                url = `http://localhost:5003/blogs`;

            }


            const queryParams = new URLSearchParams();

            console.log(url, page, rowsPerPage);
            queryParams.append("page", page); // assuming you have 'page' state for the current page number
            queryParams.append("limit", rowsPerPage); // assuming you have 'limit' state for the number of blogs per page

            url += `?${queryParams.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data);
            setBlogs(response.data.result);
            setTotalBlogs(response.data.totalCount)
        } catch (error) {
            console.error('Error fetching Blogs:', error);
        } finally {
            setLoader(false);
        }
    };


    useEffect(() => {

        setLoader(true)
        fetchData();

    }, [params, page, rowsPerPage]);

    useEffect(() => {

        fetchData()

    }, [refresh])

    useEffect(() => {
        setPage(0)
        setRowsPerPage(4)
    }, [params])
    // fetch user data
    useEffect(() => {


        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5003/userdata`, {
                    headers: {
                        authorization: `Bearer ${token}`

                    }
                })
                // console.log(response.data);
                setUserData(response.data)

            }

            catch (error) {
                console.error('Error fetching data   mts:', error);
            }
        }
        if (token) {
            fetchData()
        }
    }, [userId, token])
    //// recent blog

    // fetch recent blgs'

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchRecentBlogs = async () => {
            try {
                // Make the HTTP request using Axios to get recent blogs
                const response = await axios.get('http://localhost:5003/recent-blogs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Update state with fetched blogs
                setRecentBlogs(response.data);
            } catch (error) {
                console.error('Error fetching recent blogs:', error);
                setBlogs([]); // Optionally handle error state
            }
        };

        fetchRecentBlogs();
    }, [refresh]);



    // gete user-role

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchUserRole = async () => {
            try {
                const response = await axios.get("http://localhost:5003/user-role", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserRole(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        if (token) {
            fetchUserRole();
        }
    }, [userRole]);
    //    apply search functionality
    useEffect(() => {
        const fetchBlogs = async () => {
            let body
            if (SearchBy === "" || SearchBy === "title") {
                body = { title: Search }
            }
            else if (SearchBy === "user_name") {
                body = { user_name: Search }

            }
            try {
                const queryParams = new URLSearchParams();
                queryParams.append("page", page); // assuming you have 'page' state for the current page number
                queryParams.append("limit", rowsPerPage);
                const response = await axios.post("http://localhost:5003/search",
                    body, {
                    headers: {
                        Authorization: `Bearer ${token}`

                    }
                })


                console.log(response.data);
                setBlogs(response.data.result)
                setTotalBlogs(response.data.totalCount)

            } catch (error) {
                console.log("mts", error);
            }
        }

        if (token) {
            fetchBlogs();
        }

    }, [Search, token, SearchBy])

    // handle reading list functionality
    async function handle_reading_list(postId) {
        const token = localStorage.getItem("token");

        try {

            const queryParams = new URLSearchParams();
            queryParams.append("page", page); // assuming you have 'page' state for the current page number
            queryParams.append("limit", rowsPerPage); // assuming you have 'limit' state for the number of blogs per page
            const response = await axios.post(`http://localhost:5003/reading-list/${postId}`, {}, {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            })
            console.log(response.data.userData);
            // Update the state with the updated Blogs array
            setUserData(response.data.userData);

        }
        catch (error) {
            console.error('Error liking post:', error);

        }
    }



    const BlogData = Blogs && Blogs.length > 0 ?

        Blogs.map((blog) => (



            <BlogCard
                key={blog._id}
                blog={blog}
                userData={userData}
                userId={userId}
                blogParam={params.blog}
                handle_reading_list={handle_reading_list}
                setRefresh={setRefresh}
            />

        )
        )
        : (
            <Typography variant="h6">No Blogs Available</Typography>
        )




    return (

        <>

            {
                loader &&
                <Loader />
            }
            <Box boxSizing={"border-box"}
                mt={10}
                style={{
                    width: '100%',
                    // backgroundColor:"red",
                    overflowX: "hidden",
                    // padding:"10px"


                }} >

                <Box mb={3} display={"flex"}
                    alignItems={"center"}
                    textAlign={"center"} sx={{ padding: "10px" }} >


                    <TextField
                        sx={{
                            maxWidth: "150px",
                            marginRight: "10PX"
                        }}

                        margin='normal'
                        required
                        id="search"
                        name="search"
                        label="Search"
                        value={Search}
                        onChange={(e) => setSearch(e.target.value)}

                        size="small"
                        // small
                        autoComplete="search"
                        autoFocus
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        // onClick={handleTogglePasswordVisibility}
                                        edge="start"
                                    >
                                        <SearchIcon />

                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}

                    />


                    <FormControl >
                        <RadioGroup

                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={SearchBy} // Set the value of radio group to SearchBy
                            onChange={handleChange} // Handle change for radio buttons
                        >
                            <FormControlLabel value="title" control={<Radio />} label="title" />
                            <FormControlLabel value="user_name" control={<Radio />} label="Author" />


                        </RadioGroup>
                    </FormControl>
                </Box>
                <Box pl={6} display={"block"} textAlign={"start"} mb={3}>
                    <Button varient="contained" onClick={() => navigate(`/`)}> For You</Button>
                    <Button varient="contained" onClick={() => navigate(`/following`)}> Following</Button>


                </Box>
                {/* <Box>
                    <TablePagination
                        rowsPerPageOptions={[4, 15, 20]}
                        component="div"
                        count={totalBlogs}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box> */}
                <Divider />
                <Grid container mt={4} >


                    {/* <Divider /> */}
                    <Grid item
                        sx={{
                            padding: "10px", paddingTop: "0px", width: "100%", display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                        xs={12} lg={7}
                    >
                        <Typography variant="body1" color="initial"></Typography>

                        {BlogData.length === 0 ?
                            <>
                                <Typography variant="h3" color="initial">Blog no Found</Typography>

                                <Divider
                                    variant="fullWidth"
                                    orientation="horizontal"

                                />
                            </>

                            :
                            BlogData}
                        <Box display={"block"} textAlign={"end"}>
                            <TablePagination
                                rowsPerPageOptions={[4, 15, 20]}
                                component="div"
                                count={totalBlogs}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Box>
                    </Grid>

                    <Divider />

                    <Grid item
                        sx={{
                            padding: "10px", paddingTop: "0px", width: "100%",
                            display: "flex", alignItems: "center", flexDirection: "column",

                        }}
                        xs={12} lg={4}
                    >

                        <Typography variant="h3" color="initial">Recent Posts</Typography>
                        <Box width={"100%"} maxWidth={700}
                            display={"flex"} justifyContent={"space-around"}
                            flexWrap={"wrap"}
                        >

                            {recentBlogs.length > 0 &&

                                recentBlogs.map((blog) => {
                                    return (

                                        <RecentBlogCard
                                            key={blog._id}
                                            blog={blog}
                                            userId={userId}
                                            blogParam={params.blog}
                                            setRefresh={setRefresh}
                                        />
                                    )
                                }
                                )
                            }
                        </Box>

                    </Grid>

                </Grid>

            </Box>
        </>

    )
}

export default Blogs