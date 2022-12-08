import { useEffect } from "react";

function useClose(isOpen, handleClose) {
  useEffect(() => {
    if (isOpen) {
      function handleEsc(event) {
        if (event.key === 'Escape') {
          handleClose();
        }
    }

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    }
  }
  }, [isOpen, handleClose])
}

export default useClose;