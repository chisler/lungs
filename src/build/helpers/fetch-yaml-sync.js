export const fetchYaml = () => {
  const link =
    "https://api.github.com/repos/languagesWiki/languageWiki/contents/languages.yml";
  let request = new XMLHttpRequest();
  request.open("GET", link, false); // `false` makes the request synchronous
  request.setRequestHeader("accept", "application/vnd.github.VERSION.raw");
  request.send(null);

  if (request.status === 200) {
    return request.responseText;
  }

  return "";
};
