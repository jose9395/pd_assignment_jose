import dotenv from "dotenv";
import { pipedriveApi } from "./api/pipeDriveApi";
import { buildPersonPayload } from "./utils/buildPersonPayload";
import { getNestedValue } from "./utils/getNestedValue";
import inputDataJson from "./mappings/inputData.json";
import mappings from "./mappings/mappings.json";
import type { InputData } from "./types/inputData";
import type { PipedrivePerson } from "./types/pipedrive";

dotenv.config();

const inputData = inputDataJson as InputData;

export const syncPdPerson = async (): Promise<PipedrivePerson> => {
  try {
    //  Build Payload
    const payload = buildPersonPayload(inputData);

    //  Get name field
    const nameField = mappings.find((m) => m.pipedriveKey === "name");
    if (!nameField) throw new Error("Name mapping missing.");

    const personName = getNestedValue(inputData, nameField.inputKey);
    if (!personName) throw new Error("Name value missing in input.");

    // Search existing person
    let searchRes;
    try {
      searchRes = await pipedriveApi.searchPerson(personName);
    } catch (err) {
      throw new Error(
        "Failed while searching person in Pipedrive"
      );
    }

    const items = searchRes?.data?.data?.items || [];
    const existingPerson = items.length ? items[0].item : null;

    // If exists, update
    if (existingPerson) {
      try {
        const updateRes = await pipedriveApi.updatePerson(
          existingPerson.id,
          payload
        );
        console.log("Person Updated");
        return updateRes.data.data;
      } catch (err) {
        throw new Error(
          `Failed to update Pipedrive person (ID: ${existingPerson.id})`
        );
      }
    }

    // Else create new person
    try {
      const createRes = await pipedriveApi.createPerson(payload);
      console.log("Person Created");
      return createRes.data.data;
    } catch (err) {
      throw new Error("Failed to create person in Pipedrive");
    }
  } catch (err) {
    console.error("FINAL ERROR: Something went wrong");
    throw err;
  }
};

// Run
syncPdPerson().then((data) => console.log("Final synced person:", data));
