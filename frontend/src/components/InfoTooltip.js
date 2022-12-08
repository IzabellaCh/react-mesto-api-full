import React from "react";
import useClose from "../utils/useClose";

function InfoTooltip({ name, title, image, isOpen, onClose }) {
  useClose(isOpen, onClose);

  return (
    <div className={`popup popup_type_info-tooltip ${isOpen ? "popup_opened" : ""}`}>
    <div className="popup__container popup__container_type_info-tooltip">
      <img className="popup__sign" alt={name} src={image} />
      <h2 className="popup__heading popup__heading_type_info-tooltip">{title}</h2>
      <button className="popup__close-button button" onClick={onClose}></button>
    </div>
  </div>
  )
}

export default InfoTooltip;