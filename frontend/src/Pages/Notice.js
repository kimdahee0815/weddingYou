import "../Css/main.css";
import "../Css/CustomerCenter.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Sidesection from "../Components/Sidesection";

function Notice() {
  const [title, setTitle] = useState([]);
  const [date, setDate] = useState([]);
  const [view, setView] = useState([]);
  const [index, setIndex] = useState([]);
  const [noticeId, setNoticeId] = useState([]);
  useEffect(() => {
    axios
      .get(`/notice/list`)
      .then((res) => {
        console.log(res);
        const data = res.data;
        const titleArr = [];
        const dateArr = [];
        const viewArr = [];
        const indexArr = [];
        const noticeIdArr = [];
        for (let i = 0; i < data.length; i++) {
          titleArr.push(data[i].noticeTitle);
          dateArr.push(data[i].noticeWriteDate.slice(0, 10));
          viewArr.push(data[i].noticeViewCount);
          noticeIdArr.push(data[i].noticeId);
          indexArr.push(i);
        }
        setTitle(titleArr);
        setDate(dateArr);
        setView(viewArr);
        setIndex(indexArr);
        setNoticeId(noticeIdArr);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const navigate = useNavigate();
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={"공지사항"} />
        <div style={{ height: 74 }}></div>
        <div className="noticeSection">
          <tabel>
            <thead>
              <tr>
                <td style={{ width: 350 }}>
                  <p className="noticeTxt">제목</p>
                </td>
                <td style={{ width: 120 }}>
                  <p className="noticeTxtCenter">작성일</p>
                </td>
                <td style={{ width: 80 }}>
                  <p className="noticeTxtCenter">조회수</p>
                </td>
              </tr>
            </thead>
            <tbody>
              {index.map((i) => {
                return (
                  <tr>
                    <td style={{ height: 50 }}>
                      <div
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("noticeId", noticeId[i]);
                          axios
                            .post(`/notice/addviewcount`, formData)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                          navigate(`/notice/detail`, {
                            state: { noticeId: noticeId[i] },
                          });
                        }}
                        className="noticeTxt"
                        style={{ fontSize: "1.5em", cursor: "pointer" }}
                      >
                        {title[i]}
                      </div>
                    </td>
                    <td>
                      <p
                        onClick={() => {
                          axios
                            .post(`/notice/addviewcount`)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                          navigate(`/notice/detail`, {
                            state: { noticeId: noticeId[i] },
                          });
                        }}
                        className="noticeTxtCenter"
                        style={{ fontSize: "1.5em", cursor: "pointer" }}
                      >
                        {date[i]}
                      </p>
                    </td>
                    <td>
                      <p
                        onClick={() => {
                          axios
                            .post(`/notice/addviewcount`)
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                          navigate(`/notice/detail`, {
                            state: { noticeId: noticeId[i] },
                          });
                        }}
                        className="noticeTxtCenter"
                        style={{ fontSize: "1.5em", cursor: "pointer" }}
                      >
                        {view[i]}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </tabel>
        </div>
        {sessionStorage.getItem("email") === "admin@email.com" ? (
          <button
            className="writeBtn"
            onClick={() => {
              navigate(`/contentwrite`, { state: { page: "공지사항" } });
            }}
          >
            글쓰기
          </button>
        ) : null}

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

export default Notice;
