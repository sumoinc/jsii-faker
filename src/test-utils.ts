import { Project } from "projen";
import { synthSnapshot } from "projen/lib/util/synth";

/**
 * Helper to generate and return files.
 * Useful when trying to test the final output of generated files.
 */
export const synthFiles = (project: Project, filepath: string = ""): any => {
  const snapshot = synthSnapshot(project);
  // console.log(Object.keys(snapshot));
  const filtered = Object.keys(snapshot)
    .filter((path) => path.startsWith(filepath))
    .reduce(
      (obj, key) => {
        return {
          ...obj,
          [key]: snapshot[key],
        };
      },
      {} as { [key: string]: any },
    );
  return filtered;
};
