import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GlobalStyles } from "../constant/styles";

function vytvorRegion(poloha) {
  return {
    latitude: poloha.latitude,
    longitude: poloha.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
}

export default function MapaScreen({ route }) {
  const poloha = route.params?.poloha;
  const popis = route.params?.popis || "Vydavok";

  if (!poloha) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>K tomuto vydavku este nie je priradena poloha.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={vytvorRegion(poloha)}>
        <Marker coordinate={poloha} title={popis} />
      </MapView>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Lat: {poloha.latitude.toFixed(5)} | Lng: {poloha.longitude.toFixed(5)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  map: {
    flex: 1,
  },
  infoBox: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  infoText: {
    color: "white",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
  },
});
