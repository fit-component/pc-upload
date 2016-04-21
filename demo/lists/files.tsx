import * as React from 'react'
import Upload from '../../src'

let defaultFiles = [{
    url: '/static/左图.jpg',
    name: '左图.jpg'
}, {
    url: '/static/右图.jpg',
    name: '右图.jpg'
}];

export default class Demo extends React.Component<any,any> {
    render() {
        return (
            <Upload 
              action="/"
              listType="text"
              value={defaultFiles}>
            </Upload>
        )
    }
}
