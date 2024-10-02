import type { Adapter } from "../../../types";
import { filterByPrefixKey } from "../utils";
import { readFile } from "node:fs/promises";
import YAML from "yaml";

export type YamlAdapterProps = {
  path: string;
  prefixKey?: string;
  silent?: boolean;
};

const ADAPTER_NAME = "yaml adapter";

export const yamlAdapter = ({ path, prefixKey, silent }: YamlAdapterProps): Adapter => {
  return {
    name: ADAPTER_NAME,
    read: async () => {
      try {
        const data = await readFile(path, "utf-8");

        const parsedData = YAML.parse(data) || {};

        if (prefixKey) {
          return filterByPrefixKey(parsedData, prefixKey);
        }

        return parsedData;
      } catch (error) {
        throw new Error(
          `Failed to parse / read YAML file at ${path}: ${
            error instanceof Error ? error.message : error
          }`,
        );
      }
    },
    silent,
  };
};
