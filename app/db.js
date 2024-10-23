import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "abdebelenm",
  host: "192.168.5.237",
  database: "my_sms",
  password: "root",
  port: 5432,
});

const initializeDatabase = async () => {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS Users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        authority BOOLEAN NOT NULL DEFAULT FALSE
    );`;

  const createClientTable = `
    CREATE TABLE IF NOT EXISTS Client (
        client_number varchar(15) PRIMARY KEY
    );`;

  const createPortTable = `
    CREATE TABLE IF NOT EXISTS Port (
        gsm_number INT PRIMARY KEY NOT NULL,
        sim_number varchar(15) NOT NULL
    );`;

  const createMessagesTable = `
    CREATE TABLE IF NOT EXISTS Messages (
        message_id SERIAL PRIMARY KEY,
        msg_type VARCHAR(20) NOT NULL,
        content TEXT NOT NULL, 
        date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        port_id INT NOT NULL,
        FOREIGN KEY (port_id) REFERENCES port(gsm_number),
        client_id varchar(15) NOT NULL,
        FOREIGN KEY (client_id) REFERENCES client(client_number)
    );`;

  const createSmsTemplateTable = `
    CREATE TABLE IF NOT EXISTS SmsTemplate (
        template_id SERIAL PRIMARY KEY,
        template_name VARCHAR(100) NOT NULL,
        content TEXT NOT NULL
    );`;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(createUserTable);
    await client.query(createClientTable);
    await client.query(createPortTable);
    await client.query(createMessagesTable);
    await client.query(createSmsTemplateTable);

    console.log("Tables created successfully");

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Error in created tables:", e);
  } finally {
    client.release();
  }
};

// initializeDatabase();

export default pool;
