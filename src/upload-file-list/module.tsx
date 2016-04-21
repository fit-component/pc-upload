export interface PropsInterface {
    /**
     * 类型
     */
        type?:string

    /**
     * 上传文件列表
     */
    list?:any

    [x:string]:any
}

export class Props implements PropsInterface {
    type = 'text'
    list:any = []
}

export interface StateInterface {

}

export class State implements StateInterface {

}