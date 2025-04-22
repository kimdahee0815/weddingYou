import "../Css/main.css";
import "../Css/CustomerCenter.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import selectImg from "../Assets/selectImg.webp";
import axios from "axios";
import Sidesection from "../Components/Sidesection";
function Noticedetail() {
  const { noticeId } = useLocation().state;

  const [title, setTitle] = useState("");
  const [img, setImg] = useState(null);
  const [date, setDate] = useState("");
  const [view, setView] = useState(0);
  const [content, setContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const navigate = useNavigate();
  const onChangePic = (e) => {
    console.log(e);
    const selectedFile = e.target.files[0];
    setImg(selectedFile);
    try {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    } catch {
      setPreviewUrl(selectImg);
    }
  };
  useEffect(() => {
    axios
      .get(`/notice/${noticeId}`)
      .then((res) => {
        console.log(res);
        const data = res.data;
        setTitle(data.noticeTitle);
        setDate(data.noticeWriteDate.slice(0, 10));
        setView(data.noticeViewCount);
        setContent(data.noticeContent);
      })
      .catch((e) => {
        console.log(e);
      });
    const formData = new FormData();
    formData.append("noticeId", noticeId);
    axios
      .post(`/notice/getnoticeimg`, formData)
      .then((res) => {
        console.log(res.data);
        const byteCharacters = atob(res.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });

        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const handleDelete = () => {
    //  window.location.reload(); // 페이지 새로고침
    axios
      .delete(`/notice/delete/${noticeId}`)
      .then((res) => {
        console.log(res);
        navigate(`/noticepage`);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [actionmode, setActionmode] = useState(0);

  const noticeupdateform = () => {
    setActionmode(1);
  };

  const updatenotice = () => {
    const formData = new FormData();
    formData.append("file", img);
    formData.append("content", content);
    formData.append("title", title);

    axios
      .post(`/notice/update/${noticeId}`, formData)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });

    setActionmode(0);
  };

  const checkadminsession = window.sessionStorage.getItem("email");

  const Buttons = ({ checkadmin }) => {
    if (checkadmin === "admin@email.com") {
      return (
        <div style={{ display: "inline-block" }}>
          <button className="upAndDelBtn" onClick={noticeupdateform}>
            수정
          </button>
          <button
            className="upAndDelBtn"
            data-bs-toggle="modal"
            data-bs-target="#noticeDelete"
          >
            삭제
          </button>
        </div>
      );
    } else {
      <div></div>;
    }
  };

  if (actionmode === 0) {
    return (
      <div className="containerbox">
        <div className="mainlayout box1">
          <NavigationBar title={"공지사항"} />
          <div style={{ height: 64 }}></div>
          <div className="titleArea">
            <p
              className="titleTxt"
              style={{ marginLeft: "5px", fontSize: "2em" }}
            >
              {title}
            </p>
            <div>
              <p className="dateTxt" style={{ marginLeft: "10px" }}>
                {date}
              </p>
              <p className="viewCountTxt">조회수 : {view}</p>
              <Buttons checkadmin={checkadminsession} />
            </div>
          </div>
          <hr />
          <div className="noticeContent">
            <textarea
              className="noticeContxt"
              style={{
                marginLeft: "10px",
                fontSize: "1.5em",
                border: "none",
                width: "96%",
                height: "500px",
              }}
              value={content}
              disabled
            ></textarea>
            {previewUrl !== "" ? (
              <div
                style={{
                  marginTop: "20px",
                  marginLeft: "30px",
                  marginBottom: "-30px",
                }}
              >
                <p style={{ fontSize: "1.5em" }}>사진 첨부</p>
                <img
                  src={previewUrl}
                  alt=""
                  style={{
                    width: "200px",
                    height: "200px",
                    display: "block",
                    borderRadius: "10px",
                  }}
                />
              </div>
            ) : null}
          </div>
          {/* <hr /> */}
          <div style={{ height: 150 }}></div>
          <div
            class="modal fade"
            id="noticeDelete"
            tabindex="-1"
            aria-labelledby="noticeDelete"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    공지사항 삭제
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body" style={{ fontSize: 26 }}>
                  정말로 삭제하시겠습니까?
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={handleDelete}
                    data-bs-dismiss="modal"
                  >
                    삭제
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
        <div className="box2"></div>
        <div className="box3">
          <Sidesection />
        </div>
      </div>
    );
  } else if (actionmode === 1) {
    return (
      <div className="containerbox">
        <div className="mainlayout box1">
          <NavigationBar title={"공지사항 글수정"} />
          <div style={{ height: 74 }}></div>
          <div className="titleArea">
            <input
              type="text"
              className="titleTxt"
              style={{
                marginLeft: "10px",
                borderRadius: "10px",
                paddingTop: "-10px",
                height: "50px",
                paddingBottom: "20px",
                marginTop: "20px",
              }}
              placeholder={title}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></input>
          </div>
          <hr />
          <div className="writeContent">
            <textarea
              className="form-control contentinput"
              rows="15"
              placeholder={content}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              style={{ fontSize: 20 }}
            ></textarea>
          </div>
          <hr />
          <div className="fileatt">
            <p className="uploadphoto" style={{ fontSize: "1.5em" }}>
              사진 첨부
            </p>
            <input
              type="file"
              multiple
              id="uploadimage"
              className="displaynone"
              onChange={onChangePic}
            />
            <label
              htmlFor="uploadimage"
              style={{ fontSize: "1.5em" }}
              className="cursor imageBtn"
            >
              사진선택
            </label>
            {previewUrl !== "" ? (
              <img
                src={previewUrl}
                alt=""
                style={{
                  width: "200px",
                  height: "200px",
                  display: "block",
                  borderRadius: "10px",
                  marginTop: "30px",
                  marginLeft: "20px",
                }}
              />
            ) : null}
          </div>
          <br />
          <div className="writeBtnArea">
            <button className="writeBtn" onClick={updatenotice}>
              수정하기
            </button>
          </div>
          <div style={{ height: 200 }}></div>
          <Footer />
        </div>
        <div className="box2"></div>
        <div className="box3">
          <Sidesection />
        </div>
      </div>
    );
  }
}

export default Noticedetail;
