import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Article = {
  id: string;
  header: string;
  kategori: string;
  preamble: string;
  body: string;
  imageUrl?: string;
};

function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function fetchArticles(): Promise<Article[]> {
  const snapshot = await getDocs(collection(db, 'articles'));
  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      const header = toText(data.header);

      if (!header) {
        console.warn(`Skipping article ${doc.id}: missing header.`);
        return null;
      }

      const imageUrl = toText(data.imageUrl);

      return {
        id: doc.id,
        header,
        kategori: toText(data.kategori) || 'Ukategorisert',
        preamble: toText(data.preamble),
        body: toText(data.body),
        ...(imageUrl ? { imageUrl } : {}),
      };
    })
    .filter((article): article is Article => article !== null);
}
