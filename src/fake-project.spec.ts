import { FakeProject } from "./fake-project";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new FakeProject({
      name: "my-project",
      packageName: "@my-scope/myproject",
      defaultReleaseBranch: "main",
    });
    expect(project).toBeTruthy();
  });
});
