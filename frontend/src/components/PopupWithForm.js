import React from 'react';
import useClose from '../utils/useClose';

function PopupWithForm({name, title, isOpen, onClose, children, onSubmit, isValid, saveButton}) {
  useClose(isOpen, onClose);

    return (
    <div className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className={`popup__container popup__container_type_${name}`}>
        <h2 className={`popup__heading popup__heading_type_${name}`}>{title}</h2>
        <form className={`popup__form popup__form_type_${name}`} onSubmit={onSubmit} noValidate>
          {children}
          <button
            type="submit"
            disabled={!isValid}
            className={`popup__save-button save-button ${isValid ? '' : 'popup__save-button_disabled'}`}
          >
            {saveButton}
          </button> 
        </form>
        <button className="popup__close-button button-link-opacity" onClick={onClose}></button>
      </div>
    </div>
  )
}

export default PopupWithForm;