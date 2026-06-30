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
    const [Role, setRole] = useState("Member");
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
        // console.log(e.target.value);
    };

    const handleInputPw = (e) => {
        setInputPw(e.target.value);
        // console.log(e.target.value);
    };

    const handleRole = (e) => {
        setRole(e.target.value);
        // console.log(e.target.value);
    };

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
                        // console.log("======================", "유저 로그인 성공");
                        sessionStorage.setItem("email", res.data.email);
                        sessionStorage.setItem("category", "user");
                        // sessionStorage.setItem("user_name", res.data.name); // sessionStorage에 name을 user_name이라는 key 값으로 저장
                        navigate("/");
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        } else if (Role === "Planner") {
            axios
                .post("/planner/login", {
                    email: inputId,
                    password: inputPw,
                })
                .then((res) => {
                    //  console.log("res.data.email :: ", res.data.email);
                    if (inputId === null || inputPw === null) {
                        alert("Please enter your account information.");
                    } else if (res.data.email === undefined || res.data.email === null) {
                        alert("The ID or password you entered does not match.");
                    } else {
                        // console.log("======================", "플래너 로그인 성공");
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
                <NavigationBar title={"Login"} />
                <div className="container text-center" style={{ marginTop: "50px" }}>
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
                            <div className="col-7" style={{ justifyItems: "center" }}>
                                {/* <p className="loginmessage">아이디(이메일)로 로그인하기</p> */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control inputarea"
                                        placeholder="ID (Email)"
                                        required=""
                                        value={inputId}
                                        onChange={handleInputId}
                                        style={{ fontSize: "1.3em" }}
                                    />
                                    <input
                                        type="password"
                                        className="form-control inputarea"
                                        placeholder="Password"
                                        required=""
                                        value={inputPw}
                                        onChange={handleInputPw}
                                        style={{ fontSize: "1.3em" }}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <div class="input-group" id="Role" style={{ width: 280 }}>
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
                                <Link to="/passwordSearch" className="searchmessage" style={{ fontSize: "1.1em" }}>
                                    Forgot your password?
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
                            Login
                        </button>
                    </form>
                    <br />
                    <br />
                    <p style={{ fontSize: "1.2em" }}>
                        New here? &nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to="/signup" className="signupmessage">
                            Sign Up
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
