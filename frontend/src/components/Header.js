import React, { useState } from 'react';
import { NavLink, useHistory, withRouter } from 'react-router-dom';
import logo from '../images/logo.svg';

function Header({ loggedIn, handleComeOut, email }) {
  const [openHeaderContainer, setOpenHeaderContainer] = useState(false);
  const history = useHistory();

  function handleOpenContainer() {
    setOpenHeaderContainer(true);
  }

  function handleHideContainer() {
    setOpenHeaderContainer(false);
  }

  function onSignOut() {
    localStorage.removeItem('token');
    handleComeOut();
    history.push('/sign-in');
  }
  
  return (
  <header className="header">
    {loggedIn && (
      <div className={`header__container_type_hidden ${openHeaderContainer ? 'header__container_type_open' : ''}`}>
        <p className="header__email">{email}</p>
        <NavLink
          onClick={onSignOut} to="/sign-in" className="header__link header__link_type_gate button-link-opacity">Выйти</NavLink>
      </div>
    )}
    <div className="header__visible-part">
      <img className="header__logo" src={logo} alt="Логотип." />
      {!loggedIn && (
        <>
        <NavLink to="/sign-in" activeClassName="header__link_active" className="header__link button-link-opacity">Войти</NavLink>
        <NavLink to="/sign-up" activeClassName="header__link_active" className="header__link button-link-opacity">Регистрация</NavLink>
        </>
      )}
      {loggedIn && (
        <>
        <div className="header__container">
          <p className="header__email">{email}</p>
          <NavLink onClick={onSignOut} to="/sign-in" className="header__link header__link_type_gate button-link-opacity">Выйти</NavLink>
        </div>
        <button onClick={handleOpenContainer} className={`header__button-open button-link-opacity ${openHeaderContainer ? 'header__button-open_type_hidden' : ''}`}></button>
        <button onClick={handleHideContainer} className={`header__button-close button-link-opacity ${openHeaderContainer ? '' : 'header__button-close_type_hidden'} button`}></button>
      </>
      )}
    </div>
  </header>
  )
}

export default withRouter(Header);