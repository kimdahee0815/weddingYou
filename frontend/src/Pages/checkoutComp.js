import "../Css/main.css";
import "../Css/checkout.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidesection from "../Components/Sidesection";

const CheckoutComp = () => {
  const checkoutsession = window.sessionStorage.getItem("checkout");
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const isSuccess = query.get("imp_success") === "true";
  const storedInfo = JSON.parse(window.sessionStorage.getItem("checkoutInfo"));
  useEffect(() => {
  if (!storedInfo) {
    window.sessionStorage.removeItem("checkoutInfo");
    navigate("/matching");
  }
}, [isSuccess, storedInfo]);
  const impUid = query.get("imp_uid");
  const merchantUid = query.get("merchant_uid");

  const {
    plannerImg,
    estimateId,
    plannerName,
    plannerEmail,
    price
  } = storedInfo || {};

  const Checkout = ({ checkout }) => {
    if(!isSuccess){
      navigate(`/matching`);
    }
    if (checkout === "deposit") {
      return (
        <div>
          <p className="checkoutmsg">
            Your deposit payment has been completed!
            <br /> Your planner will contact you shortly!
          </p>
          <button
            className="checkoutBtn1"
            onClick={() => navigate("/matching")}
          >
            Go to Confirm Estimate
          </button>
        </div>
      );
    } else if (checkout === "all") {
      return (
        <div>
          <p className="checkoutmsg">
            Your matching fee payment has been completed!
            <br />
            🎉 Wish You A Perfect Wedding 🎉
          </p>
          <button
            className="checkoutBtn1"
            onClick={() =>
              navigate("/rating", {
                state: {
                  estimateId,
                  plannerImg,
                  plannerName,
                  plannerEmail,
                  price,
                },
              })
            }
          >
            Write a Review
          </button>
        </div>
      );
    }
  };

  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <div className="checkoutbox">
          <div>
            <p className="titlemsg" style={{ fontSize: "1.8em" }}>
              Payment Complete
            </p>
            <Checkout checkout={checkoutsession} />
          </div>
        </div>
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
};

export default CheckoutComp;
