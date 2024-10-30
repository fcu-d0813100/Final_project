import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PiNotePencilBold } from 'react-icons/pi';

import FavoriteUser from '@/components/user/pages/favorite-user';
export default function Index(props) {
  return (
    <>
      <FavoriteUser />
    </>
  );
}