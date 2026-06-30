import "../Css/main.css";
import "../Css/Login.css";
import imgLogo from "../Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import { useState } from "react";
import axios from "axios";
import "../Css/mypage.css";
import Sidesection from "../Components/Sidesection";

function TemporaryPasswordLogin() {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [Role, setRole] = useState("Member");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // 엔터키로 이동
      onClickLogin();
    }
  };

  const handleInputId = (e) => {
    setInputId(e.target.value);
  };

  const handleInputPw = (e) => {
    setInputPw(e.target.value);
  };

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const navigate = useNavigate();

  const onClickLogin = () => {
    if (Role === "Member") {
      axios
        .post("/user/login", {
          email: inputId,
          password: inputPw,
        })
        .then((res) => {
         // console.log("res.data.email :: ", res.data.email);
          if (inputId === null || inputPw === null) {
            alert("Please enter your account information.");
          } else if (res.data.email === undefined || res.data.email === null) {
            alert("The ID or password you entered does not match.");
          } else {
            // id, pw 모두 일치 userId = userId1, msg = undefined
            // console.log("======================", "로그인 성공");
            sessionStorage.setItem("email", res.data.email);
            // sessionStorage.setItem("user_name", res.data.name); // sessionStorage에 name을 user_name이라는 key 값으로 저장
            navigate(`/passwordSearch/temporaryPasswordLogin/passwordChange`, {
              state: {
                temporaryLoggedIn: true,
                category: "user",
              },
            });
          }
        })
        .catch();
    } else if (Role === "Planner") {
      axios
        .post("/planner/login", {
          email: inputId,
          password: inputPw,
        })
        .then((res) => {
         // console.log("res.data.email :: ", res.data.email);
          if (inputId === null || inputPw === null) {
            alert("Please enter your account information.");
          } else if (res.data.email === undefined || res.data.email === null) {
            alert("The ID or password you entered does not match.");
          } else {
            // id, pw 모두 일치 userId = userId1, msg = undefined
          //  console.log("======================", "로그인 성공");
            sessionStorage.setItem("email", res.data.email);
            // sessionStorage.setItem("planner_name", res.data.name); // sessionStorage에 name을 user_name이라는 key 값으로 저장
            navigate(`/passwordSearch/temporaryPasswordLogin/passwordChange`, {
              state: {
                temporaryLoggedIn: true,
                category: "planner",
              },
            });
          }
        })
        .catch();
    }
  };

  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={"Temporary Login"} />
        <div className="container text-center" style={{ marginTop: "100px" }}>
          <div className="row">
            <div className="col"></div>
            <div className="col-6">
              <img className="logo" src={imgLogo} alt="logo" />
            </div>
            <div className="col"></div>
          </div>
        </div>
        <div
          className="container text-center"
          style={{ height: "400px", marginTop: "50px" }}
        >
          <div className="row">
            <div className="col"></div>
            <div className="col-6">
              <div className="mb-3">
                <input
                  type="text"
                  className="inputarea"
                  placeholder="ID (Email)"
                  maxLength="100"
                  value={inputId}
                  onChange={handleInputId}
                  style={{ fontSize: "1.2em" }}
                />
                <input
                  type="password"
                  className="inputarea"
                  placeholder="Temporary Password"
                  value={inputPw}
                  onChange={handleInputPw}
                  style={{ fontSize: "1.2em" }}
                  onKeyPress={handleKeyPress}
                />
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
                    style={{ background: "white", fontSize: "1.2em" }}
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
                    style={{ background: "white", fontSize: "1.2em" }}
                  />
                </div>
              </div>
            </div>
            <div className="col"></div>
          </div>
          <br />
          <button type="button" className="btn-colour-1" onClick={onClickLogin}>
            Login
          </button>
          <br />
          <br />
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

export default TemporaryPasswordLogin;
