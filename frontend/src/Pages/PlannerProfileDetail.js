import "../Css/main.css";
import "../Css/Home.css";
import "../Css/LikeList.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidesection from "../Components/Sidesection";
import defaultprofileimage from "../Assets/defaultprofileimage.jpg";

function PlannerProfileDetail() {
  const [profileDetail, setProfileDetail] = useState({});

  const { plannerEmail, plannerName, plannerImg } = useLocation().state;

  const [estimates, setEstimates] = useState(null);
  const [currentEstimate, setCurrentEstimate] = useState(null);
  const [sendRequestPlanner, setSendRequestPlanner] = useState(false);

  const navigate = useNavigate();
  const goMatch = () => {
    navigate(`/estimateform`);
  };

  const getCurrentEstimate = (selectedEstimateIndex) => {
    setCurrentEstimate(estimates[selectedEstimateIndex]);
  };

  useEffect(() => {
    let formData = new FormData();
    formData.append("plannerEmail", plannerEmail);
    axios
      .post(`/plannerProfile/detail`, formData)
      .then(async (res) => {
        const data = res.data;
        setProfileDetail(data);

        formData = new FormData();
        formData.append("userEmail", sessionStorage.getItem("email"));

        const { data:estimates} = await axios
          .post(`/plannerProfile/unmatched-estimates`, formData)
        setEstimates(estimates);

        if(estimates.length !== 0){
          setCurrentEstimate(estimates[0]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [plannerEmail, sendRequestPlanner]);

  const goChooseEstimate = (e) => {
    const estimateId = currentEstimate.id;
    const userMatching = JSON.parse(currentEstimate.userMatching);

    if (userMatching === null) {
      let userEmail = [plannerEmail];
      let formData = new FormData();
      formData.append("estimateId", estimateId);
      formData.append("usermatching", JSON.stringify(userEmail));
      axios
        .post(`/plannerProfile/matching/users`, formData)
        .then((res) => {
          alert("매칭 신청되었습니다!");
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.message === "중복됩니다!") {
            alert("이미 매칭 신청한 플래너입니다!");
          }
        });
    } else {
      const addPlannerEmail = plannerEmail;
      if (!userMatching.includes(addPlannerEmail)) {
        let formData = new FormData();
        formData.append("estimateId", estimateId);
        formData.append(
          "usermatching",
          JSON.stringify([...userMatching, addPlannerEmail])
        );
        axios
          .post(`/plannerProfile/matching/users`, formData)
          .then((res) => {
            alert("매칭 신청되었습니다!");
          })
          .catch((e) => {
            console.log(e);
            if (e.response.data.message === "중복됩니다!") {
              alert("이미 매칭 신청한 플래너입니다!");
            }
          });
      } else {
        alert("이미 매칭 신청한 플래너입니다!");
      }
    }
    setSendRequestPlanner(prev => !prev)
  };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={`${profileDetail.plannerName}의 프로필`} />
        <br />
        <div
          class="container text-center"
          style={{
            marginTop: "100px",
            minHeight: "100vh",
            marginBottom: "100px",
          }}
        >
          <div
            style={{
              marginRight: "8px",
            }}
          ></div>
          <div style={{ marginTop: "20px", display: "flex", width: "100%" }}>
            <img
              src={profileDetail.plannerProfileImg || defaultprofileimage}
              alt=""
              style={{
                width: "280px",
                height: "280px",
                marginLeft: "20px",
              }}
            />
            <div
              style={{
                display: "flex",
                width: "200px",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "1.8em",
                  marginLeft: "45px",
                  display: "inline-block",
                  width: "130px",
                  height: "60px",
                  marginTop: "20px",
                }}
              >
                {profileDetail.plannerName}
              </div>
              <div
                style={{
                  fontSize: "1.6em",
                  marginLeft: "-15px",
                  display: "inline-block",
                  width: "250px",
                  height: "60px",
                }}
              >
                리뷰 개수 : {profileDetail.reviews?.length} <br />
                평균 별점 : {'abc'} <br />
                경력 : {profileDetail.career} <br />
                휴대폰번호 <br /> {profileDetail.phoneNum}
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                width: "100px",
                fontSize: "1.8em",
                justifyContent: "start",
                marginLeft: "20px",
                marginTop: "13px",
              }}
            >
              자기소개
            </div>
            <textarea
              style={{
                marginTop: "20px",
                borderRadius: "10px",
                fontSize: "1.4em",
                backgroundColor: "#ebecf0",
                paddingTop: "20px",
                paddingLeft: "25px",
                paddingBottom: "20px",
                paddingRight: "20px",
              }}
              name=""
              id=""
              cols="41"
              rows="8"
              placeholder="아직 자기소개가 없습니다!"
              value={profileDetail.introduction || "아직 자기소개가 없습니다!"}
              disabled
            ></textarea>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                width: "120px",
                fontSize: "1.8em",
                justifyContent: "start",
                marginLeft: "20px",
                marginTop: "20px",
                marginBottom: "-10px",
                overflowY: "scroll",
              }}
            >
              포트폴리오
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                fontSize: "1.4em",
                marginRight: "30px",
              }}
            >
              총 매칭수 : {profileDetail.matchingCount}
            </div>

            {profileDetail.reviews?.length === 0 ? (
              <div
                style={{
                  marginTop: "20px",
                  borderRadius: "10px",
                  fontSize: "1.4em",
                  border: "1px solid grey",
                  height: "180px",
                  width: "500px",
                  margin: "0 auto",
                  backgroundColor: "#ebecf0",
                  paddingTop: "20px",
                  paddingLeft: "20px",
                  paddingBottom: "20px",
                  paddingRight: "20px",
                  overflowY: "scroll",
                }}
              >
                <div style={{ fontSize: "1.1em" }}>
                  <div
                    style={{
                      fontSize: "0.9em",
                      display: "flex",
                      justifyContent: "start",
                    }}
                  >
                    아직 포트폴리오가 없습니다!
                  </div>
                </div>
              </div>
            ) : (
              profileDetail.reviews?.map((review, index) => {
                return (
                  <div
                    style={{
                      marginTop: "20px",
                      borderRadius: "10px",
                      fontSize: "1.4em",
                      border: "1px solid grey",
                      height: "130px",
                      width: "500px",
                      margin: "0 auto",
                      backgroundColor: "#ebecf0",
                      paddingTop: "20px",
                      paddingLeft: "20px",
                      paddingBottom: "20px",
                      paddingRight: "20px",
                      overflowY: "scroll",
                      marginBottom: "5px",
                    }}
                  >
                    <div style={{ fontSize: "1.1em" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            height: "50px",
                            paddingTop: "10px",
                          }}
                        >
                          {index + 1}.{`${review.user.name} - ${review.reviewStars}점\n`}
                          <br />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            height: "50px",
                            fontSize: "0.9em",
                          }}
                        >
                          : {review.reviewText}
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {sessionStorage.getItem("category") === "user" ? (
            estimates?.length !== 0 ? (
              <button
                class="btn-colour-1 "
                data-bs-toggle="modal"
                data-bs-target="#chooseEstimate"
                style={{ marginTop: "50px" }}
              >
                견적요청
              </button>
            ) : (
              <button
                class="btn-colour-1 "
                onClick={goMatch}
                style={{ marginTop: "50px" }}
              >
                견적요청
              </button>
            )
          ) : null}
        </div>
        <Footer />
        {/* 견적서 선택 모달창 */}
        <div
          class="modal fade"
          id="chooseEstimate"
          tabindex="-1"
          aria-labelledby="chooseEstimate"
          aria-hidden="true"
        >
          <div
            class="modal-dialog modal-dialog-centered"
            style={{ width: "800px" }}
          >
            <div class="modal-content">
              <div class="modal-header">
                <h1
                  class="modal-title justify-content-center "
                  id="chooseEstimate"
                  style={{ fontSize: "1.9em" }}
                >
                  견적서 선택하기
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div
                class="modal-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alginItems: "center",
                  displayContent: "center",
                  height: "100%",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "480px",
                  }}
                >
                  <select
                    class="form-select form-select-lg mb-3"
                    aria-label=".form-select-lg example"
                    style={{ width: "460px" }}
                    onChange={(e) => {
                      getCurrentEstimate(e.target.value);
                    }}
                  >
                    {estimates?.map((estimate, index) => {
                      return <option value={index}>견적서{index + 1}</option>;
                    })}
                  </select>

                  <div
                    style={{
                      fontSize: "1.5em",
                      padding: "10px",
                    }}
                  >
                    견적서 상세정보
                  </div>
                  <p
                    style={{
                      fontSize: "1.3em",
                      width: "550px",
                      marginLeft: "-35px",
                      marginTop: "-100px",
                    }}
                  >
                    {currentEstimate ? (
                        <div className="contentcontainer-detail">
                          <div className="contentbox-detail">
                            <h5>희망 결혼 예정일</h5>
                            {JSON.parse(currentEstimate?.weddingdate).map(
                              (date, index) => {
                              return (
                                <div className="choosebox-detail">
                                  {date === "" ? (
                                    <></>
                                  ) : (
                                    <>
                                      <div>{index + 1}순위</div>
                                      <div className="result-detail">{date}</div>
                                    </>
                                  )}
                                </div>
                              );
                            }
                          )}
                          </div>
                          <div className="contentbox-detail">
                            <h5>희망 결혼 지역</h5>
                              {JSON.parse(currentEstimate?.region).map((region, index) => {
                                return (
                              <div className="choosebox-detail">
                                {region === "" ? (
                                  <></>
                                ) : (
                                  <>
                                    <div>{index + 1}순위</div>
                                    <div className="result-detail">{region}</div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                          </div>
                          <div className="contentbox-detail">
                            <h5>예산 한도</h5>
                            <div
                              className="choosebox-detail"
                              style={{ width: "150px" }}
                            >
                              <div className="result-detail">
                                {currentEstimate?.budget.toLocaleString()}원
                              </div>
                            </div>
                          </div>
                          <div className="contentbox-detail">
                            <h5>희망 스튜디오 스타일</h5>
                            <div className="choosebox-detail">
                              <div className="result-detail">
                                {currentEstimate?.studio}
                              </div>
                            </div>
                          </div>
                          <div className="contentbox-detail">
                            <h5>신부 드레스 스타일</h5>
                            {JSON.parse(currentEstimate?.dress).length === 0 && (
                              <div className="choosebox-detail">
                                <div className="result-noneChoose">
                                  *선택사항 없음*
                                </div>
                              </div>
                            )}
                            {JSON.parse(currentEstimate?.dress).map((dress, index) => {
                              return (
                                <div className="choosebox-detail">
                                  {dress === "" ? (
                                    <></>
                                  ) : (
                                    <>
                                      <div>{index + 1}순위</div>
                                      <div className="result-detail">{dress}</div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="contentbox-detail">
                            <h5>신부 메이크업 스타일</h5>
                            {JSON.parse(currentEstimate?.makeup).length === 0 && (
                              <div className="choosebox-detail">
                                <div className="result-noneChoose">
                                  *선택사항 없음*
                                </div>
                              </div>
                            )}
                            {JSON.parse(currentEstimate?.makeup).map((makeup, index) => {
                              return (
                              <div className="choosebox-detail">
                                {makeup === "" ? (
                                  <></>
                                ) : (
                                  <>
                                    <div>{index + 1}순위</div>
                                    <div className="result-detail">{makeup}</div>
                                  </>
                                )}
                              </div>
                            );
                            })}
                          </div>
                          <div className="contentbox-detail">
                            <h5>희망 신혼여행지</h5>
                            <div className="choosebox-detail">
                              {currentEstimate?.honeymoon === "" && (
                                <div className="result-noneChoose">
                                  *선택사항 없음*
                                </div>
                              )}
                              {currentEstimate?.honeymoon !== "" && (
                                <div className="result-detail">
                                  {currentEstimate?.honeymoon.slice(3)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="contentbox-detail">
                            {JSON.parse(currentEstimate?.img).length === 0 ? (
                              <h5>고객 첨부이미지 </h5>
                            ) : (
                              <h5 style={{ marginTop: "-20px" }}>
                                고객 첨부이미지{" "}
                              </h5>
                            )}

                            {JSON.parse(currentEstimate?.img).length === 0 && (
                              <span>첨부 이미지가 없습니다.</span>
                            )}
                            <br></br>
                            <div>
                              {JSON.parse(currentEstimate?.img).map((img, index) => {
                                return (
                                <div key={index}>
                                  <>
                                    <img
                                      src={img}
                                      width="100%"
                                      height="40%"
                                      style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                        marginBottom: "20px",
                                        marginTop: "-15px",
                                        marginLeft: "-5px",
                                      }}
                                      alt=""
                                    />
                                  </>
                                </div>
                              );
                            })}
                            </div>
                          </div>

                          <div
                            className="contentbox-detail"
                            style={{ borderBottom: "none", marginTop: "10px" }}
                          >
                            <h5>고객 요청사항</h5>
                            <div
                              className="choosebox-detail w-100"
                              style={{ color: "black" }}
                            >
                              {currentEstimate?.requirement === "" && (
                                <span>고객요청사항이 없습니다.</span>
                              )}
                              {currentEstimate?.requirement}
                            </div>
                          </div>
                        </div>
                    ) : null}
                  </p>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={goChooseEstimate}
                >
                  선택
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
        {/*견적서 선택  모달창  */}
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}
const ImagesView = ({ images, index }) => {
  return (
    <div
      class="modal fade"
      id={index}
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" style={{ maxWidth: "800px" }}>
        <div className="image-actualsize">
          <img src={images} />
        </div>
      </div>
    </div>
  );
};

export default PlannerProfileDetail;
