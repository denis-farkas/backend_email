import mongoose from "mongoose";
//mongoose est un orm, comme prisma

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB conected on: ${url}`);
  } catch (error) {
    console.log("error: ${error.message}");
    //forcing the end of the process
    process.exit(1);
  }
};

export default connectDB;
