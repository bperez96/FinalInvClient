import React from "react";
import './TopNav.css';
import { Outlet, Link } from "react-router-dom";


function TopNav() {

return (
	<div className="topnav">
	<h1 style={{color: "lightblue", marginLeft: "3.5vw", fontSize: "4vw"}}>The Recurring Investment Algorithm</h1>
  		<Link to="/" className = "topNavLink">Home / About</Link>
  		 <Link to="/TryYourself" className = "topNavLink">Try Yourself</Link>
  		<Link to="/secondPage" className = "topNavLink">Log In / Sign Up </Link>
	</div>

	)

}

export default TopNav;