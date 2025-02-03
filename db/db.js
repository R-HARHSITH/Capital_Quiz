import mongoose from 'mongoose'
export const connectDB=async()=>{
    try {
    //     const conn=await mongoose.connect(process.env.MONGO_URI, 
    //                                       {
    //   serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    //   connectTimeoutMS: 30000,         // Connection timeout
    // });
       const conn=await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
});

;
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error:",error);
    }
}
