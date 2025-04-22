import React, { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import styled from "styled-components";
import "../Css/main.css";
import "../Css/Ratingpage.css";
import selectImg from "../Assets/selectImg.webp";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import defaultprofileimage from "../Assets/defaultprofileimage.jpg";
import Sidesection from "../Components/Sidesection";

const ARRAY = [0, 1, 2, 3, 4];

function Ratingpage() {
  const { estimateId } = useLocation().state;
  const { plannerName } = useLocation().state;
  const { plannerImg } = useLocation().state;
  const { planneremail } = useLocation().state;
  const { price } = useLocation().state;
  const [clicked, setClicked] = useState([false, false, false, false, false]);

  const [rating, setRating] = useState(0);
  const [score, setScore] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrl, setPreviewUrl] = useState([]);
  const [imgName, setImgName] = useState([]);
  const [fileType, setFileType] = useState([]);
  const [originImagesFile, setOriginImagesFile] = useState([]);
  const [imgArr, setImgArr] = useState([]);
  const handleStarClick = (index) => {
    let clickStates = [...clicked];
    for (let i = 0; i < 5; i++) {
      clickStates[i] = i <= index ? true : false;
    }
    setClicked(clickStates);
    const Rating = index + 1;
    console.log(Rating);
    setRating(Rating);
  };

  // useEffect(() => {
  //   sendReview();
  // }, [clicked]);

  const reviewtext = useRef();

  const navigate = useNavigate();

  // const sendReview = () => {
  //   setScore(clicked.filter(Boolean).length);
  // };

  useEffect(() => {
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
          setRating(Rating);
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
  }, []);

  const insertReview = (e) => {
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
    formData.append("plannerEmail", planneremail);
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
  //이미지 파일 첨부
  // const handleImageChange = (e) => {
  //   if (images.length >= 5 || e.target.files.length + images.length > 5) {
  //     alert("파일 첨부는 5개까지 가능합니다.");
  //     e.target.value = null;
  //   } else {
  //     let copy = [...images];
  //     for (let i = 0; i < e.target.files.length; i++) {
  //       copy.push(e.target.files[i]);
  //     }
  //     setImages(copy);
  //   }
  // };

  //이미지 파일 초기화
  const imageClear = () => {
    setImages([]);
  };
  //이미지 파일 개별 삭제
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <p className="headtxt">서비스가 어떠셨나요?</p>
        <div className="plannerpro">
          {plannerImg === "data:image/jpeg;base64," ? (
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
          <img src={images} alt="" />
        </div>
      </div>
    </div>
  );
};
