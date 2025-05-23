import "../Css/main.css";
import Footer from "../Components/Footer";
import NavigationBar from "../Components/NavigationBar";
import { useLocation } from "react-router-dom";
import Sidesection from "../Components/Sidesection";

function ImgDetail() {
  const { imgsrc, itemId, content, imgContent, itemName } = useLocation().state;
 // console.log(imgsrc, itemId, content, imgContent, itemName)
  return (
    <div className="containerbox">
      <div className="mainlayout box1">
        <NavigationBar title={"상세정보창"} />
        <div style={{ marginTop: "120px" }}>
          <div
            style={{
              fontSize: "1.6em",
              paddingBottom: "10px",
              marginTop: "-20px",
              paddingLeft: "30px",
            }}
          >
            {itemName}
          </div>
          <div style={{ display: "flex" }}>
            <img
              src={imgsrc}
              alt=""
              style={{ width: "250px", height: "250px", marginLeft: "30px" }}
            />
            <div
              style={{
                borderRadius: "10px",
                marginLeft: "20px",
                width: "230px",
              }}
            >
              <textarea
                className="content-textarea"
                placeholder={content}
                value={content}
                style={{ padding: "20px", fontSize: "1.4em", height: "100%" }}
                disabled
              />
            </div>
          </div>
          <div
            style={{
              borderRadius: "10px",
              marginLeft: "30px",
              width: "500px",
              marginTop: "30px",
            }}
          >
            <textarea
              className="content-textarea"
              placeholder={imgContent}
              value={imgContent}
              style={{ padding: "20px", fontSize: "1.4em" }}
              disabled
            />
          </div>
        </div>

        <div style={{ height: 100 }}></div>
        <Footer />
      </div>
      <div className="box2"></div>
      <div className="box3">
        <Sidesection />
      </div>
    </div>
  );
}

export default ImgDetail;
