import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';

// .env.local 수동 파싱
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

async function deleteAllTransactions() {
  console.log('🚀 [강력 삭제] 작업을 시작합니다...');
  let totalDeleted = 0;
  
  while (true) {
    console.log('데이터 확인 중...');
    const snapshot = await getDocs(collection(db, 'transactions'));
    if (snapshot.empty) {
      console.log('남은 데이터가 없습니다.');
      break;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => {
      batch.delete(d.ref);
    });

    await batch.commit();
    totalDeleted += snapshot.size;
    console.log(`✅ ${totalDeleted}건 삭제 완료...`);
    
    // 만약 한 번에 가져온 데이터가 적다면 루프 종료 가능성 확인
    if (snapshot.size < 1) break;
    
    // 너무 빠른 요청 방지를 위해 아주 잠시 대기
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n🎉 모든 데이터 삭제 완료! (총 ${totalDeleted}건)`);
  process.exit(0);
}

deleteAllTransactions().catch(e => {
  console.error('에러 발생:', e);
  process.exit(1);
});
