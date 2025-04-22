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

function Checkoutdeposit() {
  var IMP = window.IMP;
  //IMP.init("imp57211510");
  IMP.init("imp01206222");
  const navigate = useNavigate();

  const { estimateId } = useLocation().state;
  const { userName } = useLocation().state;
  const { userPhone } = useLocation().state;
  const { planneremail } = useLocation().state;
  const { plannerName } = useLocation().state;
  const { depositprice } = useLocation().state;
  const { plannerImg } = useLocation().state;
  console.log("estimateId:" + estimateId);
  console.log("userName:" + userName);
  console.log("userPhone:" + userPhone);
  console.log("planneremail:" + planneremail);
  console.log("plannerName:" + plannerName);
  console.log("plannerImg" + plannerImg);
  console.log("depositprice: " + depositprice);

  //const [price, setPrice] = useState(10000);
  console.log("depositprice:" + depositprice);
  const [quantity, setQuantity] = useState(1);
  const [paymentAmount, setPaymentAmount] = useState(depositprice * quantity);
  const [paymentMethod, setPaymetMethod] = useState("card");
  const [paymentStatus, setPaymentStatus] = useState("other");
  const [depositAmount, setDepositAmount] = useState(depositprice);
  console.log("depositAmount:" + depositAmount);
  const [depositStatus, setDepositStatus] = useState("paid");
  const [paymentType, setPaymentType] = useState("deposit");
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem("email"));
  const [plannerEmail, setPlannerEmail] = useState(planneremail);
  const [plannerCareerYears, setPlannerCareerYears] = useState(0);
  let depositAmount1 = depositAmount;

  function requestPay() {
    IMP.request_pay(
      {
        pg: "kcp",
        pay_method: { paymentMethod },
        merchant_uid: `57126841-${estimateId}` + IMP,
        name: "플래너 매칭 계약금",
        amount: depositAmount1,
        buyer_email: sessionStorage.getItem("email"),
        buyer_name: userName,
        buyer_tel: userPhone,
        // buyer_addr: "서울특별시 강남구 삼성동",
        // buyer_postcode: "123-456",
      },
      function (rsp) {
        // callback
        if (rsp.success) {
          console.log(rsp);

          axios
            .post("/deposit/callback", {
              price: depositprice,
              quantity: quantity,
              paymentMethod: paymentMethod,
              paymentAmount: paymentAmount,
              tempPaymentStatus: "other",
              depositAmount: depositAmount,
              tempDepositStatus: "paid",
              paymentType: "deposit",
              userEmail: userEmail,
              plannerEmail: plannerEmail,
              estimateId: estimateId,
            })
            .then((res) => {
              console.log(res);

              sessionStorage.setItem("checkout", "deposit");
              navigate("/checkoutcomp", {
                state: {
                  estiamteId: estimateId,
                  plannerImg: plannerImg,
                  plannerName: plannerName,
                  planneremail: planneremail,
                  price: depositprice,
                },
              });
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          console.log(rsp);
          alert(rsp.error_msg);

          axios
            .post("/deposit/callback", {
              price: depositprice,
              quantity: quantity,
              paymentMethod: paymentMethod,
              paymentAmount: paymentAmount,
              tempPaymentStatus: "other",
              depositAmount: depositAmount,
              tempDepositStatus: "cancelled",
              paymentType: "deposit",
              userEmail: userEmail,
              plannerEmail: plannerEmail,
              estimateId: estimateId,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    );
  }

  useEffect(() => {
    axios
      .post("/deposit/callback", {
        price: depositprice,
        quantity: quantity,
        paymentMethod: paymentMethod,
        paymentAmount: paymentAmount,
        tempPaymentStatus: "other",
        depositAmount: depositAmount,
        tempDepositStatus: "cancelled",
        paymentType: "deposit",
        userEmail: userEmail,
        plannerEmail: plannerEmail,
        estimateId: estimateId,
      })
      .then((res) => {
        console.log(res);
        const plannerCareerYearsData = res.data;
        setPlannerCareerYears(plannerCareerYearsData);
        if (plannerCareerYears >= 0 && plannerCareerYearsData < 5) {
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
  }, []);

  return (
    <div className="containerbox">
      <div className="mainlayout box1" style={{ height: "950px" }}>
        <NavigationBar title={"결제하기 (계약금)"} />
        <div className="plannerpro" style={{ marginTop: 110 }}>
          {plannerImg === "data:image/jpeg;base64," ? (
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
              {" "}
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
