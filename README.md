# Pipeify - A modern pipeline for Shopify website development

Pipeify aims at giving you access to a better, smoother and more modern workflow for building, testing and deploying Shopify themes and websites.

It is built on top of [Webpack 2](https://webpack.github.io/) and allows to use tools such as [ESlint](http://eslint.org/), [Babel](https://babeljs.io/), [Sass](http://sass-lang.com/), [SVGO](https://github.com/svg/svgo), [Themekit](https://shopify.github.io/themekit/), [Stylelint](https://stylelint.io/) and [Jest](https://facebook.github.io/jest/) to help you count on features like ES6+ support, module bundling, hot module reloading, automatic watch-and-deploy, JS unit testing, asset fingerprinting, and much more!

So excited you Wanna get started right away? [Boom](#getting-started)

---

**Table of Contents**
- [Supported Features](#supported-features)
- [Project Structure and Minimal Requirements](#project-structure-and-minimal-requirements)
- [Getting Started](#getting-started)
- [Using the tool](#using-the-tool)
- [Customizing your Workflow](#customizing-your-workflow)
- [Caveats](#caveats)
- [Roadmap](#roadmap)
- [Contribtions](#contributions)

---

## Supported Features
- **Module Bundling and Treeshaking**: We are using Webpack 2 to bundle and optimize all you Javascript modules, which also has the added benefit of allowing dead code removal (treeshaking).

- **ES6+ Support**: Webpack and Babel are used to support the ES6+ standards in an effective way via [babel-loader](https://github.com/babel/babel-loader).

- **Asset Optimization and Fingerprinting**: Webpack is used to skim through all your templates and find the assets and dependencies needed for the build, running those through its process and spitting out optimized and fingerprinted assets in the build folder. It will also map those assets by rendering the correct path in the templates.

- **SVG Store**: We are supporting the use of SVG Store out of the box using webpack-svgstore-plugin [link]. You can jump to this [section](#6-svg-store) to learn how to use it in Pipeify.

- **Hot Module Reloading**: Once you start developing your application, the Webpack server will allow you to inject modified JS modules directly on your Shopify development theme without reloading the page.

- **Sourcemaps**: We added support for JS and Sass sourcemaps when you are in development mode.

- **JS Code Linting**: ESlint is used to by default to lint your JS files as part of the build process. You can add your own `.eslintrc` in your project and Pipeify will pick it up. Or you can rely on the one that is included by default [here](.eslintrc).

- **Sass Support and Linting**: Pipeify supports CSS and Sass by default. We also added support for Sass `@imports` for better style modularity. Stylelint support is also in the works [link to the roadmap].

- **JS Unit Testing**: We added a default unit testing setup so that you don't have too, using Jest as the testing platform. You can jump to the testing [link] section to learn more about this.

- **Pipeline Customization and Augmentation**: We are providing you with base Webpack configs for the development and production environments, but you can extend them to add your own specific solutions to the pipeline. More on this here [link]. 

- **Multiple Environment Support**: Pipeify uses a YAML similar to Shopify's `config.yml` [link] file to allow you to have different credentials for your development and production environments.

- **Effective Development Flow**: On top of using HMR, we also use Webpack to render paths to your assets that point to your `localhost`, allowing you to instantly see the changes on the Shopify server without having to upload files to the server or reload the page. When that strategy is not available, Pipeify takes care of uploading the right files and reloading the page for you.

- **Safe Watch and Deploy**: Pipeify has a set of flags and warning baked in to prevent you from pushing code to the `main` live theme (unless you explicitely want to). This minimizes the risks of deploying changes to the live site while in local development.

## Getting Started
[TBD once we go open source]

## Project Structure and Minimal Requirements
Once Pipeify has created the scaffolding of your project, it will have the following structure:

```
├── package.json
├── .eslintrc [1]
├── config
│   └── shopify.yml [2]
│   └── webpack.dev.conf.js [3]
│   └── webpack.prod.conf.js [3]
└── src
    ├── assets
    │   ├── fonts
    │   ├── images
    │   ├── js [4]
    │   └── sass [5]
    │   └── svg [6]
    ├── config [7]
    │   ├── settings_data.json
    │   └── settings_schema.json
    ├── layout
    │   └── theme.liquid [7]
    ├── locales [7]
    │   └── en.default.json
    ├── sections [7]
    ├── snippets [7]
    ├── specs [8]
    └── templates [7]
        ├── blog.liquid
        ├── cart.liquid
        ├── collection.liquid
        ├── gift_card.liquid
        ├── index.liquid
        ├── page.liquid
        └── product.liquid
```

#### [1] ESlint Config

`.eslintrc` (optional)
  
If you add a ESlint config file on the root of your app, Pipeify will use that file for the eslint-loader.

#### [2] Shopify Config

`config/shopify.yml`
  
Pipeify will use this config file to setup the development and production flow. It is mimicking what is already being used by Themekit [https://shopify.github.io/themekit/configuration/] and will work accordingly.

#### [3] Webpack Config

`config/webpack.[dev|prod].conf.js`
  
If Pipeify finds one or both those files in the `config` folder, it will merge them with the default Webpack config files everytime you start the Webpack server or that you build your project, allowing you to add loaders and plugins to augment the base toolset provided to you by Pipeify.

We are using https://www.npmjs.com/package/webpack-merge [link] to elegantly achieve this goal.

Please use this feature wisely as to not override the core functionalities of Pipeify. [Good enough?]

#### [4] JS Files

`src/assets/js`
  
This folder will contain all your JS units and it needs to minimally contain an `index.js` file, which will act as the entry point for you JS application.

You can use ES6/ES2015's standard, which incidently allows you to require your modules with the `import` syntax:
```
import { contains } from 'lodash'
import Foo from './modules/foo'
// const Bar = require('./modules/bar') is also available if that's your jam!
```

#### [5] Sass and CSS Files

`src/assets/sass`
  
Pipeify fully supports `.css`, `.scss` and `.sass` files and their syntax, including `@import`.

You **must** include your style index file at the top of your `index.js` file for Webpack to be able to load your styles into its build process, as such:

```
import '../sass/index.scss';
```

Note that you should not use liquid templating in your styles as Pipeify will take care of generating the right URLs and paths depending on the environment.

If you intend to use Stylelint support [link to coming soon], also note that you can only use `.scss` files.

#### [6] SVG Store

`src/assets/svg`
  
If you want to use the SVG Store technique [link], you need to ...

[I can't remember what we need to do ;)]

#### [7] Shopify Required

`src/config`, `src/layout/theme.liquid`, `src/locales`, `src/sections`, `src/snippets`, `src/templates/*.liquid`

The aforementionned files and folders are required by Shopify [link to the documentation] for any given theme.

Pipeify only adds the strict minimum required to be able to deploy a theme to your Shopify server without any errors. You can start building your application from this baseline.

#### [8] Specs

`src/specs`

Jest will look for files named `*.spec.js` or `*.test.js` in the `specs` folder of your application to run the test suite.

You can nest and organize your specs in subfolders as long as the filenames follow this convention.

More info on Jest here [link to jest's documentation]

## Using the Tool (API)
Here are the available API commands for Pipeify:

`pipeify serve [-- --development]`
  - Starts the Webpack server, deploys a first build to Shopify and launches the theme preview site.
  - Will serve assets on `https://localhost:8080`
  - (Optional) You can pass it an environment as a flag; it will default to `development` environment

`pipeify build [-- [--deploy] [--development]]`
  - Builds a production-ready version of the theme and outputs it to the `dist` folder
  - (Optional) You can pass it a `deploy` flag, which will push the compiled theme to Shopify after the build
  - (Optional) You can pass it an environment as a flag; it will default to `development` environment

`pipeify deploy [-- --development]`
  - Alias for `pipeify build -- --deploy`

`pipeify test`
  - Will start Jest testing, targeting files living in `/specs` and following the `*.{test|spec}.js` globing
  - Note that we are supporting ES6 with a `babel-jest` integration

## Customizing your Workflow

## Caveats
- local ssh certificate
- code injection from plugins
- liquid logic in files ?

## Roadmap
- Add a decent test coverage to the tool
- Add support for Stylelint (with customizable rules)

## Contributions

## License
MIT, see LICENSE.md [link] for details.

## Made by Dynamo
