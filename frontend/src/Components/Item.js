import React from "react";
import Weddinghall from "../Pages/Items/Weddinghall";
import Weddingoutfit from "../Pages/Items/Weddingoutfit";
import Studio from "../Pages/Items/Studio";
import Makeup from "../Pages/Items/Makeup";
import Bouquet from "../Pages/Items/Bouquet";
import Honeymoon from "../Pages/Items/Honeymoon";
import NotFound from "../Pages/NotFound";
import { useParams } from "react-router-dom";

const Item = () => {
  const { category1 } = useParams();

  switch (category1) {
    case "weddinghall":
      return <Weddinghall />;
    case "weddingoutfit":
      return <Weddingoutfit />;
    case "studio":
      return <Studio />;
    case "makeup":
      return <Makeup />;
    case "honeymoon":
      return <Honeymoon />;
    case "bouquet":
      return <Bouquet />;
    default:
      return <NotFound />;
  }
};

export default Item;
