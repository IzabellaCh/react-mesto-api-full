import React, { useState } from "react";
import { withRouter, useHistory } from 'react-router-dom';
import AuthenticationWithForm from "./AuthenticationWithForm";
import { authorization } from '../utils/authorization';

function Login({ handleLogin, setEmail }) {
  const [saveButton, setSaveButton] = useState('Войти');
  const history = useHistory();

  function handleSubmit(event, email, password) {
    event.preventDefault();
    setSaveButton('Подождите...');
    authorization.login(email, password)
      .then((data) => {
        localStorage.setItem('token', data.token);
        setEmail(email);
        handleLogin();
        history.push('/');
      })
      .catch((err) => {
        console.log(`Ошибка при авторизации: ${err}`);
      })
      .finally(()=> {
        setSaveButton('Войти');
      })
  }

  return (
    <section className="authentication" aria-label="Вход в личный кабинет">
      <div className="authentication__container">
        <h2 className='authentication__heading'>Вход</h2>
        <AuthenticationWithForm 
          handleSubmit={handleSubmit}
          // onClick={handleClick}
          saveButton={saveButton}
        />
      </div>
    </section>
  )
}

export default withRouter(Login);