import * as spec from "@jsii/spec";
import { Component, JsonFile } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { ValueOf } from "type-fest";

const ProjenBaseFqn = {
  TYPESCRIPT_PROJECT: "projen.typescript.TypeScriptProject",
  TYPESCRIPT_PROJECT_OPTIONS: "projen.typescript.TypeScriptProjectOptions",
} as const;

export interface ClassTypeOptions {
  /**
   * The name of the class.
   *
   * @example "MyProject"
   */
  name: string;

  /**
   * The FQN for the base class this class is extending.
   *
   * @default ProjenBaseFqn.TYPESCRIPT_PROJECT
   */
  baseFqn?: ValueOf<typeof ProjenBaseFqn> | string;

  /**
   * The FQN for the options for this class.
   *
   * @default ProjenBaseFqn.TYPESCRIPT_PROJECT_OPTIONS
   */
  optionsFqn?: ValueOf<typeof ProjenBaseFqn> | string;
}

export class JsiiFaker extends Component {
  // find project singleton
  public static of(project: TypeScriptProject): JsiiFaker | undefined {
    const isDefined = (c: Component): c is JsiiFaker => c instanceof JsiiFaker;
    return project.components.find(isDefined);
  }

  private _assemblyName: string;
  private _types: { [name: string]: spec.Type } = {};

  constructor(public readonly project: TypeScriptProject) {
    super(project);

    /**
     * In JSII, the assembly name is essentially the package name. It's used as a
     * scope when targeting types and metadata in other "jsii assemblies" that
     * might be in sub-packages used by the project.
     *
     * For this case, we'll just use the pachage name from Projen.
     */
    this._assemblyName = this.project.package.packageName;

    new JsonFile(project, ".jsii", {
      obj: () => {
        return {
          name: this._assemblyName,
          types: this._types,
        };
      },
    });
  }

  public toJSON = () => {
    return {
      types: this._types,
    };
  };

  public addClassType(options: ClassTypeOptions) {
    const fqn = [this._assemblyName, options.name].join(".");
    const type: spec.ClassType = {
      assembly: this._assemblyName,
      base: options.baseFqn ?? ProjenBaseFqn.TYPESCRIPT_PROJECT,
      fqn,
      kind: spec.TypeKind.Class,
      name: options.name,
      initializer: {
        parameters: [
          {
            name: "options",
            type: {
              fqn:
                options.optionsFqn ?? ProjenBaseFqn.TYPESCRIPT_PROJECT_OPTIONS,
            },
          },
        ],
      },
    };

    this._types[fqn] = type;
  }
}
