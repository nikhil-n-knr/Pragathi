'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/header.module.css';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Construction & Land Dev', path: '/construction' },
    { name: 'Interior', path: '/interior' },
    { name: 'Civil Market', path: '/civil-market' },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        JAGATHI
      </Link>
      
      <nav className={styles.nav}>
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
