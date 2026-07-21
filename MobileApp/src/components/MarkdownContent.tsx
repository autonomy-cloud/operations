import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import { useTheme } from "../theme";
import { toPlainText } from "../utils/text";

export interface MarkdownContentProps {
  content: unknown;
  variant?: "primary" | "secondary";
}

const MAX_MARKDOWN_LENGTH: number = 50_000;

interface MarkdownLine {
  kind: "blank" | "code" | "heading" | "list" | "quote" | "paragraph";
  text: string;
}

function parseMarkdownLines(markdown: string): Array<MarkdownLine> {
  const lines: Array<string> = markdown.split("\n");
  const parsed: Array<MarkdownLine> = [];
  let inCodeBlock: boolean = false;

  for (const rawLine of lines) {
    const trimmed: string = rawLine.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      parsed.push({ kind: "code", text: rawLine });
      continue;
    }

    if (!trimmed) {
      parsed.push({ kind: "blank", text: "" });
      continue;
    }

    let headingLength: number = 0;
    while (
      headingLength < trimmed.length &&
      headingLength < 6 &&
      trimmed[headingLength] === "#"
    ) {
      headingLength += 1;
    }
    if (
      headingLength > 0 &&
      trimmed.length > headingLength &&
      trimmed[headingLength] === " "
    ) {
      parsed.push({
        kind: "heading",
        text: trimmed.slice(headingLength + 1),
      });
      continue;
    }

    if (
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      trimmed.startsWith("+ ")
    ) {
      parsed.push({ kind: "list", text: `• ${trimmed.slice(2)}` });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      parsed.push({ kind: "quote", text: trimmed.slice(2) });
      continue;
    }

    parsed.push({ kind: "paragraph", text: rawLine });
  }

  return parsed;
}

export default function MarkdownContent({
  content,
  variant = "primary",
}: MarkdownContentProps): React.JSX.Element {
  const { theme } = useTheme();
  const rawText: string = toPlainText(content);
  const wasTruncated: boolean = rawText.length > MAX_MARKDOWN_LENGTH;
  const markdownText: string = rawText.slice(0, MAX_MARKDOWN_LENGTH);
  const isSecondary: boolean = variant === "secondary";
  const fontSize: number = isSecondary ? 13 : 14;
  const textColor: string = isSecondary
    ? theme.colors.textSecondary
    : theme.colors.textPrimary;
  const lines: Array<MarkdownLine> = parseMarkdownLines(markdownText);

  const styles: ReturnType<typeof StyleSheet.create> = StyleSheet.create({
    container: {
      gap: 4,
    },
    text: {
      color: textColor,
      fontSize,
      lineHeight: 22,
    },
    heading: {
      color: textColor,
      fontSize: fontSize + 2,
      fontWeight: "700",
      lineHeight: 24,
      marginTop: 4,
    },
    list: {
      color: textColor,
      fontSize,
      lineHeight: 22,
      paddingLeft: 8,
    },
    quote: {
      borderLeftColor: theme.colors.borderDefault,
      borderLeftWidth: 3,
      color: textColor,
      fontSize,
      fontStyle: "italic",
      lineHeight: 22,
      paddingLeft: 10,
    },
    code: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 6,
      color: textColor,
      fontFamily: "monospace",
      fontSize,
      lineHeight: 20,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    spacer: {
      height: 4,
    },
    truncated: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontStyle: "italic",
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      {lines.map((line: MarkdownLine, index: number) => {
        if (line.kind === "blank") {
          return <View key={`line-${index}`} style={styles.spacer} />;
        }

        const lineStyle: StyleProp<TextStyle> =
          line.kind === "heading"
            ? styles.heading
            : line.kind === "list"
              ? styles.list
              : line.kind === "quote"
                ? styles.quote
                : line.kind === "code"
                  ? styles.code
                  : styles.text;

        return (
          <Text key={`line-${index}`} selectable style={lineStyle}>
            {line.text}
          </Text>
        );
      })}
      {wasTruncated ? (
        <Text style={styles.truncated}>
          Content truncated for safe display.
        </Text>
      ) : null}
    </View>
  );
}
