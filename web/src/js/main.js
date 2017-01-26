goog.provide('WebMessenger.App');
goog.require('WebMessenger.models.DataModel');
goog.require('WebMessenger.services.ChatService');
goog.require('WebMessenger.enums.EventType');

/**
 * @constructor
 * @export
 */
WebMessenger.App = function () {
  this.dataModel_ = new WebMessenger.models.DataModel();
  this.chatService_ = new WebMessenger.services.ChatService();
  this.otherPeopleColorMap_ = {};
  goog.events.listen(this.chatService_.getEventTarget(),
    [WebMessenger.enums.EventType.ON_RECEIVE_MESSAGE],
    this.OnReceiveMessage_,
    false,
    this);
  goog.events.listen(this.chatService_.getEventTarget(),
    [WebMessenger.enums.EventType.ON_RECEIVE_HISTORY],
    this.OnReceiveHistory_,
    false,
    this);
  $('#message').on('keydown', function (e) {
    if (e.keyCode === 13) {
      this.chatService_.sendMessage(this.dataModel_.userName, e.target.value);
      e.target.value = '';
    }
  }.bind(this));

  this.initDialog_();
  this.$dialog_.dialog('open');
};

WebMessenger.App.prototype.dataModel_ = null;
WebMessenger.App.prototype.chatService_ = null;
WebMessenger.App.prototype.$dialog_ = null;
WebMessenger.App.prototype.$dialogInput_ = null;
WebMessenger.App.prototype.otherPeopleColorList_ = ['f5f36a', '6af595', 'f5bd6a', '6aeff5', 'f3cef1'];
WebMessenger.App.prototype.otherPeopleColorMap_ = null;
WebMessenger.App.prototype.otherPeopleColorIndex_ = 0;

WebMessenger.App.prototype.initDialog_ = function () {
  this.$dialog_ = $('#dialog');
  var contentElement = $('<div style="display: inline-flex;"></div>');
  var label = $('<span style="padding-right: 10px; line-height: 25px;">Your name : </span>');
  var inputElement = $('<div></div>');
  this.$dialogInput_ = $('<input></input>');
  this.$dialogInput_.on('keydown', this.onNameEnterFromInput_.bind(this));
  inputElement.append(this.$dialogInput_);
  contentElement.append(label);
  contentElement.append(inputElement);
  this.$dialog_.append(contentElement);

  var buttonList = [{
    'text': 'Ok',
    'click': this.onNameEnter_.bind(this)
  }];
  this.$dialog_.dialog({
    'title': 'Please enter your name',
    'dialogClass': 'no-close',
    'width': 400,
    'resizable': false,
    'dragable': true,
    'closeText': 'hide',
    'modal': true,
    'closeOnEscape': false,
    'buttons': buttonList,
    'autoOpen': false
  });
};

WebMessenger.App.prototype.OnReceiveMessage_ = function (event) {
  var name = event.name;
  var message = event.message;
  this.addChatMessage(name, message);
  $('.panel-body').animate({scrollTop: $('.chat').height()}, 800);
};

WebMessenger.App.prototype.OnReceiveHistory_ = function (event) {
  var messageList = event.messageList;
  for (var index in messageList) {
    var messageObj = messageList[index];
    this.addChatMessage(messageObj.name, messageObj.message);
  }
  $('.panel-body').animate({scrollTop: $('.chat').height()}, 1000);
};

WebMessenger.App.prototype.onNameEnterFromInput_ = function (event) {
  if (event.keyCode === 13) {
    this.onNameEnter_(event);
  }
};

WebMessenger.App.prototype.onNameEnter_ = function (event) {
  if (this.$dialogInput_.val() !== '') {
    this.dataModel_.userName = this.$dialogInput_.val();
    this.$dialog_.dialog('close');
    this.chatService_.getHistory();
  } else {
    setTimeout(this.$dialog_.dialog('open'), 1000);
  }
};

WebMessenger.App.prototype.addChatMessage = function (name, message) {
  var element = '';
  var isSender = this.dataModel_.userName === name;
  if (isSender) {
    element += '<li class="right clearfix"><span class="chat-img pull-right">';
    element += '<img src="https://placeholdit.imgix.net/~text?txtsize=16&bg=2d4daf&txtclr=fff&w=60&h=50&txt=' + name + '" alt="User Avatar" class="img-circle" />';
    element += '</span><div class="chat-body clearfix"><div class="header">';
    element += '<small class=" text-muted"><span class="">&nbsp;</span></small><strong class="pull-right primary-font">' + name + '</strong></div>';
    element += '<p style="float:right;">' + message + '</p></div></li>';
  } else {
    if (this.otherPeopleColorMap_[name] == null) {
      this.otherPeopleColorMap_[name] = this.otherPeopleColorList_[this.otherPeopleColorIndex_];
      if (this.otherPeopleColorIndex_ < this.otherPeopleColorList_.length - 1) {
        this.otherPeopleColorIndex_++;
      }
    }
    element += '<li class="left clearfix"><span class="chat-img pull-left">';
    element += '<img src="https://placeholdit.imgix.net/~text?txtsize=16&bg=' + this.otherPeopleColorMap_[name] + '&txtclr=000&w=60&h=50&txt=' + name + '" alt="User Avatar" class="img-circle" />';
    element += '</span><div class="chat-body clearfix"><div class="header">';
    element += '<strong class="primary-font">' + name + '</strong></div>';
    element += '<p>' + message + '</p></div></li>';
  }
  $('#messages').append($(element));
  while ($('#messages li').length > 100) {
    $('#messages li').first().remove();
  }
};
