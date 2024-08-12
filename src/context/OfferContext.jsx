import { createContext, useState, useEffect } from "react";
import { getOfferList } from "../api/space";

const OfferContext = createContext();

export const OfferProvider = ({ children }) => {
  const [offerList, setOfferList] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getOfferList();
        setOfferList(data);
      } catch (error) {
        alert("편의시설 목록을 불러올 수 없습니다.");
      }
    };

    fetchOffers();
  }, []);

  const getOfferName = (offerId) => {
    const offer = offerList.find((offer) => offer.id === offerId);
    return offer ? offer.name : "";
  };

  return (
    <OfferContext.Provider value={{ offerList, getOfferName }}>
      {children}
    </OfferContext.Provider>
  );
};

export default OfferContext;
