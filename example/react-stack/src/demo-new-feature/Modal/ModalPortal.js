import React from 'react'
import styles from './index.css'
console.log(styles);
export default function ModalPortal ({
  isOpen,
  onClose,
  children
}) {
  return (
    <div className={`${styles.dialog} ${isOpen ? styles.open : ''}`}>
      <button onClick={onClose}>close</button>
      <div>
        {children}
      </div>
    </div>
  )
}
