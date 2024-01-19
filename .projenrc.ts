import { typescript } from "projen";
import { Jest, NodePackageManager, Transform } from "projen/lib/javascript";
import {
  VsCode,
  VsCodeRecommendedExtensions,
  VsCodeSettings,
} from "projen/lib/vscode";
import { JsiiFaker } from "./src/jsii-faker";

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "jsii-faker",
  packageName: "@sumoc/jsii-faker",
  description: "Synthisize a minimal JSII file for Projen typescript projects.",
  projenrcTs: true,

  // Use Prettier
  prettier: true,

  // Use PNPM
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: "8",

  // configured below
  jest: false,

  /**
   * Some of these should probably be peer deps or something else.
   */
  deps: ["@jsii/spec", "projen", "constructs", "type-fest@^4"],
});

/*******************************************************************************
 *
 * Manually configure Jest.
 *
 ******************************************************************************/

// add type and ts-jest support
project.addDevDeps(`@types/jest`);
project.addDevDeps(`ts-jest`);

// don't package test files
project.addPackageIgnore("*.spec.d.ts");
project.addPackageIgnore("*.spec.js");

// configure jest
new Jest(project, {
  // jest.config.json file instead of inline
  configFilePath: "jest.config.json",
  jestConfig: {
    // tests are next to source, not hidden in test folder
    roots: [`<rootDir>/${project.srcdir}`],
    testMatch: ["**/*.spec.ts"],
    // other presets
    preset: "ts-jest",
    transform: {
      ["^.+\\.ts?$"]: new Transform("ts-jest"),
    },
    moduleFileExtensions: ["js", "ts"],
  },
});

/*******************************************************************************
 *
 * VS Code
 *
 ******************************************************************************/

// configure vs code
const vscode = new VsCode(project);

// VSCODE: Root level editor settings
const vsSettings = new VsCodeSettings(vscode);
vsSettings.addSetting("editor.tabSize", 2);
vsSettings.addSetting("editor.bracketPairColorization.enabled", true);
vsSettings.addSetting("editor.guides.bracketPairs", "active");
vsSettings.addSetting("editor.rulers", [80, 120]);

// use eslint to fix files for typescript files only
vsSettings.addSetting(
  "editor.codeActionsOnSave",
  { "source.fixAll.eslint": "explicit" },
  "typescript",
);

// make sure each directory's eslint is found properly.
vsSettings.addSetting("eslint.workingDirectories", [{ mode: "auto" }]);

// VSCODE: extensions
const vsExtensions = new VsCodeRecommendedExtensions(vscode);
vsExtensions.addRecommendations("dbaeumer.vscode-eslint");

/*******************************************************************************
 *
 * JSII REGISTRATION
 *
 * Dogfooding as a simple outside test. This adds "FakeProject" to the .jsii
 * file and enables the following syntax to work:
 *
 * `npx projen new --from @sumoinc/jsii-faker fake`
 *
 ******************************************************************************/

const jsii = new JsiiFaker(project);
["FakeProject"].forEach((name) => jsii.addClassType({ name }));

/*******************************************************************************
 *
 * Final Synth
 *
 ******************************************************************************/

project.synth();
