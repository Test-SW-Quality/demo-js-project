const isLongEnough = (password) => password.length >= 8 || 'Password must be at least 8 characters long.';
const hasUppercase = (password) => /[A-Z]/.test(password) || 'Password must contain at least one uppercase letter.';
const hasLowercase = (password) => /[a-z]/.test(password) || 'Password must contain at least one lowercase letter.';
const hasNumber = (password) => /[0-9]/.test(password) || 'Password must contain at least one number.';
const hasSpecialChar = (password) =>
  /[!@#$%^&*]/.test(password) || 'Password must contain at least one special character.';

export const validatePassword = (password) => {
  const validators = [isLongEnough, hasUppercase, hasLowercase, hasNumber, hasSpecialChar];
  const errors = validators.map((validator) => validator(password)).filter((result) => result !== true);

  return errors.length === 0 ? false : errors;
};

export const encrypt = (plainText, key) => {
  let encryptedText = '';
  let keyIndex = 0;

  for (let i = 0; i < plainText.length; i++) {
    const currentChar = plainText[i];
    const keyChar = key[keyIndex];
    const keyCharCode = keyChar.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);

    if (currentChar.match(/[a-z]/i)) {
      const baseCode = currentChar.charCodeAt(0) >= 'a'.charCodeAt(0) ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
      const charCode = ((currentChar.charCodeAt(0) - baseCode + keyCharCode) % 26) + baseCode;
      encryptedText += String.fromCharCode(charCode);

      keyIndex = (keyIndex + 1) % key.length;
    } else {
      encryptedText += currentChar;
    }
  }

  return encryptedText;
};

export const decrypt = (encryptedText, key) => {
  let decryptedText = '';
  let keyIndex = 0;

  for (let i = 0; i < encryptedText.length; i++) {
    const currentChar = encryptedText[i];
    const keyChar = key[keyIndex];
    const keyCharCode = keyChar.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);

    if (currentChar.match(/[a-z]/i)) {
      const baseCode = currentChar.charCodeAt(0) >= 'a'.charCodeAt(0) ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
      const charCode = ((currentChar.charCodeAt(0) - baseCode - keyCharCode + 26) % 26) + baseCode;
      decryptedText += String.fromCharCode(charCode);

      keyIndex = (keyIndex + 1) % key.length;
    } else {
      decryptedText += currentChar;
    }
  }

  return decryptedText;
};
