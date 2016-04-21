import * as React from 'react'
import * as module from './module'
import {others} from '../../../../common/transmit-transparently/src'

export default class UploadFileList extends React.Component<module.PropsInterface,module.StateInterface> {
    static defaultProps = new module.Props()
    public state = new module.State()
    
    constructor(props) {
        super(props)
    }

    textItemRender(info) {
        var closeBtnStyle = {
            fontSize: 12,
            float: 'right',
            marginLeft: 5,
            color: '#98a6ad',
            cursor: 'pointer'
        }

        if (this.props.type === 'picture') {
            var picItemStyle = {
                padding: 8,
                border: '1px solid #edf1f2',
                margin: '5px 0'
            }

            var picItemImageStyle = {
                backgroundImage: `url(${info.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: 40,
                height: 40
            }

            return (
                <div style={ picItemStyle }>
                    <div style={ closeBtnStyle }>x</div>
                    <div style={{ display: 'table' }}>
                        <div style={{
                            display: 'table-cell',
                            border: '1px solid #edf1f2'
                        }}>
                            <div style={ picItemImageStyle }/>
                        </div>
                        <div style={{
                            display: 'table-cell',
                            verticalAlign: 'middle',
                            fontSize: 12,
                            padding: '0 5px'
                        }}>{ info.name }</div>
                    </div>
                </div>
            )
        }

        var textItemStyle = {
            color: '#333',
            fontSize: 12,
            display: 'inline-block',
            padding: '5px 8px 5px 8px',
            backgroundColor: '#edf1f2',
            borderRadius: 50,
            margin: '10px 5px'
        }

        return (
            <div style={ textItemStyle }>
                <div style={ closeBtnStyle }>x</div>
                { info.name }
            </div>
        )
    }

    render() {
        let Children = this.props.list.map((info) => <div key={info.name}>{this.textItemRender(info)}</div>)

        return (
            <div>
                {Children}
            </div>
        )
    }
}
