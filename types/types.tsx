export type Menu = {
    id : string;
    top : number;
    left : number;
    right : number;
    bottom : number;
} | any;

export interface Position {
    x : number;
    y : number;
}

export type NodeDataType = {
    childNodeID? : string[];
    createdAt? : string;
    link? : string;
    parentNodeID? : string;
    position : {
        x : number;
        y : number;
    }
    projectID : string;
    style : {
        backgroundColor : string;
        textcolor : string;
    }
    title :string;
    updatedAt? : string;
    _id : string;
}

export type BgColorInterface = {
    bgColor_id : number;
    bgColorName : string;
    bgColorCode : string;
}