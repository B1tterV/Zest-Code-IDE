import { FC, useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface Props {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
}

export const CodeEditor: FC<Props> = ({ value, language = 'typescript', onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  monaco.editor.defineTheme('zest-dark-theme', {
    base: 'vs-dark', // На чем основываемся (vs, vs-dark, hc-black)
    inherit: true,   // Наследовать ли дефолтные правила подсветки
    rules: [
      { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'D73A49' },
      { token: 'string', foreground: '032F62' },
      // Сюда можно добавить специфические токены для твоего дизайна
    ],
    colors: {
      // ГЛАВНОЕ: Твои цвета из Figma
      'editor.background': '#242424', // Поставь сюда свой --color-background
      'editor.foreground': '#cccccc', // Основной текст
      'editorCursor.foreground': '#256C68', // Твой цвет #256C68
      'editor.lineHighlightBackground': '#2a2d2e', // Цвет активной строки
      'editor.selectionBackground': '#256C6844', // Цвет выделения (с прозрачностью)
      'editorLineNumber.foreground': '#858585',
      'editor.inactiveSelectionBackground': '#3a3d41',
    }
  });

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value,
        language,
        theme: 'zest-dark-theme',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: 'Geist Mono',
        minimap: { enabled: true },
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
      });

      editorRef.current.onDidChangeModelContent(() => {
        onChange?.(editorRef.current?.getValue() || '');
      });
    }

    return () => editorRef.current?.dispose();
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
};