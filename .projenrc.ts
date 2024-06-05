import { typescript } from "projen";
import { NodePackageManager, Transform } from "projen/lib/javascript";
import { VsCode, VsCodeSettings } from "projen/lib/vscode";
import { JsiiFaker } from "./src/jsii-faker";

const authorName = "Cameron Childress";
const authorAddress = "cameronc@sumoc.com";
const repository = "https://github.com/sumoinc/jsii-faker";

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "jsii-faker",
  packageName: "@sumoc/jsii-faker",
  description: "Synthisize a minimal JSII file for Projen typescript projects.",
  projenrcTs: true,
  repository,
  authorName,
  authorOrganization: true,
  authorEmail: authorAddress,

  /**
   * Publish this library to NPM.
   */
  releaseToNpm: true,

  /**
   * Use Prettier for code formatting.
   */
  prettier: true,

  /**
   * Use PNPM instead of the default (Yarn).
   */
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: "9",

  /**
   * Keep Jest config in it's own file, and expect the tests to be next to the
   * code being tested instead of in a test directory.
   */
  jestOptions: {
    configFilePath: "jest.config.json",
    jestConfig: {
      roots: [`<rootDir>/src`],
      testMatch: [`**/*.spec.ts`],
      preset: "ts-jest",
      transform: {
        ["^.+\\.ts?$"]: new Transform("ts-jest"),
      },
      moduleFileExtensions: ["js", "ts"],
    },
  },

  /**
   * Don't generate sample code. Especially don't recreate the unused and
   * unwanted test directory.
   */
  sampleCode: false,

  /**
   * Some of these should probably be peer deps or something else.
   */
  deps: ["@jsii/spec", "projen", "constructs", "type-fest@^4"],
});

/**
 * Since we don't want our tests to live in the tests directory, we have to
 * tell the packaging process to ignore them in the main src directory instead.
 */
project.addPackageIgnore("*.spec.d.ts");
project.addPackageIgnore("*.spec.js");

/*******************************************************************************
 *
 * VS Code Configuration
 *
 * Create directory level settings for VS Code at the project root.
 *
 ******************************************************************************/

const vscode = new VsCode(project);
const vsSettings = new VsCodeSettings(vscode);

/**
 * Add some common formatting preferences to the project.
 */
vsSettings.addSetting("editor.tabSize", 2);
vsSettings.addSetting("editor.bracketPairColorization.enabled", true);
vsSettings.addSetting("editor.guides.bracketPairs", "active");
vsSettings.addSetting("editor.rulers", [80, 120]);

/**
 * Lint typescript files only. This avoids common VS Code slowdown problems
 * related to linting being scoped too widely in the project.
 */
vsSettings.addSetting(
  "editor.codeActionsOnSave",
  { "source.fixAll.eslint": "explicit" },
  "typescript",
);

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
