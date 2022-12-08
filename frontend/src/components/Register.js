import React, { useState } from 'react';
import { Link, withRouter, useHistory } from 'react-router-dom';
import AuthenticationWithForm from './AuthenticationWithForm';
import { authorization } from '../utils/authorization';

function Register({ openSuccess, openFail }) {
  const [saveButton, setSaveButton] = useState('Зарегистрироваться');
  const history = useHistory();

  function handleSubmit(event, email, password) {
    event.preventDefault();
    setSaveButton('Регистрация...');
    authorization.register(email, password)
    .then((res) => {
      console.log(res);
      if (res) {
        openSuccess();
        history.push('/sign-in');
      };
    })
    .catch((err) => {
      openFail();
      console.log(`Ошибка при регистрации: ${err}`);
    })
    .finally(() => {
      setSaveButton('Зарегистрироваться');
    })
  }

  return (
    <section className="authentication" aria-label="Регистрация">
      <h2 className='authentication__heading'>Регистрация</h2>
      <AuthenticationWithForm
        handleSubmit={handleSubmit}
        saveButton={saveButton}
      />
      <p className='authentication__subtitle'>Уже зарегистрированы? <Link to="/sign-in" className="authentication__subtitle authentication__subtitle_type_link button-link-opacity">Войти</Link></p>
    </section>
  )
}

export default withRouter(Register);