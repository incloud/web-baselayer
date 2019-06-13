import { Card } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { CardProps } from 'antd/lib/card';
import React, { FC } from 'react';
import { styled } from '../theme';

const FormCardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const FormCardComponent = styled(Card)`
  width: 50%;
`;

export const FormCard: FC<CardProps> = ({ children, ...props }) => {
  return (
    <FormCardContainer>
      <FormCardComponent {...props}>{children}</FormCardComponent>
    </FormCardContainer>
  );
};
