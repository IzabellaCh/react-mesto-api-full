import React, { useRef, useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm.js';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = useRef();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [saveButton, setSaveButton] = useState('Сохранить');

  function handleChange(event) {
    const { name, validationMessage } = event.target;

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
    onUpdateAvatar(avatarRef.current.value, setIsSubmitted, setSaveButton);
  }

  useEffect(() => {
    if (isSubmitted) {
      avatarRef.current.value = null;
      setIsValid(false);
    }
    return (
      setIsSubmitted(false)
    )
  }, [isOpen, isSubmitted])
  
  return (
    <PopupWithForm 
      name="avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={isValid}
      saveButton={saveButton}
    >
      <input 
        ref={avatarRef}
        onChange ={handleChange}
        type="url"
        id="link-input"
        name="link"
        className={`popup__field popup__field_type_link-img ${(errors.link?.length > 1) ? 'popup__field_type_error' : ''}`}
        placeholder="Ссылка на аватар"
        required
        />
      <span className={`popup__field-error link-input-error ${(errors.link?.length > 1) ? 'popup__field-error_active' : ''}`}>{errors.link}</span>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;