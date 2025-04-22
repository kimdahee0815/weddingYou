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

  const [plannerMatching, setPlannerMatching] = useState([]);
  const [estimateCount, setEstimateCount] = useState([]);
  const [plannerName, setPlannerName] = useState("");
  const [plannerData, setPlannerData] = useState([]);
  const [count, setCount] = useState([]);
  const [deletedPlanner, setDeletedPlanner] = useState(false);
  const [deletePermission, setDeletePermission] = useState(false);
  const [bsIndex, setBsIndex] = useState(0);
  const [bsIndex2, setBsIndex2] = useState(0);
  const [deleteTargetEstimateId, setDeleteTargetEstimateId] = useState(0);
  const [deletePlanner, setDeletePlanner] = useState("");
  const [matchedPlanner, setMatchedPlanner] = useState([]);
  const [deletePlannerName, setDeletePlannerName] = useState(null);
  const [estimateNum, setEstimateNum] = useState([]);
  const [matchedKeyIndex, setMatchedKeyIndex] = useState([]);
  const [selectEstimateNum, setSelectEstimateNum] = useState(0);
  const [selectDeletePlanner, setSelectDeletePlanner] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedEstimateId, setSelectedEstimateId] = useState(0);
  const [cancelledUser, setCancelledUser] = useState(false);
  const [matchedUser, setMatchedUser] = useState(false);

  const [searchedMatchedUser, setSearchedMatchedUser] = useState([]);
  const [searchedEstimateId, setSearchedEstimateId] = useState([]);
  const [searchedUserKeyIndex, setSearchedUserKeyIndex] = useState([]);

  const [selectedEstimateId2, setSelectedEstimateId2] = useState(0);
  const [selectedEstimateNum, setSelectedEstimateNum] = useState(0);
  const [estimateOrder, setEstimateOrder] = useState([]);

  const deleteBtn = useRef();

  const [userName, setUserName] = useState([]);
  const [userEmail, setUserEmail] = useState([]);
  const [userEstimateId, setUserEstimateId] = useState([]);
  const [userIndex, setUserIndex] = useState([]);

  const [matchingCouple, setMatchingCouple] = useState([]);
  const [estimateOrder2, setEstimateOrder2] = useState([]);
  const [estimateOrder3, setEstimateOrder3] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [paymentStatus2, setPaymentStatus2] = useState([]);
  const [paymentStatus3, setPaymentStatus3] = useState([]);

  const [allprice, setAllPrice] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("category") === "user") {
      //user일 경우
      var plannerMatchingArr = [];
      var estimateCountArr = [];
      var dataArr = [];
      var countArr = [];

      const fetchData1 = async () => {
        try {
          const res = await axios.get(`/estimate/getuserdetail`, {
            params: { userEmail: sessionStorage.getItem("email") },
          });

          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              let temp = [];
              const arr = JSON.parse(res.data[i].plannermatching);
              plannerMatchingArr.push(arr);
              estimateCountArr.push(i);
              dataArr.push(res.data[i]);
              if (arr === undefined || arr === null) {
              }
              for (let j = 0; j < arr.length; j++) {
                temp.push(j);
              }
              countArr.push(temp);
            }

            axios
              .get(`/estimate/getPlannerName`, {
                params: { userEmail: sessionStorage.getItem("email") },
              })
              .then((res) => {
                setPlannerName(res.data);
              })
              .catch((e) => {
                console.log(e);
              });

            setPlannerData(dataArr);
            setPlannerMatching(plannerMatchingArr);
            setEstimateCount(estimateCountArr);
            setCount(countArr);
          } else {
            setErrorMessage(true);
            if (errorMessage === false) {
            }
          }
        } catch (e) {
          console.log(e);
        }
      };
      fetchData1();
    } else {
      //planner일 경우
    }
  }, [deletedPlanner, matchedPlanner]);

  const deleteMatchingPlanner = (e) => {
    e.preventDefault();

    const bsIndex = e.target.dataset.bsIndex;
    const bsIndex2 = e.target.dataset.bsIndex2;
    const estimateId = e.target.dataset.bsEstimateid;
    const deleteTargetEstimateId = estimateId;
    const bsEstimateNum = e.target.dataset.bsEstimatenum - 1;
    const deletePlanner = plannerMatching[bsIndex][bsIndex2];
    const deletePlannerName = plannerName[bsIndex][bsIndex2];
    setBsIndex(bsIndex);
    setBsIndex2(bsIndex2);
    setDeleteTargetEstimateId(deleteTargetEstimateId);
    setDeletePlanner(deletePlanner);
    setDeletePlannerName(deletePlannerName);
    setSelectEstimateNum(bsEstimateNum);
    setSelectDeletePlanner(matchedPlanner[bsEstimateNum]);
    console.log(deleteTargetEstimateId);
  };

  const deleteMatchingPlanner2 = () => {
    const formData = new FormData();
    formData.append("deleteTargetEstimateId", deleteTargetEstimateId);

    formData.append("deletePlanner", deletePlanner);
    axios
      .post(`/estimate/deleteMatchingPlanner`, formData)
      .then((res) => {
        setDeletedPlanner(!deletedPlanner);

        if (res.data === 2) {
          setDeletedPlanner(!deletedPlanner);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const goMatching = () => {
    const formData = new FormData();
    formData.append("targetEstimateId", deleteTargetEstimateId);
    formData.append("matchingPlanner", deletePlanner);
    formData.append("userEmail", sessionStorage.getItem("email"));

    axios
      .post(`/estimate/matching`, formData)
      .then((res) => {
        const userName = res.data.slice(0, res.data.indexOf("/"));
        const userPhone = res.data.slice(
          res.data.indexOf("/") + 1,
          res.data.indexOf("]")
        );
        const plannerEmail = res.data.slice(
          res.data.indexOf("]") + 1,
          res.data.indexOf("[")
        );
        const plannerName = res.data.slice(
          res.data.indexOf("[") + 1,
          res.data.indexOf(",")
        );
        const depositprice = res.data.slice(
          res.data.indexOf(",") + 1,
          res.data.indexOf("*")
        );
        const plannerImg = res.data.slice(
          res.data.indexOf("*") + 1,
          res.data.length
        );
        let plannerImgUrl = "data:image/jpeg;base64," + plannerImg;

        navigate("/checkoutdeposit", {
          state: {
            estimateId: deleteTargetEstimateId,
            userName: userName,
            userPhone: userPhone,
            planneremail: plannerEmail,
            plannerName: plannerName,
            depositprice: depositprice,
            plannerImg: plannerImgUrl,
          },
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("userEmail", sessionStorage.getItem("email"));
    axios
      .post(`/estimate/getMatchedPlanner`, formData)
      .then((res) => {
        if (res.data !== "") {
          var splitData = res.data.slice(0, res.data.length - 1);
          var matchedPlanners = splitData.split("|");
          var matchedPlannerNameArr = [];
          var matchedPlannerEstimateNumArr = [];
          var keyIndexArr = [];
          let keyIndex = 0;

          for (var i = 0; i < matchedPlanners.length; i++) {
            const matchedPlanner = matchedPlanners[i];
            const index = matchedPlanner.indexOf("/");
            matchedPlannerNameArr.push(matchedPlanner.slice(0, index));
            matchedPlannerEstimateNumArr.push(
              matchedPlanner.slice(index + 1, res.data.length)
            );

            keyIndexArr.push(keyIndex);
            keyIndex++;
          }
          setMatchedPlanner(matchedPlannerNameArr);
          setEstimateNum(matchedPlannerEstimateNumArr);
          setMatchedKeyIndex(keyIndexArr);
        } else {
          setMatchedKeyIndex([]);
          setMatchedPlanner([]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [deletedPlanner]);

  const CancelMatching = () => {
    const formData = new FormData();
    formData.append("userEmail", sessionStorage.getItem("email"));
    formData.append("deleteTargetEstimateId", deleteTargetEstimateId);
    axios
      .post(`/estimate/cancelMatchedPlanner`, formData)
      .then((res) => {
        setDeletedPlanner(!deletedPlanner);
        //setMatchedPlanner(null);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const CancelMatching2 = (e) => {
    const estimateNum = e.target.dataset.bsEstimatenum - 1;
    setSelectEstimateNum(estimateNum);
  };

  const CancelMatching3 = (e) => {
    const formData = new FormData();
    formData.append("userEmail", sessionStorage.getItem("email"));
    formData.append("estimateNum", selectEstimateNum);
    axios
      .post(`/estimate/cancelMatchedPlanner2`, formData)
      .then((res) => {
        setDeletedPlanner(!deletedPlanner);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const goPay = (e) => {
    const estimateNum = e.target.dataset.bsEstimatenum - 1;
    setSelectEstimateNum(estimateNum);
    console.log("estimateNum:" + estimateNum);
    const formData = new FormData();
    formData.append("userEmail", sessionStorage.getItem("email"));
    formData.append("estimateNum", estimateNum);

    axios
      .post(`/deposit/check`, formData)
      .then((res) => {
        console.log(res);
        const data = res.data;
        if (data != 1 && data != -1) {
          const lastIndex = data.lastIndexOf("[");
          const status = res.data.slice(lastIndex + 1, res.data.length);
          console.log(status);
          if (status === "paid") {
            //paid
            const estimateId = res.data.slice(0, res.data.indexOf("*"));
            console.log(estimateId);
            const userName = res.data.slice(
              res.data.indexOf("*") + 1,
              res.data.indexOf("/")
            );
            console.log(userName);
            const userPhone = res.data.slice(
              res.data.indexOf("/") + 1,
              res.data.indexOf("]")
            );
            console.log(userPhone);
            const plannerEmail = res.data.slice(
              res.data.indexOf("]") + 1,
              res.data.indexOf("[")
            );
            console.log(plannerEmail);
            const plannerName = res.data.slice(
              res.data.indexOf("[") + 1,
              res.data.indexOf(",")
            );
            console.log(plannerName);
            const depositprice = res.data.slice(
              res.data.indexOf(",") + 1,
              res.data.lastIndexOf("*")
            );
            const plannerImg = res.data.slice(
              res.data.lastIndexOf("*") + 1,
              res.data.lastIndexOf("[")
            );

            console.log(plannerImg);
            let plannerImgUrl = "data:image/jpeg;base64," + plannerImg;

            navigate("/checkoutall", {
              state: {
                estimateId: estimateId,
                userName: userName,
                userPhone: userPhone,
                planneremail: plannerEmail,
                plannerName: plannerName,
                plannerImg: plannerImgUrl,
                depositprice: depositprice,
                allprice: allprice,
              },
            });
          } else if (res.data === -1) {
            //오류
            alert("오류 발생!");
          } else if (status === "deposit") {
            //cancelled, other
            const estimateId = res.data.slice(0, res.data.indexOf("*"));
            const userName = res.data.slice(
              res.data.indexOf("*") + 1,
              res.data.indexOf("/")
            );
            const userPhone = res.data.slice(
              res.data.indexOf("/") + 1,
              res.data.indexOf("]")
            );
            const plannerEmail = res.data.slice(
              res.data.indexOf("]") + 1,
              res.data.indexOf("[")
            );
            const plannerName = res.data.slice(
              res.data.indexOf("[") + 1,
              res.data.indexOf(",")
            );
            const depositprice = res.data.slice(
              res.data.indexOf(",") + 1,
              res.data.lastIndexOf("*")
            );
            const plannerImg = res.data.slice(
              res.data.lastIndexOf("*") + 1,
              res.data.lastIndexOf("[")
            );

            let plannerImgUrl = "data:image/jpeg;base64," + plannerImg;

            navigate("/checkoutdeposit", {
              state: {
                estimateId: estimateId,
                userName: userName,
                userPhone: userPhone,
                planneremail: plannerEmail,
                plannerName: plannerName,
                plannerImg: plannerImgUrl,
                depositprice: depositprice,
              },
            });
          }
        } else if (data == 1) {
          alert("결제가 모두 완료된 상태입니다!");
        }
      })
      .catch((e) => {
        console.log(e);
      });
    //navigate(`/checkoutall`);
  };

  const goPlannerProfile = (e) => {
    const bsIndex = e.target.dataset.bsIndex;
    const bsIndex2 = e.target.dataset.bsIndex2;
    const estimateId = e.target.dataset.bsEstimateid;
    const deleteTargetEstimateId = estimateId;
    const bsEstimateNum = e.target.dataset.bsEstimatenum - 1;
    const selectedPlanner = plannerMatching[bsIndex][bsIndex2];
    const selectedPlannerName = plannerName[bsIndex][bsIndex2];
    setBsIndex(bsIndex);
    setBsIndex2(bsIndex2);
    setDeleteTargetEstimateId(deleteTargetEstimateId);
    setDeletePlanner(selectedPlanner);
    setDeletePlannerName(selectedPlannerName);
    setSelectEstimateNum(bsEstimateNum);
    setSelectDeletePlanner(matchedPlanner[bsEstimateNum]);
    axios
      .post(`/planner/getprofileImg`, { email: selectedPlanner })
      .then((res) => {
        console.log(res);

        let selectedPlannerImg = "data:image/jpeg;base64," + res.data;
        navigate(`/plannerprofiledetail`, {
          state: {
            plannerEmail: selectedPlanner,
            plannerName: selectedPlannerName,
            plannerImg: selectedPlannerImg,
          },
        });
      })
      .catch((e) => {
        console.log(e);

        navigate(`/plannerprofiledetail`, {
          state: {
            plannerEmail: selectedPlanner,
            plannerName: selectedPlannerName,
            plannerImg: defaultprofileimage,
          },
        });
      });
  };

  const goPlannerProfile2 = (e) => {
    const estimateNum = e.target.dataset.bsEstimatenum - 1;
    setSelectEstimateNum(estimateNum);
    console.log("estimateNum:" + estimateNum);
    const formData = new FormData();
    formData.append("userEmail", sessionStorage.getItem("email"));
    formData.append("estimateNum", estimateNum);
    axios.post(`/plannerProfile/getProfileDetail2`, formData).then((res) => {
      console.log(res);
      const data = res.data;

      if (data.length !== 0) {
        let selectedPlannerImg = null;
        let selectedPlanner = null;
        let selectedPlannerName = null;
        for (let j = 0; j < data.length; j++) {
          if (j % 3 === 0) {
            if (data[j] === "null") {
              selectedPlannerImg = defaultprofileimage;
            } else {
              let img = "data:image/jpeg;base64," + data[j];
              selectedPlannerImg = img;
            }
          } else if (j % 3 === 1) {
            selectedPlannerName = data[j];
          } else if (j % 3 === 2) {
            selectedPlanner = data[j];
          }
        }
        navigate(`/plannerprofiledetail`, {
          state: {
            plannerEmail: selectedPlanner,
            plannerName: selectedPlannerName,
            plannerImg: selectedPlannerImg,
          },
        });
      }
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("category") === "planner") {
      const formData = new FormData();
      formData.append("plannerEmail", sessionStorage.getItem("email"));
      axios
        .post(`/plannerProfile/getmatchingUser`, formData)
        .then((res) => {
          console.log(res);
          const userNameArr = [];
          const userEmailArr = [];
          const userEstimateIdArr = [];
          const userIndexArr = [];
          if (res.data.length === 0) {
            setUserIndex([]);
          } else {
            const data = res.data;
            for (let i = 0; i < data.length; i++) {
              if (i % 3 === 0) {
                userNameArr.push(data[i]);
                const num = i / 3;
                userIndexArr.push(num);
              } else if (i % 3 === 1) {
                userEmailArr.push(data[i]);
              } else if (i % 3 === 2) {
                userEstimateIdArr.push(data[i]);
              }
            }
            setUserName(userNameArr);
            setUserEmail(userEmailArr);
            setUserEstimateId(userEstimateIdArr);
            console.log(userIndexArr);
            setUserIndex(userIndexArr);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [cancelledUser]);

  const goToEstimate = (e) => {
    const estimateId = e.target.dataset.bsIndex;
    navigate(`/estimatedetail/${estimateId}`);
  };

  const cancelMatchedUser = (e) => {
    console.log(e.target.dataset);
    const userEmail = e.target.dataset.bsUseremail;
    const estimateId = e.target.dataset.bsIndex;
    const estimateNum = e.target.dataset.bsEstimatenum;
    setSelectedUserEmail(userEmail);
    setSelectedEstimateId(estimateId);
    setSelectedEstimateNum(estimateNum);
  };

  const cancelMatchedUser2 = (e) => {
    const formData = new FormData();

    formData.append("plannerEmail", sessionStorage.getItem("email"));
    formData.append("estimateId", selectedEstimateId);
    axios
      .post(`/plannerProfile/cancelMatchingUser`, formData)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          alert("해당 고객과의 매칭이 취소되었습니다!");
          setCancelledUser(!cancelledUser);
        } else {
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const goMatchingUser = (e) => {
    const formData = new FormData();
    formData.append("plannerEmail", sessionStorage.getItem("email"));
    formData.append("estimateId", selectedEstimateId);
    axios
      .post(`/plannerProfile/matchingUser`, formData)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          alert("해당 고객과 매칭되었습니다!");
          setMatchedUser(!matchedUser);
        } else {
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (sessionStorage.getItem("category") === "planner") {
      const formData = new FormData();
      formData.append("plannerEmail", sessionStorage.getItem("email"));
      axios
        .post(`/plannerProfile/getMatchedUser`, formData)
        .then((res) => {
          console.log(res);
          const data = res.data;
          const searchedUserArr = [];
          const searchedEstimateIdArr = [];
          const searchedUserKeyIndexArr = [];
          const estimateOrderArr = [];
          if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
              if (i % 3 === 0) {
                searchedEstimateIdArr.push(data[i]);
                const num = i / 3;
                searchedUserKeyIndexArr.push(num);
              } else if (i % 3 === 1) {
                searchedUserArr.push(data[i]);
              } else if (i % 3 === 2) {
                estimateOrderArr.push(data[i]);
              }
            }
            setSearchedMatchedUser(searchedUserArr);
            setSearchedEstimateId(searchedEstimateIdArr);
            setSearchedUserKeyIndex(searchedUserKeyIndexArr);
            setEstimateOrder(estimateOrderArr);
          } else {
            setSearchedUserKeyIndex([]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [matchedUser, cancelledUser]);

  const cancelMatchingUser2 = (e) => {
    console.log(e.target.dataset);
    const estimateId = e.target.dataset.bsEstimatenum;
    setSelectedEstimateId2(estimateId);
  };

  const cancelMatchingUser3 = () => {
    const formData = new FormData();
    formData.append("estimateId", selectedEstimateId2);
    formData.append("plannerEmail", sessionStorage.getItem("email"));
    axios
      .post(`/plannerProfile/cancelMatchingUser`, formData)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          alert("해당 고객과의 매칭이 취소되었습니다!");
          setCancelledUser(!cancelledUser);
        } else {
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
      .post(`/estimate/findMatching`, formData)
      .then((res) => {
        console.log(res);
        const data = res.data;
        if (data.length !== 0) {
          const matchArr = [];
          const estimateOrderArr2 = [];
          const estimateOrderArr3 = [];
          if (sessionStorage.getItem("category") === "user") {
            for (let i = 0; i < data.length; i++) {
              if (i % 2 === 0) {
                matchArr.push(JSON.parse(data[i]));
              } else if (i % 2 === 1) {
                estimateOrderArr2.push(data[i]);
              }
            }
            if (sessionStorage.getItem("category") === "user") {
              const formData2 = new FormData();
              formData2.append("email", sessionStorage.getItem("email"));
              formData2.append("category", sessionStorage.getItem("category"));
              formData2.append("estimateNum", estimateOrderArr2);
              const paymentStatusArr = [];
              axios
                .post(`/paymentStatus`, formData2)
                .then((res) => {
                  console.log(res);
                  const data = res.data;
                  for (let i = 0; i < data.length; i++) {
                    paymentStatusArr.push(data[i]);
                  }
                  setPaymentStatus(paymentStatusArr);
                  setPaymentStatus2([]);
                })
                .catch((e) => {
                  console.log(e);
                });
            }

            setMatchingCouple(matchArr);
            setEstimateOrder2(estimateOrderArr2);
          } else if (sessionStorage.getItem("category") === "planner") {
            for (let i = 0; i < data.length; i++) {
              estimateOrderArr2.push(data[i]);
              if (data[i] != -1) {
                estimateOrderArr3.push(data[i]);
              }
            }
            if (sessionStorage.getItem("category") === "planner") {
              const formData2 = new FormData();
              formData2.append("email", sessionStorage.getItem("email"));
              formData2.append("category", sessionStorage.getItem("category"));
              formData2.append("estimateNum", estimateOrderArr2);
              const paymentStatusArr2 = [];
              axios
                .post(`/paymentStatus`, formData2)
                .then((res) => {
                  console.log(res);
                  const data = res.data;
                  for (let i = 0; i < data.length; i++) {
                    paymentStatusArr2.push(data[i]);
                  }
                  setPaymentStatus2(paymentStatusArr2);
                  setPaymentStatus([]);
                })
                .catch((e) => {
                  console.log(e);
                });
            }

            setEstimateOrder2(estimateOrderArr2);
            setEstimateOrder3(estimateOrderArr3);
          }
        } else {
          setMatchingCouple([]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [matchedUser, cancelledUser, deletedPlanner]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("email", sessionStorage.getItem("email"));
    formData.append("category", sessionStorage.getItem("category"));

    const paymentStatusArr2 = [];
    axios
      .post(`/paymentStatus2`, formData)
      .then((res) => {
        console.log(res);
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          paymentStatusArr2.push(data[i]);
        }
        setPaymentStatus3(paymentStatusArr2);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [matchedUser, cancelledUser, deletedPlanner]);

  const writeReview = (e) => {
    const bsIndex = e.target.dataset.bsIndex;
    const bsIndex2 = e.target.dataset.bsIndex2;
    const estimateId = e.target.dataset.bsEstimateid;
    const estimateNum = e.target.dataset.bsEstimatenum - 1;
    const plannerEmail = plannerMatching[bsIndex][bsIndex2];
    const plannername = plannerName[bsIndex][bsIndex2];
    const formData = new FormData();
    formData.append("targetEstimateId", estimateId);
    formData.append("matchingPlanner", plannerEmail);
    formData.append("userEmail", sessionStorage.getItem("email"));

    axios
      .post(`/estimate/review`, formData)
      .then((res) => {
        const userName = res.data.slice(0, res.data.indexOf("/"));
        const userPhone = res.data.slice(
          res.data.indexOf("/") + 1,
          res.data.indexOf("]")
        );
        const plannerEmail = res.data.slice(
          res.data.indexOf("]") + 1,
          res.data.indexOf("[")
        );
        const plannerName = res.data.slice(
          res.data.indexOf("[") + 1,
          res.data.indexOf(",")
        );
        const budget = res.data.slice(
          res.data.indexOf(",") + 1,
          res.data.indexOf("*")
        );
        const plannerImg = res.data.slice(
          res.data.indexOf("*") + 1,
          res.data.length
        );
        let plannerImgUrl = "data:image/jpeg;base64," + plannerImg;

        navigate("/rating", {
          state: {
            estimateId: estimateId,

            planneremail: plannerEmail,
            plannerImg: plannerImgUrl,
            plannerName: plannername,
          },
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const writeReview2 = (e) => {
    const estimateNum = e.target.dataset.bsEstimatenum - 1;
    setSelectEstimateNum(estimateNum);
    console.log("estimateNum:" + estimateNum);
    const formData = new FormData();
    formData.append("userEmail", sessionStorage.getItem("email"));
    formData.append("estimateNum", estimateNum);
    axios.post(`/estimate/review2`, formData).then((res) => {
      console.log(res);
      const data = res.data;

      if (data.length !== 0) {
        let selectedPlannerImg = null;
        let selectedPlanner = null;
        let selectedPlannerName = null;
        let estimateId = null;
        for (let j = 0; j < data.length; j++) {
          if (j % 4 === 0) {
            if (data[j] === "null") {
              selectedPlannerImg = defaultprofileimage;
            } else {
              let img = "data:image/jpeg;base64," + data[j];
              selectedPlannerImg = img;
            }
          } else if (j % 4 === 1) {
            selectedPlannerName = data[j];
          } else if (j % 4 === 2) {
            selectedPlanner = data[j];
          } else if (j % 4 === 3) {
            estimateId = data[j];
          }
        }
        navigate(`/rating`, {
          state: {
            planneremail: selectedPlanner,
            plannerName: selectedPlannerName,
            plannerImg: selectedPlannerImg,
            estimateId: estimateId,
          },
        });
      }
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
              내 플래너
            </p>

            {matchedPlanner.length !== 0 ? (
              matchedKeyIndex.map((keyIndex) => {
                const num = estimateNum[keyIndex] - 1;

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
                          -견적서{estimateNum[keyIndex]}-
                        </div>

                        {paymentStatus[keyIndex] === "all" ? (
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
                        ) : paymentStatus[keyIndex] === "other" ? (
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
                        ) : paymentStatus[keyIndex] === "deposit" ? (
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
                        ) : null}
                      </div>
                      <p
                        className="myPlannerName"
                        style={{
                          fontSize: "1.6em",
                          marginLeft: "120px",
                          marginRight: "-140px",
                        }}
                      >
                        {matchedPlanner[keyIndex]}
                        {estimateOrder2[num] == num ? (
                          <img
                            src={heartIcon}
                            alt=""
                            style={{
                              width: "55px",
                              height: "55px",
                              marginLeft: "14px",
                            }}
                          />
                        ) : null}
                      </p>
                      <button
                        className="plannerProBtn"
                        data-bs-estimateNum={estimateNum[keyIndex]}
                        onClick={goPlannerProfile2}
                      >
                        프로필 보기
                      </button>
                      <br />
                      <div className="matchingBtnList">
                        <button
                          className="plannerMatchingBtn"
                          data-bs-estimateNum={estimateNum[keyIndex]}
                          onClick={goPay}
                          // data-bs-toggle="modal"
                          // data-bs-target="#plannerMatchingPriceModal"
                        >
                          결제하기
                        </button>
                        {console.log("+++++++++++++++++++++++++++")}
                        {console.log(estimateNum[keyIndex])}
                        {paymentStatus[keyIndex] === "all" ? (
                          <button
                            className="plannerMatchingBtn"
                            data-bs-estimateNum={estimateNum[keyIndex]}
                            onClick={writeReview2}
                          >
                            리뷰쓰기
                          </button>
                        ) : (
                          <button
                            className="plannerMatchingBtn"
                            data-bs-toggle="modal"
                            data-bs-target="#CancelMatching"
                            data-bs-estimateNum={estimateNum[keyIndex]}
                            onClick={CancelMatching2}
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
              {estimateCount.length !== 0 ? (
                estimateCount.map((index, keyindex) => {
                  var plannerList = plannerName[index];
                  var estimateId = plannerData[index].id;
                  var plannermatchinglist = JSON.parse(
                    plannerData[index].plannermatching
                  );
                  var order = estimateOrder2[index];
                  var matchingcp = matchingCouple[index];
                  var index = index;
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
                              -견적서{index + 1}-
                            </div>
                            <div
                              style={{
                                paddingLeft: "-70px",
                              }}
                            >
                              {paymentStatus3[index] === "all" ? (
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
                              ) : paymentStatus3[index] === "other" ? (
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
                              ) : paymentStatus3[index] === "deposit" ? (
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
                              ) : null}
                            </div>
                            <div>
                              <button
                                className="plannerMatchingBtn"
                                style={{ width: "140px" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/estimatedetail/${estimateId}`);
                                }}
                              >
                                견적서보기
                              </button>
                            </div>
                          </div>
                        </div>

                        {count[index].map((i) => {
                          try {
                            let plannername = plannerList[i];
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
                                  {plannername}

                                  {matchingcp.length !== 0 && order !== 0 ? (
                                    order == index &&
                                    plannermatchinglist[i] == matchingcp[i] ? (
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
                                      </div>
                                    ) : null
                                  ) : null}
                                </div>
                                <div style={{ marginLeft: "-10px" }}>
                                  <button
                                    style={{
                                      width: "140px",
                                      marginRight: "-8px",
                                    }}
                                    className="plannerMatchingBtn"
                                    data-bs-index={index}
                                    data-bs-index2={i}
                                    data-bs-estimateId={estimateId}
                                    data-bs-estimateNum={index + 1}
                                    onClick={goPlannerProfile}
                                  >
                                    프로필 보기
                                  </button>
                                </div>
                                <div>
                                  {paymentStatus3[index] === "all" ? (
                                    <button
                                      style={{ width: "140px" }}
                                      className="plannerMatchingBtn"
                                      data-bs-index={index}
                                      data-bs-index2={i}
                                      data-bs-estimateId={estimateId}
                                      data-bs-estimateNum={index + 1}
                                      onClick={writeReview}
                                    >
                                      리뷰쓰기
                                    </button>
                                  ) : (
                                    <button
                                      style={{ width: "140px" }}
                                      className="plannerMatchingBtn"
                                      data-bs-toggle="modal"
                                      data-bs-target="#MatchOrCanel"
                                      data-bs-index={index}
                                      data-bs-index2={i}
                                      data-bs-estimateId={estimateId}
                                      data-bs-estimateNum={index + 1}
                                      onClick={deleteMatchingPlanner}
                                    >
                                      매칭/거절
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          } catch (e) {
                            console.log(e);
                          }
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
                      onClick={CancelMatching3}
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
              id="MatchOrCanel"
              tabindex="-1"
              aria-labelledby="MatchOrCanel"
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
                      onClick={goMatching}
                    >
                      매칭하기
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      ref={deleteBtn}
                      onClick={deleteMatchingPlanner2}
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

            {searchedUserKeyIndex.length !== 0 ? (
              searchedUserKeyIndex.map((index) => {
                const num = estimateOrder[index] - 1;
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
                          -견적서{estimateOrder[index]}-
                        </div>
                        {console.log(
                          "ccccccccccccccccccccccccccccccccccccccccc"
                        )}
                        {console.log(paymentStatus2)}
                        {console.log(paymentStatus2[index])}
                        {paymentStatus2[index] === "all" ? (
                          <div
                            style={{
                              display: "inline-block",
                              width: "150px",
                              height: "47px",
                              borderRadius: "10px",
                              border: "1px solid green",
                              fontSize: "1.6em",
                              textAlign: "center",
                              backgroundColor: "green",
                              color: "white",
                              marginTop: "15px",
                              marginRight: "20px",
                              paddingTop: "3px",
                            }}
                          >
                            결제완료!
                          </div>
                        ) : paymentStatus2[index] === "other" ? (
                          <div
                            style={{
                              display: "inline-block",
                              width: "150px",
                              height: "47px",
                              borderRadius: "10px",
                              border: "1px solid red",
                              fontSize: "1.6em",
                              textAlign: "center",
                              backgroundColor: "red",
                              color: "white",
                              marginTop: "15px",
                              marginRight: "20px",
                              paddingTop: "3px",
                            }}
                          >
                            미결제
                          </div>
                        ) : paymentStatus2[index] === "deposit" ? (
                          <div
                            style={{
                              display: "inline-block",
                              width: "180px",
                              height: "47px",
                              borderRadius: "10px",
                              border: "1px solid yellow",
                              fontSize: "1.6em",
                              textAlign: "center",
                              backgroundColor: "yellow",
                              color: "black",
                              marginTop: "15px",
                              marginRight: "20px",
                              paddingTop: "3px",
                            }}
                          >
                            계약금 결제 완료!
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
                        {searchedMatchedUser[index]}
                        {estimateOrder2[estimateOrder[index] - 1] == num ? (
                          <img
                            src={heartIcon}
                            alt=""
                            style={{
                              width: "55px",
                              height: "55px",
                              marginLeft: "14px",
                            }}
                          />
                        ) : null}
                      </p>
                      <button
                        className="plannerProBtn"
                        data-bs-estimateNum={searchedEstimateId[index]}
                        onClick={() => {
                          navigate(
                            `/estimatedetail/${searchedEstimateId[index]}`
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
                        {paymentStatus2[index] === "all" ? (
                          <button
                            className="plannerMatchingBtn"
                            data-bs-estimateNum={searchedEstimateId[index]}
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
                            data-bs-estimateNum={searchedEstimateId[index]}
                            onClick={cancelMatchingUser2}
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
            {userIndex.length !== 0 ? (
              userIndex.map((index) => {
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
                            -견적서{index + 1}-
                          </div>
                          <div
                            style={{
                              paddingLeft: "-70px",
                            }}
                          >
                            {console.log("+_+_+_+_+_+_+_+_+_+_+")}
                            {console.log(paymentStatus3)}
                            {paymentStatus3[index] === "all" ? (
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
                            ) : paymentStatus3[index] === "other" ? (
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
                            ) : paymentStatus3[index] === "deposit" ? (
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
                            ) : null}
                          </div>
                          <div style={{ marginRight: "8px" }}>
                            <button
                              className="plannerMatchingBtn"
                              data-bs-index={userEstimateId[index]}
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
                            {userName[index]}
                            {console.log("order:" + estimateOrder2[index])}
                            {console.log("index:" + index)}
                            {estimateOrder2[index] == index ? (
                              <div
                                style={{
                                  fontSize: "0.8em",
                                  color: "red",
                                  display: "inline-block",
                                  width: "150px",
                                }}
                              >
                                <img
                                  src={starIcon}
                                  alt=""
                                  style={{ width: "55px", height: "55px" }}
                                />
                                짝이에요!
                              </div>
                            ) : null}
                          </div>
                          {paymentStatus3[index] === "all" ? (
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
                              data-bs-target="#MatchOrCanelCustomer"
                              data-bs-index={userEstimateId[index]}
                              data-bs-useremail={userEmail[index]}
                              data-bs-estimateNum={index + 1}
                              onClick={cancelMatchedUser}
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
            {/* 
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
                  <h1
                    className="modal-title fs-2"
                    id="CancelMatching"
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
                  매칭을 취소하실경우 해당 플래너에게 지불한 계약금은 환불되지
                  않습니다
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setDeletePermission(true);
                    }}
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
          </div> */}
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
                      onClick={cancelMatchingUser3}
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
            {/* 고객 모달창(매칭취소) */}
            <div
              className="modal fade"
              id="MatchOrCanel"
              tabindex="-1"
              aria-labelledby="MatchOrCanel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-2"
                      id="CancelMatching"
                      style={{ fontSize: "1.6em" }}
                    >
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
                      onClick={goMatching}
                      data-bs-dismiss="modal"
                    >
                      매칭하기
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={deleteMatchingPlanner2}
                    >
                      거절하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 고객과의 매칭/거절 모달창 */}
            <div
              className="modal fade"
              id="MatchOrCanelCustomer"
              tabindex="-1"
              aria-labelledby="MatchOrCanelCustomer"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-2"
                      id="MatchOrCanelCustomer"
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
                      onClick={() => {
                        cancelMatchedUser2();
                      }}
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
