import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../Components/NavigationBar";
import Footer from "../../Components/Footer";
import "../../Css/WritePost.css";
import selectImg from "../../Assets/selectImg.webp";
import Sidesection from "../../Components/Sidesection";
const categoryOptions = {
  weddinghall: ["Standard", "Hotel", "Chapel", "Small", "Outdoor", "Traditional"],
  weddingoutfit: [
    "Mermaid",
    "A-line",
    "H-line",
    "Ball Gown",
    "Empire",
    "Princess",
    "Men's Suit",
    "Hanbok",
  ],
  studio: ["Subject-focused", "Background-focused", "Balanced"],
  makeup: ["Hair", "Romantic", "Point", "Natural", "Smoky", "Cute", "Lovely"],
  honeymoon: ["International", "Domestic"],
  bouquet: ["Round", "Drop", "Cascade", "Hand-tied"],
};
const selectedCategory = {
  weddinghall: "Wedding Hall",
  weddingoutfit: "Outfit",
  studio: "Studio",
  makeup: "Makeup",
  honeymoon: "Honeymoon",
  bouquet: "Bouquet",
};

const WritePost = () => {
  const navigate = useNavigate();
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

  const postItem = () => {
    if (content !== "" && itemName !== "") {
      if (imgFile.current.value !== "") {
        const formData = new FormData();
        formData.append("itemName", itemName);
        formData.append("content", content);
        formData.append("category1", selectedCategory1);
        formData.append("category2", category2);
        formData.append("file", image);
        formData.append("imgContent", imgDetailContent);

        axios.post("/item/insertItem", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
          .then((response) => {
           // console.log("Success:", response.data);
            setItemName("");
            setContent("");
            setImgDetailContent("");
            setImage(null);
            setPreviewUrl(selectImg);
            imgFile.current.value = null;
            alert("Item uploaded successfully!");
            navigate(`/menu/${category1}`)
          })
          .catch((e) => {
            console.log("실패:", e);
            if (e.response.data.message === "파일이 중복됩니다!") {
              alert("This file is a duplicate!");
            }
          });
      } else {
        alert("Please select an image!");
      }
    } else {
      alert("Please enter a title and content!");
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
        <NavigationBar title="Write Post" />
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
            placeholder="Title"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
          />
          <textarea
            className="content-textarea"
            placeholder="Content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <textarea
            className="content-textarea"
            placeholder="Detailed Content"
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
            Post
          </button>

          <button className="cancel-button" onClick={handleCancel}>
            Cancel
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
