import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Modal, Button, Space, Typography, Alert, Divider } from 'antd';
import InputField from './InputField';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createUser, updateUser, clearUsersError } from '../store/slices';

const { Title } = Typography;

interface UserModalProps {
  visible: boolean;
  user: any;
  onClose: () => void;
}

interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

const userSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  last_name: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  avatar: Yup.string()
    .url('Must be a valid URL')
    .required('Profile image link is required'),
});

const UserModal: React.FC<UserModalProps> = ({ visible, user, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.users);

  const isEdit = !!user;
  const modalTitle = isEdit ? 'Edit User' : 'Create New User';

  const initialValues: FormValues = {
    first_name: user ? user.first_name : '',
    last_name: user ? user.last_name : '',
    email: user ? user.email : '',
    avatar: user ? user.avatar : '',
  };

  const handleSubmit = async (values: FormValues) => {
    dispatch(clearUsersError());

    // Convert FormValues to API expected format
    const apiData = {
      name: `${values.first_name} ${values.last_name}`,
      job: values.email, // Using email as job since the API requires it
    };

    if (isEdit) {
      const result = await dispatch(
        updateUser({
          id: user.id,
          userData: apiData,
        })
      );

      if (updateUser.fulfilled.match(result)) {
        onClose();
      }
    } else {
      const result = await dispatch(createUser(apiData));

      if (createUser.fulfilled.match(result)) {
        onClose();
      }
    }
  };

  return (
    <Modal
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {modalTitle}
          </Title>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Divider />

      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {error && (
          <Alert
            message='Error'
            description={error}
            type='error'
            showIcon
            closable
            onClose={() => dispatch(clearUsersError())}
          />
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={userSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <Space
                direction='vertical'
                size='middle'
                style={{ width: '100%' }}
              >
                <Field name='first_name'>
                  {({ field }: any) => (
                    <InputField
                      field={field}
                      label='First Name'
                      placeholder='Please enter first name'
                      error={errors.first_name}
                      touched={touched.first_name}
                      required
                    />
                  )}
                </Field>

                <Field name='last_name'>
                  {({ field }: any) => (
                    <InputField
                      field={field}
                      label='Last Name'
                      placeholder='Please enter last name'
                      error={errors.last_name}
                      touched={touched.last_name}
                      required
                    />
                  )}
                </Field>

                <Field name='email'>
                  {({ field }: any) => (
                    <InputField
                      field={field}
                      label='Email'
                      placeholder='Please enter email'
                      error={errors.email}
                      touched={touched.email}
                      required
                    />
                  )}
                </Field>

                <Field name='avatar'>
                  {({ field }: any) => (
                    <InputField
                      field={field}
                      label='Profile Image Link'
                      placeholder='Please enter profile image link'
                      error={errors.avatar}
                      touched={touched.avatar}
                      required
                    />
                  )}
                </Field>

                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button type='primary' htmlType='submit' loading={loading}>
                    {isEdit ? 'Update' : 'Submit'}
                  </Button>
                </Space>
              </Space>
            </Form>
          )}
        </Formik>
      </Space>
    </Modal>
  );
};

export default UserModal;
