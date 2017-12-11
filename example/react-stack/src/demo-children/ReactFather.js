import React, {Component} from 'react'

function getChildrenType (children) {
  console.log(typeof children);
  console.log(children.$$typeof);
}


const MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
const FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable: ?any): ?() => ?Iterator<*> {
  if (maybeIterable === null || typeof maybeIterable === 'undefined') {
    return null;
  }
  const maybeIterator =
    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
    maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}

export default class ReactFather extends Component {
  render () {
    getChildrenType(this.props.children)
    // test forEach
    const wapperChildren = []
    React.Children.forEach(this.props.children, (child, index) => {
      wapperChildren.push(<div key={index}>{child} : {index}</div>)
    })
    // test map
    const wapperChildren1 = React.Children.map(this.props.children, (child, index) => {
      return (
        <div key={index}>wrapper {child}:{index}</div>
      )
    })
    console.log(React.Children.count(this.props.children));
    console.log(Array.isArray(this.props.children));
    const IteratorFn = getIteratorFn(this.props.children)
    console.log(IteratorFn);
    if (typeof IteratorFn === 'function') {
      var iterator = IteratorFn.call(this.props.children);
      var step;
      var ii = 0;
      console.log(!(step = iterator.next()).done);
      while (!(step = iterator.next()).done) {
        const child = step.value;
        console.log(typeof child);
      }
    }
    return (
      <div>
        {wapperChildren}
        {wapperChildren1}
      </div>
    )
  }
}
