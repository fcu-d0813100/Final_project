import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import 'bootstrap/dist/css/bootstrap.min.css'
export default function Dropdown() {
  // 使用 useEffect 確保 Bootstrap JavaScript 僅在客戶端加載
  useEffect(() => {
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap.bundle.min.js')
      : null
  }, [])
  return <></>
}
