import React from "react";
import "../Css/main.css";
import "../Css/Ratingpage.css";
import "../Css/checkout.css";
import defaultprofileimage from "../Assets/defaultprofileimage.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidesection from "../Components/Sidesection";
import { v4 as uuidv4 } from 'uuid';

function Checkoutdeposit() {
  const navigate = useNavigate();

  const storedInfo = JSON.parse(window.sessionStorage.getItem("checkoutInfo"));
  useEffect(() => {
    if (!storedInfo) {
      navigate("/matching");
    }
  }, [storedInfo]);

  const { 
    estimateId, 
    userName, 
    userPhone, 
    plannerEmail, 
    plannerName, 
    depositprice,
    plannerImg,
    plannerCareer
  } = storedInfo;

  const [quantity, setQuantity] = useState(1);
  const [paymentAmount, setPaymentAmount] = useState(depositprice * quantity);
  const [paymentMethod, setPaymetMethod] = useState("card");
  const [paymentStatus, setPaymentStatus] = useState("other");
  const [depositAmount, setDepositAmount] = useState(depositprice);
  const [depositStatus, setDepositStatus] = useState("cancelled");
  const [paymentType, setPaymentType] = useState("deposit");
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem("email"));
  const [plannerCareerYears, setPlannerCareerYears] = useState(plannerCareer);

  useEffect(() => {
    axios
      .post("/deposit/callback", {
        price: depositprice,
        quantity,
        paymentMethod,
        paymentAmount,
        tempPaymentStatus: paymentStatus,
        depositAmount,
        tempDepositStatus: depositStatus,
        paymentType,
        userEmail,
        plannerEmail,
        estimateId,
      })
      .then((res) => {
       // console.log(res);
        const plannerCareerYearsData = res.data;
        setPlannerCareerYears(plannerCareerYearsData);
        if (plannerCareerYearsData >= 0 && plannerCareerYearsData < 5) {
          setDepositAmount(50000);
        } else if (plannerCareerYearsData < 15) {
          setDepositAmount(100000);
        } else {
          setDepositAmount(150000);
        }
      })
      .catch((e) => {
        console.log(e);
      });
      if (window.IMP) {
        window.IMP.init("imp83460455"); 
      }
  }, [depositprice, quantity, paymentMethod, paymentAmount, paymentStatus, depositAmount, depositStatus, paymentType, userEmail, plannerEmail, estimateId ]);

  function isMobile() {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent);
  }

    const paymentParams = {
      //pg: "kcp.A52CY",
      channelKey: "channel-key-c64770de-2fa3-41c4-bb6b-e7026c633010",
      pay_method: paymentMethod,
      merchant_uid: `${uuidv4()}-${estimateId}`,
      name: "플래너 매칭서비스",
      amount: depositprice,
      company: "Wedding You", 
      buyer_email: sessionStorage.getItem("email"),
      buyer_name: userName,
      buyer_tel: userPhone,
      //buyer_addr: "서울특별시 강남구 삼성동",
      //buyer_postcode: "123-456",
      language: "ko", 
      //m_redirect_url: `${process.env.REACT_APP_API_URL || "http://localhost:3000"}/checkoutcomp`,
  };

  if (isMobile()) {
    //console.log("Mobile");
    paymentParams.m_redirect_url = `${process.env.REACT_APP_API_URL || "http://localhost:3000"}/checkoutcomp`;
  }

  function requestPay() {
    const { IMP } = window;
    IMP.request_pay(paymentParams,
      function (rsp) {
        // callback
        if (rsp.success) {
          //console.log(rsp);

          axios
            .post("/deposit/callback", {
              price: depositprice,
              quantity,
              paymentMethod,
              paymentAmount,
              tempPaymentStatus: paymentStatus,
              depositAmount,
              tempDepositStatus: "paid",
              paymentType,
              userEmail,
              plannerEmail,
              estimateId,
            })
            .then((res) => {
             // console.log(res);

              sessionStorage.setItem("checkout", "deposit");
              sessionStorage.setItem("checkoutInfo", JSON.stringify({
                estimateId,
                plannerImg,
                plannerName,
                plannerEmail,
                price: depositprice,
              }));
              navigate("/checkoutcomp");
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          //console.log(rsp);
          alert(rsp.error_msg);
          navigate("/matching");
        }
      }
    );
  }

  return (
    <div className="containerbox">
      <div className="mainlayout box1" style={{ height: "950px" }}>
        <NavigationBar title={"결제하기 (계약금)"} />
        <div className="plannerpro" style={{ marginTop: 110 }}>
          {!plannerImg ? (
            <img
              src={defaultprofileimage}
              style={{ width: "250px", height: "230px" }}
              className="plannerproimg"
              alt={defaultprofileimage}
            />
          ) : (
            <img
              src={plannerImg}
              style={{ width: "250px", height: "230px" }}
              className="plannerproimg"
              alt={defaultprofileimage}
            />
          )}

          <p className="plannerName">{plannerName}</p>
        </div>
        <div className="mb-3 row checkouttext">
          <label
            for="staticEmail"
            style={{ fontSize: "0.9em" }}
            className="col-sm-4 col-form-label"
          >
            상품명
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              readonly
              className="form-control-plaintext"
              id="itemName"
              value="맞춤형 웨딩플래너 서비스(계약)"
              style={{ fontSize: "0.9em" }}
            />
          </div>
        </div>
        {/* <hr /> */}
        <div className="mb-3 row checkouttext">
          <label
            for="staticEmail"
            style={{ fontSize: "0.9em" }}
            className="col-sm-4 col-form-label"
          >
            상품 상세정보
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              readonlyvm
              className="form-control-plaintext"
              id="itemName"
              value="플래너 매칭 계약금"
              style={{ fontSize: "0.9em" }}
            />
            <div
              style={{
                fontSize: "0.6em",
                marginRight: "15px",
              }}
            >
              (경력 5년 미만 : 50,000 / 경력 15년 미만 : 100,000 / 경력 15년
              이상 : 150,000)
            </div>
          </div>
        </div>
        {/* <hr /> */}
        <div className="mb-3 row checkouttext">
          <label
            for="staticEmail"
            style={{ fontSize: "0.9em" }}
            className="col-sm-4 col-form-label"
          >
            계약금 금액
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              readonly
              className="form-control-plaintext"
              id="itemName"
              value={`${depositAmount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`}
              style={{ fontSize: "0.9em" }}
            />
          </div>
        </div>
        <button
          onClick={requestPay}
          style={{ marginTop: "15px" }}
          className="checkoutBtn"
        >
          결제하기
        </button>
        <Footer />
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}

export default Checkoutdeposit;
