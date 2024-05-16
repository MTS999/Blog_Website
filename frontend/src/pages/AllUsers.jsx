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
import  Box  from '@mui/material/Box';
import  Typography  from '@mui/material/Typography';

const columns = [
  { id: 'index', label: '#', minWidth: 50, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 170, align: 'center' },
  { id: 'first_name', label: 'First Name', minWidth: 170 },
  { id: 'last_name', label: 'Last Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170, align:'center' },
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
  const [loader, setLoader] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);
  const [totalusers,setTotalUserDataCount]=React.useState(0)
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

  // const fetchUserData = async () => {
  //   setLoader(true)
  //   try {

  //     const response = await axios.get("http://localhost:5003/getalluserdata", {
  //       headers: {
  //         Authorization: `Bearer ${token}`

  //       }
  //     })

  //     // console.log(response.data);
  //     // setAllUserData(response.data.users)
  //     if (Array.isArray(response.data.users)) {
  //       setAllUserData(response.data.users);
  //     } else {
  //       console.error("Response data is not an array:", response.data);
  //     }

  //   } catch (error) {
  //     console.log(error);
  //   }
  //   finally {
  //     setLoader(false)
  //   }
  // }

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
        setTotalUserDataCount(response.data.totalCount);
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
  }, [token, refreshTable,page])


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

    <>  {
      loader &&
      <Loader />
    }
      <Paper m sx={{ width: '100%', overflow: 'hidden', marginTop: "100px" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Box mb={3} textAlign={"center"}>

            <Typography variant="h3" color="initial" >Pending request</Typography>
          </Box>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth ,backgroundColor:"#BDBDBD",
                    fontWeight:"bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              { allUserData && allUserData.map((user, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell align="center" style={{ minWidth: columns[0].minWidth, fontSize: "18px" }}>{index + 1}</TableCell>
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
          rowsPerPageOptions={[4,10,12]}
          component="div"
          count={totalusers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>

  );
}