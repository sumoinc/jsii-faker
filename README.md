# jsii Faker

This is a proof of concept Projen Component that builds a minimal `.jsii` file in the root of a Typescript based Projen project. The resulting file only includes the metadata that is required to support init as a new project using syntax similar like

 `npx projen new --from @my-scope/my-package my-project-type` syntax.

> [!CAUTION]
> Despite it's usefulness, this entire package is possibly a terrible idea. It breaks a lot of rules and standards for `jsii`, and should be considered pre-alpha.
 

## What's jsii?

> [!NOTE]
> [`jsii`](https://github.com/aws/jsii) allows code in any language to naturally interact with JavaScript classes. It is the technology that enables the
[AWS Cloud Development Kit](https://github.com/aws/aws-cdk) to deliver polyglot libraries from a single codebase!

When you run `npx projen new --from @scope/pacakge`, Projen will reach out to to NPM registry and use the `.jsii` file to build an [inventory](https://github.com/projen/projen/blob/main/src/inventory.ts) of project types you can create using that package.

## Why not use Projen's existing [JsiiProject](https://projen.io/docs/api/cdk/#jsiiproject-) type?

To ensure that jsii modules can be exported to a variety of other languages such as Java and C#, the jsii standard [imposes some fairly significant limitations](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/) on your Typescript. These limitations have good and legitimate reasons for existing! This means that any projects created using the JsiiProject project type also have to follow these rules.


## How to Use 

Minimally you can use this library to register Projen project types into a local `.jsii` file in your project by adding this code to your `.projenrc.ts`` file:

```ts
const jsii = new JsiiFaker(project);
jsii.addClassType({ name: "FakeProject" });
```

## Limitations
This is an initial proof of concept.

- Only Projects that extend `TypeScriptProject` and accept `TypeScriptProjectOptions` are supported.
- This package does not currently allow custom options to be added to the `.jsii` file.

## Other Caveats

What you are missing by not using the projen built in JsiiProject type:
 
- No automaticly generated API.md file.
- No compatable versions in other language like GO, Java, Python.
- Probably other things not mentioned here.



### Random Notes

For the brave, youy can see the following code more info on how jsii would otherwise assemble and validate the file:
https://github.com/aws/jsii/blob/62d2d37212a111f4adc63998245d280f1c43ff86/packages/jsii/lib/assembler.ts
