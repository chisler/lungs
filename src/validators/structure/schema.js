export default {
    "$schema": "http://jsonObj-schema.org/draft-04/schema#",
    "type": "object",
    "patternProperties": {
        "^[a-zA-Z]": {"$ref": "/#/definitions/language"},
    },
    "definitions": {
        "language": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "creator": {"type": "string"},
                "description": {"type": "string"},
                "people": {"type": "array", "items": {"type": "string"}},
                "features": {"$ref": "/#/definitions/features"}
            },
            "required": ["name", "creator", "people", "features"],
        },
        "features": {
            "type": "object",
            "description": "Wrapper for feature items.",
            "patternProperties": {
                "^[a-zA-Z]+": {
                    "$ref": "/#/definitions/feature"
                }
            },
            "additionalProperties": false
        },
        "feature": {
            "type": "object",
            "description": "Feature on one programming language",
            "properties": {
                "description": {"type": "string"},
                "inspired_by": {
                    "$ref": "/#/definitions/reference"
                },
            },
            "required": ["description", "inspired_by"]
        },
        "reference": {
            "type": "string",
            "description": "Reference of programming language or feature: language.features.f1"
        }
    }
}
