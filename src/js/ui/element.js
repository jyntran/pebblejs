var util2 = require('lib/util2');
var Vector2 = require('lib/vector2');
var myutil = require('base/myutil');
var WindowStack = require('ui/windowstack');
var Propable = require('ui/propable');
var simply = require('simply');

var elementProps = [
  'position',
  'size',
  'borderColor',
  'backgroundColor',
];

var accessorProps = elementProps;

var nextId = 1;

var StageElement = function(elementDef) {
  this.state = elementDef || {};
  this.state.id = nextId++;
};

util2.copy(Propable.prototype, StageElement.prototype);

Propable.makeAccessors(accessorProps, StageElement.prototype);

StageElement.prototype._id = function() {
  return this.state.id;
};

StageElement.prototype._type = function() {
  return this.state.type;
};

StageElement.prototype._prop = function(elementDef) {
  if (!this.state.position) {
    this.state.position = new Vector2();
  }
  if (!this.state.size) {
    this.state.size = new Vector2();
  }
  if (this.parent === WindowStack.top()) {
    simply.impl.stageElement(this._id(), this._type(), elementDef);
  }
};

StageElement.prototype.index = function() {
  if (!this.parent) { return -1; }
  return this.parent.index(this);
};

StageElement.prototype.remove = function(broadcast) {
  if (!this.parent) { return this; }
  this.parent.remove(this, broadcast);
  return this;
};

StageElement.prototype._animate = function(animateDef, duration) {
  if (this.parent === WindowStack.top()) {
    simply.impl.stageAnimate(this._id(), animateDef, duration || 400, animateDef.easing || 'easeInOut');
  }
};

StageElement.prototype.animate = function(field, value, duration) {
  if (typeof field === 'object') {
    duration = value;
  }
  var animateDef = myutil.toObject(field, value);
  util2.copy(animateDef, this.state);
  this._animate(animateDef, duration);
  return this;
};

module.exports = StageElement;
