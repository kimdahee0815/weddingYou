import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../Components/NavigationBar";
import Footer from "../../Components/Footer";
import "../../Css/WritePost.css";
import selectImg from "../../Assets/selectImg.webp";
import Sidesection from "../../Components/Sidesection";
const categoryOptions = {
  weddinghall: ["일반", "호텔", "채플", "스몰", "야외", "전통혼례"],
  weddingoutfit: [
    "머메이드",
    "A라인",
    "H라인",
    "벨라인",
    "엠파이어",
    "프린세스",
    "남성예복",
    "한복",
  ],
  studio: ["인물중심", "배경중심", "균형적인"],
  makeup: ["헤어", "로맨틱한", "포인트", "네추럴", "스모키", "큐티", "러블리"],
  honeymoon: ["해외", "국내"],
  bouquet: ["라운드", "드롭", "케스케이드", "핸드타이드"],
};
const selectedCategory = {
  weddinghall: "웨딩홀",
  weddingoutfit: "의상",
  studio: "스튜디오",
  makeup: "메이크업",
  honeymoon: "신혼여행",
  bouquet: "부케",
};

const WritePost = () => {
  const { category1 } = useParams();
  const [itemName, setItemName] = useState("");
  const [content, setContent] = useState("");
  const [imgDetailContent, setImgDetailContent] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(selectImg);
  const [category2, setCategory2] = useState(categoryOptions[category1][0]);
  const [selectedCategory1, setSelectedCategory1] = useState(
    selectedCategory[category1]
  );
  console.log(selectedCategory1);
  const postItem = () => {
    if (content !== "" && itemName !== "") {
      if (imgFile.current.value !== "") {
        const formData = new FormData();
        formData.append("itemName", itemName);
        formData.append("content", content);
        formData.append("category1", selectedCategory1);
        formData.append("category2", category2);
        formData.append("file", image);
        formData.append("imgDetailContent", imgDetailContent);
        axios
          .post("/item/insertItem", formData)
          .then((response) => {
            console.log("성공:", response.data);
            setItemName("");
            setContent("");
            setImgDetailContent("");
            setImage(null);
            setPreviewUrl(selectImg);
            imgFile.current.value = null;
            alert("아이템 업로드 완료!");
          })
          .catch((e) => {
            console.log("실패:", e);
            if (e.response.data.message === "파일이 중복됩니다!") {
              alert("첨부파일이 중복됩니다!");
            }
          });
      } else {
        alert("이미지를 선택해주세요!");
      }
    } else {
      alert("제목과 내용을 입력하세요!");
    }
  };
  const imgFile = useRef();
  const handleCancel = () => {
    setItemName("");
    setContent("");
    setImgDetailContent("");
    imgFile.current.value = null;
    setCategory2(categoryOptions[category1][0]);
    setPreviewUrl(selectImg);
    setImage(null);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
    try {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedImage);
    } catch (e) {
      setPreviewUrl(selectImg);
    }
  };
  useEffect(() => {
    setImage(null);
  }, []);
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title="글 작성" />
        <div className="category-container" style={{ marginTop: "100px" }}>
          <div className="category-buttons">
            {categoryOptions[category1].map((option, index) => (
              <button
                key={index}
                className={`category-button ${
                  category2 === option ? "active" : ""
                }`}
                onClick={() => {
                  setCategory2(option);
                }}
                style={{ marginBottom: "5px" }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="post-inputwrap">
          <input
            className="title-input"
            type="text"
            placeholder="제목"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
          />
          <textarea
            className="content-textarea"
            placeholder="내용"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <textarea
            className="content-textarea"
            placeholder="상세내용"
            value={imgDetailContent}
            onChange={(event) => setImgDetailContent(event.target.value)}
          />
          <input ref={imgFile} type="file" onChange={handleImageChange} />
          <img
            src={previewUrl}
            alt=""
            style={{
              width: "200px",
              height: "200px",
              marginTop: "20px",
              marginBottom: "-20px",
            }}
          />
        </div>
        <div
          className="button-wrap"
          style={{
            justifyContent: "center",
            marginRight: "20px",
            marginTop: "-10px",
          }}
        >
          <button
            className="submit-button"
            onClick={() => {
              postItem();
            }}
            style={{ fontSize: "1.3em" }}
          >
            게시하기
          </button>

          <button className="cancel-button" onClick={handleCancel}>
            취소
          </button>
        </div>
        <Footer />
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
};

export default WritePost;
