import React from "react";
import useClose from '../utils/useClose.js';

function ImagePopup({card, onClose}) {
  useClose(card, onClose);

  return (
    <div className={`popup popup_type_card ${card ? "popup_opened" : ""}`}>
      <div className="popup__container popup__container_type_card">
        <img className="popup__image" alt={card?.name} src={card?.link} />
        <h2 className="popup__title">{card?.name}</h2>
        <button className="popup__close-button button-link-opacity" onClick={onClose}></button>
      </div>
    </div>
  )
}

export default ImagePopup;