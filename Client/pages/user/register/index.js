import React, { useState, useEffect } from 'react'
import UserSignup from '@/components/user/pages/user-signup'

function UserLoginPage(props) {
  return (
    <>
      <UserSignup />
    </>
  )
}
UserLoginPage.getLayout = function getLayout(page) {
  return page
}
export default UserLoginPage
