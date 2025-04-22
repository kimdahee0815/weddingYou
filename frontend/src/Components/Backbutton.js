import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function BackButton({ engTitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [originalLocation, setOriginalLocation] = useState();
  const [searchedKeyword, setSearchedKeyWord] = useState();

  useEffect(() => {
    if (location.state !== null) {
      const { originalLocation } = location.state;
      setOriginalLocation(originalLocation);
      const { searchedKeyword } = location.state;
      setSearchedKeyWord(searchedKeyword);
    }
  }, []);

  return (
    <div className="backicon">
      <button
        class="backbutton"
        onClick={() => {
          console.log(path);
          if (
            path === "/mypage/user" ||
            path === "/mypage/planner" ||
            path === "/login"
          ) {
            navigate("/");
          } else if (path === "/passwordSearch") {
            navigate("/login");
          } else if (path === "/passwordSearch/temporaryPasswordLogin") {
            navigate("/passwordSearch");
          } else if (
            path === "/passwordSearch/temporaryPasswordLogin/passwordChange"
          ) {
            navigate("/passwordSearch/temporaryPasswordLogin");
          } else if (path === "/signup") {
            navigate("/login");
          } else if (path === "/signup/user" || path === "/signup/planner") {
            navigate("/login");
          } else if (path.indexOf("/user/userupdate") !== -1) {
            navigate("/mypage/user");
          } else if (path.indexOf("/planner/userupdate") !== -1) {
            navigate("/mypage/planner");
          } else if (path.indexOf("/likeList") !== -1) {
            if (originalLocation === "home") {
              navigate("/");
            } else if (originalLocation === "searchitems") {
              navigate("/searchItems", { state: { keyword: searchedKeyword } });
            }
          } else if (
            path.indexOf("/menu/weddinghall") !== -1 ||
            path.indexOf("/menu/studio") !== -1 ||
            path.indexOf("/menu/weddingoutfit") !== -1 ||
            path.indexOf("/menu/makeup") !== -1 ||
            path.indexOf("/menu/honeymoon") !== -1 ||
            path.indexOf("/menu/bouquet") !== -1
          ) {
            navigate("/menu");
          } else if (path.indexOf("/writepost/studio") !== -1) {
            navigate("/menu/studio");
          } else if (path.indexOf("/writepost/weddingoutfit") !== -1) {
            navigate("/menu/weddingoutfit");
          } else if (path.indexOf("/writepost/makeup") !== -1) {
            navigate("/menu/makeup");
          } else if (path.indexOf("/writepost/honeymoon") !== -1) {
            navigate("/menu/honeymoon");
          } else if (path.indexOf("/writepost/bouquet") !== -1) {
            navigate("/menu/bouquet");
          } else if (path.indexOf("/editpost") !== -1) {
            navigate(`/menu/${engTitle}`);
          } else if (path.indexOf("/estimatedetail") !== -1) {
            navigate(-1);
          } else if (path.indexOf("/plannerprofiledetail") !== -1) {
            navigate(-1);
          } else if (path.indexOf("/matching") !== -1) {
            const category = sessionStorage.getItem("category");
            navigate(`/mypage/${category}`);
          } else if (
            path.indexOf("/checkoutdeposit") !== -1 ||
            path.indexOf("/checkoutall") !== -1
          ) {
            navigate(`/matching`);
          } else if (path.indexOf("/estimatedetail/") !== -1) {
            navigate(-1);
          } else if (path.indexOf("/review/detail") !== -1) {
            navigate("/review");
          } else if (path.indexOf("/noticepage") !== -1) {
            navigate("/customercenter");
          } else if (path.indexOf("/qnapage") !== -1) {
            navigate("/customercenter");
          } else if (
            path.indexOf("/customercenter") !== -1 ||
            path.indexOf("/review") !== -1
          ) {
            navigate("/menu");
          } else {
            navigate(-1);
          }
        }}
      >
        <i class="bi bi-chevron-left"></i>
      </button>
    </div>
  );
}

export default BackButton;
