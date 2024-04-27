// ToggleButton.js
import  { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

// Define themes for light and dark mode
const lightTheme = {
  body: '#ffffff',
  text: '#000000',
};

const darkTheme = {
  body: '#1a1a1a',
  text: '#ffffff',
};

// Styled component for the button
const ToggleButtonWrapper = styled.button`
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const ToggleButton = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <ToggleButtonWrapper onClick={toggleTheme}>
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </ToggleButtonWrapper>
    </ThemeProvider>
  );
};

export default ToggleButton;
