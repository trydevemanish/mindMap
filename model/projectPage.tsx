import mongoose, { Schema, Document} from "mongoose"

export interface Project extends Document {
    projectName : string;
    description? : string;
    created_At : string;
}

const ProjectSchema: Schema<Project> = new Schema({
    projectName : {
        type : String,
        required : true,
    },
    description : {
        type : String
    },
    created_At : {
        type : String,
        required : true
    }
},{ timestamps : true })

const projectModel = mongoose.models.projectModel as mongoose.Model<Project> || mongoose.model("projectModel",ProjectSchema)

export { 
    projectModel
}