import React, { useState, useEffect } from 'react';
import Header from '@/components/home/common/header';
import Brands from '@/components/home/common/brands';
export default function App(props) {
  return (
    <>
      <Header />
      <Brands/>
    </>
  );
}
