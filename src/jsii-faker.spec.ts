import * as spec from "@jsii/spec";
import { FakeProject } from "./fake-project";
import { JsiiFaker } from "./jsii-faker";
import { synthFiles } from "./test-utils";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const { faker } = buildFakeProject();
    expect(faker).toBeTruthy();
  });
});

describe("Files", () => {
  test("Smoke test", () => {
    const { project } = buildFakeProject();

    const content = synthFiles(project);
    expect(content[".jsii"]).toBeTruthy();
    expect(content[".jsii"]).toMatchSnapshot();

    //console.log(content[".jsii"]);
  });

  test("Assembly name should match package name", () => {
    const { project } = buildFakeProject();

    const files = synthFiles(project);
    const content = JSON.parse(files[".jsii"]) as spec.Assembly;
    expect(content.name).toBe("@my-scope/myproject");

    //console.log(content);
  });
});

/**
 * Testing helper
 */
const buildFakeProject = () => {
  const project = new FakeProject({
    name: "my-project",
    packageName: "@my-scope/myproject",
    defaultReleaseBranch: "main",
  });

  const faker = new JsiiFaker(project);
  faker.addClassType({
    name: "FooProject",
  });
  return { project, faker };
};
