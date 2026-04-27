import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

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

async function deleteAllData() {
  console.log('Fetching all transactions to delete...');
  const txsCol = collection(db, 'transactions');
  const snapshot = await getDocs(txsCol);
  
  if (snapshot.empty) {
    console.log('No data to delete. Database is already empty.');
    process.exit(0);
  }

  let count = 0;
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, 'transactions', document.id));
    count++;
  }

  console.log(`Successfully deleted all ${count} records!`);
  process.exit(0);
}

deleteAllData().catch(e => {
  console.error('Delete Error:', e);
  process.exit(1);
});
