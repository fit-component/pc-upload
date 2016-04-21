import * as React from "react"
import * as request from 'superagent'
import * as classNames from 'classnames'
import UploadFileList from '../upload-file-list'
import * as module from './module'
import {others} from '../../../../common/transmit-transparently/src'

export default class Upload extends React.Component<module.PropsInterface,module.StateInterface> {
    static defaultProps = new module.Props()
    static Type = module.Type
    static ListType = module.ListType
    public state = new module.State()
    private _fileInput:any
    
    constructor(props) {
        super(props)
    }

    getStyles() {
        return {
            dragDefault: {
                border: '2px dashed #dee5e7',
                minHeight: 20,
                height: '100%',
                boxSizing: 'border-box',
                backgroundColor: '#fff'
            },
            dragStart: {
                border: '2px dashed #aaaaaa'
            }
        }
    }

    onFileChange(e) {
        e.preventDefault()
        e.stopPropagation()
        this.upload(this._fileInput.files)
    }

    upload(files:any) {
        for (let i = 0; i < files.length; i++) {
            let result = this.props.beforeUpload(files[i])
            if (result === undefined || result === true) {
                this.post(files[i]);
            } else if (result.then && typeof result.then === 'function') {
                result.then(() => {
                    this.post(files[i])
                })
            }
        }
    }

    post(file) {
        var data = new FormData()
        if (this.props.random) {
            data.append(this.props['field'], file, (Date.now()) + file.name.substr(file.name.lastIndexOf('.')))
        } else {
            data.append(this.props['field'], file)
        }
        for (var key in this.props.extraData) {
            data.append(key, this.props.extraData[key])
        }
        request.post(this.props.action)
            .send(data)
            .on('progress', (e) => {
                var progressInfo = this.state.progressInfo
                progressInfo[file.name] = e.percent
                this.setState({
                    progressInfo: progressInfo
                })
            })
            .end((err, res) => {
                if (!err) {
                    var progressInfo = this.state.progressInfo
                    delete progressInfo[file.name]
                    this.props.onChange(file.name, {
                        response: res.body || res.text,
                        status: 'done',
                        name: file.name
                    })
                    this.setState({
                        progressInfo: progressInfo
                    })
                }
                else {
                    this.props.onChange(file.name, {
                        response: res.body || res.text,
                        status: 'error',
                        name: file.name
                    })
                }
            })
    }

    onFileDrop(e:any) {
        this.setState({
            dragStatus: e.type
        })
        if (e.type === 'dragover') {
            return e.preventDefault()
        }
        const files = e.dataTransfer.files
        this.upload(files)
        e.preventDefault()
    }

    fileListRender() {
        if (this.props.listType === 'none') {
            return null
        }
        return <UploadFileList type={this.props.listType}
                               list={this.props.value}/>
    }

    progressListRender() {
        return (
            <div>
                {
                    Object.keys(this.state.progressInfo).map((key) => {
                        return this.progressItemRender(key, this.state.progressInfo[key])
                    })
                }
            </div>
        )
    }

    progressItemRender(key, pos) {
        var itemStyle = {
            transition: 'margin .3s ease, opacity .3s ease',
            margin: '10px 0'
        }
        var itemTextStyle = {
            fontSize: 12,
            color: '#98a6ad',
            marginBottom: 5
        }
        var progressStyle = {
            overflow: 'hidden',
            height: 2,
            borderRadius: 4,
            backgroundColor: '#edf1f2'
        }
        var progressInnerStyle = {
            backgroundColor: '#23b7e5',
            height: 2,
            borderRadius: 4,
            transition: 'width .3s linear',
            width: `${pos}%`
        }
        return (
            <div style={itemStyle}
                 key={key}>
                <div style={itemTextStyle}>{key}:</div>
                <div style={progressStyle}>
                    <div style={progressInnerStyle}></div>
                </div>
            </div>
        )
    }

    fileInputRender(inputStyle = {}) {
        return (
            <input
                style={inputStyle}
                ref={(c) => this._fileInput = c}
                type="file"
                accept={this.props['accept']}
                multiple={this.props.multiple}
                onChange={(e) => this.onFileChange(e)}/>
        )
    }

    render() {
        const classes = classNames({
            '_namespace': true,
            [this.props['classNames']]: !!this.props['classNames']
        })

        var styles = this.getStyles()
        var fileList = this.fileListRender()

        if (this.props.type === 'drag') {
            var dragStyle = this.state.dragStatus === 'dragover' ? Object.assign(styles.dragDefault, styles.dragStart) : styles.dragDefault
            return (
                <span>
                    { this.fileInputRender({display: 'none'}) }
                    <div style={dragStyle}
                         onDrop={ this.onFileDrop.bind(this) }
                         onDragOver={ this.onFileDrop.bind(this)}
                         onClick={() => this._fileInput.click()}>
                        {this.props.children}
                    </div>
                    {this.progressListRender()}
                    {fileList}
                </span>
            )
        } else if (this.props.type === 'button') {
            return (
                <span>
                    <div onClick={() => this._fileInput.click()} style={{display: 'inline-block'}}>
                        { this.fileInputRender({display: 'none'}) }
                        {this.props.children}
                    </div>
                    { this.progressListRender() }
                    { fileList }
                </span>
            )
        }

        return (
            <span {...others} className={classes}>
                { this.fileInputRender() }
                { this.progressListRender()}
                { fileList }
            </span>
        )
    }
}