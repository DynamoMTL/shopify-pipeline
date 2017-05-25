# Pipeify - A modern pipeline for Shopify website development

[CI badges ?]

Pipeify aims at giving you access to a better, smoother and more modern workflow for building, testing and deploying Shopify themes and websites.

It is built on top of Webpack 2 and allows to use tools such as ESlint, Babel, Sass, SVGO, Themekit, Stylelint and Jest to help you count on features like ES6+ support, module bundling, hot module reloading, automatic watch-and-deploy, JS unit testing, asset fingerprinting, and much more! [Add links]

Excited? Let's get started!

---

**Table of Contents**
- [Supported Features](#)
- [Project Structure and Minimal Requirements](#)
- [Getting Started](#)
- [Using the tool](#)
- [Customizing your Workflow](#)
- [Caveats](#)
- [Roadmap](#)
- [Contribtions](#)

---

Wanna jump right in? Click here to get started, bud! [link]

## Supported Features
### Module Bundling and Treeshaking
We are using Webpack 2 to bundle and optimize all you Javascript modules, which also has the added benefit of allowing dead code removal (treeshaking).

### ES6+ Support
Webpack and Babel are used to support the ES6+ standards in an effective way.

Here is the config used by babel-loader [link] in the build process: [link to code].

### Asset Optimization and Fingerprinting
Webpack is used to skim through all your templates and find the assets and dependencies needed for the build, running those through its process and spitting out optimized and fingerprinted assets in the build folder.

It will also map those assets by rendering the correct path in the templates.

### SVG Store
We are supporting the use of SVG Store out of the box using webpack-svgstore-plugin [link].

You can jump to this section [link] to learn how to use it in Pipeify.

### Hot Module Reloading
Once you start developing your application, the Webpack server will allow you to inject modified JS modules directly on your Shopify development theme without reloading the page.

### Sourcemaps
We added support for JS and Sass sourcemaps when you are in development mode.

### JS Code Linting
ESlint is used to by default to lint your JS files as part of the build process.

You can add your own `.eslintrc` in your project and Pipeify will pick it up 

Or you can rely on the one that is included by default here: [link to file].

### Sass Support and Linting
Pipeify supports CSS and Sass by default.

We also added support for Sass `@imports` for better style modularity.

Stylelint support is also in the works [link to the roadmap].

### JS Unit Testing
We added a default unit testing setup so that you don't have too, using Jest as the testing platform.

You can jump to the testing [link] section to learn more about this.

### Pipeline Customization and Augmentation
We are providing you with base Webpack configs for the development and production environments, but you can extend them to add your own specific solutions to the pipeline.

More on this here [link]. 

### Multiple Environment Support
Pipeify uses a YAML similar to Shopify's `config.yml` [link] file to allow you to have different credentials for your development and production environments.

### Effective Development Flow
On top of using HMR, we also use Webpack to render paths to your assets that point to your `localhost`, allowing you to instantly see the changes on the Shopify server without having to upload files to the server or reload the page.

When that strategy is not available, Pipeify takes care of uploading the right files and reloading the page for you.

### Safe Watch and Deploy
Pipeify has a set of flags and warning baked in to prevent you from pushing code to the `main` live theme (unless you explicitely want to). 

This minimizes the risks of deploying changes to the live site while in local development.

## Getting Started
[TBD once we go open source]

## Project Structure and Minimal Requirements
Once Pipeify has created the scaffolding of your project, it will have the following structure:

```
├── package.json
├── .eslintrc [link]
├── config
│   └── shopify.yml [link]
    └── webpack.dev.conf.js [link]
    └── webpack.prod.conf.js [link]
└── src
    ├── assets
    │   ├── fonts
    │   ├── images
    │   ├── js [link]
    │   └── sass [link]
    │   └── svg [link]
    ├── config [link]
    │   ├── settings_data.json
    │   └── settings_schema.json
    ├── layout
    │   └── theme.liquid [link]
    ├── locales [link]
    │   └── en.default.json
    ├── sections [link]
    ├── snippets [link]
    ├── specs [link]
    └── templates [link]
        ├── blog.liquid
        ├── cart.liquid
        ├── collection.liquid
        ├── gift_card.liquid
        ├── index.liquid
        ├── page.liquid
        └── product.liquid
```

- `.eslintrc` (optional)
  If you add a ESlint config file on the root of your app, Pipeify will use that file for the eslint-loader.

- `config/shopify.yml`
  Pipeify will use this config file to setup the development and production flow. It is mimicking what is already being used by Themekit [https://shopify.github.io/themekit/configuration/] and will work accordingly.

- `config/webpack.[dev|prod].conf.js`
  If Pipeify finds one or both those files in the `config` folder, it will merge them with the default Webpack config files everytime you start the Webpack server or that you build your project, allowing you to add loaders and plugins to augment the base toolset provided to you by Pipeify.

  We are using https://www.npmjs.com/package/webpack-merge [link] to elegantly achieve this goal.

  Please use this feature wisely as to not override the core functionalities of Pipeify. [Should we add more to this?]

- `src/assets/js`
- `src/assets/sass`
- `src/assets/svg`
- `src/config`
- `src/layout/theme.liquid`
- `src/locales`, `src/sections`, `src/snippets`, `src/templates/*.liquid`
- `src/specs`

## Using the Tool
## Customizing your Workflow
## Caveats
## Roadmap
## Contributions
## License
## Made by Dynamo

- how the project needs to be structured
- how to setup the tool
  - npm install and all that jazz 
- api
  - how to use the cli
  - command list and what they do
- few caveats and quirks
  - issues of the tool or some weird things we have to do
  - the whole story around plugins and code injection
- roadmap: what's next
- contributing
- code of conduct
- license and dynamo's brand everywhere