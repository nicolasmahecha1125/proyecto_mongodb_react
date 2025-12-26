import mongoose from 'mongoose'

 export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://NICOLAS:XXaTYuxYXNRLrlXr@cluster0.g7qjzca.mongodb.net/?appName=Cluster0");
    } catch (error) {
        console.log(error);

    };
}