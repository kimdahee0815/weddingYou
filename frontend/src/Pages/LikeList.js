import "../Css/main.css";
import "../Css/Home.css";
import "../Css/LikeList.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Animation from "../Components/Animation";
import axios from "axios";
import Sidesection from "../Components/Sidesection";

const category = [
  "웨딩홀",
  "스튜디오",
  "의상",
  "메이크업",
  "신혼여행",
  "부케",
];

function LikeList() {
  const [wholeItems, setWholeItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("카테고리"); 
  const [selectedSort, setSelectedSort] = useState("정렬"); 

  const [selectLikeState, setSelectLikeState] = useState(true);
  const [update, setUpdate] = useState(false);
  const [finish, setFinish] = useState(false);

  const navigate = useNavigate();

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
  }, [navigate]);

  const goUpdate = (e) => {
    setUpdate(!update);
  };

  useEffect(() => {
    const email = sessionStorage.getItem("email");

    axios.post(`/like/list`, { email })
      .then(async (res) => {
        const likeItems = res.data;

        // 1. group by itemId
        const groupedItems = likeItems.reduce((acc, like) => {
        const itemId = like.item.itemId;

        if (!acc[itemId]) {
          acc[itemId] = {
            item: like.item,
            likeCount: 0, // will be overwritten later by server response
            latestLikeDate: like.likeWriteDate,
            isLiked: true,
          };
        }

        if (new Date(like.likeWriteDate) > new Date(acc[itemId].latestLikeDate)) {
          acc[itemId].latestLikeDate = like.likeWriteDate;
        }

        return acc;
      }, {});

      const itemIds = Object.keys(groupedItems).map(id => Number(id));

      try {
        // 2. get whole likeCounts by itemIds
        const countRes = await axios.post(`/like/item/likeCounts`, itemIds);
        const likeCountsMap = countRes.data;

        // 3. overwrite likeCounts in each likeItem 
        for (const itemId in groupedItems) {
          groupedItems[itemId].likeCount = likeCountsMap[itemId] || 0;
        }

        // 4. sort
        const result = Object.values(groupedItems).sort(
          (a, b) => new Date(b.latestLikeDate) - new Date(a.latestLikeDate)
        );
        setWholeItems(result);
        //console.log(result);
      } catch (countError) {
        console.error("Error fetching like counts:", countError);
      }
    })
    .catch((e) => {
      console.error("Error fetching like list:", e);
    });
  }, []);

  useEffect(() => {
    //카테고리, 정렬 모두 적용
    const email = sessionStorage.getItem("email");
    axios
      .post(`/like/list/category/sort`, {
        email,
        category1: selectedItem,
        sortBy: selectedSort,
      })
      .then((res) => {
        setWholeItems(res.data);
        //console.log(res.data);
        setFinish(true);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedItem, selectedSort, update]);

  const handleLikeChange = (itemId, liked) => {
    setWholeItems(prevItems =>
      prevItems.map(item =>
        item.item?.itemId === itemId ? { ...item, isLiked: liked, likeCount: liked ? (item.likeCount || 0) + 1 : Math.max(0, (item.likeCount || 0) - 1) } : item
      )
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [selectedItem, selectedSort, update]);

  const Like = ({ likeState, itemId, onLikeChange }) => {
    const [isLiked, setIsLiked] = useState(likeState);
  
    const handleHeartClick = async () => {
      const email = sessionStorage.getItem("email");
      const previousState = isLiked;
      const optimisticState = !previousState;
  
      setIsLiked(optimisticState); 
  
      try {
        if (optimisticState) {
          await axios.post(`/like/create`, { itemId, email });
        } else {
          await axios.post(`/like/delete`, { itemId, email });
        }
  
        if (onLikeChange) {
          onLikeChange(itemId, optimisticState);
        }
      } catch (error) {
        console.error("Failed to update like:", error);
        setIsLiked(previousState); 
      }
    };
  
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill={isLiked ? "red" : "currentColor"}
        className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
        viewBox="0 0 16 16"
        onClick={handleHeartClick}
        style={{ cursor: "pointer" }}
      >
        <path
          fillRule="evenodd"
          d={
            isLiked
              ? "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
              : "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
          }
        />
      </svg>
    );
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
                    {wholeItems.length === 0 ? (
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
                      wholeItems.map((likeItem) => (
                        <div class="col" key={likeItem.item?.itemId}>
                          <div class="card margT">
                            <img
                              style={{ height: "230px" }}
                              src={likeItem.item?.itemImg}
                              class="card-img-top"
                              alt="..."
                            />
                            <div class="card-body">
                              <p class="card-text">
                                {likeItem.item?.itemName} &nbsp;&nbsp;
                                <div className="likeListBtn1">
                                  <Like 
                                    likeState={likeItem.isLiked} 
                                    itemId={likeItem.item?.itemId}
                                    onLikeChange={handleLikeChange}
                                  />
                                </div>
                                {likeItem.likeCount}
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
