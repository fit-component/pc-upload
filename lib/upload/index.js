'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _uploadFileList = require('./upload-file-list');

var _uploadFileList2 = _interopRequireDefault(_uploadFileList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Upload = function (_React$Component) {
    _inherits(Upload, _React$Component);

    function Upload(props) {
        _classCallCheck(this, Upload);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Upload).call(this, props));

        _this.state = {
            dragStatus: 'drag',
            progressInfo: {}
        };
        return _this;
    }

    _createClass(Upload, [{
        key: 'getStyles',
        value: function getStyles() {
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
    }, {
        key: 'onFileChange',
        value: function onFileChange(e) {
            e.preventDefault();
            e.stopPropagation();
            this.upload(this._fileInput.files);
        }
    }, {
        key: 'upload',
        value: function upload(files) {
            var _this2 = this;

            var _loop = function _loop(i) {
                var result = _this2.props.beforeUpload(files[i]);
                if (result === undefined || result === true) {
                    _this2.post(files[i]);
                }if (result instanceof Promise) {
                    result.then(function () {
                        _this2.post(files[i]);
                    });
                }
            };

            for (var i = 0; i < files.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'post',
        value: function post(file) {
            var _this3 = this;

            var data = new FormData();
            data.append(this.props.field, file);
            for (var key in this.props.extraData) {
                data.append(key, this.props.extraData[key]);
            }
            _superagent2.default.post(this.props.action).send(data).on('progress', function (e) {
                var progressInfo = _this3.state.progressInfo;
                progressInfo[file.name] = e.percent;
                _this3.setState({
                    progressInfo: progressInfo
                });
            }).end(function (err, res) {
                if (!err) {
                    var progressInfo = _this3.state.progressInfo;
                    delete progressInfo[file.name];
                    _this3.props.onChange(file.name, {
                        response: res.body || res.text,
                        status: 'done',
                        name: file.name
                    });
                    _this3.setState({
                        progressInfo: progressInfo
                    });
                } else {
                    _this3.props.onChange(file.name, {
                        response: res.body || res.text,
                        status: 'error',
                        name: file.name
                    });
                }
            });
        }
    }, {
        key: 'onFileDrop',
        value: function onFileDrop(e) {
            this.setState({
                dragStatus: e.type
            });
            if (e.type === 'dragover') {
                return e.preventDefault();
            }
            var files = e.dataTransfer.files;
            this.upload(files);
            e.preventDefault();
        }
    }, {
        key: 'fileListRender',
        value: function fileListRender() {
            if (this.props.listType === 'none') {
                return null;
            }
            return _react2.default.createElement(_uploadFileList2.default, { type: this.props.listType, list: this.props.value });
        }
    }, {
        key: 'progressListRender',
        value: function progressListRender() {
            var _this4 = this;

            return _react2.default.createElement(
                'div',
                null,
                Object.keys(this.state.progressInfo).map(function (key) {
                    return _this4.progressItemRender(key, _this4.state.progressInfo[key]);
                })
            );
        }
    }, {
        key: 'progressItemRender',
        value: function progressItemRender(key, pos) {
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
                width: pos + '%'
            };
            return _react2.default.createElement(
                'div',
                { style: itemStyle, key: key },
                _react2.default.createElement(
                    'div',
                    { style: itemTextStyle },
                    key,
                    ':'
                ),
                _react2.default.createElement(
                    'div',
                    { style: progressStyle },
                    _react2.default.createElement('div', { style: progressInnerStyle })
                )
            );
        }
    }, {
        key: 'fileInputRender',
        value: function fileInputRender(style) {
            var _this5 = this;

            return _react2.default.createElement('input', {
                ref: function ref(c) {
                    return _this5._fileInput = c;
                },
                type: 'file',
                accept: this.props.accept,
                multiple: this.props.multiple,
                style: style,
                onChange: function onChange(e) {
                    return _this5.onFileChange(e);
                } });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var styles = this.getStyles();
            var fileList = this.fileListRender();

            if (this.props.type === 'drag') {
                var dragStyle = this.state.dragStatus === 'dragover' ? _extends(styles.dragDefault, styles.dragStart) : styles.dragDefault;
                return _react2.default.createElement(
                    'span',
                    { style: this.props.style },
                    this.fileInputRender({ display: 'none' }),
                    _react2.default.createElement(
                        'div',
                        { style: dragStyle, onDrop: this.onFileDrop.bind(this), onDragOver: this.onFileDrop.bind(this), onClick: function onClick() {
                                return _this6._fileInput.click();
                            } },
                        this.props.children
                    ),
                    this.progressListRender(),
                    fileList
                );
            } else if (this.props.type === 'button') {
                return _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.createElement(
                        'div',
                        { style: this.props.style, onClick: function onClick() {
                                return _this6._fileInput.click();
                            } },
                        this.fileInputRender({ display: 'none' }),
                        this.props.children
                    ),
                    this.progressListRender(),
                    fileList
                );
            }
            return _react2.default.createElement(
                'span',
                null,
                this.fileInputRender(this.props.style),
                this.progressListRender(),
                fileList
            );
        }
    }]);

    return Upload;
}(_react2.default.Component);

exports.default = Upload;


Upload.defaultProps = {
    // @desc 文件列表
    value: [],

    // @desc 默认文件列表
    defaultValue: [],

    // @desc 同input的name属性，也是上传字段名
    name: '',

    // @desc 上传地址
    action: '',

    // @desc 上传状态改变时
    onChange: function onChange() {},


    // @desc 样式：drag(拖拽)/button(无样式)/normal(默认)
    type: 'normal',

    // @desc 上传需要的额外字段
    extraData: {},

    // @desc 文件列表样式: text/pictrue/none
    listType: 'text',

    // @desc 是否多文件上传
    multiple: true,

    // @desc: 上传前处理，返回true/false/promise
    hindleBeforeUpload: function hindleBeforeUpload() {}
};