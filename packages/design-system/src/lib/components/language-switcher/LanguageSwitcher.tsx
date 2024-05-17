import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@iqss/dataverse-design-system';


const LanguageSwitcher = () => {
  const { i18n } = useTranslation();


  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };


  return (
    <Navbar.Dropdown title={i18n.language === 'en' ? 'English' : 'Français'} id="dropdown-language">
      <Navbar.Dropdown.Item href="#" onClick={() => changeLanguage('en')}>
        English
      </Navbar.Dropdown.Item>
      <Navbar.Dropdown.Item href="#" onClick={() => changeLanguage('fr')}>
        Français
      </Navbar.Dropdown.Item>
    </Navbar.Dropdown>
  );
};


export default LanguageSwitcher;