import React, { useState, useEffect, useRef } from "react";
import "../Css/main.css";
import "../Css/Ratingpage.css";
import "../Css/checkout.css";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import defaultprofileimage from "../Assets/defaultprofileimage.jpg";
import axios from "axios";
import "bootstrap";
import Sidesection from "../Components/Sidesection";
import { v4 as uuidv4 } from 'uuid';

function CheckoutAll() {
  const { 
    estimateId,
    userName,
    userPhone,
    plannerEmail,
    plannerName,
    plannerImg,
    depositprice
   } = useLocation().state;

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [paymentAmount, setPaymentAmount] = useState(depositprice * quantity);
  const [paymentMethod, setPaymetMethod] = useState("card");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [depositAmount, setDepositAmount] = useState(depositprice);

  const [paymentType, setPaymentType] = useState("all");
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem("email"));
  const plannerMatchingPriceCheckInput = useRef();
  const plannerMatchingPriceFeedback = useRef();
  const plannerMatchingPriceConfirm = useRef();
  const [plannerMatchingPriceMessage, setPlannerMatchingPriceMessage] =
    useState("");

  const path = useLocation().pathname;

  function requestPay() {
    const { IMP } = window;
    IMP.request_pay(
      {
        pg: "paypal.UFYSG9T7RFW2A",
        pay_method: { paymentMethod },
        merchant_uid: `${uuidv4()}-${estimateId}`,
        name: "플래너 매칭서비스",
        amount: paymentAmount - depositAmount,
        buyer_email: sessionStorage.getItem("email"),
        buyer_name: userName,
        buyer_tel: userPhone,
        m_redirect_url: `${process.env.REACT_APP_API_URL || "http://localhost:3000"}/checkoutcomp`,
        // buyer_addr: "서울특별시 강남구 삼성동",
        // buyer_postcode: "123-456",
      },
      function (rsp) {
        // callback
        if (rsp.success) {
          axios
            .post("/payment/callback", {
              estimateId,
              paymentMethod,
              tempPaymentStatus: paymentStatus,
              paymentType,
              paymentAmount,
              plannerEmail,
              userEmail
            })
            .then((res) => {
             // console.log(res);
              const value = res.data;
              if (value === "depositnonvalid") {
                alert("계약금 결제 먼저 해주세요.");
              } else if (value === "nonvalid") {
                alert("유효하지 않은 결제 유형입니다.");
              } else if (value === "checkall") {
                //계약금 처리만 된 상태(취소 상태로 paymentStatus 자동으로 바뀜)
              } else if (value === "all") {
                sessionStorage.setItem("checkout", "all");
                navigate("/checkoutcomp", {
                  state: {
                    estimateId,
                    plannerImg,
                    plannerName,
                    plannerEmail,
                    price: paymentAmount,
                  },
                });
              } else if (value === "completed") {
                alert("이미 전체 결제가 이루어진 건입니다!");
              }
            })
            .catch((e) => {
              //  console.log(e);
            });
        } else {
          alert(rsp.error_msg);
          
          axios
            .post("/payment/callback", {
              estimateId,
              paymentMethod,
              tempPaymentStatus: "cancelled",
              paymentType: "all",
              plannerEmail,
              userEmail
            })
            .then((res) => {
             // console.log(res);
              const value = res.data;
              if (value === "depositnonvalid") {
                alert("계약금 결제 먼저 해주세요.");
              } else if (value === "nonvalid") {
                alert("유효하지 않은 결제 유형입니다.");
              } else if (value === "checkall") {
                //계약금 처리만 된 상태(취소 상태로 paymentStatus 자동으로 바뀜)
              } else if (value === "all") {
                sessionStorage.setItem("checkout", "all");
                navigate("/checkoutcomp", {
                  state: {
                    estimateId,
                    plannerImg,
                    plannerName,
                    plannerEmail,
                    price: paymentAmount,
                  },
                });
              } else if (value === "completed") {
                alert("이미 전체 결제가 이루어진 건입니다!");
              }
            })
            .catch((e) => {
              //  console.log(e);
            });
        }
      }
    );
  }
  
  useEffect(() => {
    if (sessionStorage.getItem("checkout") !== "all") {
      axios
        .post("/payment/callback", {
          estimateId,
          paymentMethod,
          tempPaymentStatus: "cancelled",
          paymentType: "all",
          paymentAmount,
          plannerEmail,
          userEmail
        })
        .then((res) => {
          //console.log(res);
              const value = res.data;
              if (value === "depositnonvalid") {
                alert("계약금 결제 먼저 해주세요.");
              } else if (value === "nonvalid") {
                alert("유효하지 않은 결제 유형입니다.");
              } else if (value === "checkall") {
                //계약금 처리만 된 상태(취소 상태로 paymentStatus 자동으로 바뀜)
              } else if (value === "all") {
                sessionStorage.setItem("checkout", "all");
                navigate("/checkoutcomp", {
                  state: {
                    estimateId,
                    plannerImg,
                    plannerName,
                    plannerEmail,
                    price: paymentAmount,
                  },
                });
              } else if (value === "completed") {
                alert("이미 전체 결제가 이루어진 건입니다!");
              }
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (path.indexOf("/checkoutall") !== -1) {
      window.$("#plannerMatchingPriceModal").modal("show");
    }

    if (window.IMP) {
      window.IMP.init("imp83460455"); 
    }
  }, []);

  return (
    <div className="containerbox">
      <div className="mainlayout box1" style={{ minHeight: "100vh" }}>
        <NavigationBar title={"결제하기"} />
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
              value="맞춤형 웨딩플래너 서비스"
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
            <p className="detailcheckout" style={{ fontSize: "0.9em" }}>
              전체금액 - 계약금
              <br /> (
              {paymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              원) - (
              {depositprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              원)
            </p>
          </div>
        </div>
        {/* <hr /> */}
        <div className="mb-3 row checkouttext">
          <label
            for="staticEmail"
            style={{ fontSize: "0.9em" }}
            className="col-sm-4 col-form-label"
          >
            상품 금액
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              readonly
              className="form-control-plaintext"
              id="itemName"
              value={`${paymentAmount - depositAmount}원`}
              style={{ fontSize: "0.9em" }}
            />
          </div>
        </div>
        <button
          onClick={requestPay}
          className="checkoutBtn"
          style={{ marginTop: "10px" }}
        >
          결제하기
        </button>
        <Footer />
        {/* 플래너 매칭 비용 modal 창 */}
        <div
          class="modal fade"
          id="plannerMatchingPriceModal"
          tabindex="-1"
          aria-labelledby="plannerMatchingPriceModal"
          aria-hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1
                  class="modal-title justify-content-center "
                  id="plannerMatchingPriceModal"
                  style={{ fontSize: "1.5em" }}
                >
                  - 플래너 매칭 비용 입력 -
                </h1>
              </div>
              <div class="modal-body">
                <div class="has-validation col col-md-10">
                  <input
                    type="text"
                    class="form-control "
                    id="plannerMatchingPriceCheck"
                    ref={plannerMatchingPriceCheckInput}
                    value={paymentAmount}
                    onChange={(e) => {
                      let value = e.target.value;
                      setPaymentAmount(value);
                      if (e.target.value === "0") {
                        plannerMatchingPriceCheckInput.current.classList.add(
                          "is-invalid"
                        );
                        plannerMatchingPriceCheckInput.current.classList.remove(
                          "is-valid"
                        );
                        plannerMatchingPriceFeedback.current.classList.remove(
                          "invisible"
                        );
                        plannerMatchingPriceFeedback.current.classList.add(
                          "invalid-feedback"
                        );
                        plannerMatchingPriceFeedback.current.classList.remove(
                          "valid-feedback"
                        );
                        setPlannerMatchingPriceMessage(
                          "금액은 0이 될 수 없습니다."
                        );
                        plannerMatchingPriceConfirm.current.disabled = true;
                      } else {
                        if (e.target.value === "") {
                          plannerMatchingPriceCheckInput.current.classList.add(
                            "is-invalid"
                          );
                          plannerMatchingPriceCheckInput.current.classList.remove(
                            "is-valid"
                          );
                          plannerMatchingPriceFeedback.current.classList.remove(
                            "invisible"
                          );
                          plannerMatchingPriceFeedback.current.classList.add(
                            "invalid-feedback"
                          );
                          plannerMatchingPriceFeedback.current.classList.remove(
                            "valid-feedback"
                          );
                          setPlannerMatchingPriceMessage(
                            "금액을 입력해주세요!"
                          );
                          plannerMatchingPriceConfirm.current.disabled = true;
                        } else if (isNaN(e.target.value)) {
                          plannerMatchingPriceCheckInput.current.classList.add(
                            "is-invalid"
                          );
                          plannerMatchingPriceCheckInput.current.classList.remove(
                            "is-valid"
                          );
                          plannerMatchingPriceFeedback.current.classList.remove(
                            "invisible"
                          );
                          plannerMatchingPriceFeedback.current.classList.add(
                            "invalid-feedback"
                          );
                          plannerMatchingPriceFeedback.current.classList.remove(
                            "valid-feedback"
                          );
                          setPlannerMatchingPriceMessage("숫자를 입력하세요!");
                          plannerMatchingPriceConfirm.current.disabled = true;
                        } else if (parseInt(e.target.value) <= depositAmount) {
                          plannerMatchingPriceCheckInput.current.classList.add(
                            "is-invalid"
                          );
                          plannerMatchingPriceCheckInput.current.classList.remove(
                            "is-valid"
                          );
                          plannerMatchingPriceFeedback.current.classList.remove(
                            "invisible"
                          );
                          plannerMatchingPriceFeedback.current.classList.add(
                            "invalid-feedback"
                          );
                          plannerMatchingPriceFeedback.current.classList.remove(
                            "valid-feedback"
                          );
                          setPlannerMatchingPriceMessage(
                            "예약금보다 작거나 같은 금액은 입력 불가입니다!"
                          );
                          plannerMatchingPriceConfirm.current.disabled = true;
                        } else {
                          plannerMatchingPriceCheckInput.current.classList.remove(
                            "is-invalid"
                          );
                          plannerMatchingPriceCheckInput.current.classList.add(
                            "is-valid"
                          );
                          plannerMatchingPriceFeedback.current.classList.remove(
                            "invisible"
                          );
                          plannerMatchingPriceFeedback.current.classList.remove(
                            "invalid-feedback"
                          );
                          plannerMatchingPriceFeedback.current.classList.add(
                            "valid-feedback"
                          );
                          setPlannerMatchingPriceMessage("all good!");
                          plannerMatchingPriceConfirm.current.disabled = false;
                        }
                      }
                    }}
                    style={{ fontSize: "1.2em" }}
                    placeholder="플래너와 상의한 매칭 비용을 입력해주세요."
                    //    onKeyPress={submitPasswordCheck}
                    required
                    autocomplete="off"
                    maxLength="20"
                  />
                  <div
                    class="invisible text-start password-feedback"
                    style={{ fontSize: "1em" }}
                    ref={plannerMatchingPriceFeedback}
                  >
                    {plannerMatchingPriceMessage}
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  ref={plannerMatchingPriceConfirm}
                  onClick={() => {
                    // setChangedPrice(!changedPrice);
                  }}
                  disabled
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 플래너 매칭 비용 모달 */}
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}

export default CheckoutAll;
