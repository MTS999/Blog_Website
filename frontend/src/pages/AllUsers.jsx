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
import  Chip  from '@mui/material/Chip';

const columns = [
    { id: 'index', label: '#', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Action', minWidth: 170, align: 'center' },
    { id: 'first_name', label: 'First Name', minWidth: 170 },
    { id: 'last_name', label: 'Last Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'role', label: 'role', minWidth: 170, align: 'center' },
    { id: 'blog', label: 'blog', minWidth: 170, align: 'center' },
    { id: 'followers', label: 'followers', minWidth: 170, align: 'center' },
    { id: 'following', label: 'folowing', minWidth: 170, align: 'center' },
    { id: 'createdAt', label: 'Created At', minWidth: 230, align: 'center' },
    { id: 'updatedAt', label: 'Updated At', minWidth: 230, align: 'center' },
    // { id: 'subscription_status', label: 'Subscription Status', minWidth: 170, align: 'center' },
    // { id: 'status', label: 'Status', minWidth: 170, align: 'center' },
    // { id: 'total_domains', label: 'Domain', minWidth: 170, align: 'center' },
   
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

export default function AllUsers() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [allUserData, setAllUserData] = React.useState([])
  const [allBlogData, setAllBlogData] = React.useState([])


console.log(allBlogData);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const token = localStorage.getItem("token")

  const fetchUserData = async () => {

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
        // let totalLikes = 0
        // response.data.forEach(element => {
        //     totalLikes += element.likes.length
        // });
        // setTotalLikes(totalLikes)
        // let totalDisLikes = 0
        // response.data.forEach(element => {
        //     totalDisLikes += element.dislikes.length
        // });
        // setTotalDisLikes(totalDisLikes)


    } catch (error) {
        console.log(error);
    }
}
useEffect(() => {

    fetchUserData()
    fetcBlogData()
}, [token])


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
    <Paper  m sx={{ width: '100%', overflow: 'hidden',marginTop:"100px" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {allUserData.map((user, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell align="center" style={{ minWidth: columns[0].minWidth, fontSize: "18px" }}>{ index + 1}</TableCell>
                                            <TableCell align="center" style={{ minWidth: columns[9].minWidth, fontSize: "18px" }}>
                                                {/* <Dialog1 userId={user.user._id} setRefreshTable={setRefreshTable} userData={user} /> */}
                                            </TableCell>
                                            <TableCell align="left" style={{ minWidth: columns[0].minWidth, fontSize: "18px" }}>{user.first_name}</TableCell>
                                            <TableCell align="left" style={{ minWidth: columns[1].minWidth, fontSize: "18px" }}>{user.last_name}</TableCell>
                                            <TableCell align="left" style={{ minWidth: columns[2].minWidth, fontSize: "18px" }}>{user.email}</TableCell>
                                            <TableCell align="center" style={{ minWidth: columns[2].minWidth, fontSize: "18px" }}>{user.role}</TableCell>
                                            <TableCell align="center" style={{ minWidth: columns[2].minWidth, fontSize: "18px" }}>
                                                
                                                {allBlogData.filter(blog=>blog.authorId===user._id).length}
                                                
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
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}