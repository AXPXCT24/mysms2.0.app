import pool from "../db.js";

export async function validateClient(clientNumber) {
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
