import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
const Login = lazy(() => import('../pages/Login'));
const UserList = lazy(() => import('../pages/UserList'));
const Layout = lazy(() => import('../components/Layout'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? <>{children}</> : <Navigate to='/login' replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 40 }}
          >
            <Spin size='large' />
          </div>
        }
      >
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserList />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
