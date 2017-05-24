/**
 * Liquid loader
 *
 * Parses liquid files, searching for assets that are piped to `asset_url` and
 * transforming them into `require()` call so that images are run through the
 * correct loader and their name are fingerprinted.
 *
 * You should most likely use this along with the `extract-loader`, which will
 * extract the required images and prepare the output for the file-loader.o
 */

import utils from 'loader-utils'
import escapeStringRegexp from 'escape-string-regexp'

export default function liquidLoader(content) {
  // make this loader cacheable, unless it's dependencies have changed, given
  // an input X, it will always produce the same result.
  this.cacheable()

  // assumption is that quoted asset_url are not variables, but actual assets.
  const regex = /{{ '(.*)' \| asset_url }}/g

  return `module.exports = ${JSON.stringify(content).replace(regex, (liquidExpr, file) => {
    const fileRegex = new RegExp(escapeStringRegexp(file))

    // Replace the filename with a require call. Double quotes are used to "escape"
    // from the string returned from JSON.stringify().
    return liquidExpr.replace(fileRegex, (match) => {
      const request = utils.urlToRequest(match)
      const path = utils.stringifyRequest(this, request)

      // Ensure loader cache is busted when the image changes
      this.addDependency(path)

      return `" + require(${path}) +"`
    })
  })};`
}
