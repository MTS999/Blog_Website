import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AddBlog } from './pages/AddBlog'
import { Update } from './pages/Update'
// import { BlogDetail } from './pages/BlogDetail'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Mts from './pages/Mts'
import ResponsiveDrawer from './components/ResponsiveDrawer'
import  Blogs  from './pages/Blogs'
import { BlogDetail } from './pages/BlogDetail'
import TemporaryDrawer from './pages/TemporaryDrawer'
import Profile from './pages/Profile'
import  Dashboard  from './pages/Dashboard'
import AllUsers from './pages/AllUsers'
import Pending from './pages/Pending'


const Routess = () => {
    return (
            <Routes>

                <Route path='/' element={<ResponsiveDrawer />}>
                    <Route index element={<Blogs />} />
                    <Route path='blog/:id' element={<BlogDetail />} />
                    <Route path='addblog' element={<AddBlog />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/allusers' element={<AllUsers />} />
                    <Route path='/pending-request' element={<Pending />} />
               
                </Route>

                <Route path='/login' element={<Login />}/>
                {/* <Route path='/mts' element={<TemporaryDrawer />}/> */}

            </Routes>

    )
}

export default Routess

