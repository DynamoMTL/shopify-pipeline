// Import main stylesheet
import '../sass/index.scss'

// Utilities
import Foo from './utilities/foo'

// eslint-disable-next-line
console.log(Foo.bar('Boom!'))

// eslint-disable-next-line
const __svg__ = { path: '../svg/**/*.svg', name: 'svgstore.[hash].svg' }
