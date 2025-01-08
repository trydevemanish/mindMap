import mongoose, { Schema, Document } from "mongoose";

export interface Node extends Document {
    projectID: string;
    title: string;
    parentNodeID: string | null;  
    childNodeID: string[];         
    position: {
        x: number;
        y: number;
    };
    link : string | null;
    style : {
        backgroundColor : string;
        textcolor : string;
    }
}

const NodeSchema : Schema<Node> = new Schema(
    {
        projectID : {
            type : String,
            required : true,
            ref : "projectModel"
        },
        title : {
            type : String,
            required : true
        },
        parentNodeID : {    
            type : String,
            default: null,
        },
        childNodeID : { 
            type  : [String],
            required : true
        },
        position: {   
            x: { type: Number, required: true },
            y: { type: Number, required: true }
        },
        link : {
            type : String,
            default : null
        },
        style : {
            backgroundColor : {
                type : String,
                default : '#ffffff'
            },
            textcolor : {
                type : String,
                default : '#000000'
            }
        }
    },
    { timestamps : true }
)

const nodeModel = mongoose.models.nodeModel as mongoose.Model<Node> || mongoose.model("nodeModel",NodeSchema)

export { 
    nodeModel
}