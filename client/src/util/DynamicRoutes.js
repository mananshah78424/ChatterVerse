import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthState } from '../context/auth';

export default function DynamicRoute({ authenticated, guest, component: Component, ...rest }) {
  const { user } = useAuthState();

  if (authenticated && !user) {
    return <Navigate to="/login" />;
  } else if (guest && user) {
    return <Navigate to="/" />;
  } else {
    return <Component {...rest} />;
  }
}
