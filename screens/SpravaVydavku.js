import { useLayoutEffect, useContext } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import IconTlacitko from "../components/UI/IconTlacitko";
import { GlobalStyles } from "../constant/styles";
import VydavokFormular from "../components/VydavokFormular";
import { VydavkyContext } from "../store/vydavky-context";
import { ulozVydavok } from "../util/http";
import { aktualizujVydavok } from "../util/http";
import { odstranVydavok } from "../util/http";

export default function SpravaVydavku({ route, navigation }) {
  const vydavkyCtx = useContext(VydavkyContext);

  const upravovanyVydavok = route.params?.vydavok;

  const vybranyVydavok = vydavkyCtx.vydavky.find(
    (vydavok) => vydavok.id === upravovanyVydavok
  );

  const jeEditacia = !!upravovanyVydavok;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: jeEditacia ? "Upraviť vydavok" : "Pridat vydavok",
    });
  }, [navigation, jeEditacia]);

  async function deletePolozkuHandler() {
    try {
      await odstranVydavok(upravovanyVydavok);
      vydavkyCtx.zmazatVydavok(upravovanyVydavok);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Chyba",
        "Nepodarilo sa odstranit vydavok. Skontroluj pripojenie alebo Firebase pravidla."
      );
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function saveLocationHandler(poloha, vydavokData) {
    if (!jeEditacia) {
      return { persisted: false };
    }

    try {
      await aktualizujVydavok(upravovanyVydavok, vydavokData);
      vydavkyCtx.upravitVydavok(upravovanyVydavok, vydavokData);
      return { persisted: true };
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const message =
        (typeof data === "string" && data) ||
        (data && JSON.stringify(data)) ||
        error?.message ||
        "Neznama chyba";
      Alert.alert(
        "Chyba",
        `Nepodarilo sa ulozit polohu. ${status ? `HTTP ${status}. ` : ""}${message}`
      );
      return { persisted: false, failed: true };
    }
  }

  async function confirmHandler(vydavokData) {
    try {
      if (jeEditacia) {
        vydavkyCtx.upravitVydavok(upravovanyVydavok, vydavokData);
        await aktualizujVydavok(upravovanyVydavok, vydavokData);
      } else {
        const id = await ulozVydavok(vydavokData);
        vydavkyCtx.pridatVydavok({ ...vydavokData, id });
      }
      navigation.goBack();
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const message =
        (typeof data === "string" && data) ||
        (data && JSON.stringify(data)) ||
        error?.message ||
        "Neznama chyba";
      Alert.alert(
        "Chyba",
        `Nepodarilo sa ulozit vydavok. ${status ? `HTTP ${status}. ` : ""}${message}`
      );
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <VydavokFormular
          buttonLabel={jeEditacia ? "Upravit" : "Pridat"}
          onSubmit={confirmHandler}
          onSaveLocation={saveLocationHandler}
          isEditacia={jeEditacia}
          cancelHandler={cancelHandler}
          defaultValues={vybranyVydavok}
        />
        {upravovanyVydavok && (
          <View style={styles.deleteContainer}>
            <IconTlacitko
              ikona="trash"
              size={36}
              color={GlobalStyles.colors.error500}
              onPress={deletePolozkuHandler}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
