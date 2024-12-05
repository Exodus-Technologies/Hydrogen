'use strict';

export const removeSpaces = str => {
  return str.toString().replace(/\s+/g, '');
};

export const removeSpecialCharacters = str => {
  return str.toString().replace(/[^a-zA-Z ]/g, '');
};

export const capitalizeFirstLetter = str => {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};
