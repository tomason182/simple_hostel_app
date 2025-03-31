export function dateFormatHelper(date) {
  let d = date;

  if (d instanceof Date) {
    d = date.toISOString();
  }

  return d.split("T")[0].split("-").join("");
}

export function formateDateToLocale(date) {
  const language =
    localStorage.getItem("i18nextLng") || navigator.language || "en";
  // remove the Z from date
  const formattedDate = new Date(date.slice(0, date.length - 1));
  return new Intl.DateTimeFormat(language, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(formattedDate);
}
