import React, { useContext } from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Card({onCardClick, info, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = info.owner._id === currentUser._id;

  const cardDeleteButtonName = (
    `element__trash-button button-link-opacity ${isOwn ? '' : 'element__trash-button_type_hidden'}`
  );
  const isLiked = info.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonName = (
    `element__like-button ${isLiked ? 'element__like-button_type_active' : ''}`
  );

  function handleClick() {
    onCardClick(info);
  }

  function handleLikeCLick() {
    onCardLike(info);
  }

  function handleDeleteClick(){
    onCardDelete(info);
  }

  return (
    <div className="element">
      <img
        className="element__image"
        alt={info.name}
        src={info.link}
        onClick={handleClick}
      />
      <div className="element__description">
        <h2 className="element__title">{info.name}</h2>
        <div className="element__like-container">
          <button className={cardLikeButtonName} onClick={handleLikeCLick}></button>
          <p className="element__like-counter">{info.likes.length}</p>
        </div>
      </div>
      <button className={cardDeleteButtonName} onClick={handleDeleteClick}></button>
    </div>
  )
}

export default Card;