import React, { useState } from 'react';

const initUniversityValue = {
  listUni: [],
  limit: 10,
  offset: 0,
  totalRecordCount: 0,
  updateListUni: () => { },
  updateLimitSelection: () => { },
  updateTotalRecordCount: () => { },
};
export const UniversityContext = React.createContext(initUniversityValue);

export const UniversityProvider = ({ children }) => {
  const [listUni, setListUni] = useState([]);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [limitSelection, setLimitSelection] = useState({ limit: 10, offset: 0 });
  const updateListUni = (listUni) => {
    setListUni(listUni);
  };

  return (
    <UniversityContext.Provider value={{
      listUni,
      limit: limitSelection.limit,
      offset: limitSelection.offset,
      totalRecordCount,
      updateListUni,
      updateLimitSelection: setLimitSelection,
      updateTotalRecordCount: setTotalRecordCount,
    }}>
      {children}
    </UniversityContext.Provider>
  );
};
