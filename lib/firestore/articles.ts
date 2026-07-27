import { requireDb } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";

export type TiptapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type TiptapNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: TiptapMark[];
  content?: TiptapNode[];
};

export type TiptapDocument = {
  type: "doc";
  content?: TiptapNode[];
};

export type Article = {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  content: TiptapDocument;
  publishedAt: Timestamp | null;
};

function isTiptapDocument(value: unknown): value is TiptapDocument {
  if (!value || typeof value !== "object") {
    return false;
  }

  const document = value as Partial<TiptapDocument>;

  return (
    document.type === "doc" &&
    (document.content === undefined || Array.isArray(document.content))
  );
}

export function getTiptapText(node: TiptapNode): string {
  const ownText = node.text ?? "";
  const childText = node.content?.map(getTiptapText).join(" ") ?? "";

  return `${ownText} ${childText}`.trim();
}

export async function fetchArticles(): Promise<Article[]> {
  const db = requireDb();

  const [categorySnapshot, articleSnapshot] = await Promise.all([
    getDocs(collection(db, "categories")),
    getDocs(
      query(collection(db, "articles"), where("status", "==", "published")),
    ),
  ]);

  const categoryNames = new Map<string, string>();

  categorySnapshot.docs.forEach((document) => {
    const data = document.data();
    const name = typeof data.name === "string" ? data.name.trim() : "";

    if (name) {
      categoryNames.set(document.id, name);
    }
  });

  return articleSnapshot.docs
    .map((document) => {
      const data = document.data();

      const title = typeof data.title === "string" ? data.title.trim() : "";

      const categoryId =
        typeof data.categoryId === "string" ? data.categoryId.trim() : "";

      if (!title || !categoryId || !isTiptapDocument(data.content)) {
        console.warn(`Skipping invalid article: ${document.id}`);
        return null;
      }

      return {
        id: document.id,
        title,
        categoryId,
        categoryName: categoryNames.get(categoryId) ?? "Ukategorisert",
        content: data.content,
        publishedAt: data.publishedAt ?? null,
      };
    })
    .filter((article): article is Article => article !== null)
    .sort((first, second) => first.title.localeCompare(second.title, "nb"));
}
