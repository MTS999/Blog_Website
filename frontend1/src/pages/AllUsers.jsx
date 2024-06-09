import * as React from 'react';
import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import BasicMenu from '../components/BasicMenu';
import Loader from '../components/Loader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const columns = [
    { id: 'index', label: '#', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Action', minWidth: 170, align: 'center' },
    { id: 'first_name', label: 'First Name', minWidth: 170 },
    { id: 'last_name', label: 'Last Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
    { id: 'role', label: 'role', minWidth: 170, align: 'center' },
    { id: 'blog', label: 'blog', minWidth: 170, align: 'center' },
    { id: 'followers', label: 'followers', minWidth: 170, align: 'center' },
    { id: 'following', label: 'folowing', minWidth: 170, align: 'center' },
    { id: 'createdAt', label: 'Created At', minWidth: 230, align: 'center' },
    { id: 'updatedAt', label: 'Updated At', minWidth: 230, align: 'center' },


];



export default function AllUsers() {
    const [loader, setLoader] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const [totalCount, settotalCount] = React.useState(0)
    const [allUserData, setAllUserData] = React.useState([])
    const [allBlogData, setAllBlogData] = React.useState([])
    const [refreshTable, setRefreshTable] = React.useState(false)
    console.log(allUserData);

    // console.log(allUserData);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const token = localStorage.getItem("token")



    const fetchUserData = async () => {
        setLoader(true);
        try {
            let url = "http://localhost:5003/getalluserdata";
            const queryParams = new URLSearchParams();
            queryParams.append("page", page);
            queryParams.append("limit", rowsPerPage);

            url += `?${queryParams.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Update state with total count and paginated user data
            settotalCount(response.data.totalCount);
            setAllUserData(response.data.users);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoader(false);
        }
    };


    const fetcBlogData = async () => {
        setLoader(true)

        try {

            const response = await axios.get("http://localhost:5003/getallblogdata", {
                headers: {
                    Authorization: `Bearer ${token}`

                }
            })

            // console.log(response.data);
            setAllBlogData(response.data)



        } catch (error) {
            console.log(error);
        }
        finally {
            setLoader(false)
        }
    }
    useEffect(() => {

        fetchUserData()
        fetcBlogData()
    }, [token, refreshTable, page,rowsPerPage])


    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };
    return (

        <> 
         {
            loader &&
            <Loader />
        }
            <Paper m sx={{ width: '100%', overflow: 'hidden', marginTop: "100px" }}>
                        <Typography variant="h3"  >All Uesrs</Typography>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Box mb={3} textAlign={"center"}>

                    </Box>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{
                                            minWidth: column.minWidth, backgroundColor: "#BDBDBD",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allUserData && allUserData.map((user, index) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                    <TableCell align="center" style={{ minWidth: columns[0].minWidth, fontSize: "18px" }}>{((page*rowsPerPage)+index) + 1}</TableCell>
                                    <TableCell align="center" style={{ minWidth: columns[9].minWidth, fontSize: "18px" }}>
                                        <BasicMenu
                                            //  userId={user._id}
                                            setRefreshTable={setRefreshTable}
                                            userData={user}
                                        />
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: columns[0].minWidth, fontSize: "18px" }}>{user.first_name}</TableCell>
                                    <TableCell align="left" style={{ minWidth: columns[1].minWidth, fontSize: "18px" }}>{user.last_name}</TableCell>
                                    <TableCell align="center" style={{ minWidth: columns[2].minWidth, fontSize: "18px" }}>{user.email}</TableCell>
                                    <TableCell align="center" style={{ minWidth: columns[2].minWidth, fontSize: "18px" }}>{user.role}</TableCell>
                                    <TableCell align="center" style={{ minWidth: columns[2].minWidth, fontSize: "18px" }}>

                                        {allBlogData.filter(blog => blog.authorId === user._id).length}

                                    </TableCell>
                                    <TableCell align="center" style={{ minWidth: columns[2].minWidth, fontSize: "18px" }}>{user.followers.length}</TableCell>
                                    <TableCell align="center" style={{ minWidth: columns[2].minWidth, fontSize: "18px" }}>{user.following.length}</TableCell>



                                    <TableCell align="center" style={{ minWidth: columns[7].minWidth, fontSize: "18px" }}>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell align="center" style={{ minWidth: columns[8].minWidth, fontSize: "18px" }}>{formatDate(user.updatedAt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[4, 8, 100]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>

    );
}