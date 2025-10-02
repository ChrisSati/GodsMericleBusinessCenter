import React from "react";
import "./Staffs.css";

// Import images locally
import staff1 from "./seniorpatrick.jpg";
import staff2 from "./daddymark.jpg";
import staff3 from "./motlucy.jpg";

const Staffs = () => {
  return (
    <div className="staffs-container">
      <h1 className="staffs-title">Our Team</h1>
      <div className="staffs-grid">

        {/* Staff 1 */}
        <div className="staff-card">
          <div className="staff-content">
            <img src={staff1} alt="John Doe" className="staff-image" />
            <h2 className="staff-name">Mr. Patrick Johnson</h2>
            <p className="staff-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

            </p>
          </div>
        </div>

        {/* Staff 2 */}
        <div className="staff-card">
          <div className="staff-content">
            <img src={staff2} alt="Jane Smith" className="staff-image" />
            <h2 className="staff-name">Pst. Mark K. Jallawide</h2>
            <p className="staff-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

            </p>
          </div>
        </div>

        {/* Staff 3 */}
        <div className="staff-card">
          <div className="staff-content">
            <img src={staff3} alt="Alice Johnson" className="staff-image" />
            <h2 className="staff-name">Mot. Lucy Kpayele</h2>
            <p className="staff-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Staffs;
