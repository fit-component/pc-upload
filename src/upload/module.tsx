export interface TypeInterface {
    Normal:string
    Drag:string
    Button:string
}

export const Type:TypeInterface = {
    Normal: 'normal',
    Drag: 'trag',
    Button: 'button'
}

export interface ListTypeInterface {
    Text:string
    Pictrue:string
    None:string
}

export const ListType:ListTypeInterface = {
    Text: 'text',
    Pictrue: 'pictrue',
    None: 'none'
}


export interface PropsInterface {
    /**
     * 文件列表
     */
    value?:string[]

    /**
     * 默认文件列表
     */
    defaultValue?:string[]

    /**
     * 同input的name属性，也是上传字段名
     */
    name?:string

    /**
     * 上传地址
     */
    action?:string

    /**
     * 上传状态改变时
     */
    onChange?:(file?:any, status?:any)=>void

    /**
     * 样式
     */
        type?:string

    /**
     * 上传需要的额外字段
     */
    extraData?:any

    /**
     * 文件列表样式
     */
    listType?:string

    /**
     * 是否多文件上传
     */
    multiple?:boolean

    /**
     * 是否随机文件名上传
     */
    random?:boolean

    /**
     * 上传前处理，返回true/false/promise
     */
    beforeUpload?:(file?:any)=>boolean|any

    [x:string]:any
}

export class Props implements PropsInterface {
    value = []
    defaultValue = []
    name = ''
    action = ''

    onChange() {
    }

    type = Type.Normal
    extraData = {}
    listType = ListType.Text
    multiple = true
    random = false

    beforeUpload() {
    }
}

export interface StateInterface {
    dragStatus?:string
    progressInfo?:any
}

export class State implements StateInterface {
    dragStatus = 'drag'
    progressInfo:any = {}
}