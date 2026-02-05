import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../constant/styles";
import { getFormatovanyDatum } from "../util/date";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../constant/routes";

export default function PolozkaVydavok({ id, popis, suma, datum, fotkaUri, poloha }) {
  const navigation = useNavigation();

  function vydavokPolozkaPressHandler() {
    navigation.navigate(ROUTES.MANAGE_EXPENSE, { vydavok: id });
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
          {(fotkaUri || poloha) && (
            <View style={styles.metaRow}>
              {fotkaUri && (
                <View style={styles.metaBadge}>
                  <Ionicons
                    name="camera-outline"
                    size={14}
                    color={GlobalStyles.colors.primary100}
                  />
                  <Text style={styles.metaText}>Fotka</Text>
                </View>
              )}
              {poloha && (
                <View style={styles.metaBadge}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={GlobalStyles.colors.primary100}
                  />
                  <Text style={styles.metaText}>Mapa</Text>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.sumaContainer}>
          <Text style={styles.suma}>EUR {suma.toFixed(2)}</Text>
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
  metaRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  metaText: {
    color: GlobalStyles.colors.primary100,
    marginLeft: 4,
    fontSize: 12,
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
