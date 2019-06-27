import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <p className="footer-text">{currentYear} Twitter Clone</p>
    </footer>
  );
}
