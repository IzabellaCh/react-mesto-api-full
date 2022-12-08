import React, { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register.js';
import Login from './Login.js';
import PopupWithForm from './PopupWithForm.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup.js';
import InfoTooltip from './InfoTooltip';
import Footer from './Footer';
import { api } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { Route, Switch, useHistory, withRouter } from 'react-router-dom';
import success from '../images/success.svg';
import fail from '../images/fail.svg';
import { authorization } from '../utils/authorization';

function App() {
  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isFailOpen, setIsFailOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrenUser] = useState({});
  const [cards, setCards] = useState([]);
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [cardDelete, setCardDelete] = useState(null);

  function handleEditAvatarClick() {
    setIsEditAvatarOpen(true);
  };
  
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardClick(cardInfo) {
    setSelectedCard(cardInfo);
  }

  function handleOpenSuccess() {
    setIsSuccessOpen(true);
  }

  function handleOpenFail() {
    setIsFailOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsSuccessOpen(false);
    setIsFailOpen(false);
    setCardDelete(null);
  }

  function handleUpdateUser(newInfo, changeButton){
    api.changeUserInfo(newInfo)
      .then((data) => {
        setCurrenUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        alert(`Ошибка при обновлнии данных пользователя: ${err}`);
      })
      .finally(() => {
        changeButton('Сохранить')
      })
  }

  function handleUpdateAvatar(avatarLink, setIsSubmitted, changeButton) {
    api.changeAvatar(avatarLink)
      .then((data) => {
        setCurrenUser(data);
        closeAllPopups();
      })
      .then(() => {
        setIsSubmitted(true);
        changeButton('Сохранить');
      })
      .catch((err) => {
        alert(`Ошибка при смене аватара: ${err}`);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        alert(`Ошибка при клике на лайк: ${err}`);
      })
  }

  function handleCardDelete(event) {
    event.preventDefault();
    api.deleteCard(cardDelete._id)
      .then(() => {
        setCards((state) => state.filter(el => el._id !== cardDelete._id));
      })
      .catch((err) => {
        alert(`Ошибка при удалении карточки: ${err}`);
      });
    closeAllPopups();
  }

  function handleAddPlaceSubmit(newCardInfo, setIsSubmitted, changeButton) {
    api.createNewCard(newCardInfo)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups()
      })
      .then(() => {
        setIsSubmitted(true);
        changeButton('Сохранить')
      })
      .catch((err) => {
        alert(`Ошибка при создании новой карточки: ${err}`);
      })
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleComeOut() {
    setLoggedIn(false);
  }

  function checkToken() {
    authorization.checkToken()
      .then((res) => {
        console.log(res);
        handleLogin();
        history.push('/');
        setEmail(res.email);
      })
      .catch((err) => {
        console.log(`Ошибка при авторизации: ${err}`)
      })
  }

  useEffect(() => {
    if (loggedIn) {
      api.getInitialCards()
        .then((data) => {
          setCards(data)
        })
        .catch((err)=> {
          alert(`Ошибка при загрузке массива карточек: ${err}`)
        });

      api.getServerUserInfo()
        .then((data) => {
          setCurrenUser(data);
        })
        .catch((err) => {
          alert(`Ошибка при загрузке информации профиля: ${err}`);
        });
    }
  }, [loggedIn])

  useEffect(() => {
    checkToken();
  }, []);

  return (
  <div className="page">
    <Header 
      loggedIn={loggedIn}
      handleComeOut={handleComeOut}
      email={email}
    />
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <ProtectedRoute
          exact path="/"
          loggedIn={loggedIn}
          component={Main}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          cards={cards}
          onCardDelete={setCardDelete}
        />
        <Route path="/sign-up">
          <Register openSuccess={handleOpenSuccess} openFail={handleOpenFail} />
        </Route>
        <Route path="/sign-in">
          <Login handleLogin={handleLogin} setEmail={setEmail} />
        </Route>
      </Switch>
      <EditAvatarPopup
        isOpen={isEditAvatarOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />
      <EditProfilePopup 
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />
      <ImagePopup 
        card={selectedCard}
        onClose={closeAllPopups}
      />
      <PopupWithForm
        name="delete-card"
        title="Вы уверены?"
        isOpen={cardDelete}
        onClose={closeAllPopups}
        onSubmit={handleCardDelete}
        isValid={true}
        saveButton={'Да'}
      />
      <InfoTooltip
        name="success"
        title="Вы успешно зарегистрировались!"
        image={success}
        isOpen={isSuccessOpen}
        onClose={closeAllPopups}
      />
      <InfoTooltip
        name="fail"
        title="Что-то пошло не так! Попробуйте ещё раз."
        image={fail}
        isOpen={isFailOpen}
        onClose={closeAllPopups}
      />
    </CurrentUserContext.Provider>
    <Footer />
  </div>
  );
}

export default withRouter(App);
