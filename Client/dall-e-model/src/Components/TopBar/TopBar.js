import React from "react";
import "./TopBar.css";
import logo from "../../images/logo2.png";
export default function TopBar() {
  return (
    <div className="TopBar">
      <div className="Topbar-Content">
        <img src={logo}></img>
        <ul>
          <li id="logo">DALL.E</li>
          <li>HISTORY</li>
          <li>ABOUT ME</li>
        </ul>
      </div>
    </div>
  );
}
