import "../Css/main.css";
import "../Css/Login.css";
import "../Css/mypage.css";
import imgLogo from "../Assets/logo.png";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidesection from "../Components/Sidesection";

function Login() {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [Role, setRole] = useState("회원");
  // console.log("-=-=-=-=-=-=-=-=-=-=-==-=-=-=-");
  // console.log(sessionStorage.getItem("email"));
  // console.log(sessionStorage.getItem("email") !== null);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // 엔터키로 이동
      onClickLogin();
    }
  };

  const navigate = useNavigate();

  const handleInputId = (e) => {
    setInputId(e.target.value);
    console.log(e.target.value);
  };

  const handleInputPw = (e) => {
    setInputPw(e.target.value);
    console.log(e.target.value);
  };

  const handleRole = (e) => {
    setRole(e.target.value);
    console.log(e.target.value);
  };

  const onClickLogin = () => {
    if (Role === "회원") {
      axios
        .post("/user/login", {
          email: inputId,
          password: inputPw,
        })
        .then((res) => {
          console.log("res.data.email :: ", res.data.email);
          if (inputId === null || inputPw === null) {
            alert("회원정보를 입력해주세요");
          } else if (res.data.email === undefined || res.data.email === null) {
            alert("입력하신 id나 password가 일치하지 않습니다.");
          } else {
            console.log("======================", "유저 로그인 성공");
            sessionStorage.setItem("email", res.data.email);
            sessionStorage.setItem("category", "user");
            // sessionStorage.setItem("user_name", res.data.name); // sessionStorage에 name을 user_name이라는 key 값으로 저장
            navigate("/");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (Role === "플래너") {
      axios
        .post("/planner/login", {
          email: inputId,
          password: inputPw,
        })
        .then((res) => {
          console.log("res.data.email :: ", res.data.email);
          if (inputId === null || inputPw === null) {
            alert("회원정보를 입력해주세요");
          } else if (res.data.email === undefined || res.data.email === null) {
            alert("입력하신 id나 password가 일치하지 않습니다.");
          } else {
            console.log("======================", "플래너 로그인 성공");
            sessionStorage.setItem("email", res.data.email);
            sessionStorage.setItem("category", "planner");
            // sessionStorage.setItem("planner_name", res.data.name); // sessionStorage에 name을 user_name이라는 key 값으로 저장
            navigate("/");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={"로그인"} />
        <div className="container text-center" style={{ marginTop: "50px" }}>
          <div className="row">
            <div className="col"></div>
            <div className="col-6">
              <img className="logo" src={imgLogo} alt="로고" />
            </div>
            <div className="col"></div>
          </div>
        </div>
        <div
          className="container text-center"
          style={{
            // minHeight: "100vh",
            height: "450px",
            width: "100%",
            zIndex: 1,
            marginTop: "10px",
          }}
        >
          <form>
            <div className="row">
              <div className="col"></div>
              <div className="col-6">
                {/* <p className="loginmessage">아이디(이메일)로 로그인하기</p> */}
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control inputarea"
                    placeholder="아이디(이메일)"
                    required=""
                    value={inputId}
                    onChange={handleInputId}
                    style={{ fontSize: "1.3em" }}
                  />
                  <input
                    type="password"
                    className="form-control inputarea"
                    placeholder="비밀번호"
                    required=""
                    value={inputPw}
                    onChange={handleInputPw}
                    style={{ fontSize: "1.3em" }}
                    onKeyPress={handleKeyPress}
                  />
                  <div class="input-group" id="Role" style={{ width: 256 }}>
                    <div class="input-group-text">
                      <input
                        class="form-check-input mt-0"
                        type="radio"
                        value="회원"
                        name="Role"
                        htmlFor="회원"
                        checked={Role === "회원"}
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
                      value="회원"
                      disabled
                      style={{ background: "white", fontSize: "1.3em" }}
                    />
                    <div class="input-group-text">
                      <input
                        class="form-check-input mt-0"
                        type="radio"
                        value="플래너"
                        name="Role"
                        checked={Role === "플래너"}
                        htmlFor="플래너"
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
                      value="플래너"
                      disabled
                      style={{ background: "white", fontSize: "1.3em" }}
                    />
                  </div>
                </div>
                <Link
                  to="/passwordSearch"
                  className="searchmessage"
                  style={{ fontSize: "1.1em" }}
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <div className="col"></div>
            </div>
            <br />
            <button
              type="button"
              className="btn-colour-1 "
              onClick={onClickLogin}
              style={{ fontSize: "1.2em" }}
            >
              로그인
            </button>
          </form>
          <br />
          <br />
          <p style={{ fontSize: "1.2em" }}>
            처음 오셨나요? &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/signup" className="signupmessage">
              회원가입
            </Link>
          </p>
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

export default Login;
