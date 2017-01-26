goog.provide('WebMessenger.events.OnReceiveMessage');
goog.require('WebMessenger.enums.EventType');
goog.require('goog.events.Event');

/**
 * @constructor
 * @extends {goog.events.Event}
 */
WebMessenger.events.OnReceiveMessage = function (messageObj) {
  this.name = messageObj.name;
  this.message = messageObj.message;
  goog.events.Event.call(this, WebMessenger.enums.EventType.ON_RECEIVE_MESSAGE);
};

goog.inherits(WebMessenger.events.OnReceiveMessage, goog.events.Event);
