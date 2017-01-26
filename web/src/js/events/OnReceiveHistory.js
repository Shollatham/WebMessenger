goog.provide('WebMessenger.events.OnReceiveHistory');
goog.require('WebMessenger.enums.EventType');
goog.require('goog.events.Event');

/**
 * @constructor
 * @extends {goog.events.Event}
 */
WebMessenger.events.OnReceiveHistory = function (messageList) {
  this.messageList = messageList;
  goog.events.Event.call(this, WebMessenger.enums.EventType.ON_RECEIVE_HISTORY);
};

goog.inherits(WebMessenger.events.OnReceiveHistory, goog.events.Event);
