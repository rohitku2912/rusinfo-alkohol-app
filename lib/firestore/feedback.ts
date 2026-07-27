import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { requireDb } from '@/lib/firebase';
import { getOrCreateInstallationId } from '@/lib/storage/installation';

export async function submitFeedback(text: string): Promise<void> {
  const db = requireDb();
  const installationId = await getOrCreateInstallationId();

  await addDoc(collection(db, 'feedback'), {
    text: text.trim(),
    installationId,
    createdAt: serverTimestamp(),
  });
}
