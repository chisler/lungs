//Input: [1, 2]
//Output: [[0], [0]]
const getEMatrix = dimensions => {
  let matrix = getZeroMatrix(dimensions);

  for (let i in matrix) {
    matrix[i][i] = 1;
  }

  return matrix;
};

const getZeroMatrix = dimensions => {
  let array = [];
  for (let i = 0; i < dimensions[0]; ++i) {
    array.push(
      dimensions.length === 1 ? 0 : getZeroMatrix(dimensions.slice(1))
    );
  }
  return array;
};

export const getLanguageMatrix = (languageMap, references) => {
  console.log(languageMap, references);
  const numberOfLanguages = Object.keys(languageMap).length;
  let languageMatrix = getZeroMatrix([numberOfLanguages, numberOfLanguages]);

  const getLanguageId = (languageMatrix, name) => {
    return languageMap[name].id;
  };

  let referralLanguageId;
  let referencedLanguageId;

  references.forEach(reference => {
    referralLanguageId = getLanguageId(
      languageMap,
      reference.referral.join(".")
    );
    referencedLanguageId = getLanguageId(
      languageMap,
      reference.value.join(".")
    );

    languageMatrix[referralLanguageId][referencedLanguageId]++;
  });

  // Link to itself is added to nodes without links
  const anyReference = (i, languageMatrix) => {
    return languageMatrix[i].some(Boolean);
  };
  for (let i in languageMatrix) {
    if (!anyReference(i, languageMatrix)) {
      languageMatrix[i][i] += 1;
    }
  }

  return languageMatrix;
};
