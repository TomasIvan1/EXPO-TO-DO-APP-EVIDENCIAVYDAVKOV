import { TextInput, View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constant/styles";

export default function VydavokInput({ invalid, popis, konfiguracia, style }) {
  const inputStyles = [styles.input];

  //console.log("Konfigurácia - multiline:", konfiguracia.multiline);
  // meníme štýl, ak je povolené viacriadkové zadávanie textu
  if (konfiguracia && konfiguracia.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (invalid) {
    inputStyles.push(styles.invalidInput);
  }

  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.label, invalid && styles.invalidPopis]}>
        {popis}
      </Text>
      {/* spread operator - 
      rozloží všetky vlastnosti objektu do komponentu TextInput */}
      <TextInput style={inputStyles} {...konfiguracia} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    color: GlobalStyles.colors.primary100,
    marginBottom: 4,
  },
  input: {
    backgroundColor: GlobalStyles.colors.primary100,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    color: GlobalStyles.colors.primary700,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  invalidPopis: {
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
  },
});
