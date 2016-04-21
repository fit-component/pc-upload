import * as React from 'react'
import Upload from '../../src'
import Button from '../../../button/src'

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
            <Upload type="button" 
                action="/"
                name="file"
                field="file"
                listType="picture"
                value={defaultFiles}
                extraData={{ test: 1 }} >
                <Button type="primary"
                        addonLeft="upload">点击上传</Button>
            </Upload>
        )
    }
}
