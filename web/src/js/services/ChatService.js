goog.provide('WebMessenger.services.ChatService');
goog.require('WebMessenger.events.OnReceiveMessage');
goog.require('WebMessenger.events.OnReceiveHistory');
goog.require('goog.events.EventTarget');
goog.require('WebMessenger.common.HttpRequest');

/**
 * @constructor
 * @export
 */
WebMessenger.services.ChatService = function () {
  this.socket_ = io();
  this.eventTarget_ = new goog.events.EventTarget();
  this.chatService_ = new WebMessenger.common.HttpRequest(this, this.httpResponseSuccess_.bind(this));

  this.socket_.on('receive_message', function (messageObj) {
    var eventObj = new WebMessenger.events.OnReceiveMessage(messageObj);
    this.dispatchEvent_(eventObj);
  }.bind(this));
};

WebMessenger.services.ChatService.prototype.socket_ = null;
WebMessenger.services.ChatService.prototype.eventTarget_ = null;
WebMessenger.services.ChatService.prototype.chatService_ = null;

WebMessenger.services.ChatService.prototype.sendMessage = function (name, message) {
  this.socket_.emit('send_message', {name: name, message: message});
};

WebMessenger.services.ChatService.prototype.getHistory = function () {
  this.chatService_.request('/getHistory', 'GET');
};

WebMessenger.services.ChatService.prototype.getEventTarget = function () {
  return this.eventTarget_;
};

WebMessenger.services.ChatService.prototype.dispatchEvent_ = function (event) {
  this.eventTarget_.dispatchEvent(event);
};

WebMessenger.services.ChatService.prototype.httpResponseSuccess_ = function (response) {
  var eventObj = new WebMessenger.events.OnReceiveHistory(response);
  this.dispatchEvent_(eventObj);
};
