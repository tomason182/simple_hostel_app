export default function passwordValidator(password) {
  const minLength = 8;
  const minLowerCase = 1;
  const minUpperCase = 1;
  const minNumbers = 1;
  const minSymbols = 1;

  const lowerCaseCount = (password.match(/[a-z]/g) || []).length;
  const upperCaseCount = (password.match(/[A-Z]/g) || []).length;
  const numbersCount = (password.match(/[0-9]/g) || []).length;
  const symbolsCount = (password.match(/[^A-Za-z0-9\s]/g) || []).length;
  const hasWhiteSpaces = /\s/.test(password);

  let isValid = true;
  switch (isValid) {
    case password.length < minLength:
      isValid = false;
      break;
    case lowerCaseCount < minLowerCase:
      isValid = false;
      break;
    case upperCaseCount < minUpperCase:
      isValid = false;
      break;
    case numbersCount < minNumbers:
      isValid = false;
      break;
    case symbolsCount < minSymbols:
      isValid = false;
      break;
    case hasWhiteSpaces:
      isValid = false;
      break;
    default:
      isValid = true;
  }
  return isValid;
}
