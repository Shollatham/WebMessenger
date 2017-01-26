goog.provide('WebMessenger.common.HttpRequest');

goog.require('goog.events');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo');

/**
 * @constructor
 */
WebMessenger.common.HttpRequest = function (sender, onSuccessCallback, onErrorCallback, onAbortCallback, onReadyStateChange) {
  if (goog.isFunction(onSuccessCallback)) {
    this.onSuccessCallback_ = onSuccessCallback;
  }
  if (goog.isFunction(onErrorCallback)) {
    this.onErrorCallback_ = onErrorCallback;
  }
  if (goog.isFunction(onAbortCallback)) {
    this.onAbortCallback_ = onAbortCallback;
  }
  if (goog.isFunction(onReadyStateChange)) {
    this.onReadyStateChange_ = onReadyStateChange;
  }
  this.sender_ = sender;
  this.xhrIo_ = new goog.net.XhrIo();
  this.headers_ = new goog.structs.Map();
  this.headers_.set('Content-Type', 'application/json; charset=utf-8');
  // this.headers_.set('Access-Control-Allow-Origin', '*');
  this.wireEvent_();
};

WebMessenger.common.HttpRequest.prototype.sender_ = null;
WebMessenger.common.HttpRequest.prototype.xhrIo_ = null;
WebMessenger.common.HttpRequest.prototype.headers_ = null;
WebMessenger.common.HttpRequest.prototype.requestTime_ = null;
WebMessenger.common.HttpRequest.prototype.onSuccessCallback_ = function (result, sender) {
};
WebMessenger.common.HttpRequest.prototype.onErrorCallback_ = function (result, sender) {
};
WebMessenger.common.HttpRequest.prototype.onAbortCallback_ = function (result, sender) {
};
WebMessenger.common.HttpRequest.prototype.onReadyStateChange_ = function (state, current, total) {
};

WebMessenger.common.HttpRequest.prototype.wireEvent_ = function () {
  var object = this;
  this.xhrIo_.listen(goog.net.EventType.COMPLETE, this.onComplete_.bind(this));

  goog.events.listen(this.xhrIo_, goog.net.EventType.READY_STATE_CHANGE, function (e) {
    var readyState = e.target.getReadyState();
    var status = e.target.getStatus();

    if (readyState === 1 || readyState === 2) {
      object.onReadyStateChange_(readyState, 0, 0);
    } else if (status === 200 && readyState === 3) {
      var responseText = e.target.getResponseText();
      var total = e.target.xhr_.getResponseHeader('Content-Length');
      object.onReadyStateChange_(readyState, responseText.length, total);
    } else if (status === 200 && readyState === 4) {
      object.onReadyStateChange_(readyState, 0, 0);
    }
  });
};
WebMessenger.common.HttpRequest.prototype.onComplete_ = function (e) {
  var xhr = e.target;
  var response = null;
  if (xhr.isSuccess()) {
    try {
      try {
        response = xhr.getResponseJson();
      } catch (error) {
        response = xhr.getResponseText();
      }
      var elapse = 0;
      if (window.console) {
        var endtime = (new Date()).getTime();
        elapse = (endtime - this.requestTime_);
        window.console.log('Finish requested time:' + elapse + ' msec');
      }
      this.onSuccessCallback_(response, this.sender_);
    } catch (receiveErr) {
      window.console.log(receiveErr.stack);
      this.onErrorCallback_(response, this.sender_);
    }
  } else if (goog.net.ErrorCode.ABORT === xhr.getLastErrorCode()) {
    this.onAbortCallback_('request was aborted : ' + xhr.getLastError(), this.sender_);
  } else {
    response = xhr.getResponseText();
    this.onErrorCallback_(response, this.sender_);
  }
};

WebMessenger.common.HttpRequest.prototype.addHeader = function (key, value) {
  this.headers_.set(key, value);
};

WebMessenger.common.HttpRequest.prototype.request = function (url, method, data, onSuccessCallback, onErrorCallback, onAbortCallback, onReadyStateChange) {
  if (goog.isFunction(onSuccessCallback)) {
    this.onSuccessCallback_ = onSuccessCallback;
  }
  if (goog.isFunction(onErrorCallback)) {
    this.onErrorCallback_ = onErrorCallback;
  }
  if (goog.isFunction(onAbortCallback)) {
    this.onAbortCallback_ = onAbortCallback;
  }
  if (goog.isFunction(onReadyStateChange)) {
    this.onReadyStateChange_ = onReadyStateChange;
  }
  this.cancel();
  this.requestTime_ = (new Date()).getTime();
  this.xhrIo_.send(url, method || 'POST', goog.json.serialize(data), this.headers_);
};

WebMessenger.common.HttpRequest.prototype.requestWithoutHandler = function (url, method, data, onSuccessCallback, onErrorCallback, onAbortCallback, onReadyStateChange) {
  if (goog.isFunction(onSuccessCallback)) {
    this.onSuccessCallback_ = onSuccessCallback;
  }
  if (goog.isFunction(onErrorCallback)) {
    this.onErrorCallback_ = onErrorCallback;
  }
  if (goog.isFunction(onAbortCallback)) {
    this.onAbortCallback_ = onAbortCallback;
  }
  if (goog.isFunction(onReadyStateChange)) {
    this.onReadyStateChange_ = onReadyStateChange;
  }
  goog.net.XhrIo.send(url, this.onComplete_.bind(this), method || 'POST', goog.json.serialize(data), this.headers_);
};

// public
WebMessenger.common.HttpRequest.prototype.cancel = function () {
  if (this.xhrIo_.isActive()) {
    try {
      this.xhrIo_.abort();
    } catch (sendErr) {
      this.onErrorCallback_('A fatal error occured while sending request : ' + sendErr, this.sender_);
    }
  }
};

WebMessenger.common.HttpRequest.prototype.postRequest = function (path, params, method) {
  method = method || 'post';

  var form = document.createElement('form');
  form.setAttribute('method', method);
  form.setAttribute('action', path);

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', key);
      hiddenField.setAttribute('value', params[key]);

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
};

WebMessenger.common.HttpRequest.prototype.isRequestingData = function () {
  return this.xhrIo_.isActive();
};
