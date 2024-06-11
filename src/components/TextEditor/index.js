import React, { useCallback } from "react";
import CodeEditor from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { closeBrackets } from "@codemirror/autocomplete";
import { hisyeo } from "./hisyeo";

/**
 * @typedef Props
 * @prop {string} value
 * @prop {function(value): void} setValue
 */

/**
 * 
 * @param {Props} props
 * @returns {string}
 */
export default function TextEditor({ value, setValue }) {
  const handleOnChange = useCallback(value => setValue(value), []);

  const theme = EditorView.theme({
    "&": {
      border: `1px solid #64748b`,
      borderRadius: "0.375rem", // tailwindConfig.theme.borderRadius.md,
      overflow: "hidden",
    },
    "&.cm-focused": {
      outline: "none",
      borderColor: "#0f172a",
    },
    ".cm-scroller": {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: "0.875rem",
    },
    ".cm-gutter.cm-lineNumbers": {},
    ".cm-gutters": {
      color: "#64748b",
      borderColor: "#64748b",
      backgroundColor: "#e2e8f0",
    },
    ".cm-activeLine": {
      backgroundColor: "#f1f5f9" / 50,
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: `0 0.5rem 0 0.5rem`,
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
    },
    ".cm-gutterElement.cm-activeLineGutter": {
      color: "#1e3a8a",
      fontWeight: "800",
    },
  });

  return (
    <CodeEditor
      value={value}
      extensions={[hisyeo, theme, closeBrackets()]}
      onChange={handleOnChange}
      indentWithTab={false}
      basicSetup={{
        foldGutter: false,
        lineNumbers: true,
        highlightActiveLineGutter: true,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
        bracketMatching: false,
        closeBrackets: false,
        autocompletion: false,
        rectangularSelection: false,
        crosshairCursor: false,
        highlightActiveLine: true,
        highlightSelectionMatches: false,
        closeBracketsKeymap: false,
        searchKeymap: false,
        foldKeymap: false,
        completionKeymap: false,
        lintKeymap: false,
      }}
    />
  );
}