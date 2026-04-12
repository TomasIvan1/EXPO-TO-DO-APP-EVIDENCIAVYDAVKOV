import { Alert } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

async function vyziadajPovolenie(requestPermission, chybaText) {
  const permissionResult = await requestPermission();

  if (!permissionResult.granted) {
    Alert.alert("Povolenie chybajuce", chybaText);
    return false;
  }

  return true;
}

function spracujAsset(asset) {
  if (asset?.base64) {
    const mimeType = asset.mimeType || "image/jpeg";
    return `data:${mimeType};base64,${asset.base64}`;
  }

  return asset?.uri ?? null;
}

export default function useCamera(initialFotkaUri = null) {
  const [fotkaUri, setFotkaUri] = useState(initialFotkaUri);

  async function otvorPicker(picker, requestPermission, chybaText) {
    const maPovolenie = await vyziadajPovolenie(requestPermission, chybaText);

    if (!maPovolenie) {
      return null;
    }

    const result = await picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) {
      return null;
    }

    const novaFotkaUri = spracujAsset(result.assets[0]);
    setFotkaUri(novaFotkaUri);
    return novaFotkaUri;
  }

  function odfotit() {
    return otvorPicker(
      ImagePicker.launchCameraAsync,
      ImagePicker.requestCameraPermissionsAsync,
      "Aplikacia potrebuje povolenie ku kamere, aby vedela odfotit vydavok."
    );
  }

  function vybratZGalerie() {
    return otvorPicker(
      ImagePicker.launchImageLibraryAsync,
      ImagePicker.requestMediaLibraryPermissionsAsync,
      "Aplikacia potrebuje pristup ku galerii, aby vedela vybrat fotku vydavku."
    );
  }

  function odstranFotku() {
    setFotkaUri(null);
  }

  return {
    fotkaUri,
    odfotit,
    vybratZGalerie,
    odstranFotku,
  };
}
