
import './App.css'
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { CategoryProvider } from './CategoryContext';
import { ThemeProvider } from 'styled-components';
import ToggleButton from './components/ToggleButton';

import Routess from './Routess'
function App() {

  
  return (
    <>
      <CategoryProvider>
     
          <BrowserRouter>
            <Routess />
          </BrowserRouter>

      </CategoryProvider>


    </>
  )
}

export default App
