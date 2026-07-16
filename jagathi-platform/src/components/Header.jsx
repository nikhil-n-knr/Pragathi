'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Construction & Land Development', path: '/construction' },
    { name: 'Interior', path: '/interior' },
    { name: 'Civil Market', path: '/civil-market' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`${styles.header} ${isMenuOpen ? styles.headerActive : ''}`}>
      <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
        JAGATHI
      </Link>
      
      {/* Hamburger Toggle Button */}
      <button 
        className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navActive : ''}`}>
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
