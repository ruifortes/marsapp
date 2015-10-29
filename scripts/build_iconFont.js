var webfontsGenerator = require('webfonts-generator')
var glob = require("glob")
var path = require('path')

var config = {
  entypo: [
    {prefix: 'nav',
      path: './client/icons/svg/entypo/*.svg',
      rename: function (filename) {
        return filename.replace('-open-big', '')
      }
    }
  ],
  meteocons: [
    {prefix: 'wea',
      path: './client/icons/svg/meteocons/*.svg'
    }
  ],
  // material: [
  //   {prefix: 'nav',
  //     path: './client/icons/svg/material/*.svg',
  //     rename: function (filename) {
  //       return filename.replace('ic_', '').replace('_black', '').replace('_24px', '')
  //     }
  //   }
  // ]
}


var filesInfo = {} //
var files = parseConfig(config, filesInfo)


webfontsGenerator({
  files: files,
  types: ['eot', 'woff', 'ttf', 'svg'],
  dest: 'client/fonts',
  cssDest: 'client/css/_icons.scss',
  cssFontsPath: '../fonts',
  classPrefix: 'i-',
  baseClass: 'i',
  cssTemplate: './client/icons/css.hbs',
  // writeFiles: false,
  rename: baseRenameFunc
}, function(err, result) {
  if (err) return console.log('Fail!', err)
  else console.log('Done')
})



function parseConfig(config, filesInfo){
  var files = []

  for (var key in config) {
    if (config.hasOwnProperty(key)) {

      config[key].map(function (entry) {

        var tempFiles = glob.sync(entry.path)

        // add to totalFiles
        files = files.concat(tempFiles)

        //add metadata to files
        tempFiles.map(function (filename) {
          filesInfo[filename] = {prefix: entry.prefix, rename: entry.rename}
        })

      })
    }
  }
  return files
}


function baseRenameFunc(filename){
  var name = path.basename(filename, '.svg')

  var info = filesInfo[filename]
  if(info){
    if(typeof info.rename === 'function'){
      name = info.rename(name)
    }
    name = info.prefix + '-' + name
  }
  return name
}
