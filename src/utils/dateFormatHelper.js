export function dateFormatHelper(date) {
  return date.split("T")[0].split("-").join("");
}

export function formateDateToLocale(date) {
  const language = navigator.language || "en";
  // remove the Z from date
  const formattedDate = new Date(date.slice(0, date.length - 1));
  return new Intl.DateTimeFormat(language, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(formattedDate);
}
