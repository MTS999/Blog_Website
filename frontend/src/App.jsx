
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { CategoryProvider } from './CategoryContext';

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
