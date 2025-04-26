import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../Components/NavigationBar";
import Footer from "../../Components/Footer";
import "../../Css/menuList.css";
import "../../Css/items.css";
import Sidesection from "../../Components/Sidesection";

const Weddingoutfit = () => {
  const { category1 } = useParams();
  const [currentItem, setCurrentItem] = useState();
  const title = "의상";
  const engTitle = "weddingoutfit";
  const category2 = [
    "머메이드",
    "A라인",
    "H라인",
    "벨라인",
    "엠파이어",
    "프린세스",
    "남성예복",
    "한복",
  ];

  const [isAdmin, setIsAdmin] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category2[0]);
  const [editMode, setEditMode] = useState(false);
  const [itemList, setItemList] = useState([]);

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
        const items = [...dataList];
        setItemList(items);
      })
  }, [selectedCategory, update]);

  const showingDetail = (e) => {
    let {
      bsItem:item,
    } = e.target.dataset

    item = JSON.parse(item);
    setCurrentItem(item);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleEditClick = () => {
    setEditMode(true);
    const itemId = currentItem.itemId;
    navigate(`/editpost/${itemId}`, {
      state: {
        originalTitle: currentItem.itemName,
        originalContent: currentItem.content,
        engTitle: engTitle,
        originalimgDetailContent: currentItem.imgContent,
      },
    });
  };

  const handleDeleteClick = () => {
    axios
      .post(`/item/deleteItem/${currentItem.itemId}`)
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
      state: { 
        itemId: currentItem.itemId, 
        imgsrc: currentItem.itemImg, 
        content: currentItem.content,
        imgContent: currentItem.imgContent,
        itemName: currentItem.itemName  
      },
    });
  };
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={title} category1={category1} isAdmin={isAdmin} />
        <div
          className=""
          style={{
            position: "fixed",
            top: "72px",
            background: "white",
            height: "115px",
            width: "537px",
            paddingLeft: "20px",
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
              style={{
                fontSize: "1.3em",
                float: "left",
                marginBottom: "5px",
                marginTop: "15px",
              }}
            >
              {category}
            </div>
          ))}
        </div>

        <div
          className="image-wrapper"
          style={{
            marginTop: "185px",
            minHeight: "100%",
            marginBottom: "100px",
          }}
        >
          {itemList.map((item) => (
            <img
            src={item.itemImg}
            alt=""
            onClick={showingDetail}
            data-bs-toggle="modal"
            data-bs-target="#imgDetailModal"
            style={{
              cursor: "pointer",
              width: "250px",
              height: "250px",
            }}
            data-bs-item={JSON.stringify(item)}
            data-bs-category="의상"
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
                >
                  - {currentItem?.itemName} -
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
                    src={currentItem?.itemImg}
                    style={{
                      width: "430px",
                      height: "470px",
                      marginBottom: "20px",
                      marginTop: "-50px",
                      marginLeft: "20px",
                    }}
                    alt=""
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
                  >{currentItem?.content}</p>
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

export default Weddingoutfit;
