import React from 'react'
import qs from 'query-string'

export default class Example extends React.PureComponent {
  render () {
    return qs.stringify({ hello: 'world' })
  }
}
