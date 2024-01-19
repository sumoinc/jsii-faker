import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";

export class FakeProject extends TypeScriptProject {
  constructor(options: TypeScriptProjectOptions) {
    super(options);
  }
}
