import { createContext, useReducer } from "react";

const MOCK_VYDAVKY = [
  {
    id: "e1",
    popis: "Káva",
    suma: 2.5,
    datum: new Date("2024-06-01"),
  },
  {
    id: "e2",
    popis: "Obed",
    suma: 12.0,
    datum: new Date("2024-06-02"),
  },
  {
    id: "e3",
    popis: "Nákup potravín",
    suma: 45.3,
    datum: new Date("2024-06-03"),
  },
];
export const VydavkyContext = createContext({
  vydavky: [],
  pridatVydavok: ({ popis, suma, datum }) => {},
  setVydavky: (vydavky) => {},
  upravitVydavok: (id, { popis, suma, datum }) => {},
  zmazatVydavok: (id) => {},
});

function vydavkyReducer(stavVydavkov, action) {
  switch (action.type) {
    case "PRIDAT":
      return [action.payload, ...stavVydavkov];
    case "SET":
      return action.payload.reverse()
    case "UPRAVIT":
      const vydavokIndex = stavVydavkov.findIndex(
        (vydavok) => vydavok.id === action.payload.id
      );
      const aktualizovanyVydavok = stavVydavkov[vydavokIndex];
      const upravovanyVydavok = {
        ...aktualizovanyVydavok,
        ...action.payload.data,
      };
      const aktualizovaneVydavky = [...stavVydavkov];
      aktualizovaneVydavky[vydavokIndex] = upravovanyVydavok;
      return aktualizovaneVydavky;

    case "ZMAZAT":
      return stavVydavkov.filter((vydavok) => vydavok.id !== action.payload);

    default:
      return stavVydavkov;
  }
}

export default function VydavkyContextProvider({ children }) {
  const [vydavkyStav, dispatch] = useReducer(vydavkyReducer, []);

  function pridatVydavok(vydavokData) {
    dispatch({ type: "PRIDAT", payload: vydavokData });
  }

  function setVydavky(vydavky) {
    dispatch({type: "SET", payload: vydavky})
  }

  function upravitVydavok(id, vydavokData) {
    dispatch({ type: "UPRAVIT", payload: { id: id, data: vydavokData } });
  }

  function zmazatVydavok(id) {
    console.log("Zmazanie výdavku s ID v kontexte:", id);
    dispatch({ type: "ZMAZAT", payload: id });
  }

  const value = {
    vydavky: vydavkyStav,
    setVydavky: setVydavky,
    pridatVydavok: pridatVydavok,
    upravitVydavok: upravitVydavok,
    zmazatVydavok: zmazatVydavok,
  };

  return (
    <VydavkyContext.Provider value={value}>{children}</VydavkyContext.Provider>
  );
}
