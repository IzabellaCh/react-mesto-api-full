import React, { useState, useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [saveButton, setSaveButton] = useState('Сохранить');
  
  function handleChange(event) {
    const { name, value, validationMessage } = event.target;
    
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
 
    setErrors((prev) => ({
      ...prev,
      [name]: validationMessage
    }));

    if (event.target.closest('form').checkValidity()) {
      setIsValid(true);
    } else {
      setIsValid(false);
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaveButton('Сохранение...');
    onUpdateUser({
      name: values.name,
      about: values.description,
    }, setSaveButton);
  }
  
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      name: currentUser.name || '',
      description: currentUser.about || ''
    }))
    setIsValid(true);
  }, [currentUser, isOpen])

  if (Object.keys(currentUser).length > 0) {
    return (
      <PopupWithForm 
        name="personal-information"
        title="Редактировать профиль"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        isValid={isValid}
        saveButton={saveButton}
      >
        <input
          type="text"
          onChange={handleChange}
          value={values.name}
          id="name-input"
          name="name"
          className={`popup__field popup__field_type_name ${(errors.name?.length > 1) ? 'popup__field_type_error' : ''}`}
          placeholder="Имя"
          minLength="2"
          maxLength="40"
          required
        />
        <span className={`popup__field-error name-input-error ${(errors.name?.length > 1) ? 'popup__field-error_active' : ''}`}>{errors.name}</span>
        <input
          type="text"
          onChange={handleChange}
          value={values.description}
          id="description-input"
          name="description"
          className={`popup__field popup__field_type_description ${(errors.description?.length > 1) ? 'popup__field_type_error' : ''}`}
          placeholder="О себе"
          minLength="2"
          maxLength="200"
          required
        />
        <span className={`popup__field-error description-input-error ${(errors.description?.length > 1) ? 'popup__field-error_active' : ''} `}>{errors.description}</span>
      </PopupWithForm>
    )
  } else {
    return null;
  }
}

export default EditProfilePopup;