import "../Css/main.css";
import "../Css/Home.css";
import "../Css/LikeList.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Animation from "../Components/Animation";
import axios from "axios";
import defaultprofileimage from "../Assets/defaultprofileimage.jpg";
import Sidesection from "../Components/Sidesection";

function PlannerProfile() {
  const [profileImg, setProfileImg] = useState([]);
  const [plannerName, setPlannerName] = useState([]);
  const [plannerEmail, setPlannerEmail] = useState([]);
  const [plannerYears, setPlannerYears] = useState(0); //경력순
  const [reviewCount, setReviewCount] = useState(0); //후기순
  const [matchingCount, setMatchingCount] = useState(0); //매칭순
  const [reviewStars, setReviewStars] = useState(0); //별점 높은 순
  const [keyIndex, setKeyIndex] = useState([]);
  // const [selectedPlannerEmail, setSelectedPlannerEmail] = useState("");
  const [plannerEmailSort, setPlannerEmailSort] = useState([]);

  const [sortClick, setSortClick] = useState(false);

  const [selectedSort, setSelectedSort] = useState(
    window.sessionStorage.getItem("profileSort")
  ); // 초기 버튼명 설정
  const navigate = useNavigate();

  const handleSortClick = (sort) => {
    setSelectedSort(sort); // 선택한 정렬로 버튼명 변경
    sessionStorage.setItem("profileSort", sort);
  };

  const goProfileDetail = (e) => {
    const selectedPlannerEmail = e.target.dataset.bsPlanneremail;
    const selectedPlannerImg = e.target.dataset.bsPlannerimg;
    const selectedPlannerName = e.target.dataset.bsPlannername;
    navigate(`/plannerprofiledetail`, {
      state: {
        plannerEmail: selectedPlannerEmail,
        plannerName: selectedPlannerName,
        plannerImg: selectedPlannerImg,
      },
    });
  };

  useEffect(() => {
    axios
      .post(`/plannerProfile/getProfiles1`)
      .then((res) => {
        console.log(res);
        let data = res.data;

        let plannerEmailArr = [];
        if (selectedSort === "별점 높은 순") {
          data.sort(function (a, b) {
            if (parseFloat(a.avgReviewStars) < parseFloat(b.avgReviewStars))
              return 1;
            if (parseFloat(a.avgReviewStars) > parseFloat(b.avgReviewStars))
              return -1;
            if (parseFloat(a.avgReviewStars) === parseFloat(b.avgReviewStars)) {
              return new Date(b.plannerJoinDate) - new Date(a.plannerJoinDate);
            }
          });
          for (let i = 0; i < data.length; i++) {
            plannerEmailArr.push(data[i].plannerEmail);
          }
          setPlannerEmailSort(plannerEmailArr);
        } else if (selectedSort === "후기순") {
          data.sort(function (a, b) {
            if (a.reviewCount < b.reviewCount) return 1;
            if (a.reviewCount > b.reviewCount) return -1;
            if (a.reviewCount === b.reviewCount) {
              return new Date(b.plannerJoinDate) - new Date(a.plannerJoinDate);
            }
          });
          for (let i = 0; i < data.length; i++) {
            plannerEmailArr.push(data[i].plannerEmail);
          }
          setPlannerEmailSort(plannerEmailArr);
        } else if (selectedSort === "경력순") {
          data.sort(function (a, b) {
            if (parseInt(a.plannerCareerYears) < parseInt(b.plannerCareerYears))
              return 1;
            if (parseInt(a.plannerCareerYears) > parseInt(b.plannerCareerYears))
              return -1;
            if (
              parseInt(a.plannerCareerYears) === parseInt(b.plannerCareerYears)
            ) {
              return new Date(b.plannerJoinDate) - new Date(a.plannerJoinDate);
            }
          });
          for (let i = 0; i < data.length; i++) {
            plannerEmailArr.push(data[i].plannerEmail);
          }
          setPlannerEmailSort(plannerEmailArr);
        } else if (selectedSort === "매칭순") {
          data.sort(function (a, b) {
            if (a.matchingCount < b.matchingCount) return 1;
            if (a.matchingCount > b.matchingCount) return -1;
            if (a.matchingCount === b.matchingCount) {
              return new Date(b.plannerJoinDate) - new Date(a.plannerJoinDate);
            }
          });
          for (let i = 0; i < data.length; i++) {
            plannerEmailArr.push(data[i].plannerEmail);
          }
          setPlannerEmailSort(plannerEmailArr);
        } else if (selectedSort === "최신순") {
          data.sort(function (a, b) {
            return new Date(b.plannerJoinDate) - new Date(a.plannerJoinDate);
          });
          for (let i = 0; i < data.length; i++) {
            plannerEmailArr.push(data[i].plannerEmail);
          }
          setPlannerEmailSort(plannerEmailArr);
        } else if (selectedSort === "플래너 등록순") {
          data.sort(function (a, b) {
            return new Date(a.plannerJoinDate) - new Date(b.plannerJoinDate);
          });
          for (let i = 0; i < data.length; i++) {
            plannerEmailArr.push(data[i].plannerEmail);
          }
          setPlannerEmailSort(plannerEmailArr);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedSort]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("plannerEmailArr", JSON.stringify(plannerEmailSort));
    axios
      .post(`/plannerProfile/getProfiles3`, formData)
      .then((res) => {
        console.log(res);
        const data = res.data;
        if (data.length !== 0) {
          let profileImgArr = [];
          let plannerNameArr = [];
          let plannerEmailArr = [];
          let keyIndexArr = [];
          for (let j = 0; j < data.length; j++) {
            if (j % 3 === 0) {
              if (data[j] === "null") {
                profileImgArr.push(defaultprofileimage);
              } else {
                let img = "data:image/jpeg;base64," + data[j];
                profileImgArr.push(img);
              }

              const index = j / 3;
              keyIndexArr.push(index);
              console.log(keyIndexArr);
            } else if (j % 3 === 1) {
              plannerNameArr.push(data[j]);
            } else if (j % 3 === 2) {
              plannerEmailArr.push(data[j]);
            }
          }
          setKeyIndex(keyIndexArr);
          setProfileImg(profileImgArr);
          setPlannerName(plannerNameArr);
          setPlannerEmail(plannerEmailArr);
        } else {
          setKeyIndex([]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [plannerEmailSort]);
  useEffect(() => {
    if (sessionStorage.getItem("profileSort") === null) {
      window.sessionStorage.setItem("profileSort", "플래너 등록순");
      setSelectedSort("플래너 등록순");
    }

    axios
      .post(`/plannerProfile/getProfiles1`)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .post(`/plannerProfile/getProfiles2`)
      .then((res) => {
        console.log(res);
        const data = res.data;
        if (data.length !== 0) {
          let profileImgArr = [];
          let plannerNameArr = [];
          let plannerEmailArr = [];
          let keyIndexArr = [];
          for (let i = 0; i < data.length; i++) {
            if (i % 3 === 0) {
              if (data[i] === "null") {
                profileImgArr.push(defaultprofileimage);
              } else {
                let img = "data:image/jpeg;base64," + data[i];
                profileImgArr.push(img);
              }

              const index = i / 3;
              keyIndexArr.push(index);
              console.log(keyIndexArr);
            } else if (i % 3 === 1) {
              plannerNameArr.push(data[i]);
            } else if (i % 3 === 2) {
              plannerEmailArr.push(data[i]);
            }
          }
          setKeyIndex(keyIndexArr);
          setProfileImg(profileImgArr);
          setPlannerName(plannerNameArr);
          setPlannerEmail(plannerEmailArr);
        } else {
          setKeyIndex([]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [selectedSort, sortClick]);
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={"플래너 프로필"} />
        <br />
        <div
          style={{ display: "flex", justifyContent: "end", marginTop: "50px" }}
        >
          <div
            style={{
              position: "fixed",
              top: 0,
              zIndex: 99,
              width: "556px",
              display: "block",
              background: "white",
            }}
          >
            <div
              className="filter"
              style={{
                position: "fixed",
                top: 64,
                zIndex: 99,
                width: "556px",
                display: "block",
                background: "white",
                paddingTop: "5px",
                height: "80px",
              }}
            >
              <div class="dropdown  right-sort" style={{ marginRight: "70px" }}>
                <button
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedSort}
                </button>
                <ul class="dropdown-menu sortItem">
                  <li className="">
                    <button
                      class="dropdown-item "
                      type="button"
                      onClick={() => {
                        setSortClick(!sortClick);
                        handleSortClick("별점 높은 순");
                      }}
                    >
                      별점 높은 순
                    </button>
                  </li>
                  <li>
                    <button
                      class="dropdown-item"
                      type="button"
                      onClick={() => {
                        setSortClick(!sortClick);
                        handleSortClick("후기순");
                      }}
                    >
                      후기순
                    </button>
                  </li>
                  <li>
                    <button
                      class="dropdown-item"
                      type="button"
                      onClick={() => {
                        setSortClick(!sortClick);
                        handleSortClick("경력순");
                      }}
                    >
                      경력순
                    </button>
                  </li>
                  <li>
                    <button
                      class="dropdown-item"
                      type="button"
                      onClick={() => {
                        setSortClick(!sortClick);
                        handleSortClick("매칭순");
                      }}
                    >
                      매칭순
                    </button>
                  </li>
                  <li>
                    <button
                      class="dropdown-item"
                      type="button"
                      onClick={() => {
                        setSortClick(!sortClick);
                        handleSortClick("최신순");
                      }}
                    >
                      최신순
                    </button>
                  </li>
                  <li className="">
                    <button
                      class="dropdown-item "
                      type="button"
                      onClick={() => {
                        setSortClick(!sortClick);
                        handleSortClick("플래너 등록순");
                      }}
                    >
                      플래너 등록순
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="container text-center" style={{ marginTop: "60px" }}>
          <div
            style={{
              marginRight: "8px",
            }}
          ></div>
          <div class="container text-center">
            <div class="row row-cols-2">
              {/* 이미지카드 */}
              {keyIndex.length === 0 ? (
                <div
                  class="text-start"
                  style={{
                    marginLeft: "10px",
                    fontSize: "1.5em",
                    marginTop: "40px",
                  }}
                >
                  결과가 없습니다.
                </div>
              ) : (
                keyIndex.map((i) => (
                  <div class="col">
                    <div class="card margT">
                      <img
                        style={{ height: "230px", cursor: "pointer" }}
                        src={profileImg[i]}
                        class="card-img-top"
                        alt="..."
                        data-bs-plannerEmail={plannerEmail[i]}
                        data-bs-plannerName={plannerName[i]}
                        data-bs-plannerImg={profileImg[i]}
                        onClick={goProfileDetail}
                      />
                      <div class="card-body">
                        <p
                          class="card-text ms-4"
                          style={{
                            fontSize: "1.5em",
                            margin: "0 auto",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {plannerName[i]} &nbsp;&nbsp;
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* 이미지카드 */}
            </div>
            <br />
            <div style={{ marginBottom: "100px" }}></div>
          </div>
          {/* <div class="row" style={{ marginTop: "20px" }}>
          <div class="col">
            <img
              // src={Loadingimg1}
              alt=""
              style={{
                width: "200px",
                height: "300px",
                marginLeft: "30px",
                cursor: "pointer",
              }}
              onClick={goProfileDetail}
            />
            <div style={{ fontSize: "1.8em", marginLeft: "30px" }}>
              planner1
            </div>
          </div>
          <div class="col" style={{ fontSize: "1.8em", marginLeft: "30px" }}>
            <img
              // src={Loadingimg1}
              alt=""
              style={{
                width: "200px",
                height: "300px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
            <div>planner2</div>
          </div>
        </div> */}
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

export default PlannerProfile;
