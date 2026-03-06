import { StyleSheet, View } from "react-native";
import SumaVydavkov from "./SumaVydavkov";
import ZoznamVydavkov from "./ZoznamVydavkov";

import { GlobalStyles } from "../constant/styles";
import SearchBar from "./SearchBar";
import { useState } from "react";

export default function ZobrazenieVydavkov({ vydavky, pocetDniVydavkov }) {
  const [hladaneVydavky1, setHladaneVydavky1] = useState(null);

  function handleSearch(najdeneVydavky) {
    setHladaneVydavky1(najdeneVydavky);
  }

  const zobrazeneVydavky = hladaneVydavky1 !== null ? hladaneVydavky1 : vydavky;

  return (
    <View style={styles.container}>
      <SearchBar placeholder="Najdi" onSearch={handleSearch} vydavky={vydavky}/>
      <SumaVydavkov vydavky={vydavky} pocetDni={pocetDniVydavkov} />
      <ZoznamVydavkov vydavky={zobrazeneVydavky} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
  },
});
