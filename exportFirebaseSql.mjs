import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const envFile = fs.readFileSync('c:/Users/skstk/Desktop/next-project/.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [k, v] = line.split('=');
    envVars[k.trim()] = v.trim();
  }
});

const firebaseConfig = {
  apiKey: envVars['NEXT_PUBLIC_FIREBASE_API_KEY'],
  authDomain: envVars['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
  projectId: envVars['NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
  storageBucket: envVars['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: envVars['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
  appId: envVars['NEXT_PUBLIC_FIREBASE_APP_ID']
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportSql() {
  console.log('Fetching data from Firebase...');
  const txsCol = collection(db, 'transactions');
  const snapshot = await getDocs(txsCol);
  const data = snapshot.docs.map(d => ({ fb_id: d.id, ...d.data() }));
  
  if (data.length === 0) {
    console.log('No data found.');
    process.exit(0);
  }

  let sql = `-- Firebase Export to SQL\n`;
  sql += `-- Extracted ${data.length} records\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS transactions (\n`;
  sql += `  id VARCHAR(255) PRIMARY KEY,\n`;
  sql += `  date VARCHAR(20),\n`;
  sql += `  type VARCHAR(50),\n`;
  sql += `  category VARCHAR(100),\n`;
  sql += `  amount INTEGER,\n`;
  sql += `  who VARCHAR(50),\n`;
  sql += `  payment VARCHAR(50),\n`;
  sql += `  memo TEXT\n`;
  sql += `);\n\n`;

  data.forEach(item => {
    // Escape single quotes for SQL
    const memo = (item.memo || '').replace(/'/g, "''");
    const category = (item.category || '').replace(/'/g, "''");
    // Ensure all variables are properly handled
    sql += `INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('${item.fb_id}', '${item.date || ''}', '${item.type || ''}', '${category}', ${item.amount || 0}, '${item.who || ''}', '${item.payment || ''}', '${memo}');\n`;
  });

  fs.writeFileSync('c:/Users/skstk/Desktop/next-project/firebase_export.sql', sql);
  console.log('Successfully exported data to firebase_export.sql');
  process.exit(0);
}

exportSql().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
