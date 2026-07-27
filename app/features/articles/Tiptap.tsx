import type {
    TiptapDocument,
    TiptapMark,
    TiptapNode,
} from "@/lib/firestore/articles";
import { Image } from "expo-image";
import {
    Alert,
    Linking,
    StyleSheet,
    Text,
    type TextStyle,
    View,
} from "react-native";

type Props = {
  document: TiptapDocument;
  articleTitle?: string;
};

function getNodeText(node: TiptapNode): string {
  return [node.text ?? "", ...(node.content?.map(getNodeText) ?? [])]
    .join("")
    .trim();
}

function getMarkStyle(marks: TiptapMark[] = []): TextStyle {
  const hasBold = marks.some((mark) => mark.type === "bold");
  const hasItalic = marks.some((mark) => mark.type === "italic");
  const hasUnderline = marks.some((mark) => mark.type === "underline");
  const hasStrike = marks.some((mark) => mark.type === "strike");
  const hasLink = marks.some((mark) => mark.type === "link");

  const decorations: TextStyle["textDecorationLine"][] = [];

  if (hasUnderline || hasLink) {
    decorations.push("underline");
  }

  if (hasStrike) {
    decorations.push("line-through");
  }

  return {
    ...(hasBold ? { fontWeight: "700" } : {}),
    ...(hasItalic ? { fontStyle: "italic" } : {}),
    ...(decorations.length > 0
      ? {
          textDecorationLine:
            decorations.length > 1 ? "underline line-through" : decorations[0],
        }
      : {}),
    ...(hasLink ? { color: "#466441" } : {}),
  };
}

function getLink(marks: TiptapMark[] = []): string | null {
  const linkMark = marks.find((mark) => mark.type === "link");
  const href = linkMark?.attrs?.href;

  return typeof href === "string" ? href : null;
}

async function openLink(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      throw new Error("Unsupported URL");
    }

    await Linking.openURL(url);
  } catch {
    Alert.alert("Kunne ikke åpne lenken");
  }
}

function renderInline(node: TiptapNode, key: string): React.ReactNode {
  if (node.type === "text") {
    const link = getLink(node.marks);

    return (
      <Text
        key={key}
        style={getMarkStyle(node.marks)}
        onPress={link ? () => openLink(link) : undefined}
      >
        {node.text}
      </Text>
    );
  }

  if (node.type === "hardBreak") {
    return "\n";
  }

  return node.content?.map((child, index) =>
    renderInline(child, `${key}-${index}`),
  );
}

function renderListItem(node: TiptapNode, key: string, marker: string) {
  return (
    <View key={key} style={styles.listItem}>
      <Text style={styles.listMarker}>{marker}</Text>

      <View style={styles.listItemContent}>
        {node.content?.map((child, index) => {
          if (child.type === "paragraph") {
            return (
              <Text key={`${key}-${index}`} style={styles.paragraph}>
                {child.content?.map((inlineNode, inlineIndex) =>
                  renderInline(inlineNode, `${key}-${index}-${inlineIndex}`),
                )}
              </Text>
            );
          }

          return renderBlock(child, `${key}-${index}`);
        })}
      </View>
    </View>
  );
}

function renderBlock(node: TiptapNode, key: string): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <Text key={key} style={styles.paragraph}>
          {node.content?.map((child, index) =>
            renderInline(child, `${key}-${index}`),
          )}
        </Text>
      );

    case "heading": {
      const level =
        typeof node.attrs?.level === "number" ? node.attrs.level : 2;

      return (
        <Text
          key={key}
          style={[
            styles.heading,
            level === 1
              ? styles.headingOne
              : level === 2
                ? styles.headingTwo
                : styles.headingThree,
          ]}
        >
          {node.content?.map((child, index) =>
            renderInline(child, `${key}-${index}`),
          )}
        </Text>
      );
    }

    case "image": {
      const src = node.attrs?.src;
      const alt = node.attrs?.alt;

      if (typeof src !== "string" || !src) {
        return null;
      }

      return (
        <View key={key} style={styles.imageContainer}>
          <Image
            source={{ uri: src }}
            style={styles.image}
            contentFit="cover"
            transition={180}
            accessibilityLabel={typeof alt === "string" ? alt : undefined}
          />
        </View>
      );
    }

    case "bulletList":
      return (
        <View key={key} style={styles.list}>
          {node.content?.map((item, index) =>
            renderListItem(item, `${key}-${index}`, "•"),
          )}
        </View>
      );

    case "orderedList": {
      const start =
        typeof node.attrs?.start === "number" ? node.attrs.start : 1;

      return (
        <View key={key} style={styles.list}>
          {node.content?.map((item, index) =>
            renderListItem(item, `${key}-${index}`, `${start + index}.`),
          )}
        </View>
      );
    }

    case "blockquote":
      return (
        <View key={key} style={styles.blockquote}>
          {node.content?.map((child, index) =>
            renderBlock(child, `${key}-${index}`),
          )}
        </View>
      );

    case "horizontalRule":
      return <View key={key} style={styles.horizontalRule} />;

    default:
      return (
        <View key={key}>
          {node.content?.map((child, index) =>
            renderBlock(child, `${key}-${index}`),
          )}
        </View>
      );
  }
}

export default function TiptapRenderer({ document, articleTitle }: Props) {
  let nodes = document.content ?? [];

  // Avoid rendering the title twice when the Tiptap document starts
  // with the same level-one heading as the article title.
  const firstNode = nodes[0];

  if (
    articleTitle &&
    firstNode?.type === "heading" &&
    firstNode.attrs?.level === 1 &&
    getNodeText(firstNode).toLocaleLowerCase("nb") ===
      articleTitle.trim().toLocaleLowerCase("nb")
  ) {
    nodes = nodes.slice(1);
  }

  return (
    <View>
      {nodes.map((node, index) => renderBlock(node, `block-${index}`))}
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    color: "#555",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 14,
  },
  heading: {
    color: "#263126",
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 12,
  },
  headingOne: {
    fontSize: 24,
    lineHeight: 30,
  },
  headingTwo: {
    fontSize: 21,
    lineHeight: 27,
  },
  headingThree: {
    fontSize: 18,
    lineHeight: 24,
  },
  imageContainer: {
    marginBottom: 18,
    marginTop: 4,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: "#e8e8e3",
  },
  list: {
    marginBottom: 14,
  },
  listItem: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  listMarker: {
    color: "#555",
    fontSize: 15,
    lineHeight: 24,
    width: 24,
  },
  listItemContent: {
    flex: 1,
  },
  blockquote: {
    borderLeftColor: "#8b9c84",
    borderLeftWidth: 3,
    marginBottom: 14,
    paddingLeft: 14,
  },
  horizontalRule: {
    backgroundColor: "#d9ddd6",
    height: 1,
    marginVertical: 18,
  },
});
