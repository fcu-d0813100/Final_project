import React, { useState, useEffect } from 'react';
import Header from '@/components/home/common/header';
import ClassAct from '@/components/home/common/class-act';
import Brands from '@/components/home/common/brands';
export default function App(props) {
  return (
    <>
      <Header />
      <ClassAct />
      <Brands />

    </>
  );
}
