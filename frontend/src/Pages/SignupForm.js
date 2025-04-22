import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "../Css/Signup.css";
import axios from "axios";
import React, { useEffect } from "react";
import SignupSuccess from "./SignupSuccess";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import "../Css/mypage.css";
import Sidesection from "../Components/Sidesection";

function SignupForm() {
  //회원가입 성공 여부
  let [sign, setsign] = useState("before");
  let navigate = useNavigate();
  let { category } = useParams();
  useEffect(() => {
    if (category !== "user" && category !== "planner") {
      navigate("/*");
    }
  });

  //제약조건
  let [checkAll, setCheckAll] = useState(false);
  let [namecheck, setNamecheck] = useState(false);
  let [emailcheck, setEmailcheck] = useState(false);
  let [passwordcheck, setPasswordcheck] = useState(false);
  let [passwordcheck2, setPasswordcheck2] = useState(false);
  let [phonecheck, setPhonecheck] = useState(false);
  let [careercheck, setCareercheck] = useState(true);
  let [duplicatecheck, setDuplicatecheck] = useState(true);
  let [check, setcheck] = useState({
    ageCheck: false,
    membershipCheck: false,
  });
  //제약조건

  //상태값
  let [name, setName] = useState("");
  let [password, setPassword] = useState("");
  let [password2, setPassword2] = useState("");
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [gender, setGender] = useState("male");
  let [career, setCareer] = useState("");
  //스타일 상태값
  let [namestyle, setNamestyle] = useState("");
  let [phonestyle, setPhonestyle] = useState("");
  let [passwordstyle, setPasswordstyle] = useState("");
  let [passwordstyle2, setPasswordstyle2] = useState("");
  let [emailstyle, setEmailstyle] = useState("");
  let [careerstyle, setCareerstyle] = useState("is-valid");
  //상태값 끝

  //회원 정보 입력 함수 + 유효성 검사 로직
  useEffect(() => {
    if (phone === "") {
      setPhonestyle("");
      setPhonecheck(false);
    }
    if (email === "") {
      setEmailstyle("");
      setEmailcheck(false);
    }
    if (password === "") {
      setPasswordstyle("");
      setPasswordcheck(false);
    }
    if (name === "") {
      setNamestyle("");
      setNamecheck(false);
    }
    if (career === "") {
      setCareerstyle("");
      setCareercheck(false);
    }
    if (password2 === "" || password2 === null) {
      setPasswordstyle2("");
      setPasswordcheck2(false);
    } else if (password === password2) {
      setPasswordstyle2("is-valid");
      setPasswordcheck2(true);
    } else {
      setPasswordstyle2("is-invalid");
      setPasswordcheck2(false);
    }
  }, [password, password2, setPasswordcheck2, name, email, phone, career]);
  useEffect(() => {
    const signupbtn = document.querySelector("#signupbtn");
    if (category === "user") {
      setCareercheck(true);
    }
    if (signupbtn.disabled === false && checkAll === true) {
      signupbtn.classList.remove("btn-colour-2");
      signupbtn.classList.add("btn-colour-1");
    } else {
      signupbtn.classList.add("btn-colour-2");
      signupbtn.classList.remove("btn-colour-1");
    }
  }, [
    checkAll,
    namecheck,
    emailcheck,
    passwordcheck,
    passwordcheck2,
    phonecheck,
    careercheck,
    duplicatecheck,
  ]);

  const EventHandlerName = (e) => {
    const koreanNameRegExp = /^[가-힣\s]+$/;
    setName(e.target.value);
    if (koreanNameRegExp.test(e.target.value)) {
      setNamecheck(true);
      setNamestyle("is-valid");
    } else {
      setNamecheck(false);
      setNamestyle("is-invalid");
    }
  };
  const EventHandlerPassword = (e) => {
    const passwordRegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{8,}$/;
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

  const EventHandleremail = (e) => {
    const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmail(e.target.value);
    setDuplicatecheck(true);
    if (emailRegExp.test(e.target.value)) {
      setEmailcheck(true);
      setEmailstyle("is-valid");
    } else {
      setEmailcheck(false);
      setEmailstyle("is-invalid");
    }
  };

  const EventHandlerPhone = (e) => {
    const phoneRegExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    const phone = e.target.value
      .replace(/[^0-9]/g, "")
      .replace(/([0-9]{2,3})([0-9]{3,4})([0-9]{4})/, "$1-$2-$3");
    setPhone(phone);
    if (phoneRegExp.test(phone)) {
      setPhonecheck(true);
      setPhonestyle("is-valid");
    } else {
      setPhonecheck(false);
      setPhonestyle("is-invalid");
    }
  };

  const EventHandlerGender = (e) => {
    setGender(e.target.value);
  };

  const EventHandlerCareer = (e) => {
    setCareer(e.target.value);
    const CareerRegExp = /^(?!0[0-9])[0-9]+$/;
    if (CareerRegExp.test(e.target.value) && e.target.value <= 30) {
      setCareerstyle("is-valid");
      setCareercheck(true);
    } else {
      setCareerstyle("is-invalid");
      setCareercheck(false);
    }
  };

  //회원 정보 입력 함수 끝

  //체크박스 관련 함수
  const CheckHandler = (e) => {
    let copy = { ...check, [e.target.name]: e.target.checked };
    setcheck(copy);
  };
  const CheckHandlerAll = () => {
    if (checkAll === false) {
      setcheck({
        ageCheck: true,
        membershipCheck: true,
      });
      setCheckAll(true);
    } else if (checkAll === true) {
      setcheck({
        ageCheck: false,
        membershipCheck: false,
      });
      setCheckAll(false);
    }
  };
  //체크박스 관련 함수

  //뒤로가기 버튼 함수
  const handleBack = () => {
    navigate(-1);
  };
  //뒤로가기 버튼 함수

  //회원가입 axios 함수
  const userRegister = () => {
    if (category === "user") {
      axios
        .post("/user/register", {
          name: name,
          password: password,
          email: email,
          phoneNum: phone,
          gender: gender,
        })
        .then((res) => {
          if (res.data === "") {
            setEmailstyle("is-invalid");
            setEmailcheck(false);
            setDuplicatecheck(false);
          } else {
            setsign("after");
          }
        })
        .catch((e) => {
          console.log(e);
          setEmailstyle("is-invalid");
          setEmailcheck(false);
          setDuplicatecheck(false);
        });
    }
    if (category === "planner") {
      axios
        .post("/planner/register", {
          name: name,
          password: password,
          email: email,
          phoneNum: phone,
          gender: gender,
          career: career,
          introduction: "아직 소개글이 없습니다!",
        })
        .then((res) => {
          console.log(res);
          if (res.data === "") {
            setEmailstyle("is-invalid");
            setEmailcheck(false);
            setDuplicatecheck(false);
          } else {
            setsign("after");
          }
        })
        .catch((e) => {
          console.log(e);
          setEmailstyle("is-invalid");
          setEmailcheck(false);
          setDuplicatecheck(false);
        });
    }
  };

  if (sign === "before") {
    return (
      <div className="bg containerbox">
        <div className="mainlayout box1">
          {category === "user" ? (
            <NavigationBar title={"일반회원"} />
          ) : (
            <NavigationBar title={"플래너회원"} />
          )}

          <div className="Signup-guidebar">
            <div className="guideline"></div>
            <span style={{ fontSize: "1.3em" }}>회원가입</span>
            <div className="guideline"></div>
          </div>

          <div className="Signup-inputwrap">
            <InputComp
              content="이름"
              EventHandler={EventHandlerName}
              style={namestyle}
              message="올바른 이름을 작성해주세요"
              length={5}
              type="text"
            />
            <InputComp
              content="이메일"
              EventHandler={EventHandleremail}
              style={emailstyle}
              message={
                duplicatecheck === false
                  ? "중복된 이메일입니다."
                  : "올바른 이메일 형식으로 작성해주세요"
              }
              length={100}
              type="text"
            />
            <InputComp
              content="비밀번호"
              EventHandler={EventHandlerPassword}
              style={passwordstyle}
              message="최소8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함"
              length={20}
              type="password"
            />
            <InputComp
              content="비밀번호 확인"
              EventHandler={EventHandlerPassword2}
              style={passwordstyle2}
              message="비밀번호 불일치"
              length={20}
              type="password"
            />
            <InputComp
              content="핸드폰"
              EventHandler={EventHandlerPhone}
              style={phonestyle}
              message="올바른 핸드폰 번호가 아닙니다."
              length={13}
              type="text"
              value={phone}
            />
            <div class="row justify-content-md-center mb-2">
              <label
                htmlFor="gender"
                className="form-label col col-md-2 mt-2"
                style={{ flex: "1 0 0%", fontSize: "1.2em" }}
              >
                성별
              </label>
              <div class="input-group" id="gender">
                <div class="input-group-text">
                  <input
                    class="form-check-input mt-0"
                    type="radio"
                    value="male"
                    name="gender"
                    htmlFor="male"
                    checked={gender === "male"}
                    onChange={EventHandlerGender}
                    aria-label="Radio button for following text input"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <input
                  type="text"
                  class="form-control"
                  id="male"
                  aria-label="male btn"
                  value="남자"
                  disabled
                  style={{ background: "white", fontSize: "1.2em" }}
                />
                <div class="input-group-text">
                  <input
                    class="form-check-input mt-0"
                    type="radio"
                    value="female"
                    name="gender"
                    checked={gender === "female"}
                    htmlFor="female"
                    onChange={EventHandlerGender}
                    aria-label="Radio button for following text input"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <input
                  type="text"
                  class="form-control"
                  id="female"
                  aria-label="female btn"
                  value="여자"
                  disabled
                  style={{ background: "white", fontSize: "1.2em" }}
                />
              </div>
            </div>
            {category === "planner" && (
              <InputComp
                content="경력 (단위: 년 , 최대 30)"
                type="number"
                value={career}
                EventHandler={EventHandlerCareer}
                message={
                  career > 30
                    ? "경력은 30년까지 입력 가능합니다."
                    : "올바른 숫자를 입력해주세요"
                }
                style={careerstyle}
                length={2}
              />
            )}
          </div>

          <div
            className="Signup-acceptwrap"
            style={{ marginBottom: "20px", marginTop: "20px" }}
          >
            <CheckboxComp
              Handler={CheckHandlerAll}
              checked={check.ageCheck && check.membershipCheck}
              message="모두확인, 동의합니다."
            />

            <CheckboxComp
              Handler={CheckHandler}
              checked={check.ageCheck}
              message="만14세 이상입니다. (필수)"
              name="ageCheck"
            />

            <CheckboxComp
              Handler={CheckHandler}
              checked={check.membershipCheck}
              message="회원약관 (필수)"
              name="membershipCheck"
            />

            <div className="Signup-contentbox">
              <div className="contentbar">
                <span style={{ fontSize: "1.2em" }}>개인정보수집</span>
              </div>
              <div className="left">
                <span style={{ fontSize: "1em" }}>목적</span>
              </div>
              <div className="right">
                <span style={{ fontSize: "1em" }}>
                  개인 식별,서비스 제공을 위한 연락처 수집
                </span>
              </div>
              <div className="left">
                <span style={{ fontSize: "1em" }}>항목</span>
              </div>
              <div className="right">
                <span style={{ fontSize: "1em" }}>
                  개인정보 및 이용상품 정보 등
                </span>
              </div>
              <div className="left">
                <span style={{ fontSize: "1em" }}>기간</span>
              </div>
              <div className="right">
                <span style={{ fontSize: "1em" }}>회원 탈퇴 시 즉시 파기</span>
              </div>
            </div>
            <div style={{ clear: "both" }}></div>
            <div style={{ clear: "both" }}></div>
          </div>

          <div className="Signup-button">
            <button
              className="btn-colour-2"
              disabled={
                !check.ageCheck ||
                !check.membershipCheck ||
                !namecheck ||
                !emailcheck ||
                !phonecheck ||
                !passwordcheck ||
                !passwordcheck2 ||
                !careercheck
              }
              onClick={() => {
                //엑시오스 함수 자리
                // setsign("after");
                userRegister();
              }}
              id="signupbtn"
            >
              가입하기
            </button>
          </div>
          <div style={{ height: 94.19 }}></div>
          <Footer />
        </div>
        <div className="box2"></div>
        <div className="box3">
          <Sidesection />
        </div>
      </div>
    );
  } else if (sign === "after") {
    return <SignupSuccess></SignupSuccess>;
  }
}
export default SignupForm;

const InputComp = ({
  EventHandler,
  content,
  style,
  message,
  length,
  type,
  value,
}) => {
  return (
    <>
      <div className="col-md-4" style={{ width: 256 }}>
        <label htmlFor="validationServer01" className="form-label">
          <span style={{ fontSize: "1.2em" }}>{content}</span>
        </label>
        <input
          type={type}
          className={`form-control ${style}`}
          id="validationServer01"
          required
          onChange={EventHandler}
          maxLength={length}
          value={value}
          autoComplete="off"
        />
        <div
          id="validationServer03Feedback"
          class="invalid-feedback"
          style={{ fontSize: "1em" }}
        >
          {message}
        </div>
      </div>
    </>
  );
};

const CheckboxComp = ({ Handler, checked, message, name }) => {
  return (
    <div className="Signup-checkbox">
      <>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            onClick={Handler}
            checked={checked}
            name={name}
            id="flexCheckChecked"
            style={{ cursor: "pointer" }}
          />
          <label
            className="form-check-label"
            htmlFor="flexCheckChecked"
            style={{ fontSize: "1.3em" }}
          >
            {message}
          </label>
        </div>
      </>
    </div>
  );
};
