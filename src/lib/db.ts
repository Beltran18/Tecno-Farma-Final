import mysql from 'mysql2/promise';

const useSsl = process.env.DB_SSL === 'true';
let sslConfig: any = undefined;
if (useSsl) {
  if (process.env.DB_SSL_CA) {
    // DB_SSL_CA expected to be a base64-encoded CA certificate
    sslConfig = { ca: Buffer.from(process.env.DB_SSL_CA, 'base64') };
  } else {
    // fallback for providers that require TLS but no CA provided
    sslConfig = { rejectUnauthorized: false };
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(sslConfig ? { ssl: sslConfig } : {})
});

export default pool;
