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
    plannerImg,
    depositprice
  } = storedInfo;
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

  function isMobile() {
      return /Mobi|Android|iPhone/i.test(navigator.userAgent);
    }
  
      const paymentParams = {
        //pg: "kcp.A52CY",
        channelKey: "channel-key-c64770de-2fa3-41c4-bb6b-e7026c633010",
        pay_method: paymentMethod,
        merchant_uid: `${uuidv4()}-${estimateId}`,
        name: "Planner Matching Service",
        amount: paymentAmount - depositAmount,
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
      paymentParams.m_redirect_url = `${process.env.REACT_APP_API_URL || "http://localhost:3000"}/checkoutcomp`;
    }

  function requestPay() {
    const { IMP } = window;
    IMP.request_pay(
      paymentParams,
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
                alert("Please complete the deposit payment first.");
              } else if (value === "nonvalid") {
                alert("Invalid payment type.");
              } else if (value === "checkall") {
                //계약금 처리만 된 상태(취소 상태로 paymentStatus 자동으로 바뀜)
              } else if (value === "all") {
                sessionStorage.setItem("checkout", "all");
                sessionStorage.setItem("checkoutInfo", JSON.stringify({
                  estimateId,
                  plannerImg,
                  plannerName,
                  plannerEmail,
                  price: paymentAmount,
                }));
                navigate("/checkoutcomp");
              } else if (value === "completed") {
                alert("This order has already been fully paid!");
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
                alert("Please complete the deposit payment first.");
              } else if (value === "nonvalid") {
                alert("Invalid payment type.");
              } else if (value === "checkall") {
                //계약금 처리만 된 상태(취소 상태로 paymentStatus 자동으로 바뀜)
              } else if (value === "all") {
                sessionStorage.setItem("checkout", "all");
                sessionStorage.setItem("checkoutInfo", JSON.stringify({
                  estimateId,
                  plannerImg,
                  plannerName,
                  plannerEmail,
                  price: paymentAmount,
                }));
                navigate("/checkoutcomp");
              } else if (value === "completed") {
                alert("This order has already been fully paid!");
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
                alert("Please complete the deposit payment first.");
              } else if (value === "nonvalid") {
                alert("Invalid payment type.");
              } else if (value === "checkall") {
                //계약금 처리만 된 상태(취소 상태로 paymentStatus 자동으로 바뀜)
              } else if (value === "all") {
                sessionStorage.setItem("checkout", "all");
                sessionStorage.setItem("checkoutInfo", JSON.stringify({
                  estimateId,
                  plannerImg,
                  plannerName,
                  plannerEmail,
                  price: paymentAmount,
                }));
                navigate("/checkoutcomp");
              } else if (value === "completed") {
                alert("This order has already been fully paid!");
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
        <NavigationBar title={"Payment"} />
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
            Product Name
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              readonly
              className="form-control-plaintext"
              id="itemName"
              value="Customized Wedding Planner Service"
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
            Product Details
          </label>
          <div className="col-sm-8">
            <p className="detailcheckout" style={{ fontSize: "0.9em" }}>
              Total Amount - Deposit
              <br /> (
              {paymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
               KRW) - (
              {depositprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
               KRW)
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
            Product Price
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              readonly
              className="form-control-plaintext"
              id="itemName"
              value={`${paymentAmount - depositAmount} KRW`}
              style={{ fontSize: "0.9em" }}
            />
          </div>
        </div>
        <button
          onClick={requestPay}
          className="checkoutBtn"
          style={{ marginTop: "10px" }}
        >
          Pay Now
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
                  - Enter Planner Matching Fee -
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
                          "Amount cannot be 0."
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
                            "Please enter an amount!"
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
                          setPlannerMatchingPriceMessage("Please enter a number!");
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
                            "Amount cannot be less than or equal to the deposit!"
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
                    placeholder="Please enter the matching fee agreed with your planner."
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
                  Confirm
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
