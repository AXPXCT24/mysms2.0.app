import express from "express";
import routes from "./routes/index.js";
import asteriskManager from "asterisk-manager";
import cors from "cors";
import { responseListener } from "./utils/ami.js";

const app = express();
const port = 3002;

const amiPort = 5038;
const amiHost = "192.168.1.31";
const amiUser = "apiuser";
const amiSecret = "apipass";

export const ami = new asteriskManager(
  amiPort,
  amiHost,
  amiUser,
  amiSecret,
  true
);

ami.keepConnected();

responseListener();

app.use(express.json({ limit: "30mb" }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  })
);

routes(app);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
