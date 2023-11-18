exports.removeExtraSpaces = (str) => {
  if (typeof str === 'string') {
    str = str.trim();
    str = str.replace(/\s+/g, " ");
  }

  return str;
}

exports.createSlug = (str) => {
  str = exports.removeExtraSpaces(str);

  if (typeof str === 'string') {
    str = str.replace(/[^a-zA-Z0-9]/g, '-');
    str = str.toLowerCase();
  }

  return str;
}

exports.createSlugTitle = (str) => {
  let str1 = this.createSlug(str);
  return (str1 + (new Date()).getTime()); //add time in millisecond
}

exports.generatePassword = () => {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}