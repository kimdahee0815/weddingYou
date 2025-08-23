import "../Css/main.css";
import "../Css/Home.css";
import Footer from "../Components/Footer";
import imgLogo from "../Assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow, Pagination } from "swiper";
import Animation from "../Components/Animation";
import Sidesection from "../Components/Sidesection";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const category = ["웨딩홀", "스튜디오", "의상", "메이크업", "신혼여행", "부케"];
const englishCategory = ["weddingHall", "studio", "clothes", "makeup", "honeymoon", "bouquet"];
function SearchItems() {
    const navigate = useNavigate();

    const { keyword } = useLocation().state;
    const [currentItem, setCurrentItem] = useState();
    const [wholeItems, setWholeItems] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [searchedKeyword, setSearchedKeyWord] = useState(keyword);
    const [selectLikeState, setSelectLikeState] = useState(undefined);

    const [finish, setFinish] = useState(false);

    useEffect(() => {
        const userCheck = async () => {
            if (sessionStorage.getItem("email")) {
                const { data: userData } = await axios.post("/user/userSearch", {
                    email: sessionStorage.getItem("email"),
                });

                const { data: plannerData } = await axios.post("/planner/plannerSearch", {
                    email: sessionStorage.getItem("email"),
                });

                if (userData || plannerData) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            }
        };
        userCheck();
    }, [isLoggedIn]);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            setSearchedKeyWord(searchedKeyword);
        }
    };

    const handleChange = (e) => {
        setSearchedKeyWord(e.target.value);
    };

    useEffect(() => {
        const getWholeItems = async () => {
            try {
                const { data: items } = await axios.post(`/item/search?keyword=${searchedKeyword}`, {
                    email: sessionStorage.getItem("email"),
                });
                setWholeItems(
                    englishCategory.map((category) =>
                        items[category].map((item) => ({
                            ...item,
                            likeCount: item.like?.length,
                            isLiked:
                                item.like?.some(
                                    (like) =>
                                        like.user?.email === sessionStorage.getItem("email") ||
                                        like.planner?.email === sessionStorage.getItem("email")
                                ) || false,
                        }))
                    )
                );
                setFinish(true);
            } catch (error) {
                console.log(error);
                setFinish(false);
            }
        };
        getWholeItems();
    }, [searchedKeyword]);

    const showingDetail = (e) => {
        let { bsItem: item } = e.target.dataset;

        item = JSON.parse(item);
        setCurrentItem(item);
        if (item.isLiked) {
            setSelectLikeState(true);
        } else {
            setSelectLikeState(false);
        }
    };

    const gotoDetailInfo = (e) => {
        navigate("/imgDetail", {
            state: {
                itemId: currentItem.itemId,
                imgsrc: currentItem.itemImg,
                content: currentItem.content,
                imgContent: currentItem.imgContent,
                itemName: currentItem.itemName,
            },
        });
    };

    const manageLikeList = useCallback(
        async (e) => {
            const email = sessionStorage.getItem("email");
            const itemId = currentItem.itemId;

            setWholeItems((prev) =>
                prev.map((items) =>
                    items.map((item) =>
                        item.itemId === itemId
                            ? {
                                  ...item,
                                  likeCount: item.likeCount + (selectLikeState ? -1 : 1),
                                  isLiked: !selectLikeState,
                              }
                            : item
                    )
                )
            );

            try {
                if (selectLikeState) {
                    await axios.post(`/like/delete`, {
                        itemId,
                        email,
                    });
                } else {
                    await axios.post(`/like/create`, {
                        itemId,
                        email,
                    });
                }

                return true;
            } catch (error) {
                console.error(error);
                setWholeItems((prev) =>
                    prev.map((items) =>
                        items.map((item) =>
                            item.itemId === itemId
                                ? {
                                      ...item,
                                      likeCount: item.likeCount + (selectLikeState ? 1 : -1),
                                      isLiked: selectLikeState,
                                  }
                                : item
                        )
                    )
                );
                return false;
            }
        },
        [selectLikeState, currentItem?.itemId]
    );

    const handleLikeClick = async () => {
        const success = await manageLikeList();
        if (success) {
            setSelectLikeState((prev) => !prev);
        }
    };

    const scrollToHeading = (index) => {
        const element = document.getElementById(`scrollspyHeading${index + 1}`);
        if (element) {
            const headerOffset = 150; // Account for fixed header + nav height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };
    const onScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [searchedKeyword]);

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
                            value={searchedKeyword}
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
                            value={searchedKeyword}
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
                                <ul class="nav sortingList" style={{ width: "525px" }}>
                                    {category.map((item, index) => (
                                        <li class="nav-item" key={index}>
                                            <div
                                                class="nav-link"
                                                onClick={() => scrollToHeading(index)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {item}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div
                                data-bs-spy="scroll"
                                data-bs-target="#navbar-example2"
                                data-bs-root-margin="150px 0px -40%"
                                data-bs-smooth-scroll="true"
                                class="scrollspy-example bg-light p-3 rounded-2"
                                tabindex="0"
                                style={{ marginTop: "130px" }}
                            >
                                {englishCategory.map((category, categoryIndex) => (
                                    <>
                                        <h4 id={`scrollspyHeading${categoryIndex + 1}`}>
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
                                            &nbsp;{category}&nbsp;
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
                                            {wholeItems[categoryIndex].map((item) => (
                                                <SwiperSlide>
                                                    <img
                                                        src={item.itemImg}
                                                        class="d-block w-75 center"
                                                        alt="..."
                                                        style={{
                                                            width: "100px",
                                                            height: "210px",
                                                            cursor: "pointer",
                                                        }}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#imgDetailModal"
                                                        data-bs-item={JSON.stringify(item)}
                                                        data-bs-category={category[categoryIndex]}
                                                        onClick={showingDetail}
                                                    />
                                                    <br />
                                                    <div className="itemName">
                                                        {item.itemName} &nbsp;❤️ {item.likeCount}
                                                    </div>
                                                    <br />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <hr />
                                    </>
                                ))}
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
                                    <div>
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
                            <div class="modal-dialog modal-dialog-centered" style={{ width: "510px" }}>
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
                                                {isLoggedIn ? (
                                                    selectLikeState ? (
                                                        <button
                                                            style={{
                                                                marginLeft: "240px",
                                                                width: "130px",
                                                                marginBottom: "10px",
                                                                fontSize: "1em",
                                                                backgroundColor: "#fce1e4",
                                                                border: "grey 1px solid",
                                                            }}
                                                            onClick={handleLikeClick}
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
                                                            </svg>
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
                                                            onClick={handleLikeClick}
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
                                                            </svg>
                                                            찜하기
                                                        </button>
                                                    )
                                                ) : null}
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: "1.3em",
                                                    width: "460px",
                                                    border: "1px solid black",
                                                    padding: "10px",
                                                }}
                                            >
                                                {currentItem?.imgContent}
                                            </p>
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
                                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
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
                <div class="modal fade" id="logoutmodal" tabindex="-1" aria-labelledby="logoutmodal" aria-hidden="true">
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
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
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
