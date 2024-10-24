import pool from "../db";

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

export const deletePortById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing port ID" });
  }
  try {
    const result = await pool.query("DELETE FROM port WHERE gsm_number = $1", [
      id,
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

export const registerPort = async (req, res) => {
  const { gsm_number, number } = req.body;

  if (!gsm_number || !number) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO port (gsm_number, number) VALUES ($1, $2) RETURNING *",
      [gsm_number, number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error registering port:", error);
    res.status(500).json({ error: "Failed to register port" });
  }
};