import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";
import "../Css/mypage.css";
import Sidesection from "../Components/Sidesection";

const SignupSuccess = () => {
  let [top, setTop] = useState(20);
  let [opacity, setOpacity] = useState(0);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setTimeout(() => {
      setTop(70);
      setOpacity(1);
    }, 200);
  });

  return (
    <div className="bg containerbox">
      <div className="mainlayout box1">
        <div className="Signup-backicon" onClick={handleBack}>
          <i class="bi bi-chevron-left" style={{ fontSize: 30 }}></i>
        </div>
        <div className="Signup-header">Registration Complete</div>
        <div className="Signup-guidebar">
          <div className="guideline"></div>
          <span style={{ fontSize: "23px" }}>Registration Complete</span>
          <div className="guideline"></div>
        </div>

        <div className="Signup-Successbox">
          <div
            className="Signup-SuccessMessage"
            style={{ top: top, opacity: opacity }}
          >
            <p>🎉 Congratulations on your registration! 🎉</p>
            <p>(●'◡'●)</p>
          </div>
          <div
            className="Signup-button"
            style={{ position: "absolute", top: 310, width: "100%" }}
          >
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="btn-colour-1"
              style={{ width: 256 }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
};

export default SignupSuccess;
