import "../Css/main.css";
import "../Css/EstimateDetail.css";
import personCentered from "../Assets/logo.png";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import Sidesection from "../Components/Sidesection";

const EstimateDetail = () => {
  const navigate = useNavigate();
  let { id } = useParams();

  //상태값
  let [loading, setLoading] = useState(false);
  let [estimateData, SetEstimateData] = useState();
  let [images, setImages] = useState([]);
  let [scrollControl, setScrollControl] = useState();
  let [plannerMatching, setPlannerMatching] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/estimate/detail/${id}`
        );
        const { data } = response;
      // console.log(data);
        SetEstimateData(data);
        setLoading(true);
        if (data.plannermatching === null) {
          setPlannerMatching(null);
        } else {
          setPlannerMatching(JSON.parse(data.plannermatching));
        }
        // getting image data
        const imagearray = JSON.parse(data.img);
        setImages(imagearray);
        if (data.matchstatus === true) {
          setScrollControl(false);
        } else {
          setScrollControl(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const onScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const estimateDelete = async () => {
    if (window.confirm("Are you sure you want to delete this estimate post?")) {
      try {
        let response = await axios.get(
          "/estimate/delete",
          { params: { id: estimateData.id } }
        );
        let { data } = response;
      // console.log("삭제 성공");
        navigate("../estimatelist");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const goMatching = (e) => {
    if (plannerMatching === null) {
      let plannerEmail = [sessionStorage.getItem("email")];
    //  console.log(plannerEmail);
      let formData = new FormData();
      formData.append("id", id);
      formData.append("plannermatching", JSON.stringify(plannerEmail));
      axios
        .post(`/estimate/insert/matchingplanner`, formData)
        .then((res) => {
        //  console.log(res);
          alert("Matching application submitted!");
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.message === "중복됩니다!") {
            alert("You have already applied for matching!");
          }
        });
    } else {
      const addplannerEmail = sessionStorage.getItem("email");
      if (!plannerMatching.includes(addplannerEmail)) {
        let formData = new FormData();
        formData.append("id", id);
        formData.append(
          "plannermatching",
          JSON.stringify([...plannerMatching, addplannerEmail])
        );
        axios
          .post(`/estimate/insert/matchingplanner`, formData)
          .then((res) => {
           // console.log(res);
            alert("Matching application submitted!");
          })
          .catch((e) => {
            console.log(e);

            if (e.response.data.message === "중복됩니다!") {
              alert("You have already applied for matching!");
            }
          });
      } else {
        alert("You have already applied for matching!");
      }
    }
  };

  if (loading === false) {
    return <div></div>;
  } else {
    return (
      <div className="containerbox">
        <div
          className="mainlayout box1"
          style={
            scrollControl === false
              ? { height: "100vh", overflow: "hidden" }
              : { height: "100%" }
          }
        >
          <NavigationBar
            title={`${estimateData.writer.slice(0, 3) + "***'s Estimate"}`}
          />
          <div
            className="scrolltop"
            onClick={() => {
              onScrollTop();
            }}
          >
            <i class="bi bi-chevron-up"></i>
          </div>
          {scrollControl === false ? (
            <div className="match-complete-box">
              <div className="match-complete-box-content">
                <h1>This post has been matched.</h1>
                <div className="match-complete-btn-box">
                  <button
                    className="match-complete-btn"
                    onClick={() => {
                      setScrollControl(true);
                    }}
                  >
                    View Anyway
                  </button>
                </div>
                <div className="match-complete-btn-box">
                  <button
                    className="match-complete-btn"
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="contentcontainer-detail">
            <div className="contentbox-detail">
              <h5>Desired Wedding Date</h5>
              {JSON.parse(estimateData.weddingdate).map((e, index) => {
                return (
                  <div className="choosebox-detail">
                    {e === "" ? (
                      <></>
                    ) : (
                      <>
                        <div>Priority {index + 1}</div>
                        <div className="result-detail">{e}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="contentbox-detail">
              <h5>Desired Wedding Region</h5>
              {JSON.parse(estimateData.region).map((e, index) => {
                return (
                  <div className="choosebox-detail">
                    {e === "" ? (
                      <></>
                    ) : (
                      <>
                        <div>Priority {index + 1}</div>
                        <div className="result-detail">{e}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="contentbox-detail">
              <h5>Budget Limit</h5>
              <div className="choosebox-detail" style={{ width: "150px" }}>
                <div className="result-detail">
                  {estimateData.budget.toLocaleString()} KRW
                </div>
              </div>
            </div>
            <div className="contentbox-detail">
              <h5>Desired Studio Style</h5>
              <div className="choosebox-detail">
                <div className="result-detail">{estimateData.studio}</div>
              </div>
              <div>
                {/* <span>
                스튜디오 스타일이 궁금하다면?&nbsp;
                <span
                  type="button"
                  className="badge bg-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#studioModal"
                >
                  Click
                </span>
              </span> */}
              </div>
            </div>

            <div className="contentbox-detail">
              <h5>Bridal Dress Style</h5>
              {estimateData.dress === "[]" && (
                <div className="choosebox-detail">
                  <div className="result-noneChoose">*No option selected*</div>
                </div>
              )}
              {JSON.parse(estimateData.dress).map((e, index) => {
                return (
                  <div className="choosebox-detail">
                    {e === "" ? (
                      <></>
                    ) : (
                      <>
                        <div>Priority {index + 1}</div>
                        <div className="result-detail">{e}</div>
                      </>
                    )}
                  </div>
                );
              })}
              <div>
              </div>
            </div>
            <div className="contentbox-detail">
              <h5>Bridal Makeup Style</h5>
              {estimateData.dress === "[]" && (
                <div className="choosebox-detail">
                  <div className="result-noneChoose">*No option selected*</div>
                </div>
              )}
              {JSON.parse(estimateData.makeup).map((e, index) => {
                return (
                  <div className="choosebox-detail">
                    {e === "" ? (
                      <></>
                    ) : (
                      <>
                        <div>Priority {index + 1}</div>
                        <div className="result-detail">{e}</div>
                      </>
                    )}
                  </div>
                );
              })}
              <div>
              </div>
            </div>
            <div className="contentbox-detail">
              <h5>Desired Honeymoon Destination</h5>
              <div className="choosebox-detail">
                {estimateData.honeymoon === "" && (
                  <div className="result-noneChoose">*No option selected*</div>
                )}
                {estimateData.honeymoon !== "" && (
                  <div className="result-detail">
                    {estimateData.honeymoon.slice(3)}
                  </div>
                )}
              </div>
            </div>

            <div className="contentbox-detail">
              <h5>
                Attached Images{" "}
                {images?.length !== 0 && <span>(Click to enlarge)</span>}
              </h5>
              {images?.length === 0 && <span>No attached images.</span>}
              <br></br>
              <div>
                {images?.map((e, index) => {
                  return (
                    <div key={index}>
                      <>
                        <button
                          type="button"
                          class="btn"
                          data-bs-toggle="modal"
                          data-bs-target={`#number${index.toString()}`}
                          style={{ width: "40%" }}
                        >
                          <img
                            src={e}
                            width="40%"
                            height="40%"
                            style={{
                              float: "left",
                              width: "100%",
                              borderRadius: "10px",
                            }}
                            alt=""
                          />
                        </button>
                        <ImagesView
                          image={e}
                          index={`number${index.toString()}`}
                        />
                      </>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="contentbox-detail" style={{ borderBottom: "none" }}>
              <h5>Customer Requests</h5>
              <div
                className="choosebox-detail w-100"
                style={{ color: "black" }}
              >
                {estimateData.requirement === "" && (
                  <span>No customer requests.</span>
                )}
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {estimateData.requirement}
                </div>
              </div>
            </div>
            <div className="update-button-box" style={{ marginBottom: "30px" }}>
              {window.sessionStorage.getItem("email") === estimateData.writer &&
                window.sessionStorage.getItem("category") === "user" &&
                estimateData.matchstatus === false && (
                  <>
                    <button
                      onClick={() => {
                        navigate(`../estimatemodify/${estimateData.id}`);
                      }}
                      className="btn-colour-1"
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        estimateDelete();
                      }}
                      className="btn-colour-1"
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </button>
                  </>
                )}
              {window.sessionStorage.getItem("category") === "planner" &&
                estimateData.matchstatus === false && (
                  <button
                    style={{ marginRight: "15px", marginBottom: "20px" }}
                    onClick={goMatching}
                    className="btn-colour-1"
                  >
                    Apply for Matching
                  </button>
                )}
              {estimateData.matchstatus === true ||
                (window.sessionStorage.getItem("email") !==
                  estimateData.writer && (
                  <button
                    onClick={() => {
                      navigate(-1);
                    }}
                    className="btn-colour-1"
                    style={{ marginRight: "10px" }}
                  >
                    Go Back
                  </button>
                ))}
            </div>
          </div>
          <div style={{ height: 94.19 }}></div>
          <Footer />
        </div>
        <div className="box2"></div>
        <div className="box3">
          <Sidesection />
        </div>
      </div>
    );
  }
};

export default EstimateDetail;

const ImagesView = ({ image, index }) => {
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
          <img src={image} alt="" />
        </div>
      </div>
    </div>
  );
};
