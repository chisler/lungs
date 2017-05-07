//Input: [1, 2]
//Output: [[0], [0]]
const getMatrixE = dimensions => {
  let array = [];
  for (let i = 0; i < dimensions[0]; ++i) {
    array.push(dimensions.length === 1 ? 0 : getMatrixE(dimensions.slice(1)));
  }
  return array;
};

export const getLanguageMatrix = (languageMap, references) => {
  console.log(languageMap, references)
  const numberOfLanguages = Object.keys(languageMap).length;
  let languageMatrix = getMatrixE([numberOfLanguages, numberOfLanguages]);

  const getLanguageId = (languageMatrix, name) => {
    return languageMap[name].id;
  };

  let referralLanguageId;
  let referencedLanguageId;

  references.forEach(reference => {
    referralLanguageId = getLanguageId(languageMap, reference.referral.join('.'));
    referencedLanguageId = getLanguageId(languageMap, reference.value.join('.'));

    languageMatrix[referralLanguageId][referencedLanguageId]++;
  });

  return languageMatrix;
};
