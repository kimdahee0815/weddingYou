import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../Components/NavigationBar";
import Footer from "../../Components/Footer";
import "../../Css/WritePost.css";
import Sidesection from "../../Components/Sidesection";

const EditPost = () => {
  const { itemId } = useParams();
  const location = useLocation();
  const originalContent = location.state.originalContent;
  const originalimgDetailContent = location.state.originalimgDetailContent;
  console.log(location.state);
  const originalTitle = location.state.originalTitle;
  const engTitle = location.state.engTitle;
  const navigate = useNavigate();
  const [itemName, setItemName] = useState(originalTitle);
  const [content, setContent] = useState(originalContent);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(image);
  const [imgDetailContent, setImgDetailContent] = useState(
    originalimgDetailContent
  );

  const handleCancel = () => {
    navigate(`/menu/${engTitle}`);
  };

  useEffect(() => {
    axios
      .post(`/item/getitemImg/${itemId}`)
      .then((res) => {
        const byteCharacters = atob(res.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        setImage(blob);
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
          setImage(reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const onChangeItemPicture = (e) => {
    const selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const updateItemPicture = (e) => {
    setImage(previewUrl);
  };
  const updateItem = (e) => {
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("itemName", itemName);
    formData.append("content", content);
    formData.append("imgDetailContent", imgDetailContent);
    axios
      .post(`/item/updateItem/${itemId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        alert("수정이 완료 되었습니다!");
        navigate(`/menu/${engTitle}`);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title="글 수정" engTitle={engTitle} />
        <div
          className="category-container"
          style={{ marginTop: "100px" }}
        ></div>
        <div className="post-inputwrap">
          <img
            src={image}
            style={{
              width: "200px",
              height: "200px",
              cursor: "pointer",
              marginBottom: "30px",
              marginLeft: "110px",
            }}
            data-bs-toggle="modal"
            data-bs-target="#itemChangeModal"
            alt=""
          />
          <input
            className="title-input"
            type="text"
            placeholder={originalTitle}
            value={itemName}
            onChange={(event) => {
              setItemName(event.target.value);
            }}
          />
          <textarea
            className="content-textarea"
            placeholder={originalContent}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
            }}
          />
          <textarea
            className="content-textarea"
            placeholder={imgDetailContent}
            value={imgDetailContent}
            onChange={(event) => {
              setImgDetailContent(event.target.value);
            }}
          />
        </div>
        <div
          className="button-wrap"
          style={{ marginLeft: "170px", marginBottom: "110px" }}
        >
          <button
            className="submit-button"
            onClick={() => {
              updateItem();
            }}
            style={{ fontSize: "1.3em" }}
          >
            수정하기
          </button>

          <button className="cancel-button" onClick={handleCancel}>
            취소
          </button>
        </div>
        <Footer />
        {/* 아이템 변경 업로드 파일 올리는 모달창 */}
        <div
          class="modal fade"
          id="itemChangeModal"
          tabindex="-1"
          aria-labelledby="itemChangeModal"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1
                  class="modal-title justify-content-center "
                  id="itemChangeModal"
                  style={{ fontSize: "1.5em" }}
                >
                  - 아이템 사진 변경 -
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
                  class="has-validation col col-md-10"
                  style={{ height: "100%", width: "100%" }}
                >
                  <img
                    src={previewUrl}
                    style={{
                      width: "200px",
                      height: "200px",
                      marginBottom: "20px",
                      marginTop: "-50px",
                      cursor: "pointer",
                      marginLeft: "140px",
                    }}
                    alt=""
                    data-bs-toggle="modal"
                    data-bs-target="#itemChangeModal"
                  />
                  <input
                    type="file"
                    class="form-control"
                    id="profileInput"
                    onChange={onChangeItemPicture}
                    placeholder="업로드할 이미지"
                    required
                    autocomplete="off"
                    enctype="multipart/form-data"
                    style={{ fontSize: "1.3em" }}
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  닫기
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={updateItemPicture}
                >
                  변경하기
                </button>
              </div>
            </div>
          </div>
        </div>
        {/*아이템 변경 업로드 파일 올리는 모달창 */}
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
};

export default EditPost;
