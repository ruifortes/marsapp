

var _utils = {}

_utils._setUrlState = function (view, params){

  if (history.pushState) {
    // var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
    // newUrl+= !!params ? '?' + params : ''
    // newUrl+= !!view ? '#' + view : ''

    var newUrl = window.location.protocol + "//" + window.location.host
    newUrl+= view != null ? '/' + view : window.location.pathname
    newUrl+= !!params ? '?' + params : ''

    window.history.pushState({path:newUrl},'',newUrl);
  }

  return {view:view, viewParams:params}

}

_utils._getUrlState = function (){

  return {
    view: window.location.pathname.substr(1),
    viewParams: window.location.search.substr(1)
  }

}

module.exports = _utils
