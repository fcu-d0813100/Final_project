import React, { useState, useEffect } from 'react';
import PostCard from '@/components/post/common/post-card';
import Header from '@/components/home/common/header';
export default function Explore(props) {
  return (
    <>
      <Header />
      <PostCard style={{ padding: '67px 190px' }} />
    </>
  );
}
