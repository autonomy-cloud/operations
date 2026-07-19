import { JSONArray, JSONObject, JSONValue } from "../../../Types/JSON";

/*
 * Resource-attribute prefix that promotes a key/value pair into a
 * project Label. `cast-operations.label.team=payments` becomes a label
 * named `team:payments` on the host and service that emitted the
 * resource.
 */
export const CAST_OPERATIONS_LABEL_ATTRIBUTE_PREFIX: string =
  "cast-operations.label.";

/*
 * Label.name is a ShortText column (255). We keep a tighter cap so
 * runaway attribute values can't blow out the label table with very
 * long auto-generated names — beyond this length the label stops
 * being useful as a UI tag anyway.
 */
const MAX_LABEL_NAME_LENGTH: number = 100;

/**
 * Walk a list of OTel resource attributes and return label names for
 * any keys prefixed with `cast-operations.label.`. Labels are returned in
 * `<dimension>:<value>` form so two attributes with the same value
 * but different dimensions (e.g. `cast-operations.label.team=prod`,
 * `cast-operations.label.env=prod`) don't collapse together.
 *
 * Empty values, non-string values, and pure-whitespace values are
 * skipped. Names are deduped and trimmed; nothing past
 * MAX_LABEL_NAME_LENGTH is preserved.
 */
export function extractOperationsLabelNames(
  attributes: JSONArray | undefined,
): Array<string> {
  if (!attributes || !Array.isArray(attributes) || attributes.length === 0) {
    return [];
  }

  const seen: Set<string> = new Set();

  for (const attribute of attributes) {
    const attr: JSONObject = (attribute as JSONObject) || {};
    const key: JSONValue = attr["key"];

    if (
      typeof key !== "string" ||
      !key.startsWith(CAST_OPERATIONS_LABEL_ATTRIBUTE_PREFIX)
    ) {
      continue;
    }

    const dimension: string = key
      .substring(CAST_OPERATIONS_LABEL_ATTRIBUTE_PREFIX.length)
      .trim();
    if (!dimension) {
      continue;
    }

    const valueWrapper: JSONObject =
      (attr["value"] as JSONObject | undefined) || {};
    const stringValue: JSONValue = valueWrapper["stringValue"];
    if (typeof stringValue !== "string") {
      continue;
    }

    const value: string = stringValue.trim();
    if (!value) {
      continue;
    }

    let labelName: string = `${dimension}:${value}`;
    if (labelName.length > MAX_LABEL_NAME_LENGTH) {
      labelName = labelName.substring(0, MAX_LABEL_NAME_LENGTH);
    }

    seen.add(labelName);
  }

  return Array.from(seen);
}
