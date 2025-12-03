import React from 'react';
import styles from './styles.module.css';

export default function WindowControls() {
  // Check if we're running in Electron
  const isElectron = typeof window !== 'undefined' && window.electronAPI;

  const handleMinimize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Minimize clicked');
    if (window.electronAPI && window.electronAPI.minimize) {
      window.electronAPI.minimize()
        .then(() => console.log('Minimize success'))
        .catch(err => console.error('Minimize error:', err));
    } else {
      console.error('electronAPI.minimize not available');
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Close clicked');
    if (window.electronAPI && window.electronAPI.close) {
      window.electronAPI.close()
        .then(() => console.log('Close success'))
        .catch(err => console.error('Close error:', err));
    } else {
      console.error('electronAPI.close not available');
    }
  };

  // Only show in Electron
  if (!isElectron) {
    return null;
  }

  return (
    <div className={styles.windowControls}>
      <button
        className={styles.controlButton}
        onClick={handleMinimize}
        aria-label="Minimize window"
        title="Minimize"
      >
        −
      </button>
      <button
        className={styles.controlButton}
        onClick={handleClose}
        aria-label="Close window"
        title="Close"
      >
        ×
      </button>
    </div>
  );
}

