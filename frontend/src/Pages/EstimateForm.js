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
      alert("You cannot select a past date.");
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
        alert("You can select up to 3 dress styles.");
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
        alert("You can select up to 3 makeup styles.");
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
      alert("You can attach up to 5 files.");
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
    //  console.log(i);
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
      alert("1st priority date is required.");
      dateRef.current.focus();
      return false;
    }
    if (
      weddingdate.datefirst === weddingdate.datesecond ||
      weddingdate.datefirst === weddingdate.datethird
    ) {
      alert("Please select different dates.");
      dateRef.current.focus();
      return false;
    }

    if (weddingregion.regionfirst === "") {
      alert("1st priority region is required.");
      regionRef.current.focus();
      return false;
    }

    if (
      weddingregion.regionfirst === weddingregion.regionsecond ||
      weddingregion.regionfirst === weddingregion.regionthird ||
      (weddingregion.regionsecond === weddingregion.regionthird &&
        (weddingregion.regionsecond !== "" || weddingregion.regionthird !== ""))
    ) {
      alert("Please select different regions.");
      regionRef.current.focus();
      return false;
    }

    if (studio === "") {
      alert("Studio selection is required.");
      return false;
    }

    if (window.confirm("Would you like to submit?")) {
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
        .post("/estimate/write", formData)
        .then((res) => {
         // console.log("성공");
          navigate("/estimatelist");
        })
        .catch((e) => {
          alert("An error occurred. Please try again.");
          console.log(e);
        });
    }
  };

  return (
    <div className="containerbox">
      <div className="mainlayout box1" style={{ height: "100%" }}>
        <NavigationBar title="My Dream Wedding" />
        <div className="contentcontainer">
          <div className="contentbox">
            <h5>
              Desired Wedding Date
            </h5>
            <div className="choosebox">
              <span>Priority 1</span>
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
              <span>Priority 2</span>
              <input
                type="date"
                className="form-control"
                onChange={weddingdateSelect}
                value={weddingdate.datesecond}
                name="datesecond"
              />
            </div>
            <div className="choosebox">
              <span>Priority 3</span>
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
            <h5>Desired Wedding Region</h5>
            <div className="choosebox">
              <span>Priority 1</span>
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
              <span>Priority 2</span>
              <RegionList
                name="regionsecond"
                weddingregionSelect={weddingregionSelect}
              />
            </div>
            <div className="choosebox">
              <span>Priority 3</span>
              <RegionList
                name="regionthird"
                weddingregionSelect={weddingregionSelect}
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>Budget</h5>
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
                +1M
              </div>
              <div
                className="budget-btn cursor"
                onClick={() => {
                  increasebudget1(100000);
                }}
              >
                +100K
              </div>
              <div
                className="budget-btn cursor"
                onClick={() => {
                  increasebudget1(10000);
                }}
              >
                +10K
              </div>
            </div>
            <span>KRW</span>
          </div>
          <div className="contentbox">
            <h5>Studio</h5>
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
                Subject-Focused
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
                Background-Focused
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
                Balanced
              </label>
            </div>
            <div>
              <span>
                Want to know about studio styles?&nbsp;
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
            <h5>Bridal Dress (up to 3)</h5>
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
                Mermaid
                {dress.includes("머메이드") ? (
                  <span className="ranking">
                    #{dress.indexOf("머메이드") + 1}
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
                A-Line
                {dress.includes("A라인") ? (
                  <span className="ranking">
                    #{dress.indexOf("A라인") + 1}
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
                H-Line
                {dress.includes("H라인") ? (
                  <span className="ranking">
                    #{dress.indexOf("H라인") + 1}
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
                Ball Gown
                {dress.includes("벨라인") ? (
                  <span className="ranking">
                    #{dress.indexOf("벨라인") + 1}
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
                Empire
                {dress.includes("엠파이어") ? (
                  <span className="ranking">
                    #{dress.indexOf("엠파이어") + 1}
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
                Princess
                {dress.includes("프린세스") ? (
                  <span className="ranking">
                    #{dress.indexOf("프린세스") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <span>
              Want to know about dress styles?&nbsp;
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
            <h5>Bridal Makeup (up to 3)</h5>
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
                Romantic
                {makeup.includes("로맨틱한") ? (
                  <span className="ranking">
                    #{makeup.indexOf("로맨틱한") + 1}
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
                Point
                {makeup.includes("포인트") ? (
                  <span className="ranking">
                    #{makeup.indexOf("포인트") + 1}
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
                Natural
                {makeup.includes("내추럴") ? (
                  <span className="ranking">
                    #{makeup.indexOf("내추럴") + 1}
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
                Smoky
                {makeup.includes("스모키") ? (
                  <span className="ranking">
                    #{makeup.indexOf("스모키") + 1}
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
                Cute
                {makeup.includes("큐티") ? (
                  <span className="ranking">
                    #{makeup.indexOf("큐티") + 1}
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
                Lovely
                {makeup.includes("러블리") ? (
                  <span className="ranking">
                    #{makeup.indexOf("러블리") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <span>
              Want to know about makeup styles?&nbsp;
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
            <h5>Honeymoon</h5>
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
                International
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
                Domestic
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
                  Select international destination
                </option>
                <optgroup label="Asia">
                  <option value="해외-발리">Bali</option>
                  <option value="해외-코타키나발루">Kota Kinabalu</option>
                  <option value="해외-푸꾸옥제도">Phu Quoc Islands</option>
                  <option value="해외-하노이">Hanoi</option>
                  <option value="해외-다낭">Da Nang</option>
                  <option value="해외-호치민">Ho Chi Minh City</option>
                  <option value="해외-태국(방콕)">Thailand (Bangkok)</option>
                  <option value="해외-후쿠오카">Fukuoka</option>
                  <option value="해외-오사카">Osaka</option>
                  <option value="해외-괌">Guam</option>
                </optgroup>
                <optgroup label="North America">
                  <option value="해외-하와이">Hawaii</option>
                  <option value="해외-라스베이거스">Las Vegas</option>
                  <option value="해외-로스앤젤레스">Los Angeles</option>
                  <option value="해외-샌프란시스코">San Francisco</option>
                  <option value="해외-뉴욕">New York</option>
                  <option value="해외-알래스카">Alaska</option>
                  <option value="해외-캐나다">Canada</option>
                  <option value="해외-멕시코">Mexico</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="해외-파리">Paris</option>
                  <option value="해외-로마">Rome</option>
                  <option value="해외-베니스">Venice</option>
                  <option value="해외-프라하">Prague</option>
                  <option value="해외-마드리드">Madrid</option>
                  <option value="해외-바르셀로나">Barcelona</option>
                  <option value="해외-프라하">Prague</option>
                  <option value="해외-산토리니">Santorini</option>
                  <option value="해외-런던">London</option>
                </optgroup>
                <optgroup label="Middle East">
                  <option value="해외-두바이">Dubai</option>
                  <option value="해외-아부다비">Abu Dhabi</option>
                </optgroup>
                <optgroup label="Oceania">
                  <option value="해외-시드니">Sydney</option>
                  <option value="해외-골드코스트">Gold Coast</option>
                  <option value="해외-케언즈">Cairns</option>
                  <option value="해외-뉴질랜드">New Zealand</option>
                </optgroup>
                <optgroup label="Northern Europe">
                  <option value="해외-스웨덴">Sweden</option>
                  <option value="해외-노르웨이">Norway</option>
                  <option value="해외-핀란드">Finland</option>
                  <option value="해외-덴마크">Denmark</option>
                </optgroup>
                <optgroup label="South America">
                  <option value="해외-칠레">Chile</option>
                  <option value="해외-아르헨티나">Argentina</option>
                  <option value="해외-페루">Peru</option>
                </optgroup>
                <optgroup label="Africa">
                  <option value="해외-모로코">Morocco</option>
                  <option value="해외-남아공">South Africa</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="해외-기타">Other</option>
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
                  Select domestic destination
                </option>
                <optgroup label="Islands">
                  <option value="국내-제주도">Jeju Island</option>
                  <option value="국내-울릉도">Ulleungdo</option>
                  <option value="국내-남해도">Namhaedo</option>
                  <option value="국내-강화도">Ganghwado</option>
                  <option value="국내-완도">Wando</option>
                  <option value="국내-거제도">Geojedo</option>
                </optgroup>
                <optgroup label="Gyeonggi-do">
                  <option value="국내-가평">Gapyeong</option>
                  <option value="국내-파주">Paju</option>
                  <option value="국내-양평">Yangpyeong</option>
                </optgroup>
                <optgroup label="South Gyeongsang">
                  <option value="국내-남해">Namhae</option>
                  <option value="국내-통영">Tongyeong</option>
                  <option value="국내-부산">Busan</option>
                </optgroup>
                <optgroup label="North Gyeongsang">
                  <option value="국내-안동">Andong</option>
                  <option value="국내-경주">Gyeongju</option>
                  <option value="국내-포항">Pohang</option>
                </optgroup>
                <optgroup label="South Jeolla">
                  <option value="국내-목포">Mokpo</option>
                  <option value="국내-여수">Yeosu</option>
                  <option value="국내-순천">Suncheon</option>
                </optgroup>
                <optgroup label="North Jeolla">
                  <option value="국내-전주">Jeonju</option>
                  <option value="국내-군산">Gunsan</option>
                  <option value="국내-순천">Suncheon</option>
                  <option value="국내-고창">Gochang</option>
                </optgroup>
                <optgroup label="South Chungcheong">
                  <option value="국내-보령">Boryeong</option>
                  <option value="국내-태안">Taean</option>
                  <option value="국내-아산">Asan</option>
                </optgroup>
                <optgroup label="North Chungcheong">
                  <option value="국내-청주">Cheongju</option>
                  <option value="국내-단양">Danyang</option>
                  <option value="국내-제천">Jecheon</option>
                </optgroup>
                <optgroup label="Gangwon-do">
                  <option value="국내-강릉">Gangneung</option>
                  <option value="국내-속초">Sokcho</option>
                  <option value="국내-양양">Yangyang</option>
                  <option value="국내-춘천">Chuncheon</option>
                  <option value="국내-홍천">Hongcheon</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="국내-기타">Other</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="contentbox">
            <h5>Attach Images</h5>
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
                Attach Images
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
            <h5>Additional Requests</h5>
            <div className="choosebox w-100">
              <textarea
                className="form-control"
                rows="7"
                value={requirement}
                onChange={requirementChange}
                placeholder="Enter any additional requests"
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
              Submit
            </button>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="btn-colour-1"
            >
              Cancel
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
              <span>Studio</span>
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
                topic="Subject-Focused Studio"
                image1="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1667180129.jpg&w=1920&q=75"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_11679_1665982500_05988600_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_21706_1744682085_20124700_3232256100.jpg"
                comment1="Shoot in a clean background with the subject as the focus!"
                comment2="Simple and clean image results!"
                comment3="A timeless style you won't get tired of!"
                _id="accordionExample1"
              />
              <AccordionComp
                heading={2}
                collapse="two"
                topic="Background-Focused Studio"
                image1="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1663831599.jpg&w=1920&q=75"
                image2="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1663808804.jpg&w=1920&q=75"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_13581_1665985281_96465800_3232256098.jpg"
                comment1="A truly unique and special shooting experience!"
                comment2="Captures the studio's unique backdrop and atmosphere!"
                comment3="The stunning background takes the pressure off the subject!"
                _id="accordionExample1"
              />
              <AccordionComp
                heading={3}
                collapse="three"
                topic="Balanced Studio"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_12512_1666920642_83238100_3232256098.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_21644_1743578819_86544800_3232256099.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_13300_1668503581_00621700_3232256098.jpg"
                comment1="The most popular style right now!"
                comment2="Beautifully captures both the background and the subject!"
                comment3="Natural, movement-based direction is also possible!"
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
              Close
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
              <span>Dress</span>
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
                topic="Mermaid"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/500_14205_1740477105_22685400_3232256100.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4250_1668583465_80283900_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800___1665453271_05641100_3232256098.jpg"
                comment1="Recommended for tall and slender brides!"
                comment2="Accentuates the waist and hips!"
                comment3="Downside: movement can be quite restricted."
                _id="accordionExample2"
              />
              <AccordionComp
                heading={5}
                collapse="five"
                topic="A-Line"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/500_6164_1707382072_27779700_3232256100.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4365_1674628854_18110500_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/500_18789_1724896464_10868200_3232256100.jpg"
                comment1="Flattering on any body type!"
                comment2="Creates a taller, more elongated silhouette!"
                comment3="Great for brides with fuller hips too!"
                _id="accordionExample2"
              />
              <AccordionComp
                heading={6}
                collapse="six"
                topic="H-Line"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_4794_1679476555_79191600_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800___1665130500_49819100_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800___1665454832_07143300_3232256099.jpg"
                comment1="Exudes both sexiness and sophistication!"
                comment2="Recommended for slimmer brides!"
                comment3="Creates a sleek, streamlined look."
                _id="accordionExample2"
              />
              <AccordionComp
                heading={7}
                collapse="seven"
                topic="Ball Gown"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_5218_1675921472_92970900_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4796_1679476532_21876000_3232256099.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/500_co_sl_d203_12009_1641797900_48156600_3232256098.jpg"
                comment1="Features a full, sweeping skirt from the waist!"
                comment2="Great for covering fuller hips!"
                comment3="Also recommended for petite and slim brides!"
                _id="accordionExample2"
              />
              <AccordionComp
                heading={8}
                collapse="eight"
                topic="Empire"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_14083_1675239691_84022800_3232256098.jpg"
                image2="https://m.ygdress.com/web/product/big/WDI123_1.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_d276_6631_1582187346_70709200_3232256098.jpg"
                comment1="A style that creates a slimming effect!"
                comment2="Recommended for rectangular body types!"
                comment3="Makes the lower body appear longer!"
                _id="accordionExample2"
              />
              <AccordionComp
                heading={9}
                collapse="nine"
                topic="Princess"
                image1="https://s.alicdn.com/@sc04/kf/He4aa94853fc040afadede77579e839afM.jpg_720x720q50.jpg"
                image2="https://tshop.r10s.jp/soerutistore/cabinet/a00009/hsppq260_3.jpg"
                image3="https://ko.come4buy.com/cdn/shop/products/color-sexy-off-shoulder-champagne-221010004002p.jpg?v=1665407903"
                comment1="An ornate dress adorned with lavish embellishments!"
                comment2="Perfect for showcasing feminine charm!"
                comment3="Great for brides with a fuller waistline!"
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
              Close
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
              <span>Makeup</span>
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
                topic="Romantic"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/500_18854_1713148057_93536100_3232256098.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m056_14449_1640850193_39487800_3232256099.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m205_13076_1624261891_10019500_3232256100.jpg"
                comment1="Creates a dewy, translucent look!"
                comment2="Uses lots of pink tones!"
                comment3="Recommended for fair-skinned brides!"
                _id="accordionExample3"
              />
              <AccordionComp
                heading={11}
                collapse="eleven"
                topic="Point"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_17895_1680164863_59917800_3232256100.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_17622_1673943339_73525400_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m051_15898_1654237244_14286700_3232256099.jpg"
                comment1="Natural makeup with a bold accent feature!"
                comment2="Brings out a glamorous rather than plain look!"
                comment3="A slightly dramatic style often used for studio shoots!"
                _id="accordionExample3"
              />
              <AccordionComp
                heading={12}
                collapse="twelve"
                topic="Natural"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m114_1711_1647822940_71648700_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/500_19784_1726797137_19254800_3232256099.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/500_21296_1737529431_13114900_3232256099.jpg"
                comment1="The most classic and basic style!"
                comment2="Recommended for those who rarely wear makeup!"
                comment3="Looks naturally fresh and clean."
                _id="accordionExample3"
              />
              <AccordionComp
                heading={13}
                collapse="thirteen"
                topic="Smoky"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m122_1845_1628473766_68122500_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_1844_1678866654_71494500_3232256100.jpg"
                image3="https://mblogthumb-phinf.pstatic.net/20121226_198/subrpiad8_1356501790498I2fV2_JPEG/naver_com_20121226_150126.jpg?type=w420"
                comment1="A look that emphasizes the eyes!"
                comment2="Makes facial features appear sharper and more defined!"
                comment3="Not recommended if you naturally have a strong impression!"
                _id="accordionExample3"
              />
              <AccordionComp
                heading={14}
                collapse="fourteen"
                topic="Cute"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m205_13078_1624261921_87529100_3232256100.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/500_15867_1721615248_13048300_3232256099.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/500_19545_1706497746_44991600_3232256098.jpg"
                comment1="Creates a fresh and adorable look!"
                comment2="Features hair styled up in a round bun!"
                comment3="Not ideal for those with a larger face or wide forehead!"
                _id="accordionExample3"
              />
              <AccordionComp
                heading={15}
                collapse="fifteen"
                topic="Lovely"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/500_20668_1727155037_05244900_3232256099.jpg"
                image2="https://www.iwedding.co.kr/_next/image?url=https%3A%2F%2Fwww.iwedding.co.kr%2Fcenter%2Fwebsite%2Fbrandplus%2F1663894788.jpg&w=1920&q=75"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m175_6093_1604471404_02327900_3232256100.jpg"
                comment1="A style that adds radiance to your face!"
                comment2="Creates a youthful, younger-looking effect!"
                comment3="Like freshly squeezed citrus captured in makeup!"
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
              Close
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
            <h5>Description & Features</h5>
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
        <option value="">Not selected</option>
        <optgroup label="Jeju & Metropolitan Cities">
          <option value="부산광역시">부산광역시</option>
          <option value="인천광역시">인천광역시</option>
          <option value="대구광역시">대구광역시</option>
          <option value="대전광역시">대전광역시</option>
          <option value="광주광역시">광주광역시</option>
          <option value="울산광역시">울산광역시</option>
          <option value="제주도">제주도</option>
        </optgroup>
        <optgroup label="Seoul">
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
        <optgroup label="Gyeonggi-do">
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
        <optgroup label="Gangwon-do">
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
        <optgroup label="South Chungcheong">
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
        <optgroup label="North Chungcheong">
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
        <optgroup label="North Jeolla">
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
        <optgroup label="South Jeolla">
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
        <optgroup label="North Gyeongsang">
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
        <optgroup label="North Gyeongsang">
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
        <optgroup label="South Gyeongsang">
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
