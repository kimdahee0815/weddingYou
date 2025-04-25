import "../Css/main.css";
import "../Css/mypage.css";
import profileimage from "../Assets/defaultprofileimage.jpg";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Animation from "../Components/Animation";
import Sidesection from "../Components/Sidesection";

function Mypage() {
  const title = "마이페이지";
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  const [career, setCareer] = useState("");
  const [introduction, setIntroduction] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("looks good!");
  const [passwordCheck, setPasswordCheck] = useState("");
  const passwordInput = useRef();

  const passwordcheckmodal = useRef();
  const passwordcheckMessageModal = useRef();
  const passwordFeedback = useRef();
  const passwordConfirm = useRef();
  const [passwordcheckmessage, setPasswordCheckMessage] = useState("");

  const [previewUrl, setPreviewUrl] = useState(null);
  const [image, setImage] = useState(null);
  
  const { category } = useParams();

  const userEmail = window.sessionStorage.getItem("email");

  const [finish, setFinish] = useState(false);

  const location = useLocation();
  const path = location.pathname;
  useEffect(() => {
    viewDefaultInfo();
    if (category !== "user" && category !== "planner") {
      navigate("/*");
    } else if (
      sessionStorage.getItem("category") !== "user" &&
      sessionStorage.getItem("category") !== "planner"
    ) {
      navigate("/*");
    } else if (
      sessionStorage.getItem("category") === "user" &&
      path.indexOf("planner") !== -1
    ) {
      navigate("/mypageabc");
    } else if (
      sessionStorage.getItem("category") === "planner" &&
      path.indexOf("user") !== -1
    ) {
      navigate("/mypageabc");
    }
  }, []);
  const viewDefaultInfo = () => {
    if (category === "user") {
      axios
        .post("/user/userSearch", { email: userEmail })
        .then((res) => {
          setName(res.data.name);
          setEmail(res.data.email);
          setPassword(res.data.password);
          setPhone(res.data.phoneNum);
          setGender(res.data.gender);
        })
        .catch((e) => {
          console.log(e);
        });
      axios
        .post("/user/getprofileImg", { email: userEmail }, 
          {
            responseType: 'blob'  
          })
        .then((res) => {
          const imageUrl = URL.createObjectURL(res.data);
          setImage(imageUrl);
          const reader = new FileReader();
          reader.onload = () => {
            setPreviewUrl(reader.result);       
          };
          reader.readAsDataURL(res.data);
          setFinish(true);
        })
        .catch((e) => {
          setPreviewUrl(profileimage);
          console.log(e);
          // if (e.response.data.message === "프로필 사진이 없습니다!") {
          //   setFinish(true);
          // } else if (e.reponse.data.message === "로그인 하세요!") {
          //   setFinish(true);
          // } else {
          //   setFinish(false);
          // }
          setFinish(true);
        });
    }
    if (category === "planner") {
      axios
        .post("/planner/plannerSearch", { email: userEmail })
        .then((res) => {
          setName(res.data.name);
          setEmail(res.data.email);
          setPassword(res.data.password);
          setPhone(res.data.phoneNum);
          setGender(res.data.gender);
          setCareer(res.data.plannerCareerYears);
          setIntroduction(res.data.introduction);
        })
        .catch((e) => {
          console.log(e);
        });
      axios
        .post("/planner/getprofileImg", { email: userEmail }, {
          responseType: 'blob'  
        })
        .then((res) => {
          const imageUrl = URL.createObjectURL(res.data);
          setImage(imageUrl);
          const reader = new FileReader();
          reader.onload = () => {
            setPreviewUrl(reader.result);       
          };
          reader.readAsDataURL(res.data);
          setFinish(true);
        })
        .catch((e) => {
          setPreviewUrl(profileimage);
          // if (e.response.data.message === "프로필 사진이 없습니다!") {
          //   setFinish(true);
          // } else if (e.reponse.data.message === "로그인 하세요!") {
          //   setFinish(true);
          // } else {
          //   setFinish(false);
          // }
          setFinish(true);
        });
    }
  };

  const checkPasswordInfo = () => {
    if (category === "user") {
      axios
        .post("/user/userSearch", { email: userEmail })
        .then((res) => {
          if (passwordCheck === res.data.password) {
            setPasswordCheckMessage("비밀번호 확인 완료!");
          } else {
            setPasswordCheckMessage("비밀번호가 틀립니다. 다시 입력하세요.");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (category === "planner") {
      axios
        .post("/planner/plannerSearch", { email: userEmail })
        .then((res) => {
          if (passwordCheck === res.data.password) {
            setPasswordCheckMessage("비밀번호 확인 완료!");
          } else {
            setPasswordCheckMessage("비밀번호가 틀립니다. 다시 입력하세요.");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const deleteMember = () => {
    const formData = new FormData();
    formData.append("email", sessionStorage.getItem("email"));
    formData.append("category", sessionStorage.getItem("category"));
    axios
      .post("/user/userDelete", formData)
      .then((res) => {
        window.sessionStorage.clear();
        navigate("/login");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    checkPasswordInfo();
  }, [passwordCheck, password]);

  const onChange = (e) => {
    if (e.target.id === "passwordcheck") {
      const passwordRegExp =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{8,}$/;
      if (passwordRegExp.test(e.target.value)) {
        setPasswordMessage("looks good!");
        passwordInput.current.classList.remove("is-invalid");
        passwordInput.current.classList.add("is-valid");
        passwordFeedback.current.classList.remove("invisible");
        passwordFeedback.current.classList.remove("invalid-feedback");
        passwordFeedback.current.classList.add("valid-feedback");
        passwordConfirm.current.disabled = false;
      } else {
        if (e.target.value === "") {
          setPasswordMessage("비밀번호를 입력해주세요.");
        } else {
          setPasswordMessage(
            "최소8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함"
          );
        }

        passwordInput.current.classList.add("is-invalid");
        passwordFeedback.current.classList.add("invalid-feedback");
        passwordFeedback.current.classList.remove("invisible");
        passwordFeedback.current.classList.remove("valid-feedback");
        passwordInput.current.classList.remove("is-valid");
        passwordConfirm.current.disabled = true;
      }
      setPasswordCheck(e.target.value);
    }
  };

  const deletePassword = () => {
    setPasswordCheck("");
    passwordFeedback.current.classList.remove("invalid-feedback");
    passwordFeedback.current.classList.remove("valid-feedback");
    passwordInput.current.classList.remove("is-invalid");
    passwordInput.current.classList.remove("is-valid");
    passwordFeedback.current.classList.add("invisible");
  };

  const submitPasswordCheck = (e) => {
    if (e.key === "Enter") {
    }
  };

  const gotoUpdatePage = () => {
    if (passwordcheckmessage === "비밀번호 확인 완료!") {
      navigate(`/mypage/${category}/userupdate`, {
        state: true,
      });
    }
  };

  const logout = () => {
    window.sessionStorage.clear();
  };

  return (
    <div className="containerbox">
      <div
        className="mainlayout box1"
        style={{ minHeight: "100vh", height: "100%" }}
      >
        <NavigationBar title={title} />
        {finish === false ? (
          <Animation />
        ) : sessionStorage.getItem("category") === "user" ? (
          <div
            class="mypagecontainer text-center"
            style={{
              minHeight: "100vh",
              height: "1000px",
              width: "100%",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              paddingTop: "210px",
            }}
          >
            {previewUrl === null ? (
              <div style={{ width: "200px", height: "200px" }}></div>
            ) : (
              <div>
                <img
                  src={previewUrl}
                  style={
                    category === "user"
                      ? {
                          width: "200px",
                          height: "200px",
                          marginBottom: "20px",
                          marginTop: "-85px",
                        }
                      : {
                          width: "200px",
                          height: "200px",
                          marginBottom: "20px",
                          marginTop: "-95px",
                        }
                  }
                  alt=""
                />
              </div>
            )}
            <form style={{ marginTop: "20px" }}>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="email"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  이메일
                </label>
                <div
                  className=" mb-4"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <input
                    type="text"
                    className="form-control "
                    id="email"
                    value={email}
                    autocomplete="off"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="password"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  비밀번호
                </label>
                <div
                  className="has-validation  mb-4"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <input
                    type="text"
                    className="form-control "
                    id="password"
                    value={password}
                    autocomplete="off"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="name"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  이름
                </label>
                <div
                  className="has-validation  mb-4"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <input
                    type="text"
                    className="form-control "
                    id="name"
                    value={name}
                    autocomplete="off"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="phone"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  휴대폰
                </label>
                <div
                  className="has-validation  mb-4"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <input
                    type="text"
                    className="form-control "
                    id="phone"
                    value={phone}
                    autocomplete="off"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="gender"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  성별
                </label>
                <div
                  class="input-group"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <div class="input-group-text">
                    <input
                      class="form-check-input mt-0"
                      type="radio"
                      value=""
                      name="gender"
                      htmlFor="male"
                      checked={gender === "male" ? true : false}
                      disabled
                      aria-label="Radio button for following text input"
                    />
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    id="male"
                    aria-label="male btn"
                    value="남자"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                  <div class="input-group-text">
                    <input
                      class="form-check-input mt-0"
                      type="radio"
                      value=""
                      name="gender"
                      htmlFor="female"
                      checked={gender === "female" ? true : false}
                      disabled
                      aria-label="Radio button for following text input"
                    />
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    id="female"
                    aria-label="female btn"
                    value="여자"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              {category === "planner" ? (
                <div style={{ height: "300px" }}>
                  <div
                    class=" justify-content-md-center mb-2 mt-4"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <label
                      for="phone"
                      class="form-label mt-2"
                      style={{
                        marginRight: "10px",
                        width: "200px",
                        fontSize: "1.3em",
                      }}
                    >
                      경력
                    </label>
                    <div
                      class="has-validation "
                      style={{ width: "250px", marginRight: "20px" }}
                    >
                      <input
                        type="number"
                        class="form-control "
                        id="career"
                        value={career}
                        onChange={onChange}
                        placeholder={career}
                        autoComplete="off"
                        min="0"
                        max="30"
                        disabled
                        style={{ fontSize: "1.1em" }}
                      />
                    </div>
                  </div>
                  <div
                    class=" justify-content-md-center mb-2 mt-4"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <label
                      for="introduction"
                      class="form-label mt-2"
                      style={{
                        marginRight: "10px",
                        width: "200px",
                        fontSize: "1.3em",
                      }}
                    >
                      소개글
                    </label>
                    <div style={{ width: "250px", marginRight: "20px" }}>
                      <textarea
                        type="textarea"
                        class="form-control "
                        id="introduction"
                        style={{ overflowY: "scroll" }}
                        value={introduction}
                        onChange={onChange}
                        placeholder="아직 소개글이 없습니다."
                        autoComplete="off"
                        cols="10"
                        rows="8"
                        disabled
                        style={{ fontSize: "1.1em" }}
                        maxLength="1000"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              <button
                type="button"
                class="update btn-colour-1"
                data-bs-toggle="modal"
                data-bs-target="#passwordcheckmodal"
                onClick={deletePassword}
                style={{ marginTop: "20px" }}
              >
                정보 수정하기
              </button>

              <div>
                <button
                  className="logout btn-colour-1"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  로그아웃
                </button>
                <button
                  type="button"
                  className="deleteMember btn-colour-1"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteMemberModal"
                >
                  회원탈퇴
                </button>
              </div>
            </form>
            <div style={{ width: "568px", height: "400px" }}></div>
          </div>
        ) : (
          <div
            className="content mypagecontainer text-center"
            style={{
              minHeight: "100vh",
              height: "100%",
              width: "100%",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              marginTop: "100px",
            }}
          >
            {previewUrl === null ? (
              <div style={{ width: "200px", height: "200px" }}></div>
            ) : (
              <img
                src={previewUrl}
                style={
                  category === "user"
                    ? {
                        width: "200px",
                        height: "200px",
                        marginBottom: "20px",
                        marginTop: "-85px",
                      }
                    : {
                        width: "200px",
                        height: "200px",
                        marginBottom: "20px",
                        marginTop: "-95px",
                      }
                }
                alt=""
              />
            )}
            <form style={{ marginTop: "10px" }}>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="email"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  이메일
                </label>
                <div
                  className=" mb-4"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <input
                    type="text"
                    className="form-control "
                    id="email"
                    value={email}
                    autocomplete="off"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="password"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  비밀번호
                </label>
                <div
                  className="has-validation  mb-4"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <input
                    type="text"
                    className="form-control "
                    id="password"
                    value={password}
                    autocomplete="off"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="name"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  이름
                </label>
                <div
                  className="has-validation  mb-4"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <input
                    type="text"
                    className="form-control "
                    id="name"
                    value={name}
                    autocomplete="off"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="phone"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  휴대폰
                </label>
                <div
                  className="has-validation  mb-4"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <input
                    type="text"
                    className="form-control "
                    id="phone"
                    value={phone}
                    autocomplete="off"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              <div
                className=" justify-content-md-center mb-2"
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <label
                  htmlFor="gender"
                  className="form-label  mt-2"
                  style={{
                    marginRight: "10px",
                    width: "200px",
                    fontSize: "1.3em",
                  }}
                >
                  성별
                </label>
                <div
                  class="input-group"
                  style={{ width: "250px", marginRight: "20px" }}
                >
                  <div class="input-group-text">
                    <input
                      class="form-check-input mt-0"
                      type="radio"
                      value=""
                      name="gender"
                      htmlFor="male"
                      checked={gender === "male" ? true : false}
                      disabled
                      aria-label="Radio button for following text input"
                    />
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    id="male"
                    aria-label="male btn"
                    value="남자"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                  <div class="input-group-text">
                    <input
                      class="form-check-input mt-0"
                      type="radio"
                      value=""
                      name="gender"
                      htmlFor="female"
                      checked={gender === "female" ? true : false}
                      disabled
                      aria-label="Radio button for following text input"
                    />
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    id="female"
                    aria-label="female btn"
                    value="여자"
                    disabled
                    style={{ fontSize: "1.1em" }}
                  />
                </div>
              </div>
              {category === "planner" ? (
                <div style={{ height: "300px" }}>
                  <div
                    class=" justify-content-md-center mb-2 mt-4"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <label
                      for="phone"
                      class="form-label mt-2"
                      style={{
                        marginRight: "10px",
                        width: "200px",
                        fontSize: "1.3em",
                      }}
                    >
                      경력
                    </label>
                    <div
                      class="has-validation "
                      style={{ width: "250px", marginRight: "20px" }}
                    >
                      <input
                        type="number"
                        class="form-control "
                        id="career"
                        value={career}
                        onChange={onChange}
                        placeholder={career}
                        autoComplete="off"
                        min="0"
                        max="30"
                        disabled
                        style={{ fontSize: "1.1em" }}
                      />
                    </div>
                  </div>
                  <div
                    class=" justify-content-md-center mb-2 mt-4"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <label
                      for="introduction"
                      class="form-label mt-2"
                      style={{
                        marginRight: "10px",
                        width: "200px",
                        fontSize: "1.3em",
                      }}
                    >
                      소개글
                    </label>
                    <div style={{ width: "250px", marginRight: "20px" }}>
                      <textarea
                        type="textarea"
                        class="form-control "
                        id="introduction"
                        style={{ overflowY: "scroll" }}
                        value={introduction}
                        onChange={onChange}
                        placeholder="아직 소개글이 없습니다."
                        autoComplete="off"
                        cols="10"
                        rows="8"
                        disabled
                        style={{ fontSize: "1.1em" }}
                        maxLength="1000"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              <button
                type="button"
                class="update btn-colour-1"
                data-bs-toggle="modal"
                data-bs-target="#passwordcheckmodal"
                onClick={deletePassword}
                style={{ marginTop: "20px" }}
              >
                정보 수정하기
              </button>

              <div>
                <button
                  className="logout btn-colour-1"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  로그아웃
                </button>
                <button
                  type="button"
                  className="deleteMember btn-colour-1"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteMemberModal"
                >
                  회원탈퇴
                </button>
              </div>
            </form>
          </div>
        )}

        <Footer />
        {/* 비밀번호 확인 modal 창 */}
        <div
          class="modal fade"
          id="passwordcheckmodal"
          tabindex="-1"
          aria-labelledby="passwordcheckmodal"
          aria-hidden="true"
          ref={passwordcheckmodal}
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1
                  class="modal-title justify-content-center "
                  id="passwordcheckmodal"
                  style={{ fontSize: "1.5em" }}
                >
                  - 비밀번호 확인 -
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={deletePassword}
                ></button>
              </div>
              <div class="modal-body">
                <div class="has-validation col col-md-10">
                  <input
                    type="password"
                    class="form-control "
                    id="passwordcheck"
                    ref={passwordInput}
                    value={passwordCheck}
                    onChange={onChange}
                    style={{ fontSize: "1.2em" }}
                    placeholder="현재 비밀번호를 입력해주세요."
                    onKeyPress={submitPasswordCheck}
                    required
                    autocomplete="off"
                    maxLength="20"
                  />
                  <div
                    class="invisible text-start password-feedback"
                    style={{ fontSize: "1em" }}
                    ref={passwordFeedback}
                  >
                    {passwordMessage}
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={deletePassword}
                >
                  닫기
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#passwordcheckMessageModal"
                  ref={passwordConfirm}
                  disabled
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 비밀번호 확인 모달 */}
        {/* 비밀번호 확인 메시지 창 */}
        <div
          class="modal fade"
          id="passwordcheckMessageModal"
          ref={passwordcheckMessageModal}
          tabindex="-1"
          aria-labelledby="passwordcheckMessageModal"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1
                  class="modal-title justify-content-center"
                  id="passwordcheckMessageModal"
                  style={{ fontSize: "1.5em" }}
                >
                  - 비밀번호 확인 -
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={deletePassword}
                ></button>
              </div>
              <div class="modal-body" style={{ fontSize: "1.2em" }}>
                {passwordcheckmessage}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={deletePassword}
                >
                  닫기
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={gotoUpdatePage}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 비밀번호 확인 메시지 모달 */}
        {/* 회원 탈퇴 메시지 창 */}
        <div
          class="modal fade"
          id="deleteMemberModal"
          tabindex="-1"
          aria-labelledby="deleteMemberModal"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1
                  class="modal-title text-center "
                  id="deleteMemberModal"
                  style={{ fontSize: "1.4em" }}
                >
                  - 회원 탈퇴 -
                </h1>
              </div>
              <div class="modal-body text-center" style={{ fontSize: "1.2em" }}>
                그동안 감사했습니다😢 이렇게 가신다니 아쉬워요 (T_T)
              </div>
              <div class="modal-footer justify-content-center">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    deleteMember();
                    navigate("/", { return: true });
                  }}
                  style={{ fontSize: "1.3em" }}
                >
                  메인페이지로
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 회원 탈퇴 메시지 창 */}
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}

export default Mypage;
