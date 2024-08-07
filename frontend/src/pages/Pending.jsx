import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Chip, Typography, Box } from '@mui/material';
const columns = [
    { id: 'index', label: '#', minWidth: 50, align: 'center' },
    // { id: 'action', label: 'Action', minWidth: 170, align: 'center' },
    { id: 'first_name', label: 'First Name', minWidth: 170 },
    { id: 'last_name', label: 'Last Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },

    { id: 'createdAt', label: 'Created At', minWidth: 230, align: 'center' },
    { id: 'updatedAt', label: 'Updated At', minWidth: 230, align: 'center' },
    { id: 'accept', label: 'Accept', minWidth: 230, align: 'center' },
    { id: 'reject', label: 'Reject', minWidth: 230, align: 'center' },


];
function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}
const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
];

const Pending = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [pendingUsers, setPendingUsers] = React.useState([])

  console.log(pendingUsers);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const token = localStorage.getItem("token")

    const fetchData = async () => {

        try {

            const response = await axios.get("http://localhost:5003/pending-request", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response);
            setPendingUsers(response.data)


        }
        catch (error) {

            console.error(error);
        }
    }
    useEffect(() => {


        fetchData()
    }, [token])



    const RequestAccept = async (id) => {


        try {
            const response = await axios.put(`http://localhost:5003/pending-accept/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })


            console.log(response);
            fetchData()


        } catch (error) {
            console.log(error);
        }
    }
    const RequestReject = async (id) => {


        try {
            const response = await axios.put(`http://localhost:5003/pending-reject/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            fetchData()

            console.log(response);


        } catch (error) {
            console.log(error);
        }
    }


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
                pendingUsers.length==0?
                <Box width={"100%"}
                 display={"flex"} alignItems={"center"} justifyContent={"center"}
                  >


                <Typography variant="h4" color="initial" mt={20}>No Request here</Typography>
                </Box>

                :

                <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: "100px" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Box textAlign={"center"} mb={5}>

                            <Typography variant="h4" color="initial" >Request for Author</Typography>
                        </Box>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth ,background:"#BDBDBD"}}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingUsers.map((user, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell align="center" style={{ minWidth: columns[0].minWidth, fontSize: "18px" }}>{index + 1}</TableCell>
                                        {/* <TableCell align="center" style={{ minWidth: columns[9].minWidth, fontSize: "18px" }}>
                                                <Dialog1 userId={user.user._id} setRefreshTable={setRefreshTable} userData={user} />
                                            </TableCell> */}
                                        <TableCell align="left" style={{ minWidth: columns[0].minWidth, fontSize: "18px" }}>{user.first_name}</TableCell>
                                        <TableCell align="left" style={{ minWidth: columns[1].minWidth, fontSize: "18px" }}>{user.last_name}</TableCell>
                                        <TableCell align="left" style={{ minWidth: columns[2].minWidth, fontSize: "18px" }}>{user.email}</TableCell>




                                        <TableCell align="center" style={{ minWidth: columns[3].minWidth, fontSize: "18px" }}>{formatDate(user.createdAt)}</TableCell>
                                        <TableCell align="left" style={{ minWidth: columns[4].minWidth, fontSize: "18px" }}>{formatDate(user.updatedAt)}</TableCell>

                                        <TableCell align="center" style={{ minWidth: columns[5].minWidth, fontSize: "18px" }}>
                                            <Button onClick={() => RequestAccept(user._id)}>
                                                <Chip label={"Accept"} sx={{ backgroundColor: "#E4F8DD", width: "100px", height: "45px", color: "#00A95A", fontWeight: "bold", borderRadius: "5px", fontSize: "16px" }} /></Button>
                                        </TableCell>
                                        <TableCell align="center" style={{ minWidth: columns[6].minWidth, fontSize: "18px" }}>
                                            <Button onClick={() => RequestReject(user._id)}>

                                                <Chip label={"Reject"} sx={{ backgroundColor: "#FFE2E1", width: "100px", height: "45px", color: "#B72237", fontWeight: "bold", borderRadius: "5px", fontSize: "16px" }} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            }

        </>
    )
}

export default Pending