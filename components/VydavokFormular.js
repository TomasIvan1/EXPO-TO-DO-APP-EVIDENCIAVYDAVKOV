import { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import VydavokInput from "./VydavokInput";
import Tlacitko from "./UI/Tlacitko";
import { GlobalStyles } from "../constant/styles";
import FotkaVydavku from "./FotkaVydavku";
import useGeolokacia from "../hooks/useGeolokacia";
import { ROUTES } from "../constant/routes";

export default function VydavokFormular({
  buttonLabel,
  cancelHandler,
  onSubmit,
  onSaveLocation,
  isEditacia,
  defaultValues,
}) {
  const navigation = useNavigation();
  const [fotkaUri, setFotkaUri] = useState(defaultValues?.fotkaUri ?? null);
  const [ulozenaPoloha, setUlozenaPoloha] = useState(defaultValues?.poloha ?? null);
  const { ziskajAktualnuPolohu } = useGeolokacia(
    defaultValues?.poloha ?? null
  );

  const [vlozeneHodnoty, setVlozeneHodnoty] = useState({
    suma: {
      value: defaultValues ? defaultValues.suma.toString() : "",
      isValid: true,
    },
    datum: {
      value: defaultValues
        ? defaultValues.datum.toISOString().slice(0, 10)
        : "",
      isValid: true,
    },
    popis: {
      value: defaultValues ? defaultValues.popis : "",
      isValid: true,
    },
  });

  function vytvorVydavokData(polohaOverride = ulozenaPoloha) {
    return {
      suma: +vlozeneHodnoty.suma.value,
      datum: new Date(vlozeneHodnoty.datum.value),
      popis: vlozeneHodnoty.popis.value,
      fotkaUri,
      poloha: polohaOverride,
    };
  }

  function inputChangeHandler(inputIdentifikator, enteredHodnota) {
    setVlozeneHodnoty((predosleVlozeneHodnoty) => {
      return {
        ...predosleVlozeneHodnoty,
        [inputIdentifikator]: { value: enteredHodnota, isValid: true },
      };
    });
  }

  function editujHandler() {
    const vydavokData = vytvorVydavokData();

    const sumaIsValid = !isNaN(vydavokData.suma) && vydavokData.suma > 0;
    const datumIsValid = vydavokData.datum.toString() !== "Invalid Date";
    const popisIsValid = vydavokData.popis.trim().length > 0;

    if (!sumaIsValid || !datumIsValid || !popisIsValid) {
      setVlozeneHodnoty((predosleVlozeneHodnoty) => {
        return {
          suma: {
            value: predosleVlozeneHodnoty.suma.value,
            isValid: sumaIsValid,
          },
          datum: {
            value: predosleVlozeneHodnoty.datum.value,
            isValid: datumIsValid,
          },
          popis: {
            value: predosleVlozeneHodnoty.popis.value,
            isValid: popisIsValid,
          },
        };
      });
      return;
    }

    onSubmit(vydavokData);
  }

  async function ulozPolohuHandler() {
    const novaPoloha = await ziskajAktualnuPolohu();

    if (!novaPoloha) {
      return;
    }

    if (onSaveLocation) {
      const result = await onSaveLocation(novaPoloha, vytvorVydavokData(novaPoloha));

      if (result?.failed) {
        return;
      }

      if (result?.persisted) {
        setUlozenaPoloha(novaPoloha);
        Alert.alert(
          "Hotovo",
          `Poloha vydavku bola ulozena.\nLat: ${novaPoloha.latitude.toFixed(6)}\nLng: ${novaPoloha.longitude.toFixed(6)}`
        );
        return;
      }
    }

    setUlozenaPoloha(novaPoloha);

    if (isEditacia) {
      Alert.alert("Hotovo", "Poloha bola pripravena na ulozenie.");
    } else {
      Alert.alert("Hotovo", "Poloha sa ulozi po kliknuti na Pridat.");
    }
  }

  async function zobrazMapuHandler() {
    let polohaPreMapu = ulozenaPoloha;

    if (!polohaPreMapu) {
      polohaPreMapu = await ziskajAktualnuPolohu();

      if (!polohaPreMapu) {
        Alert.alert("Mapa nie je dostupna", "Nepodarilo sa nacitat polohu.");
        return;
      }

      if (onSaveLocation) {
        const result = await onSaveLocation(
          polohaPreMapu,
          vytvorVydavokData(polohaPreMapu)
        );

        if (result?.failed) {
          return;
        }
      }

      setUlozenaPoloha(polohaPreMapu);
    }

    navigation.navigate(ROUTES.MAP, {
      poloha: polohaPreMapu,
      popis: vlozeneHodnoty.popis.value,
    });
  }

  const formularIsInvalid =
    !vlozeneHodnoty.suma.isValid ||
    !vlozeneHodnoty.datum.isValid ||
    !vlozeneHodnoty.popis.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Vydavok</Text>

      <FotkaVydavku value={fotkaUri} onChange={setFotkaUri} />

      <Tlacitko style={styles.fullWidthButton} onPress={ulozPolohuHandler}>
        Ulozit polohu
      </Tlacitko>

      <View style={styles.inputRow}>
        <VydavokInput
          style={styles.rowInputContainer}
          popis="Suma vydavku"
          invalid={!vlozeneHodnoty.suma.isValid}
          konfiguracia={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangeHandler.bind(this, "suma"),
            value: vlozeneHodnoty.suma.value,
          }}
        />
        <VydavokInput
          style={styles.rowInputContainer}
          popis="Datum"
          invalid={!vlozeneHodnoty.datum.isValid}
          konfiguracia={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: inputChangeHandler.bind(this, "datum"),
            value: vlozeneHodnoty.datum.value,
          }}
        />
      </View>

      <VydavokInput
        popis="Popis vydavku"
        invalid={!vlozeneHodnoty.popis.isValid}
        konfiguracia={{
          multiline: true,
          autoCorrect: false,
          autoCapitalize: "none",
          onChangeText: inputChangeHandler.bind(this, "popis"),
          value: vlozeneHodnoty.popis.value,
        }}
      />

      {ulozenaPoloha && (
        <Tlacitko style={styles.fullWidthButton} onPress={zobrazMapuHandler}>
          Zobrazit na mape
        </Tlacitko>
      )}

      {formularIsInvalid && (
        <Text style={styles.errorText}>
          Neplatne vstupy - skontrolujte svoje udaje!
        </Text>
      )}

      <View style={styles.buttons}>
        <Tlacitko style={styles.button} onPress={cancelHandler}>
          Cancel
        </Tlacitko>
        <Tlacitko style={styles.button} onPress={editujHandler}>
          {buttonLabel}
        </Tlacitko>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInputContainer: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  fullWidthButton: {
    marginHorizontal: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
});
