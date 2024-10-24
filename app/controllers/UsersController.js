import pool from "../db.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  try {
    const result = await pool.query("SELECT * FROM Users WHERE user_id = $1", [
      user_id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const editUserDetails = async (req, res) => {
  const { user_id } = req.params;
  const { username, password } = req.body;

  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Invalid or missing username or password" });
  }
  try {
    const result = await pool.query(
      "UPDATE Users SET username = $1, password = $2 WHERE user_id = $3 RETURNING *",
      [username, password, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error("Error updating user details:", e);
    res.status(500).json({ error: "Failed to update user details" });
  }
};

export const createUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Invalid or missing username or password" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 6);

    const result = await pool.query(
      "INSERT INTO Users (username, password) VALUES ($1, $2) RETURNING username",
      [username, hashedPassword]
    );

    res.status(201).json(result.rows);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "23505") {
      res.status(409).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
};

export const deleteUserById = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  try {
    const result = await pool.query("DELETE FROM Users WHERE user_id = $1", [
      user_id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).json({ message: "User deleted successfully" });
  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// DELETE ENDPOINT
// export const deleteUsers = async (req, res) => {
//   try {
//     await pool.query("DELETE FROM Users");
//     res.status(204).json({ message: "All users deleted successfully" });
//   } catch (e) {
//     console.error("Error deleting all users:", e);
//     res.status(500).json({ error: "Failed to delete all users" });
//   }
// };
