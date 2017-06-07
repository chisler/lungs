import { validateYamlString } from '../helpers/validate-yaml-string'
import { validateCustomSchemaClosure } from "../validators/structure/validator";

const testSchema = {
  $schema: "http://jsonObj-schema.org/draft-04/schema#",
  type: "object",
  patternProperties: {
    "^[a-zA-Z]": { $ref: "/#/definitions/language" }
  },
  definitions: {
    language: {
      type: "object",
      properties: {
        name: { type: "string" },
        features: { $ref: "/#/definitions/features" }
      }
    },
    features: {
      type: "object",
      patternProperties: {
        "^[a-zA-Z]+": {
          $ref: "/#/definitions/feature"
        }
      },
      additionalProperties: false
    },
    feature: {
      type: "object",
      description: "Feature on one programming language",
      properties: {
        inspired_by: {
          $ref: "/#/definitions/references/anyReference"
        }
      }
    },
    references: {
      anyReference: {
        anyOf: [
          { $ref: "/#/definitions/references/singleAnyReference" },
          { $ref: "/#/definitions/references/arrayAnyReference" }
        ],
        validDestinations: ["/#/definitions/feature", "/#/definitions/language"]
      },
      arrayAnyReference: {
        type: "array",
        items: { $ref: "/#/definitions/references/singleAnyReference" },
        validDestinations: ["/#/definitions/feature", "/#/definitions/language"]
      },
      anyReference: {
        anyOf: [
          { $ref: "/#/definitions/references/languageReference" },
          { $ref: "/#/definitions/references/featureReference" }
        ],
        validDestinations: ["/#/definitions/feature", "/#/definitions/language"]
      },
      languageReference: {
        type: "string",
        description: "Reference of programming language",
        validDestinations: ["/#/definitions/language"]
      },
      featureReference: {
        type: "string",
        description: "Reference of feature: language.features.f1",
        validDestinations: ["/#/definitions/feature"]
      }
    }
  }
};

test("Checks no errors case", () => {
  expect(validateYamlString(testJsonObj1, testYaml1)).toEqual(
    expectedObj1
  );
});