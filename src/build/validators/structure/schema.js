export default {
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
        creator: { type: "string" },
        description: { type: "string" },
        people: { type: "array", items: { type: "string" } },
        features: { $ref: "/#/definitions/features" },
        influenced_by: {
          $ref: "/#/definitions/references/anyReference"
        },
        influenced: {
          $ref: "/#/definitions/references/anyReference"
        },
      },
      required: ["name"]
    },
    features: {
      type: "object",
      description: "Wrapper for feature items.",
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
        description: { type: "string" },
        invented: { type: "boolean" },
        inspired_by: {
          $ref: "/#/definitions/references/anyReference"
        },
        predated_by: {
          $ref: "/#/definitions/references/anyReference"
        },
        justified_by: {
          $ref: "/#/definitions/references/anyReference"
        }
      },
      required: ["description"]
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
      singleAnyReference: {
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
