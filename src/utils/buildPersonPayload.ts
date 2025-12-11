import { getNestedValue } from "./getNestedValue";
import { PipedrivePersonPayload } from "../types/payload";
import type { InputData } from "../types/inputData";
import mappings from "../mappings/mappings.json";

export const buildPersonPayload = (input: InputData): PipedrivePersonPayload => {
  const payload: PipedrivePersonPayload = {};

  for (const map of mappings) {
    const { pipedriveKey, inputKey } = map;
    const value = getNestedValue(input, inputKey);

    if (!value) continue;

    if (pipedriveKey === "email") {
      payload.email = [{ value, primary: true }];
    } else if (pipedriveKey === "phone") {
      payload.phone = [{ value, primary: true }];
    } else {
      payload[pipedriveKey] = value;
    }
  }

  return payload;
};

// Builds the Pipedrive payload by mapping input fields to Pipedrive keys.