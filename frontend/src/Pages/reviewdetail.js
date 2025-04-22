import "../Css/main.css";
import "../Css/CustomerCenter.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import styled from "styled-components";
import Sidesection from "../Components/Sidesection";

function Reviewdetail() {
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState("댓글 Smaple");
  const ARRAY = [0, 1, 2, 3, 4];
  const [actionmode, setActionmode] = useState(0);
  const [clicked, setClicked] = useState([false, false, false, false, false]);
  const { estimateId } = useLocation().state;
  console.log("estimateId=-=-=-=-=-=- : " + estimateId);

  const [reviewTitle, setReviewTitle] = useState([]);
  const [rating, setReviewStars] = useState([]);
  const [reviewComments, setReviewComments] = useState([]);
  const [reviewCommentsIndex, setReviewCommentsIndex] = useState([]);
  const [reviewViews, setReviewViews] = useState([]);
  const [reviewDate, setReviewDate] = useState([]);
  const [reviewText, setReviewText] = useState([]);
  const [images, setImages] = useState([]);

  const [previewUrl, setPreviewUrl] = useState([]);
  const [imgName, setImgName] = useState([]);
  const [fileType, setFileType] = useState([]);
  const [originImagesFile, setOriginImagesFile] = useState([]);
  const [imgArr, setImgArr] = useState([]);
  const [plannerEmail, setPlannerEmail] = useState("");
  const [authorityBtns, setShowAuthorityBtns] = useState(true);
  const navigate = useNavigate();

  const [commentcontent, setCommentContent] = useState("");
  const [commentEmail, setCommentEmail] = useState([]);
  const [editIndex, setEditIndex] = useState(0);
  const [updated, setUpdated] = useState(false);
  const [created, setCreated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [inputEditedComment, setInputEditedComment] = useState("");
  const [bsIndex, setBsIndex] = useState(0);
  const handleStarClick = (index) => {
    let clickStates = [...clicked];
    for (let i = 0; i < 5; i++) {
      clickStates[i] = i <= index ? true : false;
    }
    setClicked(clickStates);
    const Rating = index + 1;
    console.log(Rating);
    setReviewStars(Rating);
  };

  const deleteImg = (index) => {
    let previewUrlCopy = [...previewUrl];
    let imgArrCopy = [...imgArr];
    imgArrCopy.splice(index, 1);
    previewUrlCopy.splice(index, 1);
    setPreviewUrl(previewUrlCopy);
    setImgArr(imgArrCopy);
    // for (let i = 0; i < imgArrCopy.length; i++) {
    //   console.log(i);
    //   if(index===i){

    //   }
    //   if (copy[i].name === image) {
    //     copy.splice(i, 1);
    //     setImages(copy);
    //     break;
    //   }
    // }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    console.log(event.target.files);
    const imgArr1 = [...imgArr];
    imgArr1.push(selectedImage);
    setImgArr(imgArr1);
    console.log("+_+_+_+_+_+_++_+_+_+_+");
    console.log(imgArr1);
    // setImage(selectedImage);
    try {
      const fileReader = new FileReader();
      const previewUrlArr = [...previewUrl];
      fileReader.onload = () => {
        previewUrlArr.push(fileReader.result);
        setPreviewUrl(previewUrlArr);
      };

      fileReader.readAsDataURL(selectedImage);
    } catch (e) {
      setPreviewUrl(selectedImage);
    }
  };
  useEffect(() => {
    axios
      .get(`/estimateIdReview/${estimateId}`)
      .then((res) => {
        console.log(res);
        const data = res.data;

        setReviewText(data.reviewText);
        setReviewTitle(data.reviewTitle);
        setReviewStars(data.reviewStars);
        setReviewComments(data.comments);
        const reviewCommentsIndexArr = [];
        const commentContentArr = [];
        const commentEmailArr = [];
        for (let i = 0; i < data.comments.length; i++) {
          reviewCommentsIndexArr.push(i);
          commentContentArr.push(data.comments[i].commentContent);
          commentEmailArr.push(data.comments[i].commentEmail);
        }
        setReviewCommentsIndex(reviewCommentsIndexArr);
        setCommentEmail(commentEmailArr);
        setEditedComment(commentContentArr);
        setReviewViews(data.reviewCounts);
        setReviewDate(data.reviewDate);
        setPlannerEmail(data.plannerEmail);
        const imagearray = JSON.parse(data.reviewImg);
        const getImages = async () => {
          try {
            const imagePromises = imagearray.map((image) => {
              return axios.get("/review/imageview", {
                params: { image },
                responseType: "blob",
              });
            });
            const responses = await Promise.all(imagePromises);

            const imageUrls = responses.map((res, index) => {
              const resdata = URL.createObjectURL(res.data);
              console.log("aaaaaaaaa");
              console.log(res.data);

              return resdata;
            });
            console.log(imageUrls);
            setImages(imageUrls);
          } catch (e) {
            console.log(e);
          }
        };
        getImages();
      })
      .catch((e) => {
        console.log(e);
      });
  }, [updated, created, deleted]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("userEmail", sessionStorage.getItem("email"));
    axios
      .post(`/reviewauthority/${estimateId}`, formData)
      .then((res) => {
        console.log(res);
        if (res.data == 1) {
          setShowAuthorityBtns(true);
        } else {
          setShowAuthorityBtns(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleEditClick = (e) => {
    console.log(e.target.dataset.bsIndex);
    const index = e.target.dataset.bsIndex;
    setEditIndex(e.target.dataset.bsIndex);
    setEditMode(true);
  };

  const handleSaveClick = (e) => {
    const index = e.target.dataset.bsIndex;
    const formData = new FormData();
    formData.append("index", index);
    formData.append("estimateId", estimateId);
    formData.append("commentContent", inputEditedComment);
    axios
      .post(`/updatecomment`, formData)
      .then((res) => {
        console.log(res);
        setUpdated(!updated);
        setInputEditedComment("");
      })
      .catch((e) => {
        console.log(e);
      });
    setEditMode(false);
  };

  const handleChange = (e) => {
    setInputEditedComment(e.target.value);
  };

  const reviewUpdateForm = () => {
    axios
      .get(`/estimateIdReview/${estimateId}`)
      .then((res) => {
        console.log(res);
        const data = res.data;
        if (data != null) {
          const reviewStars = data.reviewStars;
          const text = data.reviewText;
          console.log(reviewText);
          let clickStates = [...clicked];
          for (let i = 0; i < 5; i++) {
            clickStates[i] = i < reviewStars ? true : false;
          }
          setClicked(clickStates);
          const Rating = reviewStars;
          console.log(Rating);
          setReviewStars(Rating);
          setReviewText(text);
          const getImages = async () => {
            try {
              console.log(data.reviewImg);
              const imagearray = JSON.parse(data.reviewImg);
              console.log(imagearray);
              const imgNameArr = [];
              const fileTypeArr = [];
              for (let i = 0; i < imagearray.length; i++) {
                const img = imagearray[i];
                const imgname = img.slice(
                  img.indexOf("_") + 1,
                  img.indexOf(".")
                );
                const fileType = img.slice(img.indexOf(".") + 1);
                imgNameArr.push(imgname);
                fileTypeArr.push(fileType);
              }
              setImgName(imgNameArr);
              setFileType(fileTypeArr);
              const imagePromises = imagearray.map((image) => {
                return axios.get("/review/imageview", {
                  params: { image },
                  responseType: "blob",
                });
              });
              const responses = await Promise.all(imagePromises);
              const imgFileArr = [];
              const imageUrls = responses.map((res, index) => {
                const resdata = URL.createObjectURL(res.data);
                console.log("aaaaaaaaa");
                console.log(res.data);
                const blob = res.data;
                const file = new File([blob], imgNameArr[index], {
                  type: `image/${fileTypeArr[index]}`,
                });
                imgFileArr.push(file);

                const previewUrlArr = [];
                const getImgSrc = async (event, files) => {
                  const getPreviewUrls = imgFileArr.map((file) => {
                    const selectedImage = file;
                    console.log("fileReader.result");
                    return new Promise((resolve, reject) => {
                      const fileReader = new FileReader();
                      fileReader.onload = async () => {
                        try {
                          const response = await fileReader.result;

                          resolve(response);
                        } catch (e) {
                          reject(e);
                        }
                      };
                      fileReader.onerror = (error) => {
                        reject(error);
                      };
                      fileReader.readAsDataURL(selectedImage);
                    });
                  });
                  const fileInfos = await Promise.all(getPreviewUrls);
                  setPreviewUrl(fileInfos);
                  return fileInfos;
                };
                getImgSrc();

                return resdata;
              });
              console.log(imageUrls);
              setImages(imageUrls);
              setOriginImagesFile(imgFileArr);
              setImgArr(imgFileArr);
            } catch (e) {
              console.log(e);
            }
          };
          getImages();
        } else {
        }
      })
      .catch((e) => {
        console.log(e);
      });

    setActionmode(1);
  };

  const updateReview = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("reviewText", reviewText);
    let ratingstars = rating;

    if (isNaN(rating)) {
      ratingstars = 0;
    }
    console.log(ratingstars);
    formData.append("reviewStars", ratingstars);
    console.log("+_+_+_+_+_+_+_+_+");
    if (imgArr.length > 0) {
      for (let i = 0; i < imgArr.length; i++) {
        formData.append("reviewImg", imgArr[i]);
      }
    }

    formData.append("userEmail", sessionStorage.getItem("email"));
    formData.append("plannerEmail", plannerEmail);
    formData.append("estimateId", estimateId);
    formData.append("reviewTitle", reviewTitle);
    if (reviewText === undefined || reviewText === "") {
      alert("리뷰를 작성하시려면 리뷰 후기를 적어주세요!");
    } else {
      axios
        .post("/updatedreviews", formData)
        .then((res) => {
          console.log("성공:", res);
          alert("리뷰 수정 완료!");
          navigate(`/review`);
        })
        .catch((e) => {
          console.log("실패:", e);
        });
    }
    setActionmode(0);
  };

  // 채워진 별 아이콘
  const filledStar = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="#ffd000"
      class="bi bi-star-fill"
      viewBox="0 0 16 16"
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>
  );

  // 빈 별 아이콘
  const emptyStar = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      class="bi bi-star"
      viewBox="0 0 16 16"
    >
      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
    </svg>
  );
  const Rating = () => {
    const stars = [];

    // 채워진 별 추가
    for (let i = 1; i <= rating; i++) {
      stars.push(filledStar);
    }

    // 빈 별 추가
    for (let i = 1; i <= 5 - rating; i++) {
      stars.push(emptyStar);
    }

    return stars;
  };

  const handleDelete = () => {
    axios.delete(`/review/delete/${estimateId}`).then((res) => {
      console.log(res);
      alert(`글이 삭제되었습니다!`);
      navigate(`/review`);
    });
    // window.location.reload(); // 페이지 새로고침
  };

  const handleDelete2 = (e) => {
    console.log("===============================");

    console.log(bsIndex);
    const index = bsIndex;
    const formData = new FormData();
    formData.append("index", index);
    formData.append("estimateId", estimateId);

    axios.post(`/deletecomment`, formData).then((res) => {
      console.log(res);
      alert(`댓글이 삭제되었습니다!`);
      setDeleted(!deleted);
    });
    // window.location.reload(); // 페이지 새로고침
  };

  const createcomment = (e) => {
    const formData = new FormData();
    formData.append("email", sessionStorage.getItem("email"));
    formData.append("category", sessionStorage.getItem("category"));
    formData.append("commentContent", commentcontent);
    formData.append("estimateId", estimateId);
    axios
      .post(`/createcomment`, formData)
      .then((res) => {
        console.log(res);
        setCreated(!created);
        setCommentContent("");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (actionmode === 0) {
    return (
      <div className="containerbox">
        <div className="mainlayout box1">
          <NavigationBar title={"이용후기"} />
          <div style={{ height: 64 }}></div>
          <div className="titleArea">
            <div style={{ display: "flex" }}>
              <p className="titleTxt">{reviewTitle}</p>
              {authorityBtns === true ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "25px",
                    marginLeft: "20px",
                  }}
                >
                  <button
                    className="upAndDelBtn2"
                    style={{ width: "90px" }}
                    onClick={reviewUpdateForm}
                  >
                    수정
                  </button>
                  <button
                    className="upAndDelBtn2"
                    data-bs-toggle="modal"
                    data-bs-target="#reviewDelete"
                    style={{ width: "90px" }}
                  >
                    삭제
                  </button>
                </div>
              ) : null}
            </div>

            <div style={{ display: "flex" }}>
              <p className="dateTxt">{reviewDate.slice(0, 10)}</p>
              <p className="viewCountTxt">조회수 : {reviewViews}</p>
              <div className="ratingStars">
                <Rating />
              </div>{" "}
            </div>
          </div>
          <hr />
          <div className="ContentArea">
            <textarea
              className="noticeContxt"
              style={{
                marginLeft: "10px",
                fontSize: "1.5em",
                border: "none",
                width: "96%",
                height: "500px",
              }}
              value={reviewText}
              disabled
            ></textarea>

            <div
              class="modal fade"
              id="reviewDelete"
              tabindex="-1"
              aria-labelledby="reviewDelete"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      이용후기 삭제
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body" style={{ fontSize: 26 }}>
                    정말로 삭제하시겠습니까?
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={handleDelete}
                    >
                      삭제
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
          </div>
          <hr />
          <div className="contentbox-detail" style={{ paddingLeft: "20px" }}>
            <h5 style={{ marginBottom: "-15px" }}>
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
                          alt=""
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
          <p className="ComentTitle">댓글</p>
          <div className="ComentArea">
            {reviewCommentsIndex.map((index) => {
              // setEditedComment(reviewComments[index].commentContent);
              console.log("index=>" + index);
              return (
                <div className="Coment">
                  <p className="nickname">
                    {reviewComments[index].commentWriter}
                  </p>
                  <p className="dateTxt">
                    {reviewComments[index].commentDate.slice(0, 10)}
                  </p>
                  <br />
                  <div>
                    {editMode && editIndex == index ? (
                      <div>
                        <input
                          type="text"
                          placeholder={reviewComments[index].commentContent}
                          onChange={handleChange}
                          className="comentinput"
                          value={inputEditedComment}
                          style={{ fontSize: 20, marginLeft: "30px" }}
                        />
                        <button
                          data-bs-index={index}
                          onClick={handleSaveClick}
                          className="writeBtn2"
                        >
                          완료
                        </button>
                      </div>
                    ) : commentEmail[index] ===
                      sessionStorage.getItem("email") ? (
                      <div>
                        <p className="AnsTxt" style={{ marginLeft: "10px" }}>
                          {reviewComments[index].commentContent}
                        </p>
                        <button
                          data-bs-index={index}
                          onClick={handleEditClick}
                          className="upAndDelBtn3"
                        >
                          수정
                        </button>
                        <button
                          className="upAndDelBtn3"
                          data-bs-index={index}
                          onClick={() => {
                            setBsIndex(index);
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#reviewComentDelete"
                        >
                          삭제
                        </button>
                        <div
                          class="modal fade"
                          id="reviewComentDelete"
                          tabindex="-1"
                          aria-labelledby="reviewComentDelete"
                          aria-hidden="true"
                        >
                          <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h1
                                  class="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  댓글 삭제
                                </h1>
                                <button
                                  type="button"
                                  class="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div class="modal-body" style={{ fontSize: 26 }}>
                                정말로 삭제하시겠습니까?
                              </div>
                              <div class="modal-footer">
                                <button
                                  type="button"
                                  data-bs-index={index}
                                  class="btn btn-primary"
                                  data-bs-dismiss="modal"
                                  onClick={handleDelete2}
                                >
                                  삭제
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
                      </div>
                    ) : (
                      <div>
                        <p className="AnsTxt" style={{ marginLeft: "10px" }}>
                          {reviewComments[index].commentContent}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {sessionStorage.getItem("email") !== null ? (
              <div>
                <input
                  type="text"
                  className="comentinput"
                  style={{ fontSize: 20, marginLeft: "30px" }}
                  value={commentcontent}
                  onChange={(e) => {
                    setCommentContent(e.target.value);
                  }}
                ></input>
                <button onClick={createcomment} className="writeBtn2">
                  작성
                </button>
              </div>
            ) : null}
          </div>
          <div style={{ height: 90 }}></div>
          <Footer />
        </div>
        <div className="box2"></div>
        <div className="box3">
          <Sidesection />
        </div>
      </div>
    );
  } else if (actionmode === 1) {
    return (
      <div className="containerbox">
        <div className="mainlayout box1">
          <NavigationBar title={"글수정"} />
          <div style={{ height: 74 }}></div>
          <div className="titleArea" style={{ display: "flex" }}>
            <input
              className="titleTxt"
              type="text"
              style={{
                marginLeft: "20px",
                marginRight: "20px",
                height: "45px",
                marginTop: "20px",
                textAlign: "start",
                paddingBottom: "20px",
                borderRadius: "10px",
              }}
              value={reviewTitle}
              onChange={(e) => {
                setReviewTitle(e.target.value);
              }}
            ></input>
            <div className="stars" style={{ marginTop: "10px" }}>
              <Stars>
                {ARRAY.map((el, idx) => {
                  return (
                    <FaStar
                      key={idx}
                      size="25"
                      onClick={() => handleStarClick(el)}
                      className={clicked[el] && "yellowStar"}
                    />
                  );
                })}
              </Stars>
              <input type="hidden" value={rating} />
            </div>
          </div>
          <hr />
          <div className="writeContent">
            <textarea
              className="form-control contentinput"
              rows="15"
              placeholder="수정내용을 입력해주세요"
              value={reviewText}
              onChange={(e) => {
                setReviewText(e.target.value);
              }}
              style={{ fontSize: 20 }}
            ></textarea>
          </div>
          <hr />

          <div className="photouploadsection">
            <p className="uploadphoto" style={{ fontSize: "1.5em" }}>
              사진 첨부
            </p>
            <input
              type="file"
              multiple
              id="uploadimage"
              className="displaynone"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label
              htmlFor="uploadimage"
              style={{ fontSize: "1.5em" }}
              className="cursor imageBtn"
            >
              사진선택
            </label>

            <div>
              <h5>
                고객 첨부이미지{" "}
                {previewUrl.length !== 0 && <span>(클릭시 삭제됩니다)</span>}
              </h5>
              {previewUrl.length === 0 && <span>첨부 이미지가 없습니다.</span>}
              <br></br>
              {console.log("previewUrl")}
              {console.log(previewUrl)}
              {previewUrl.length !== 0 ? (
                previewUrl.map((url, index) => {
                  return (
                    <div key={index} style={{ marginBottom: "20px" }}>
                      <button
                        type="button"
                        class="btn imgOverlay"
                        // data-bs-toggle="modal"
                        // data-bs-target={`#number${index.toString()}`}
                        style={{
                          width: "200px",
                          pointer: "cursor",
                          padding: 0,
                          height: "100%",
                          borderRadius: "10px",
                          margin: 0,
                        }}
                        onClick={() => {
                          deleteImg(index);
                        }}
                      >
                        <img
                          src={url}
                          alt=""
                          style={{
                            display: "inline-block",
                            width: "200px",
                            height: "200px",

                            borderRadius: "10px",
                          }}
                        />
                      </button>
                      {/* <ImagesView
                      images={url}
                      index={`number${index.toString()}`}
                    /> */}
                    </div>
                  );
                })
              ) : (
                <div></div>
                // <div style={{ marginTop: 5 }}>
                //   {images.map((image, index) => {
                //     return (
                //       <div className="imagefilenamebox">
                //         <div className="imagefilenamecontent">
                //           <span>{image.name}</span>
                //           <img
                //             src={image}
                //             width="40%"
                //             height="40%"
                //             style={{
                //               float: "left",
                //               width: "100%",
                //               borderRadius: "10px",
                //             }}
                //             alt=""
                //           />
                //           <div
                //             className="imagefilename-overlay cursor"
                //             onClick={() => {
                //               deleteimage(image.name);
                //             }}
                //           >
                //             <i class="bi bi-x-lg"></i>
                //           </div>
                //         </div>
                //       </div>
                //     );
                //   })}
                // </div>
              )}
            </div>
          </div>
          <br />
          <div className="writeBtnArea" style={{ marginTop: "-40px" }}>
            <button className="writeBtn" onClick={updateReview}>
              수정하기
            </button>
          </div>
          <div style={{ height: 200 }}></div>
          <Footer />
        </div>
        <div className="box2"></div>
        <div className="box3">
          <Sidesection />
        </div>
      </div>
    );
  }
}

export default Reviewdetail;
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
const Stars = styled.div`
  display: flex;
  padding-top: 5px;

  & svg {
    color: gray;
    cursor: pointer;
  }

  :hover svg {
    color: #fcc419;
  }

  & svg:hover ~ svg {
    color: gray;
  }

  .yellowStar {
    color: #fcc419;
  }
`;
