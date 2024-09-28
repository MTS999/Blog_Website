import {  Route, Routes } from "react-router-dom";
// import Layout from './components/Layout'
import { AddBlog } from "./pages/AddBlog";
// import { Update } from './pages/Update'
// import { BlogDetail } from './pages/BlogDetail'
import Signup from "./pages/Signup";
import Login from "./pages/Login";
// import Mts from './pages/Mts'
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import Blogs from "./pages/Blogs";
import { BlogDetail } from "./pages/BlogDetail";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import AllUsers from "./pages/AllUsers";
import Pending from "./pages/Pending";
import AddNewUser from "./pages/AddNewUser";
import AdminUserprofile from "./pages/AdminUserprofile";
import AllDataOfUser from "./pages/AllDataOfUser";
import Counter from "./pages/Counter";

const Routess = () => {
  return (
    <Routes>
      <Route path="/" element={<ResponsiveDrawer />}>
        <Route path=":blog" element={<Blogs />} />
        <Route index element={<Blogs />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/adminuserprofile/:id" element={<AdminUserprofile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/allusers" element={<AllUsers />} />
        <Route path="/pending-request" element={<Pending />} />

        <Route path="addblog" element={<AddBlog />} />
        <Route path="add-new-user" element={<AddNewUser />} />
        <Route path="/userInfo/:id" element={<AllDataOfUser />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/mts" element={<Counter />} />
    </Routes>
  );
};

export default Routess;
