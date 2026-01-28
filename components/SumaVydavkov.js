import { Text, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constant/styles";

export default function SumaVydavkov({ vydavky, pocetDni }) {
  // výpočet sumy všetkých výdavkov za dané obdobie
  // reduce prejde všetky položky v poli vydavky a sčíta ich amount
  const vydavkySuma = vydavky.reduce((suma, vydavok) => {
    return suma + vydavok.suma;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.pocetDni}>{pocetDni}</Text>
      {/* Zobrazenie sumy výdavkov s dvoma desatinnými miestami - zabezpečí toFixed(2) */}
      <Text style={styles.suma}>€{vydavkySuma.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pocetDni: {
    fontSize: 12,
    color: GlobalStyles.colors.primary400,
  },
  suma: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
  },
});
