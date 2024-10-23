import userRoutes from "./Users.js";
import clientRoutes from "./Client.js";
import messagesRoutes from "./Messages.js";
import portRoutes from "./Port.js";
import smsTemplateRoutes from "./SmsTemplate.js";

export default (app) => {
  app.use("/user", userRoutes);
  app.use("/client", clientRoutes);
  app.use("/messages", messagesRoutes);
  app.use("/port", portRoutes);
  app.use("/sms-template", smsTemplateRoutes);
};
