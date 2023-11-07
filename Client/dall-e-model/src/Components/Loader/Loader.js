import React from "react";
import "./Loader.css";
function Loader() {
  return (
    <div className="Loader">
      <div class="container">
        <div class="wrapper">
          <div class="loader">
            <div class="dot"></div>
          </div>
          <div class="loader">
            <div class="dot"></div>
          </div>
          <div class="loader">
            <div class="dot"></div>
          </div>
          <div class="loader">
            <div class="dot"></div>
          </div>
          <div class="loader">
            <div class="dot"></div>
          </div>
          <div class="loader">
            <div class="dot"></div>
          </div>
        </div>
        <div class="text">Please wait</div>
      </div>
    </div>
  );
}

export default Loader;
