import { useLayoutEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import IconTlacitko from "../components/UI/IconTlacitko";
import { GlobalStyles } from "../constant/styles";
import VydavokFormular from "../components/VydavokFormular";
import { VydavkyContext } from "../store/vydavky-context";

export default function SpravaVydavku({ route, navigation }) {
  const vydavkyCtx = useContext(VydavkyContext);

  // params? - znamená, že params môžu, ale nemusia byť definované
  const upravovanyVydavok = route.params?.vydavok;
  //console.log("ID upravovaného výdavku:", upravovanyVydavok);

  // nájdenie výdavku podľa ID z kontextu
  const vybranyVydavok = vydavkyCtx.vydavky.find(
    (vydavok) => vydavok.id === upravovanyVydavok
  );

  // Dvojité negovanie na prevod na boolean hodnotu
  const jeEditacia = !!upravovanyVydavok;
  //console.log("jeEditacia:", jeEditacia);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: jeEditacia ? "Upraviť výdavok" : "Pridať výdavok",
    });
  }, [navigation, jeEditacia]);

  // funkcia na odstránenie položky výdavku - pripojená k ikone koša
  function deletePolozkuHandler() {
    vydavkyCtx.zmazatVydavok(upravovanyVydavok);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  function confirmHandler(vydavokData) {
    if (jeEditacia) {
      // aktualizovať existujúci výdavok
      //console.log("Upravovaný výdavok ID:", upravovanyVydavok);
      vydavkyCtx.upravitVydavok(upravovanyVydavok, vydavokData);
    } else {
      // pridať nový výdavok
      vydavkyCtx.pridatVydavok(vydavokData);
    }
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {/* Formulár na zadanie alebo úpravu výdavku */}
      <VydavokFormular
        buttonLabel={jeEditacia ? "Upraviť" : "Pridať"}
        onSubmit={confirmHandler}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
