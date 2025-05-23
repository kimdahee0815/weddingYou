import React from "react";
import { useNavigate } from "react-router-dom";
import "../Css/myestimate.css";

function MyEstimate() {
  const navigate = useNavigate();

  return (
    <div
      className="myestimate"
      onClick={() => {
        navigate("/matching");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="currentColor"
        className="bi bi-files"
        viewBox="0 0 16 16"
      >
        <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z" />
      </svg>
      <p>내 견적</p>
    </div>
  );
}

export default MyEstimate;
