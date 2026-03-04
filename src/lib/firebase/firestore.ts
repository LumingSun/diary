import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';

// 格式化本地日期为 YYYY-MM-DD（避免时区问题）
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface Diary {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string; // 日记日期 (YYYY-MM-DD)
  mood?: string;
  weather?: string;
  aiSummary?: string;
  aiEncouragement?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'diaries';

// 创建日记
export const createDiary = async (
  userId: string,
  title: string,
  content: string,
  date?: string,
  mood?: string,
  weather?: string
) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    userId,
    title,
    content,
    date: date || formatDateLocal(new Date()),
    mood,
    weather,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

// 更新日记
export const updateDiary = async (id: string, data: Partial<Diary>) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

// 删除日记
export const deleteDiary = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

// 获取用户的所有日记
export const getUserDiaries = async (userId: string): Promise<Diary[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Diary));
};

// 获取单篇日记
export const getDiaryById = async (id: string): Promise<Diary | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where('__name__', '==', id)));
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Diary;
};

// 搜索日记
export const searchDiaries = async (userId: string, keyword: string): Promise<Diary[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  const diaries = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Diary));

  // 前端搜索（Firestore 不支持全文搜索）
  return diaries.filter(
    (diary) =>
      diary.title.toLowerCase().includes(keyword.toLowerCase()) ||
      diary.content.toLowerCase().includes(keyword.toLowerCase())
  );
};
