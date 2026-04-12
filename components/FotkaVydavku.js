import { Image, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../constant/styles";
import Tlacitko from "./UI/Tlacitko";
import useCamera from "../hooks/useCamera";

export default function FotkaVydavku({ value, onChange }) {
  const { fotkaUri, odfotit, vybratZGalerie, odstranFotku } = useCamera(value);

  async function odfotitHandler() {
    const novaFotkaUri = await odfotit();

    if (novaFotkaUri) {
      onChange(novaFotkaUri);
    }
  }

  async function vybratZGalerieHandler() {
    const novaFotkaUri = await vybratZGalerie();

    if (novaFotkaUri) {
      onChange(novaFotkaUri);
    }
  }

  function odstranFotkuHandler() {
    odstranFotku();
    onChange(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fotka vydavku</Text>
      <View style={styles.actions}>
        <Tlacitko style={styles.actionButton} onPress={odfotitHandler}>
          Odfotit
        </Tlacitko>
        <Tlacitko style={styles.actionButton} onPress={vybratZGalerieHandler}>
          Z galerie
        </Tlacitko>
      </View>
      {fotkaUri && (
        <View style={styles.preview}>
          <Image source={{ uri: fotkaUri }} style={styles.image} />
        </View>
      )}
      {fotkaUri && (
        <Tlacitko mode="flat" onPress={odstranFotkuHandler}>
          Odstranit fotku
        </Tlacitko>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    color: GlobalStyles.colors.primary100,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  preview: {
    height: 180,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: GlobalStyles.colors.primary100,
    marginHorizontal: 4,
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
