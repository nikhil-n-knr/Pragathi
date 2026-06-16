'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/header.module.css';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Construction', path: '/construction' },
    { name: 'Real Estate', path: '/real-estate' },
    { name: 'Interior', path: '/interior' },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <span style={{ color: 'var(--brand-yellow)' }}>J</span>AGATHI
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
