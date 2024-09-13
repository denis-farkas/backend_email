import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import cors from "cors";
import usersRoutes from "./routes/usersRoutes.js";

const app = express();

dotenv.config();
connectDB();

//fix to "req.body undefined"
//(because we use Express@4 - https://akhromieiev.com/req-body-undefined-express/)

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//configure cors, all origins for test
app.use(cors({ origin: "*" }));

//Routing
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(4000, () => {
  console.log(`Serveur sur le port ${PORT}`);
});
