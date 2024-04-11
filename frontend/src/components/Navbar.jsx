import React from "react";
import { Link } from "react-router-dom";

const Navbar=()=>{



    return(

        <>
        
        <ul>
            <li><Link to={"/"}> blogs</Link></li>
            <li><Link to={"/addblog"}> addblog</Link></li>
            <li><Link to={"/update/:id"}> update</Link></li>
            <li><Link to={"/login"}> login</Link></li>
            <li><Link to={"/signup"}> signup</Link></li>

        </ul>
        
        
        </> 
    )
}

export default Navbar