//리액트 임포트
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

//스타일 중복을 피하기 위한 종속
import styles from "../Css/EstimateList.css";

//컴포넌트 임포트
import NavigationBar from "../Components/NavigationBar";
import Footer from "../Components/Footer.js";

//날짜 선택 달력을 위한 import
import { ko } from "date-fns/esm/locale";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "../Css/DatePicker.css";
import Sidesection from "../Components/Sidesection";

const EstimateList = () => {
    let [dataCount, setDataCount] = useState();
    let [getdata, setData] = useState([]);
    let [start, setStart] = useState(0);
    let [search, setSearch] = useState("");
    let [slicenum, setSlicenum] = useState(7);
    let [withcomplete, setWithCompletelist] = useState(false);
    let [sort, setSort] = useState("Latest");
    let [close, setClose] = useState("none");
    let [dressfilterstyle, setDressfilterstyle] = useState(0);
    let [makeupfilterstyle, setmakeupfilterstyle] = useState(0);
    let [studiofilterstyle, setstudiofilterstyle] = useState(0);

    //달력세팅 위한 값
    let [startDate, setStartDate] = useState(null);
    let [endDate, setEndDate] = useState(null);

    const handleChange = ([newStartDate, newEndDate]) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    useEffect(() => {
        axios
            .get("/estimate/getlist")
            .then((res) => {
                let { data } = res;
                setData(data);
                setSlicenum(7);
                setDataCount(data.filter((e) => e.matchstatus === false).length);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= fullHeight) {
            setSlicenum((prevdata) => prevdata + 7);
        }
    };

    //검색어
    const enterSearch = (e) => {
        // console.log(search);
        setSearch(e.target.value);
    };

    const searchResult = () => {
        axios
            .get("/estimate/getsearchlist", {
                params: { search: search },
            })
            .then((res) => {
                // console.log(res.data);
                if (startDate === null && endDate === null) {
                    let { data } = res;
                    setWithCompletelist(false);
                    setSlicenum(7);
                    setSort("Latest");
                    setDataCount(data.filter((e) => e.matchstatus === false).length);
                    setData(data);
                } else if (startDate !== null && endDate === null) {
                    let dateArrays = [];
                    let { data } = res;
                    setWithCompletelist(false);
                    setSlicenum(7);
                    setSort("Latest");
                    for (let i = 0; i < data.length; i++) {
                        let parsingData = JSON.parse(data[i].weddingdate);
                        for (let j = 0; j < parsingData.length; j++) {
                            if (parsingData[j] >= format(startDate, "yyyy-MM-dd")) {
                                dateArrays.push(data[i]);
                                break;
                            }
                        }
                    }
                    setDataCount(dateArrays.filter((e) => e.matchstatus === false).length);
                    setData(dateArrays);
                } else if (startDate !== null && endDate !== null) {
                    let dateArrays = [];
                    let { data } = res;
                    setWithCompletelist(false);
                    setSlicenum(7);
                    setSort("Latest");
                    for (let i = 0; i < data.length; i++) {
                        let parsingData = JSON.parse(data[i].weddingdate);
                        for (let j = 0; j < parsingData.length; j++) {
                            if (
                                parsingData[j] >= format(startDate, "yyyy-MM-dd") &&
                                parsingData[j] <= format(endDate, "yyyy-MM-dd")
                            ) {
                                dateArrays.push(data[i]);
                                break;
                            }
                        }
                    }
                    setDataCount(dateArrays.filter((e) => e.matchstatus === false).length);
                    setData(dateArrays);
                }
            })
            .catch((e) => {
                console.log(e);
            });
        //검색하면 닫기
        datePickerRef.current.setOpen(false);
    };

    const onCompleteHandler = () => {
        if (withcomplete === false) {
            setWithCompletelist(true);
            setSlicenum(7);
        } else {
            setWithCompletelist(false);
            setSlicenum(7);
        }
    };

    const onScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const SortSelector = () => {
        if (sort === "Latest") {
            return getdata;
        } else if (sort === "Highest Price") {
            let sortresult = getdata.sort((a, b) => b.budget - a.budget);
            return sortresult;
        } else if (sort === "Lowest Price") {
            let sortresult = getdata.sort((a, b) => a.budget - b.budget);
            return sortresult;
        } else if (sort === "Most Viewed") {
            let sortresult = getdata.sort((a, b) => b.viewcount - a.viewcount);
            return sortresult;
        } else if (sort === "Dress(Mermaid)") {
            let sortresult = getdata.filter((e) => e.dress.includes("머메이드"));
            return sortresult;
        } else if (sort === "Dress(Ball Gown)") {
            let sortresult = getdata.filter((e) => e.dress.includes("벨라인"));
            return sortresult;
        } else if (sort === "Dress(H-Line)") {
            let sortresult = getdata.filter((e) => e.dress.includes("H라인"));
            return sortresult;
        } else if (sort === "Dress(Princess)") {
            let sortresult = getdata.filter((e) => e.dress.includes("프린세스"));
            return sortresult;
        } else if (sort === "Dress(Empire)") {
            let sortresult = getdata.filter((e) => e.dress.includes("엠파이어"));
            return sortresult;
        } else if (sort === "Dress(A-Line)") {
            let sortresult = getdata.filter((e) => e.dress.includes("A라인"));
            return sortresult;
        } else if (sort === "Makeup(Romantic)") {
            let sortresult = getdata.filter((e) => e.makeup.includes("로맨틱"));
            return sortresult;
        } else if (sort === "Makeup(Point)") {
            let sortresult = getdata.filter((e) => e.makeup.includes("포인트"));
            return sortresult;
        } else if (sort === "Makeup(Natural)") {
            let sortresult = getdata.filter((e) => e.makeup.includes("내추럴"));
            return sortresult;
        } else if (sort === "Makeup(Smoky)") {
            let sortresult = getdata.filter((e) => e.makeup.includes("스모키"));
            return sortresult;
        } else if (sort === "Makeup(Cute)") {
            let sortresult = getdata.filter((e) => e.makeup.includes("큐티"));
            return sortresult;
        } else if (sort === "Makeup(Lovely)") {
            let sortresult = getdata.filter((e) => e.makeup.includes("러블리"));
            return sortresult;
        } else if (sort === "Studio(Subject-Focused)") {
            let sortresult = getdata.filter((e) => e.studio.includes("인물중심"));
            return sortresult;
        } else if (sort === "Studio(Background-Focused)") {
            let sortresult = getdata.filter((e) => e.studio.includes("배경중심"));
            return sortresult;
        } else if (sort === "Studio(Balanced)") {
            let sortresult = getdata.filter((e) => e.studio.includes("균형적인"));
            return sortresult;
        }
    };

    useEffect(() => {
        if (withcomplete === false) setDataCount(withoutcomplete.length);
        else setDataCount(SortSelector().length);
    }, [sort, withcomplete]);

    const navigate = useNavigate();
    const withoutcomplete = SortSelector().filter((e) => e.matchstatus === withcomplete);
    const dataArraywithoutComplete = withoutcomplete.slice(0, slicenum);
    const dataArraywithComplete = SortSelector().slice(0, slicenum);

    const modalControl = () => {
        setClose("none");
        setDressfilterstyle(0);
        setmakeupfilterstyle(0);
        setstudiofilterstyle(0);
    };

    let datePickerRef = useRef();

    //검색창 누르면 달력 보이게 하는 것.
    const datePickerOpen = () => {
        // datePickerRef.current.setOpen(true);
    };

    useEffect(() => {
        searchResult();
    }, [endDate]);

    return (
        <div className="containerbox">
            <div className="mainlayout box1">
                <NavigationBar title={"Estimate List"} />

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
                        <div
                            className="estimate-write-btn"
                            onClick={() => navigate("/estimateform")}
                        >
                            <i className="bi bi-pencil-square"></i>
                            <span className="estimate-write-btn-text">Estimate</span>
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
                {/*여기다 */}
                <div className="EstimateListContainer">
                    <div className="EstimateListSearchbarBox">
                        <input
                            // className="form-control"
                            onClick={datePickerOpen}
                            placeholder="Enter search term"
                            type="text"
                            onChange={enterSearch}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.code === "Enter") {
                                    searchResult();
                                }
                            }}
                        />
                        <div className="EstimateListSearchIcon">
                            <i class="bi bi-search"></i>
                        </div>
                        <div className="캘린더">
                            <DatePicker
                                selected={startDate}
                                onChange={handleChange}
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                                // showMonthYearPicker
                                locale={ko}
                                showPopperArrow={false}
                                popperPlacement="top-end"
                                placeholderText="Search by preferred date"
                                isClearable={true}
                                ref={datePickerRef}
                            />
                        </div>
                    </div>
                    <div className="EstimateListDataCountAndSortBox">
                        <div className="EstimateListDataCount">&nbsp;{dataCount} result(s) found</div>
                        <div className="EstimateListSort">
                            <span
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                    modalControl();
                                }}
                            >
                                {sort}▼
                            </span>
                        </div>
                    </div>
                    <div className="EstimateListMatchCompleteButton">
                        <p>
                            {/* &nbsp;<i class="bi bi-check-circle"></i> 매칭완료된 견적서 보기 */}
                            <input
                                type="checkbox"
                                id="check"
                                checked={withcomplete === true}
                                onClick={onCompleteHandler}
                            />
                            <label htmlFor="check" style={{ cursor: "pointer" }}>
                                &nbsp;&nbsp;View matched estimates too
                            </label>
                        </p>
                    </div>
                    {getdata.length === 0 && <div className="noneSearchData">No results found.</div>}
                    <div className="EstimateListDataBox">
                        {withcomplete === false ? (
                            <DataListComp list={dataArraywithoutComplete} navigate={navigate} />
                        ) : (
                            <DataListComp list={dataArraywithComplete} navigate={navigate} />
                        )}
                    </div>
                    <div style={{ height: 200 }}></div>
                </div>
                {/*컨테이너 */}
                <Footer />
                <SortModal
                    setSort={setSort}
                    close={close}
                    setClose={setClose}
                    dressfilterstyle={dressfilterstyle}
                    setDressfilterstyle={setDressfilterstyle}
                    makeupfilterstyle={makeupfilterstyle}
                    setmakeupfilterstyle={setmakeupfilterstyle}
                    studiofilterstyle={studiofilterstyle}
                    setstudiofilterstyle={setstudiofilterstyle}
                />
            </div>
            <div className="box2"></div>
            <div className="box3">
                <Sidesection />
            </div>
        </div>
    );
};

export default EstimateList;

const DataListComp = ({ list, navigate }) => {
    if (list.length >= 1) {
        return (
            <>
                {list.map((e, index) => {
                    return (
                        <div
                            className="EstimateListData"
                            key={index}
                            onClick={() => {
                                navigate(`/estimatedetail/${e.id}`);
                            }}
                        >
                            {e.matchstatus === true ? <div className="EstimateListComplete">Matched</div> : ""}
                            <div className="EstimateListDataTitle">{e.writer.slice(0, 3) + "***"}'s Estimate</div>
                            <div className="EstimateListDataRegion">
                                Region: &nbsp;
                                {JSON.parse(e.region).map((e, index) => {
                                    return <span>{e}&nbsp;&nbsp;</span>;
                                })}
                            </div>
                            <div className="EstimateListDataBudget">Budget: {e.budget.toLocaleString()} KRW</div>
                            <div className="EstimateListDataViewCountAndDate">
                                <div className="ViewCountAndDate">Views: {e.viewcount} </div>
                                <div className="ViewCountAndDate">Posted: {e.date}</div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    } else {
        return <div>No results found.</div>;
    }
};

const SortModal = ({
    setSort,
    close,
    setClose,
    dressfilterstyle,
    setDressfilterstyle,
    makeupfilterstyle,
    setmakeupfilterstyle,
    studiofilterstyle,
    setstudiofilterstyle,
}) => {
    const onClose = () => {
        setDressfilterstyle(0);
        setmakeupfilterstyle(0);
        setSort((prevdata) => prevdata);
    };

    const onChange = () => {
        if (dressfilterstyle === 0) {
            setDressfilterstyle(60);
            setmakeupfilterstyle(0);
            setstudiofilterstyle(0);
        } else setDressfilterstyle(0);
    };

    const onChange2 = () => {
        if (makeupfilterstyle === 0) {
            setmakeupfilterstyle(60);
            setDressfilterstyle(0);
            setstudiofilterstyle(0);
        } else setmakeupfilterstyle(0);
    };

    const onChange3 = () => {
        if (studiofilterstyle === 0) {
            setmakeupfilterstyle(0);
            setDressfilterstyle(0);
            setstudiofilterstyle(60);
        } else setstudiofilterstyle(0);
    };

    let onSortChange = (e) => {
        setSort(e.target.value);
        setClose("modal");
    };

    return (
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title" id="exampleModalLabel">
                            Filter Posts
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body filter-body">
                        <div
                            className="cursor filter-box"
                            onClick={() => {
                                setSort("Latest");
                            }}
                            data-bs-dismiss="modal"
                        >
                            Latest
                        </div>
                        <div
                            className="cursor filter-box"
                            onClick={() => {
                                setSort("Highest Price");
                            }}
                            data-bs-dismiss="modal"
                        >
                            Highest Price
                        </div>
                        <div
                            className="cursor filter-box"
                            onClick={() => {
                                setSort("Lowest Price");
                            }}
                            data-bs-dismiss="modal"
                        >
                            Lowest Price
                        </div>
                        <div
                            className="cursor filter-box"
                            onClick={() => {
                                setSort("Most Viewed");
                            }}
                            data-bs-dismiss="modal"
                        >
                            Most Viewed
                        </div>
                        <div
                            className="cursor filter-box"
                            onClick={() => {
                                onChange();
                            }}
                        >
                            Dress
                        </div>
                        <div className="filter-box-accodian" style={{ height: dressfilterstyle }}>
                            <select
                                className="form-select"
                                style={{ fontSize: 20 }}
                                data-bs-dismiss={close}
                                onChange={onSortChange}
                            >
                                <option selected={close === "none"} disabled>
                                    Select a dress style
                                </option>
                                <option value="Dress(Mermaid)">Mermaid</option>
                                <option value="Dress(A-Line)">A-Line</option>
                                <option value="Dress(H-Line)">H-Line</option>
                                <option value="Dress(Princess)">Princess</option>
                                <option value="Dress(Empire)">Empire</option>
                                <option value="Dress(Ball Gown)">Ball Gown</option>
                            </select>
                        </div>
                        <div
                            className="cursor filter-box"
                            onClick={() => {
                                onChange2();
                            }}
                        >
                            Makeup
                        </div>
                        <div className="filter-box-accodian" style={{ height: makeupfilterstyle }}>
                            <select
                                className="form-select"
                                style={{ fontSize: 20 }}
                                data-bs-dismiss={close}
                                onChange={onSortChange}
                            >
                                <option selected={close === "none"} disabled>
                                    Select a makeup style
                                </option>
                                <option value="Makeup(Romantic)">Romantic</option>
                                <option value="Makeup(Point)">Point</option>
                                <option value="Makeup(Natural)">Natural</option>
                                <option value="Makeup(Smoky)">Smoky</option>
                                <option value="Makeup(Cute)">Cute</option>
                                <option value="Makeup(Lovely)">Lovely</option>
                            </select>
                        </div>
                        <div
                            className="cursor filter-box"
                            onClick={() => {
                                onChange3();
                            }}
                        >
                            Studio
                        </div>
                        <div className="filter-box-accodian" style={{ height: studiofilterstyle }}>
                            <select
                                className="form-select"
                                style={{ fontSize: 20 }}
                                data-bs-dismiss={close}
                                onChange={onSortChange}
                            >
                                <option selected={close === "none"} disabled>
                                    Select a studio style
                                </option>
                                <option value="Studio(Subject-Focused)">Subject-Focused</option>
                                <option value="Studio(Background-Focused)">Background-Focused</option>
                                <option value="Studio(Balanced)">Balanced</option>
                            </select>
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => onClose()}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
