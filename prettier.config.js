//- tabWidth: The number of spaces per tab. Default is 2.
//- singleQuote: Use single quotes instead of double quotes. Default is false.
//- trailingComma: Add trailing commas wherever possible. Default is "none".
//- semi: Use semicolons at the end of statements. Default is true.
//- jsxSingleQuote: Use single quotes instead of double quotes in JSX. Default is false.
//- jsxBracketSameLine: Put the > of a multi-line JSX element at the end of the last line
//- docs: https://prettier.io/docs/en/options.html

module.exports = {
  plugins: [require("prettier-plugin-tailwindcss")],
  printWidth: 80,
  tabWidth: 2,
  singleQuote: false,
  trailingComma: "es5",
  semi: true,
  jsxSingleQuote: false,
  jsxBracketSameLine: false,
};
