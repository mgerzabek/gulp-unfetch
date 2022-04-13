const { Transform } = require('stream')
const PluginError = require('plugin-error')
const replaceExtension = require('replace-ext')
const unfetch = require('unfetch')

const PLUGIN_NAME = 'gulp-unfetch'

module.exports = (options = {}) =>
{

  return new Transform({
    objectMode: true,
    transform(file, enc, callback)
    {
      if (file.isNull())
      {
        return callback(null, file)
      }

      if (file.isStream())
      {
        return callback(new PluginError(PLUGIN_NAME, 'Streaming is not supported'))
      }

      if (file.isBuffer())
      {
        file.path = replaceExtension(file.path, '.json')

        const result = {}

        file.contents = Buffer.from(JSON.stringify(result))
        return callback(null, file)
      }

      return null
    }
  })
}
