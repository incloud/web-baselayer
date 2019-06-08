import { Button, Icon, Layout, Typography } from 'antd';
import React, { FunctionComponent } from 'react';
import logo from '../assets/logo.png';
import { styled } from '../theme';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const CustomHeader = styled(AntHeader)`
  box-shadow: 0px 2px 5px 0px rgba(150, 150, 150, 1);
  z-index: 2;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const BrandWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 25px;
    margin-right: 10px;
  }

  .ant-typography {
    font-size: 20px;
    white-space: nowrap;
  }
`;

export const Header: FunctionComponent<{
  isLoggedIn: boolean;
  logout: () => any;
  login: () => any;
}> = ({ isLoggedIn, logout, login }) => {
  return (
    <CustomHeader className="header">
      <HeaderRow>
        <BrandWrapper>
          <img src={logo} />
          <Text>Baselayer</Text>
        </BrandWrapper>
        {isLoggedIn && (
          <Button type="primary" onClick={logout}>
            <Icon type="logout" />
            Logout
          </Button>
        )}
      </HeaderRow>
    </CustomHeader>
  );
};
