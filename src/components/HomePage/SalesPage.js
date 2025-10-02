import React from "react";
import "./SalesPage.css";
import videoBg from "./assets/ships.mp4"; // replace with your video path

const SalesPage = () => {
  return (
    <div className="sales-page">
      <video className="video-bg" autoPlay loop muted>
        <source src={videoBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="saleoverlay"></div>

      {/* Content */}
      <div className="content">
        <h1>Trust Your Us Today!</h1>
        <p>
        Providing the best Service from Abroad to Monrovia, Liberia.
        </p>
        <button className="contact-btn">Contact Us Now</button>
      </div>
    </div>
  );
};

export default SalesPage;
