import React from 'react';
import Menu from '../../../shared/components/Navigation/Menu.jsx';
import MainTitleHeader from '../../../shared/components/Headers/MainTitleHeader.jsx';
import menuData from '../data/menu.json';

const Header: React.FC = () => {
  return (
    <>
      <Menu data={menuData} />
      <MainTitleHeader data={{ title: "Preston Garrison" }} />
    </>
  );
};

export default Header;