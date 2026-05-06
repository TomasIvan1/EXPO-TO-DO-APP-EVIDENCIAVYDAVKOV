import { Alert } from "react-native";
import { useState } from "react";
import * as Location from "expo-location";

const PRESNA_AKURATNOST_V_METROCH = 20;
const MAX_STARNUTIE_POLOHY_MS = 10000;
const MAX_CAKANIE_NA_UPRESNENIE_MS = 20000;

async function vyziadajPovolenie() {
  const permissionResult = await Location.requestForegroundPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert(
      "Povolenie chybajuce",
      "Aplikacia potrebuje polohu, aby vedela priradit miesto k vydavku."
    );
    return false;
  }

  return true;
}

function prevedNaPoloha(location) {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

function jeDostatocnePresna(location) {
  return (
    typeof location?.coords?.accuracy === "number" &&
    location.coords.accuracy <= PRESNA_AKURATNOST_V_METROCH
  );
}

function jeDostatocneCersta(location) {
  return (
    typeof location?.timestamp === "number" &&
    Date.now() - location.timestamp <= MAX_STARNUTIE_POLOHY_MS
  );
}

function jePouzitelnaPoloha(location) {
  return jeDostatocneCersta(location) && jeDostatocnePresna(location);
}

function vyberPresnejsiuPolohu(prvaPoloha, druhaPoloha) {
  if (!prvaPoloha) {
    return druhaPoloha;
  }

  if (!druhaPoloha) {
    return prvaPoloha;
  }

  const presnostPrvej =
    typeof prvaPoloha?.coords?.accuracy === "number"
      ? prvaPoloha.coords.accuracy
      : Number.POSITIVE_INFINITY;
  const presnostDruhej =
    typeof druhaPoloha?.coords?.accuracy === "number"
      ? druhaPoloha.coords.accuracy
      : Number.POSITIVE_INFINITY;

  return presnostDruhej < presnostPrvej ? druhaPoloha : prvaPoloha;
}

async function ziskajAktualnyFix() {
  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.BestForNavigation,
    mayShowUserSettingsDialog: true,
  });
}

async function pockajNaPresnejsiuPolohu(vychodziaPoloha = null) {
  return new Promise((resolve) => {
    let subscription = null;
    let timeoutId = null;
    let najlepsiaPoloha = vychodziaPoloha;

    const cleanup = (value) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (subscription) {
        subscription.remove();
      }

      resolve(value);
    };

    timeoutId = setTimeout(
      () => cleanup(najlepsiaPoloha),
      MAX_CAKANIE_NA_UPRESNENIE_MS
    );

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
        mayShowUserSettingsDialog: true,
      },
      (location) => {
        najlepsiaPoloha = vyberPresnejsiuPolohu(najlepsiaPoloha, location);

        if (jeDostatocnePresna(location)) {
          cleanup(location);
        }
      }
    )
      .then(async (createdSubscription) => {
        subscription = createdSubscription;

        try {
          const aktualnaPoloha = await ziskajAktualnyFix();
          najlepsiaPoloha = vyberPresnejsiuPolohu(
            najlepsiaPoloha,
            aktualnaPoloha
          );

          if (jeDostatocnePresna(aktualnaPoloha)) {
            cleanup(aktualnaPoloha);
          }
        } catch (error) {
          // Watch subscription can still refine the location even if this call fails.
        }
      })
      .catch(() => cleanup(najlepsiaPoloha));
  });
}

export default function useGeolokacia(initialPoloha = null) {
  const [vybranaPoloha, setVybranaPoloha] = useState(initialPoloha);

  async function ziskajAktualnuPolohu() {
    try {
      const maPovolenie = await vyziadajPovolenie();

      if (!maPovolenie) {
        return null;
      }

      const suZapnuteSluzby = await Location.hasServicesEnabledAsync();

      if (!suZapnuteSluzby) {
        Alert.alert(
          "Zapni polohu",
          "Na zariadeni je vypnute GPS. Zapni sluzby polohy a skus to znova."
        );
        return null;
      }

      try {
        await Location.enableNetworkProviderAsync();
      } catch (error) {
        // On some devices/emulators this is unsupported; continue with fallbacks.
      }

      try {
        const providerStatus = await Location.getProviderStatusAsync();

        if (!providerStatus.gpsAvailable && !providerStatus.networkAvailable) {
          Alert.alert(
            "Poloha nie je dostupna",
            "Zariadenie nema dostupny GPS ani sietovu polohu."
          );
          return null;
        }
      } catch (error) {
        // Some platforms may not expose the full provider status.
      }

      let location = null;

      try {
        location = await ziskajAktualnyFix();
      } catch (error) {
        location = null;
      }

      if (!jePouzitelnaPoloha(location)) {
        const presnejsiaPoloha = await pockajNaPresnejsiuPolohu(location);

        if (presnejsiaPoloha) {
          location = vyberPresnejsiuPolohu(location, presnejsiaPoloha);
        }
      }

      if (!jePouzitelnaPoloha(location)) {
        try {
          const poslednaZnamaPoloha = await Location.getLastKnownPositionAsync({
            maxAge: MAX_STARNUTIE_POLOHY_MS,
            requiredAccuracy: PRESNA_AKURATNOST_V_METROCH,
          });

          if (jePouzitelnaPoloha(poslednaZnamaPoloha)) {
            location = vyberPresnejsiuPolohu(location, poslednaZnamaPoloha);
          }
        } catch (error) {
          // Last known position is only a final fallback.
        }
      }

      if (!jePouzitelnaPoloha(location)) {
        const presnost =
          typeof location?.coords?.accuracy === "number"
            ? ` Posledna presnost bola asi ${Math.round(location.coords.accuracy)} m.`
            : "";

        Alert.alert(
          "Nepodarilo sa spresnit polohu",
          `Aplikacia nenasla dostatocne presnu aktualnu polohu.${presnost} Pockaj chvilu na GPS signal a skus to znova.`
        );
        return null;
      }

      const novaPoloha = prevedNaPoloha(location);

      setVybranaPoloha(novaPoloha);
      return novaPoloha;
    } catch (error) {
      Alert.alert(
        "Nepodarilo sa nacitat polohu",
        "Skus to este raz alebo skontroluj, ci ma zariadenie zapnute urcovanie polohy."
      );
      return null;
    }
  }

  function vymazPolohu() {
    setVybranaPoloha(null);
  }

  return {
    vybranaPoloha,
    ziskajAktualnuPolohu,
    vymazPolohu,
  };
}
