import "../Css/footer.css";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();
  const path = location.pathname;
  const [footerborder, setFooterBorder] = useState(false);

  window.addEventListener("resize", (event) => {
    // 창크기 바뀌었을 때
    //console.log("clientheight :" + document.body.clientHeight);
    const footer = document.querySelector("#footer");
    if (path.indexOf(`signup/${category}`) === 1) {
      footer.classList.remove("footer");
      footer.classList.add("footer-border-remove");
    } else if (
      path.indexOf("login") === 1 ||
      path.indexOf(`password`) === 1 ||
      path === "/signup"
    ) {
      footer.classList.add("footer");
      footer.classList.remove("footer-border-remove");
      if (window.innerHeight !== document.body.clientHeight) {
        footer.classList.remove("footer");
        footer.classList.add("footer-border-remove");
      }
    } else {
      footer.classList.remove("footer");
      footer.classList.add("footer-border-remove");
    }
    // console.log(document.body.clientHeight);
    // console.log(window.scrollY + window.innerHeight);
    if (
      document.body.clientHeight - (window.scrollY + window.innerHeight) < 1 ||
      window.scrollY + window.innerHeight - document.body.clientHeight < 1
    ) {
      setFooterBorder(true);
    } else if (
      document.body.clientHeight >
      window.scrollY + window.innerHeight
    ) {
      setFooterBorder(false);
    }
  });

  useEffect(() => {
    // 처음 창을 열었을 때
    //   console.log("clientheight :" + document.body.clientHeight);
    const footer = document.querySelector("#footer");
    if (path.indexOf(`signup/${category}`) === 1) {
      footer.classList.remove("footer");
      footer.classList.add("footer-border-remove");
    } else if (
      path.indexOf("login") === 1 ||
      path.indexOf(`password`) === 1 ||
      path === "/signup"
    ) {
      footer.classList.add("footer");
      footer.classList.remove("footer-border-remove");
      if (window.innerHeight !== document.body.clientHeight) {
        footer.classList.remove("footer");
        footer.classList.add("footer-border-remove");
      }
    } else {
      footer.classList.remove("footer");
      footer.classList.add("footer-border-remove");
    }
  }, []);

  window.addEventListener("scroll", () => {
    // console.log(document.body.clientHeight);
    // console.log(window.scrollY + window.innerHeight);
    if (
      document.body.clientHeight - (window.scrollY + window.innerHeight) <
      1
    ) {
      setFooterBorder(true);
    } else if (
      document.body.clientHeight >
      window.scrollY + window.innerHeight
    ) {
      setFooterBorder(false);
    }
  });

  return (
    <div
      className={!footerborder ? "footer-border-remove" : "footer"}
      id="footer"
    >
      <div
        className="icon"
        onClick={() => {
          //전체 메뉴 바 보여주기
          navigate("/menu");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-collection"
          viewBox="0 0 16 16"
        >
          <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z" />
        </svg>
        <p>전체 메뉴</p>
      </div>
      <div
        className="icon"
        onClick={() => {
          navigate("/plannerprofile");
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-calendar-heart"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5ZM1 14V4h14v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Zm7-6.507c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z"
          />
        </svg>
        <p>플래너</p>
      </div>
      <div
        className="icon"
        onClick={() => {
          navigate("/");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-house-heart"
          viewBox="0 0 16 16"
        >
          <path d="M8 6.982C9.664 5.309 13.825 8.236 8 12 2.175 8.236 6.336 5.309 8 6.982Z" />
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.707L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.646a.5.5 0 0 0 .708-.707L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
        </svg>
        <p>홈</p>
      </div>
      <div
        className="icon"
        onClick={() => {
          navigate("/estimatelist");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-calendar2-check"
          viewBox="0 0 16 16"
        >
          <path d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
          <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z" />
        </svg>
        <p>견적</p>
      </div>
      <div
        className="icon"
        onClick={() => {
          if (sessionStorage.getItem("email") === "admin@email.com") {
            navigate(`/adminpage`);
            return;
          }
          if (sessionStorage.getItem("category") !== null) {
            const category = sessionStorage.getItem("category");
            navigate(`/mypage/${category}`);
          } else {
            navigate(`/login`);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-person"
          viewBox="0 0 16 16"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
        </svg>
        <p>마이페이지</p>
      </div>
    </div>
  );
}

export default Footer;
