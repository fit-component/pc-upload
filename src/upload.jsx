import React from "react";
import request from 'superagent';
import UploadFileList from './upload-file-list';

export default class FitUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragStatus: 'drag',
            progressInfo: {}
        };
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
        };
    }
    onFileChange(e) {
        e.preventDefault();
        e.stopPropagation();
        this.upload(this._fileInput.files);
    }
    upload(files) {
        for (let i = 0; i < files.length; i++) {
            let result = this.props.beforeUpload(files[i]);
            if(result === undefined || result === true) {
                this.post(files[i]);
            } if (result instanceof Promise) {
                result.then(() => {
                    this.post(files[i]);
                });
            }
        }
    }
    post(file) {
        var data = new FormData();
        data.append(this.props.field, file);
        for (var key in this.props.extraData) {
            data.append(key, this.props.extraData[key]);
        }
        request.post(this.props.action)
        .send(data)
        .on('progress', (e) => {
            var progressInfo = this.state.progressInfo;
            progressInfo[file.name] = e.percent;
            this.setState({
                progressInfo: progressInfo
            });
        })
        .end((err, res) => {
            if (!err) {
                var progressInfo = this.state.progressInfo;
                delete progressInfo[file.name];
                this.props.onChange(file.name, {
                    response: res.body || res.text,
                    status: 'done',
                    name: file.name
                });
                this.setState({
                    progressInfo: progressInfo
                });
            }
            else {
                this.props.onChange(file.name, {
                    response: res.body || res.text,
                    status: 'error',
                    name: file.name
                });
            }
        });
    }
    onFileDrop(e) {
        this.setState({
            dragStatus: e.type
        });
        if (e.type === 'dragover') {
            return e.preventDefault();
        }
        const files = e.dataTransfer.files;
        this.upload(files);
        e.preventDefault();
    }
    fileListRender() {
        if (this.props.listType === 'none') {
            return null;
        }
        return <UploadFileList type={this.props.listType} list={this.props.value}/>;
    }
    progressListRender() {
        return (
            <div>
            {
                Object.keys(this.state.progressInfo).map((key) => {
                    return this.progressItemRender(key, this.state.progressInfo[key]);
                })
            }
            </div>
        );
    }
    progressItemRender(key, pos) {
        var itemStyle = {
            transition: 'margin .3s ease, opacity .3s ease',
            margin: '10px 0'
        };
        var itemTextStyle = {
            fontSize: 12,
            color: '#98a6ad',
            marginBottom: 5
        };
        var progressStyle = {
            overflow: 'hidden',
            height: 2,
            borderRadius: 4,
            backgroundColor: '#edf1f2'
        };
        var progressInnerStyle = {
            backgroundColor: '#23b7e5',
            height: 2,
            borderRadius: 4,
            transition: 'width .3s linear',
            width: `${pos}%`
        };
        return (
            <div style={itemStyle} key={key}>
                <div style={itemTextStyle}>{key}:</div>
                <div style={progressStyle}>
                    <div style={progressInnerStyle}></div>
                </div>
            </div>
        );
    }
    fileInputRender(style) {
        return (
            <input
                ref={(c) => this._fileInput = c}
                type="file"
                accept={this.props.accept}
                multiple={this.props.multiple}
                style={style}
                onChange={(e) => this.onFileChange(e)} />);
    }
    render() {
        var styles = this.getStyles();
        var fileList = this.fileListRender();

        if (this.props.type === 'drag') {
            var dragStyle = this.state.dragStatus === 'dragover' ? Object.assign(styles.dragDefault, styles.dragStart) : styles.dragDefault;
            return (
                <span style={this.props.style}>
                    { this.fileInputRender({ display: 'none' }) }
                    <div style={dragStyle} onDrop={ this.onFileDrop.bind(this) } onDragOver={ this.onFileDrop.bind(this)} onClick={() => this._fileInput.click()}>
                        { this.props.children }
                    </div>
                    {this.progressListRender()}
                    {fileList}
                </span>
            );
        }
        else if (this.props.type === 'button') {
            return (
                <span>
                    <div style={this.props.style} onClick={() => this._fileInput.click()}>
                        { this.fileInputRender({ display: 'none' }) }
                        { this.props.children }
                    </div>
                    { this.progressListRender() }
                    { fileList }
                </span>
            );
        }
        return (
            <span>
                { this.fileInputRender(this.props.style) }
                { this.progressListRender()}
                { fileList }
            </span>
        );
    }
}
FitUpload.defaultProps = {
    // @desc 文件列表
    value: [],

    // @desc 默认文件列表
    defaultValue: [],

    // @desc 同input的name属性，也是上传字段名
    name: '',

    // @desc 上传地址
    action: '',

    // @desc 上传状态改变时
    onChange() { },

    // @desc 样式：drag(拖拽)/button(无样式)/normal(默认)
    type: 'normal',

    // @desc 上传需要的额外字段
    extraData: {},

    // @desc 文件列表样式: text/pictrue/none
    listType: 'text',

    // @desc 是否多文件上传
    multiple: true,

    // @desc: 上传前处理，返回true/false/promise
    hindleBeforeUpload() {}
};
