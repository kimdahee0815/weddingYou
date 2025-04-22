import animationData from "../Animation/wedding.json";
import animationData2 from "../Animation/love-hearts.json";
import animationData3 from "../Animation/ornament-animation.json";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import lottie from "lottie-web";

const Animation = (props) => {
  let [pTop, setPTop] = useState(60);
  let [pOpacity, setPOpacity] = useState(0);
  const url = useLocation();
  const path = url.pathname;

  useEffect(() => {
    setTimeout(() => {
      setPTop(150);
      setPOpacity(1);
    }, 800);
  }, []);
  const container = useRef();
  const container1 = useRef();
  const container2 = useRef();
  const container3 = useRef();
  useEffect(() => {
    lottie.loadAnimation({
      container: container3.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData3,
    });
    lottie.loadAnimation({
      container: container2.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData2,
    });
    lottie.loadAnimation({
      container: container1.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
    });
  }, []);
  return (
    <div>
      {path.indexOf("likeList") === 1 ? (
        <div style={{ marginTop: "170px", height: "700px" }}>
          <div
            id="container"
            ref={container}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.5em",
                zIndex: 1,
                marginTop: "20px",
                top: pTop,
                opacity: pOpacity,
                transition: "all 1s",
                fontFamily: "Nanum Myeongjo",
              }}
            >
              WEDDING YOU
            </p>
            <div
              id="container3"
              ref={container3}
              style={{
                width: "100%",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "-180px",
                marginBottom: "-20px",
              }}
            ></div>
            <div
              id="container2"
              ref={container2}
              style={{
                width: "100%",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                marginTop: "-40px",
              }}
            ></div>
            <div
              id="container1"
              ref={container1}
              style={{
                width: "100%",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: "60px",
                paddingRight: "20px",
                marginTop: "-20px",
              }}
            ></div>
            <p
              style={{
                fontSize: "1.5em",
                zIndex: 1,
                marginTop: "20px",
                top: pTop,
                opacity: pOpacity,
                transition: "all 1s",
                fontFamily: "Nanum Myeongjo",
              }}
            >
              PLEASE WAIT...
            </p>
          </div>
        </div>
      ) : path.indexOf("mypage") === 1 ? (
        <div style={{ marginTop: "100px", height: "900px" }}>
          <div
            id="container"
            ref={container}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.5em",
                zIndex: 1,
                marginTop: "20px",
                top: pTop,
                opacity: pOpacity,
                transition: "all 1s",
                fontFamily: "Nanum Myeongjo",
              }}
            >
              WEDDING YOU
            </p>
            <div
              id="container3"
              ref={container3}
              style={{
                width: "100%",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "-180px",
                marginBottom: "-20px",
              }}
            ></div>
            <div
              id="container2"
              ref={container2}
              style={{
                width: "100%",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                marginTop: "-40px",
              }}
            ></div>
            <div
              id="container1"
              ref={container1}
              style={{
                width: "100%",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: "60px",
                paddingRight: "20px",
                marginTop: "-20px",
              }}
            ></div>
            <p
              style={{
                fontSize: "1.5em",
                zIndex: 1,
                marginTop: "20px",
                top: pTop,
                opacity: pOpacity,
                transition: "all 1s",
                fontFamily: "Nanum Myeongjo",
              }}
            >
              PLEASE WAIT...
            </p>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "50px", height: "900px" }}>
          <div
            id="container"
            ref={container}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.5em",
                zIndex: 1,
                marginTop: "20px",
                top: pTop,
                opacity: pOpacity,
                transition: "all 1s",
                fontFamily: "Nanum Myeongjo",
              }}
            >
              WEDDING YOU
            </p>
            <div
              id="container3"
              ref={container3}
              style={{
                width: "100%",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "-180px",
                marginBottom: "-20px",
              }}
            ></div>
            <div
              id="container2"
              ref={container2}
              style={{
                width: "100%",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                marginTop: "-40px",
              }}
            ></div>
            <div
              id="container1"
              ref={container1}
              style={{
                width: "100%",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: "60px",
                paddingRight: "20px",
                marginTop: "-20px",
              }}
            ></div>
            <p
              style={{
                fontSize: "1.5em",
                zIndex: 1,
                marginTop: "20px",
                top: pTop,
                opacity: pOpacity,
                transition: "all 1s",
                fontFamily: "Nanum Myeongjo",
              }}
            >
              PLEASE WAIT...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Animation;
