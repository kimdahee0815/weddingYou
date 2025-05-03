import "../Css/main.css";
import "../Css/Matching.css";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import defaultprofileimage from "../Assets/defaultprofileimage.jpg";
import starIcon from "../Assets/matchingIcon.png";
import heartIcon from "../Assets/heartIcon.png";
import Sidesection from "./Sidesection";
function Matching() {
  const navigate = useNavigate();

  const [userEstimates, setUserEstimates] = useState([]);
  const [plannerEstimates, setPlannerEstimates] = useState([]);
  const [currentUserEstimate, setCurrentUserEstimate] = useState(null);
  const [currentPlannerProfile, setCurrentPlannerProfile] = useState(null);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [matchedPlanners, setMatchedPlanners] = useState([]);
  const [matchedUser, setMatchedUser] = useState(false);
  const [matchedPlanner, setMatchedPlanner] = useState(false);
  const [deletedUser, setDeletedUser] = useState(false);
  const [deletedPlanner, setDeletedPlanner] = useState(false);
  const [cancelMatching, setCancelMatching] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState([]);
  const [estimatesPaymentStatus, setEstimatesPaymentStatus] = useState([]);

  const [plannerMatching, setPlannerMatching] = useState([]);
  const [plannerName, setPlannerName] = useState("");

  const [selectEstimateNum, setSelectEstimateNum] = useState(0);
  const deleteBtn = useRef();

  let loggedInEmail = sessionStorage.getItem("email");

  //estimate details + (user: planner profile details, planner: user details)
  useEffect(() => {
    if (sessionStorage.getItem("category") === "planner") {
      //planner일 경우
      const getUserEstimatesDetails = async () => {
        try {
          const {data:userEstimates} = await axios.get(`/estimate/users/detail`, {
            params: { userEmail: loggedInEmail },
          });
          console.log("userEstimates")
          console.log(userEstimates)
          setUserEstimates(userEstimates)
        } catch (e) {
          console.log(e);
        }
      };
      getUserEstimatesDetails();
    } else if (sessionStorage.getItem("category") === "user") {
      //user 경우
      const getPlannersAndEstimatesDetails = async () => {
        try {
          const {data:plannerEstimates} = await axios.get(`/estimate/planners/detail`, {
            params: { userEmail: loggedInEmail },
          });
          // console.log("plannerEstimates")
          // console.log(plannerEstimates)
          setPlannerEstimates(plannerEstimates)
        } catch (e) {
          console.log(e);
        }
      };
      getPlannersAndEstimatesDetails();
    }
  }, [loggedInEmail, deletedPlanner, deletedUser ,cancelMatching, matchedUser, matchedPlanner]);

  
  //matched planners, users details
  useEffect(() => {
    if (sessionStorage.getItem("category") === "planner") {
      const formData = new FormData();
      formData.append("plannerEmail", loggedInEmail);
      axios
        .post(`/plannerProfile/match/users`, formData)
        .then((res) => {
          // console.log("matchedUsers")
          // console.log(res.data)
          const matchedUsersData = res.data;
          setMatchedUsers(matchedUsersData)
        })
        .catch((e) => {
          console.log(e);
        });
    }else if (sessionStorage.getItem("category") === "user"){
      const formData = new FormData();
      formData.append("userEmail", loggedInEmail);
      axios
        .post(`/plannerProfile/match/planners`, formData)
        .then((res) => {
          // console.log("matchedPlanners")
          // console.log(res.data)
          const matchedPlannersData = res.data;
          setMatchedPlanners(matchedPlannersData)
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [loggedInEmail, deletedPlanner, deletedUser ,cancelMatching, matchedUser, matchedPlanner]);

  //매칭/거절 모달
  const matchOrDeletePlanner = (e) => {
    e.preventDefault();

    const {bsEstimate: estimate, bsProfile:profile} = e.target.dataset;
    setCurrentUserEstimate(JSON.parse(estimate));
    setCurrentPlannerProfile(JSON.parse(profile));
  };

  //매칭/거절 모달
  const matchOrDeleteUser = (e) => {
    e.preventDefault();
    const {bsEstimate:estimate} = e.target.dataset;
    setCurrentUserEstimate(JSON.parse(estimate));
  };

  //user declines planner
  const confirmDeleteMatchingPlanner = () => {
    axios
    .delete('/estimate/matching/planner', {
      params: { 
        deleteTargetEstimateId: currentUserEstimate.id, 
        deletePlanner: currentPlannerProfile.plannerEmail  
        }
      })
      .then((res) => {
        setDeletedPlanner(deletedPlanner => !deletedPlanner);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //planner declines user
  const confirmDeleteMatchingUser = () => {
    axios
    .delete('/estimate/matching/user', {
      params: { 
        deleteTargetEstimateId: currentUserEstimate.id, 
        deletePlanner: loggedInEmail 
        }
      })
      .then((res) => {
        setDeletedUser(deletedUser => !deletedUser);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //matching from user
  const goMatchingPlanner = () => {
    const formData = new FormData();
    formData.append("targetEstimateId", currentUserEstimate.id);
    formData.append("matchingPlanner", currentPlannerProfile.plannerEmail);
    formData.append("userEmail", loggedInEmail);
    axios
      .post(`/estimate/matching`, formData)
      .then((res) => {
        // console.log("matching")
        // console.log(res.data);
        let depositPrice = 0;
        let careerYears = currentPlannerProfile.career;
        if(careerYears < 5 && careerYears >= 0){
          depositPrice = 50000;
        } else if(careerYears < 10){
          depositPrice = 100000;
        } else{
          depositPrice = 150000;
        }
        setMatchedPlanner(matchedPlanner => !matchedPlanner);
        navigate("/checkoutdeposit", {
          state: {
            estimateId: currentUserEstimate.id,
            userName: currentUserEstimate.user.name,
            userPhone: currentUserEstimate.user.phoneNum,
            plannerEmail: currentPlannerProfile.plannerEmail,
            plannerName: currentPlannerProfile.plannerName,
            depositprice: depositPrice,
            plannerImg: currentPlannerProfile.plannerProfileImg,
            plannerCareer: currentPlannerProfile.plannerCareerYears,
          },
        });  
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //matching from planner
  const goMatchingUser = (e) => {
    const formData = new FormData();
    formData.append("plannerEmail", loggedInEmail);
    formData.append("estimateId", currentUserEstimate.id);
    axios
      .post(`/plannerProfile/matching/user`, formData)
      .then((res) => {
        if (res.data === 1) {
          alert("해당 고객과 매칭되었습니다!");
          setMatchedUser(matchedUser => !matchedUser);
        } else {
          alert("매칭 오류입니다. 다시 시도해주세요.");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("email", sessionStorage.getItem("email"));
    formData.append("category", sessionStorage.getItem("category"));

    axios
      .post(`/payment-status`, formData)
      .then((res) => {
        console.log("payment-status")
        console.log(res.data);
        const paymentStatus = res.data;
        
        if (sessionStorage.getItem("category") === "user"){
          const newPaymentStatus = [];
          plannerEstimates.forEach(e => {
            const foundPayment = paymentStatus.find(p => e.id === p.estimateId);
            if(!foundPayment){
              newPaymentStatus.push(null);
            }else{
              newPaymentStatus.push(foundPayment)
            }
          })
          setEstimatesPaymentStatus(newPaymentStatus);
          setPaymentStatus(newPaymentStatus.filter(s => s !== null))
          console.log("newPaymetnStatus")
          console.log(newPaymentStatus);
        }else if(sessionStorage.getItem("category") === "planner"){
          const newPaymentStatus = [];
          userEstimates.forEach(e => {
            const foundPayment = paymentStatus.find(p => e.id === p.estimateId);
            if(!foundPayment){
              newPaymentStatus.push(null);
            }else{
              newPaymentStatus.push(foundPayment)
            }
          })
          setEstimatesPaymentStatus(newPaymentStatus);
          setPaymentStatus(newPaymentStatus.filter(s => s !== null))
          // console.log("newPaymetnStatus")
          // console.log(newPaymentStatus);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [loggedInEmail, plannerEstimates, deletedPlanner, deletedUser, cancelMatching, matchedUser, matchedPlanner, userEstimates]);

  //매칭취소 modal
  const CancelMatchingModal = (e) => {
    const {bsEstimate:estimate, bsPlanner:plannerProfile} = e.target.dataset;
    // console.log(JSON.parse(estimate));
    // console.log(matchedUsers)
    if(plannerProfile){
      setCurrentPlannerProfile(JSON.parse(plannerProfile));
    }
    setCurrentUserEstimate(JSON.parse(estimate));
  };

  //매칭취소
  const CancelMatching = (e) => {
    if(sessionStorage.getItem("category") === "planner"){
      axios
    .delete('/estimate/matching/user', {
      params: { 
        deleteTargetEstimateId: currentUserEstimate.id, 
        deletePlanner: loggedInEmail 
        }
      })
      .then((res) => {
        alert("해당 고객과의 매칭이 취소되었습니다!");
        setDeletedUser(deletedUser => !deletedUser);
      })
      .catch((e) => {
        console.log(e);
      });
    }else if(sessionStorage.getItem("category") === "user"){
      axios
      .delete('/estimate/matching/planner', {
        params: { 
          deleteTargetEstimateId: currentUserEstimate.id, 
          deletePlanner: currentPlannerProfile.plannerEmail  
          }
        })
        .then((res) => {
          alert("해당 플래너와의 매칭이 취소되었습니다!");
          setDeletedPlanner(deletedPlanner => !deletedPlanner);
        })
        .catch((e) => {
          console.log(e);
        });
      }
  }

  // go to deposit page or payment page
  const goPay = (e) => {
    const {bsEstimate: estimate} = e.target.dataset;
    const formData = new FormData();
    const estimateData = JSON.parse(estimate);
    formData.append("userEmail", loggedInEmail);
    formData.append("plannerEmail", estimateData?.plannerProfiles?.[0].plannerEmail)
    formData.append("estimateId", estimateData.id);

    // console.log(estimateData)
    let depositPrice = 0;
    let careerYears = estimateData.plannerProfiles?.[0].career;
    if(careerYears < 5 && careerYears >= 0){
      depositPrice = 50000;
    } else if(careerYears < 10){
      depositPrice = 100000;
    } else{
      depositPrice = 150000;
    }
    axios
      .post(`/deposit/check`, formData)
      .then((res) => {
        // console.log(res);
        const status = res.data;
        if (status === "payment") {
            navigate("/checkoutall", {
              state: {
                estimateId: estimateData.id,
                userName: estimateData.user.name,
                userPhone: estimateData.user.phoneNum,
                plannerEmail: estimateData.plannerProfiles?.[0].plannerEmail,
                plannerName: estimateData.plannerProfiles?.[0].plannerName,
                plannerImg: estimateData.plannerProfiles?.[0].plannerProfileImg,
                depositprice: depositPrice,
              },
            });
          } else if (status === "-1") {
            alert("오류 발생!");
          } else if (status === "deposit") {
            navigate("/checkoutdeposit", {
              state: {
                estimateId: estimateData.id,
                userName: estimateData.user.name,
                userPhone: estimateData.user.phoneNum,
                plannerEmail: estimateData.plannerProfiles?.[0].plannerEmail,
                plannerName: estimateData.plannerProfiles?.[0].plannerName,
                plannerImg: estimateData.plannerProfiles?.[0].plannerProfileImg,
                depositprice: depositPrice,
                plannerCareer: estimateData.plannerProfiles?.[0].career,
              },
            });
          } else{
            alert("결제가 모두 완료된 상태입니다!");
          }
        })
      .catch((e) => {
        console.log(e);
      });
  };

  //go see details of planner profile
  const goPlannerProfile = (e) => {
    const {bsPlanner} = e.target.dataset
    const planner = JSON.parse(bsPlanner);
    setCurrentPlannerProfile(planner);
    navigate(`/plannerprofiledetail`, {
      state: {
        plannerEmail: planner.plannerEmail,
        plannerName: planner.plannerName,
        plannerImg: planner.plannerProfileImg,
      },
    });
  };

  //go see details of estimate
  const goToEstimate = (e) => {
    const estimateId = e.target.dataset.bsId;
    navigate(`/estimatedetail/${estimateId}`);
  };

  const writeReview = (e) => {
    const {bsEstimate} = e.target.dataset;
    const estimate = JSON.parse(bsEstimate);
    const formData = new FormData();
    formData.append("targetEstimateId", estimate.id);
    formData.append("matchingPlanner", estimate.plannerProfiles[0].plannerEmail);
    formData.append("userEmail", loggedInEmail);

    navigate("/rating", {
      state: {
        estimateId: estimate.id,
        plannerEmail: estimate.plannerProfiles[0].plannerEmail,
        plannerImg: estimate.plannerProfiles[0].plannerProfileImg,
        plannerName: estimate.plannerProfiles[0].plannerName,
      },
    });
  };

  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <hr />
        <NavigationBar title={"나의 매칭 목록"} />
        {sessionStorage.getItem("category") === "user" ? (
          <div style={{ minHeight: "100vh", height: "100%" }}>
            <p
              className="headertxt"
              style={{
                marginTop: "80px",
                fontSize: "1.7em",
                paddingBottom: "25px",
                paddingTop: "25px",
                borderBottom: "3px dashed grey",
                borderTop: "3px dashed grey",
                marginBottom: "30px",
              }}
            >
              매칭된 플래너
            </p>

            {matchedPlanners.length !== 0 ? (
              matchedPlanners?.map((estimate, estimateIndex) => {
                return (
                  <div>
                    <div
                      className="matchingList"
                      style={{
                        marginBottom: "30px",
                        borderBottom: "1px solid grey",
                        borderTop: "1px solid grey",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          borderBottom: "3px double grey",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.7em",
                            flexGrow: 1,
                            paddingLeft: "40px",
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            display: "flex",
                          }}
                        >
                          -견적서{estimateIndex+1}-
                        </div>

                        {paymentStatus?.[estimateIndex] && paymentStatus?.[estimateIndex]?.paymentStatus === "paid" ? (
                          <div
                            style={{
                              display: "inline-block",
                              width: "150px",
                              height: "44px",
                              borderRadius: "10px",
                              border: "1px solid green",
                              fontSize: "1.6em",
                              textAlign: "center",
                              backgroundColor: "green",
                              color: "white",
                              marginTop: "15px",
                              marginRight: "20px",
                              paddingTop: "2px",
                            }}
                          >
                            결제완료!
                          </div>
                        ) : paymentStatus?.[estimateIndex] && paymentStatus?.[estimateIndex]?.depositStatus === "paid" ? (
                          <div
                          style={{
                            display: "inline-block",
                            width: "180px",
                            height: "44px",
                            borderRadius: "10px",
                            border: "1px solid yellow",
                            fontSize: "1.6em",
                            textAlign: "center",
                            backgroundColor: "yellow",
                            color: "black",
                            marginTop: "15px",
                            marginRight: "20px",
                            paddingTop: "2px",
                          }}
                        >
                          계약금 결제 완료!
                        </div>
                          
                        ) : paymentStatus?.[estimateIndex] && paymentStatus?.[estimateIndex]?.depositStatus !== "paid" ? (
                          <div
                          style={{
                            display: "inline-block",
                            width: "150px",
                            height: "44px",
                            borderRadius: "10px",
                            border: "1px solid red",
                            fontSize: "1.6em",
                            textAlign: "center",
                            backgroundColor: "red",
                            color: "white",
                            marginTop: "15px",
                            marginRight: "20px",
                            paddingTop: "2px",
                          }}
                        >
                          미결제
                        </div>
                        ) : null}
                      </div>
                      
                        {estimate?.plannerProfiles &&
                        estimate?.plannerProfiles.map(profile => 
                          <>
                          <p
                        className="myPlannerName"
                        style={{
                          fontSize: "1.6em",
                          marginLeft: "120px",
                          marginRight: "-140px",
                        }}
                            >
                          {profile.plannerName}
                          {paymentStatus?.[estimateIndex] ?
                            paymentStatus?.[estimateIndex]?.depositStatus === "paid"? 
                           <img
                               src={heartIcon}
                               alt=""
                               style={{
                                 width: "55px",
                                 height: "55px",
                                 marginLeft: "14px",
                               }}
                             />: 
                             <img
                             src={starIcon}
                             alt=""
                             style={{
                               width: "55px",
                               height: "55px",
                               marginLeft: "14px",
                             }}
                           /> : null}
                         </p>
                         <button
                           className="plannerProBtn"
                           data-bs-planner={JSON.stringify(profile)}
                           onClick={goPlannerProfile}
                         >
                           프로필 보기
                         </button>
                         <br />
                         <div className="matchingBtnList">
                           <button
                             className="plannerMatchingBtn"
                             data-bs-estimate={JSON.stringify(estimate)}
                             onClick={goPay}
                           >
                             결제하기
                           </button>
                           {paymentStatus?.[estimateIndex] && paymentStatus?.[estimateIndex]?.paymentStatus === "paid" ? (
                             <button
                               className="plannerMatchingBtn"
                               data-bs-estimate={JSON.stringify(estimate)}
                               onClick={writeReview}
                             >
                               리뷰쓰기
                             </button>
                           ) : (
                             <button
                               className="plannerMatchingBtn"
                               data-bs-toggle="modal"
                               data-bs-target="#CancelMatching"
                               data-bs-estimate={JSON.stringify(estimate)}
                               data-bs-planner={JSON.stringify(profile)}
                               onClick={CancelMatchingModal}
                             >
                               매칭취소
                             </button>
                           )}
                         </div>
                         </> 
                        )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  marginTop: "20px",
                  height: "20px",
                  fontSize: "1.5em",
                  paddingLeft: "160px",
                  marginBottom: "60px",
                }}
              >
                아직 매칭된 플래너가 없습니다.
              </div>
            )}

            <p
              className="headertxt"
              style={{
                fontSize: "1.7em",
                borderBottom: "3px dashed grey",
                borderTop: "3px dashed grey",
                paddingBottom: "25px",
                paddingTop: "25px",
                marginBottom: "30px",
              }}
            >
              매칭 요청 온 플래너 목록
            </p>
            <div>
              {plannerEstimates.length !== 0 ? (
                plannerEstimates.map((estimate, estimateIndex) => {
                  return (
                    <table
                      style={{
                        marginBottom: "30px",
                        borderBottom: "1px solid grey",
                        borderTop: "1px solid grey",
                      }}
                      className="matchingList"
                    >
                      <div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alginItems: "center",
                              borderBottom: "3px double grey",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "1.7em",
                                flexGrow: 1,
                                paddingLeft: "30px",
                                paddingRight: "-70px",
                                paddingTop: "20px",
                                display: "inline-block",
                              }}
                            >
                              -견적서{estimateIndex + 1}-
                            </div>
                            <div
                              style={{
                                paddingLeft: "-70px",
                              }}
                            >
                              {estimatesPaymentStatus?.[estimateIndex] && estimatesPaymentStatus?.[estimateIndex]?.paymentStatus === "paid" ? (
                                <div
                                  style={{
                                    width: "140px",
                                    marginTop: "15px",
                                    paddingTop: "3px",
                                    paddingBottom: "4px",
                                    flexGrow: 1,
                                    borderRadius: "10px",
                                    border: "1px solid green",
                                    fontSize: "1.6em",
                                    textAlign: "center",
                                    backgroundColor: "green",
                                    color: "white",
                                    marginRight: "-8px",
                                  }}
                                >
                                  결제완료!
                                </div>
                              ) : estimatesPaymentStatus?.[estimateIndex] && estimatesPaymentStatus?.[estimateIndex]?.depositStatus === "paid" ? (
                                <div
                                style={{
                                  width: "180px",
                                  marginTop: "15px",
                                  paddingTop: "4px",
                                  paddingBottom: "4px",
                                  flexGrow: 1,
                                  borderRadius: "10px",
                                  border: "1px solid yellow",
                                  fontSize: "1.6em",
                                  textAlign: "center",
                                  backgroundColor: "yellow",
                                  color: "black",
                                  marginRight: "-8px",
                                }}
                              >
                                계약금 결제 완료!
                              </div>
                              ) : estimatesPaymentStatus?.[estimateIndex] && estimatesPaymentStatus?.[estimateIndex]?.depositStatus !== "paid" ? (
                                <div
                                  style={{
                                    width: "140px",
                                    marginTop: "15px",
                                    paddingTop: "4px",
                                    paddingBottom: "4px",
                                    flexGrow: 1,
                                    borderRadius: "10px",
                                    border: "1px solid red",
                                    fontSize: "1.6em",
                                    textAlign: "center",
                                    backgroundColor: "red",
                                    color: "white",
                                    marginRight: "-8px",
                                  }}
                                >
                                  미결제
                                </div>
                              ) : null}
                            </div>
                            <div>
                              <button
                                className="plannerMatchingBtn"
                                style={{ width: "140px" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/estimatedetail/${estimate.id}`);
                                }}
                              >
                                견적서보기
                              </button>
                            </div>
                          </div>
                        </div>

                        {estimate?.plannerProfiles?.map((profile, profileIndex) => {
                            return (
                              <div style={{ display: "flex" }}>
                                <div
                                  className="myPlannerName"
                                  style={{
                                    width: 234,
                                    fontSize: "1.6em",
                                    paddingLeft: "15px",
                                    paddingTop: "10px",
                                    marginRight: 0,
                                  }}
                                >
                                  {profile.plannerName}
                                  {JSON.parse(estimate?.userMatching).includes(profile.plannerEmail)? 
                                  estimatesPaymentStatus?.[estimateIndex]? 
                                  estimatesPaymentStatus?.[estimateIndex].depositStatus === "paid"?
                                  <div
                                  style={{
                                    fontSize: "0.8em",
                                    color: "red",
                                    display: "inline-block",
                                    width: "120px",
                                  }}
                                >
                                  <img
                                    src={heartIcon}
                                    alt=""
                                    style={{
                                      width: "55px",
                                      height: "55px",
                                    }}
                                  />
                                  짝이에요!
                                </div>:
                                  <div
                                  style={{
                                    fontSize: "0.8em",
                                    color: "red",
                                    display: "inline-block",
                                    width: "120px",
                                  }}
                                >
                                  <img
                                    src={starIcon}
                                    alt=""
                                    style={{
                                      width: "55px",
                                      height: "55px",
                                    }}
                                  />
                                  짝이에요!
                                </div>:null
                                :null}
                                </div>
                                <div style={{ marginLeft: "-10px" }}>
                                  <button
                                    style={{
                                      width: "140px",
                                      marginRight: "-8px",
                                    }}
                                    className="plannerMatchingBtn"
                                    data-bs-planner={JSON.stringify(profile)}
                                    onClick={goPlannerProfile}
                                  >
                                    프로필 보기
                                  </button>
                                </div>
                                <div>
                                  {estimatesPaymentStatus?.[estimateIndex] && estimatesPaymentStatus?.[estimateIndex]?.paymentStatus === "paid" ? (
                                    <button
                                      style={{ width: "140px" }}
                                      className="plannerMatchingBtn"
                                      data-bs-estimate={JSON.stringify(estimate)}
                                      onClick={writeReview}
                                    >
                                      리뷰쓰기
                                    </button>
                                  ) : (
                                    <button
                                      style={{ width: "140px" }}
                                      className="plannerMatchingBtn"
                                      data-bs-toggle="modal"
                                      data-bs-target="#MatchOrCancel"
                                      data-bs-estimate={JSON.stringify(estimate)}
                                      data-bs-profile={JSON.stringify(profile)}
                                      onClick={matchOrDeletePlanner}
                                    >
                                      매칭/거절
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                        })}
                      </div>
                    </table>
                  );
                })
              ) : (
                <div
                  style={{
                    marginTop: "20px",
                    height: "20px",
                    fontSize: "1.5em",
                    paddingLeft: "140px",
                    marginBottom: "60px",
                  }}
                >
                  아직 매칭 요청한 플래너가 없습니다.
                </div>
              )}

              <Footer />
            </div>
            <div
              className="modal fade"
              id="CancelMatching"
              tabindex="-1"
              aria-labelledby="CancelMatching"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-2" id="CancelMatching">
                      매칭을 취소하시겠습니까?
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body" style={{ fontSize: "1.5em" }}>
                    매칭을 취소하실경우 해당 플래너에게 지불한 계약금은 환불되지
                    않습니다
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={CancelMatching}
                    >
                      매칭 취소하기
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      매칭 유지하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="MatchOrCancel"
              tabindex="-1"
              aria-labelledby="MatchOrCancel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-2" id="CancelMatching">
                      해당 플래너와 매칭하시겠습니까?
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body" style={{ fontSize: "1.5em" }}>
                    매칭시 다른플래너들의 요청은 모두 거절되고 계약금 결제
                    페이지로 이동합니다.
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={goMatchingPlanner}
                    >
                      매칭하기
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      ref={deleteBtn}
                      onClick={confirmDeleteMatchingPlanner}
                    >
                      거절하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height: "150px" }}></div>
          </div>
        ) : (
          <div style={{ minHeight: "100vh", height: "100%" }}>
            <p
              className="headertxt"
              style={{
                marginTop: "80px",
                fontSize: "1.7em",
                paddingBottom: "25px",
                paddingTop: "25px",
                borderBottom: "3px dashed grey",
                borderTop: "3px dashed grey",
                marginBottom: "30px",
              }}
            >
              매칭된 고객
            </p>

            {matchedUsers.length !== 0 ? (
              matchedUsers.map((estimate, estimateIndex) => {
                return (
                  <div>
                    <div
                      className="matchingList"
                      style={{
                        marginBottom: "30px",
                        borderBottom: "1px solid grey",
                        borderTop: "1px solid grey",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          borderBottom: "3px double grey",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.7em",
                            flexGrow: 1,
                            paddingLeft: "40px",
                            paddingTop: "20px",

                            paddingBottom: "20px",
                            display: "flex",
                          }}
                        >
                          -견적서{estimateIndex + 1}-
                        </div>
                        {paymentStatus?.[estimateIndex]?.paymentStatus === "paid" ? (
                          <div
                            style={{
                              display: "inline-block",
                              width: "150px",
                              height: "44px",
                              borderRadius: "10px",
                              border: "1px solid green",
                              fontSize: "1.6em",
                              textAlign: "center",
                              backgroundColor: "green",
                              color: "white",
                              marginTop: "15px",
                              marginRight: "20px",
                              paddingTop: "2px",
                            }}
                          >
                            결제완료!
                          </div>
                        ) : paymentStatus?.[estimateIndex]?.depositStatus === "paid" ? (
                          <div
                          style={{
                            display: "inline-block",
                            width: "180px",
                            height: "44px",
                            borderRadius: "10px",
                            border: "1px solid yellow",
                            fontSize: "1.6em",
                            textAlign: "center",
                            backgroundColor: "yellow",
                            color: "black",
                            marginTop: "15px",
                            marginRight: "20px",
                            paddingTop: "2px",
                          }}
                        >
                          계약금 결제 완료!
                        </div>
                          
                        ) : paymentStatus?.[estimateIndex]?.depositStatus !== "paid" ? (
                          <div
                          style={{
                            display: "inline-block",
                            width: "150px",
                            height: "44px",
                            borderRadius: "10px",
                            border: "1px solid red",
                            fontSize: "1.6em",
                            textAlign: "center",
                            backgroundColor: "red",
                            color: "white",
                            marginTop: "15px",
                            marginRight: "20px",
                            paddingTop: "2px",
                          }}
                        >
                          미결제
                        </div>
                        ) : null}
                      </div>

                      <p
                        className="myPlannerName"
                        style={{
                          fontSize: "1.6em",
                          marginLeft: "150px",
                          marginRight: "-170px",
                        }}
                      >
                        {estimate?.user?.name}
                        {paymentStatus?.[estimateIndex]?.depositStatus === "paid"? 
                        <img
                            src={heartIcon}
                            alt=""
                            style={{
                              width: "55px",
                              height: "55px",
                              marginLeft: "14px",
                            }}
                          />: 
                          <img
                          src={starIcon}
                          alt=""
                          style={{
                            width: "55px",
                            height: "55px",
                            marginLeft: "14px",
                          }}
                        />}
                      </p>
                      <button
                        className="plannerProBtn"
                        data-bs-estimateNum={estimate.id}
                        onClick={() => {
                          navigate(
                            `/estimatedetail/${estimate.id}`
                          );
                        }}
                      >
                        견적서 보기
                      </button>
                      <br />
                      <div
                        className="matchingBtnList"
                        style={{ paddingLeft: "100px", paddingBottom: "10px" }}
                      >
                        {paymentStatus?.[estimateIndex] && paymentStatus?.[estimateIndex]?.paymentStatus === "paid" ? (
                          <button
                            className="plannerMatchingBtn"
                            data-bs-estimateNum={estimate.id}
                            onClick={() => {
                              alert(
                                `결제 완료한 고객과는 매칭 취소가 불가합니다!`
                              );
                            }}
                          >
                            매칭취소
                          </button>
                        ) : (
                          <button
                            className="plannerMatchingBtn"
                            data-bs-toggle="modal"
                            data-bs-target="#CancelMatchingCustomer"
                            data-bs-estimate={JSON.stringify(estimate)}
                            onClick={CancelMatchingModal}
                          >
                            매칭취소
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  marginTop: "20px",
                  height: "20px",
                  fontSize: "1.5em",
                  paddingLeft: "160px",
                  marginBottom: "60px",
                }}
              >
                아직 매칭된 고객이 없습니다.
              </div>
            )}

            <p
              className="headertxt"
              style={{
                fontSize: "1.7em",
                borderBottom: "3px dashed grey",
                borderTop: "3px dashed grey",
                paddingBottom: "25px",
                paddingTop: "25px",
                marginBottom: "30px",
              }}
            >
              매칭 요청 온 고객 목록
            </p>
            {userEstimates.length !== 0 ? (
              userEstimates.map((estimate, estimateIndex) => {
                return (
                  <div
                    className="matchingList"
                    style={{
                      marginBottom: "30px",
                      borderBottom: "1px solid grey",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          borderTop: "1px solid grey",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            borderBottom: "3px double grey",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1.7em",
                              width: "150px",
                              paddingLeft: "30px",
                              paddingTop: "24px",
                              flexGrow: 1,
                              height: "80px",
                            }}
                          >
                            -견적서{estimateIndex + 1}-
                          </div>
                          <div
                            style={{
                              paddingLeft: "-70px",
                            }}
                          >
                            {estimatesPaymentStatus?.[estimateIndex] && estimatesPaymentStatus?.[estimateIndex].paymentStatus === "paid" ? (
                              <div
                                style={{
                                  width: "150px",
                                  marginTop: "15px",
                                  paddingTop: "4px",

                                  height: "47px",
                                  flexGrow: 1,
                                  borderRadius: "10px",
                                  border: "1px solid green",
                                  fontSize: "1.6em",
                                  textAlign: "center",
                                  backgroundColor: "green",
                                  color: "white",
                                  marginRight: "-5px",
                                  marginLeft: "70px",
                                }}
                              >
                                결제완료!
                              </div>
                            ) : estimatesPaymentStatus?.[estimateIndex] && estimatesPaymentStatus?.[estimateIndex].depositStatus === "paid" ? (
                              <div
                              style={{
                                width: "180px",
                                marginTop: "15px",
                                paddingTop: "4px",

                                height: "47px",
                                flexGrow: 1,
                                borderRadius: "10px",
                                border: "1px solid yellow",
                                fontSize: "1.6em",
                                textAlign: "center",
                                backgroundColor: "yellow",
                                color: "black",
                                marginRight: "-5px",
                                marginLeft: "40px",
                              }}
                            >
                              계약금 결제 완료!
                            </div>
                            ) :  estimatesPaymentStatus?.[estimateIndex] && estimatesPaymentStatus?.[estimateIndex].depositStatus !== "paid" ? (
                              <div
                                style={{
                                  width: "150px",
                                  marginTop: "15px",
                                  paddingTop: "4px",
                                  height: "47px",
                                  flexGrow: 1,
                                  borderRadius: "10px",
                                  border: "1px solid red",
                                  fontSize: "1.6em",
                                  textAlign: "center",
                                  backgroundColor: "red",
                                  color: "white",
                                  marginRight: "-5px",
                                  marginLeft: "70px",
                                }}
                              >
                                미결제
                              </div>
                            ) : null}
                          </div>
                          <div style={{ marginRight: "8px" }}>
                            <button
                              className="plannerMatchingBtn"
                              data-bs-id={estimate.id}
                              onClick={goToEstimate}
                            >
                              견적서 보기
                            </button>
                          </div>
                        </div>
                        <div>
                          <div
                            className="myPlannerName"
                            style={{
                              width: 250,
                              fontSize: "1.6em",
                              paddingLeft: "25px",
                              paddingTop: "10px",
                              marginRight: 0,
                              flexGrow: 1,
                            }}
                          >
                            {estimate.user.name}
                            {JSON.parse(estimate?.userMatching).includes(loggedInEmail)? 
                                  estimatesPaymentStatus?.[estimateIndex] ?
                                  estimatesPaymentStatus?.[estimateIndex].depositStatus === "paid"? 
                                  <div
                                  style={{
                                    fontSize: "0.8em",
                                    color: "red",
                                    display: "inline-block",
                                    width: "120px",
                                  }}
                                >
                                  <img
                                    src={heartIcon}
                                    alt=""
                                    style={{
                                      width: "55px",
                                      height: "55px",
                                    }}
                                  />
                                  짝이에요!
                                </div>: <div
                                  style={{
                                    fontSize: "0.8em",
                                    color: "red",
                                    display: "inline-block",
                                    width: "120px",
                                  }}
                                >
                                  <img
                                    src={starIcon}
                                    alt=""
                                    style={{
                                      width: "55px",
                                      height: "55px",
                                    }}
                                  />
                                  짝이에요!
                                </div>
                                  :null
                                 :null}
                          </div>
                          {paymentStatus?.[estimateIndex] && paymentStatus?.[estimateIndex]?.paymentStatus === "paid" ? (
                            <button
                              style={{ width: "150px", marginLeft: "120px" }}
                              className="plannerMatchingBtn"
                              onClick={() => {
                                alert(
                                  `결제 완료한 고객과는 매칭 취소가 불가합니다!`
                                );
                              }}
                            >
                              매칭/거절
                            </button>
                          ) : (
                            <button
                              className="plannerMatchingBtn"
                              data-bs-toggle="modal"
                              data-bs-target="#MatchOrCancelCustomer"
                              data-bs-estimate={JSON.stringify(estimate)}
                              onClick={matchOrDeleteUser}
                              style={{ width: "150px", marginLeft: "120px" }}
                            >
                              매칭/거절
                            </button>
                          )}
                        </div>
                      </div>
                    </table>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  marginTop: "20px",
                  height: "20px",
                  fontSize: "1.5em",
                  paddingLeft: "145px",
                  marginBottom: "60px",
                }}
              >
                아직 매칭 요청한 고객이 없습니다.
              </div>
            )}

            <div style={{ height: "150px" }}></div>
            <Footer />
            {/* 고객 모달창(매칭취소) */}
            <div
              className="modal fade"
              id="CancelMatchingCustomer"
              tabindex="-1"
              aria-labelledby="CancelMatchingCustomer"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-2"
                      id="CancelMatchingCustomer"
                      style={{ fontSize: "1.6em" }}
                    >
                      매칭을 취소하시겠습니까?
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body" style={{ fontSize: "1.5em" }}>
                    매칭을 취소하실경우 해당 고객과의 매칭이 거부됩니다.
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={CancelMatching}
                    >
                      매칭 취소하기
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      매칭 유지하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="MatchOrCancelCustomer"
              tabindex="-1"
              aria-labelledby="MatchOrCancelCustomer"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-2"
                      id="MatchOrCancelCustomer"
                      style={{ fontSize: "1.6em" }}
                    >
                      해당 고객과 매칭하시겠습니까?
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body" style={{ fontSize: "1.5em" }}>
                    매칭시 해당 고객에게 매칭 메시지가 전송 됩니다.
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={goMatchingUser}
                      data-bs-dismiss="modal"
                    >
                      매칭하기
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={confirmDeleteMatchingUser}
                    >
                      거절하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 고객과의 매칭/거절 모달창 */}
          </div>
        )}
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}

export default Matching;
