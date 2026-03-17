class SmallFunctions {
  static truncateText(text, maxLength = 100) {
    return text.length > maxLength
      ? text.substring(0, maxLength)
      : text;
  }
}

module.exports = { SmallFunctions };
