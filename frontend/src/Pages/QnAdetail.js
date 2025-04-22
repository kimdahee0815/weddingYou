import "../Css/main.css";
import "../Css/CustomerCenter.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import selectImg from "../Assets/selectImg.webp";
import Sidesection from "../Components/Sidesection";

function QnAdetail() {
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState("답변 Smaple");

  const [actionmode, setActionmode] = useState(0);

  const { qnaId } = useLocation().state;

  const [title, setTitle] = useState("");
  const [img, setImg] = useState(null);
  const [date, setDate] = useState("");
  const [view, setView] = useState(0);
  const [content, setContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [commentcontent, setCommentContent] = useState("");
  const [commentEmail, setCommentEmail] = useState([]);
  const [editIndex, setEditIndex] = useState(0);
  const [updated, setUpdated] = useState(false);
  const [created, setCreated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [inputEditedComment, setInputEditedComment] = useState("");
  const [bsIndex, setBsIndex] = useState(0);
  const [commentsIndex, setCommentsIndex] = useState([]);
  const [comments, setComments] = useState([]);
  const [qnaWriter, setQnaWriter] = useState("");

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
      .get(`/qna/${qnaId}`)
      .then((res) => {
        console.log(res);
        const data = res.data;
        setTitle(data.qnaTitle);
        setDate(data.qnaWriteDate.slice(0, 10));
        setView(data.qnaViewCount);
        setContent(data.qnaContent);
        setComments(data.comments);
        setQnaWriter(data.qnaWriter);
        const commentsIndexArr = [];
        const commentContentArr = [];
        const commentEmailArr = [];
        for (let i = 0; i < data.comments.length; i++) {
          commentsIndexArr.push(i);
          commentContentArr.push(data.comments[i].commentContent);
          commentEmailArr.push(data.comments[i].commentEmail);
        }
        setCommentsIndex(commentsIndexArr);
        setCommentEmail(commentEmailArr);
        setEditedComment(commentContentArr);
        const formData = new FormData();
        formData.append("qnaId", qnaId);
        axios
          .post(`/qna/getqnaimg`, formData)
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
      })
      .catch((e) => {
        console.log(e);
      });
  }, [updated, created, deleted]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("qnaId", qnaId);
    axios
      .post(`/qna/getqnaimg`, formData)
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

  const handleEditClick = (e) => {
    console.log(e.target.dataset.bsIndex);
    const index = e.target.dataset.bsIndex;
    setEditIndex(e.target.dataset.bsIndex);
    setEditMode(true);
  };

  const handleSaveClick = (e) => {
    const index = e.target.dataset.bsIndex;
    const formData = new FormData();
    formData.append("index", index);
    formData.append("qnaId", qnaId);
    formData.append("commentContent", inputEditedComment);
    axios
      .post(`/qna/updatecomment`, formData)
      .then((res) => {
        console.log(res);
        setUpdated(!updated);
        setInputEditedComment("");
      })
      .catch((e) => {
        console.log(e);
      });
    setEditMode(false);
  };

  const handleChange = (e) => {
    setInputEditedComment(e.target.value);
  };

  const handleDelete = () => {
    // window.location.reload(); // 페이지 새로고침
    axios
      .delete(`/qna/delete/${qnaId}`)
      .then((res) => {
        console.log(res);
        alert(`Q&A 글이 삭제되었습니다!`);
        navigate(`/qnapage`);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const qnaUpdateForm = () => {
    setActionmode(1);
  };

  const updateQna = () => {
    const formData = new FormData();
    formData.append("file", img);
    formData.append("content", content);
    formData.append("title", title);

    axios
      .post(`/qna/update/${qnaId}`, formData)
      .then((res) => {
        console.log(res);
        setUpdated(!updated);
      })
      .catch((e) => {
        console.log(e);
      });
    setActionmode(0);
  };

  const handleDelete2 = (e) => {
    console.log("===============================");

    console.log(bsIndex);
    const index = bsIndex;
    const formData = new FormData();
    formData.append("index", index);
    formData.append("qnaId", qnaId);

    axios.post(`/qna/deletecomment`, formData).then((res) => {
      console.log(res);
      alert(`댓글이 삭제되었습니다!`);
      setDeleted(!deleted);
    });
    // window.location.reload(); // 페이지 새로고침
  };

  const createcomment = (e) => {
    const formData = new FormData();
    formData.append("email", sessionStorage.getItem("email"));
    formData.append("category", sessionStorage.getItem("category"));
    formData.append("commentContent", commentcontent);
    formData.append("qnaId", qnaId);
    axios
      .post(`/qna/createcomment`, formData)
      .then((res) => {
        console.log(res);
        setCreated(!created);
        setCommentContent("");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (actionmode === 0) {
    return (
      <div className="containerbox">
        <div className="mainlayout box1">
          <NavigationBar title={"Q&A"} />
          <div style={{ height: 64 }}></div>
          <div className="titleArea">
            <p className="titleTxt">{title}</p>
            <p className="dateTxt">{date}</p>
            <p className="viewCountTxt" style={{ marginRight: "20px" }}>
              조회수 : {view}
            </p>
            {qnaWriter === sessionStorage.getItem("email") ? (
              <div style={{ display: "inline-block" }}>
                <button className="upAndDelBtn2" onClick={qnaUpdateForm}>
                  수정
                </button>
                <button
                  className="upAndDelBtn2"
                  data-bs-toggle="modal"
                  data-bs-target="#qnaDelete"
                >
                  삭제
                </button>
              </div>
            ) : null}
          </div>
          <hr />
          <div className="ContentArea">
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
                  marginBottom: "20px",
                }}
              >
                <p style={{ fontSize: "1.5em" }}>고객 첨부 이미지</p>
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
          <div
            class="modal fade"
            id="qnaDelete"
            tabindex="-1"
            aria-labelledby="qnaDelete"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    Q&A 삭제
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
                    data-bs-dismiss="modal"
                    onClick={handleDelete}
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
          <hr />
          <p className="ComentTitle">답변</p>
          <div className="ComentArea" style={{ marginBottom: "20px" }}>
            {commentsIndex.map((index) => {
              // setEditedComment(comments[index].commentContent);
              console.log("index=>" + index);
              return (
                <div className="Coment">
                  <p className="nickname">{comments[index].commentWriter}</p>
                  <p className="dateTxt">
                    {comments[index].commentDate.slice(0, 10)}
                  </p>
                  <br />
                  <div>
                    {editMode &&
                    editIndex == index &&
                    sessionStorage.getItem("email") === "admin@email.com" ? (
                      <div>
                        <input
                          type="text"
                          placeholder={comments[index].commentContent}
                          onChange={handleChange}
                          className="comentinput"
                          value={inputEditedComment}
                          style={{ fontSize: 20, marginLeft: "30px" }}
                        />
                        <button
                          data-bs-index={index}
                          onClick={handleSaveClick}
                          className="writeBtn2"
                        >
                          완료
                        </button>
                      </div>
                    ) : commentEmail[index] ===
                      sessionStorage.getItem("email") ? (
                      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                        <p className="AnsTxt">
                          {comments[index].commentContent}
                        </p>
                        <button
                          data-bs-index={index}
                          onClick={handleEditClick}
                          className="upAndDelBtn3"
                        >
                          수정
                        </button>
                        <button
                          className="upAndDelBtn3"
                          data-bs-index={index}
                          onClick={() => {
                            setBsIndex(index);
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#reviewComentDelete"
                        >
                          삭제
                        </button>
                        <div
                          class="modal fade"
                          id="reviewComentDelete"
                          tabindex="-1"
                          aria-labelledby="reviewComentDelete"
                          aria-hidden="true"
                        >
                          <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h1
                                  class="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  댓글 삭제
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
                                  data-bs-index={index}
                                  class="btn btn-primary"
                                  data-bs-dismiss="modal"
                                  onClick={handleDelete2}
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
                        <div></div>
                      </div>
                    ) : (
                      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                        <p className="AnsTxt" style={{ marginLeft: "10px" }}>
                          {comments[index].commentContent}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {sessionStorage.getItem("email") === "admin@email.com" ? (
              <div>
                {" "}
                <input
                  type="text"
                  className="comentinput"
                  style={{ fontSize: 20, marginLeft: "30px" }}
                  value={commentcontent}
                  onChange={(e) => {
                    setCommentContent(e.target.value);
                  }}
                ></input>
                <button className="writeBtn2" onClick={createcomment}>
                  작성
                </button>
              </div>
            ) : null}
          </div>
          <div style={{ height: 90 }}></div>
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
          <NavigationBar title={"글수정"} />
          <div style={{ height: 74 }}></div>
          <div className="titleArea">
            <input
              type="text"
              className="titleTxt"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder={title}
              style={{
                borderRadius: "10px",
                height: "50px",
                marginLeft: "20px",
                marginTop: "20px",
                paddingBottom: "15px",
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
              className="cursor imageBtn"
              style={{ fontSize: "1.5em" }}
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
            <button className="writeBtn" onClick={updateQna}>
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

export default QnAdetail;
