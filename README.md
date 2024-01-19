# jsii Faker

This is a proof of concept Projen Component that builds a minimal `.jsii` file in the root of a Typescript based Projen project. The resulting file only includes the metadata that is required to support new project creation using syntax similar to:

 `npx projen new --from @sumoc/jsii-faker fake`

*The above code should work if you run it.*

> [!CAUTION]
> Despite it's usefulness, this entire package is possibly a terrible idea. It breaks a lot of rules and standards for `jsii`, and should be considered a dangerous pre-alpha abomination ...and I hope you like it!
 

## What's jsii?

> [!NOTE]
> [`jsii`](https://github.com/aws/jsii) allows code in any language to naturally interact with JavaScript classes. It is the technology that enables the
[AWS Cloud Development Kit](https://github.com/aws/aws-cdk) to deliver polyglot libraries from a single codebase!

When you run `npx projen new --from @scope/package`, Projen will reach out to the NPM registry and use the root level `.jsii` file it finds there to build an [inventory](https://github.com/projen/projen/blob/main/src/inventory.ts) of project types Projen's tooling can create using that package.

## Why not use Projen's existing [JsiiProject](https://projen.io/docs/api/cdk/#jsiiproject-) type?

To ensure that jsii modules can be exported to a variety of other languages such as Java and C#, the jsii standard [imposes some fairly significant limitations](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/) on your Typescript. These limitations have good and legitimate reasons for existing! This means that any projects created using the JsiiProject project type also have to follow these rules.

I had a project that did not follow these rules. I wanted to use `npx projen new --from @scope/package` on it without significantl;y changing my code. Therefore, this proof of concept package was born.

## How to Use 

Minimally you can use this library to register Projen project types into a local `.jsii` file in your project by adding this code to your `.projenrc.ts` file:

```ts
const jsii = new JsiiFaker(project);
jsii.addClassType({ name: "FakeProject" });
```

## Limitations
This is an initial proof of concept.

- Only Projen projects that extend `TypeScriptProject` and accept `TypeScriptProjectOptions` are currently supported.
- This package does not currently allow custom `ProjectOptions` options to be added to the `.jsii` file (though your project can still support them).

## Other Caveats

What you are missing by not using the projen built in JsiiProject type:
 
- No automatically generated API.md file.
- No compatible versions in other language like GO, Java, Python.
- Probably other things not mentioned here.

### Random Notes / Note to Self

You can see [this code](https://github.com/aws/jsii/blob/62d2d37212a111f4adc63998245d280f1c43ff86/packages/jsii/lib/assembler.ts) for more on how AWS's jsii library would otherwise assemble and validate the file:

