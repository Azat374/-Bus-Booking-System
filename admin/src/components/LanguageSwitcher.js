import React from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'kz', label: 'Қазақша' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng); // сохраняем выбранный язык
  };

  return (
    <Dropdown as={ButtonGroup}>
      <Dropdown.Toggle variant="outline-primary" size="sm">
        <FontAwesomeIcon icon="fa-solid fa-globe" style={{ marginRight: '5px' }} />
        {languages.find((l) => l.code === currentLang)?.label || 'Language'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {languages.map((lang) => (
          <Dropdown.Item
            key={lang.code}
            onClick={() => handleChangeLanguage(lang.code)}
            active={currentLang === lang.code}
          >
            {lang.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
