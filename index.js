const { Transform } = require('stream')
const PluginError = require('plugin-error')
const replaceExtension = require('replace-ext')
const fetch = require('node-fetch')

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

        const response = await fetch(options.url, {
          method: options.method,
          headers: options.headers,
          body: file.contents.toString()
        });
        const data = await response.json();
        file.contents = Buffer.from(JSON.stringify(data))
        return callback(null, file)
      }

      return null
    }
  })
}
