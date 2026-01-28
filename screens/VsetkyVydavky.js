import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import ZobrazenieVydavkov from "../components/ZobrazenieVydavkov";
import { VydavkyContext } from "../store/vydavky-context";
import { GlobalStyles } from "../constant/styles";

export default function VsetkyVydavky() {
  const vydavkyCtx = useContext(VydavkyContext);

  return (
    <View style={styles.container}>
      <ZobrazenieVydavkov
        vydavky={vydavkyCtx.vydavky}
        pocetDniVydavkov="Zobrazenie všetkých dní"
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
