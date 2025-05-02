import "../Css/main.css";
import "../Css/Home.css";
import "../Css/LikeList.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultprofileimage from "../Assets/defaultprofileimage.jpg";
import Sidesection from "../Components/Sidesection";

function PlannerProfile() {
  const [wholeItems, setWholeItems] = useState([]);
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
    const encodedSort = encodeURIComponent(selectedSort);
    axios
      .get(`/plannerProfiles/${encodedSort}`)
      .then((res) => {
      //  console.log(res.data);
        let data = res.data;
        setWholeItems(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedSort]);

  useEffect(() => {
    if (sessionStorage.getItem("profileSort") === null) {
      window.sessionStorage.setItem("profileSort", "플래너 등록순");
      setSelectedSort("플래너 등록순");
    }
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
              {wholeItems.length === 0 ? (
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
                wholeItems.map((item, i) => (
                  <div class="col">
                    <div class="card margT">
                      <img
                        style={{ height: "230px", cursor: "pointer" }}
                        src={item.plannerProfileImg || defaultprofileimage}
                        class="card-img-top"
                        alt="..."
                        data-bs-plannerEmail={item.plannerEmail}
                        data-bs-plannerName={item.plannerName}
                        data-bs-plannerImg={item.plannerProfileImg}
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
                          {item.plannerName} &nbsp;&nbsp;
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
