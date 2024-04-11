import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AddBlog } from './pages/AddBlog'
import { Update } from './pages/Update'
// import { BlogDetail } from './pages/BlogDetail'
import Signup from './pages/Signup'
import Login from './pages/Login'
import SearchAppBar from './components/SearchAppBar'
import ResponsiveDrawer from './components/ResponsiveDrawer'
import  Blogs  from './pages/Blogs'
import { BlogDetail } from './pages/BlogDetail'


const Routess = () => {
    return (
            <Routes>

                <Route path='/' element={<ResponsiveDrawer />}>
                    <Route index element={<Blogs />} />
                    <Route path='blog/:id' element={<BlogDetail />} />
                    <Route path='addblog' element={<AddBlog />} />

                </Route>

                <Route path='/login' element={<Login />}/>

            </Routes>

    )
}

export default Routess

