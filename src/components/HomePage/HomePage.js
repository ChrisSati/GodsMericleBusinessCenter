import React from "react";
import Header from "../Header/Header";
import SalesPage from "./SalesPage";
import Staffs from "./Staffs";
import Footer from "./Footer/Footer";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />

      {/* Additional sections can be added below */}
      <section className="about">
        <div className="container">
          <h2>About Us</h2>
          <p>
            We provide innovative solutions tailored to your business needs. Our
            team is committed to delivering professional and efficient services
            to help your business grow.
          </p>
        </div>
      </section>

        <div>
        <Staffs/>
      </div>

      <section className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Eletronics</h3>
              <p>Responsive, modern, and scalable web applications.</p>
            </div>
            <div className="service-card">
              <h3>Home Funitures</h3>
              <p>Beautiful and intuitive designs for all devices.</p>
            </div>
            <div className="service-card">
              <h3>Sports Wear</h3>
              <p>Grow your brand and reach more customers online.</p>
            </div>
          </div>
        </div>
      </section>
      <div>
        <SalesPage/>
      </div>
       <div>
        <Footer/>
      </div>
    </div>
  );
};

export default HomePage;
