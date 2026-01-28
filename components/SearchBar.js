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
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: GlobalStyles.colors.primary700,
  },
});

export default SearchBar;
