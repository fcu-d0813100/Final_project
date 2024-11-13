'use client'
import toast, { Toaster } from 'react-hot-toast'
import React, { useState, useEffect } from 'react'

export default function ToastSuccess({ message, functionName }) {
  // 定義可以動態調用的函數
  const showToast = () =>
    toast.success(message, {
      style: {
        padding: '12px 40px',
        color: '#626553',
        fontSize: '18px',
      },
      iconTheme: {
        primary: '#626553',
        secondary: '#fff',
      },
    })

  // 將 showToast 以傳入名稱 functionName 傳出
  return {
    [functionName]: showToast,
  }
}
