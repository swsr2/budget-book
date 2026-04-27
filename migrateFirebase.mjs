import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteField } from 'firebase/firestore';

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

function mapCategory(docData) {
  let cat = docData.category || '';
  let sub = docData.subCategory || '';
  let type = docData.type || 'expense';

  if (type === 'income' || type === 'transfer') {
    return { type, category: cat };
  }

  if (cat === '식비') {
    if (sub === '식료품') return { type: 'expense', category: '마트/편의점' };
    return { type: 'expense', category: '외식' };
  }
  if (cat === '자동차') return { type: 'expense', category: '교통' };
  if (cat === '쇼핑') return { type: 'expense', category: '쇼핑/미용' };
  if (cat === '문화생활') return { type: 'expense', category: '문화/여가' };
  if (cat === '구독') return { type: 'expense', category: '문화/여가' };
  if (cat === '건강') return { type: 'expense', category: '의료/건강' };
  if (cat === '저축') {
    if (sub === '주식투자' || sub === '투자') return { type: 'transfer', category: '투자' };
    return { type: 'transfer', category: '저축' };
  }
  if (cat === '예비비') return { type: 'expense', category: '기타' };
  if (cat === '통신비') return { type: 'expense', category: '통신' };
  if (cat === '생활용품') return { type: 'expense', category: '생활편의' };
  if (cat === '자기계발') return { type: 'expense', category: '교육' };
  if (cat === '미용') return { type: 'expense', category: '쇼핑/미용' };
  
  const validExpenses = ['주거', '통신', '보험', '외식', '마트/편의점', '생활편의', '문화/여가', '여행', '교육', '육아', '교통', '의료/건강', '쇼핑/미용', '경조사', '용돈', '세금/공과금', '기타'];
  
  if (validExpenses.includes(cat)) {
    return { type: 'expense', category: cat };
  }

  return { type: 'expense', category: '기타' };
}

async function migrateData() {
  console.log('Fetching data from Firebase for migration...');
  const txsCol = collection(db, 'transactions');
  const snapshot = await getDocs(txsCol);
  
  let count = 0;

  for (const document of snapshot.docs) {
    const data = document.data();
    const mapped = mapCategory(data);
    
    // We update type and category, and remove subCategory
    const docRef = doc(db, 'transactions', document.id);
    await updateDoc(docRef, {
      type: mapped.type,
      category: mapped.category,
      subCategory: deleteField()
    });
    
    count++;
    console.log(`Updated doc ${document.id}: ${data.category}(${data.subCategory||''}) -> [${mapped.type}] ${mapped.category}`);
  }

  console.log(`Successfully migrated ${count} records!`);
  process.exit(0);
}

migrateData().catch(e => {
  console.error('Migration Error:', e);
  process.exit(1);
});
