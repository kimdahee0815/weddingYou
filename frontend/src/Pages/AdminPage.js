import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import Sidesection from "../Components/Sidesection";

import "../Css/AdminPage.css";

const AdminPage = () => {
    useEffect(() => {
        postListReset();
    }, []);

    useEffect(() => {
        userListReset();
    }, []);

    useEffect(() => {
        initUserList();
    }, []);

    const navigate = useNavigate();
    let [modalMode, setModalMode] = useState("user");
    let [postSearchMode, setPostSearchMode] = useState("none");
    let [userSearchMode, setUserSearchMode] = useState("none");
    let [postPageLink, setPageLink] = useState([]);
    let [userList, setUserList] = useState([]);
    let [postList, setPostList] = useState([]);
    let [userPageLink, setUserPageLink] = useState([]);
    let postSearchRef = useRef();
    let userSearchRef = useRef();

    let [userSearch, setUserSearch] = useState("");
    let [userSearchPageing, setUserSearchPaeing] = useState("");

    let [postSearch, setPostSearch] = useState("");
    let [postSearchPageing, setPostSearchPageing] = useState("");
    let [rolldown, setRolldown] = useState("rolldown");
    let [rolldown2, setRolldown2] = useState("");

    let [userName, setUserName] = useState("");
    let [userPassword, setUserPassword] = useState("");
    let [userPhone, setUserPhone] = useState("");

    let [nameCheck, setNameCheck] = useState();
    let [passwordCheck, setPasswordCheck] = useState();
    let [phoneCheck, setPhoneCheck] = useState();

    // const [matchedPlanner, setMatchedPlanner] = useState("");

    const onNameChange = (e) => {
        const nameRegExp = /^[가-힣a-zA-Z\s]+$/;
        setUserName(e.target.value);
        if (nameRegExp.test(e.target.value)) {
            // console.log("형식에 맞음");
            document.querySelector(".userNameModify").classList.remove("is-invalid");
            document.querySelector(".userNameModify").classList.add("is-valid");
            setNameCheck(true);
        } else {
            // console.log("형식에 맞지 않음");
            document.querySelector(".userNameModify").classList.remove("is-valid");
            document.querySelector(".userNameModify").classList.add("is-invalid");
            setNameCheck(false);
        }
    };

    const onPasswordChange = (e) => {
        const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{8,}$/;
        setUserPassword(e.target.value);
        if (passwordRegExp.test(e.target.value)) {
            document.querySelector(".userPasswordModify").classList.remove("is-invalid");
            document.querySelector(".userPasswordModify").classList.add("is-valid");
            setPasswordCheck(true);
        } else {
            document.querySelector(".userPasswordModify").classList.remove("is-valid");
            document.querySelector(".userPasswordModify").classList.add("is-invalid");
            setPasswordCheck(false);
        }
    };
    const onPhoneChange = (e) => {
        const phoneRegExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        const phone = e.target.value.replace(/[^0-9]/g, "").replace(/([0-9]{2,3})([0-9]{3,4})([0-9]{4})/, "$1-$2-$3");
        setUserPhone(phone);

        if (phoneRegExp.test(phone)) {
            document.querySelector(".userPhoneModify").classList.remove("is-invalid");
            document.querySelector(".userPhoneModify").classList.add("is-valid");
            setPhoneCheck(true);
        } else {
            document.querySelector(".userPhoneModify").classList.remove("is-valid");
            document.querySelector(".userPhoneModify").classList.add("is-invalid");
            setPhoneCheck(false);
        }
    };

    const onUserDataModify = (id, type) => {
        if (nameCheck == false) {
            alert("The name format is invalid.");
            return false;
        } else if (passwordCheck == false) {
            alert("The password format is invalid.");
            return false;
        } else if (phoneCheck == false) {
            alert("The phone number format is invalid.");
            return false;
        }

        if (type === "user") {
            axios
                .post("/mypageAdmin/modify", {
                    adminId: id,
                    userName: userName,
                    userPassword: userPassword,
                    userPhoneNum: userPhone,
                    userEmail: userArticle.email,
                    type: type,
                })
                .then((res) => {
                    // console.log("수정성공");
                    getUserListCount();
                    getUserList();
                })
                .catch((e) => {
                    // console.log("실패");
                });
        } else {
            axios
                .post("/mypageAdmin/modify", {
                    adminId: id,
                    plannerName: userName,
                    plannerPassword: userPassword,
                    plannerPhoneNum: userPhone,
                    plannerEmail: userArticle.email,
                    type: type,
                })
                .then((res) => {
                    // console.log("수정성공");
                    getUserListCount();
                    getUserList();
                })
                .catch((e) => {
                    // console.log("실패");
                });
        }
    };

    function rolldownControl(e) {
        let num = e.target.dataset.id;
        if (num == 0) {
            if (rolldown == "") {
                setRolldown("rolldown");
                setRolldown2("");
            }
        } else if (num == 1) {
            if (rolldown2 == "") {
                setRolldown2("rolldown");
                setRolldown("");
            }
        }
    }

    //견적서 리스트
    const getPostListCount = () => {
        setPostSearch("");
        setPostSearchMode("none");
        axios
            .get("/estimate/getcount", {})
            .then((res) => {
                // console.log("data=>", res.data);
                const { data } = res;
                article_countPost = data; //총 글의 갯수 저장.
                page_count = Math.ceil(article_countPost / page_size); //무조건 올림처리 함. 9.1도 10으로, 필요한 페이지 개수를 계산함.
                var page_link = []; //map 함수를 사용하기 위한 배열화.
                for (let i = 1; i <= page_count; i++) {
                    page_link.push(i);
                }
                // console.log("getArticleCount(page_link) =>", page_link);
                setPageLink(page_link);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const getPostList = () => {
        axios
            .post("/estimate/pageinglist", {
                page_num: page_num,
                limit: page_size,
            })
            .then((res) => {
                // console.log("res ==>", res);
                const { data } = res;
                // console.log("data==>", data);
                setPostList(data);
            })
            .catch((e) => {
                console.error(e);
            });

        let query = document.querySelectorAll(".pgAll");
        query.forEach((e) => {
            e.classList.remove("pageing-select");
        });
        document.querySelectorAll(".pgAll")[0].classList.add("pageing-select");
    };

    const postListReset = () => {
        setPostPage(1);
        getPostList();
        getPostListCount();
    };
    //유저 리스트
    const getUserList = async () => {
        try {
            let res = await axios.get("/mypageAdmin/all", {
                params: { page: 0, size: page_size },
            });
            let { data } = res;
            // console.log("유저리스트", data);
            setUserList(data.content);
        } catch (e) {
            console.log(e);
        }
        setUserSearchMode("none");
    };

    const getUserListCount = async () => {
        try {
            let res = await axios.get("/mypageAdmin/count");
            let { data } = res;
            // console.log("총 유저 데이터 수", data);
            article_countUser = data; //총 글의 갯수 저장.
            page_count = Math.ceil(article_countUser / page_size); //무조건 올림처리 함. 9.1도 10으로, 필요한 페이지 개수를 계산함.
            var page_link = []; //map 함수를 사용하기 위한 배열화.
            for (let i = 1; i <= page_count; i++) {
                page_link.push(i);
            }
            // console.log("getArticleCount(page_link) =>", page_link);
            setUserPageLink(page_link);
            let tag = document.querySelectorAll(".ugAll");
            tag.forEach((e) => {
                e.classList.remove("pageing-select");
            });
            document.querySelector(".ug1").classList.add("pageing-select");
        } catch (e) {
            console.log(e);
        }
    };

    const userListReset = () => {
        setUserPage(1);
        setUserSearch("");
        getUserListCount();
        getUserList();
    };

    const initUserList = () => {
        const initialize = async () => {
            try {
                const res = await axios.post("/mypageAdmin/init");
                // console.log('초기화 완료:', res.data);
            } catch (err) {
                // console.error('초기화 실패', err);
            }
        };
        initialize();
    };

    //상세데이터 모달로 보내는 부분
    let [postArticle, setPostArticle] = useState({
        id: "",
        title: "",
        budget: "",
        writer: "",
        viewcount: null,
        date: "",
        matchstatus: null,
        matchedplanner: "",
    });
    const postDetail = (id, title, budget, writer, viewcount, date, matchstatus, matchedplanner) => {
        setPostArticle({
            id: id,
            title: title,
            budget: budget,
            writer: writer,
            viewcount: viewcount,
            date: date,
            matchstatus: matchstatus,
            matchedplanner: matchedplanner,
        });
        setModalMode("post");
    };

    let [userArticle, setUserArticle] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
        gender: "",
        date: "",
        password: "",
    });
    const userDetail = (name, type, email, phone, gender, date, password, id, careerYear) => {
        setUserName(name);
        setUserPassword(password);
        setUserPhone(phone);
        setUserArticle({
            name: name,
            type: type,
            email: email,
            phone: phone,
            gender: gender,
            date: date,
            password: password,
            id: id,
            careerYear: careerYear,
        });
        setModalMode("user");
    };

    let page_num = 1;
    const page_size = 11;
    let page_count = 1;
    let article_countPost;
    let article_countUser;

    let [postPage, setPostPage] = useState(1);
    let [userPage, setUserPage] = useState(1);

    useEffect(() => {
        // console.log("실행됨", postPage);
        const onPostPageing = (e) => {
            //검색상태 아닐 때
            const fetchData = () => {
                axios
                    .post("/estimate/pageinglist", {
                        // page_num: parseInt(e.target.id),
                        page_num: postPage,
                        limit: page_size,
                    })
                    .then((res) => {
                        //console.log("res ==>", res);
                        const { data } = res;
                        //console.log("data==>", data);
                        setPostList(data);
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            };
            //검색상태일 때
            const fetchData2 = () => {
                axios
                    .post("/estimate/getsearchlistpageing", {
                        // page_num: parseInt(e.target.id),
                        page_num: postPage,
                        limit: page_size,
                        search: postSearchPageing,
                    })
                    .then((res) => {
                        // console.log("res ==>", res);
                        const { data } = res;
                        // console.log("data==>", data);
                        setPostList(data);
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            };

            const elements = document.querySelectorAll(".pgAll");
            elements.forEach((element) => {
                element.classList.remove("pageing-select");
            });
            document.querySelector(`.pg${postPage}`).classList.add("pageing-select");
            if (postSearchMode === "none") {
                fetchData();
            } else if (postSearchMode === "search") {
                fetchData2();
            }
        };
        onPostPageing();
    }, [postPage]);

    useEffect(() => {
        // console.log("유저페이지", userPage);
        const onUserPageing = (e) => {
            const fetchData = async () => {
                try {
                    let res = await axios.get("/mypageAdmin/all", {
                        params: {
                            page: userPage - 1,
                            size: page_size,
                        },
                    });
                    let { data } = res;
                    setUserList(data.content);
                } catch (e) {
                    console.log(e);
                }
            };
            const fetchData2 = async () => {
                try {
                    let res = await axios.get("/mypageAdmin/search", {
                        params: {
                            page: userPage - 1,
                            size: page_size,
                            search: userSearchPageing,
                        },
                    });
                    let { data } = res;
                    setUserList(data.content);
                } catch (e) {
                    console.log(e);
                }
            };
            const elements = document.querySelectorAll(".ugAll");
            elements.forEach((element) => {
                element.classList.remove("pageing-select");
            });
            document.querySelector(`.ug${userPage}`).classList.add("pageing-select");
            if (userSearchMode === "none") {
                fetchData();
            } else if (userSearchMode === "search") {
                fetchData2();
            }
        };
        onUserPageing();
    }, [userPage]);

    const onPostSearchChange = (e) => {
        //게시글 검색어
        setPostSearch(e.target.value);
    };
    const onUserSearchChange = (e) => {
        setUserSearch(e.target.value);
    };

    const userSearching = () => {
        if (userSearch.includes("Member")) {
            setUserSearchPaeing("user");
        } else if (userSearch.includes("Planner")) {
            setUserSearchPaeing("planner");
        } else {
            setUserSearchPaeing(userSearch);
        }
        const judge = (userSearch) => {
            if (userSearch.includes("Member")) {
                return "user";
            } else if (userSearch.includes("Planner")) {
                return "planner";
            } else {
                return userSearch;
            }
        };
        let searchdata = judge(userSearch);

        setUserSearchMode("search");
        setUserPage(1);
        const onUserSearching = () => {
            axios
                .get("/mypageAdmin/search", {
                    params: { search: searchdata, page: 0, size: page_size },
                })
                .then((res) => {
                    let { data } = res;
                    //console.log(data);
                    setUserList(data.content);
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        const onUserSearchCount = () => {
            axios
                .get("/mypageAdmin/searchCount", {
                    params: { search: searchdata },
                })
                .then((res) => {
                    let { data } = res;
                    // console.log(data);
                    article_countUser = data; //총 글의 갯수 저장.
                    page_count = Math.ceil(article_countUser / page_size); //무조건 올림처리 함. 9.1도 10으로, 필요한 페이지 개수를 계산함.
                    var page_link = []; //map 함수를 사용하기 위한 배열화.
                    for (let i = 1; i <= page_count; i++) {
                        page_link.push(i);
                    }
                    //console.log("getArticleCount(page_link) =>", page_link);
                    setUserPageLink(page_link);
                    let tag = document.querySelectorAll(".ugAll");
                    tag.forEach((e) => {
                        e.classList.remove("pageing-select");
                    });
                    document.querySelector(".ug1").classList.add("pageing-select");
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        onUserSearchCount();
        onUserSearching();
    };

    const onSearching = () => {
        //게시글 검색 함수
        setPostPage(1);
        setPostSearchPageing(postSearch);
        setPostSearchMode("search");
        axios
            .post("/estimate/getsearchlistcount", {
                search: postSearch,
            })
            .then((res) => {
                //console.log("data=>", res.data);
                const { data } = res;
                article_countPost = data; //총 글의 갯수 저장.
                page_count = Math.ceil(article_countPost / page_size); //무조건 올림처리 함. 9.1도 10으로, 필요한 페이지 개수를 계산함.
                var page_link = []; //map 함수를 사용하기 위한 배열화.
                for (let i = 1; i <= page_count; i++) {
                    page_link.push(i);
                }
                //console.log("getArticleCount(page_link) =>", page_link);
                setPageLink(page_link);
            })
            .catch((e) => {
                console.log(e);
            });

        // console.log("start=>", page_num);
        // console.log("page_num=>", page_num);
        axios
            .post("/estimate/getsearchlistpageing", {
                page_num: page_num,
                limit: page_size,
                search: postSearch,
            })
            .then((res) => {
                // console.log("res ==>", res);
                const { data } = res;
                // console.log("data==>", data);
                setPostList(data);
            })
            .catch((e) => {
                console.error(e);
            });

        let query = document.querySelectorAll(".pgAll");
        query.forEach((e) => {
            e.classList.remove("pageing-select");
        });
        document.querySelectorAll(".pgAll")[0].classList.add("pageing-select");
    };

    const onPostDelete = (id) => {
        axios
            .get("/estimate/delete", { params: { id: id } })
            .then((res) => {
                // console.log(res);
                getPostList();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onUserDelte = (id) => {
        axios
            .get(`/mypageAdmin/delete?adminId=${id}`)
            .then((res) => {
                userListReset();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const postPageNext = () => {
        const maxNumber = Math.max(...postPageLink);
        if (postPage < maxNumber) {
            setPostPage((prev) => prev + 1);
        }
    };
    const postPagePrev = () => {
        if (postPage > 1) {
            setPostPage((prev) => prev - 1);
        }
    };

    const userPageNext = () => {
        const maxNumber = Math.max(...userPageLink);
        if (userPage < maxNumber) {
            setUserPage((prev) => prev + 1);
        }
    };
    const userPagePrev = () => {
        if (userPage > 1) {
            setUserPage((prev) => prev - 1);
        }
    };

    return (
        <div className="containerbox">
            <div className="mainlayout box1">
                <NavigationBar title="My Page (Admin)" />
                <div className="adminpage-container">
                    <div className={`adminpage-Administration ${rolldown}`}>
                        <div className="adminpage-Administration-title cursor" onClick={rolldownControl} data-id="0">
                            User Management
                        </div>
                        <div className="adminpage-Administration-list">
                            <div className="adminpage-Administration-list-head-box">
                                <div className="adminpage-Administration-list-head" style={{ width: "20%" }}>
                                    Name
                                </div>
                                <div className="adminpage-Administration-list-head" style={{ width: "15%" }}>
                                    Type
                                </div>
                                <div className="adminpage-Administration-list-head" style={{ width: "30%" }}>
                                    Phone
                                </div>
                                <div className="adminpage-Administration-list-head" style={{ width: "15%" }}>
                                    Gender
                                </div>
                                <div className="adminpage-Administration-list-head" style={{ width: "20%" }}>
                                    Join Date
                                </div>
                            </div>
                            {userList?.length === 0 && (
                                <div className="nonedata">
                                    <p>No results found.</p>
                                    <p style={{ fontSize: "20px" }}>Search term: {userSearchPageing}</p>
                                </div>
                            )}
                            <UserListData userList={userList} setModalMode={setModalMode} userDetail={userDetail} />
                            <div className="adminpage-pagingAndResearchBox">
                                <div className="adminpage-pagingNumber">
                                    {userPageLink.length === 0 && (
                                        <a className="ug1 cursor ugAll pageing-select nonepage"></a>
                                    )}
                                    {userPageLink.length !== 0 && (
                                        <div
                                            className="prevAndNextbtn cursor"
                                            onClick={() => {
                                                userPagePrev();
                                            }}
                                        >
                                            Prev
                                        </div>
                                    )}
                                    {userPageLink.map((e, index) => {
                                        return (
                                            <UserPageLink
                                                num={e}
                                                index={index}
                                                kind="user"
                                                setUserPage={setUserPage}
                                                // onUserPageing={onUserPageing}
                                            />
                                        );
                                    })}
                                    {userPageLink.length !== 0 && (
                                        <div
                                            className="prevAndNextbtn cursor"
                                            onClick={() => {
                                                userPageNext();
                                            }}
                                        >
                                            Next
                                        </div>
                                    )}
                                </div>
                                <div className="adminpage-researchBar">
                                    <div className="adminpage-researchBox_">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="usersearch"
                                            value={userSearch}
                                            ref={userSearchRef}
                                            placeholder="Search users"
                                            onChange={onUserSearchChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.code === "Enter") {
                                                    userSearching();
                                                }
                                            }}
                                        />
                                        <button
                                            className="btn btnColor"
                                            onClick={() => {
                                                userSearching();
                                            }}
                                        >
                                            Search
                                        </button>
                                    </div>
                                    <div
                                        className="전체보기버튼 cursor"
                                        onClick={() => {
                                            userListReset();
                                        }}
                                    >
                                        <i class="bi bi-arrow-counterclockwise"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 여기까지 유저관리 */}
                    {/*===================================================================== */}
                    <div className={`adminpage-Administration ${rolldown2}`}>
                        <div className="adminpage-Administration-title cursor" onClick={rolldownControl} data-id="1">
                            Estimate Post Management
                        </div>
                        <div className="adminpage-Administration-list">
                            <div className="adminpage-Administration-list-head-box">
                                <div className="adminpage-Administration-list-head" style={{ width: "14%" }}>
                                    Post No.
                                </div>
                                <div className="adminpage-Administration-list-head" style={{ width: "50%" }}>
                                    Title
                                </div>
                                <div className="adminpage-Administration-list-head" style={{ width: "18%" }}>
                                    Match Status
                                </div>
                                <div className="adminpage-Administration-list-head" style={{ width: "18%" }}>
                                    Date Written
                                </div>
                            </div>
                            {postList.length === 0 && (
                                <div className="nonedata">
                                    <p>No results found.</p>
                                    <p style={{ fontSize: "20px" }}>Search term: {postSearchPageing}</p>
                                </div>
                            )}
                            <PostListData array2={postList} setModalMode={setModalMode} postDetail={postDetail} />
                            <div className="adminpage-pagingAndResearchBox">
                                <div className="adminpage-pagingNumber">
                                    {postPageLink.length === 0 && (
                                        <a className="pg1 cursor pgAll pageing-select nonepage"></a>
                                    )}
                                    {postPageLink.length !== 0 && (
                                        <div
                                            className="prevAndNextbtn cursor"
                                            onClick={() => {
                                                postPagePrev();
                                            }}
                                        >
                                            Prev
                                        </div>
                                    )}
                                    {postPageLink.map((e, index) => {
                                        return (
                                            <PostPageLink
                                                num={e}
                                                // onPostPageing={onPostPageing}
                                                setPostPage={setPostPage}
                                                index={index}
                                                kind="post"
                                            />
                                        );
                                    })}
                                    {postPageLink.length !== 0 && (
                                        <div
                                            className="prevAndNextbtn cursor"
                                            onClick={() => {
                                                postPageNext();
                                            }}
                                        >
                                            Next
                                        </div>
                                    )}
                                </div>
                                <div className="adminpage-researchBar">
                                    <div className="adminpage-researchBox_">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="postsearch"
                                            value={postSearch}
                                            ref={postSearchRef}
                                            placeholder="Search posts"
                                            onChange={onPostSearchChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.code === "Enter") {
                                                    onSearching();
                                                }
                                            }}
                                        />
                                        <button
                                            className="btn btnColor"
                                            onClick={() => {
                                                onSearching();
                                            }}
                                        >
                                            Search
                                        </button>
                                    </div>
                                    <div className="전체보기버튼 cursor" onClick={postListReset}>
                                        <i class="bi bi-arrow-counterclockwise"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="button-Box">
                        <button
                            onClick={() => {
                                navigate("../customercenter");
                            }}
                            className="btn-colour-1"
                        >
                            Customer Center
                        </button>
                    </div>
                    <div className="button-Box" style={{ height: "60px" }}>
                        <button
                            onClick={() => {
                                window.sessionStorage.removeItem("email");
                                window.sessionStorage.removeItem("category");
                                navigate("/login");
                            }}
                            className="btn-colour-1"
                        >
                            Logout
                        </button>
                    </div>
                    <div style={{ height: 94.19 }}></div>
                </div>
                <DetailModal
                    user={userArticle}
                    modalMode={modalMode}
                    postArticle={postArticle}
                    setModalMode={setModalMode}
                    onPostDelete={onPostDelete}
                    userArticle={userArticle}
                    onNameChange={onNameChange}
                    onPasswordChange={onPasswordChange}
                    onPhoneChange={onPhoneChange}
                    onUserDataModify={onUserDataModify}
                    userName={userName}
                    userPassword={userPassword}
                    userPhone={userPhone}
                    onUserDelete={onUserDelte}
                />
                {/* <PostDetailModal /> */}
                <Footer />
            </div>
            <div className="box2"></div>
            <div className="box3">
                <Sidesection />
            </div>
        </div>
    );
};

export default AdminPage;

const UserListData = ({ userList, userDetail }) => {
    return (
        <>
            {userList?.map((e, index) => {
                return (
                    <div
                        className="adminpage-Administration-list-body-box cursor"
                        data-bs-toggle="modal"
                        data-bs-target="#Modal"
                        key={index}
                        onClick={() => {
                            if (e.type === "user") {
                                userDetail(
                                    e.userName,
                                    e.type,
                                    e.userEmail,
                                    e.userPhoneNum,
                                    e.userGender,
                                    e.userJoinDate.slice(0, 10),
                                    e.userPassword,
                                    e.adminId,
                                );
                            } else {
                                userDetail(
                                    e.plannerName,
                                    e.type,
                                    e.plannerEmail,
                                    e.plannerPhoneNum,
                                    e.plannerGender,
                                    e.plannerJoinDate.slice(0, 10),
                                    e.plannerPassword,
                                    e.adminId,
                                    e.plannerCareerYears,
                                );
                            }
                        }}
                    >
                        <div className="adminpage-Administration-list-body" style={{ width: "20%" }}>
                            {e.type === "user" && <span>{e.userName}</span>}
                            {e.type === "planner" && <sapn>{e.plannerName}</sapn>}
                        </div>
                        <div className="adminpage-Administration-list-body" style={{ width: "15%" }}>
                            {e.type === "user" && <span>Member</span>}
                            {e.type === "planner" && <sapn>Planner</sapn>}
                        </div>
                        <div className="adminpage-Administration-list-body" style={{ width: "30%" }}>
                            {e.type === "user" && <span>{e.userPhoneNum}</span>}
                            {e.type === "planner" && <sapn>{e.plannerPhoneNum}</sapn>}
                        </div>
                        <div className="adminpage-Administration-list-body" style={{ width: "15%" }}>
                            {e.type === "user" && <span>{e.userGender === "male" ? "Male" : "Female"}</span>}
                            {e.type === "planner" && <sapn>{e.plannerGender === "male" ? "Male" : "Female"}</sapn>}
                        </div>
                        <div className="adminpage-Administration-list-body" style={{ width: "20%" }}>
                            {e.type === "user" && <span>{e.userJoinDate.slice(0, 10)}</span>}
                            {e.type === "planner" && <sapn>{e.plannerJoinDate.slice(0, 10)}</sapn>}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

const PostListData = ({ array2, postDetail }) => {
    return (
        <>
            {array2.map((e, index) => {
                const matchedplanner = e.plannermatching
                    ? JSON.parse(e.plannermatching)[0]
                    : null;

                return (
                    <div
                        className="adminpage-Administration-list-body-box cursor"
                        data-bs-toggle="modal"
                        data-bs-target="#Modal"
                        key={index}
                        onClick={() => {
                            postDetail(
                                e.id,
                                e.title,
                                e.budget,
                                e.writer,
                                e.viewcount,
                                e.date,
                                e.matchstatus,
                                matchedplanner,
                            );
                        }}
                    >
                        <div
                            className="adminpage-Administration-list-body"
                            style={{ width: "14%", padding: "0px 10px" }}
                        >
                            {e.id}
                        </div>
                        <div
                            className="adminpage-Administration-list-body"
                            style={{ width: "50%", padding: "0px 10px" }}
                        >
                            {e.title}
                        </div>
                        <div className="adminpage-Administration-list-body" style={{ width: "18%" }}>
                            {e.matchstatus == true && <span className="matchTrue">Matched</span>}
                            {e.matchstatus == false && <span className="matchFalse">Not Matched</span>}
                        </div>
                        <div className="adminpage-Administration-list-body" style={{ width: "18%" }}>
                            {e.date}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

const DetailModal = ({
    userArticle,
    modalMode,
    postArticle,
    setModalMode,
    onPostDelete,
    onNameChange,
    onPasswordChange,
    onPhoneChange,
    onUserDataModify,
    userName,
    userPassword,
    userPhone,
    onUserDelete,
}) => {
    let navigate = useNavigate();
    return (
        <div class="modal fade" id="Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title adminpage-modalheader" id="exampleModalLabel">
                            {modalMode === "user" && "Member Details"}
                            {modalMode === "userModifyForm" && "Edit Member Info"}
                            {modalMode === "userDelete" && "Delete Member"}
                            {modalMode === "postDelete" && "Delete Post"}
                            {modalMode === "post" && "Post Details"}
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body adminpage-modalbody">
                        {/*내용입력 */}
                        {modalMode == "user" && (
                            <div className="Modal-detail">
                                <p>Name : {userArticle.name}</p>
                                <p>
                                    Type : &nbsp;
                                    {userArticle.type === "user" ? "Member" : "Planner"}
                                </p>
                                <p>Email : {userArticle.email}</p>
                                <p>Password : {userArticle.password}</p>
                                <p>Gender : {userArticle.gender === "male" ? "Male" : "Female"}</p>
                                <p>Phone : {userArticle.phone}</p>
                                {userArticle.type === "planner" && <p> Career : {userArticle.careerYear} years</p>}
                                <p>Join Date : {userArticle.date}</p>
                            </div>
                        )}
                        {modalMode == "post" && (
                            <div className="Modal-detail">
                                <p>Title : {postArticle.title}</p>
                                <p>Author : {postArticle.writer} </p>
                                {postArticle.matchstatus == true ? (
                                    <p>Matched Planner : {postArticle.matchedplanner} </p>
                                ) : null}
                                <p>Date Written : {postArticle.date}</p>
                                <p>Views : {postArticle.viewcount}</p>
                                <p>Matched : {postArticle.matchstatus == false ? "Not Matched" : "Matched"}</p>
                            </div>
                        )}
                        {modalMode == "userModifyForm" && (
                            <div className="Modal-detail">
                                <p>
                                    Name : &nbsp;
                                    <input
                                        type="text"
                                        onChange={onNameChange}
                                        value={userName}
                                        maxLength={5}
                                        className="form-control form-control-width userNameModify"
                                    />
                                </p>
                                <p>
                                    Type :&nbsp;
                                    {userArticle.type === "user" ? "Member" : "Planner"}
                                </p>
                                <p>Email : {userArticle.email} </p>
                                <p>Gender : {userArticle.gender === "male" ? "Male" : "Female"}</p>
                                <p>
                                    Password : &nbsp;
                                    <input
                                        type="text"
                                        onChange={onPasswordChange}
                                        value={userPassword}
                                        className="form-control form-control-width userPasswordModify"
                                    />
                                </p>
                                <p>
                                    Phone : &nbsp;
                                    <input
                                        type="text"
                                        onChange={onPhoneChange}
                                        value={userPhone}
                                        maxLength={13}
                                        className="form-control form-control-width userPhoneModify"
                                    />
                                </p>
                                {userArticle.type === "planner" && <p> Career : {userArticle.careerYear} years</p>}
                                <p>Join Date : {userArticle.date}</p>
                            </div>
                        )}
                        {modalMode == "postDelete" && (
                            <div className="Modal-detail">
                                <p>Are you sure you want to delete {postArticle.writer}'s post?</p>
                            </div>
                        )}
                        {modalMode == "userDelete" && (
                            <div className="Modal-detail">
                                <p>Are you sure you want to delete {userArticle.email}'s account?</p>
                            </div>
                        )}
                    </div>
                    <div class="modal-footer">
                        {modalMode == "user" && (
                            <>
                                {" "}
                                <button
                                    type="button"
                                    class="btn btnColor"
                                    onClick={() => {
                                        setModalMode("userModifyForm");
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-danger"
                                    onClick={() => {
                                        setModalMode("userDelete");
                                    }}
                                >
                                    Delete Account
                                </button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                            </>
                        )}
                        {modalMode == "userModifyForm" && (
                            <>
                                <>
                                    <button
                                        type="button"
                                        class="btn btnColor"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                            onUserDataModify(userArticle.id, userArticle.type);
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                </>
                            </>
                        )}
                        {modalMode == "post" && (
                            <>
                                <button
                                    data-bs-dismiss="modal"
                                    className="btn btnColor"
                                    onClick={() => {
                                        navigate(`../estimatedetail/${postArticle.id}`);
                                    }}
                                >
                                    View Post
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-danger"
                                    onClick={() =>
                                        // onPostDeletePage(postArticle.writer, postArticle.id)
                                        setModalMode("postDelete")
                                    }
                                >
                                    Delete Post
                                </button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                            </>
                        )}
                        {modalMode == "postDelete" && (
                            <>
                                <button
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        onPostDelete(postArticle.id);
                                    }}
                                >
                                    Delete
                                </button>
                                <button className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                            </>
                        )}
                        {modalMode == "userDelete" && (
                            <>
                                <button
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        onUserDelete(userArticle.id);
                                    }}
                                >
                                    Delete
                                </button>
                                <button className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
const PostPageLink = ({ num, index, setPostPage }) => {
    return (
        <div class="page">
            <p
                id={num}
                // onClick={onPostPageing}
                onClick={() => {
                    setPostPage(num);
                }}
                className={index == 0 ? `pg1 cursor pgAll pageing-select` : `pg${num} cursor pgAll`}
            >
                {num}
            </p>
            &nbsp;
        </div>
    );
};
const UserPageLink = ({ num, index, setUserPage }) => {
    return (
        <div class="page">
            <p
                id={num}
                onClick={() => {
                    setUserPage(num);
                }}
                className={index == 0 ? `ug1 cursor ugAll pageing-select` : `ug${num} cursor ugAll`}
            >
                {num}
            </p>
            &nbsp;
        </div>
    );
};
