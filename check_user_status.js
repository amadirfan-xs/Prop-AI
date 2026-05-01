const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'password',
  database: 'init_db',
});

async function checkUserStatus(userId) {
  try {
    await client.connect();
    
    console.log('--- Subscriptions ---');
    const subs = await client.query('SELECT * FROM user_subscriptions WHERE "userId" = $1 ORDER BY "startDate" DESC', [userId]);
    console.log(JSON.stringify(subs.rows, null, 2));
    
    console.log('--- Payments ---');
    const payments = await client.query('SELECT * FROM payments WHERE "userId" = $1 ORDER BY "createdAt" DESC', [userId]);
    console.log(JSON.stringify(payments.rows, null, 2));
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkUserStatus(21);
