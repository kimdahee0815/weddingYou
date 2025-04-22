import "../Css/main.css";
import "../Css/CustomerCenter.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import axios from "axios";
import Sidesection from "../Components/Sidesection";

function CustomerCenter() {
  const [noticeViewCount, setNoticeViewCount] = useState(0);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeIndex, setNoticeIndex] = useState([]);
  const [noticeId, setNoticeId] = useState([]);

  const [qnaViewCount, setQnaViewCount] = useState(0);
  const [qnaTitle, setQnaTitle] = useState("");
  const [qnaIndex, setQnaIndex] = useState([]);
  const [qnaId, setQnaId] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/notice/list`)
      .then((res) => {
        console.log(res);
        const data = res.data;
        const noticeviewcountarr = [];
        const noticeTitleArr = [];
        const noticeIndexArr = [];
        const noticeIdArr = [];
        for (let i = 0; i < data.length; i++) {
          noticeviewcountarr.push(data[i].noticeViewCount);
          noticeTitleArr.push(data[i].noticeTitle);
          noticeIdArr.push(data[i].noticeId);
          noticeIndexArr.push(i);
        }
        setNoticeViewCount(noticeviewcountarr);
        setNoticeTitle(noticeTitleArr);
        setNoticeIndex(noticeIndexArr);
        setNoticeId(noticeIdArr);
      })
      .catch((e) => {
        console.log(e);
      });

    axios
      .get(`/qna/list`)
      .then((res) => {
        console.log(res);
        const data = res.data;
        const qnaviewcountarr = [];
        const qnaTitleArr = [];
        const qnaIndexArr = [];
        const qnaIdArr = [];
        for (let i = 0; i < data.length; i++) {
          qnaviewcountarr.push(data[i].qnaViewCount);
          qnaTitleArr.push(data[i].qnaTitle);
          qnaIdArr.push(data[i].qnaId);
          qnaIndexArr.push(i);
        }
        setQnaViewCount(qnaviewcountarr);
        setQnaTitle(qnaTitleArr);
        setQnaIndex(qnaIndexArr);
        setQnaId(qnaIdArr);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={"고객센터"} />
        <div style={{ height: 80 }}></div>
        <div className="noticeSection">
          <table>
            <thead>
              <div style={{ marginBottom: "-10px" }}>
                <td>
                  <Link
                    to="/noticepage"
                    className="LinkTxt"
                    style={{ fontSize: "1.8em" }}
                  >
                    공지사항
                  </Link>
                </td>
                <td></td>
                <td></td>
              </div>
            </thead>
            <tbody>
              {noticeIndex.map((index) => {
                return (
                  <div
                    style={{
                      height: "20px",

                      paddingTop: "10px",
                      paddingBottom: "30px",
                    }}
                  >
                    <td style={{ width: 140 }}>
                      <p
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("noticeId", noticeId[index]);
                          axios
                            .post(`/notice/addviewcount`, formData)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                          navigate(`/notice/detail`, {
                            state: { noticeId: noticeId[index] },
                          });
                        }}
                        className="customCenterTxt"
                        style={{ fontSize: "1.5em", cursor: "pointer" }}
                      >
                        {index + 1}
                      </p>
                    </td>
                    <td style={{ width: 350 }}>
                      <div
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("noticeId", noticeId[index]);
                          axios
                            .post(`/notice/addviewcount`, formData)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                          navigate(`/notice/detail`, {
                            state: { noticeId: noticeId[index] },
                          });
                        }}
                        className="customCenterTxt"
                        style={{ fontSize: "1.5em", cursor: "pointer" }}
                      >
                        {noticeTitle[index]}
                      </div>
                    </td>
                    <td>
                      <p
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("noticeId", noticeId[index]);
                          axios
                            .post(`/notice/addviewcount`, formData)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                          navigate(`/notice/detail`, {
                            state: { noticeId: noticeId[index] },
                          });
                        }}
                        className="customCenterTxt"
                        style={{ fontSize: "1.5em", cursor: "pointer" }}
                      >
                        {noticeViewCount[index]}
                      </p>
                    </td>
                  </div>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="QnAsection">
          <table>
            <thead>
              <tr>
                <div style={{ marginBottom: "-10px" }}>
                  <Link
                    to="/qnapage"
                    className="LinkTxt"
                    style={{ fontSize: "1.8em" }}
                  >
                    Q&A
                  </Link>
                </div>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {qnaIndex.map((index) => {
                return (
                  <div
                    style={{
                      height: "20px",

                      paddingTop: "10px",
                      paddingBottom: "30px",
                    }}
                  >
                    <td style={{ width: 140 }}>
                      <p
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("qnaId", qnaId[index]);
                          axios
                            .post(`/qna/addviewcount`, formData)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                          navigate(`/qna/detail`, {
                            state: { qnaId: qnaId[index] },
                          });
                        }}
                        className="customCenterTxt"
                        style={{ fontSize: "1.5em", cursor: "pointer" }}
                      >
                        {index + 1}
                      </p>
                    </td>
                    <td style={{ width: 350 }}>
                      <div
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("qnaId", qnaId[index]);
                          axios
                            .post(`/qna/addviewcount`, formData)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                          navigate(`/qna/detail`, {
                            state: { qnaId: qnaId[index] },
                          });
                        }}
                        className="customCenterTxt"
                        style={{ fontSize: "1.5em", cursor: "pointer" }}
                      >
                        {qnaTitle[index]}
                      </div>
                    </td>
                    <td>
                      <p
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("qnaId", qnaId[index]);
                          axios
                            .post(`/qna/addviewcount`, formData)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                          navigate(`/qna/detail`, {
                            state: { qnaId: qnaId[index] },
                          });
                        }}
                        className="customCenterTxt"
                        style={{ fontSize: "1.5em", cursor: "pointer" }}
                      >
                        {qnaViewCount[index]}
                      </p>
                    </td>
                  </div>
                );
              })}
            </tbody>
          </table>
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
}

export default CustomerCenter;
