var EventEmitter = require('events').EventEmitter

var urlState = function(){

  if (history.pushState) {
    window.addEventListener('popstate', function () {
      this.emit('change', this.get)
    }.bind(this))
  }

  this.set = function (view, params){


    var path, search = ''

    path = view != null ? '/' + view : window.location.pathname

    if (params == null ) {
      search = window.location.search
    } else if(params != ''){
      search = '?' + params
    }

    var newUrl = window.location.protocol + "//" + window.location.host
                + path + search



    if (history.pushState) {
      window.history.pushState({path:newUrl},'',newUrl)
      this.emit('change',{
        view: window.location.pathname.substr(1),
        viewParams: window.location.search.substr(1)
      })
    } else {
      window.location.href = newUrl
    }


  }

  this.get = function (){

    return {
      view: window.location.pathname.substr(1),
      viewParams: window.location.search.substr(1)
    }

  }

}

urlState.prototype = new EventEmitter()

module.exports = new urlState()
