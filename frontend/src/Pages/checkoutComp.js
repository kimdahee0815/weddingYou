import "../Css/main.css";
import "../Css/checkout.css";
import { useNavigate, useLocation } from "react-router-dom";
import Sidesection from "../Components/Sidesection";

const CheckoutComp = () => {
  const checkoutsession = window.sessionStorage.getItem("checkout");
  const navigate = useNavigate();

  const { plannerImg } = useLocation().state;
  console.log(plannerImg);
  const { estimateId } = useLocation().state;
  console.log(estimateId);
  const { plannerName } = useLocation().state;
  console.log(plannerName);
  const { planneremail } = useLocation().state;
  const { price } = useLocation().state;

  const Checkout = ({ checkout }) => {
    if (checkout === "deposit") {
      return (
        <div>
          <p className="checkoutmsg">
            계약금 결제가 완료되었습니다!
            <br /> 빠른시일 내에 플래너가 연락드릴 예정입니다!
          </p>
          <button
            className="checkoutBtn1"
            onClick={() => navigate("/matching")}
          >
            견적 확정하러 가기
          </button>
        </div>
      );
    } else if (checkout === "all") {
      return (
        <div>
          <p className="checkoutmsg">
            매칭비용 결제가 완료되었습니다!
            <br />
            🎉 Wish You A Perfect Wedding 🎉
          </p>
          <button
            className="checkoutBtn1"
            onClick={() =>
              navigate("/rating", {
                state: {
                  estimateId: estimateId,
                  plannerImg: plannerImg,
                  plannerName: plannerName,
                  planneremail: planneremail,
                  price: price,
                },
              })
            }
          >
            이용후기 작성하기
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
              결제 완료
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
