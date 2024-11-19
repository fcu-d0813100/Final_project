import React, { useState } from 'react';
import Link from 'next/link';
import styles from './index.module.scss';
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

export default function Index({ CN, ENG }) {
  return (
    <div className={styles['post-title']}>
      <span className="h3 p-2">{CN}</span>
      <span className="h1-L">{ENG}</span>
    </div>
  );
}
