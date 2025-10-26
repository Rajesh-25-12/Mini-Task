import React from 'react';
import { Row, Col } from 'antd';

interface SplitProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  align?: 'top' | 'middle' | 'bottom';
  gutter?: number | [number, number];
}

const Split: React.FC<SplitProps> = ({
  left,
  right,
  align = 'middle',
  gutter = 16,
}) => {
  return (
    <Row
      justify='space-between'
      align={align}
      gutter={gutter}
      style={{ width: '100%' }}
    >
      <Col>{left}</Col>
      <Col>{right}</Col>
    </Row>
  );
};

export default Split;
