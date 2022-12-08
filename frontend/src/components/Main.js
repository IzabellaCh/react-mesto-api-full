import React, { useContext } from 'react';
import Card from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main({ onEditAvatar, onEditProfile, onAddPlace, onCardClick, cards, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  return (
  <main className="main padding-side">
    <section className="profile" aria-label="Профиль">
      <div className="profile__data">
        <img className="profile__photo" alt="Аватар." src={currentUser.avatar} />
        <div className="profile__avatar-overlay" onClick={onEditAvatar}></div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button className="profile__edit-button button-link-opacity" onClick={onEditProfile}></button>
          <p className="profile__subtitle">{currentUser.about}</p>
        </div>
      </div>
      <button className="profile__add-button button-link-opacity" onClick={onAddPlace}></button>
    </section>
    <section className="elements" aria-label="Фото">
      <div className="elements__list">
        {cards.map((item) => (
          <Card
            info={item}
            key={item._id}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))
        }
      </div>
    </section>
  </main>
  )
}

export default Main;