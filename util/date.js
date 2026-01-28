export function getFormatovanyDatum(datum) {
  return `${datum.getDate()}.${datum.getMonth() + 1}.${datum.getFullYear()}`;
}
