import { Pressable, View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constant/styles";
import { getFormatovanyDatum } from "../util/date";
import { useNavigation } from "@react-navigation/native";

export default function PolozkaVydavok({ id, popis, suma, datum }) {
  const navigation = useNavigation();

  function vydavokPolozkaPressHandler() {
    navigation.navigate("Správa Výdavku", { vydavok: id });
  }

  return (
    <Pressable
      onPress={vydavokPolozkaPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.vydavokPolozka}>
        <View>
          <Text style={[styles.textPolozky, styles.popis]}>{popis}</Text>
          <Text style={styles.textPolozky}>{getFormatovanyDatum(datum)}</Text>
        </View>
        <View style={styles.sumaContainer}>
          <Text style={styles.suma}>€{suma.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  vydavokPolozka: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.primary500,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textPolozky: {
    color: GlobalStyles.colors.primary50,
  },
  popis: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  sumaContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  suma: {
    color: GlobalStyles.colors.primary500,
    fontWeight: "bold",
  },
});
