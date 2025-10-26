import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import { Spin } from 'antd';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <div className='App'>
          <Suspense
            fallback={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 40,
                }}
              >
                <Spin size='large' />
              </div>
            }
          >
            <AppRoutes />
          </Suspense>
        </div>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
