import React from "react";
import "../Css/main.css";
import "../Css/PasswordSearch.css";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import { useState } from "react";
import axios from "axios";
import "../Css/mypage.css";
import Sidesection from "../Components/Sidesection";

function PasswordSearch() {
  const [inputId, setInputId] = useState("");
  const [hidden, setHidden1] = useState(true);
  const [Role, setRole] = useState("Member");

  const handleInputId = (e) => {
    setInputId(e.target.value);
  };

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const onClicksend = () => {
    if (Role === "Member") {
      axios
        .post("/user/forgotPassword", {
          email: inputId,
        })
        .then((res) => {
          if (res.data === 1) {
            setHidden1(false);
            //console.log("======================", "유저 임시비밀번호 전송성공");
          } else {
            setHidden1(true);
            alert("The ID you entered does not match.");
            document.location.href = "/passwordSearch";
          }
        })
        .catch((e)=>{
          alert("Error Occured!");
          document.location.href = "/passwordSearch";
        });
    } else if (Role === "Planner") {
      axios
        .post("/planner/forgotPassword", {
          email: inputId,
        })
        .then((res) => {
          if (res.data === 1) {
            setHidden1(false);
            // console.log(
            //   "======================",
            //   "플래너 임시비밀번호 전송성공"
            // );
          } else {
            setHidden1(true);
            alert("The ID you entered does not match.");
            document.location.href = "/passwordSearch";
          }
        })
        .catch((e)=>{
          alert("Error Occured!");
          document.location.href = "/passwordSearch";
        });
    }
  };

  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={"Find Password"} />
        <br />
        <div
          className="container text-center"
          style={{ marginTop: "100px", height: "700px" }}
        >
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <div className="infotext">
                <i className="bi bi-dash-lg"></i>&nbsp;&nbsp;
                <span style={{ fontSize: "1.5em" }}>Get Temporary Password</span>
                &nbsp;&nbsp;
                <i className="bi bi-dash-lg"></i>
              </div>
            </div>
            <div className="col-2"></div>
          </div>
          <div className="container text-center">
            <div className="row">
              <div className="col-2"></div>
              <div className="col-8">
                <div className="infotext2" style={{ fontSize: "1.2em" }}>
                  Please enter your registered email address
                  <br />
                  and click the "Send Temporary Password" button.
                </div>
              </div>
              <div className="col-2"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
              <div className="infotext3">
                <input
                  type="text"
                  className="inputarea"
                  placeholder="Email"
                  value={inputId}
                  onChange={handleInputId}
                  style={{ fontSize: "1.3em" }}
                />
              </div>
              <div class="input-group" id="Role" style={{ width: 256 }}>
                <div class="input-group-text">
                  <input
                    class="form-check-input mt-0"
                    type="radio"
                    value="Member"
                    name="Role"
                    htmlFor="Member"
                    checked={Role === "Member"}
                    onChange={handleRole}
                    aria-label="Radio button for following text input"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <input
                  type="text"
                  class="form-control"
                  id="custom"
                  aria-label="custom btn"
                  value="Member"
                  disabled
                  style={{ background: "white", fontSize: "1.3em" }}
                />
                <div class="input-group-text">
                  <input
                    class="form-check-input mt-0"
                    type="radio"
                    value="Planner"
                    name="Role"
                    checked={Role === "Planner"}
                    htmlFor="Planner"
                    onChange={handleRole}
                    aria-label="Radio button for following text input"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <input
                  type="text"
                  class="form-control"
                  id="planner"
                  aria-label="palnner btn"
                  value="Planner"
                  disabled
                  style={{ background: "white", fontSize: "1.3em" }}
                />
              </div>
            </div>
            <div className="col-3"></div>
          </div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <div className="infotext3">
                <button
                  type="button"
                  className="btn-colour-1"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={onClicksend}
                  style={{ fontSize: "1.2em" }}
                >
                  Send Temporary Password
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="PasswordSearch"
          aria-hidden="true"
          hidden={hidden}
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <div className="infotext4">
                  <i className="bi bi-dash-lg"></i>&nbsp;&nbsp;
                  <span style={{ fontSize: "1.3em" }}>
                    Temporary Password Sent Successfully
                  </span>
                  &nbsp;&nbsp;
                  <i className="bi bi-dash-lg"></i>
                </div>
              </div>
              <div class="modal-body infotext4">
                <div className="infotext4" style={{ fontSize: "1.2em" }}>
                  A temporary password has been sent to your email.
                  <br />
                  Please check your email, then log in and change your password!
                </div>
              </div>
              <div class="modal-footer infotext4">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  <Link
                    to="/passwordSearch/temporaryPasswordLogin"
                    style={{
                      color: "white",
                      textDecorationLine: "none",
                      fontSize: "1.2em",
                    }}
                  >
                    Temporary Login
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}

export default PasswordSearch;
