import pool from "../db.js";
import { smsSender } from "../utils/ami.js";

export const getMessages = async (req, res) => {
  const { filter, params } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM Messages WHERE ${filter} = $1`,
      [params]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const deleteMessageById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing message ID" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM Messages WHERE message_id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(204).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

export const sendSingleMessage = async (req, res) => {
  const { gsm_number, number, message } = req.body;

  if (!gsm_number || !number || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const payload = await smsSender(req);
    const client = await validateClient(number);

    if (payload === "1" && client) {
      await pool.query(
        "INSERT INTO Messages (msg_type, content, port_id, client_id) VALUES ($1, $2, $3, $4)",
        ["Outgoing", message, gsm_number, number]
      );
      res.status(200).json({
        response: "Text message successfully inserted to database.",
        message: "Text message successfully sent to the client.",
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send text message" });
  }
};

export const saveNewMessage = async (values) => {
  const { content, number, gsm_number } = values;

  if (!content || !number || !gsm_number) {
    throw new Error("Missing required fields");
  }

  try {
    const client = await validateClient(number);

    if (client) {
      await pool.query(
        "INSERT INTO Messages (msg_type, content, port_id, client_id) VALUES ($1, $2, $3, $4)",
        ["Incoming", content, gsm_number, number]
      );
    }
  } catch (e) {
    console.error("Error validating client:", e);
    throw new Error("Failed to validate client");
  }
};

// ONLY ENABLE THIS CODE WHEN DELETING MESSAGES.

// export const deleteAllMessages = async (req, res) => {
//   try {
//     await pool.query("DELETE FROM Messages");
//     res.status(204).send();
//   } catch (error) {
//     console.error("Error deleting all messages:", error);
//     res.status(500).json({ error: "Failed to delete all messages" });
//   }
// }

async function validateClient(clientNumber) {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS count FROM Client WHERE client_number = $1",
      [clientNumber]
    );
    const exists = result.rows[0].count > 0;

    if (!exists) {
      try {
        const client = await pool.query(
          "INSERT INTO Client (client_number) VALUES ($1)",
          [clientNumber]
        );

        return client;
      } catch (e) {
        console.error("Error creating client:", e);
        throw new Error("Failed to create client");
      }
    }
    return exists;
  } catch (error) {
    console.error("Error checking client:", error);
    return false;
  }
}