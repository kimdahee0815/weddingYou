import React, { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import styled from "styled-components";
import "../Css/main.css";
import "../Css/Ratingpage.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import defaultprofileimage from "../Assets/defaultprofileimage.jpg";
import Sidesection from "../Components/Sidesection";

const ARRAY = [0, 1, 2, 3, 4];

function Ratingpage() {
  const { price, estimateId, plannerName, plannerImg, plannerEmail } = useLocation().state;

  const [clicked, setClicked] = useState([false, false, false, false, false]);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [previewUrl, setPreviewUrl] = useState([]);
  const [imgArr, setImgArr] = useState([]);
  
  const handleStarClick = (index) => {
    let clickStates = [...clicked];
    for (let i = 0; i < 5; i++) {
      clickStates[i] = i <= index ? true : false;
    }
    setClicked(clickStates);
    const Rating = index + 1;
    setRating(Rating);
  };

  const reviewtext = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/estimateIdReview/${estimateId}`)
      .then((res) => {
        console.log(res);
        const data = res.data;
        if (data != null) {
          const {reviewStars, reviewText, reviewImg} = data;
          let clickStates = [...clicked];
          for (let i = 0; i < 5; i++) {
            clickStates[i] = i < reviewStars ? true : false;
          }
          setClicked(clickStates);
          const Rating = reviewStars;
          setRating(Rating);
          setReviewText(reviewText);
          const getImages = async () => {
            try {
              if(reviewImg){
                const imagearray = JSON.parse(reviewImg);
                console.log(imagearray);
  
                try {
                  const imagePromises = imagearray.map((image) =>
                    axios.get("/review/imageview", {
                      params: { image },
                      responseType: "blob",
                    })
                  );
              
                  const responses = await Promise.all(imagePromises);
              
                  const previewUrlPromises = responses.map((res, index) => {
                    const blob = res.data;
              
                    const fileName = imagearray[index];
                    const fileExtension = fileName.split('.').pop();
              
                    const mimeType = `image/${fileExtension}`;
              
                    const file = new File([blob], fileName, {
                      type: mimeType,
                    });
              
                    setImgArr(prev => [...prev, file]);
                    return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                    });
                  });
              
                  const previewUrls = await Promise.all(previewUrlPromises);
                  setPreviewUrl(previewUrls); 
                  
                } catch (error) {
                  console.error("Image Loading Fail:", error);
                }
              }
            } catch (e) {
              console.log(e);
            }
          };
          getImages();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const insertReview = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("reviewText", reviewText);
    let ratingstars = rating;

    if (isNaN(rating)) {
      ratingstars = 0;
    }
    formData.append("reviewStars", ratingstars);
    
    if (imgArr.length > 0) {
      for (let i = 0; i < imgArr.length; i++) {
        formData.append("reviewImg", imgArr[i]);
      }
    }

    formData.append("userEmail", sessionStorage.getItem("email"));
    formData.append("plannerEmail", plannerEmail);
    formData.append("estimateId", estimateId);
    if (reviewText === undefined || reviewText === "") {
      alert("리뷰를 작성하시려면 리뷰 후기를 적어주세요!");
    } else {
      axios
        .post("/reviews", formData)
        .then((res) => {
          console.log("성공:", res);
          alert("리뷰 작성 완료!");
          navigate(`/`);
        })
        .catch((e) => {
          console.log("실패:", e);
        });
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImgArr((prev) => [...prev, selectedImage]);
    try {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl((prev) => [...prev, fileReader.result]);
      };

      fileReader.readAsDataURL(selectedImage);
    } catch (e) {
      setPreviewUrl(selectedImage);
    }
  };

  //이미지 파일 개별 삭제
  const deleteImg = (index) => {
    let previewUrlCopy = [...previewUrl];
    let imgArrCopy = [...imgArr];
    imgArrCopy.splice(index, 1);
    previewUrlCopy.splice(index, 1);
    setPreviewUrl(previewUrlCopy);
    setImgArr(imgArrCopy);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <p className="headtxt">서비스가 어떠셨나요?</p>
        <div className="plannerpro">
          {!plannerImg ? (
            <img
              src={defaultprofileimage}
              style={{ width: "250px", height: "230px" }}
              className="plannerproimg"
              alt={defaultprofileimage}
            />
          ) : (
            <img
              src={plannerImg}
              style={{ width: "250px", height: "230px" }}
              className="plannerproimg"
              alt={defaultprofileimage}
            />
          )}
          <p className="plannerName">{plannerName}</p>
        </div>
        <form>
          <div className="stars">
            <Stars>
              {ARRAY.map((el, idx) => {
                return (
                  <FaStar
                    key={idx}
                    size="80"
                    onClick={() => handleStarClick(el)}
                    className={clicked[el] && "yellowStar"}
                  />
                );
              })}
            </Stars>
            <input type="hidden" value={rating} />
          </div>
          <div className="reviewsection">
            <p className="reviewcont">이용후기</p>
            <textarea
              ref={reviewtext}
              className="form-control"
              rows="7"
              placeholder="이용후기를 입력해주세요"
              style={{ fontSize: 20 }}
              onChange={(e) => {
                setReviewText(e.target.value);
              }}
              value={reviewText}
            ></textarea>
          </div>
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
                {previewUrl?.length !== 0 && <span>(클릭시 삭제됩니다)</span>}
              </h5>
              {previewUrl?.length === 0 && <span>첨부 이미지가 없습니다.</span>}
              <br></br>
              {previewUrl?.length !== 0 ? (
                previewUrl?.map((url, index) => {
                  return (
                    <div key={index} style={{ marginBottom: "20px" }}>
                      <button
                        type="button"
                        class="btn imgOverlay"
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
                    </div>
                  );
                })
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="insertBtn" style={{ marginBottom: "50px" }}>
            <button className="reviewInsertBtn" onClick={insertReview}>
              작성하기
            </button>
          </div>
        </form>
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}

export default Ratingpage;

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