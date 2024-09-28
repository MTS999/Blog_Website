import { createContext, useState, useContext } from 'react';

// Create the context
const CategoryContext = createContext();

// Create a provider component
// eslint-disable-next-line react/prop-types
export const CategoryProvider = ({ children }) => {
  const [category, setCategory] = useState(["Technology", "Healthcare", "Environment", "Arts and Culture", "Food", "Education"]);
  
  // The value that will be given to the context
  const value = { category, setCategory };
  
  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook to use the category context
 const useCategory = () => useContext(CategoryContext);
 // eslint-disable-next-line react-refresh/only-export-components
 export default useCategory