import React from "react";
import "../Css/main.css";
import "../Css/Login.css";
import "../Css/PasswordSearch.css";
import imgLogo from "../Assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import { useState, useEffect } from "react";
import "../Css/mypage.css";
import axios from "axios";
import Sidesection from "../Components/Sidesection";

function PasswordChange() {
    let [passwordcheck, setPasswordcheck] = useState(false);
    let [passwordcheck2, setPasswordcheck2] = useState(false);

    let [password, setPassword] = useState("");
    let [password2, setPassword2] = useState("");

    let [passwordstyle, setPasswordstyle] = useState("");
    let [passwordstyle2, setPasswordstyle2] = useState("");

    const navigate = useNavigate();
    const {
        state: { temporaryLoggedIn: temporaryPasswordCheck, category },
    } = useLocation();
    useEffect(() => {
        //임시비밀번호 입력하지 않고 passwordchange url 접근 불가
        if (temporaryPasswordCheck !== true) {
            navigate(`/passwordSearch/temporaryPasswordLogin`);
            alert("Please enter your temporary password to change your password!");
        }
    }, []);

    const onClickpwUpdate = () => {
        if (category === "user") {
            axios
                .post("/user/updatePassword", {
                    email: sessionStorage.getItem("email"),
                    password,
                })
                .then((res) => {
                    // console.log("======================", "비밀번호 변경완료");
                    sessionStorage.clear();
                })
                .catch((e) => {
                    alert("Try Again! Error occurred!");
                });
        } else if (category === "planner") {
            axios
                .post("/planner/updatePassword", {
                    email: sessionStorage.getItem("email"),
                    password,
                })
                .then((res) => {
                    // console.log("======================", "비밀번호 변경완료");
                    sessionStorage.clear();
                })
                .catch((e) => {
                    alert("Try Again! Error occurred!");
                });
        }
    };

    useEffect(() => {
        const changepasswordbtn = document.querySelector("#changepasswordbtn");
        if (password === "") {
            setPasswordstyle("");
            setPasswordcheck(false);
        }
        if (password2 === "" || password2 === null) {
            setPasswordstyle2("");
            setPasswordcheck2(false);
        } else if (password === password2) {
            setPasswordstyle2("is-valid");
            changepasswordbtn.classList.remove("btn-colour-2");
            changepasswordbtn.classList.add("btn-colour-1");
            setPasswordcheck2(true);
        } else {
            setPasswordstyle2("is-invalid");
            setPasswordcheck2(false);
        }
    }, [password, password2, setPasswordcheck2]);

    const EventHandlerPassword = (e) => {
        const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{8,}$/;
        setPassword(e.target.value);
        if (passwordRegExp.test(e.target.value)) {
            setPasswordstyle("is-valid");
            setPasswordcheck(true);
        } else {
            setPasswordstyle("is-invalid");
            setPasswordcheck(false);
        }
    };

    const EventHandlerPassword2 = (e) => {
        setPassword2(e.target.value);
        if (password === e.target.value) {
            setPasswordstyle2("is-valid");
            setPasswordcheck2(true);
        } else {
            setPasswordstyle2("is-invalid");
            setPasswordcheck2(false);
        }
    };

    return (
        <div className="containerbox">
            <div className="mainlayout box1">
                <NavigationBar title={"Change Password"} />
                <div className="container text-center" style={{ marginTop: "50px" }}>
                    <div className="row">
                        <div className="col"></div>
                        <div className="col-6">
                            <img className="logo" src={imgLogo} alt="logo" />
                        </div>
                        <div className="col"></div>
                    </div>
                </div>
                <div className="container text-center" style={{ height: "450px" }}>
                    {/* <form> */}
                    <div className="row">
                        <div className="col"></div>
                        <div className="col-6">
                            {/* <p className="loginmessage">변경할 비밀번호를 입력하세요</p> */}
                            <div className="mb-3">
                                <InputComp
                                    content="New Password"
                                    EventHandler={EventHandlerPassword}
                                    style={passwordstyle}
                                    message="At least 8 characters, including uppercase, lowercase, number, and special character."
                                    length={20}
                                    type="password"
                                />
                                <InputComp
                                    content="Confirm Password"
                                    EventHandler={EventHandlerPassword2}
                                    style={passwordstyle2}
                                    message="Passwords do not match."
                                    length={20}
                                    type="password"
                                />
                            </div>
                        </div>
                        <div className="col"></div>
                    </div>
                    <br />
                    <button
                        type="submit"
                        className="btn-colour-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        disabled={!passwordcheck || !passwordcheck2}
                        style={{
                            marginBottom: "15px",
                        }}
                        id="changepasswordbtn"
                        onClick={onClickpwUpdate}
                    >
                        Change Password
                    </button>
                    {/* </form> */}
                    <br />
                    <button type="submit" className="btn-colour-1">
                        <Link
                            to="/login"
                            style={{
                                color: "white",
                                textDecorationLine: "none",
                            }}
                        >
                            Back to Main
                        </Link>
                    </button>
                    <br />
                    <br />
                </div>
                <div
                    class="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="PasswordChange"
                    aria-hidden="true"
                >
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div className="infotext4">
                                    <i className="bi bi-dash-lg"></i>&nbsp;&nbsp;
                                    <span style={{ fontSize: "1.4em" }}>Password Changed Successfully</span>
                                    &nbsp;&nbsp;
                                    <i className="bi bi-dash-lg"></i>
                                </div>
                            </div>
                            <div class="modal-body infotext4">
                                <div className="infotext4" style={{ fontSize: "1.2em" }}>
                                    Your password has been changed.
                                    <br />
                                    Please log in with your new password!
                                </div>
                            </div>
                            <div class="modal-footer infotext4">
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    style={{ fontSize: "1.3em" }}
                                >
                                    <Link
                                        to="/login"
                                        style={{
                                            color: "white",
                                            textDecorationLine: "none",
                                        }}
                                    >
                                        Back to Main
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

export default PasswordChange;

const InputComp = ({ EventHandler, content, style, message, length, type, value }) => {
    return (
        <>
            <div className="col-md-4" style={{ width: 256 }}>
                <label htmlFor="validationServer01" className="form-label">
                    <span style={{ fontSize: "1em" }}>{content}</span>
                </label>
                <input
                    type={type}
                    className={`form-control ${style}`}
                    id="validationServer01"
                    required
                    onChange={EventHandler}
                    maxLength={length}
                    value={value}
                />
                <div id="validationServer03Feedback" className="invalid-feedback" style={{ fontSize: "1.2em" }}>
                    {message}
                </div>
            </div>
        </>
    );
};
