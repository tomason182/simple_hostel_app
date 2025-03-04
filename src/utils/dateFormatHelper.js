export function dateFormatHelper(date) {
  return date.split("T")[0].split("-").join("");
}

const d = dateFormatHelper("2025-03-01T00:00:00.000Z");
console.log(d);
