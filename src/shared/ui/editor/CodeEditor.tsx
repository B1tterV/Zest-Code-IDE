import { FC, useEffect, useRef, memo } from 'react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '@/entities/editor';

interface Props {
  path: string;
  value: string;
  language: string;
  onChange?: (value: string) => void;
}

export const CodeEditor: FC<Props> = memo(({ path, value, language, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const initialValue = useRef(value);

  const scrollTarget = useEditorStore(s => s.scrollTarget);
  const setScrollTarget = useEditorStore(s => s.setScrollTarget);

  useEffect(() => {
    if (editorRef.current && scrollTarget && scrollTarget.path === path) {
      const { line } = scrollTarget;

      editorRef.current.revealLineInCenter(line);
      editorRef.current.setPosition({ lineNumber: line, column: 1 });
      
      setTimeout(() => {
        editorRef.current?.focus();
        setScrollTarget(null);
      }, 50);
    }
  }, [scrollTarget, path]);

  monaco.editor.defineTheme('zest-dark-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'D73A49' },
      { token: 'string', foreground: '032F62' },
    ],
    colors: {
      'editor.background': '#242424',
      'editor.foreground': '#cccccc',
      'editorCursor.foreground': '#256C68',
      'editor.lineHighlightBackground': '#2a2d2e',
      'editor.selectionBackground': '#256C6844',
      'editorLineNumber.foreground': '#858585',
      'editor.inactiveSelectionBackground': '#3a3d41',
    }
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = monaco.editor.create(containerRef.current, {
      value: initialValue.current,
      language,
      theme: 'zest-dark-theme',
      automaticLayout: true,
      fontSize: 14,
      fontFamily: 'Geist Mono',
      minimap: { enabled: true },
      scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
    });

    editorRef.current = editor;

    const subscription = editor.onDidChangeModelContent(() => {
      const currentVal = editor.getValue();
      onChange?.(currentVal);
    });

    return () => {
      subscription.dispose();
      editor.dispose();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) monaco.editor.setModelLanguage(model, language);
    }
  }, [language]);

  return <div ref={containerRef} className="h-full w-full" />;
});