import BackButton from "./Backbutton";
import "../Css/NavigationBar.css";
import MyEstimate from "./MyEstimate";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Css/items.css";

function NavigationBar({ title, goUpdate, category1, isAdmin, engTitle }) {
  const url = useLocation();
  const path = url.pathname;

  const [navigationBorder, setNavigationBorder] = useState(false);
  console.log(window.scrollY);
  window.addEventListener("scroll", () => {
    if (0 <= window.scrollY && window.scrollY < 1) {
      setNavigationBorder(true);
    } else {
      setNavigationBorder(false);
    }
  });

  const navigate = useNavigate();
  return (
    <div>
      {navigationBorder === true ? (
        <div
          className="navigationbar"
          style={{
            position: "fixed",
            backgroundColor: "white",
            borderTop: "1px solid rgb(173, 166, 166)",
            width: "556px",
            borderRadius: "10px 10px 0  0",
            boxSizing: "border-box",
            top: 0,
            paddingTop: "10px",
          }}
        >
          {console.log(engTitle)}
          <BackButton engTitle={engTitle} />
          <p style={{ fontSize: "1.8em", marginTop: "10px" }}>{title} </p>
          {path.indexOf("likeList") === 1 ? (
            <button
              className="btn btn-primary"
              style={{
                height: "40px",
                marginTop: "10px",
                marginRight: "-40px",
                marginLeft: "-30px",
              }}
              onClick={(e) => {
                goUpdate();
              }}
            >
              update
            </button>
          ) : null}
          {path.indexOf("mypage") === 1 && path.indexOf("userupdate") === -1 ? (
            <MyEstimate />
          ) : (
            <div className="empty"></div>
          )}
          {(path.indexOf("menu/weddinghall") === 1 ||
            path.indexOf("menu/studio") === 1 ||
            path.indexOf("menu/weddingoutfit") === 1 ||
            path.indexOf("menu/makeup") === 1 ||
            path.indexOf("menu/honeymoon") === 1 ||
            path.indexOf("menu/bouquet") === 1) &&
          isAdmin === true ? (
            <button
              className="submit-button"
              onClick={() => {
                window.location.href = `/writepost/${category1}`;
              }}
              style={{
                fontSize: "1.3em",
                marginLeft: "-100px",
                marginBottom: "-3px",
                marginTop: "2px",
                height: "45px",
                marginRight: "-3px",
              }}
            >
              글쓰기
            </button>
          ) : null}
        </div>
      ) : (
        <div
          className="navigationbar"
          style={{
            position: "fixed",
            backgroundColor: "white",
            width: "556px",
            boxSizing: "border-box",
            top: 0,
            paddingTop: "10px",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <BackButton engTitle={engTitle} />
          <p style={{ fontSize: "1.8em" }}>{title} </p>
          {path.indexOf("likeList") === 1 ? (
            <button
              className="btn btn-primary"
              style={{
                height: "40px",
                marginTop: "10px",
                marginRight: "-40px",
                marginLeft: "-30px",
              }}
              onClick={(e) => {
                goUpdate();
              }}
            >
              update
            </button>
          ) : null}
          {path.indexOf("mypage") === 1 && path.indexOf("userupdate") === -1 ? (
            <MyEstimate />
          ) : (
            <div className="empty"></div>
          )}
          {(path.indexOf("menu/weddinghall") === 1 ||
            path.indexOf("menu/studio") === 1 ||
            path.indexOf("menu/weddingoutfit") === 1 ||
            path.indexOf("menu/makeup") === 1 ||
            path.indexOf("menu/honeymoon") === 1 ||
            path.indexOf("menu/bouquet") === 1) &&
          isAdmin === true ? (
            <button
              className="submit-button"
              onClick={() => {
                window.location.href = `/writepost/${category1}`;
              }}
              style={{
                fontSize: "1.3em",
                marginLeft: "-100px",
                marginBottom: "-3px",
                marginTop: "2px",
                height: "45px",
                marginRight: "-3px",
              }}
            >
              글쓰기
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default NavigationBar;
