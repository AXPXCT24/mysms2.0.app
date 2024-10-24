import pool from "../db.js";

export const getGsmPorts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM port");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching gsm ports:", error);
    res.status(500).json({ error: "Failed to fetch gsm ports" });
  }
};

export const getGsmPortById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing port ID" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM port WHERE gsm_number = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Port not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching port:", error);
    res.status(500).json({ error: "Failed to fetch port" });
  }
};

export const registerPort = async (req, res) => {
  const { gsm_number, number } = req.body;

  if (!gsm_number || !number) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO port (gsm_number, sim_number) VALUES ($1, $2) RETURNING *",
      [gsm_number, number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error registering port:", error);
    res.status(500).json({ error: "Failed to register port" });
  }
};

export const updatePortDetails = async (req, res) => {
  const { number } = req.body;
  const { gsm_number } = req.params;

  if (!gsm_number || isNaN(gsm_number)) {
    return res.status(400).json({ error: "Invalid or missing port ID" });
  }

  try {
    const result = await pool.query(
      "UPDATE port SET sim_number = $2 WHERE gsm_number = $1 RETURNING *",
      [gsm_number, number]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Port not found" });
    }
    res.status(200).json({ response: result.rows[0] });
  } catch (error) {
    console.error("Error updating port:", error);
    res.status(500).json({ error: "Failed to update port" });
  }
};

export const deletePortById = async (req, res) => {
  const { gsm_number } = req.params;

  if (!gsm_number || isNaN(gsm_number)) {
    return res.status(400).json({ error: "Invalid or missing port ID" });
  }
  try {
    const result = await pool.query("DELETE FROM port WHERE gsm_number = $1", [
      gsm_number,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Port not found" });
    }
    res.status(204).json({ message: "Port deleted successfully" });
  } catch (error) {
    console.error("Error deleting port:", error);
    res.status(500).json({ error: "Failed to delete port" });
  }
};

// export const deleteAllPorts = async (req, res) => {
//   try {
//     await pool.query("DELETE FROM port");
//     res.status(204).send();
//   } catch (error) {
//     console.error("Error deleting all ports:", error);
//     res.status(500).json({ error: "Failed to delete all ports" });
//   }
// };
