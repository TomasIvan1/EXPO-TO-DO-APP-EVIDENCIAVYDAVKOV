import { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ZobrazenieVydavkov from "../components/ZobrazenieVydavkov";
import { VydavkyContext } from "../store/vydavky-context";
import { GlobalStyles } from "../constant/styles";
import { fetchVydavky } from "../util/http";

export default function PosledneVydavky() {
  const vydavkyCtx = useContext(VydavkyContext);

  useEffect(() => {
  const nacitajVydavky = async () => {
    const dataVydavky = await fetchVydavky();
    console.log("Načítané výdavky:", dataVydavky);
    vydavkyCtx.setVydavky(dataVydavky);
  };

  nacitajVydavky();
}, []);

  const dnes = new Date();
  const sedemDniSpat = new Date(
    dnes.getFullYear(),
    dnes.getMonth(),
    dnes.getDate() - 7
  );

  const posledneVydavky = vydavkyCtx.vydavky.filter((vydavok) => {
    return vydavok.datum >= sedemDniSpat && vydavok.datum <= dnes;
  });

  return (
    <View style={styles.container}>
      <ZobrazenieVydavkov
        vydavky={posledneVydavky}
        pocetDniVydavkov="Posledných 7 dní"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },
});
