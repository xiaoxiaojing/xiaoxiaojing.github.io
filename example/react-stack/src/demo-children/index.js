import React from 'react'
import ReactChildren from './ReactChildren'
import ReactFather from './ReactFather'

var myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield <ReactChildren key={1}/>
    yield <ReactChildren key={2}/>
}

export default function ReactChildrenTest () {
  return (
    <div>
      <div>
        <span>children is number or string:</span>
        <ReactFather>123</ReactFather>

    </div>
    </div>
  )
}
