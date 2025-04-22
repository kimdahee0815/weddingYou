import "../Css/main.css";
import "../Css/Home.css";
import Footer from "../Components/Footer";
import imgLogo from "../Assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow, Pagination } from "swiper";
import Animation from "../Components/Animation";
import Sidesection from "../Components/Sidesection";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

function SearchItems() {
  const navigate = useNavigate();

  const { keyword } = useLocation().state;

  const [searchedKeyword, setSearchedKeyWord] = useState(keyword);
  const [itemLike, setItemLike] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemDate, setItemDate] = useState("");
  // console.log(keyword);
  const [previewImg, setPreviewImg] = useState([]);
  const [itemId, setItemId] = useState([]);
  const [item, setItem] = useState([]);
  const [itemName, setItemName] = useState([]);
  const [itemContent, setItemContent] = useState([]);
  const [itemLikeState, setItemLikeState] = useState([]);

  const [weddingHallLike, setWeddingHallLike] = useState([]);
  const [keyIndex, setKeyIndex] = useState([]);

  const [weddingHallItem, setWeddingHallItem] = useState([]);
  const [weddingHallItemId, setWeddingHallItemId] = useState([]);
  const [weddingHallLikeState, setWeddingHallLikeState] = useState([]);
  const [weddingHallName, setWeddingHallName] = useState([]);
  const [weddingHallImgContent, setWeddingHallImgContent] = useState([]);
  let keyIndexArr = [];
  let list = [];
  let itemDataArr = [];
  let itemDateArr = [];
  let previewImgArr = [];
  let likeIndexArr = [];

  const [studioImg, setStudioImg] = useState([]);
  const [studioItemId, setStudiItemId] = useState([]);
  const [studioItem, setStudioItem] = useState([]);
  const [studioItemName, setStudioItemName] = useState([]);
  const [studioItemLike, setStudioItemLike] = useState([]);
  const [studioKeyIndex, setStudioKeyIndex] = useState([]);
  const [studioLikeState, setStudioLikeState] = useState([]);
  const [studioImgContent, setStudioImgContent] = useState([]);
  let keyIndexArr1 = [];
  let list1 = [];
  let itemDataArr1 = [];
  let previewImgArr1 = [];
  let likeIndexArr1 = [];

  const [dressImg, setDressImg] = useState([]);
  const [dressItemId, setDressItemId] = useState([]);
  const [dressItem, setDressItem] = useState([]);
  const [dressItemName, setDressItemName] = useState([]);
  const [dressItemLike, setDressItemLike] = useState([]);
  const [dressKeyIndex, setDressKeyIndex] = useState([]);
  const [dressLikeState, setDressLikeState] = useState([]);
  const [dressImgContent, setDressImgContent] = useState([]);
  let keyIndexArr2 = [];
  let list2 = [];
  let itemDataArr2 = [];
  let previewImgArr2 = [];
  let likeIndexArr2 = [];

  const [makeupImg, setMakeupImg] = useState([]);
  const [makeupItemId, setMakeupItemId] = useState([]);
  const [makeupItem, setMakeupItem] = useState([]);
  const [makeupItemName, setMakeupItemName] = useState([]);
  const [makeupItemLike, setMakeupItemLike] = useState([]);
  const [makeupKeyIndex, setMakeupKeyIndex] = useState([]);
  const [makeupLikeState, setMakeupLikeState] = useState([]);
  const [makeupImgContent, setMakeupImgContent] = useState([]);
  let keyIndexArr3 = [];
  let list3 = [];
  let itemDataArr3 = [];
  let previewImgArr3 = [];
  let likeIndexArr3 = [];

  const [honeyMoonImg, setHoneyMoonImg] = useState([]);
  const [honeyMoonItemId, setHoneyMoonItemId] = useState([]);
  const [honeyMoonItem, setHoneyMoonItem] = useState([]);
  const [honeyMoonItemName, setHoneyMoonItemName] = useState([]);
  const [honeyMoonItemLike, setHoneyMoonItemLike] = useState([]);
  const [honeyMoonKeyIndex, setHoneyMoonKeyIndex] = useState([]);
  const [honeyMoonLikeState, setHoneyMoonLikeState] = useState([]);
  const [honeyMoonImgContent, setHoneyMoonImgContent] = useState([]);
  let keyIndexArr4 = [];
  let list4 = [];
  let itemDataArr4 = [];
  let previewImgArr4 = [];
  let likeIndexArr4 = [];

  const [bouquetImg, setBouquetImg] = useState([]);
  const [bouquetItemId, setBouquetItemId] = useState([]);
  const [bouquetItem, setBouquetItem] = useState([]);
  const [bouquetItemName, setBouquetItemName] = useState([]);
  const [bouquetItemLike, setBouquetItemLike] = useState([]);
  const [bouquetKeyIndex, setBouquetKeyIndex] = useState([]);
  const [bouquetLikeState, setBouquetLikeState] = useState([]);
  const [bouquetImgContent, setBouquetImgContent] = useState([]);
  let keyIndexArr5 = [];
  let list5 = [];
  let itemDataArr5 = [];
  let previewImgArr5 = [];
  let likeIndexArr5 = [];

  const [searchingKeyword, setSearchingKeyWord] = useState(keyword);

  const [countIndex, setCountIndex] = useState([]);

  const modalImg = useRef();
  const modalImgContent = useRef();
  const modalImgTitle = useRef();
  const modalItemId = useRef();

  const [selectLikeState, setSelectLikeState] = useState(undefined);
  const [modalBackgroundColor, setChangeModalBackgroundColor] = useState(false);
  const [checkLike, setCheckLike] = useState(false);
  const [finish, setFinish] = useState(false);

  const [update, setUpdate] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // 엔터키로 이동
      setSearchedKeyWord(searchingKeyword);
    }
  };

  const handleChange = (e) => {
    // console.log(e.target.value);
    setSearchingKeyWord(e.target.value);
  };

  useEffect(() => {
    axios
      .post(`/item/search/${searchedKeyword}`, {
        email: sessionStorage.getItem("email"),
      })
      .then((res) => {
        const dataList = res.data;
        console.log(dataList);
        //console.log(dataList);
        if (dataList.length !== 0) {
          let count = 0;
          let countArr = [];
          let itemNameList = [];
          let itemContentList = [];
          let itemLikeList = [];
          let itemLikeStateList = [];
          setUpdate(true);
          for (var i = 0; i < dataList.length; ) {
            if (dataList[i] === "/") {
              countArr.push(count);
              setCountIndex(countArr);
              count = 0;
              i++;
            } else {
              let index = i;
              count++;
              //이미지
              let dataUrl = "data:image/jpeg;base64," + dataList[i];
              previewImgArr.push(dataUrl);
              setPreviewImg(previewImgArr);
              i++;
              //itemId

              let newitemId = dataList[i];
              list.push(newitemId);
              setItemId(list);
              // keyIndexArr.push(index);
              // index++;
              // setKeyIndex(keyIndexArr);
              // likeIndexArr.push(true);
              // setLikeState(likeIndexArr);

              // axios
              //   .get(`/item/getItemList/${newitemId}`)
              //   .then((res) => {
              //     let newItem = res.data;
              //     itemDataArr.push(newItem);

              //     itemDataArr.sort(function (a, b) {
              //       if (a.category1 === b.category1) {
              //         return (
              //           new Date(b.itemWriteDate) - new Date(a.itemWriteDate)
              //         );
              //       }
              //     });
              //     setItem([...item, newItem]);
              //     setItem(itemDataArr);
              //   })
              //   .catch((e) => {
              //     console.log(e);
              //   });
              i++;
              itemNameList.push(dataList[i]);
              setItemName(itemNameList);
              i++;
              itemContentList.push(dataList[i]);
              setItemContent(itemContentList);
              i++;
              itemLikeList.push(parseInt(dataList[i]));
              setItemLike(itemLikeList);
              i++;
              itemLikeStateList.push(parseInt(dataList[i]));
              setItemLikeState(itemLikeStateList);
              i++;
            }
          }
          setFinish(true);
        } else {
          let countArr = [0, 0, 0, 0, 0, 0];
          setCountIndex(countArr);
          setPreviewImg([]);
          setItemLike([]);
          setItemName([]);
          setItemContent([]);
          setItemLikeState([]);
          setFinish(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [searchedKeyword]);

  useEffect(() => {
    let count = 0;

    for (var i = 0; i < countIndex.length; i++) {
      let itemCount = countIndex.at(i);
      let keyIndexArr = [];
      let keyIndexArr1 = [];
      let keyIndexArr2 = [];
      let keyIndexArr3 = [];
      let keyIndexArr4 = [];
      let keyIndexArr5 = [];
      let likeStateArr = [];
      let likeStateArr1 = [];
      let likeStateArr2 = [];
      let likeStateArr3 = [];
      let likeStateArr4 = [];
      let likeStateArr5 = [];
      let likeCountArr = [];
      let likeCountArr1 = [];
      let likeCountArr2 = [];
      let likeCountArr3 = [];
      let likeCountArr4 = [];
      let likeCountArr5 = [];

      if (i === 0) {
        //웨딩홀일때
        if (itemCount !== 0) {
          //likestateArr 값 전부 undefined해주기

          for (let k = 0; k < itemCount; k++) {
            likeStateArr.push(-1);
          }
        }
        let listId = itemId.slice(count, count + itemCount);
        for (let a = 0; a < itemCount; a++) {
          // axios
          //   .post(`/like/findlist`, {
          //     itemId: listId.at(a),
          //     email: sessionStorage.getItem("email"),
          //   })
          //   .then((res) => {
          //     if (res.data === 1) {
          //       likeStateArr[a] = true;
          //       setWeddingHallLikeState(likeStateArr);
          //     } else if (res.data === 0) {
          //       likeStateArr[a] = undefined;
          //       setWeddingHallLikeState(likeStateArr);
          //     } else {
          //       //로그인하지 않았을 때
          //       likeStateArr[a] = -1;
          //       setWeddingHallLikeState(likeStateArr);
          //     }
          //     setWeddingHallLikeState(likeStateArr);
          //   })
          //   .catch((e) => {
          //     console.log(e);
          //   });

          keyIndexArr.push(a);
        }
        setKeyIndex(keyIndexArr);
        setWeddingHallItemId(itemId.slice(count, count + itemCount));
        setWeddingHallLike(itemLike.slice(count, count + itemCount));
        setWeddingHallName(itemName.slice(count, count + itemCount));
        setWeddingHallItem(previewImg.slice(count, count + itemCount));
        setWeddingHallLikeState(itemLikeState.slice(count, count + itemCount));
        setWeddingHallImgContent(itemContent.slice(count, count + itemCount));
        count = count + itemCount;
      } else if (i === 1) {
        if (itemCount !== 0) {
          //likestateArr 값 전부 undefined해주기
          for (let k = 0; k < itemCount; k++) {
            likeStateArr1.push(-1);
          }
        }
        for (let b = 0; b < itemCount; b++) {
          // let listId = itemId.slice(count, count + itemCount);
          // axios
          //   .post(`/like/findlist`, {
          //     itemId: listId[b],
          //     email: sessionStorage.getItem("email"),
          //   })
          //   .then((res) => {
          //     if (res.data === 1) {
          //       likeStateArr1[b] = true;
          //     } else if (res.data === 0) {
          //       likeStateArr1[b] = undefined;
          //     } else {
          //       //로그인하지 않았을 때
          //       likeStateArr1[b] = -1;
          //     }
          //     setStudioLikeState(likeStateArr1);
          //   })
          //   .catch((e) => {
          //     console.log(e);
          //   });
          keyIndexArr1.push(b);
        }

        // likeCountArr1 = itemLike.slice(count, count + itemCount);
        setStudioKeyIndex(keyIndexArr1);
        setStudioItemLike(itemLike.slice(count, count + itemCount));
        setStudiItemId(itemId.slice(count, count + itemCount));
        setStudioItemName(itemName.slice(count, count + itemCount));
        setStudioItem(previewImg.slice(count, count + itemCount));
        setStudioImgContent(itemContent.slice(count, count + itemCount));
        setStudioLikeState(itemLikeState.slice(count, count + itemCount));
        count = count + itemCount;
      } else if (i === 2) {
        if (itemCount !== 0) {
          //likestateArr 값 전부 undefined해주기
          for (let k = 0; k < itemCount; k++) {
            likeStateArr2.push(-1);
          }
        }
        for (let c = 0; c < itemCount; c++) {
          let listId = itemId.slice(count, count + itemCount);
          // axios
          //   .post(`/like/findlist`, {
          //     itemId: listId[c],
          //     email: sessionStorage.getItem("email"),
          //   })
          //   .then((res) => {
          //     if (res.data === 1) {
          //       likeStateArr2[c] = true;
          //     } else if (res.data === 0) {
          //       likeStateArr2[c] = undefined;
          //     } else {
          //       //로그인하지 않았을 때
          //       likeStateArr2[c] = -1;
          //     }
          //     setStudioLikeState(likeStateArr2);
          //   })
          //   .catch((e) => {
          //     console.log(e);
          //   });
          keyIndexArr2.push(c);
        }

        // likeCountArr2 = itemLike.slice(count, count + itemCount);
        setDressKeyIndex(keyIndexArr2);
        setDressLikeState(itemLikeState.slice(count, count + itemCount));
        setDressItemLike(itemLike.slice(count, count + itemCount));
        setDressItemId(itemId.slice(count, count + itemCount));
        setDressItemName(itemName.slice(count, count + itemCount));
        setDressItem(previewImg.slice(count, count + itemCount));
        setDressImgContent(itemContent.slice(count, count + itemCount));
        count = count + itemCount;
      } else if (i === 3) {
        if (itemCount !== 0) {
          //likestateArr 값 전부 undefined해주기
          for (let k = 0; k < itemCount; k++) {
            likeStateArr3.push(-1);
          }
        }
        for (let d = 0; d < itemCount; d++) {
          // let listId = itemId.slice(count, count + itemCount);
          // axios
          //   .post(`/like/findlist`, {
          //     itemId: listId[d],
          //     email: sessionStorage.getItem("email"),
          //   })
          //   .then((res) => {
          //     if (res.data === 1) {
          //       likeStateArr3[d] = true;
          //     } else if (res.data === 0) {
          //       likeStateArr3[d] = undefined;
          //     } else {
          //       //로그인하지 않았을 때
          //       likeStateArr3[d] = -1;
          //     }
          //     setMakeupLikeState(likeStateArr3);
          //   })
          //   .catch((e) => {
          //     console.log(e);
          //   });
          keyIndexArr3.push(d);
        }
        //  likeCountArr3 = itemLike.slice(count, count + itemCount);
        setMakeupKeyIndex(keyIndexArr3);
        setMakeupItemLike(itemLike.slice(count, count + itemCount));
        setMakeupItemId(itemId.slice(count, count + itemCount));
        setMakeupItemName(itemName.slice(count, count + itemCount));
        setMakeupItem(previewImg.slice(count, count + itemCount));
        setMakeupImgContent(itemContent.slice(count, count + itemCount));
        setMakeupLikeState(itemLikeState.slice(count, count + itemCount));
        count = count + itemCount;
      } else if (i === 4) {
        if (itemCount !== 0) {
          //likestateArr 값 전부 undefined해주기
          for (let k = 0; k < itemCount; k++) {
            likeStateArr4.push(-1);
          }
        }
        for (let e = 0; e < itemCount; e++) {
          // let listId = itemId.slice(count, count + itemCount);
          // axios
          //   .post(`/like/findlist`, {
          //     itemId: listId[e],
          //     email: sessionStorage.getItem("email"),
          //   })
          //   .then((res) => {
          //     if (res.data === 1) {
          //       likeStateArr4[e] = true;
          //     } else if (res.data === 0) {
          //       likeStateArr4[e] = undefined;
          //     } else {
          //       //로그인하지 않았을 때
          //       likeStateArr4[e] = -1;
          //     }
          //     setHoneyMoonLikeState(likeStateArr4);
          //   })
          //   .catch((e) => {
          //     console.log(e);
          //   });
          keyIndexArr4.push(e);
        }
        //  likeCountArr4 = itemLike.slice(count, count + itemCount);
        setHoneyMoonKeyIndex(keyIndexArr4);
        setHoneyMoonItemLike(itemLike.slice(count, count + itemCount));
        setHoneyMoonItemId(itemId.slice(count, count + itemCount));
        setHoneyMoonItemName(itemName.slice(count, count + itemCount));
        setHoneyMoonItem(previewImg.slice(count, count + itemCount));
        setHoneyMoonImgContent(itemContent.slice(count, count + itemCount));
        setHoneyMoonLikeState(itemLikeState.slice(count, count + itemCount));
        count = count + itemCount;
      } else if (i === 5) {
        if (itemCount !== 0) {
          //likestateArr 값 전부 undefined해주기
          for (let k = 0; k < itemCount; k++) {
            likeStateArr5.push(-1);
          }
        }
        for (let f = 0; f < itemCount; f++) {
          // let listId = itemId.slice(count, count + itemCount);
          // axios
          //   .post(`/like/findlist`, {
          //     itemId: listId[f],
          //     email: sessionStorage.getItem("email"),
          //   })
          //   .then((res) => {
          //     if (res.data === 1) {
          //       likeStateArr5[f] = true;
          //     } else if (res.data === 0) {
          //       likeStateArr5[f] = undefined;
          //     } else {
          //       //로그인하지 않았을 때
          //       likeStateArr5[f] = -1;
          //     }
          //     setBouquetLikeState(likeStateArr5);
          //   })
          //   .catch((e) => {
          //     console.log(e);
          //   });
          keyIndexArr5.push(f);
        }
        //  likeCountArr5 = itemLike.slice(count, count + itemCount);
        setBouquetKeyIndex(keyIndexArr5);
        setBouquetItemLike(itemLike.slice(count, count + itemCount));
        setBouquetItemId(itemId.slice(count, count + itemCount));
        setBouquetItemName(itemName.slice(count, count + itemCount));
        setBouquetItem(previewImg.slice(count, count + itemCount));
        setBouquetImgContent(itemContent.slice(count, count + itemCount));
        setBouquetLikeState(itemLikeState.slice(count, count + itemCount));
        count = count + itemCount;
      }
    }
  }, [searchedKeyword, update, itemLike]);

  const showingDetail = (e) => {
    modalImg.current.src = e.target.dataset.bsSrc;
    const index = e.target.dataset.bsKeyindex;
    modalItemId.current.id = e.target.dataset.bsItemid;
    modalItemId.current.dataset.index = index;
    modalImgContent.current.innerText = e.target.dataset.bsItemcontent;
    modalImgTitle.current.innerText = `- ${e.target.dataset.bsItemname} -`;
    setSelectedCategory(e.target.dataset.bsCategory);

    modalItemId.current.dataset.category = e.target.dataset.bsCategory;

    if (e.target.dataset.bsCategory === "웨딩홀") {
      modalItemId.current.dataset.category = "웨딩홀";
      setSelectLikeState(weddingHallLikeState[index]);
      if (weddingHallLikeState[index] === 1) {
        modalItemId.current.style.backgroundColor = "#fce1e4";
        setChangeModalBackgroundColor(true);
      } else {
        modalItemId.current.style.backgroundColor = "#ebebeb";
        setChangeModalBackgroundColor(false);
      }
    } else if (e.target.dataset.bsCategory === "스튜디오") {
      modalItemId.current.dataset.category = "스튜디오";

      setSelectLikeState(studioLikeState[index]);
      if (studioLikeState[index] === 1) {
        modalItemId.current.style.backgroundColor = "#fce1e4";
        setChangeModalBackgroundColor(true);
      } else {
        modalItemId.current.style.backgroundColor = "#ebebeb";
        setChangeModalBackgroundColor(false);
      }
    } else if (e.target.dataset.bsCategory === "의상") {
      modalItemId.current.dataset.category = "의상";

      setSelectLikeState(dressLikeState[index]);
      if (dressLikeState[index] === 1) {
        modalItemId.current.style.backgroundColor = "#fce1e4";
        setChangeModalBackgroundColor(true);
      } else {
        modalItemId.current.style.backgroundColor = "#ebebeb";
        setChangeModalBackgroundColor(false);
      }
    } else if (e.target.dataset.bsCategory === "메이크업") {
      modalItemId.current.dataset.category = "메이크업";

      setSelectLikeState(makeupLikeState[index]);
      if (makeupLikeState[index] === 1) {
        modalItemId.current.style.backgroundColor = "#fce1e4";
        setChangeModalBackgroundColor(true);
      } else {
        modalItemId.current.style.backgroundColor = "#ebebeb";
        setChangeModalBackgroundColor(false);
      }
    } else if (e.target.dataset.bsCategory === "신혼여행") {
      modalItemId.current.dataset.category = "신혼여행";

      setSelectLikeState(honeyMoonLikeState[index]);
      if (honeyMoonLikeState[index] === 1) {
        modalItemId.current.style.backgroundColor = "#fce1e4";
        setChangeModalBackgroundColor(true);
      } else {
        modalItemId.current.style.backgroundColor = "#ebebeb";
        setChangeModalBackgroundColor(false);
      }
    } else if (e.target.dataset.bsCategory === "부케") {
      modalItemId.current.dataset.category = "부케";

      setSelectLikeState(bouquetLikeState[index]);
      if (bouquetLikeState[index] === 1) {
        modalItemId.current.style.backgroundColor = "#fce1e4";
        setChangeModalBackgroundColor(true);
      } else {
        modalItemId.current.style.backgroundColor = "#ebebeb";
        setChangeModalBackgroundColor(false);
      }
    }
  };

  const gotoDetailInfo = (e) => {
    navigate("/imgDetail");
  };

  const manageLikeList = (e) => {
    let newlikeState = undefined;
    const index = modalItemId.current.dataset.index;
    setCheckLike(!checkLike);
    if (modalItemId.current.dataset.category === "웨딩홀") {
      newlikeState = [...weddingHallLikeState];
      let prevState = newlikeState.slice(index, index + 1);
      let changedState = -1;
      if (prevState[0] === 1) {
        setSelectLikeState(0);
        modalItemId.current.style.backgroundColor = "#ebebeb";
        changedState = 0;
        weddingHallLike[index]--;
      } else if (prevState[0] === 0) {
        setSelectLikeState(1);
        modalItemId.current.style.backgroundColor = "#fce1e4";
        changedState = 1;
        weddingHallLike[index]++;
      } else if (prevState[0] === -1) {
        alert("찜하기 버튼을 이용하려면 로그인하세요!");
        changedState = -1;
      }
      newlikeState.splice(index, 1, changedState);
      setWeddingHallLikeState(newlikeState);
    } else if (modalItemId.current.dataset.category === "스튜디오") {
      newlikeState = [...studioLikeState];
      let prevState = newlikeState.slice(index, index + 1);
      let changedState = -1;
      if (prevState[0] === 1) {
        setSelectLikeState(0);
        modalItemId.current.style.backgroundColor = "#ebebeb";
        changedState = 0;
        studioItemLike[index]--;
      } else if (prevState[0] === 0) {
        setSelectLikeState(1);
        modalItemId.current.style.backgroundColor = "#fce1e4";
        changedState = 1;
        studioItemLike[index]++;
      } else {
        alert("찜하기 버튼을 이용하려면 로그인하세요!");
        changedState = -1;
      }
      newlikeState.splice(index, 1, changedState);
      setStudioLikeState(newlikeState);
    } else if (modalItemId.current.dataset.category === "의상") {
      newlikeState = [...dressLikeState];
      let prevState = newlikeState.slice(index, index + 1);
      let changedState = undefined;
      if (prevState[0] === 1) {
        setSelectLikeState(0);
        modalItemId.current.style.backgroundColor = "#ebebeb";
        changedState = 0;
        dressItemLike[index]--;
      } else if (prevState[0] === 0) {
        setSelectLikeState(1);
        modalItemId.current.style.backgroundColor = "#fce1e4";
        changedState = 1;
        dressItemLike[index]++;
      } else {
        alert("찜하기 버튼을 이용하려면 로그인하세요!");
        changedState = -1;
      }
      newlikeState.splice(index, 1, changedState);
      setDressLikeState(newlikeState);
    } else if (modalItemId.current.dataset.category === "메이크업") {
      newlikeState = [...makeupLikeState];
      let prevState = newlikeState.slice(index, index + 1);
      let changedState = undefined;
      if (prevState[0] === 1) {
        setSelectLikeState(0);
        modalItemId.current.style.backgroundColor = "#ebebeb";
        changedState = 0;
        makeupItemLike[index]--;
      } else if (prevState[0] === 0) {
        setSelectLikeState(1);
        modalItemId.current.style.backgroundColor = "#fce1e4";
        changedState = 1;
        makeupItemLike[index]++;
      } else {
        alert("찜하기 버튼을 이용하려면 로그인하세요!");
        changedState = -1;
      }
      newlikeState.splice(index, 1, changedState);
      setMakeupLikeState(newlikeState);
    } else if (modalItemId.current.dataset.category === "신혼여행") {
      newlikeState = [...honeyMoonLikeState];
      let prevState = newlikeState.slice(index, index + 1);
      let changedState = undefined;
      if (prevState[0] === 1) {
        setSelectLikeState(0);
        modalItemId.current.style.backgroundColor = "#ebebeb";
        changedState = 0;
        honeyMoonItemLike[index]--;
      } else if (prevState[0] === 0) {
        setSelectLikeState(1);
        modalItemId.current.style.backgroundColor = "#fce1e4";
        changedState = 1;
        honeyMoonItemLike[index]++;
      } else {
        alert("찜하기 버튼을 이용하려면 로그인하세요!");
        changedState = -1;
      }
      newlikeState.splice(index, 1, changedState);
      setHoneyMoonLikeState(newlikeState);
    } else if (modalItemId.current.dataset.category === "부케") {
      newlikeState = [...bouquetLikeState];
      let prevState = newlikeState.slice(index, index + 1);
      let changedState = undefined;
      if (prevState[0] === 1) {
        setSelectLikeState(0);
        modalItemId.current.style.backgroundColor = "#ebebeb";
        changedState = 0;
        bouquetItemLike[index]--;
      } else if (prevState[0] === 0) {
        setSelectLikeState(1);
        modalItemId.current.style.backgroundColor = "#fce1e4";
        changedState = 1;
        bouquetItemLike[index]++;
      } else {
        alert("찜하기 버튼을 이용하려면 로그인하세요!");
        changedState = -1;
      }
      newlikeState.splice(index, 1, changedState);
      setBouquetLikeState(newlikeState);
    }
  };

  useEffect(() => {
    if (selectedCategory === "웨딩홀") {
      keyIndex.forEach((index) => {
        if (weddingHallLikeState[index] === 0) {
          setChangeModalBackgroundColor(false);
          axios
            .post(`/like/delete`, {
              itemId: weddingHallItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("deleteitem:");
              console.log(itemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (weddingHallLikeState[index] === 1) {
          setChangeModalBackgroundColor(true);
          axios
            .post(`/like/create`, {
              itemId: weddingHallItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("createItem:");
              console.log(itemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    } else if (selectedCategory === "스튜디오") {
      studioKeyIndex.forEach((index) => {
        if (studioLikeState[index] === 0) {
          setChangeModalBackgroundColor(false);

          axios
            .post(`/like/delete`, {
              itemId: studioItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("deleteitem:");
              console.log(studioItemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (studioLikeState[index] === 1) {
          setChangeModalBackgroundColor(true);

          axios
            .post(`/like/create`, {
              itemId: studioItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("createItem:");
              console.log(studioItemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    } else if (selectedCategory === "의상") {
      dressKeyIndex.forEach((index) => {
        if (dressLikeState[index] === 0) {
          setChangeModalBackgroundColor(false);

          axios
            .post(`/like/delete`, {
              itemId: dressItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("deleteitem:");
              console.log(dressItemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (dressLikeState[index] === 1) {
          setChangeModalBackgroundColor(true);

          axios
            .post(`/like/create`, {
              itemId: dressItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("createItem:");
              console.log(dressItemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    } else if (selectedCategory === "메이크업") {
      makeupKeyIndex.forEach((index) => {
        if (makeupLikeState[index] === 0) {
          setChangeModalBackgroundColor(false);

          axios
            .post(`/like/delete`, {
              itemId: makeupItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("deleteitem:");
              console.log(makeupItemId[index]);
              console.log("delete");
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (makeupLikeState[index] === 1) {
          setChangeModalBackgroundColor(true);

          axios
            .post(`/like/create`, {
              itemId: makeupItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("createItem:");
              console.log(makeupItemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    } else if (selectedCategory === "신혼여행") {
      honeyMoonKeyIndex.forEach((index) => {
        if (honeyMoonLikeState[index] === 0) {
          setChangeModalBackgroundColor(false);

          axios
            .post(`/like/delete`, {
              itemId: honeyMoonItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("deleteitem:");
              console.log(honeyMoonItemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (honeyMoonLikeState[index] === 1) {
          setChangeModalBackgroundColor(true);

          axios
            .post(`/like/create`, {
              itemId: honeyMoonItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("createItem:");
              console.log(honeyMoonItemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    } else if (selectedCategory === "부케") {
      bouquetKeyIndex.forEach((index) => {
        if (bouquetLikeState[index] === 0) {
          setChangeModalBackgroundColor(false);

          axios
            .post(`/like/delete`, {
              itemId: bouquetItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("deleteitem:");
              console.log(bouquetItemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (bouquetLikeState[index] === 1) {
          setChangeModalBackgroundColor(true);

          axios
            .post(`/like/create`, {
              itemId: bouquetItemId[index],
              email: sessionStorage.getItem("email"),
            })
            .then((res) => {
              console.log("createItem:");
              console.log(bouquetItemId[index]);
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    }
  }, [checkLike]);

  // console.log(previewImg);
  // console.log(itemId);
  // console.log(weddingHallItemId);
  // console.log(studioItemId);
  // console.log(dressItemId);
  // console.log(makeupItemId);
  // console.log(honeyMoonItemId);
  // console.log(bouquetItemId);

  // console.log("itemLike");
  // console.log(itemLike);
  // console.log(itemName);
  // console.log(itemContent);
  // console.log("weddinghalllikestate");
  // console.log(weddingHallLikeState);
  // console.log("stuidolikestate");
  // console.log(studioLikeState);
  // console.log("dresslikestate");
  // console.log(dressLikeState);
  // console.log("makeuplikestate");
  // console.log(makeupLikeState);
  // console.log("honeymoonlikestate");
  // console.log(honeyMoonLikeState);
  // console.log("bouquetlikestate");
  // console.log(bouquetLikeState);
  // console.log(weddingHallImgContent);
  // console.log(countIndex);
  console.log(window.scrollY);

  const onScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [searchedKeyword]);

  window.addEventListener("scroll", () => {
    console.log(window.scrollY);
  });
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
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
              height: "100px",
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
              onKeyPress={handleKeyPress}
              value={searchingKeyword}
              onChange={handleChange}
              autoComplete="off"
            />
            <div
              className="likeListBtn"
              onClick={() => {
                navigate("/likeList", {
                  state: {
                    originalLocation: "searchitems",
                    searchedKeyword: searchedKeyword,
                  },
                });
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
            className="header"
            style={{
              position: "fixed",
              top: 0,
              borderRadius: "20px 20px 0 0",
              zIndex: 99,
              background: "white",
              width: "556px",
              height: "100px",
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
              onKeyPress={handleKeyPress}
              value={searchingKeyword}
              onChange={handleChange}
              autoComplete="off"
            />
            <div
              className="likeListBtn"
              onClick={() => {
                navigate("/likeList", {
                  state: {
                    originalLocation: "searchitems",
                    searchedKeyword: searchedKeyword,
                  },
                });
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
                  width: "557px",
                }}
              >
                <ul class="nav sortingList">
                  <li class="nav-item">
                    <div
                      class="nav-link"
                      onClick={() => {
                        window.scrollTo({ top: 10 });
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
                          top: 400,
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
                          top: 830,
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
                          top: 1230,
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
                <h4 id="scrollspyHeading1">
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
                  &nbsp;Wedding Hall&nbsp;
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
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={2}
                  loop={true}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  modules={[EffectCoverflow, Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={-30}
                >
                  {keyIndex.map((i) => (
                    <SwiperSlide>
                      <img
                        src={weddingHallItem[i]}
                        class="d-block w-75 center"
                        alt="..."
                        style={{
                          width: "100px",
                          height: "210px",
                          cursor: "pointer",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#imgDetailModal"
                        data-bs-src={weddingHallItem[i]}
                        data-bs-category="웨딩홀"
                        data-bs-keyIndex={i}
                        data-bs-itemid={weddingHallItemId[i]}
                        data-bs-itemContent={weddingHallImgContent[i]}
                        data-bs-itemLike={weddingHallLike[i]}
                        data-bs-itemName={weddingHallName[i]}
                        onClick={showingDetail}
                      />
                      <br />
                      <div className="itemName">
                        {weddingHallName[i]} &nbsp;❤️{weddingHallLike[i]}
                      </div>
                      <br />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <hr />
                <h4 id="scrollspyHeading2">
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
                  &nbsp;Studio&nbsp;
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
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={2}
                  loop={true}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  modules={[EffectCoverflow, Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={-30}
                >
                  {studioKeyIndex.map((i) => (
                    <SwiperSlide>
                      <img
                        src={studioItem[i]}
                        class="d-block w-75 center"
                        alt="..."
                        style={{
                          width: "100px",
                          height: "210px",
                          cursor: "pointer",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#imgDetailModal"
                        data-bs-src={studioItem[i]}
                        data-bs-category="스튜디오"
                        data-bs-keyIndex={i}
                        data-bs-itemid={studioItemId[i]}
                        data-bs-itemContent={studioImgContent[i]}
                        data-bs-itemLike={studioItemLike[i]}
                        data-bs-itemName={studioItemName[i]}
                        onClick={showingDetail}
                      />
                      <br />
                      <div className="itemName">
                        {studioItemName[i]}&nbsp;❤️ {studioItemLike[i]}
                      </div>
                      <br />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <hr />
                <h4 id="scrollspyHeading3">
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
                  &nbsp;Clothes&nbsp;
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
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={2}
                  loop={true}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  modules={[EffectCoverflow, Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={-30}
                >
                  {dressKeyIndex.map((i) => (
                    <SwiperSlide>
                      <img
                        src={dressItem[i]}
                        class="d-block w-75 center"
                        alt="..."
                        style={{
                          width: "100px",
                          height: "220px",
                          cursor: "pointer",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#imgDetailModal"
                        data-bs-src={dressItem[i]}
                        data-bs-category="의상"
                        data-bs-keyIndex={i}
                        data-bs-itemid={dressItemId[i]}
                        data-bs-itemContent={dressImgContent[i]}
                        data-bs-itemLike={dressItemLike[i]}
                        data-bs-itemName={dressItemName[i]}
                        onClick={showingDetail}
                      />
                      <br />
                      <div className="itemName">
                        {dressItemName[i]} &nbsp;❤️{dressItemLike[i]}
                      </div>
                      <br />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <hr />
                <h4 id="scrollspyHeading4">
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
                  &nbsp;Make Up&nbsp;
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
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={2}
                  loop={true}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  modules={[EffectCoverflow, Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={-30}
                >
                  {makeupKeyIndex.map((i) => (
                    <SwiperSlide>
                      <img
                        src={makeupItem[i]}
                        class="d-block w-75 center"
                        alt="..."
                        style={{
                          width: "100px",
                          height: "210px",
                          cursor: "pointer",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#imgDetailModal"
                        data-bs-src={makeupItem[i]}
                        data-bs-category="메이크업"
                        data-bs-keyIndex={i}
                        data-bs-itemid={makeupItemId[i]}
                        data-bs-itemContent={makeupImgContent[i]}
                        data-bs-itemLike={makeupItemLike[i]}
                        data-bs-itemName={makeupItemName[i]}
                        onClick={showingDetail}
                      />
                      <br />
                      <div className="itemName">
                        {makeupItemName[i]} &nbsp;❤️{makeupItemLike[i]}
                      </div>
                      <br />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <hr />
                <h4 id="scrollspyHeading5">
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
                  &nbsp;Honey Moon&nbsp;
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
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={2}
                  loop={true}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  modules={[EffectCoverflow, Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={-30}
                >
                  {honeyMoonKeyIndex.map((i) => (
                    <SwiperSlide>
                      <img
                        src={honeyMoonItem[i]}
                        class="d-block w-75 center"
                        alt="..."
                        style={{
                          width: "100px",
                          height: "210px",
                          cursor: "pointer",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#imgDetailModal"
                        data-bs-src={honeyMoonItem[i]}
                        data-bs-category="신혼여행"
                        data-bs-keyIndex={i}
                        data-bs-itemid={honeyMoonItemId[i]}
                        data-bs-itemContent={honeyMoonImgContent[i]}
                        data-bs-itemLike={honeyMoonItemLike[i]}
                        data-bs-itemName={honeyMoonItemName[i]}
                        onClick={showingDetail}
                      />
                      <br />
                      <div className="itemName">
                        {honeyMoonItemName[i]} &nbsp;❤️{honeyMoonItemLike[i]}
                      </div>
                      <br />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <hr />
                <h4 id="scrollspyHeading6">
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
                  &nbsp;Bouquet&nbsp;
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
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={2}
                  loop={true}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  modules={[EffectCoverflow, Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={-30}
                >
                  {bouquetKeyIndex.map((i) => (
                    <SwiperSlide>
                      <img
                        src={bouquetItem[i]}
                        class="d-block w-75 center"
                        alt="..."
                        style={{
                          width: "100px",
                          height: "210px",
                          pointer: "cursor",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#imgDetailModal"
                        data-bs-src={bouquetItem[i]}
                        data-bs-category="부케"
                        data-bs-keyIndex={i}
                        data-bs-itemid={bouquetItemId[i]}
                        data-bs-itemContent={bouquetImgContent[i]}
                        data-bs-itemLike={bouquetItemLike[i]}
                        data-bs-itemName={bouquetItemName[i]}
                        onClick={showingDetail}
                      />
                      <br />
                      <div className="itemName">
                        {bouquetItemName[i]} &nbsp;❤️{bouquetItemLike[i]}
                      </div>
                      <br />
                    </SwiperSlide>
                  ))}
                </Swiper>
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
                        {selectLikeState === 1 ? (
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
                            onClick={manageLikeList}
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
                            onClick={manageLikeList}
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

export default SearchItems;
