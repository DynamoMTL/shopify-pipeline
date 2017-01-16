# Greenhouse Juice

An online storefront for Greenhouse Juice, powered by Shopify Plus.

## Setup

## Running the project

(Changes to come)

To install and initialize the project, follow these steps:

1. First check out what needs to be done on: http://themekit.cat/.
2. Then run `npm install`.

You can start the project by running the following commands:

```
theme watch
gulp serve (in a separate terminal tab/window)
```

### Stack

(More info to come)

- ThemeKit
- Gulp
- Babel
- Eslint
- Webpack

### Structure

The app is setup in the following manner:

**Configs & Tools**
- `./gulpfile.js` lists all the tasks ran by gulp.
- `./config.yml` is required to setup and sync your local environment with Shopify (more below).

**Source**
- `./source` contains all the files that gulp needs in order to build the theme.
- `./source/js/vendors` contains scripts that should not be part of the `theme.js` or not available on `npm` but still need to be accessible in the theme folder (ex: modernizr, jQuery, etc.).

**Output**
- `./output` are the folders and files that will be exported.

### Config

In order for ThemeKit to watch and upload files to the Shopify servers, you need to have a `config.yml` file that contains this information:

```
development:
  theme_id:
  theme_preview_key:
  password:
  store:
  ignore_files:
    - config.yml
    - config/settings_data.json
production: (...)
staging: (...)
```

- More info about the content of that yaml file here: https://github.com/shopify/shopify_theme.
- You need to add it to the `/` of the project and gulp will take care of parsing and exporting it to the `theme` folder when compiling.

## Wiki

### SASS and Liquid markup

Since you sometimes need to add some liquid logic to the sass files (ex: pointing to assets on a CDN), you will have to escape the liquid templating snippets, since the sass compiler would otherwise reject those and error out, as they are not valid sass code.

You will need to do so in 2 manners:

```
# Directly in the template
background-color: #{'{{ settings.some-shopify-color-variable }}'}

# In a string
background-image: url(unquote("{{ 'some-asset.png' | something }}"))
```

- More on this here: https://github.com/luciddesign/bootstrapify/wiki/Escaping-liquid-in-SASS
