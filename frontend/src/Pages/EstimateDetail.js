import "../Css/main.css";
import "../Css/EstimateDetail.css";
import personCentered from "../Assets/logo.png";
//
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
//컴포넌트
import Footer from "../Components/Footer";
import BackButton from "../Components/Backbutton";
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
          `http://localhost:8080/estimate/getdetail/${id}`
        );
        const { data } = response;
        console.log(data);
        SetEstimateData(data);
        setLoading(true);
        if (data.plannermatching === null) {
          setPlannerMatching(null);
        } else {
          setPlannerMatching(JSON.parse(data.plannermatching));
        }
        // 이미지 데이터 가져오기
        const imagearray = JSON.parse(data.img);
        const imagePromises = imagearray.map((image) => {
          return axios.get("http://localhost:8080/estimate/imageview", {
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
    if (window.confirm("견적서 게시글을 삭제하시겠습니까?")) {
      try {
        let response = await axios.get(
          "http://localhost:8080/estimate/delete",
          { params: { id: estimateData.id } }
        );
        let { data } = response;
        console.log("삭제 성공");
        navigate("../estimatelist");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const goMatching = (e) => {
    console.log("plannerMatching:" + plannerMatching);
    if (plannerMatching === null) {
      let plannerEmail = [sessionStorage.getItem("email")];
      console.log(plannerEmail);
      let formData = new FormData();
      formData.append("id", id);
      formData.append("plannermatching", JSON.stringify(plannerEmail));
      axios
        .post(`/estimate/insert/matchingplanner`, formData)
        .then((res) => {
          console.log(res);
          alert("매칭 신청되었습니다!");
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.message === "중복됩니다!") {
            alert("이미 매칭 신청한 회원입니다!");
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
            console.log(res);
            alert("매칭 신청되었습니다!");
          })
          .catch((e) => {
            console.log(e);

            if (e.response.data.message === "중복됩니다!") {
              alert("이미 매칭 신청한 회원입니다!");
            }
          });
      } else {
        alert("이미 매칭 신청한 회원입니다!");
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
            title={`${estimateData.writer.slice(0, 3) + "*** 님의 견적서"}`}
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
                <h1>매칭이 완료된 게시글입니다.</h1>
                <div className="match-complete-btn-box">
                  <button
                    className="match-complete-btn"
                    onClick={() => {
                      setScrollControl(true);
                    }}
                  >
                    그래도볼래요
                  </button>
                </div>
                <div className="match-complete-btn-box">
                  <button
                    className="match-complete-btn"
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    뒤로가기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="contentcontainer-detail">
            <div className="contentbox-detail">
              <h5 onClick={() => {}}>희망 결혼 예정일</h5>
              {JSON.parse(estimateData.weddingdate).map((e, index) => {
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
              <h5>희망 결혼 지역</h5>
              {JSON.parse(estimateData.region).map((e, index) => {
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
              <h5>예산 한도</h5>
              <div className="choosebox-detail" style={{ width: "150px" }}>
                <div className="result-detail">
                  {estimateData.budget.toLocaleString()}원
                </div>
              </div>
            </div>
            <div className="contentbox-detail">
              <h5>희망 스튜디오 스타일</h5>
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
              <h5>신부 드레스 스타일</h5>
              {estimateData.dress === "[]" && (
                <div className="choosebox-detail">
                  <div className="result-noneChoose">*선택사항 없음*</div>
                </div>
              )}
              {JSON.parse(estimateData.dress).map((e, index) => {
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
              <div>
                {/* <span>
                드레스 스타일이 궁금하다면?&nbsp;
                <span
                  type="button"
                  className="badge bg-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#dressModal"
                >
                  Click
                </span>
              </span> */}
              </div>
            </div>
            <div className="contentbox-detail">
              <h5>신부 메이크업 스타일</h5>
              {estimateData.dress === "[]" && (
                <div className="choosebox-detail">
                  <div className="result-noneChoose">*선택사항 없음*</div>
                </div>
              )}
              {JSON.parse(estimateData.makeup).map((e, index) => {
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
              <div>
                {/* <span>
                메이크업 스타일이 궁금하다면?&nbsp;
                <span
                  type="button"
                  className="badge bg-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#makeupModal"
                >
                  Click
                </span>
              </span> */}
              </div>
            </div>
            <div className="contentbox-detail">
              <h5>희망 신혼여행지</h5>
              <div className="choosebox-detail">
                {estimateData.honeymoon === "" && (
                  <div className="result-noneChoose">*선택사항 없음*</div>
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
                고객 첨부이미지{" "}
                {images.length !== 0 && <span>(클릭시 확대됩니다)</span>}
              </h5>
              {images.length === 0 && <span>첨부 이미지가 없습니다.</span>}
              <br></br>
              <div>
                {images.map((e, index) => {
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
                          />
                        </button>
                        <ImagesView
                          images={e}
                          index={`number${index.toString()}`}
                        />
                      </>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="contentbox-detail" style={{ borderBottom: "none" }}>
              <h5>고객 요청사항</h5>
              <div
                className="choosebox-detail w-100"
                style={{ color: "black" }}
              >
                {estimateData.requirement === "" && (
                  <span>고객요청사항이 없습니다.</span>
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
                      수정하기
                    </button>

                    <button
                      onClick={() => {
                        estimateDelete();
                      }}
                      className="btn-colour-1"
                      style={{ marginLeft: "10px" }}
                    >
                      삭제하기
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
                    매칭신청하기
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
                    뒤로가기
                  </button>
                ))}
            </div>
          </div>
          <div style={{ height: 94.19 }}></div>
          <Footer />
          {/* <StudioModal />
        <DressModal />
        <MakeupModal /> */}
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

// const StudioModal = () => {
//   return (
//     <div
//       className="modal fade"
//       id="studioModal"
//       tabindex="-1"
//       aria-labelledby="exampleModalLabel"
//       aria-hidden="true"
//     >
//       <div className="modal-dialog">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h1 className="modal-title fs-5" id="exampleModalLabel">
//               <span>스튜디오</span>
//             </h1>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               aria-label="Close"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <div className="accordion" id="accordionExample1">
//               <AccordionComp
//                 heading={1}
//                 collapse="one"
//                 topic="인물중심 스튜디오"
//                 image1="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1667180129.jpg&w=1920&q=75"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_11679_1665982500_05988600_3232256100.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_1708_1665976697_88410900_3232256100.jpg"
//                 comment1="깔끔한 배경에서 인물중심의 촬영을 진행해요!"
//                 comment2="심플하고 깨끗한 이미지의 결과물!"
//                 comment3="오래두고 보아도 질리지 않는 장점이 있어요!"
//                 _id="accordionExample1"
//               />
//               <AccordionComp
//                 heading={2}
//                 collapse="two"
//                 topic="배경중심 스튜디오"
//                 image1="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1663831599.jpg&w=1920&q=75"
//                 image2="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1663808804.jpg&w=1920&q=75"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_13581_1665985281_96465800_3232256098.jpg"
//                 comment1="촬영 자체의 특별한 경험을 선사해요!"
//                 comment2="스튜디오 고유의 배경과 분위기를 담을 수 있답니다!"
//                 comment3="화려한 배경 덕에 부담이 덜해요!"
//                 _id="accordionExample1"
//               />
//               <AccordionComp
//                 heading={3}
//                 collapse="three"
//                 topic="균형적인 스튜디오"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_12512_1666920642_83238100_3232256098.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_12544_1666688374_16242500_3232256098.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_13300_1668503581_00621700_3232256098.jpg"
//                 comment1="요즘 가장 인기있는 스타일이에요!"
//                 comment2="배경과 인물 모두 예쁘게 담을 수 있답니다~"
//                 comment3="자연스러운 행동위주의 연출도 가능해요!"
//                 _id="accordionExample1"
//               />
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button
//               type="button"
//               className="btn btn-secondary"
//               data-bs-dismiss="modal"
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DressModal = () => {
//   return (
//     <div
//       className="modal fade"
//       id="dressModal"
//       tabindex="-1"
//       aria-labelledby="exampleModalLabel"
//       aria-hidden="true"
//     >
//       <div className="modal-dialog">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h1 className="modal-title fs-5" id="exampleModalLabel">
//               <span>드레스</span>
//             </h1>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               aria-label="Close"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <div className="accordion" id="accordionExample2">
//               <AccordionComp
//                 heading={4}
//                 collapse="four"
//                 topic="머메이드"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_d120_2001_1632361176_65452700_3232256100.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4250_1668583465_80283900_3232256100.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800___1665453271_05641100_3232256098.jpg"
//                 comment1="키가 크시고 마르신 분들에게 추천해요!"
//                 comment2="허리와 힙을 강조해요!"
//                 comment3="하지만 움직임에 제약이 많은 단점이 있습니다."
//                 _id="accordionExample2"
//               />
//               <AccordionComp
//                 heading={5}
//                 collapse="five"
//                 topic="A라인"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_5350_1679279312_93081100_3232256098.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4365_1674628854_18110500_3232256100.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_12996_1677040520_50476000_3232256099.jpg"
//                 comment1="어떤 체형이든 잘 어울립니다!"
//                 comment2="키가 커보이는 스타일이에요!"
//                 comment3="하체가 통통하신 분들에게도 추천!"
//                 _id="accordionExample2"
//               />
//               <AccordionComp
//                 heading={6}
//                 collapse="six"
//                 topic="H라인"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_4794_1679476555_79191600_3232256099.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800___1665130500_49819100_3232256100.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800___1665454832_07143300_3232256099.jpg"
//                 comment1="섹시함과 성숙함을 함께 나타낼 수 있어요!"
//                 comment2="날씬하신 분들께 추천합니다!"
//                 comment3="슬림한 느낌을 줍니다"
//                 _id="accordionExample2"
//               />
//               <AccordionComp
//                 heading={7}
//                 collapse="seven"
//                 topic="벨라인"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_5218_1675921472_92970900_3232256099.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4796_1679476532_21876000_3232256099.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_14256_1681265613_43329300_3232256100.jpg"
//                 comment1="허리부터 풍성하게 퍼지는 라인이 특징입니다"
//                 comment2="통통한 하체를 커버하기에 좋습니다"
//                 comment3="키가 작고 마른 신부님들에게도 추천해요!"
//                 _id="accordionExample2"
//               />
//               <AccordionComp
//                 heading={8}
//                 collapse="eight"
//                 topic="엠파이어"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_14083_1675239691_84022800_3232256098.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_d247_14923_1649140504_74715200_3232256100.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_d276_6631_1582187346_70709200_3232256098.jpg"
//                 comment1="날씬해보이는 드레스 스타일입니다!"
//                 comment2="직사각형 체형분들에게 추천해요"
//                 comment3="하체가 길어보인답니다~"
//                 _id="accordionExample2"
//               />
//               <AccordionComp
//                 heading={9}
//                 collapse="nine"
//                 topic="프린세스"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_17534_1673254073_72786200_3232256099.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_15343_1674625658_77782300_3232256100.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_13164_1676956927_35327800_3232256098.jpg"
//                 comment1="화려한 장식을 더한 드레스입니다!"
//                 comment2="여성적인 매력을 어필하기에 좋아요!"
//                 comment3="허리선이 굵은 분들에게 추천해요!"
//                 _id="accordionExample2"
//               />
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button
//               type="button"
//               className="btn btn-secondary"
//               data-bs-dismiss="modal"
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MakeupModal = () => {
//   return (
//     <div
//       className="modal fade"
//       id="makeupModal"
//       tabindex="-1"
//       aria-labelledby="exampleModalLabel"
//       aria-hidden="true"
//     >
//       <div className="modal-dialog">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h1 className="modal-title fs-5" id="exampleModalLabel">
//               <span>메이크업</span>
//             </h1>
//             <button
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               aria-label="Close"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <div className="accordion" id="accordionExample3">
//               <AccordionComp
//                 heading={10}
//                 collapse="ten"
//                 topic="로맨틱한"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_2294_1680250969_59017300_3232256099.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m056_14449_1640850193_39487800_3232256099.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m205_13076_1624261891_10019500_3232256100.jpg"
//                 comment1="촉촉하고 투명한 느낌을 줍니다!"
//                 comment2="핑크색의 색조를 많이 사용해요!"
//                 comment3="피부가 하얀분들에게 추천해요!"
//                 _id="accordionExample3"
//               />
//               <AccordionComp
//                 heading={11}
//                 collapse="eleven"
//                 topic="포인트"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_17895_1680164863_59917800_3232256100.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_17622_1673943339_73525400_3232256100.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m051_15898_1654237244_14286700_3232256099.jpg"
//                 comment1="내추럴 메이크업에서 포인트를 더한 메이크업입니다!"
//                 comment2="수수한 느낌보다는 화려한 느낌을 살려줍니다"
//                 comment3="스타일이 조금은 과해서 스튜디오 촬영 때 많이 이용되는 스타일입니다"
//                 _id="accordionExample3"
//               />
//               <AccordionComp
//                 heading={12}
//                 collapse="twelve"
//                 topic="내추럴"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m114_1711_1647822940_71648700_3232256099.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m209_15869_1653530666_48849500_3232256098.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m134_4309_1661326982_18419000_3232256098.jpg"
//                 comment1="가장 기본적인 스타일입니다!"
//                 comment2="평소 메이크업을 잘 하지 않는 분들에게 추천드려요"
//                 comment3="자연스럽고 깨끗해 보이는 점이 장점입니다."
//                 _id="accordionExample3"
//               />
//               <AccordionComp
//                 heading={13}
//                 collapse="thirteen"
//                 topic="스모키"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m122_1845_1628473766_68122500_3232256099.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_1844_1678866654_71494500_3232256100.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m199_6483_1585638230_88987100_3232256098.jpg"
//                 comment1="눈매를 강조하는 화장입니다!"
//                 comment2="이목구비가 뚜렷하게 보이는 장점이 있어요!"
//                 comment3="하지만 평소에 인상이 쎄시다면 추천드리지 않습니다"
//                 _id="accordionExample3"
//               />
//               <AccordionComp
//                 heading={14}
//                 collapse="fourteen"
//                 topic="큐티"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m205_13078_1624261921_87529100_3232256100.jpg"
//                 image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m197_6298_1628237690_62191600_3232256098.jpg"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m152_12803_1652060864_24013300_3232256099.jpg"
//                 comment1="상큼하고 귀여운 모습의 연출이 가능해요"
//                 comment2="동그랗게 올린 머리가 특징입니다!"
//                 comment3="얼굴이 크시거나, 이마가 넓으시다면 피하시는 게 좋습니다"
//                 _id="accordionExample3"
//               />
//               <AccordionComp
//                 heading={15}
//                 collapse="fifteen"
//                 topic="러블리"
//                 image1="https://www.iwedding.co.kr/center/iweddingb/product/800_17670_1676267275_58014900_3232256099.jpg"
//                 image2="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1663894788.jpg&w=1920&q=75"
//                 image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m175_6093_1604471404_02327900_3232256100.jpg"
//                 comment1="얼굴에 화사함을 주는 스타일입니다"
//                 comment2="어려보이는 효과를 줍니다"
//                 comment3="갓 짜낸 과즙을 담아낸 듯한 스타일이에요"
//                 _id="accordionExample3"
//               />
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button
//               type="button"
//               className="btn btn-secondary"
//               data-bs-dismiss="modal"
//             >
//               닫기
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AccordionComp = ({
//   heading,
//   collapse,
//   topic,
//   image1,
//   image2,
//   image3,
//   comment1,
//   comment2,
//   comment3,
//   _id,
// }) => {
//   return (
//     <div className="accordion-item">
//       <h2 className="accordion-header" id={heading}>
//         <button
//           className="accordion-button collapsed"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target={`#${collapse}`}
//           aria-expanded="false"
//           aria-controls={heading}
//         >
//           <span>{topic}</span>
//         </button>
//       </h2>
//       <div
//         id={collapse}
//         className="accordion-collapse collapse"
//         aria-labelledby={heading}
//         data-bs-parent={`#${_id}`}
//       >
//         <div className="accordion-body p-0">
//           <div className="exampleimagebox">
//             <div className="exampleimage">
//               <Carousel
//                 image1={image1}
//                 image2={image2}
//                 image3={image3}
//                 heading={heading}
//               />
//             </div>
//           </div>

//           <div className="Accordion-explanation">
//             <h5>설명 및 특징</h5>
//             <ul>
//               <li>- {comment1}</li>
//               <li>- {comment2}</li>
//               <li>- {comment3}</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Carousel = ({ image1, image2, image3, collapse, heading }) => {
//   return (
//     <div
//       id={`carouselExampleDark${heading}`}
//       className="carousel carousel-dark slide w-100 height100"
//       data-bs-ride="carousel"
//     >
//       <div className="carousel-indicators">
//         <button
//           type="button"
//           data-bs-target={`#carouselExampleDark${heading}`}
//           data-bs-slide-to="0"
//           className="active"
//           aria-current="true"
//           aria-label="Slide 1"
//         ></button>
//         <button
//           type="button"
//           data-bs-target={`#carouselExampleDark${heading}`}
//           data-bs-slide-to="1"
//           aria-label="Slide 2"
//         ></button>
//         <button
//           type="button"
//           data-bs-target={`#carouselExampleDark${heading}`}
//           data-bs-slide-to="2"
//           aria-label="Slide 3"
//         ></button>
//       </div>
//       <div className="carousel-inner">
//         <div className="carousel-item active" data-bs-interval="10000">
//           <img
//             src={image1}
//             className="d-block w-100"
//             style={{ height: 450 }}
//             alt="..."
//           />
//           <div className="carousel-caption d-none d-md-block"></div>
//         </div>
//         <div className="carousel-item" data-bs-interval="2000">
//           <img
//             src={image2}
//             className="d-block w-100"
//             style={{ height: 450 }}
//             alt="..."
//           />
//           <div className="carousel-caption d-none d-md-block"></div>
//         </div>
//         <div className="carousel-item">
//           <img
//             src={image3}
//             className="d-block w-100"
//             style={{ height: 450 }}
//             alt="..."
//           />
//           <div className="carousel-caption d-none d-md-block"></div>
//         </div>
//       </div>
//       <button
//         className="carousel-control-prev"
//         type="button"
//         data-bs-target={`#carouselExampleDark${heading}`}
//         data-bs-slide="prev"
//       >
//         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Previous</span>
//       </button>
//       <button
//         className="carousel-control-next"
//         type="button"
//         data-bs-target={`#carouselExampleDark${heading}`}
//         data-bs-slide="next"
//       >
//         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Next</span>
//       </button>
//     </div>
//   );
// };

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

        {/* <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Modal title
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">
              Save changes
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};
