import "../Css/main.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidesection from "../Components/Sidesection";

function Review() {
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [reviewTitle, setReviewTitle] = useState([]);
  const [reviewStars, setReviewStars] = useState([]);
  const [reviewComments, setReviewComments] = useState([]);
  const [reviewViews, setReviewViews] = useState([]);
  const [estimateIds, setEstimatesIds] = useState([]);
  const [reviewIndex, setReviewIndex] = useState([]);
  const [checksort, setCheckSort] = useState(false);

  const [selectIndex, setSelectIndex] = useState(0);
  const [selectEstimateId, setSelectEstimateId] = useState(0);
  let [estimateData, SetEstimateData] = useState(null);
  let [images, setImages] = useState([]);
  let [estimateIdArr, setEstimateIdArr] = useState([]);
  const [userMatching, setUserMatching] = useState(null);
  const [estimateIndex, setEstimateIndex] = useState([]);
  const [selected, setSelected] = useState(false);
  const [existEstimates, setExistEstimates] = useState(true);

  const navigate = useNavigate();

  const fetchData = async (selectedEstimateId) => {
    try {
      const response = await axios.get(
        `/estimate/detail/${selectedEstimateId}`
      );
      const { data } = response;
     // console.log(data);
      SetEstimateData(data);
      if (data.userMatching === null) {
        setUserMatching(null);
      } else {
        setUserMatching(JSON.parse(data.userMatching));
      }
      // 이미지 데이터 가져오기
      const imagearray = JSON.parse(data.img);
      const imagePromises = imagearray.map((image) => {
        return axios.get("/estimate/imageview", {
          params: { image },
          responseType: "blob",
        });
      });
      const responses = await Promise.all(imagePromises);
      const imageUrls = responses.map((res) => {
        const resdata = URL.createObjectURL(res.data);
        return resdata;
      });
      setImages(imageUrls);
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleSortClick = (sort) => {
  //  console.log(sort);
    setCheckSort(checksort => !checksort);
    setSelectedSort(sort); // 선택한 정렬로 버튼명 변경
  };

  useEffect(() => {
    axios
      .get(`/getreviewslist`)
      .then((res) => {
       // console.log(res);
        let data = res.data;
        if (selectedSort === "By Rating") {
          data.sort(function (a, b) {
           // console.log(a.reviewStars);
            if (a.reviewStars < b.reviewStars) return 1;
            if (a.reviewStars > b.reviewStars) return -1;
            if (a.reviewStars === b.reviewStars) {
              return new Date(a.reviewDate) - new Date(b.reviewDate);
            }
          });
        } else if (selectedSort === "By Views") {
          data.sort(function (a, b) {
            if (a.reviewCounts < b.reviewCounts) return 1;
            if (a.reviewCounts > b.reviewCounts) return -1;
            if (a.reviewCounts === b.reviewCounts) {
              return new Date(a.reviewDate) - new Date(b.reviewDate);
            }
          });
        } else if (selectedSort === "By Comments") {
          data.sort(function (a, b) {
            if (a.comments.length < b.comments.length) return 1;
            if (a.comments.length > b.comments.length) return -1;
            if (a.comments.length === b.comments.length) {
              return new Date(a.reviewDate) - new Date(b.reviewDate);
            }
          });
        } else if (selectedSort === "Latest") {
          data.sort(function (a, b) {
            return new Date(a.reviewDate) - new Date(b.reviewDate);
          });
        }
        const reviewTitleArr = [];
        const reviewStarsArr = [];
        const reviewCommentsArr = [];
        const reviewViewsArr = [];
        const estimateIdArr = [];
        const reviewIndexArr = [];
        for (let i = 0; i < data.length; i++) {
          reviewTitleArr.push(data[i].reviewTitle);
          reviewStarsArr.push(data[i].reviewStars);
          reviewCommentsArr.push(data[i].comments.length);
          reviewViewsArr.push(data[i].reviewCounts);
          estimateIdArr.push(data[i].estimateId);
          reviewIndexArr.push(i);
        }
        setReviewTitle(reviewTitleArr);
        setReviewStars(reviewStarsArr);
        setReviewComments(reviewCommentsArr);
        setReviewViews(reviewViewsArr);
        setEstimatesIds(estimateIdArr);
        setReviewIndex(reviewIndexArr);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [checksort, selectedSort]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("userEmail", sessionStorage.getItem("email"));
    axios.post(`/existreviewpaid`, formData).then((res) => {
    //  console.log("data:++++++++++++++" + res.data);
      console.log(res);
      let indexArr = [];
      if (res.data.length !== 0) {
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          estimateIdArr.push(data[i]);
          indexArr.push(i);
        }
        setEstimateIdArr(estimateIdArr);
        setEstimateIndex(indexArr);
        setSelectEstimateId(estimateIdArr[0]);
      //  console.log(estimateIdArr[0]);
        const defaultEstimateId = estimateIdArr[0];
        const fetchData1 = async () => {
          try {
            const response = await axios.get(
              `/estimate/detail/${defaultEstimateId}`
            );
            const { data } = response;
            //console.log(data);
            SetEstimateData(data);
            if (data.userMatching === null) {
              setUserMatching(null);
            } else {
              setUserMatching(JSON.parse(data.userMatching));
            }
            // 이미지 데이터 가져오기
            if(data.img){
              const imagearray = JSON.parse(data.img);
              const imagePromises = imagearray.map((image) => {
                return axios.get("/estimate/imageview", {
                  params: { image },
                  responseType: "blob",
                });
              });
              const responses = await Promise.all(imagePromises);
              const imageUrls = responses.map((res) => {
                const resdata = URL.createObjectURL(res.data);
                return resdata;
              });
              setImages(imageUrls);
            }
            
          } catch (error) {
            console.log(error);
          }
        };
        fetchData1();
      } else {
        setExistEstimates(false);
      }
    });
  }, []);

  const goChooseEstimate = (e) => {
    const estimateId = selectEstimateId;

    const formData = new FormData();
    formData.append("targetEstimateId", estimateId);

    axios
      .post(`/plannerinforeview`, formData)
      .then((res) => {
        const plannerData = res.data;

        navigate("/rating", {
          state: {
            estimateId,
            plannerEmail: plannerData.email,
            plannerImg: plannerData.plannerImg,
            plannerName: plannerData.name,
          },
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={"Reviews"} />
        <div style={{ marginTop: 75 }}>
          <div class="dropdown  right-sort">
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
                  onClick={() => handleSortClick("By Rating")}
                >
                  By Rating
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item"
                  type="button"
                  onClick={() => handleSortClick("By Comments")}
                >
                  By Comments
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item"
                  type="button"
                  onClick={() => handleSortClick("By Views")}
                >
                  By Views
                </button>
              </li>
              <li className="">
                <button
                  class="dropdown-item "
                  type="button"
                  onClick={() => handleSortClick("Latest")}
                >
                  Latest
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="noticeSection">
          <tabel>
            <thead>
              <tr>
                <td style={{ width: 350 }}>
                  <p className="noticeTxt">Title</p>
                </td>
                <td style={{ width: 60 }}>
                  <p className="noticeTxtCenter">Rating</p>
                </td>
                <td style={{ width: 80 }}>
                  <p className="noticeTxtCenter">Comments</p>
                </td>
                <td style={{ width: 80 }}>
                  <p className="noticeTxtCenter">Views</p>
                </td>
              </tr>
            </thead>
            <tbody>
              {reviewIndex.map((index) => {
                return (
                  <tr
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      axios
                        .put(`/reviewcount/${estimateIds[index]}`)
                        .then((res) => {
                        //  console.log(res);
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                      navigate(`/review/detail`, {
                        state: { estimateId: estimateIds[index] },
                      });
                    }}
                  >
                    <td
                      style={{
                        height: 50,
                        fontSize: "1.5em",
                        paddingLeft: "20px",
                      }}
                    >
                      {reviewTitle[index]}
                    </td>
                    <td>
                      <p className="noticeTxtCenter">{reviewStars[index]}/5</p>
                    </td>
                    <td>
                      <p className="noticeTxtCenter">{reviewComments[index]}</p>
                    </td>
                    <td>
                      <p className="noticeTxtCenter">{reviewViews[index]}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </tabel>
        </div>
        {sessionStorage.getItem("category") === "user" ? (
          existEstimates ? (
            <button
              class="writeBtn"
              data-bs-toggle="modal"
              data-bs-target="#chooseEstimate"
              onClick={() => {
                setSelected(true);
              }}
            >
              Write Review
            </button>
          ) : (
            <button
              class="writeBtn"
              onClick={() => {
                alert("You need a completed payment to write a review!");
              }}
            >
              Write Review
            </button>
          )
        ) : null}
        <div style={{ height: 90 }}></div>
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
                  Select Estimate
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
                     // console.log(e);
                     // console.log(e.target.value);
                      setSelectIndex(e.target.value);
                      const index = e.target.value;
                      setSelectEstimateId(estimateIdArr[index]);
                      fetchData(estimateIdArr[index]);
                    }}
                  >
                    {estimateIndex.map((index) => {
                      return <option value={index}>Estimate {index + 1}</option>;
                    })}
                  </select>

                  <div
                    style={{
                      fontSize: "1.5em",
                      padding: "10px",
                    }}
                  >
                    Estimate Details
                  </div>
                  <p
                    style={{
                      fontSize: "1.3em",
                      width: "550px",

                      marginLeft: "-35px",
                      marginTop: "-100px",
                    }}
                  >
                    {estimateData !== null ? (
                      <div className="contentcontainer-detail">
                        <div className="contentbox-detail">
                          <h5 onClick={() => {}}>Desired Wedding Date</h5>
                          {JSON.parse(estimateData?.weddingdate).map(
                            (e, index) => {
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
                            }
                          )}
                        </div>
                        <div className="contentbox-detail">
                          <h5>Desired Wedding Region</h5>
                          {JSON.parse(estimateData?.region).map((e, index) => {
                            return (
                              <div className="choosebox-detail">
                                {e === "" ? (
                                  <></>
                                ) : (
                                  <>
                                    <div>#{index + 1}</div>
                                    <div className="result-detail">{e}</div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="contentbox-detail">
                          <h5>Budget Limit</h5>
                          <div
                            className="choosebox-detail"
                            style={{ width: "150px" }}
                          >
                            <div className="result-detail">
                              {estimateData?.budget.toLocaleString()} KRW
                            </div>
                          </div>
                        </div>
                        <div className="contentbox-detail">
                          <h5>Desired Studio Style</h5>
                          <div className="choosebox-detail">
                            <div className="result-detail">
                              {estimateData?.studio}
                            </div>
                          </div>
                        </div>

                        <div className="contentbox-detail">
                          <h5>Bridal Dress Style</h5>
                          {estimateData?.dress === "[]" && (
                            <div className="choosebox-detail">
                              <div className="result-noneChoose">
                                *No option selected*
                              </div>
                            </div>
                          )}
                          {JSON.parse(estimateData?.dress).map((e, index) => {
                            return (
                              <div className="choosebox-detail">
                                {e === "" ? (
                                  <></>
                                ) : (
                                  <>
                                    <div>#{index + 1}</div>
                                    <div className="result-detail">{e}</div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                          <div></div>
                        </div>
                        <div className="contentbox-detail">
                          <h5>Bridal Makeup Style</h5>
                          {estimateData?.dress === "[]" && (
                            <div className="choosebox-detail">
                              <div className="result-noneChoose">
                                *No option selected*
                              </div>
                            </div>
                          )}
                          {JSON.parse(estimateData?.makeup).map((e, index) => {
                            return (
                              <div className="choosebox-detail">
                                {e === "" ? (
                                  <></>
                                ) : (
                                  <>
                                    <div>{index + 1}순위</div>
                                    <div className="result-detail">{e}</div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="contentbox-detail">
                          <h5>Desired Honeymoon Destination</h5>
                          <div className="choosebox-detail">
                            {estimateData?.honeymoon === "" && (
                              <div className="result-noneChoose">
                                *No option selected*
                              </div>
                            )}
                            {estimateData?.honeymoon !== "" && (
                              <div className="result-detail">
                                {estimateData?.honeymoon.slice(3)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="contentbox-detail">
                          {images?.length === 0 ? (
                            <h5>Attached Images</h5>
                          ) : (
                            <h5 style={{ marginTop: "-20px" }}>
                              고객 첨부이미지{" "}
                            </h5>
                          )}

                          {images.length === 0 && (
                            <span>No attached images.</span>
                          )}
                          <br></br>
                          <div>
                            {images.map((e, index) => {
                              return (
                                <div key={index}>
                                  <>
                                    <img
                                      src={e}
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
                          <h5>Customer Requests</h5>
                          <div
                            className="choosebox-detail w-100"
                            style={{ color: "black" }}
                          >
                            {estimateData?.requirement === "" && (
                              <span>No customer requests.</span>
                            )}
                            {estimateData?.requirement}
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
                  Select
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
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

export default Review;
