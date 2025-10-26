import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Card, Input, Typography, Space, Alert, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearAuthError } from '../store/slices';

const { Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean(),
});

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: LoginFormValues) => {
    dispatch(clearAuthError());

    const result = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  const initialValues: LoginFormValues = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka',
    rememberMe: localStorage.getItem('rememberMe') === 'true',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        }}
      >
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {error && (
            <Alert
              message='Login Failed'
              description={error}
              type='error'
              showIcon
              closable
              onClose={() => dispatch(clearAuthError())}
            />
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValid, dirty, values, setFieldValue }) => (
              <Form>
                <Space
                  direction='vertical'
                  size='middle'
                  style={{ width: '100%' }}
                >
                  <div>
                    <Field name='email'>
                      {({ field }: any) => (
                        <Input
                          {...field}
                          prefix={<UserOutlined />}
                          placeholder='Enter your email'
                          status={errors.email && touched.email ? 'error' : ''}
                          size='large'
                        />
                      )}
                    </Field>
                    {errors.email && touched.email && (
                      <Text type='danger' style={{ fontSize: '12px' }}>
                        {errors.email}
                      </Text>
                    )}
                  </div>

                  <div>
                    <Field name='password'>
                      {({ field }: any) => (
                        <Input.Password
                          {...field}
                          prefix={<LockOutlined />}
                          placeholder='Enter your password'
                          status={
                            errors.password && touched.password ? 'error' : ''
                          }
                          size='large'
                        />
                      )}
                    </Field>
                    {errors.password && touched.password && (
                      <Text type='danger' style={{ fontSize: '12px' }}>
                        {errors.password}
                      </Text>
                    )}
                  </div>

                  <div>
                    <Field name='rememberMe'>
                      {({ field }: any) => (
                        <Checkbox
                          {...field}
                          checked={values.rememberMe}
                          onChange={(e) =>
                            setFieldValue('rememberMe', e.target.checked)
                          }
                        >
                          Remember me
                        </Checkbox>
                      )}
                    </Field>
                  </div>

                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={loading}
                    size='large'
                    style={{ width: '100%' }}
                  >
                    Sign In
                  </Button>
                </Space>
              </Form>
            )}
          </Formik>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
