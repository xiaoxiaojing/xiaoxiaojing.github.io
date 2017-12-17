function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {}
Component.prototype.setState = function(partialState, callback) {}
Component.prototype.forceUpdate = function(callback) {}

function PureComponent(props, context, updater) {
  // Duplicated from Component.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(pureComponentPrototype, Component.prototype);
PureComponent.prototype = Object.create(Component.prototype)
Component.prototype = {
  setState: function() {console.log(123);}
}
console.log(Component.prototype);
console.log(PureComponent.prototype.setState === Component.prototype.setState);
Component.prototype.setState()
PureComponent.prototype.setState()

pureComponentPrototype.isPureReactComponent = true;
