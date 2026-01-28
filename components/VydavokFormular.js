import { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import VydavokInput from "./VydavokInput";
import Tlacitko from "./UI/Tlacitko";
import { GlobalStyles } from "../constant/styles";

export default function VydavokFormular({
  buttonLabel,
  cancelHandler,
  onSubmit,
  defaultValues,
}) {
  //const [ciastka, setCiastka] = useState("");
  // môžeme pridať ďalšie stavy pre dátum a popis a handler funkcie
  //elebo môžeme použiť jeden stav pre celý objekt výdavku, ako objekt

  // function sumaZmenaHandler(enteredCiastka) {
  //   console.log(enteredCiastka);
  //   setCiastka(enteredCiastka);
  // }

  const [vlozeneHodnoty, setVlozeneHodnoty] = useState({
    // zmeníne na objekt s hodnotami a validáciou
    suma: {
      value: defaultValues ? defaultValues.suma.toString() : "",
      isValid: true,
    },
    datum: {
      value: defaultValues
        ? defaultValues.datum.toISOString().slice(0, 10)
        : "",
      isValid: true,
    }, // formát YYYY-MM-DD slice 10 znakov
    popis: {
      value: defaultValues ? defaultValues.popis : "",
      isValid: true,
    },
  });

  //inputIdentifikator - identifikátor vstupu, napr. "ciastka", "datum", "popis"

  function inputChangeHandler(inputIdentifikator, enteredHodnota) {
    setVlozeneHodnoty((predosleVlozeneHodnoty) => {
      return {
        ...predosleVlozeneHodnoty,
        [inputIdentifikator]: { value: enteredHodnota, isValid: true },
      };
    });
  }

  function editujHandler() {
    const vydavokData = {
      suma: +vlozeneHodnoty.suma.value,
      datum: new Date(vlozeneHodnoty.datum.value),
      popis: vlozeneHodnoty.popis.value,
    };

    //valiácia dát
    const sumaIsValid = !isNaN(vydavokData.suma) && vydavokData.suma > 0;
    const datumIsValid = vydavokData.datum.toString() !== "Invalid Date";
    const popisIsValid = vydavokData.popis.trim().length > 0;

    if (!sumaIsValid || !datumIsValid || !popisIsValid) {
      // zobrazíme chybu užívateľovi
      //Alert.alert("Neplatné vstupy - skontrolujte svoje údaje!");
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
    // console.log(vydavokData);
    onSubmit(vydavokData);
  }

  // kontrola či je formulár neplatný a zobrazenie chybovej správy
  const formularIsInvalid =
    !vlozeneHodnoty.suma.isValid ||
    !vlozeneHodnoty.datum.isValid ||
    !vlozeneHodnoty.popis.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Výdavok</Text>
      <View style={styles.inputRow}>
        <VydavokInput
          style={styles.rowInputContainer}
          popis="Suma výdavku"
          invalid={!vlozeneHodnoty.suma.isValid}
          konfiguracia={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangeHandler.bind(this, "suma"),
            value: vlozeneHodnoty.suma.value,
          }}
        />
        <VydavokInput
          style={styles.rowInputContainer}
          popis="Dátum"
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
        popis="Popis výdavku"
        invalid={!vlozeneHodnoty.popis.isValid}
        konfiguracia={{
          multiline: true,
          autoCorrect: false,
          autoCapitalize: "none",
          onChangeText: inputChangeHandler.bind(this, "popis"),
          value: vlozeneHodnoty.popis.value,
        }}
      />
      {formularIsInvalid && (
        <Text style={styles.errorText}>
          Neplatné vstupy - skontrolujte svoje údaje!
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
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
});
