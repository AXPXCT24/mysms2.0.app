import { saveNewMessage } from "../controllers/MessagesController.js";
import { ami } from "../server.js";

export const responseListener = () => {
  ami.on("response", (response) => {
    console.log("Response: ", response);
  });

  ami.on("receivedsms", (res) => {
    console.log("Incoming:", res);

    const message = res.content.replace(/\+/g, " ");
    const client_number = res.sender.replace(/\+/g, "");

    const payload = {
      content: message,
      number: client_number,
      gsm_number: res.gsmspan,
    };

    console.log(payload);
    saveNewMessage(payload);
  });
};

export const smsSender = (req) => {
  return new Promise((resolve, reject) => {
    const { gsm_number, number, message } = req.body;

    if (!gsm_number || !number || !message) {
      return reject(new Error("Missing required fields"));
    }

    ami.action({
      action: "smscommand",
      command: `gsm send sms ${gsm_number} ${number} "${message}"`,
    });

    const handleUpdate = (event) => {
      console.log("Outgoing: ", event);

      if (event.status) {
        resolve(event.status);
      } else {
        reject(new Error("Failed to send SMS"));
      }

      ami.removeListener("updatesmssend", handleUpdate);
    };

    ami.on("updatesmssend", handleUpdate);
  });
};
