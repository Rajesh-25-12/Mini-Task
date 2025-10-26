import React from 'react';
import { Input, Typography } from 'antd';

const { Text } = Typography;

interface InputFieldProps {
  field: any;
  label: string;
  placeholder: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  field,
  label,
  placeholder,
  error,
  touched,
  required = false,
}) => {
  return (
    <div>
      <Text strong>
        {required && <span style={{ color: '#ff4d4f' }}>* </span>}
        {label}
      </Text>
      <Input
        {...field}
        placeholder={placeholder}
        status={error && touched ? 'error' : ''}
        size='large'
      />
      {error && touched && (
        <Text type='danger' style={{ fontSize: '12px' }}>
          {error}
        </Text>
      )}
    </div>
  );
};

export default InputField;
