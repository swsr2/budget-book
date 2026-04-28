import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const envFile = fs.readFileSync('c:/Users/skstk/Desktop/next-project/.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [k, ...v] = line.split('=');
    envVars[k.trim()] = v.join('=').trim();
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

async function clearData() {
  console.log('Firebase에 저장된 데이터를 불러오는 중...');
  const txsCol = collection(db, 'transactions');
  const snapshot = await getDocs(txsCol);
  
  let count = 0;
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, 'transactions', document.id));
    count++;
    console.log(`삭제됨: ${document.id}`);
  }
  
  console.log(`완료! 총 ${count}개의 내역을 모두 삭제했습니다.`);
  process.exit(0);
}

clearData().catch(e => {
  console.error('삭제 중 에러 발생:', e);
  process.exit(1);
});
