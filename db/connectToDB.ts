import mongoose from "mongoose";

const connectToDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to DB");
        
    } catch (error:any) {
        console.log("Error connecting to the message", error.message);
    }
}

export default connectToDB;