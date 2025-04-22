import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../Components/NavigationBar";
import Footer from "../../Components/Footer";
import "../../Css/menuList.css";
import "../../Css/items.css";
import Sidesection from "../../Components/Sidesection";

const Studio = () => {
  const { category1 } = useParams();
  const title = "스튜디오";
  const engTitle = "studio";
  const category2 = ["인물중심", "배경중심", "균형적인"];
  const [isAdmin, setIsAdmin] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category2[0]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectLikeState, setSelectLikeState] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const [previewImg, setPreviewImg] = useState([]);
  const [itemId, setItemId] = useState([]);
  const [item, setItem] = useState([]);
  const [itemName, setItemName] = useState([]);
  const [itemContent, setItemContent] = useState([]);
  const [keyIndex, setKeyIndex] = useState([]);
  const [imgDetailContent, setImgDetailContent] = useState([]);

  let keyIndexArr = [];
  let list = [];
  let itemDataArr = [];
  let previewImgArr = [];
  let itemNameArr = [];
  let itemContentArr = [];
  let itemDetailContentArr = [];

  const modalImg = useRef();
  const modalImgContent = useRef();
  const modalImgTitle = useRef();
  const modalItemId = useRef();

  const [modalImgoriginalTitle, setModalImgoriginalTitle] = useState("");
  const [selectedItemId, setSelectedItemId] = useState();
  const [selectedImgDetail, setSelectedImgDetail] = useState("");
  const [selectedImgSrc, setSelectedImgSrc] = useState("");
  const navigate = useNavigate();

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("email") === "admin@email.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    axios
      .get(`/item/itemList/${title}/${selectedCategory}`)
      .then((res) => {
        const dataList = res.data;

        if (dataList.length !== 0) {
          let index = 0;
          for (var i = 0; i < dataList.length; ) {
            let dataUrl = "data:image/jpeg;base64," + dataList[i];
            previewImgArr.push(dataUrl);
            setPreviewImg(previewImgArr);
            i++;

            let newitemId = dataList[i];
            list.push(newitemId);
            setItemId(list);
            keyIndexArr.push(index);
            index++;
            setKeyIndex(keyIndexArr);
            i++;

            axios
              .get(`/item/getItemList/${newitemId}`)
              .then((res) => {
                let newItem = res.data;
                itemDataArr.push(newItem);
                itemDataArr.sort(function (a, b) {
                  return new Date(b.itemWriteDate) - new Date(a.itemWriteDate);
                });
                setItem([...item, newItem]);
                setItem(itemDataArr);
              })
              .catch((e) => {
                console.log(e);
              });

            let newitemName = dataList[i];
            itemNameArr.push(newitemName);
            setItemName(itemNameArr);
            i++;

            let newitemContent = dataList[i];
            itemContentArr.push(newitemContent);
            setItemContent(itemContentArr);
            i++;
            let newItemDetailContent = dataList[i];
            itemDetailContentArr.push(newItemDetailContent);
            setImgDetailContent(itemDetailContentArr);
            i++;
          }
        } else {
          setKeyIndex([]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedCategory, update]);

  const showingDetail = (e) => {
    modalImg.current.src = e.target.dataset.bsSrc;
    setSelectedImgSrc(e.target.dataset.bsSrc);
    modalImg.current.dataset.category = e.target.dataset.bsCategory;
    modalImg.current.dataset.itemId = e.target.dataset.bsItemid;
    modalImgContent.current.innerText = e.target.dataset.bsItemcontent;
    modalImgTitle.current.innerText = `- ${e.target.dataset.bsItemname} -`;
    setModalImgoriginalTitle(e.target.dataset.bsItemname);
    setSelectedItemId(e.target.dataset.bsItemid);
    setSelectedImgDetail(e.target.dataset.bsItemdetailcontent);
    console.log("e.target.dataset.bsItemid:" + e.target.dataset.bsItemid);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleEditClick = () => {
    setEditMode(true);
    const itemId = modalImg.current.dataset.itemId;
    const title = modalImgoriginalTitle;
    const content = modalImgContent.current.innerText;
    navigate(`/editpost/${itemId}`, {
      state: {
        originalTitle: title,
        originalContent: content,
        engTitle: engTitle,
        originalimgDetailContent: selectedImgDetail,
      },
    });
  };

  const handleDeleteClick = () => {
    axios
      .post(`/item/deleteItem/${selectedItemId}`)
      .then((res) => {
        console.log(res);
        setUpdate(!update);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [selectedCategory, update]);

  const gotoDetailInfo = (e) => {
    navigate("/imgDetail", {
      state: { itemId: selectedItemId, imgsrc: selectedImgSrc },
    });
  };
  return (
    <div className="containerbox">
      <div className="mainlayout box1" style={{ minHeight: "100vh" }}>
        <NavigationBar title={title} category1={category1} isAdmin={isAdmin} />
        <div
          className="category-wrapper"
          style={{
            position: "fixed",
            top: "58px",
            background: "white",
            height: "70px",
            width: "557px",
          }}
        >
          {category2.map((category) => (
            <div
              key={category}
              className={`category ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => {
                handleCategoryClick(category);
                setUpdate(!update);
              }}
              style={{ fontSize: "1.3em", marginTop: "20px" }}
            >
              {category}
            </div>
          ))}
        </div>
        <div
          className="image-wrapper"
          style={{
            marginTop: "150px",
            minHeight: "100%",
            marginBottom: "100px",
          }}
        >
          {keyIndex.map((i) => (
            <img
              //   key={image.id}
              src={previewImg[i]}
              alt=""
              onClick={showingDetail}
              data-bs-toggle="modal"
              data-bs-target="#imgDetailModal"
              style={{ cursor: "pointer", width: "250px", height: "250px" }}
              data-bs-src={previewImg[i]}
              data-bs-category="스튜디오"
              data-bs-itemName={itemName[i]}
              data-bs-itemContent={itemContent[i]}
              data-bs-itemId={itemId[i]}
              data-bs-itemDetailContent={imgDetailContent[i]}
            />
          ))}
        </div>

        <Footer />
        {/* 이미지 상세정보 모달창 */}
        <div
          class="modal fade"
          id="imgDetailModal"
          tabindex="-1"
          aria-labelledby="imgDetailModal"
          aria-hidden="true"
        >
          <div
            class="modal-dialog modal-dialog-centered"
            style={{ width: "510px" }}
          >
            <div class="modal-content">
              <div class="modal-header">
                <h1
                  class="modal-title justify-content-center "
                  id="imgDetailModal"
                  style={{ fontSize: "1.9em" }}
                  ref={modalImgTitle}
                >
                  - -
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
                  marginTop: "50px",
                }}
              >
                <div
                  class="has-validation"
                  style={{
                    height: "100%",
                    width: "480px",
                  }}
                >
                  <img
                    src=""
                    style={{
                      width: "430px",
                      height: "470px",
                      marginBottom: "20px",
                      marginTop: "-50px",
                      marginLeft: "20px",
                    }}
                    alt=""
                    ref={modalImg}
                  />
                  <div
                    style={{
                      fontSize: "1.5em",
                      padding: "10px",
                    }}
                  >
                    상세정보
                  </div>
                  <p
                    style={{
                      fontSize: "1.3em",
                      width: "460px",
                      border: "1px solid black",
                      padding: "10px",
                    }}
                    ref={modalImgContent}
                  ></p>
                </div>
              </div>
              <div class="modal-footer">
                {isAdmin && (
                  <div className="button-wrapper" style={{ width: "320px" }}>
                    <button
                      className="edit-button"
                      onClick={handleEditClick}
                      data-bs-dismiss="modal"
                    >
                      수정
                    </button>
                    <button
                      className="delete-button"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteItemModal"
                    >
                      삭제
                    </button>
                  </div>
                )}
                {isAdmin === true ? null : (
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={gotoDetailInfo}
                  >
                    상세정보 페이지 이동
                  </button>
                )}
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
        {/*이미지 상세정보 모달창  */}
        {/* 아이템 삭제 메시지 창 */}
        <div
          class="modal fade"
          id="deleteItemModal"
          tabindex="-1"
          aria-labelledby="deleteItemModal"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1
                  class="modal-title text-center "
                  id="deleteItemModal"
                  style={{ fontSize: "1.4em" }}
                >
                  - 아이템 삭제 -
                </h1>
              </div>
              <div class="modal-body text-center" style={{ fontSize: "1.4em" }}>
                정말 삭제하시겠습니까?
              </div>
              <div class="modal-footer justify-content-center">
                <button
                  className="edit-button"
                  onClick={handleDeleteClick}
                  data-bs-dismiss="modal"
                >
                  예
                </button>
                <button className="delete-button" data-bs-dismiss="modal">
                  아니오
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 아이템 삭제 메시지 창 */}
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
};

export default Studio;
