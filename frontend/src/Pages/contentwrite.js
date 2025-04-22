import "../Css/main.css";
import "../Css/CustomerCenter.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import selectImg from "../Assets/selectImg.webp";
import axios from "axios";
import Sidesection from "../Components/Sidesection";

function ContentWrite() {
  const { page } = useLocation().state;
  const [img, setImg] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(selectImg);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  const writeContent = () => {
    if (page === "공지사항") {
      const formData = new FormData();
      formData.append("file", img);
      formData.append("title", title);
      formData.append("content", content);
      axios
        .post(`/notice/post`, formData)
        .then((res) => {
          console.log(res);
          if (res.data != null) {
            alert(`공지사항 글 작성이 완료되었습니다!`);
            navigate(`/noticepage`);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (page === "Q&A") {
      const formData = new FormData();
      formData.append("file", img);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("email", sessionStorage.getItem("email"));
      axios
        .post(`/qna/post`, formData)
        .then((res) => {
          console.log(res);
          if (res.data != null) {
            alert(`Q&A 글 작성이 완료되었습니다!`);
            navigate(`/qnapage`);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const onChangePic = (e) => {
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
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={`${page} 글작성`} />
        <div style={{ height: 74 }}></div>
        <div className="titleArea">
          <input
            type="text"
            placeholder="제목"
            className="form-control titleinput"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            style={{ fontSize: 20 }}
          ></input>
        </div>
        <hr />
        <div className="writeContent">
          <textarea
            className="form-control contentinput"
            rows="15"
            placeholder="내용을 입력해주세요"
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
            onChange={onChangePic}
            className="displaynone"
          />
          <label
            htmlFor="uploadimage"
            className="cursor imageBtn"
            style={{ fontSize: "1.5em" }}
          >
            사진선택
          </label>
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
        </div>
        <br />
        <div className="writeBtnArea">
          <button className="writeBtn" onClick={writeContent}>
            작성하기
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

export default ContentWrite;
