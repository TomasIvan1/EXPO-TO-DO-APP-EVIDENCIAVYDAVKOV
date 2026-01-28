import { StyleSheet, View } from "react-native";
import SumaVydavkov from "./SumaVydavkov";
import ZoznamVydavkov from "./ZoznamVydavkov";

import { GlobalStyles } from "../constant/styles";
import SearchBar from "./SearchBar";
import { useState } from "react";

export default function ZobrazenieVydavkov({ vydavky, pocetDniVydavkov }) {
  const [hladaneVydavky1, setHladaneVydavky1] = useState([]);

  function handleSearch(najdeneVydavky) {
    setHladaneVydavky1(najdeneVydavky);
  }
  return (
    <View style={styles.container}>
      <SumaVydavkov vydavky={vydavky} pocetDni={pocetDniVydavkov} />
      <SearchBar placeholder="Najdi" onSearch={handleSearch} vydavky={vydavky}/>
      <ZoznamVydavkov vydavky={hladaneVydavky1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
  },
});
