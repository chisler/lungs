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

export const getInstanceMatrix = (instanceMap, references) => {
  const numberOfInstances = Object.keys(instanceMap).length;
  let instanceMatrix = getZeroMatrix([numberOfInstances, numberOfInstances]);

  const getLanguageId = (instanceMap, name) => {
    return instanceMap[name].id;
  };

  let referralLanguageId;
  let referencedLanguageId;

  references.forEach(reference => {
    referralLanguageId = getLanguageId(
      instanceMap,
      reference.referral.join(".")
    );
    referencedLanguageId = getLanguageId(
      instanceMap,
      reference.value.join(".")
    );

    instanceMatrix[referralLanguageId][referencedLanguageId]++;
  });

  // Link to itself is added to nodes without links
  const anyReference = (i, instanceMatrix) => {
    return instanceMatrix[i].some(Boolean);
  };
  for (let i in instanceMatrix) {
    if (!anyReference(i, instanceMatrix)) {
      instanceMatrix[i][i] += 1;
    }
  }

  return instanceMatrix;
};
