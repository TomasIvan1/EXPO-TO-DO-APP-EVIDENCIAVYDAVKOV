import { TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../constant/styles";
import { useState } from "react";

function SearchBar({ placeholder, onSearch, vydavky }) {
  const [hladaneVydavky, setHladaneVydavky] = useState("");
    function handleHladanie(text) {
      setHladaneVydavky(text);
      if (text.trim() === "") {
        onSearch(vydavky);
      } else {
        const najdene = vydavky.filter((vydavok) =>
        vydavok.popis.toLowerCase().includes(text.toLowerCase())
    );
        onSearch(najdene);
    }
    }
  return (
    <View style={styles.container}>
      <Ionicons 
        name="search" 
        size={20} 
        color={GlobalStyles.colors.gray500} 
        style={styles.icon} 
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={GlobalStyles.colors.gray500}
        onChangeText={handleHladanie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 8,
  },
  icon: {
    marginRight: 8,
    marginTop: -30,
    backgroundColor: GlobalStyles.colors.primary200,
    padding: 15,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: GlobalStyles.colors.primary700,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: GlobalStyles.colors.primary700,
  },
});

export default SearchBar;
