import React from 'react'

export default function TestCreateElement () {
  return React.createElement('div', {
    name: 'test-div'
  }, [React.createElement('p', {}, 'test-p-text'), React.createElement('p', {}, 'test-p-text')])
}
