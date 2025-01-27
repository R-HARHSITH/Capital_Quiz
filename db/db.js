import mongoose from 'mongoose'
export const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI, 
                                          {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      connectTimeoutMS: 30000,         // Connection timeout
    });
;
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error:",error);
    }
}
