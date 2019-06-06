import { Spin } from 'antd';
import React, { FunctionComponent } from 'react';
import { styled } from '../theme';

const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 5;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FullscreenSpinner: FunctionComponent<{}> = () => {
  return (
    <FullscreenOverlay>
      <Spin tip="Loading..." size="large" />
    </FullscreenOverlay>
  );
};
