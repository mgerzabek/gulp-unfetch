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
        file.path = replaceExtension(file.path, options.ext)

        fetch(options.url, {
          method: options.method,
          headers: options.headers,
          body: '[' + file.contents.toString() + ']'
        }).then(response => {
          console.log(response.ok)
          console.log(response.status)
          console.log(response.statusText)
          console.log(response.headers.raw())
          console.log(response.text())
          //file.contents = Buffer.from(JSON.stringify(response.json()))
          callback(null, file)
        }).catch(error => {
          callback(new PluginError(PLUGIN_NAME, error))
        });
      }

      return null
    }
  })
}
