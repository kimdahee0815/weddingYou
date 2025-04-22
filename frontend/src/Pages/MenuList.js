import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer";
import "../Css/menuList.css";
import Loadingimg1 from "../Assets/loading img1.jpg";
import Loadingimg2 from "../Assets/loading img2.jpg";
import Loadingimg3 from "../Assets/loading img3.jpg";
import Sidesection from "../Components/Sidesection";

const Category1 = [
  { label: "웨딩홀", value: "weddinghall" },
  { label: "의상", value: "weddingoutfit" },
  { label: "스튜디오", value: "studio" },
  { label: "메이크업", value: "makeup" },
  { label: "신혼여행", value: "honeymoon" },
  { label: "부케", value: "bouquet" },
];

const Service = [
  { label: "고객센터", value: "customercenter" },
  { label: "이용후기", value: "review" },
];

const MenuList = () => {
  const title = "메뉴";
  const [num, setNum] = useState(0);

  const images = [Loadingimg1, Loadingimg2, Loadingimg3];
  const [selectImg, setSelectImg] = useState();
  let [imgTop, setImgTop] = useState(120);
  let [imgOpacity, setImgOpacity] = useState(0);
  let [pTop, setPTop] = useState(60);
  let [pOpacity, setPOpacity] = useState(0);

  useEffect(() => {
    window.addEventListener("load", () => {
      setNum(Math.floor(Math.random() * 3));
    });
    function A(callback) {
      setTimeout(() => {
        setImgOpacity(1);
        callback();
      }, 500);
    }
    function B() {
      setTimeout(() => {
        setPOpacity(1);
      }, 200);
    }
    A(B);
    setSelectImg(images[num]);
  }, []);
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={title} />
        <div className="menu-list" style={{ marginTop: "100px" }}>
          {Category1.map((category1, index) => (
            <div key={index} className="menu-list-item-container">
              <h2 style={{ marginTop: "20px" }}>
                <Link
                  className="menu-list-item"
                  to={`/menu/${category1.value}`}
                  style={{ fontSize: "0.8em" }}
                >
                  {category1.label}
                </Link>
              </h2>
            </div>
          ))}
        </div>
        <hr style={{ width: "80%", marginLeft: "60px" }} />
        <div
          className="service-menu-list"
          style={{ width: "100%", margin: "0 auto" }}
        >
          {Service.map((service, index) => (
            <div key={index} className="menu-list-item-container">
              <h2 style={{ marginTop: "20px" }}>
                <Link
                  className="menu-list-item"
                  to={`/${service.value}`}
                  style={{ fontSize: "0.8em" }}
                >
                  {service.label}
                </Link>
              </h2>
            </div>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <img
            src={images[num]}
            alt=""
            style={{
              display: "block",
              width: "250px",
              height: "300px",
              marginBottom: "80px",
              transition: "all 1s",
              marginTop: "60px",
              marginLeft: "50px",
              top: imgTop,
              opacity: imgOpacity,
            }}
          />
          <div>
            <p
              style={{
                fontSize: "1.4em",
                zIndex: 1,
                marginTop: "100px",
                top: pTop,
                opacity: pOpacity,
                transition: "all 2s",
                fontFamily: "Nanum Myeongjo",
                color: "#fe5278",
              }}
            >
              &nbsp;&nbsp;&nbsp;BE THE REAL YOU <br />
            </p>
            <p
              style={{
                fontSize: "1.3em",
                zIndex: 1,
                top: pTop,
                opacity: pOpacity,
                transition: "all 2s",
                fontFamily: "Nanum Myeongjo",
                color: "#ff007f",
              }}
            >
              IT'S YOUR SPECIAL DAY! <br />
            </p>
            <p
              style={{
                fontSize: "1em",
                zIndex: 1,
                marginTop: "70px",
                top: pTop,
                opacity: pOpacity,
                transition: "all 2s",
                fontFamily: "Nanum Myeongjo",
                marginRight: "10px",
                color: "#061148",
              }}
            >
              We bring you the best wedding service
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; from all over the world...
            </p>
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
};

export default MenuList;
