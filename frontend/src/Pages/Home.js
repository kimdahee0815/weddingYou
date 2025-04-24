import "../Css/main.css";
import "../Css/Home.css";
import Footer from "../Components/Footer";
import imgLogo from "../Assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import Animation from "../Components/Animation";
import Sidesection from "../Components/Sidesection";

import axios from "axios";

const category = [
  "웨딩홀",
  "스튜디오",
  "의상",
  "메이크업",
  "신혼여행",
  "부케",
];
const englishCategory = [
  "weddingHall",
  "studio",
  "clothes",
  "makeup",
  "honeymoon",
  "bouquet",
];
function Home() {
  
  const navigate = useNavigate();

  const [searchItem, setSearchItem] = useState("");
  const [checkLike, setCheckLike] = useState(false);
  const [wholeItems, setWholeItems] = useState([]);

  const [likseSelect, setLikeSelect] = useState(false);
  const [modalBackgroundColor, setChangeModalBackgroundColor] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectLikeState, setSelectLikeState] = useState(undefined);

  const modalImg = useRef();
  const modalImgContent = useRef();
  const modalImgTitle = useRef();
  const modalItemId = useRef();

  const [currentSrc, setCurrentSrc] = useState("");
  const [currentItemId, setCurrentItemId] = useState("");

  const [finish, setFinish] = useState(false);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // 엔터키로 이동
      navigate(`/searchItems`, { state: { keyword: searchItem } });
    }
  };
  const handleChange = (event) => {
    setSearchItem(event.target.value);
  };

  const gotoDetailInfo = (e) => {
    navigate("/imgDetail", {
      state: { itemId: currentItemId, imgsrc: currentSrc },
    });
  };

  useEffect(() => {
    const buttons = document.querySelectorAll(".carousel-control-next");
    setTimeout(() => {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].click();
      }
    }, 5000);
  }, [finish]);
  useEffect(() => {
    const getWholeItems = async () =>{
      try {
        const promises = category.map(c => {
          console.log(c)
          return axios.get(`/item/itemList/${c}`)     
        }          
        )
        const responses = await Promise.all(promises);
        let items = responses.map(res => res.data);
        console.log(items)
        setWholeItems(items.map(itemList => itemList.map(item => ({
          ...item,
          likeCount:item.like?.length,
          isLiked: item.like?.some(like => 
            like.user?.email === sessionStorage.getItem("email") ||
            like.planner?.email === sessionStorage.getItem("email")
          )
        }))));
        setFinish(true);
      } catch (error) {
        console.log(error);
        setFinish(true);
      }
    }
    getWholeItems();
  }, []);

  // const showimgDetail = (e) => {
  //   modalImg.current.src = e.target.dataset.bsSrc;
  //   setCurrentSrc(e.target.dataset.bsSrc);
  //   const index = e.target.dataset.bsKeyindex;
  //   modalItemId.current.id = e.target.dataset.bsItemid;
  //   setCurrentItemId(e.target.dataset.bsItemid);
  //   modalItemId.current.dataset.index = index;
  //   setSelectedCategory(e.target.dataset.bsCategory);

  //   if (e.target.dataset.bsCategory === category[0]) {
  //     modalItemId.current.dataset.category = category[0];
  //     modalImgContent.current.innerText = item[index].imgContent;
  //     modalImgTitle.current.innerText = `- ${item[index].itemName} -`;
  //     setSelectLikeState(weddingHallLikeState[index]);
  //     if (weddingHallLikeState[index] === true) {
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       setChangeModalBackgroundColor(true);
  //     } else {
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       setChangeModalBackgroundColor(false);
  //     }
  //   } else if (e.target.dataset.bsCategory === category[1]) {
  //     modalItemId.current.dataset.category = category[1];
  //     modalImgContent.current.innerText = studioItem[index].imgContent;
  //     modalImgTitle.current.innerText = `- ${studioItem[index].itemName} -`;
  //     setSelectLikeState(studioLikeState[index]);
  //     if (studioLikeState[index] === true) {
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       setChangeModalBackgroundColor(true);
  //     } else {
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       setChangeModalBackgroundColor(false);
  //     }
  //   } else if (e.target.dataset.bsCategory === category[2]) {
  //     modalItemId.current.dataset.category = category[2];
  //     modalImgContent.current.innerText = dressItem[index].imgContent;
  //     modalImgTitle.current.innerText = `- ${dressItem[index].itemName} -`;
  //     setSelectLikeState(dressLikeState[index]);
  //     if (dressLikeState[index] === true) {
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       setChangeModalBackgroundColor(true);
  //     } else {
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       setChangeModalBackgroundColor(false);
  //     }
  //   } else if (e.target.dataset.bsCategory === category[3]) {
  //     modalItemId.current.dataset.category = category[3];
  //     modalImgContent.current.innerText = makeupItem[index].imgContent;
  //     modalImgTitle.current.innerText = `- ${makeupItem[index].itemName} -`;
  //     setSelectLikeState(makeupLikeState[index]);
  //     if (makeupLikeState[index] === true) {
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       setChangeModalBackgroundColor(true);
  //     } else {
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       setChangeModalBackgroundColor(false);
  //     }
  //   } else if (e.target.dataset.bsCategory === category[4]) {
  //     modalItemId.current.dataset.category = category[4];
  //     modalImgContent.current.innerText = honeyMoonItem[index].imgContent;
  //     modalImgTitle.current.innerText = `- ${honeyMoonItem[index].itemName} -`;
  //     setSelectLikeState(honeyMoonLikeState[index]);
  //     if (honeyMoonLikeState[index] === true) {
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       setChangeModalBackgroundColor(true);
  //     } else {
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       setChangeModalBackgroundColor(false);
  //     }
  //   } else if (e.target.dataset.bsCategory === category[5]) {
  //     modalItemId.current.dataset.category = category[5];
  //     modalImgContent.current.innerText = bouquetItem[index].imgContent;
  //     modalImgTitle.current.innerText = `- ${bouquetItem[index].itemName} -`;

  //     setSelectLikeState(bouquetLikeState[index]);
  //     if (bouquetLikeState[index] === true) {
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       setChangeModalBackgroundColor(true);
  //     } else {
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       setChangeModalBackgroundColor(false);
  //     }
  //   }
  // };

  // const manageLikeList = (e) => {
  //   let newlikeState = undefined;
  //   const index = modalItemId.current.dataset.index;

  //   setCheckLike(!checkLike);
  //   if (modalItemId.current.dataset.category === category[0]) {
  //     newlikeState = [...weddingHallLikeState];
  //     let prevState = newlikeState.slice(index, index + 1);
  //     let changedState = undefined;
  //     if (prevState[0] === true) {
  //       setSelectLikeState(false);
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       changedState = false;
  //       itemLike[index]--;
  //     } else if (prevState[0] === false) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       itemLike[index]++;
  //     } else if (prevState[0] === undefined) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       itemLike[index]++;
  //     } else {
  //       alert("찜하기 버튼을 이용하려면 로그인하세요!");
  //       changedState = -1;
  //     }
  //     newlikeState.splice(index, 1, changedState);
  //     setWeddingHallLikeState(newlikeState);
  //   } else if (modalItemId.current.dataset.category === category[1]) {
  //     newlikeState = [...studioLikeState];
  //     let prevState = newlikeState.slice(index, index + 1);
  //     let changedState = undefined;
  //     if (prevState[0] === true) {
  //       setSelectLikeState(false);
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       changedState = false;
  //       studioItemLike[index]--;
  //     } else if (prevState[0] === false) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       studioItemLike[index]++;
  //     } else if (prevState[0] === undefined) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       studioItemLike[index]++;
  //     } else {
  //       alert("찜하기 버튼을 이용하려면 로그인하세요!");
  //       changedState = -1;
  //     }
  //     newlikeState.splice(index, 1, changedState);
  //     setStudioLikeState(newlikeState);
  //   } else if (modalItemId.current.dataset.category === category[2]) {
  //     newlikeState = [...dressLikeState];
  //     let prevState = newlikeState.slice(index, index + 1);
  //     let changedState = undefined;
  //     if (prevState[0] === true) {
  //       setSelectLikeState(false);
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       changedState = false;
  //       dressItemLike[index]--;
  //     } else if (prevState[0] === false) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       dressItemLike[index]++;
  //     } else if (prevState[0] === undefined) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       dressItemLike[index]++;
  //     } else {
  //       alert("찜하기 버튼을 이용하려면 로그인하세요!");
  //       changedState = -1;
  //     }
  //     newlikeState.splice(index, 1, changedState);
  //     setDressLikeState(newlikeState);
  //   } else if (modalItemId.current.dataset.category === category[3]) {
  //     newlikeState = [...makeupLikeState];
  //     let prevState = newlikeState.slice(index, index + 1);
  //     let changedState = undefined;
  //     if (prevState[0] === true) {
  //       setSelectLikeState(false);
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       changedState = false;
  //       makeupItemLike[index]--;
  //     } else if (prevState[0] === false) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       makeupItemLike[index]++;
  //     } else if (prevState[0] === undefined) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       makeupItemLike[index]++;
  //     } else {
  //       alert("찜하기 버튼을 이용하려면 로그인하세요!");
  //       changedState = -1;
  //     }
  //     newlikeState.splice(index, 1, changedState);
  //     setMakeupLikeState(newlikeState);
  //   } else if (modalItemId.current.dataset.category === category[4]) {
  //     newlikeState = [...honeyMoonLikeState];
  //     let prevState = newlikeState.slice(index, index + 1);
  //     let changedState = undefined;
  //     if (prevState[0] === true) {
  //       setSelectLikeState(false);
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       changedState = false;
  //       honeyMoonItemLike[index]--;
  //     } else if (prevState[0] === false) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       honeyMoonItemLike[index]++;
  //     } else if (prevState[0] === undefined) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       honeyMoonItemLike[index]++;
  //     } else {
  //       alert("찜하기 버튼을 이용하려면 로그인하세요!");
  //       changedState = -1;
  //     }
  //     newlikeState.splice(index, 1, changedState);
  //     setHoneyMoonLikeState(newlikeState);
  //   } else if (modalItemId.current.dataset.category === category[5]) {
  //     newlikeState = [...bouquetLikeState];
  //     let prevState = newlikeState.slice(index, index + 1);
  //     let changedState = undefined;
  //     if (prevState[0] === true) {
  //       setSelectLikeState(false);
  //       modalItemId.current.style.backgroundColor = "#ebebeb";
  //       changedState = false;
  //       bouquetItemLike[index]--;
  //     } else if (prevState[0] === false) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       bouquetItemLike[index]++;
  //     } else if (prevState[0] === undefined) {
  //       setSelectLikeState(true);
  //       modalItemId.current.style.backgroundColor = "#fce1e4";
  //       changedState = true;
  //       bouquetItemLike[index]++;
  //     } else {
  //       alert("찜하기 버튼을 이용하려면 로그인하세요!");
  //       changedState = -1;
  //     }
  //     newlikeState.splice(index, 1, changedState);
  //     setBouquetLikeState(newlikeState);
  //   }
  // };

  // useEffect(() => {
  //   if (selectedCategory === category[0]) {
  //     keyIndex.forEach((index) => {
  //       if (weddingHallLikeState[index] === false) {
  //         // console.log("deleteitem:" + itemId[index]);
  //         setChangeModalBackgroundColor(false);
  //         axios
  //           .post(`/like/delete`, {
  //             itemId: itemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             // console.log("delete");
  //             // console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       } else if (weddingHallLikeState[index] === true) {
  //         setChangeModalBackgroundColor(true);
  //         axios
  //           .post(`/like/create`, {
  //             itemId: itemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             // console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       }
  //     });
  //   } else if (selectedCategory === category[1]) {
  //     studioKeyIndex.forEach((index) => {
  //       if (studioLikeState[index] === false) {
  //         setChangeModalBackgroundColor(false);
  //         // console.log("deleteitem:" + studioItemId[index]);
  //         axios
  //           .post(`/like/delete`, {
  //             itemId: studioItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             // console.log("delete");
  //             // console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       } else if (studioLikeState[index] === true) {
  //         setChangeModalBackgroundColor(true);
  //         axios
  //           .post(`/like/create`, {
  //             itemId: studioItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             // console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       }
  //     });
  //   } else if (selectedCategory === category[2]) {
  //     dressKeyIndex.forEach((index) => {
  //       if (dressLikeState[index] === false) {
  //         setChangeModalBackgroundColor(false);
  //         //   console.log("deleteitem:" + dressItemId[index]);
  //         axios
  //           .post(`/like/delete`, {
  //             itemId: dressItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             //   console.log("delete");
  //             //   console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       } else if (dressLikeState[index] === true) {
  //         setChangeModalBackgroundColor(true);
  //         axios
  //           .post(`/like/create`, {
  //             itemId: dressItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             //   console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       }
  //     });
  //   } else if (selectedCategory === category[3]) {
  //     makeupKeyIndex.forEach((index) => {
  //       if (makeupLikeState[index] === false) {
  //         setChangeModalBackgroundColor(false);
  //         // console.log("deleteitem:" + makeupItemId[index]);
  //         axios
  //           .post(`/like/delete`, {
  //             itemId: makeupItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             //  console.log("delete");
  //             //  console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       } else if (makeupLikeState[index] === true) {
  //         setChangeModalBackgroundColor(true);
  //         axios
  //           .post(`/like/create`, {
  //             itemId: makeupItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             //    console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       }
  //     });
  //   } else if (selectedCategory === category[4]) {
  //     honeyMoonKeyIndex.forEach((index) => {
  //       if (honeyMoonLikeState[index] === false) {
  //         setChangeModalBackgroundColor(false);
  //         //  console.log("deleteitem:" + honeyMoonItemId[index]);
  //         axios
  //           .post(`/like/delete`, {
  //             itemId: honeyMoonItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             //   console.log("delete");
  //             //   console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       } else if (honeyMoonLikeState[index] === true) {
  //         setChangeModalBackgroundColor(true);
  //         axios
  //           .post(`/like/create`, {
  //             itemId: honeyMoonItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             //     console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       }
  //     });
  //   } else if (selectedCategory === category[5]) {
  //     bouquetKeyIndex.forEach((index) => {
  //       if (bouquetLikeState[index] === false) {
  //         setChangeModalBackgroundColor(false);
  //         //  console.log("deleteitem:" + bouquetItemId[index]);
  //         axios
  //           .post(`/like/delete`, {
  //             itemId: bouquetItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             //  console.log("delete");
  //             //  console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       } else if (bouquetLikeState[index] === true) {
  //         setChangeModalBackgroundColor(true);
  //         axios
  //           .post(`/like/create`, {
  //             itemId: bouquetItemId[index],
  //             email: sessionStorage.getItem("email"),
  //           })
  //           .then((res) => {
  //             //   console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //       }
  //     });
  //   }
  // }, [checkLike]);

  const onScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="containerbox">
      <div className="mainlayout box1" style={{ position: "relative" }}>
        {window.scrollY !== 0 ? (
          <div
            className="header "
            style={{
              position: "fixed",
              top: 0,
              width: "556px",
              zIndex: 99,
              background: "white",
              borderRadius: "10px 10px 0 0",
            }}
          >
            {sessionStorage.getItem("email") !== null ? (
              <img
                className="mainlogo"
                src={imgLogo}
                style={{ cursor: "pointer" }}
                alt="로고"
                data-bs-toggle="modal"
                data-bs-target="#logoutmodal"
              />
            ) : (
              <img
                className="mainlogo"
                src={imgLogo}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/login");
                }}
                alt="로고"
              />
            )}

            <input
              type="text"
              name="search"
              className="searchbar"
              placeholder="검색어를 입력하세요!"
              value={searchItem}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
            <div
              className="likeListBtn"
              onClick={() => {
                navigate("/likeList", { state: { originalLocation: "home" } });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                class="bi bi-heart likeicon"
                viewBox="0 0 16 16"
              >
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                class="bi bi-heart-fill likeiconfill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div
            className="header "
            style={{
              position: "fixed",
              top: 0,
              borderRadius: "10px 10px 0 0",
              zIndex: 99,
              background: "white",
              width: "556px",
            }}
          >
            {sessionStorage.getItem("email") !== null ? (
              <img
                className="mainlogo"
                src={imgLogo}
                style={{ cursor: "pointer" }}
                alt="로고"
                data-bs-toggle="modal"
                data-bs-target="#logoutmodal"
              />
            ) : (
              <img
                className="mainlogo"
                src={imgLogo}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/login");
                }}
                alt="로고"
              />
            )}
            <input
              type="text"
              name="search"
              className="searchbar"
              placeholder="검색어를 입력하세요!"
              value={searchItem}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
            <div
              className="likeListBtn"
              onClick={() => {
                navigate("/likeList", { state: { originalLocation: "home" } });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                class="bi bi-heart likeicon"
                viewBox="0 0 16 16"
              >
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                class="bi bi-heart-fill likeiconfill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                />
              </svg>
            </div>
          </div>
        )}
        {finish === false ? (
          <Animation />
        ) : (
          <div>
            <div className="NavBar">
              <nav
                id="navbar-example2"
                class="navbar bg-light px-3 mb-3"
                style={{
                  position: "fixed",
                  top: 80,
                  zIndex: 99,
                  background: "white",
                }}
              >
                <ul class="nav sortingList" style={{ width: "525px" }}>
                  <li class="nav-item">
                    <div
                      class="nav-link"
                      onClick={() => {
                        window.scrollTo({ top: 20 });
                      }}
                      style={{ cursor: "pointer" }}
                      // href="#scrollspyHeading1"
                    >
                      웨딩홀
                    </div>
                  </li>
                  <li class="nav-item">
                    <div
                      class="nav-link"
                      onClick={() => {
                        window.scrollTo({
                          top: 500,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                      style={{ cursor: "pointer" }}
                      //   href="#scrollspyHeading2"
                    >
                      스튜디오
                    </div>
                  </li>
                  <li class="nav-item">
                    <div
                      class="nav-link"
                      onClick={() => {
                        window.scrollTo({
                          top: 1070,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      의상
                    </div>
                  </li>
                  <li class="nav-item">
                    <div
                      class="nav-link"
                      onClick={() => {
                        window.scrollTo({
                          top: 1730,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      메이크업
                    </div>
                  </li>
                  <li class="nav-item">
                    <div
                      class="nav-link"
                      onClick={() => {
                        window.scrollTo({
                          top: 2370,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      신혼여행
                    </div>
                  </li>
                  <li class="nav-item">
                    <div
                      class="nav-link"
                      onClick={() => {
                        window.scrollTo({
                          top: 3300,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      부케
                    </div>
                  </li>
                </ul>
              </nav>
              <div
                data-bs-spy="scroll"
                data-bs-target="#navbar-example2"
                data-bs-root-margin="0px 0px -40%"
                data-bs-smooth-scroll="true"
                class="scrollspy-example bg-light p-3 rounded-2"
                tabindex="0"
                style={{ marginTop: "150px" }}
              >
                {wholeItems.map((items, categoryIndex) => 
                  <>
                  <h4 id={`scrollspyHeading${categoryIndex+1}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="red"
                    class="bi bi-suit-heart-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
                  </svg>
                  &nbsp;{`${englishCategory[categoryIndex]}`}&nbsp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="red"
                    class="bi bi-suit-heart-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
                  </svg>
                </h4>
                <br />
                  <div
                    id={`${englishCategory[categoryIndex]}Fade`}
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                    data-bs-interval="5000"
                  >
                    <div class="carousel-inner">
                    {items.length !== 0 ? 
                  items.map((item, itemIndex) => (
                      <div
                        class={itemIndex === 0 ? "carousel-item active": "carousel-item"}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "500px",
                          height: "600px",
                        }}
                        data-bs-interval="5000"
                        key={item.itemId}
                      >
                        <img
                          id="targetImg"
                          style={{
                            width: "400px",
                            height: "465px",
                            marginLeft: "25px",
                            cursor: "pointer",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#imgDetailModal"
                          data-bs-src={item.itemImg}
                          data-bs-category={category[categoryIndex]}
                          data-bs-keyIndex={itemIndex}
                          data-bs-itemId={item.itemId}
                          //onClick={showimgDetail}
                          src={item.itemImg}
                          alt="..."
                        />
                        <br />
                        <div
                          className="itemName"
                          style={{ marginTop: "-10px" }}
                        >
                          {item.itemName}&nbsp;&nbsp; ❤️
                          {item.likeCount}
                        </div>
                      </div>
                    )
                  ) : (
                    <div style={{ fontSize: "1.3em" }}>
                      아직 이미지가 없습니다!
                    </div>
                  )}
                    </div>
                    <button
                      class="carousel-control-prev"
                      type="button"
                      data-bs-target={`#${englishCategory[categoryIndex]}Fade`}
                      data-bs-slide="prev"
                    >
                      <span
                        class="carousel-control-prev-icon fadeBtnColor"
                        aria-hidden="true"
                      ></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button
                      class="carousel-control-next"
                      type="button"
                      data-bs-target={`#${englishCategory[categoryIndex]}Fade`}
                      data-bs-slide="next"
                    >
                      <span
                        class="carousel-control-next-icon fadeBtnColor"
                        aria-hidden="true"
                      ></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                  </div>

                <br />
                </>
                )}
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
                            {selectLikeState === true ? (
                              <button
                                style={{
                                  marginLeft: "240px",
                                  width: "130px",
                                  marginBottom: "10px",
                                  fontSize: "1em",
                                  backgroundColor: "##fce1e4",
                                  border: "grey 1px solid",
                                }}
                                ref={modalItemId}
                               // onClick={manageLikeList}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="red"
                                  class="bi bi-heart-fill "
                                  viewBox="0 0 16 16"
                                  style={{ cursor: "pointer" }}
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                                  />
                                </svg>{" "}
                                찜하기
                              </button>
                            ) : (
                              <button
                                style={{
                                  marginLeft: "240px",
                                  width: "130px",
                                  marginBottom: "10px",
                                  fontSize: "1em",
                                  backgroundColor: "#ebebeb",
                                  border: "grey 1px solid",
                                }}
                                ref={modalItemId}
                               // onClick={manageLikeList}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="currentColor"
                                  class="bi bi-heart"
                                  viewBox="0 0 16 16"
                                  style={{ cursor: "pointer" }}
                                >
                                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                </svg>{" "}
                                찜하기
                              </button>
                            )}
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
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                          onClick={gotoDetailInfo}
                        >
                          상세정보 페이지 이동
                        </button>
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

                <br />
              </div>
              <div
                style={{
                  width: "560px",
                  position: "fixed",
                  bottom: "120px",
                  height: "50px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  alignItems: "end",
                  paddingRight: "23px",
                  paddingLeft: "50px",
                  paddingBottom: "10px",
                  zIndex: "999",
                }}
              >
                {window.sessionStorage.getItem("category") === "user" && (
                  <div style={{}}>
                    <div className="estimate-write-btn">
                      <i
                        class="bi bi-pencil-square"
                        style={{ marginLeft: "50px", zIndex: "999" }}
                      ></i>
                      <div
                        className="estimate-write-btn-overlay"
                        onClick={() => {
                          navigate("/estimateform");
                        }}
                        style={{
                          marginRight: "-20px",
                          marginLeft: "12px",
                          zIndex: "999",
                          height: "50px",
                        }}
                      >
                        <span>견적작성하기</span>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="scrolltop"
                  onClick={() => {
                    onScrollTop();
                  }}
                  style={{ marginRight: "5px" }}
                >
                  <i class="bi bi-chevron-up"></i>
                </div>
              </div>
            </div>
            <div style={{ height: 94.19 }}></div>
          </div>
        )}
        <Footer />
        <div
          class="modal fade"
          id="logoutmodal"
          tabindex="-1"
          aria-labelledby="logoutmodal"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  로그아웃
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body" style={{ fontSize: 26 }}>
                로그아웃하시겠습니까?
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    sessionStorage.clear();
                    navigate("/login");
                  }}
                >
                  네
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  아니요
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}

export default Home;
