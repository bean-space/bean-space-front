import { useContext } from "react";
import OfferContext from "../context/OfferContext";

export const useOffer = () => useContext(OfferContext);
