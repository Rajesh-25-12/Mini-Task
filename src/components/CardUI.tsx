import React from 'react';
import { Card } from 'antd';

interface CardUIProps {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  hoverable?: boolean;
  bordered?: boolean;
}

const CardUI: React.FC<CardUIProps> = ({
  title,
  children,
  className,
  style,
  bodyStyle,
  hoverable = false,
  bordered = false,
}) => {
  return (
    <Card
      title={title}
      className={className}
      style={style}
      bodyStyle={bodyStyle}
      hoverable={hoverable}
      bordered={bordered}
    >
      {children}
    </Card>
  );
};

export default CardUI;
