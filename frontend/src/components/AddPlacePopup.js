import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm.js';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [values, setValues] = useState({ placename: '', link: '' });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    onAddPlace({
      name: values.placename,
      link: values.link
    }, setIsSubmitted, setSaveButton);
  }

  useEffect(() => {
    if (isSubmitted) {
      setValues(() => ({
          placename: '',
          link: ''
        }));
      setIsValid(false);
    }
    return (
      setIsSubmitted(false)
    )
  }, [isOpen, isSubmitted])

  return (
    <PopupWithForm 
      name="add-new-cards"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={isValid}
      saveButton={saveButton}
    >
      <input
        type="text"
        onChange={handleChange}
        value={values.placename}
        id="placename-input"
        name="placename"
        className={`popup__field popup__field_type_place-name ${(errors.placename?.length > 1) ? 'popup__field_type_error' : ''}`}
        placeholder="Название"
        minLength="2"
        maxLength="30"
        required 
      />
      <span className={`popup__field-error placename-input-error ${(errors.placename?.length > 1) ? 'popup__field-error_active' : ''}`}>{errors.placename}</span>
      <input
        type="url"
        onChange={handleChange}
        value={values.link}
        id="url-input"
        name="link"
        className={`popup__field popup__field_type_link-img ${(errors.link?.length > 1) ? 'popup__field_type_error' : ''}`}
        placeholder="Ссылка на картинку"
        required
      />
      <span className={`popup__field-error url-input-error ${(errors.link?.length > 1) ? 'popup__field-error_active' : ''}`}>{errors.link}</span>
    </PopupWithForm>
  )
}

export default AddPlacePopup;