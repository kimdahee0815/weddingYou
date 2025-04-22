//
import "../Css/main.css";
import "../Css/EstimateForm.css";
import personCentered from "../Assets/logo.png";
//
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { format } from "date-fns";
//컴포넌트
import Footer from "../Components/Footer";
import BackButton from "../Components/Backbutton";
import NavigationBar from "../Components/NavigationBar";
import Sidesection from "../Components/Sidesection";

const EstimateForm = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.sessionStorage.getItem("email") === null) {
      navigate("../login");
    } else if (window.sessionStorage.getItem("category") === "planner") {
      navigate("/");
    }
  }, []);

  //Ref
  let dateRef = useRef();
  let regionRef = useRef();
  let budgetRef = useRef();

  let [weddingdate, setweddingdate] = useState({
    datefirst: "",
    datesecond: "",
    datethird: "",
  });

  let [weddingregion, setweddingregion] = useState({
    regionfirst: "",
    regionsecond: "",
    regionthird: "",
  });

  let [budget, setbudget] = useState("");
  let [studio, setstudio] = useState("");
  let [honeymoon, sethoneymoon] = useState("");
  let [requirement, setrequirement] = useState("");
  let [dress, setdress] = useState([]);
  let [makeup, setmakeup] = useState([]);
  let [images, setimages] = useState([]);

  //아코디언 스타일 state
  let [acco1, setacco1] = useState("");
  let [acco2, setacco2] = useState("");

  //날짜
  const weddingdateSelect = (e) => {
    if (e.target.value < format(new Date(), "yyyy-MM-dd")) {
      alert("오늘 이전의 날짜는 선택할 수 없습니다.");
      return false;
    } else {
      let copy = { ...weddingdate, [e.target.name]: e.target.value };
      setweddingdate(copy);
    }
  };

  //지역
  const weddingregionSelect = (e) => {
    let copy = { ...weddingregion, [e.target.name]: e.target.value };
    setweddingregion(copy);
  };

  //예산
  const budgetSelect = (e) => {
    const budgetRegex = /\B(?=(\d{3})+(?!\d))/g;
    const newValue = e.target.value
      .replace(/\D/g, "")
      .replace(budgetRegex, ",");
    setbudget(newValue);
  };

  const increasebudget1 = (value) => {
    const budgetRegex = /\B(?=(\d{3})+(?!\d))/g;
    let val = parseInt(budget.replace(/,/g, ""));
    if (isNaN(val)) {
      val = 0;
    }
    const newValue = (val + value)
      .toString()
      .replace(/\D/g, "")
      .replace(budgetRegex, ",");
    setbudget(newValue);
  };

  //스튜디오
  const studioSelect = (e) => {
    if (studio === e.target.value) {
      setstudio("");
    } else setstudio(e.target.value);
  };

  //신혼여행 국내 해외 아코디언
  const honeymoonaccodian = (e) => {
    if (acco1 === "") {
      setacco1("view");
      setacco2("");
      sethoneymoon("");
    } else {
      setacco1("");
      sethoneymoon("");
    }
  };
  const honeymoonaccodian2 = (e) => {
    if (acco2 === "") {
      setacco2("view");
      setacco1("");
      sethoneymoon("");
    } else {
      setacco2("");
      sethoneymoon("");
    }
  };

  //신혼여행지 선택
  const honeymoonSelect = (e) => {
    sethoneymoon(e.target.value);
  };

  //드레스
  const dresscheck = (e) => {
    const checks = document.getElementsByName("dress");
    var count = 0;
    for (let i = 0; i < checks.length; i++) {
      if (checks[i].checked) {
        count++;
      }
      if (count > 3) {
        alert("드레스 스타일은 최대 3개까지 선택 가능합니다.");
        e.target.checked = false;
        return false;
      }
    }
    if (count <= 3) {
      let copy = [...dress];
      if (copy.indexOf(e.target.value) === -1) {
        copy.push(e.target.value);
        setdress(copy);
      } else {
        let index = copy.indexOf(e.target.value);
        copy.splice(index, 1);
        setdress(copy);
      }
    }
  };

  //메이크업
  const makeupcheck = (e) => {
    const checks = document.getElementsByName("makeup");
    var count = 0;
    for (let i = 0; i < checks.length; i++) {
      if (checks[i].checked) {
        count++;
      }
      if (count > 3) {
        alert("메이크업 스타일은 최대 3개까지 선택 가능합니다.");
        e.target.checked = false;
        return false;
      }
    }
    if (count <= 3) {
      let copy = [...makeup];
      if (copy.indexOf(e.target.value) === -1) {
        copy.push(e.target.value);
        setmakeup(copy);
      } else {
        let index = copy.indexOf(e.target.value);
        copy.splice(index, 1);
        setmakeup(copy);
      }
    }
  };

  //이미지 파일 첨부
  const imageSelect = (e) => {
    if (images.length >= 5 || e.target.files.length + images.length > 5) {
      alert("파일 첨부는 5개까지 가능합니다.");
      e.target.value = null;
    } else {
      let copy = [...images];
      for (let i = 0; i < e.target.files.length; i++) {
        copy.push(e.target.files[i]);
      }
      setimages(copy);
    }
  };

  //이미지 파일 초기화
  const imageClear = () => {
    setimages([]);
  };
  //이미지 파일 개별 삭제
  const deleteimage = (image) => {
    let copy = [...images];
    for (let i = 0; i < copy.length; i++) {
      console.log(i);
      if (copy[i].name === image) {
        copy.splice(i, 1);
        setimages(copy);
        break;
      }
    }
  };

  //요청사항
  const requirementChange = (e) => {
    setrequirement(e.target.value);
  };

  //JSON 변환
  let submitdate = JSON.stringify([
    weddingdate.datefirst,
    weddingdate.datesecond,
    weddingdate.datethird,
  ]);
  let submitregion = JSON.stringify([
    weddingregion.regionfirst,
    weddingregion.regionsecond,
    weddingregion.regionthird,
  ]);
  let submitdress = JSON.stringify(dress);
  let submitmakeup = JSON.stringify(makeup);
  //JSON 변환

  const onSubmit = () => {
    if (weddingdate.datefirst === "") {
      alert("1순위 날짜 입력은 필수입니다.");
      dateRef.current.focus();
      return false;
    }
    if (
      weddingdate.datefirst === weddingdate.datesecond ||
      weddingdate.datefirst === weddingdate.datethird
    ) {
      alert("각각 다른 날짜를 선택해주세요");
      dateRef.current.focus();
      return false;
    }

    if (weddingregion.regionfirst === "") {
      alert("1순위 지역 입력은 필수입니다.");
      regionRef.current.focus();
      return false;
    }

    if (
      weddingregion.regionfirst === weddingregion.regionsecond ||
      weddingregion.regionfirst === weddingregion.regionthird ||
      (weddingregion.regionsecond === weddingregion.regionthird &&
        (weddingregion.regionsecond !== "" || weddingregion.regionthird !== ""))
    ) {
      alert("서로 다른 지역을 선택해주세요");
      regionRef.current.focus();
      return false;
    }

    if (studio === "") {
      alert("스튜디오 선택은 필수입니다.");
      return false;
    }

    if (window.confirm("작성하시겠습니까?")) {
      let integerBudget;
      let formData = new FormData();
      if (budget === "") {
        integerBudget = 0;
      } else {
        integerBudget = parseInt(budget.replace(/,/g, ""));
      }
      formData.append("weddingdate", submitdate);
      formData.append("budget", integerBudget);
      formData.append("region", submitregion);
      formData.append("honeymoon", honeymoon);
      formData.append("makeup", submitmakeup);
      formData.append("dress", submitdress);
      formData.append("requirement", requirement);
      formData.append("studio", studio);
      formData.append("writer", window.sessionStorage.getItem("email"));
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append("uploadfiles", images[i]);
        }
      }
      axios
        .post("http://localhost:8080/estimate/write", formData)
        .then((res) => {
          console.log("성공");
          navigate("/estimatelist");
        })
        .catch((e) => {
          alert("홈페이지에 오류가 발생하였습니다. 다시 시도해주세요");
          console.log(e);
        });
    }
  };

  return (
    <div className="containerbox">
      <div className="mainlayout box1" style={{ height: "100%" }}>
        <NavigationBar title="내가 원하는 웨딩은?" />
        <div className="contentcontainer">
          <div className="contentbox">
            <h5
              onClick={() => {
                console.log(images);
              }}
            >
              희망 결혼 예정일
            </h5>
            <div className="choosebox">
              <span>1순위</span>
              <input
                type="date"
                ref={dateRef}
                className="form-control"
                onChange={weddingdateSelect}
                value={weddingdate.datefirst}
                name="datefirst"
              />
            </div>
            <div className="choosebox">
              <span>2순위</span>
              <input
                type="date"
                className="form-control"
                onChange={weddingdateSelect}
                value={weddingdate.datesecond}
                name="datesecond"
              />
            </div>
            <div className="choosebox">
              <span>3순위</span>
              <input
                type="date"
                className="form-control"
                onChange={weddingdateSelect}
                value={weddingdate.datethird}
                name="datethird"
              />
            </div>
            {/* <hr></hr> */}
          </div>
          <div className="contentbox">
            <h5>희망 결혼 지역</h5>
            <div className="choosebox">
              <span>1순위</span>
              {/* <input
              type="text"
              className="w-100 form-control"
              onChange={weddingregionSelect}
              name="regionfirst"
              ref={regionRef}
            /> */}
              <RegionList
                name="regionfirst"
                weddingregionSelect={weddingregionSelect}
                regionRef={regionRef}
              />
            </div>
            <div className="choosebox">
              <span>2순위</span>
              <RegionList
                name="regionsecond"
                weddingregionSelect={weddingregionSelect}
              />
            </div>
            <div className="choosebox">
              <span>3순위</span>
              <RegionList
                name="regionthird"
                weddingregionSelect={weddingregionSelect}
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>예산</h5>
            <div className="choosebox">
              <input
                type="text"
                className="w-100 form-control budget-input"
                value={budget}
                onChange={budgetSelect}
                ref={budgetRef}
              />
              <div
                className="budget-btn cursor"
                onClick={() => {
                  increasebudget1(1000000);
                }}
              >
                +1백만
              </div>
              <div
                className="budget-btn cursor"
                onClick={() => {
                  increasebudget1(100000);
                }}
              >
                +1십만
              </div>
              <div
                className="budget-btn cursor"
                onClick={() => {
                  increasebudget1(10000);
                }}
              >
                +1만
              </div>
            </div>
            <span>원</span>
          </div>
          <div className="contentbox">
            <h5>스튜디오</h5>
            <div className="choosebox">
              <input
                id="person"
                name="studio"
                type="radio"
                value="인물중심"
                onClick={studioSelect}
                checked={studio === "인물중심"}
                className="displaynone"
              />
              <label htmlFor="person" className="label-design w-100 cursor">
                인물중심
              </label>
            </div>
            <div className="choosebox">
              <input
                id="background"
                name="studio"
                type="radio"
                value="배경중심"
                checked={studio === "배경중심"}
                onClick={studioSelect}
                className="displaynone"
              />
              <label htmlFor="background" className="label-design w-100 cursor">
                배경중심
              </label>
            </div>
            <div className="choosebox">
              <input
                id="balanced"
                name="studio"
                type="radio"
                value="균형적인"
                checked={studio === "균형적인"}
                onClick={studioSelect}
                className="displaynone"
              />
              <label htmlFor="balanced" className="label-design w-100 cursor">
                균형적인
              </label>
            </div>
            <div>
              <span>
                스튜디오 스타일이 궁금하다면?&nbsp;
                <span
                  type="button"
                  className="badge bg-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#studioModal"
                >
                  Click
                </span>
              </span>
            </div>
          </div>

          <div className="contentbox">
            <h5>신부 드레스 (3개까지 선택가능)</h5>
            <div className="choosebox">
              <input
                id="머메이드"
                type="checkbox"
                name="dress"
                value="머메이드"
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="머메이드" className="label-design w-100 cursor">
                머메이드
                {dress.includes("머메이드") ? (
                  <span className="ranking">
                    {dress.indexOf("머메이드") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="A라인"
                type="checkbox"
                name="dress"
                value="A라인"
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="A라인" className="label-design w-100 cursor">
                A라인
                {dress.includes("A라인") ? (
                  <span className="ranking">
                    {dress.indexOf("A라인") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="H라인"
                type="checkbox"
                name="dress"
                value="H라인"
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="H라인" className="label-design w-100 cursor">
                H라인
                {dress.includes("H라인") ? (
                  <span className="ranking">
                    {dress.indexOf("H라인") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="벨라인"
                type="checkbox"
                name="dress"
                value="벨라인"
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="벨라인" className="label-design w-100 cursor">
                벨라인
                {dress.includes("벨라인") ? (
                  <span className="ranking">
                    {dress.indexOf("벨라인") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="엠파이어"
                type="checkbox"
                name="dress"
                value="엠파이어"
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="엠파이어" className="label-design w-100 cursor">
                엠파이어
                {dress.includes("엠파이어") ? (
                  <span className="ranking">
                    {dress.indexOf("엠파이어") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="프린세스"
                type="checkbox"
                name="dress"
                value="프린세스"
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="프린세스" className="label-design w-100 cursor">
                프린세스
                {dress.includes("프린세스") ? (
                  <span className="ranking">
                    {dress.indexOf("프린세스") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <span>
              드레스 스타일이 궁금하다면?&nbsp;
              <span
                type="button"
                className="badge bg-primary"
                data-bs-toggle="modal"
                data-bs-target="#dressModal"
              >
                Click
              </span>
            </span>
          </div>
          <div className="contentbox">
            <h5>신부 메이크업 (3개까지 선택가능)</h5>
            <div className="choosebox">
              <input
                id="로맨틱한"
                type="checkbox"
                name="makeup"
                value="로맨틱한"
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="로맨틱한" className="label-design w-100 cursor">
                로맨틱한
                {makeup.includes("로맨틱한") ? (
                  <span className="ranking">
                    {makeup.indexOf("로맨틱한") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="포인트"
                type="checkbox"
                name="makeup"
                value="포인트"
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="포인트" className="label-design w-100 cursor">
                포인트
                {makeup.includes("포인트") ? (
                  <span className="ranking">
                    {makeup.indexOf("포인트") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="내추럴"
                type="checkbox"
                name="makeup"
                value="내추럴"
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="내추럴" className="label-design w-100 cursor">
                내추럴
                {makeup.includes("내추럴") ? (
                  <span className="ranking">
                    {makeup.indexOf("내추럴") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="스모키"
                type="checkbox"
                name="makeup"
                value="스모키"
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="스모키" className="label-design w-100 cursor">
                스모키
                {makeup.includes("스모키") ? (
                  <span className="ranking">
                    {makeup.indexOf("스모키") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="큐티"
                type="checkbox"
                name="makeup"
                value="큐티"
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="큐티" className="label-design w-100 cursor">
                큐티
                {makeup.includes("큐티") ? (
                  <span className="ranking">
                    {makeup.indexOf("큐티") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="러블리"
                type="checkbox"
                name="makeup"
                value="러블리"
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="러블리" className="label-design w-100 cursor">
                러블리
                {makeup.includes("러블리") ? (
                  <span className="ranking">
                    {makeup.indexOf("러블리") + 1}순위
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <span>
              메이크업 스타일이 궁금하다면?&nbsp;
              <span
                type="button"
                className="badge bg-primary"
                data-bs-toggle="modal"
                data-bs-target="#makeupModal"
              >
                Click
              </span>
            </span>
          </div>
          <div className="contentbox">
            <h5>신혼여행</h5>
            <div className="choosebox">
              <input
                id="해외"
                type="radio"
                name="honeymoon"
                value="해외"
                onClick={honeymoonaccodian}
                checked={acco1 === "view"}
                className="displaynone"
              />
              <label htmlFor="해외" className="label-design w-100 cursor">
                해외
              </label>
            </div>
            <div className="choosebox">
              <input
                id="국내"
                type="radio"
                name="honeymoon"
                value="국내"
                onClick={honeymoonaccodian2}
                checked={acco2 === "view"}
                className="displaynone"
              />
              <label htmlFor="국내" className="label-design w-100 cursor">
                국내
              </label>
            </div>
            <div className={`hideeee ${acco1}`}>
              <select
                class="form-select form-select-lg mb-3 cursor"
                aria-label=".form-select-lg example"
                onChange={honeymoonSelect}
                style={{ fontSize: 17 }}
              >
                <option selected={acco1 === "view"} disabled>
                  해외 여행지를 선택해주세요
                </option>
                <optgroup label="아시아">
                  <option value="해외-발리">발리</option>
                  <option value="해외-코타키나발루">코타키나발루</option>
                  <option value="해외-푸꾸옥제도">푸꾸옥제도</option>
                  <option value="해외-하노이">하노이</option>
                  <option value="해외-다낭">다낭</option>
                  <option value="해외-호치민">호치민</option>
                  <option value="해외-태국(방콕)">태국</option>
                  <option value="해외-후쿠오카">후쿠오카</option>
                  <option value="해외-오사카">오사카</option>
                  <option value="해외-괌">괌</option>
                </optgroup>
                <optgroup label="북미">
                  <option value="해외-하와이">하와이</option>
                  <option value="해외-라스베이거스">라스베이거스</option>
                  <option value="해외-로스앤젤레스">로스앤젤레스</option>
                  <option value="해외-샌프란시스코">샌프란시스코</option>
                  <option value="해외-뉴욕">뉴욕</option>
                  <option value="해외-알래스카">알래스카</option>
                  <option value="해외-캐나다">캐나다</option>
                  <option value="해외-멕시코">멕시코</option>
                </optgroup>
                <optgroup label="유럽">
                  <option value="해외-파리">파리</option>
                  <option value="해외-로마">로마</option>
                  <option value="해외-베니스">베니스</option>
                  <option value="해외-프라하">프라하</option>
                  <option value="해외-마드리드">마드리드</option>
                  <option value="해외-바르셀로나">바르셀로나</option>
                  <option value="해외-프라하">프라하</option>
                  <option value="해외-산토리니">산토리니</option>
                  <option value="해외-런던">런던</option>
                </optgroup>
                <optgroup label="중동">
                  <option value="해외-두바이">두바이</option>
                  <option value="해외-아부다비">아부다비</option>
                </optgroup>
                <optgroup label="오세아니아">
                  <option value="해외-시드니">시드니</option>
                  <option value="해외-골드코스트">골드코스트</option>
                  <option value="해외-케언즈">케언즈</option>
                  <option value="해외-뉴질랜드">뉴질랜드</option>
                </optgroup>
                <optgroup label="북유럽">
                  <option value="해외-스웨덴">스웨덴</option>
                  <option value="해외-노르웨이">노르웨이</option>
                  <option value="해외-핀란드">핀란드</option>
                  <option value="해외-덴마크">덴마크</option>
                </optgroup>
                <optgroup label="남미">
                  <option value="해외-칠레">칠레</option>
                  <option value="해외-아르헨티나">아르헨티나</option>
                  <option value="해외-페루">페루</option>
                </optgroup>
                <optgroup label="아프리카">
                  <option value="해외-모로코">모로코</option>
                  <option value="해외-남아공">남아공</option>
                </optgroup>
                <optgroup label="기타">
                  <option value="해외-기타">기타</option>
                </optgroup>
              </select>
            </div>
            <div className={`hideeee ${acco2}`}>
              <select
                class="form-select form-select-lg mb-3 cursor"
                aria-label=".form-select-lg example"
                onChange={honeymoonSelect}
                style={{ fontSize: 17 }}
              >
                <option selected={acco2 === "view"} disabled>
                  국내여행지를 선택해주세요
                </option>
                <optgroup label="섬">
                  <option value="국내-제주도">제주도</option>
                  <option value="국내-울릉도">울릉도</option>
                  <option value="국내-남해도">남해도</option>
                  <option value="국내-강화도">강화도</option>
                  <option value="국내-완도">완도</option>
                  <option value="국내-거제도"></option>
                </optgroup>
                <optgroup label="경기도">
                  <option value="국내-가평">가평</option>
                  <option value="국내-파주">파주</option>
                  <option value="국내-양평">양평</option>
                </optgroup>
                <optgroup label="경상남도">
                  <option value="국내-남해">남해</option>
                  <option value="국내-통영">통영</option>
                  <option value="국내-부산">부산</option>
                </optgroup>
                <optgroup label="경상북도">
                  <option value="국내-안동">안동</option>
                  <option value="국내-경주">경주</option>
                  <option value="국내-포항">포항</option>
                </optgroup>
                <optgroup label="전라남도">
                  <option value="국내-목포">목포</option>
                  <option value="국내-여수">여수</option>
                  <option value="국내-순천">순천</option>
                </optgroup>
                <optgroup label="전라북도">
                  <option value="국내-전주">전주</option>
                  <option value="국내-군산">군산</option>
                  <option value="국내-순천">순천</option>
                  <option value="국내-고창">고창</option>
                </optgroup>
                <optgroup label="충청남도">
                  <option value="국내-보령">보령</option>
                  <option value="국내-태안">태안</option>
                  <option value="국내-아산">아산</option>
                </optgroup>
                <optgroup label="충청북도">
                  <option value="국내-청주">청주</option>
                  <option value="국내-단양">단양</option>
                  <option value="국내-제천">제천</option>
                </optgroup>
                <optgroup label="강원도">
                  <option value="국내-강릉">강릉</option>
                  <option value="국내-속초">속초</option>
                  <option value="국내-양양">양양</option>
                  <option value="국내-춘천">춘천</option>
                  <option value="국내-홍천">홍천</option>
                </optgroup>
                <optgroup label="기타">
                  <option value="국내-기타">기타</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="contentbox">
            <h5>이미지첨부</h5>
            <div className="choosebox" style={{ width: "70%" }}>
              <input
                type="file"
                multiple
                onChange={imageSelect}
                accept="image/*"
                id="uploadimage"
                className="displaynone"
              />
              <label htmlFor="uploadimage" className="cursor imageupload-btn">
                이미지첨부하기
              </label>
              <div style={{ marginTop: 5 }}>
                {images.map((image, index) => {
                  return (
                    <div className="imagefilenamebox">
                      <div className="imagefilenamecontent">
                        <span>{image.name}</span>
                        <div
                          className="imagefilename-overlay cursor"
                          onClick={() => {
                            deleteimage(image.name);
                          }}
                        >
                          <i class="bi bi-x-lg"></i>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* {images.length > 0 && (
              <span>
                {images.length}개의 이미지{" "}
                <div
                  className="image-clear-btn cursor"
                  onClick={() => {
                    imageClear();
                  }}
                >
                  취소
                </div>
              </span>
            )} */}
            </div>
          </div>
          <div className="contentbox" style={{ borderBottom: "none" }}>
            <h5>추가 요청사항</h5>
            <div className="choosebox w-100">
              <textarea
                className="form-control"
                rows="7"
                value={requirement}
                onChange={requirementChange}
                placeholder="추가 요청사항을 입력해주세요"
                style={{ fontSize: 20 }}
              ></textarea>
            </div>
          </div>
          <div className="Signup-button">
            <button
              onClick={() => {
                onSubmit();
              }}
              className="btn-colour-1"
              style={{ marginRight: "15px" }}
            >
              작성하기
            </button>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="btn-colour-1"
            >
              취소
            </button>
          </div>
        </div>
        <div style={{ height: 94.19 }}></div>
        <Footer />
        <StudioModal />
        <DressModal />
        <MakeupModal />
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
};

export default EstimateForm;

const StudioModal = () => {
  return (
    <div
      className="modal fade"
      id="studioModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              <span>스튜디오</span>
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="accordion" id="accordionExample1">
              <AccordionComp
                heading={1}
                collapse="one"
                topic="인물중심 스튜디오"
                image1="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1667180129.jpg&w=1920&q=75"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_11679_1665982500_05988600_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_1708_1665976697_88410900_3232256100.jpg"
                comment1="깔끔한 배경에서 인물중심의 촬영을 진행해요!"
                comment2="심플하고 깨끗한 이미지의 결과물!"
                comment3="오래두고 보아도 질리지 않는 장점이 있어요!"
                _id="accordionExample1"
              />
              <AccordionComp
                heading={2}
                collapse="two"
                topic="배경중심 스튜디오"
                image1="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1663831599.jpg&w=1920&q=75"
                image2="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1663808804.jpg&w=1920&q=75"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_13581_1665985281_96465800_3232256098.jpg"
                comment1="촬영 자체의 특별한 경험을 선사해요!"
                comment2="스튜디오 고유의 배경과 분위기를 담을 수 있답니다!"
                comment3="화려한 배경 덕에 부담이 덜해요!"
                _id="accordionExample1"
              />
              <AccordionComp
                heading={3}
                collapse="three"
                topic="균형적인 스튜디오"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_12512_1666920642_83238100_3232256098.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_12544_1666688374_16242500_3232256098.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_13300_1668503581_00621700_3232256098.jpg"
                comment1="요즘 가장 인기있는 스타일이에요!"
                comment2="배경과 인물 모두 예쁘게 담을 수 있답니다~"
                comment3="자연스러운 행동위주의 연출도 가능해요!"
                _id="accordionExample1"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DressModal = () => {
  return (
    <div
      className="modal fade"
      id="dressModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              <span>드레스</span>
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="accordion" id="accordionExample2">
              <AccordionComp
                heading={4}
                collapse="four"
                topic="머메이드"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_d120_2001_1632361176_65452700_3232256100.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4250_1668583465_80283900_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800___1665453271_05641100_3232256098.jpg"
                comment1="키가 크시고 마르신 분들에게 추천해요!"
                comment2="허리와 힙을 강조해요!"
                comment3="하지만 움직임에 제약이 많은 단점이 있습니다."
                _id="accordionExample2"
              />
              <AccordionComp
                heading={5}
                collapse="five"
                topic="A라인"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_5350_1679279312_93081100_3232256098.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4365_1674628854_18110500_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_12996_1677040520_50476000_3232256099.jpg"
                comment1="어떤 체형이든 잘 어울립니다!"
                comment2="키가 커보이는 스타일이에요!"
                comment3="하체가 통통하신 분들에게도 추천!"
                _id="accordionExample2"
              />
              <AccordionComp
                heading={6}
                collapse="six"
                topic="H라인"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_4794_1679476555_79191600_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800___1665130500_49819100_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800___1665454832_07143300_3232256099.jpg"
                comment1="섹시함과 성숙함을 함께 나타낼 수 있어요!"
                comment2="날씬하신 분들께 추천합니다!"
                comment3="슬림한 느낌을 줍니다"
                _id="accordionExample2"
              />
              <AccordionComp
                heading={7}
                collapse="seven"
                topic="벨라인"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_5218_1675921472_92970900_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4796_1679476532_21876000_3232256099.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_14256_1681265613_43329300_3232256100.jpg"
                comment1="허리부터 풍성하게 퍼지는 라인이 특징입니다"
                comment2="통통한 하체를 커버하기에 좋습니다"
                comment3="키가 작고 마른 신부님들에게도 추천해요!"
                _id="accordionExample2"
              />
              <AccordionComp
                heading={8}
                collapse="eight"
                topic="엠파이어"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_14083_1675239691_84022800_3232256098.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_d247_14923_1649140504_74715200_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_d276_6631_1582187346_70709200_3232256098.jpg"
                comment1="날씬해보이는 드레스 스타일입니다!"
                comment2="직사각형 체형분들에게 추천해요"
                comment3="하체가 길어보인답니다~"
                _id="accordionExample2"
              />
              <AccordionComp
                heading={9}
                collapse="nine"
                topic="프린세스"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_17534_1673254073_72786200_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_15343_1674625658_77782300_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_13164_1676956927_35327800_3232256098.jpg"
                comment1="화려한 장식을 더한 드레스입니다!"
                comment2="여성적인 매력을 어필하기에 좋아요!"
                comment3="허리선이 굵은 분들에게 추천해요!"
                _id="accordionExample2"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MakeupModal = () => {
  return (
    <div
      className="modal fade"
      id="makeupModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              <span>메이크업</span>
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="accordion" id="accordionExample3">
              <AccordionComp
                heading={10}
                collapse="ten"
                topic="로맨틱한"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_2294_1680250969_59017300_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m056_14449_1640850193_39487800_3232256099.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m205_13076_1624261891_10019500_3232256100.jpg"
                comment1="촉촉하고 투명한 느낌을 줍니다!"
                comment2="핑크색의 색조를 많이 사용해요!"
                comment3="피부가 하얀분들에게 추천해요!"
                _id="accordionExample3"
              />
              <AccordionComp
                heading={11}
                collapse="eleven"
                topic="포인트"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_17895_1680164863_59917800_3232256100.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_17622_1673943339_73525400_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m051_15898_1654237244_14286700_3232256099.jpg"
                comment1="내추럴 메이크업에서 포인트를 더한 메이크업입니다!"
                comment2="수수한 느낌보다는 화려한 느낌을 살려줍니다"
                comment3="스타일이 조금은 과해서 스튜디오 촬영 때 많이 이용되는 스타일입니다"
                _id="accordionExample3"
              />
              <AccordionComp
                heading={12}
                collapse="twelve"
                topic="내추럴"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m114_1711_1647822940_71648700_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m209_15869_1653530666_48849500_3232256098.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m134_4309_1661326982_18419000_3232256098.jpg"
                comment1="가장 기본적인 스타일입니다!"
                comment2="평소 메이크업을 잘 하지 않는 분들에게 추천드려요"
                comment3="자연스럽고 깨끗해 보이는 점이 장점입니다."
                _id="accordionExample3"
              />
              <AccordionComp
                heading={13}
                collapse="thirteen"
                topic="스모키"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m122_1845_1628473766_68122500_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_1844_1678866654_71494500_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m199_6483_1585638230_88987100_3232256098.jpg"
                comment1="눈매를 강조하는 화장입니다!"
                comment2="이목구비가 뚜렷하게 보이는 장점이 있어요!"
                comment3="하지만 평소에 인상이 쎄시다면 추천드리지 않습니다"
                _id="accordionExample3"
              />
              <AccordionComp
                heading={14}
                collapse="fourteen"
                topic="큐티"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m205_13078_1624261921_87529100_3232256100.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m197_6298_1628237690_62191600_3232256098.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m152_12803_1652060864_24013300_3232256099.jpg"
                comment1="상큼하고 귀여운 모습의 연출이 가능해요"
                comment2="동그랗게 올린 머리가 특징입니다!"
                comment3="얼굴이 크시거나, 이마가 넓으시다면 피하시는 게 좋습니다"
                _id="accordionExample3"
              />
              <AccordionComp
                heading={15}
                collapse="fifteen"
                topic="러블리"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_17670_1676267275_58014900_3232256099.jpg"
                image2="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1663894788.jpg&w=1920&q=75"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m175_6093_1604471404_02327900_3232256100.jpg"
                comment1="얼굴에 화사함을 주는 스타일입니다"
                comment2="어려보이는 효과를 줍니다"
                comment3="갓 짜낸 과즙을 담아낸 듯한 스타일이에요"
                _id="accordionExample3"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccordionComp = ({
  heading,
  collapse,
  topic,
  image1,
  image2,
  image3,
  comment1,
  comment2,
  comment3,
  _id,
}) => {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={heading}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${collapse}`}
          aria-expanded="false"
          aria-controls={heading}
        >
          <span>{topic}</span>
        </button>
      </h2>
      <div
        id={collapse}
        className="accordion-collapse collapse"
        aria-labelledby={heading}
        data-bs-parent={`#${_id}`}
      >
        <div className="accordion-body p-0">
          <div className="exampleimagebox">
            <div className="exampleimage">
              <Carousel
                image1={image1}
                image2={image2}
                image3={image3}
                heading={heading}
              />
            </div>
          </div>

          <div className="Accordion-explanation">
            <h5>설명 및 특징</h5>
            <ul>
              <li>- {comment1}</li>
              <li>- {comment2}</li>
              <li>- {comment3}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Carousel = ({ image1, image2, image3, collapse, heading }) => {
  return (
    <div
      id={`carouselExampleDark${heading}`}
      className="carousel carousel-dark slide w-100 height100"
      data-bs-ride="carousel"
    >
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target={`#carouselExampleDark${heading}`}
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target={`#carouselExampleDark${heading}`}
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target={`#carouselExampleDark${heading}`}
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="10000">
          <img
            src={image1}
            className="d-block w-100"
            style={{ height: 450 }}
            alt="..."
          />
          <div className="carousel-caption d-none d-md-block"></div>
        </div>
        <div className="carousel-item" data-bs-interval="2000">
          <img
            src={image2}
            className="d-block w-100"
            style={{ height: 450 }}
            alt="..."
          />
          <div className="carousel-caption d-none d-md-block"></div>
        </div>
        <div className="carousel-item">
          <img
            src={image3}
            className="d-block w-100"
            style={{ height: 450 }}
            alt="..."
          />
          <div className="carousel-caption d-none d-md-block"></div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#carouselExampleDark${heading}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#carouselExampleDark${heading}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

const RegionList = ({ name, weddingregionSelect, regionRef }) => {
  return (
    <>
      <select
        class="form-select form-select-lg mb-3 cursor"
        aria-label=".form-select-lg example"
        style={{ fontSize: 18 }}
        name={name}
        onChange={weddingregionSelect}
        ref={regionRef}
      >
        <option value="">미선택</option>
        <optgroup label="제주도 및 광역시">
          <option value="부산광역시">부산광역시</option>
          <option value="인천광역시">인천광역시</option>
          <option value="대구광역시">대구광역시</option>
          <option value="대전광역시">대전광역시</option>
          <option value="광주광역시">광주광역시</option>
          <option value="울산광역시">울산광역시</option>
          <option value="제주도">제주도</option>
        </optgroup>
        <optgroup label="서울">
          <option value="서울강남구">강남구</option>
          <option value="서울강동구">강동구</option>
          <option value="서울강북구">강북구</option>
          <option value="서울강서구">강서구</option>
          <option value="서울관악구">관악구</option>
          <option value="서울광진구">광진구</option>
          <option value="서울구로구">구로구</option>
          <option value="서울금천구">금천구</option>
          <option value="서울노원구">노원구</option>
          <option value="서울도봉구">도봉구</option>
          <option value="서울동대문구">동대문구</option>
          <option value="서울동작구">동작구</option>
          <option value="서울마포구">마포구</option>
          <option value="서울서대문구">서대문구</option>
          <option value="서울서초구">서초구</option>
          <option value="서울성동구">성동구</option>
          <option value="서울성북구">성북구</option>
          <option value="서울송파구">송파구</option>
          <option value="서울양천구">양천구</option>
          <option value="서울영등포구">영등포구</option>
          <option value="서울용산구">용산구</option>
          <option value="서울은평구">은평구</option>
          <option value="서울종로구">종로구</option>
          <option value="서울중구">중구</option>
          <option value="서울중랑구">중랑구</option>
        </optgroup>
        <optgroup label="경기도">
          <option value="가평군">가평군</option>
          <option value="고양시">고양시</option>
          <option value="과천시">과천시</option>
          <option value="광명시">광명시</option>
          <option value="광주시">광주시</option>
          <option value="구리시">구리시</option>
          <option value="군포시">군포시</option>
          <option value="김포시">김포시</option>
          <option value="남양주시">남양주시</option>
          <option value="동두천시">동두천시</option>
          <option value="부천시">부천시</option>
          <option value="성남시">성남시</option>
          <option value="수원시">수원시</option>
          <option value="시흥시">시흥시</option>
          <option value="안산시">안산시</option>
          <option value="안성시">안성시</option>
          <option value="안양시">안양시</option>
          <option value="양주시">양주시</option>
          <option value="양평군">양평군</option>
          <option value="여주시">여주시</option>
          <option value="연천군">연천군</option>
          <option value="오산시">오산시</option>
          <option value="용인시">용인시</option>
          <option value="의왕시">의왕시</option>
          <option value="의정부시">의정부시</option>
          <option value="이천시">이천시</option>
          <option value="파주시">파주시</option>
          <option value="평택시">평택시</option>
          <option value="포천시">포천시</option>
          <option value="하남시">하남시</option>
          <option value="화성시">화성시</option>
        </optgroup>
        <optgroup label="강원도">
          <option value="강릉시">강릉시</option>
          <option value="고성군">고성군</option>
          <option value="동해시">동해시</option>
          <option value="삼척시">삼척시</option>
          <option value="속초시">속초시</option>
          <option value="양구군">양구군</option>
          <option value="양양군">양양군</option>
          <option value="영월군">영월군</option>
          <option value="원주시">원주시</option>
          <option value="인제군">인제군</option>
          <option value="정선군">정선군</option>
          <option value="철원군">철원군</option>
          <option value="춘천시">춘천시</option>
          <option value="태백시">태백시</option>
          <option value="평창군">평창군</option>
          <option value="홍천군">홍천군</option>
          <option value="화천군">화천군</option>
          <option value="횡성군">횡성군</option>
        </optgroup>
        <optgroup label="충청남도">
          <option value="계룡시">계룡시</option>
          <option value="공주시">공주시</option>
          <option value="금산군">금산군</option>
          <option value="논산시">논산시</option>
          <option value="당진시">당진시</option>
          <option value="보령시">보령시</option>
          <option value="부여군">부여군</option>
          <option value="서산시">서산시</option>
          <option value="서천군">서천군</option>
          <option value="아산시">아산시</option>
          <option value="예산군">예산군</option>
          <option value="천안시">천안시</option>
          <option value="청양군">청양군</option>
          <option value="태안군">태안군</option>
          <option value="홍성군">홍성군</option>
        </optgroup>
        <optgroup label="충청북도">
          <option value="괴산군">괴산군</option>
          <option value="단양군">단양군</option>
          <option value="보은군">보은군</option>
          <option value="영동군">영동군</option>
          <option value="옥천군">옥천군</option>
          <option value="음성군">음성군</option>
          <option value="제천시">제천시</option>
          <option value="증평군">증평군</option>
          <option value="진천군">진천군</option>
          <option value="청원군">청원군</option>
          <option value="청주시">청주시</option>
          <option value="충주시">충주시</option>
        </optgroup>
        <optgroup label="전라북도">
          <option value="고창군">고창군</option>
          <option value="군산시">군산시</option>
          <option value="김제시">김제시</option>
          <option value="남원시">남원시</option>
          <option value="무주군">무주군</option>
          <option value="부안군">부안군</option>
          <option value="순창군">순창군</option>
          <option value="완주군">완주군</option>
          <option value="익산시">익산시</option>
          <option value="임실군">임실군</option>
          <option value="전주시">전주시</option>
          <option value="정읍시">정읍시</option>
        </optgroup>
        <optgroup label="전라남도">
          <option value="강진군">강진군</option>
          <option value="고흥군">고흥군</option>
          <option value="곡성군">곡성군</option>
          <option value="광양시">광양시</option>
          <option value="장성군">장성군</option>
          <option value="나주시">나주시</option>
          <option value="담양군">담양군</option>
          <option value="목포시">목포시</option>
          <option value="무안군">무안군</option>
          <option value="보성군">보성군</option>
          <option value="순천시">순천시</option>
          <option value="신안군">신안군</option>
          <option value="여수시">여수시</option>
          <option value="영광군">영광군</option>
          <option value="영암군">영암군</option>
          <option value="완도군">완도군</option>
          <option value="장성군">장성군</option>
          <option value="장흥군">장흥군</option>
          <option value="진도군">진도군</option>
          <option value="함평군">함평군</option>
          <option value="해남군">해남군</option>
          <option value="화순군">화순군</option>
        </optgroup>
        <optgroup label="경상북도">
          <option value="경산시">경산시</option>
          <option value="경주시">경주시</option>
          <option value="고령군">고령군</option>
          <option value="구미시">구미시</option>
          <option value="군위군">군위군</option>
          <option value="김천시">김천시</option>
          <option value="문경시">문경시</option>
          <option value="봉화군">봉화군</option>
          <option value="상주시">상주시</option>
          <option value="성주군">성주군</option>
          <option value="안동시">안동시</option>
          <option value="영덕군">영덕군</option>
          <option value="영양군">영양군</option>
          <option value="영주시">영주시</option>
          <option value="영천시">영천시</option>
          <option value="예천군">예천군</option>
          <option value="울릉군">울릉군</option>
          <option value="울진군">울진군</option>
          <option value="의성군">의성군</option>
          <option value="청도군">청도군</option>
          <option value="청송군">청송군</option>
          <option value="칠곡군">칠곡군</option>
          <option value="포항시">포항시</option>
        </optgroup>
        <optgroup label="경상북도">
          <option value="경산시">경산시</option>
          <option value="경주시">경주시</option>
          <option value="고령군">고령군</option>
          <option value="구미시">구미시</option>
          <option value="군위군">군위군</option>
          <option value="김천시">김천시</option>
          <option value="문경시">문경시</option>
          <option value="봉화군">봉화군</option>
          <option value="상주시">상주시</option>
          <option value="성주군">성주군</option>
          <option value="안동시">안동시</option>
          <option value="영덕군">영덕군</option>
          <option value="영양군">영양군</option>
          <option value="영주시">영주시</option>
          <option value="영천시">영천시</option>
          <option value="예천군">예천군</option>
          <option value="울릉군">울릉군</option>
          <option value="울진군">울진군</option>
          <option value="의성군">의성군</option>
          <option value="청도군">청도군</option>
          <option value="청송군">청송군</option>
          <option value="칠곡군">칠곡군</option>
          <option value="포항시">포항시</option>
        </optgroup>
        <optgroup label="경상남도">
          <option value="거제시">거제시</option>
          <option value="거창군">거창군</option>
          <option value="고성군">고성군</option>
          <option value="김해시">김해시</option>
          <option value="남해군">남해군</option>
          <option value="밀양시">밀양시</option>
          <option value="사천시">사천시</option>
          <option value="산청군">산청군</option>
          <option value="양산시">양산시</option>
          <option value="의령군">의령군</option>
          <option value="진주시">진주시</option>
          <option value="창녕군">창녕군</option>
          <option value="창원시">창원시</option>
          <option value="통영시">통영시</option>
          <option value="하동군">하동군</option>
          <option value="함안군">함안군</option>
          <option value="함양군">함양군</option>
          <option value="합천군">합천군</option>
        </optgroup>
      </select>
    </>
  );
};
