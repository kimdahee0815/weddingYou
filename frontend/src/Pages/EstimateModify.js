import "../Css/main.css";
import "../Css/EstimateForm.css";
import "../Css/EstimateModify.css";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
//컴포넌트
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import Sidesection from "../Components/Sidesection";

const EstimateModify = () => {
  let { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get(
          `/estimate/detail/${id}`
        );
        let { data } = response;
        
        setbudget(data.budget.toLocaleString());
        sethoneymoon(data.honeymoon);
        setrequirement(data.requirement);
        setstudio(data.studio);
        let weddingdatejson = JSON.parse(data.weddingdate);
        let wdcopy = { ...weddingdate };
        wdcopy.datefirst = weddingdatejson[0];
        wdcopy.datesecond = weddingdatejson[1];
        wdcopy.datethird = weddingdatejson[2];
        setweddingdate(wdcopy);
        let weddingregionjson = JSON.parse(data.region);
        let wrcopy = { ...weddingregion };
        wrcopy.regionfirst = weddingregionjson[0];
        wrcopy.regionsecond = weddingregionjson[1];
        wrcopy.regionthird = weddingregionjson[2];
        setweddingregion(wrcopy);
        setdress(JSON.parse(data.dress));
        setmakeup(JSON.parse(data.makeup));
        setserverimagepath(JSON.parse(data.img));
        setwriter(data.writer);
        setDate(data.date);
        setViewcount(data.viewcount);

        if (window.sessionStorage.getItem("email") !== data.writer) {
          navigate("../estimatelist");
        }

        if (data.honeymoon.includes("international")) {
          setacco1("view");
        } else if (data.honeymoon.includes("domestic")) {
          setacco2("view");
        }

        const imagearray = JSON.parse(data.img);
        const imagePromises = imagearray.map((image) => {
          return axios.get("/estimate/imageview", {
            params: { image },
            responseType: "blob",
          });
        });
        const responses = await Promise.all(imagePromises);
        const imageUrls = responses.map((res) => {
          const resdata = URL.createObjectURL(res.data);
          return resdata;
        });
        setserverimage(imageUrls);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (window.sessionStorage.getItem("email") === null) {
      navigate("../login");
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
  let [viewcount, setViewcount] = useState();
  let [date, setDate] = useState();
  let [writer, setwriter] = useState();
  let [budget, setbudget] = useState("");
  let [studio, setstudio] = useState("");
  let [honeymoon, sethoneymoon] = useState("");
  let [requirement, setrequirement] = useState("");
  let [dress, setdress] = useState([]);
  let [makeup, setmakeup] = useState([]);
  let [images, setimages] = useState([]); //컨트롤러로 보낼 새로운 이미지
  let [previewimage, setpreviewimage] = useState([]); //이건 첨부한 이미지 미리볼 수 있게 하는 거
  let [serverimage, setserverimage] = useState([]); //이건 가져온 이미지를 미리 볼 수 있도록 하는 거
  let [serverimagepath, setserverimagepath] = useState([]); //이건 가져온 이미지의 경로

  //아코디언 스타일 state
  let [acco1, setacco1] = useState("");
  let [acco2, setacco2] = useState("");

  //날짜
  const weddingdateSelect = (e) => {
    let copy = { ...weddingdate, [e.target.name]: e.target.value };
    setweddingdate(copy);
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
    if (
      images.length >= 5 ||
      e.target.files.length + images.length + serverimage.length > 5
    ) {
      alert("You can attach up to 5 files.");
      e.target.value = null;
    } else {
      let copy = [...images];
      for (let i = 0; i < e.target.files.length; i++) {
        copy.push(e.target.files[i]);
      }
      setimages(copy);

      const imagePreviews = [...previewimage];
      for (let i = 0; i < e.target.files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          imagePreviews.push(reader.result);
          setpreviewimage(imagePreviews);
        };
        reader.readAsDataURL(e.target.files[i]);
      }
    }
  };

  //이미지 파일 개별 삭제
  const deleteimage = (index) => {
    let copy = [...previewimage];
    copy.splice(index, 1);
    setpreviewimage(copy);
    let copy2 = [...images];
    copy2.splice(index, 1);
    setimages(copy2);
  };

  //serverimage previewimage 샂게
  const serverimagedelete = (image) => {
    let idx = serverimage.indexOf(image);
    let copy = [...serverimage];
    copy.splice(idx, 1);
    setserverimage(copy);
    let copy2 = [...serverimagepath];
    copy2.splice(idx, 1);
    setserverimagepath(copy2);
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

  const onModify = () => {
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
        (weddingregion.regionsecond !== "" || weddingdate.regionthird))
    ) {
      alert("Please select different regions.");
      regionRef.current.focus();
      return false;
    }

    if (studio === "") {
      alert("Studio selection is required.");
      return false;
    }

    if (window.confirm("Would you like to save changes?")) {
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
      formData.append("id", id);
      formData.append("previmage", serverimagepath);
      formData.append("writer", window.sessionStorage.getItem("email"));
      formData.append("date", date);
      formData.append("viewcount", viewcount);
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append("uploadfiles", images[i]);
        }
      }
      axios
        .post("/estimate/modify", formData)
        .then((res) => {
          //console.log("성공");
          navigate(`../estimatedetail/${id}`);
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
        <NavigationBar title="Edit Estimate" />
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
                value={weddingdate.datefirst}
                className="form-control"
                onChange={weddingdateSelect}
                name="datefirst"
              />
            </div>
            <div className="choosebox">
              <span>Priority 2</span>
              <input
                type="date"
                value={weddingdate.datesecond}
                className="form-control"
                onChange={weddingdateSelect}
                name="datesecond"
              />
            </div>
            <div className="choosebox">
              <span>Priority 3</span>
              <input
                type="date"
                value={weddingdate.datethird}
                className="form-control"
                onChange={weddingdateSelect}
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
                value={weddingregion.regionfirst}
              />
            </div>
            <div className="choosebox">
              <span>Priority 2</span>
              <RegionList
                name="regionsecond"
                weddingregionSelect={weddingregionSelect}
                value={weddingregion.regionsecond}
              />
            </div>
            <div className="choosebox">
              <span>Priority 3</span>
              <RegionList
                name="regionthird"
                weddingregionSelect={weddingregionSelect}
                value={weddingregion.regionthird}
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
                value="SubjectFocused"
                onClick={studioSelect}
                checked={studio === "SubjectFocused"}
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
                value="BackgroundFocused"
                checked={studio === "BackgroundFocused"}
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
                value="Balanced"
                checked={studio === "Balanced"}
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
                id="Mermaid"
                type="checkbox"
                name="dress"
                value="Mermaid"
                checked={dress.includes("Mermaid")}
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="Mermaid" className="label-design w-100 cursor">
                Mermaid
                {dress.includes("Mermaid") ? (
                  <span className="ranking">
                    #{dress.indexOf("Mermaid") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="Aline"
                type="checkbox"
                name="dress"
                value="Aline"
                checked={dress.includes("Aline")}
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="Aline" className="label-design w-100 cursor">
                A-Line
                {dress.includes("Aline") ? (
                  <span className="ranking">
                    #{dress.indexOf("Aline") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="Hline"
                type="checkbox"
                name="dress"
                value="Hline"
                checked={dress.includes("Hline")}
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="Hline" className="label-design w-100 cursor">
                H-Line
                {dress.includes("Hline") ? (
                  <span className="ranking">
                    #{dress.indexOf("Hline") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="BallGown"
                type="checkbox"
                name="dress"
                value="BallGown"
                checked={dress.includes("BallGown")}
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="BallGown" className="label-design w-100 cursor">
                Ball Gown
                {dress.includes("BallGown") ? (
                  <span className="ranking">
                    #{dress.indexOf("BallGown") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="Empire"
                type="checkbox"
                name="dress"
                value="Empire"
                checked={dress.includes("Empire")}
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="Empire" className="label-design w-100 cursor">
                Empire
                {dress.includes("Empire") ? (
                  <span className="ranking">
                    #{dress.indexOf("Empire") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="Princess"
                type="checkbox"
                name="dress"
                value="Princess"
                checked={dress.includes("Princess")}
                onChange={dresscheck}
                className="displaynone"
              />
              <label htmlFor="Princess" className="label-design w-100 cursor">
                Princess
                {dress.includes("Princess") ? (
                  <span className="ranking">
                    #{dress.indexOf("Princess") + 1}
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
                id="Romantic"
                type="checkbox"
                name="makeup"
                value="Romantic"
                checked={makeup.includes("Romantic")}
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="Romantic" className="label-design w-100 cursor">
                Romantic
                {makeup.includes("Romantic") ? (
                  <span className="ranking">
                    #{makeup.indexOf("Romantic") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="Point"
                type="checkbox"
                name="makeup"
                value="Point"
                checked={makeup.includes("Point")}
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="Point" className="label-design w-100 cursor">
                Point
                {makeup.includes("Point") ? (
                  <span className="ranking">
                    #{makeup.indexOf("Point") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="Natural"
                type="checkbox"
                name="makeup"
                value="Natural"
                checked={makeup.includes("Natural")}
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="Natural" className="label-design w-100 cursor">
                Natural
                {makeup.includes("Natural") ? (
                  <span className="ranking">
                    #{makeup.indexOf("Natural") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="Smoky"
                type="checkbox"
                name="makeup"
                value="Smoky"
                checked={makeup.includes("Smoky")}
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="Smoky" className="label-design w-100 cursor">
                Smoky
                {makeup.includes("Smoky") ? (
                  <span className="ranking">
                    #{makeup.indexOf("Smoky") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="Cute"
                type="checkbox"
                name="makeup"
                value="Cute"
                checked={makeup.includes("Cute")}
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="Cute" className="label-design w-100 cursor">
                Cute
                {makeup.includes("Cute") ? (
                  <span className="ranking">
                    #{makeup.indexOf("Cute") + 1}
                  </span>
                ) : (
                  ""
                )}
              </label>
            </div>
            <div className="choosebox">
              <input
                id="Lovely"
                type="checkbox"
                name="makeup"
                value="Lovely"
                checked={makeup.includes("Lovely")}
                onChange={makeupcheck}
                className="displaynone"
              />
              <label htmlFor="Lovely" className="label-design w-100 cursor">
                Lovely
                {makeup.includes("Lovely") ? (
                  <span className="ranking">
                    #{makeup.indexOf("Lovely") + 1}
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
                id="international"
                type="radio"
                name="honeymoon"
                value="international"
                onClick={honeymoonaccodian}
                checked={acco1 === "view"}
                className="displaynone"
              />
              <label htmlFor="international" className="label-design w-100 cursor">
                International
              </label>
            </div>
            <div className="choosebox">
              <input
                id="domestic"
                type="radio"
                name="honeymoon"
                value="domestic"
                onClick={honeymoonaccodian2}
                checked={acco2 === "view"}
                className="displaynone"
              />
              <label htmlFor="domestic" className="label-design w-100 cursor">
                Domestic
              </label>
            </div>
            <div className={`hideeee ${acco1}`}>
              <select
                class="form-select form-select-lg mb-3 cursor"
                aria-label=".form-select-lg example"
                onChange={honeymoonSelect}
                style={{ fontSize: 17 }}
                value={honeymoon}
              >
                <option value="" disabled>
                  Select international destination
                </option>
                <optgroup label="Asia">
                  <option value="international-Bali">Bali</option>
                  <option value="international-Kota Kinabalu">Kota Kinabalu</option>
                  <option value="international-Phu Quoc Islands">Phu Quoc Islands</option>
                  <option value="international-Hanoi">Hanoi</option>
                  <option value="international-Da Nang">Da Nang</option>
                  <option value="international-Ho Chi Minh City">Ho Chi Minh City</option>
                  <option value="international-Thailand (Bangkok)">Thailand (Bangkok)</option>
                  <option value="international-Fukuoka">Fukuoka</option>
                  <option value="international-Osaka">Osaka</option>
                  <option value="international-Guam">Guam</option>
                </optgroup>
                <optgroup label="North America">
                  <option value="international-Hawaii">Hawaii</option>
                  <option value="international-Las Vegas">Las Vegas</option>
                  <option value="international-Los Angeles">Los Angeles</option>
                  <option value="international-San Francisco">San Francisco</option>
                  <option value="international-New York">New York</option>
                  <option value="international-Alaska">Alaska</option>
                  <option value="international-Canada">Canada</option>
                  <option value="international-Mexico">Mexico</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="international-Paris">Paris</option>
                  <option value="international-Rome">Rome</option>
                  <option value="international-Venice">Venice</option>
                  <option value="international-Prague">Prague</option>
                  <option value="international-Madrid">Madrid</option>
                  <option value="international-Barcelona">Barcelona</option>
                  <option value="international-Santorini">Santorini</option>
                  <option value="international-London">London</option>
                </optgroup>
                <optgroup label="Middle East">
                  <option value="international-Dubai">Dubai</option>
                  <option value="international-Abu Dhabi">Abu Dhabi</option>
                </optgroup>
                <optgroup label="Oceania">
                  <option value="international-Sydney">Sydney</option>
                  <option value="international-Gold Coast">Gold Coast</option>
                  <option value="international-Cairns">Cairns</option>
                  <option value="international-New Zealand">New Zealand</option>
                </optgroup>
                <optgroup label="Northern Europe">
                  <option value="international-Sweden">Sweden</option>
                  <option value="international-Norway">Norway</option>
                  <option value="international-Finland">Finland</option>
                  <option value="international-Denmark">Denmark</option>
                </optgroup>
                <optgroup label="South America">
                  <option value="international-Chile">Chile</option>
                  <option value="international-Argentina">Argentina</option>
                  <option value="international-Peru">Peru</option>
                </optgroup>
                <optgroup label="Africa">
                  <option value="international-Morocco">Morocco</option>
                  <option value="international-South Africa">South Africa</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="international-Other">Other</option>
                </optgroup>
              </select>
            </div>
            <div className={`hideeee ${acco2}`}>
              <select
                class="form-select form-select-lg mb-3 cursor"
                aria-label=".form-select-lg example"
                onChange={honeymoonSelect}
                style={{ fontSize: 17 }}
                value={honeymoon}
              >
                <option value="" disabled>
                  Select domestic destination
                </option>
                <optgroup label="Islands">
                  <option value="domestic-Jeju Island">Jeju Island</option>
                  <option value="domestic-Ulleungdo">Ulleungdo</option>
                  <option value="domestic-Namhaedo">Namhaedo</option>
                  <option value="domestic-Ganghwado">Ganghwado</option>
                  <option value="domestic-Wando">Wando</option>
                  <option value="domestic-Geojedo">Geojedo</option>
                </optgroup>
                <optgroup label="Gyeonggi-do">
                  <option value="domestic-Gapyeong">Gapyeong</option>
                  <option value="domestic-Paju">Paju</option>
                  <option value="domestic-Yangpyeong">Yangpyeong</option>
                </optgroup>
                <optgroup label="South Gyeongsang">
                  <option value="domestic-Namhae">Namhae</option>
                  <option value="domestic-Tongyeong">Tongyeong</option>
                  <option value="domestic-Busan">Busan</option>
                </optgroup>
                <optgroup label="North Gyeongsang">
                  <option value="domestic-Andong">Andong</option>
                  <option value="domestic-Gyeongju">Gyeongju</option>
                  <option value="domestic-Pohang">Pohang</option>
                </optgroup>
                <optgroup label="South Jeolla">
                  <option value="domestic-Mokpo">Mokpo</option>
                  <option value="domestic-Yeosu">Yeosu</option>
                  <option value="domestic-Suncheon">Suncheon</option>
                </optgroup>
                <optgroup label="North Jeolla">
                  <option value="domestic-Jeonju">Jeonju</option>
                  <option value="domestic-Gunsan">Gunsan</option>
                  <option value="domestic-Suncheon-2">Suncheon</option>
                  <option value="domestic-Gochang">Gochang</option>
                </optgroup>
                <optgroup label="South Chungcheong">
                  <option value="domestic-Boryeong">Boryeong</option>
                  <option value="domestic-Taean">Taean</option>
                  <option value="domestic-Asan">Asan</option>
                </optgroup>
                <optgroup label="North Chungcheong">
                  <option value="domestic-Cheongju">Cheongju</option>
                  <option value="domestic-Danyang">Danyang</option>
                  <option value="domestic-Jecheon">Jecheon</option>
                </optgroup>
                <optgroup label="Gangwon-do">
                  <option value="domestic-Gangneung">Gangneung</option>
                  <option value="domestic-Sokcho">Sokcho</option>
                  <option value="domestic-Yangyang">Yangyang</option>
                  <option value="domestic-Chuncheon">Chuncheon</option>
                  <option value="domestic-Hongcheon">Hongcheon</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="domestic-Other">Other</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="contentbox">
            <h5>Attached Images</h5>
            <div className="choosebox" style={{ width: "70%" }}>
              <input
                type="file"
                multiple
                onChange={imageSelect}
                accept="image/*"
                id="uploadimage"
                className="displaynone"
              />
              {serverimage.map((e, index) => {
                return (
                  <div key={index}>
                    <>
                      <div className="imagebox-estimatemodify">
                        <div
                          class="btn"
                          style={{
                            width: "50%",
                            position: "relative",
                            padding: "0px",
                          }}
                        >
                          <img
                            src={e}
                            width="40%"
                            height="40%"
                            className="image-custom-estimatemodify"
                          />
                          <div
                            className="image-overlay-estimatemodify"
                            onClick={() => {
                              serverimagedelete(e);
                            }}
                          >
                            <i class="bi bi-x-lg"></i>
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                );
              })}
              {previewimage.map((e, index) => {
                return (
                  <div key={index}>
                    <>
                      <div className="imagebox-estimatemodify">
                        <div
                          class="btn"
                          style={{
                            width: "50%",
                            position: "relative",
                            padding: "0px",
                          }}
                        >
                          <img
                            src={e}
                            width="40%"
                            height="40%"
                            className="image-custom-estimatemodify"
                          />
                          <div
                            className="image-overlay-estimatemodify"
                            onClick={() => {
                              deleteimage(index);
                            }}
                          >
                            <i class="bi bi-x-lg"></i>
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                );
              })}
            </div>
            <label htmlFor="uploadimage" className="cursor imageupload-btn">
              Attach Images
            </label>
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
                onModify();
              }}
              className="btn-colour-1"
              style={{ marginRight: "15px" }}
            >
              Save Changes
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

export default EstimateModify;

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
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_1708_1665976697_88410900_3232256100.jpg"
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
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_12544_1666688374_16242500_3232256098.jpg"
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
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_d120_2001_1632361176_65452700_3232256100.jpg"
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
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_5350_1679279312_93081100_3232256098.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_4365_1674628854_18110500_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_12996_1677040520_50476000_3232256099.jpg"
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
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_14256_1681265613_43329300_3232256100.jpg"
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
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_d247_14923_1649140504_74715200_3232256100.jpg"
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
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_17534_1673254073_72786200_3232256099.jpg"
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_15343_1674625658_77782300_3232256100.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_13164_1676956927_35327800_3232256098.jpg"
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
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_2294_1680250969_59017300_3232256099.jpg"
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
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m209_15869_1653530666_48849500_3232256098.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m134_4309_1661326982_18419000_3232256098.jpg"
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
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m199_6483_1585638230_88987100_3232256098.jpg"
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
                image2="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m197_6298_1628237690_62191600_3232256098.jpg"
                image3="https://www.iwedding.co.kr/center/iweddingb/product/800_co_sl_m152_12803_1652060864_24013300_3232256099.jpg"
                comment1="Creates a fresh and adorable look!"
                comment2="Features hair styled up in a round bun!"
                comment3="Not ideal for those with a larger face or wide forehead!"
                _id="accordionExample3"
              />
              <AccordionComp
                heading={15}
                collapse="fifteen"
                topic="Lovely"
                image1="https://www.iwedding.co.kr/center/iweddingb/product/800_17670_1676267275_58014900_3232256099.jpg"
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

const RegionList = ({ name, weddingregionSelect, regionRef, value }) => {
  return (
    <>
      <select
        class="form-select form-select-lg mb-3 cursor"
        aria-label=".form-select-lg example"
        style={{ fontSize: 18 }}
        name={name}
        value={value}
        onChange={weddingregionSelect}
        ref={regionRef}
      >
        <option value="">Not selected</option>
        <optgroup label="Jeju & Metropolitan Cities">
          <option value="Busan">Busan</option>
          <option value="Incheon">Incheon</option>
          <option value="Daegu">Daegu</option>
          <option value="Daejeon">Daejeon</option>
          <option value="Gwangju">Gwangju</option>
          <option value="Ulsan">Ulsan</option>
          <option value="Jeju Island">Jeju Island</option>
        </optgroup>
        <optgroup label="Seoul">
          <option value="Seoul-Gangnam-gu">Gangnam-gu</option>
          <option value="Seoul-Gangdong-gu">Gangdong-gu</option>
          <option value="Seoul-Gangbuk-gu">Gangbuk-gu</option>
          <option value="Seoul-Gangseo-gu">Gangseo-gu</option>
          <option value="Seoul-Gwanak-gu">Gwanak-gu</option>
          <option value="Seoul-Gwangjin-gu">Gwangjin-gu</option>
          <option value="Seoul-Guro-gu">Guro-gu</option>
          <option value="Seoul-Geumcheon-gu">Geumcheon-gu</option>
          <option value="Seoul-Nowon-gu">Nowon-gu</option>
          <option value="Seoul-Dobong-gu">Dobong-gu</option>
          <option value="Seoul-Dongdaemun-gu">Dongdaemun-gu</option>
          <option value="Seoul-Dongjak-gu">Dongjak-gu</option>
          <option value="Seoul-Mapo-gu">Mapo-gu</option>
          <option value="Seoul-Seodaemun-gu">Seodaemun-gu</option>
          <option value="Seoul-Seocho-gu">Seocho-gu</option>
          <option value="Seoul-Seongdong-gu">Seongdong-gu</option>
          <option value="Seoul-Seongbuk-gu">Seongbuk-gu</option>
          <option value="Seoul-Songpa-gu">Songpa-gu</option>
          <option value="Seoul-Yangcheon-gu">Yangcheon-gu</option>
          <option value="Seoul-Yeongdeungpo-gu">Yeongdeungpo-gu</option>
          <option value="Seoul-Yongsan-gu">Yongsan-gu</option>
          <option value="Seoul-Eunpyeong-gu">Eunpyeong-gu</option>
          <option value="Seoul-Jongno-gu">Jongno-gu</option>
          <option value="Seoul-Jung-gu">Jung-gu</option>
          <option value="Seoul-Jungnang-gu">Jungnang-gu</option>
        </optgroup>
        <optgroup label="Gyeonggi-do">
          <option value="Gapyeong-gun">Gapyeong-gun</option>
          <option value="Goyang-si">Goyang-si</option>
          <option value="Gwacheon-si">Gwacheon-si</option>
          <option value="Gwangmyeong-si">Gwangmyeong-si</option>
          <option value="Gwangju-si">Gwangju-si</option>
          <option value="Guri-si">Guri-si</option>
          <option value="Gunpo-si">Gunpo-si</option>
          <option value="Gimpo-si">Gimpo-si</option>
          <option value="Namyangju-si">Namyangju-si</option>
          <option value="Dongducheon-si">Dongducheon-si</option>
          <option value="Bucheon-si">Bucheon-si</option>
          <option value="Seongnam-si">Seongnam-si</option>
          <option value="Suwon-si">Suwon-si</option>
          <option value="Siheung-si">Siheung-si</option>
          <option value="Ansan-si">Ansan-si</option>
          <option value="Anseong-si">Anseong-si</option>
          <option value="Anyang-si">Anyang-si</option>
          <option value="Yangju-si">Yangju-si</option>
          <option value="Yangpyeong-gun">Yangpyeong-gun</option>
          <option value="Yeoju-si">Yeoju-si</option>
          <option value="Yeoncheon-gun">Yeoncheon-gun</option>
          <option value="Osan-si">Osan-si</option>
          <option value="Yongin-si">Yongin-si</option>
          <option value="Uiwang-si">Uiwang-si</option>
          <option value="Uijeongbu-si">Uijeongbu-si</option>
          <option value="Icheon-si">Icheon-si</option>
          <option value="Paju-si">Paju-si</option>
          <option value="Pyeongtaek-si">Pyeongtaek-si</option>
          <option value="Pocheon-si">Pocheon-si</option>
          <option value="Hanam-si">Hanam-si</option>
          <option value="Hwaseong-si">Hwaseong-si</option>
        </optgroup>
        <optgroup label="Gangwon-do">
          <option value="Gangneung-si">Gangneung-si</option>
          <option value="Gangwon-Goseong-gun">Goseong-gun</option>
          <option value="Donghae-si">Donghae-si</option>
          <option value="Samcheok-si">Samcheok-si</option>
          <option value="Sokcho-si">Sokcho-si</option>
          <option value="Yanggu-gun">Yanggu-gun</option>
          <option value="Yangyang-gun">Yangyang-gun</option>
          <option value="Yeongwol-gun">Yeongwol-gun</option>
          <option value="Wonju-si">Wonju-si</option>
          <option value="Inje-gun">Inje-gun</option>
          <option value="Jeongseon-gun">Jeongseon-gun</option>
          <option value="Cheorwon-gun">Cheorwon-gun</option>
          <option value="Chuncheon-si">Chuncheon-si</option>
          <option value="Taebaek-si">Taebaek-si</option>
          <option value="Pyeongchang-gun">Pyeongchang-gun</option>
          <option value="Hongcheon-gun">Hongcheon-gun</option>
          <option value="Hwacheon-gun">Hwacheon-gun</option>
          <option value="Hoengseong-gun">Hoengseong-gun</option>
        </optgroup>
        <optgroup label="South Chungcheong">
          <option value="Gyeryong-si">Gyeryong-si</option>
          <option value="Gongju-si">Gongju-si</option>
          <option value="Geumsan-gun">Geumsan-gun</option>
          <option value="Nonsan-si">Nonsan-si</option>
          <option value="Dangjin-si">Dangjin-si</option>
          <option value="Boryeong-si">Boryeong-si</option>
          <option value="Buyeo-gun">Buyeo-gun</option>
          <option value="Seosan-si">Seosan-si</option>
          <option value="Seocheon-gun">Seocheon-gun</option>
          <option value="Asan-si">Asan-si</option>
          <option value="Yesan-gun">Yesan-gun</option>
          <option value="Cheonan-si">Cheonan-si</option>
          <option value="Cheongyang-gun">Cheongyang-gun</option>
          <option value="Taean-gun">Taean-gun</option>
          <option value="Hongseong-gun">Hongseong-gun</option>
        </optgroup>
        <optgroup label="North Chungcheong">
          <option value="Goesan-gun">Goesan-gun</option>
          <option value="Danyang-gun">Danyang-gun</option>
          <option value="Boeun-gun">Boeun-gun</option>
          <option value="Yeongdong-gun">Yeongdong-gun</option>
          <option value="Okcheon-gun">Okcheon-gun</option>
          <option value="Eumseong-gun">Eumseong-gun</option>
          <option value="Jecheon-si">Jecheon-si</option>
          <option value="Jeungpyeong-gun">Jeungpyeong-gun</option>
          <option value="Jincheon-gun">Jincheon-gun</option>
          <option value="Cheongwon-gun">Cheongwon-gun</option>
          <option value="Cheongju-si">Cheongju-si</option>
          <option value="Chungju-si">Chungju-si</option>
        </optgroup>
        <optgroup label="North Jeolla">
          <option value="Gochang-gun">Gochang-gun</option>
          <option value="Gunsan-si">Gunsan-si</option>
          <option value="Gimje-si">Gimje-si</option>
          <option value="Namwon-si">Namwon-si</option>
          <option value="Muju-gun">Muju-gun</option>
          <option value="Buan-gun">Buan-gun</option>
          <option value="Sunchang-gun">Sunchang-gun</option>
          <option value="Wanju-gun">Wanju-gun</option>
          <option value="Iksan-si">Iksan-si</option>
          <option value="Imsil-gun">Imsil-gun</option>
          <option value="Jeonju-si">Jeonju-si</option>
          <option value="Jeongeup-si">Jeongeup-si</option>
        </optgroup>
        <optgroup label="South Jeolla">
          <option value="Gangjin-gun">Gangjin-gun</option>
          <option value="Goheung-gun">Goheung-gun</option>
          <option value="Gokseong-gun">Gokseong-gun</option>
          <option value="Gwangyang-si">Gwangyang-si</option>
          <option value="Naju-si">Naju-si</option>
          <option value="Damyang-gun">Damyang-gun</option>
          <option value="Mokpo-si">Mokpo-si</option>
          <option value="Muan-gun">Muan-gun</option>
          <option value="Boseong-gun">Boseong-gun</option>
          <option value="Suncheon-si">Suncheon-si</option>
          <option value="Sinan-gun">Sinan-gun</option>
          <option value="Yeosu-si">Yeosu-si</option>
          <option value="Yeonggwang-gun">Yeonggwang-gun</option>
          <option value="Yeongam-gun">Yeongam-gun</option>
          <option value="Wando-gun">Wando-gun</option>
          <option value="Jangseong-gun">Jangseong-gun</option>
          <option value="Jangheung-gun">Jangheung-gun</option>
          <option value="Jindo-gun">Jindo-gun</option>
          <option value="Hampyeong-gun">Hampyeong-gun</option>
          <option value="Haenam-gun">Haenam-gun</option>
          <option value="Hwasun-gun">Hwasun-gun</option>
        </optgroup>
        <optgroup label="North Gyeongsang">
          <option value="Gyeongsan-si">Gyeongsan-si</option>
          <option value="Gyeongju-si">Gyeongju-si</option>
          <option value="Goryeong-gun">Goryeong-gun</option>
          <option value="Gumi-si">Gumi-si</option>
          <option value="Gunwi-gun">Gunwi-gun</option>
          <option value="Gimcheon-si">Gimcheon-si</option>
          <option value="Mungyeong-si">Mungyeong-si</option>
          <option value="Bonghwa-gun">Bonghwa-gun</option>
          <option value="Sangju-si">Sangju-si</option>
          <option value="Seongju-gun">Seongju-gun</option>
          <option value="Andong-si">Andong-si</option>
          <option value="Yeongdeok-gun">Yeongdeok-gun</option>
          <option value="Yeongyang-gun">Yeongyang-gun</option>
          <option value="Yeongju-si">Yeongju-si</option>
          <option value="Yeongcheon-si">Yeongcheon-si</option>
          <option value="Yecheon-gun">Yecheon-gun</option>
          <option value="Ulleung-gun">Ulleung-gun</option>
          <option value="Uljin-gun">Uljin-gun</option>
          <option value="Uiseong-gun">Uiseong-gun</option>
          <option value="Cheongdo-gun">Cheongdo-gun</option>
          <option value="Cheongsong-gun">Cheongsong-gun</option>
          <option value="Chilgok-gun">Chilgok-gun</option>
          <option value="Pohang-si">Pohang-si</option>
        </optgroup>
        <optgroup label="South Gyeongsang">
          <option value="Geoje-si">Geoje-si</option>
          <option value="Geochang-gun">Geochang-gun</option>
          <option value="Gyeongnam-Goseong-gun">Goseong-gun</option>
          <option value="Gimhae-si">Gimhae-si</option>
          <option value="Namhae-gun">Namhae-gun</option>
          <option value="Miryang-si">Miryang-si</option>
          <option value="Sacheon-si">Sacheon-si</option>
          <option value="Sancheong-gun">Sancheong-gun</option>
          <option value="Yangsan-si">Yangsan-si</option>
          <option value="Uiryeong-gun">Uiryeong-gun</option>
          <option value="Jinju-si">Jinju-si</option>
          <option value="Changnyeong-gun">Changnyeong-gun</option>
          <option value="Changwon-si">Changwon-si</option>
          <option value="Tongyeong-si">Tongyeong-si</option>
          <option value="Hadong-gun">Hadong-gun</option>
          <option value="Haman-gun">Haman-gun</option>
          <option value="Hamyang-gun">Hamyang-gun</option>
          <option value="Hapcheon-gun">Hapcheon-gun</option>
        </optgroup>
      </select>
    </>
  );
};
