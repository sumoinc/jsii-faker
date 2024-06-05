# JSII Faker

This is a proof of concept Projen Component that builds a minimal `.jsii` file in the root of a Typescript based Projen project. The resulting file only includes the metadata that is required specifically to support new [Projen](https://projen.io/) project creation using syntax similar to:

 `npx projen new --from @sumoc/jsii-faker fake`

*Run the above code to try it out.*

> [!CAUTION]
> Despite it's usefulness, this entire package is possibly a terrible idea. It breaks a lot of rules and standards for `jsii`, and should be considered a dangerous pre-alpha abomination ...and I hope you like it!

## How to Use 

Minimally you can use this library to register Projen project types so that they are written into a local `.jsii` file in your project. To do this, simply add this code to your `.projenrc.ts` file:

```ts
const jsii = new JsiiFaker(project);
jsii.addClassType({ name: "FakeProject" });
```

## Why Create this?

[JSII](https://github.com/aws/jsii) has some fairly significant [restrictions on Typescript language features](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/). These restrictions are primarily in place so that JSII can generate Go, Python, and other library wrappers for the project. However, many use cases don't need language support for anything but Typescript. This means you end up giving up a lot of Typescript capabilities with (in my opinion) very little upside.

The only reason Projen even requires is so that when you run `npx projen new --from @scope/package`, Projen can reach out to the NPM registry and use the root level `.jsii` file it finds there to build an [inventory](https://github.com/projen/projen/blob/main/src/inventory.ts) of project types that Projen's tooling can then create using the given package.


## Why not use Projen's existing [JsiiProject](https://projen.io/docs/api/cdk/#jsiiproject-) type?

To ensure that jsii modules can be exported to a variety of other languages such as Java and C#, the jsii standard [imposes some fairly significant limitations](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/) on your Typescript. These limitations have good and legitimate reasons for existing! This means that any projects created using the JsiiProject project type also have to follow these rules.

I had a project that did not follow these rules. I wanted to use `npx projen new --from @scope/package` on it without significantl;y changing my code. Therefore, this proof of concept package was born.

## What you are missing by not using Projen's built in JsiiProject type?
 
The biggest things you miss out on are:

- No automatic API.md file generated by JSII's DocGen tooling.
- No compatible versions in other language like GO, Java, Python.

The loss of automatic API documentation is annoying but completely worth it (in my use case) in exchange for unlocking the full capabilities of TypeScript in a Projen project.


## Limitations
This is an initial proof of concept.

- Only Projen projects that extend `TypeScriptProject` and accept `TypeScriptProjectOptions` are currently supported.
- This package does not currently allow custom `ProjectOptions` options to be added to the `.jsii` file (though your project can still support them).

### Random Notes / Note to Self

You can see [this code](https://github.com/aws/jsii/blob/62d2d37212a111f4adc63998245d280f1c43ff86/packages/jsii/lib/assembler.ts) for more on how AWS's jsii library would otherwise assemble and validate the file:

