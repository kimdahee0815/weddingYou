import "../Css/main.css";
import "../Css/Home.css";
import "../Css/LikeList.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Animation from "../Components/Animation";
import axios from "axios";
import Sidesection from "../Components/Sidesection";

function LikeList() {
  const category = [
    "웨딩홀",
    "스튜디오",
    "의상",
    "메이크업",
    "신혼여행",
    "부케",
  ];
  const [previewImg, setPreviewImg] = useState([]);
  const [itemId, setItemId] = useState([]);
  const [item, setItem] = useState([]);
  const [itemName, setItemName] = useState([]);
  const [itemLike, setItemLike] = useState([]);
  const [keyIndex, setKeyIndex] = useState([]);
  const [deleteItemId, setDeleteItemId] = useState([]);
  let keyIndexArr = [];
  let list = [];
  let itemDataArr = [];
  let previewImgArr = [];
  let likeIndexArr = [];
  const [selectedItem, setSelectedItem] = useState("카테고리"); // 초기 버튼명 설정
  const [selectedSort, setSelectedSort] = useState("정렬"); // 초기 버튼명 설정
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState();
  const [prevSelectedIndex, setPrevSelectedIndex] = useState();
  const [likeState, setLikeState] = useState([]);
  const [checkLikeOrNot, setCheckLikeOrNot] = useState(false);
  const [update, setUpdate] = useState(false);

  const [likeSelect, setLikeSelect] = useState(true);
  const [finish, setFinish] = useState(false);
  const [realFinish, setRealFinish] = useState(false);

  const handleHeartClick = (e) => {
    setCheckLikeOrNot(!checkLikeOrNot);
    let newlikeState = [...likeState];
    let index = parseInt(e.target.dataset.index);
    let prevState = newlikeState.slice(index, index + 1);
    let changedState = undefined;
    if (prevState[0] === true) {
      changedState = false;
    } else if (prevState[0] === false) {
      changedState = true;
    } else {
      changedState = false;
    }
    newlikeState.splice(index, 1, changedState);
    setLikeState(newlikeState);
    setSelectedItemId(e.target.dataset.id);
    setSelectedIndex(parseInt(e.target.dataset.index));
    if (likeState[index] === true || likeState[index] === undefined) {
      itemLike[index]--;
    } else {
      itemLike[index]++;
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item) => {
    setSelectedItem(item); // 선택한 아이템으로 버튼명 변경
  };

  const handleSortClick = (sort) => {
    setSelectedSort(sort); // 선택한 정렬로 버튼명 변경
  };

  useEffect(() => {
    if (sessionStorage.getItem("email") === null) {
      navigate("/login");
    }
  }, []);

  const goUpdate = (e) => {
    setUpdate(!update);
  };

  // useEffect(() => {
  //   setFinish(false);
  //   setTimeout(() => {
  //     setFinish(true);
  //   }, 8000);
  // }, [selectedItem, selectedSort]);

  // useEffect(() => {
  //   //전체 찜목록 불러오는 기능
  //   axios
  //     .post(`/like/list`, { email: sessionStorage.getItem("email") })
  //     .then((res) => {
  //       const dataList = res.data;

  //       if (dataList.length !== 0) {
  //         let index = 0;
  //         for (var i = 0; i < dataList.length; i++) {
  //           if (i % 3 === 0) {
  //             let dataUrl = "data:image/jpeg;base64," + dataList[i];
  //             previewImgArr.push(dataUrl);
  //             setPreviewImg(previewImgArr);
  //           } else if (i % 3 === 1) {
  //             let newitemId = dataList[i];
  //             list.push(newitemId);
  //             setItemId(list);
  //             keyIndexArr.push(index);
  //             index++;
  //             setKeyIndex(keyIndexArr);
  //             likeIndexArr.push(true);
  //             setLikeState(likeIndexArr);
  //             axios
  //               .get(`/item/getItemList/${newitemId}`)
  //               .then((res) => {
  //                 let newItem = res.data;
  //                 itemDataArr.push(newItem);
  //                 itemDataArr.sort(function (a, b) {
  //                   return (
  //                     new Date(b.likeWriteDate) - new Date(a.likeWriteDate)
  //                   );
  //                 });
  //                 setItem([...item, newItem]);
  //                 setItem(itemDataArr);

  //                 let itemNameList = [];
  //                 let itemLikeList = [];
  //                 for (var j = 0; j < itemDataArr.length; j++) {
  //                   const newItemName = itemDataArr[j].itemName;
  //                   const newItemLike = itemDataArr[j].like.length;
  //                   itemNameList.push(newItemName);
  //                   itemLikeList.push(newItemLike);
  //                   setItemName(itemNameList);
  //                   setItemLike(itemLikeList);
  //                 }
  //               })
  //               .catch((e) => {
  //                 console.log(e);
  //               });
  //           } else {
  //           }
  //         }
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }, []);

  useEffect(() => {
    //카테고리, 정렬 모두 적용

    axios
      .post(`/like/list/category/sort`, {
        email: sessionStorage.getItem("email"),
        category1: selectedItem,
        sortBy: selectedSort,
      })
      .then((res) => {
        const dataList = res.data;
        console.log(dataList);
        if (dataList.length !== 0) {
          let index = 0;
          for (var i = 0; i < dataList.length; i++) {
            if (i % 2 === 0) {
              let dataUrl = "data:image/jpeg;base64," + dataList[i];
              previewImgArr.push(dataUrl);
              setPreviewImg(previewImgArr);
            } else if (i % 2 === 1) {
              let newitemId = dataList[i];
              list.push(newitemId);
              setItemId(list);
              keyIndexArr.push(index);
              index++;
              setKeyIndex(keyIndexArr);
              likeIndexArr.push(true);
              setLikeState(likeIndexArr);

              axios
                .get(`/item/getItemList/${newitemId}`)
                .then((res) => {
                  console.log("=======================");
                  console.log(res);

                  let newItem = res.data;
                  itemDataArr.push(newItem);
                  if (selectedSort === "가나다순") {
                    itemDataArr.sort(function (a, b) {
                      if (a.itemName < b.itemName) return -1;
                      if (a.itemName > b.itemName) return 1;
                      if (a.itemName === b.itemName) return 0;
                    });
                  } else if (selectedSort === "인기순") {
                    itemDataArr.sort(function (a, b) {
                      if (a.like.length < b.like.length) return 1;
                      if (a.like.length > b.like.length) return -1;
                      if (a.like.length === b.like.length) {
                        if (a.itemName < b.itemName) return -1;
                        if (a.itemName > b.itemName) return 1;
                        if (a.itemName === b.itemName) return 0;
                      }
                    });
                  } else if (selectedSort === "최신순") {
                    itemDataArr.sort(function (a, b) {
                      return (
                        new Date(b.likeWriteDate) - new Date(a.likeWriteDate)
                      );
                    });
                  } else {
                    itemDataArr.sort(function (a, b) {
                      return (
                        new Date(b.likeWriteDate) - new Date(a.likeWriteDate)
                        //a.itemName - b.itemName
                      );
                    });
                  }

                  setItem([...item, newItem]);
                  setItem(itemDataArr);

                  let itemNameList = [];
                  let itemLikeList = [];
                  for (var j = 0; j < itemDataArr.length; j++) {
                    const newItemName = itemDataArr[j].itemName;
                    const newItemLike = itemDataArr[j].like.length;
                    itemNameList.push(newItemName);
                    itemLikeList.push(newItemLike);
                    setItemName(itemNameList);
                    setItemLike(itemLikeList);
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
              //
            }
          }
          setFinish(true);
        } else {
          // 결과 없을 때
          keyIndexArr = [];
          setKeyIndex(keyIndexArr);
          setFinish(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedItem, selectedSort, update]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [selectedItem, selectedSort, update]);

  // console.log(likeState);
  useEffect(() => {
    keyIndex.forEach((index) => {
      if (likeState[index] === false) {
        console.log("deleteitem:" + itemId[index]);
        axios
          .post(`/like/delete`, {
            itemId: itemId[index],
            email: sessionStorage.getItem("email"),
          })
          .then((res) => {
            console.log("delete");
            //   console.log(res);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (likeState[index] === true) {
        axios
          .post(`/like/create`, {
            itemId: itemId[index],
            email: sessionStorage.getItem("email"),
          })
          .then((res) => {
            //  console.log(res);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  }, [checkLikeOrNot, update]);

  const Like = ({ likeState, index }) => {
    const id = itemId[itemId.length - 1 - index];

    if (likeState[index] === true || likeState[index] === undefined) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="red"
          class="bi bi-heart-fill "
          viewBox="0 0 16 16"
          style={{ cursor: "pointer" }}
          onClick={handleHeartClick}
          data-id={id}
          data-index={index}
        >
          <path
            data-id={id}
            data-index={index}
            fill-rule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
          />
        </svg>
      );
    } else if (likeState[index] === false) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-heart"
          viewBox="0 0 16 16"
          onClick={handleHeartClick}
          style={{ cursor: "pointer" }}
          data-id={id}
          data-index={index}
        >
          <path
            data-id={id}
            data-index={index}
            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
          />
        </svg>
      );
    }
  };
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={"찜목록"} goUpdate={goUpdate} />
        {finish === false ? (
          <Animation />
        ) : (
          <div style={{ marginTop: "130px" }}>
            <div>
              <div className="Likecontent">
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    zIndex: 99,
                    width: "556px",
                    display: "block",
                    background: "white",
                  }}
                >
                  <div
                    className="filter"
                    style={{
                      position: "fixed",
                      top: 64,
                      zIndex: 99,
                      width: "556px",
                      display: "block",
                      background: "white",
                      paddingTop: "5px",
                      height: "80px",
                    }}
                  >
                    <div style={{ marginLeft: "5px" }}>
                      <div class="dropdown margin left">
                        <button
                          class="btn btn-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {selectedItem}
                        </button>

                        <ul class="dropdown-menu">
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={() => handleItemClick("전체")}
                            >
                              전체
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={() => handleItemClick("웨딩홀")}
                            >
                              웨딩홀
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={() => handleItemClick("스튜디오")}
                            >
                              스튜디오
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={() => handleItemClick("의상")}
                            >
                              의상
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={() => handleItemClick("메이크업")}
                            >
                              메이크업
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={() => handleItemClick("신혼여행")}
                            >
                              신혼여행
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={() => handleItemClick("부케")}
                            >
                              부케
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div
                      style={{
                        marginRight: "8px",
                      }}
                    >
                      <div class="dropdown  right-sort">
                        <button
                          class="btn btn-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {selectedSort}
                        </button>
                        <ul class="dropdown-menu sortItem">
                          <li className="">
                            <button
                              class="dropdown-item "
                              type="button"
                              onClick={() => handleSortClick("가나다순")}
                            >
                              가나다순
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={() => handleSortClick("인기순")}
                            >
                              인기순
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              type="button"
                              onClick={() => handleSortClick("최신순")}
                            >
                              최신순
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="container text-center">
                  <div class="row row-cols-2">
                    {/* 이미지카드 */}
                    {keyIndex.length === 0 ? (
                      <div
                        class="text-start"
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.5em",
                          marginTop: "40px",
                        }}
                      >
                        결과가 없습니다.
                      </div>
                    ) : (
                      keyIndex.map((i) => (
                        <div class="col">
                          <div class="card margT">
                            <img
                              style={{ height: "230px" }}
                              src={previewImg[i]}
                              class="card-img-top"
                              alt="..."
                            />
                            <div class="card-body">
                              <p class="card-text">
                                {itemName[i]} &nbsp;&nbsp;
                                <div className="likeListBtn1">
                                  <Like likeState={likeState} index={i} />
                                </div>
                                {itemLike[i]}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {/* 이미지카드 */}
                  </div>
                  <br />
                </div>
              </div>
            </div>
            <div style={{ positon: "fixed", bottom: 0, right: 100 }}>
              <div style={{ width: "100%", height: 150, position: "relative" }}>
                <div
                  style={{ position: "absolute", bottom: "110px", right: 0 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      marginRight: "20px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}

export default LikeList;
