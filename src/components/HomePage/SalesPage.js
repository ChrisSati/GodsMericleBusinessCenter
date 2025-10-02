import React from "react";
import "./SalesPage.css";
import shipship from "./shipship.jpg";
// import videoBg from "./assets/ships.mp4"; // replace with your video path

const SalesPage = () => {
  return (
    <div className="sales-page">
      {/* <video className="video-bg" autoPlay loop muted>
        <source src={videoBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <div>
        <img src={shipship} alt="" className="video-bg"  />
      </div>

      {/* Overlay */}
      <div className="saleoverlay"></div>

      {/* Content */}
      <div className="content">
        <h1>Trust Us Today!</h1>
        <p>
           Providing the best Service of American Materias to Monrovia, Liberia.
        </p>
        <button className="contact-btn">Contact Us Now</button>
      </div>
    </div>
  );
};

export default SalesPage;
