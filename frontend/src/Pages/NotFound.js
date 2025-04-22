import Footer from "../Components/Footer";
import Loadingimg1 from "../Assets/loading img1.jpg";
import Loadingimg2 from "../Assets/loading img2.jpg";
import Loadingimg3 from "../Assets/loading img3.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BackButton from "../Components/Backbutton";
import "../Css/Signup.css";
import "../Css/NotFound.css";
import Sidesection from "../Components/Sidesection";

function NotFound() {
  const [num, setNum] = useState(0);

  const images = [Loadingimg1, Loadingimg2, Loadingimg3];
  const location = useLocation();
  const { state: passwordCheck } = useLocation();
  // console.log(passwordCheck);
  const path = location.pathname;
  const [selectImg, setSelectImg] = useState();
  const navigate = useNavigate();
  let [top, setTop] = useState(80);
  let [opacity, setOpacity] = useState(0);
  let [imgTop, setImgTop] = useState(120);
  let [imgOpacity, setImgOpacity] = useState(0);
  let [pTop, setPTop] = useState(60);
  let [pOpacity, setPOpacity] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setTop(50);
      setOpacity(1);
    }, 200);
    setTimeout(() => {
      setPTop(150);
      setPOpacity(1);
    }, 500);
    setTimeout(() => {
      setImgTop(170);
      setImgOpacity(1);
    }, 500);
    setNum(Math.floor(Math.random() * 3));
    setSelectImg(images[num]);
  }, []);
  return (
    <div className="containerbox">
      <div
        className="mainlayout box1"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            marginLeft: "10px",
          }}
        >
          <BackButton />
        </div>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            display: "flex",
            margin: "0 auto",
            minHeight: "100vh",
            height: "900px",
            width: "100%",
            zIndex: 1,
            // minHeight: "100vh",
          }}
        >
          <p
            style={{
              fontSize: "1.5em",
              zIndex: 1,
              marginTop: "-40px",
              top: pTop,
              opacity: pOpacity,
              transition: "all 1s",
              fontFamily: "Nanum Myeongjo",
            }}
          >
            WEDDING YOU
          </p>
          <img
            src={images[num]}
            alt=""
            style={{
              display: "block",
              width: "300px",
              height: "400px",
              marginBottom: "80px",
              transition: "all 1s",
              marginTop: "-10px",
              top: imgTop,
              opacity: imgOpacity,
            }}
          />
          <div
            style={{
              width: "100%",
              height: "100px",
              marginTop: "-60px",
              marginBottom: "0px",
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <p
              style={{ opacity: opacity, position: "absolute", bottom: top }}
              className="accessdenied"
            >
              Access Denied!😢
            </p>
          </div>

          <div>
            <button
              type="button"
              className="btn-colour-1 "
              onClick={() => {
                console.log(passwordCheck);
                if (path.indexOf("mypageabc") !== -1) {
                  navigate(`/mypage/${sessionStorage.getItem("category")}`);
                } else if (
                  path.indexOf("mypageupdate") !== -1 &&
                  passwordCheck === true
                ) {
                  navigate(
                    `/mypage/${sessionStorage.getItem("category")}/userupdate`,
                    { state: true }
                  );
                } else if (
                  path.indexOf("mypageupdate") !== -1 &&
                  passwordCheck !== true
                ) {
                  navigate(`/mypage/${sessionStorage.getItem("category")}`, {
                    state: true,
                  });
                } else {
                  navigate("/");
                }
              }}
            >
              돌아가기
            </button>
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

export default NotFound;
