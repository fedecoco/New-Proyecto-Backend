import mongoose from "mongoose";

const URI = "mongodb+srv://fedemperez05:0523Fede@cluster.mo3k8jw.mongodb.net/?retryWrites=true&w=majority";

const connectToDB = () => {
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const connection = mongoose.connection;

  connection.on("error", (error) => {
    console.log("Error connecting to the database:", error);
  });

  connection.once("open", () => {
    console.log("Connected to the database");
  });
};

export default connectToDB;