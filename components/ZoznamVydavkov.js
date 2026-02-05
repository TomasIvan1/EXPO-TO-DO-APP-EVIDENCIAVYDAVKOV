import { FlatList, StyleSheet } from "react-native";
import PolozkaVydavok from "./PolozkaVydavok";

export default function ZoznamVydavkov({ vydavky }) {
  function zobrazVydavokPolozku(itemData) {
    return <PolozkaVydavok {...itemData.item} />;
  }

  return (
    <FlatList
      style={styles.list}
      data={vydavky}
      renderItem={zobrazVydavokPolozku}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
