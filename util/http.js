import axios from "axios";

const FIREBASE_API_URL = "https://evidencia-vydavkov-1638b-default-rtdb.europe-west1.firebasedatabase.app";

function pripravVydavokData(vydavokData) {
    const poloha =
      vydavokData?.poloha &&
      Number.isFinite(Number(vydavokData.poloha.latitude)) &&
      Number.isFinite(Number(vydavokData.poloha.longitude))
        ? {
            latitude: Number(vydavokData.poloha.latitude),
            longitude: Number(vydavokData.poloha.longitude),
          }
        : null;

    return {
      suma: Number(vydavokData.suma),
      datum:
        vydavokData.datum instanceof Date
          ? vydavokData.datum.toISOString()
          : new Date(vydavokData.datum).toISOString(),
      popis: vydavokData.popis,
      fotkaUri: vydavokData.fotkaUri ?? null,
      poloha,
    };
}

export async function ulozVydavok(vydavokData) {
    const response = await axios.post(
      FIREBASE_API_URL + "/vydavky.json",
      pripravVydavokData(vydavokData)
    );
    return response.data.name;
}

export async function fetchVydavky() {
    const response = await axios.get(FIREBASE_API_URL + "/vydavky.json");
    const vydavky = [];
    console.log(response.data);
    if (!response.data) {
        return vydavky;
    }
    for (const key in response.data) {
        const poloha = response.data[key].poloha
          ? {
              latitude: Number(response.data[key].poloha.latitude),
              longitude: Number(response.data[key].poloha.longitude),
            }
          : null;

        const vydavokObj = {
            id: key,
            suma: response.data[key].suma,
            datum: new Date(response.data[key].datum),
            popis: response.data[key].popis,
            fotkaUri: response.data[key].fotkaUri ?? null,
            poloha,
        };
        vydavky.push(vydavokObj);
    }

    return vydavky;
}

export function aktualizujVydavok(id, vydavokData) {
  return axios.put(
    FIREBASE_API_URL + '/vydavky/' + id + '.json',
    pripravVydavokData(vydavokData)
  );
}

export function odstranVydavok(id) {
  return axios.delete(
    FIREBASE_API_URL + '/vydavky/' + id + '.json'
  );
}
