import validateProjectSchema, { validateCustomSchema } from "./validator";
import parseYaml from "../../parser/yaml";

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
        description: { type: "string" }
      },
      required: ["name"]
    }
  }
};

// No errors

const testYaml1 = `kotlin:
  name: Kotlin
`;
const testJsonObj1 = parseYaml(testYaml1).jsonObj;

const expectedObj1 = {
  docModel: {
    base: "/",
    value: {
      kotlin: {
        base: "/#/definitions/language",
        value: {
          name: {
            base: "/",
            value: "Kotlin"
          }
        }
      }
    }
  },
  errors: []
};

test("Checks no errors case", () => {
  expect(validateCustomSchema(testJsonObj1, testYaml1, testSchema)).toEqual(
    expectedObj1
  );
});

// Required field error

const testYaml2 = `kotlin:
  description: Test
`;

const testJsonObj2 = parseYaml(testYaml2).jsonObj;

test("Validates required fields existance", () => {
  expect(
    validateCustomSchema(testJsonObj2, testYaml2, testSchema).errors
  ).toEqual([
    { line: 1, message: 'kotlin requires property "name"', scope: "schema" }
  ]);
});

// Required field error

const testYaml3 = `kotlin:
  name: Kotlin
  description: 1
`;

const testJsonObj3 = parseYaml(testYaml3).jsonObj;

test("Validates field type", () => {
  expect(
    validateCustomSchema(testJsonObj3, testYaml3, testSchema).errors
  ).toEqual([
    {
      line: 3,
      message: "kotlin.description is not of a type(s) string",
      scope: "schema"
    }
  ]);
});
