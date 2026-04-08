import { FC, useEffect, useRef, memo } from 'react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '@/entities/editor';
import { registerAllSnippets, initMonacoWorkers } from '@/features/intellisense';

interface Props {
  path: string;
  value: string;
  language: string;
  onChange?: (value: string) => void;
}

let isMonacoConfigured = false;

const configureMonaco = () => {
  if (isMonacoConfigured) return;

  initMonacoWorkers();

  const languages = monaco.languages as any;
  
  if (languages.typescript) {
    const tsDefaults = languages.typescript.typescriptDefaults;
    
    tsDefaults.setCompilerOptions({
      target: 99,
      allowNonTsExtensions: true,
      moduleResolution: 2,
      module: 1,
      noEmit: true,
      jsx: 1,
      typeRoots: ["node_modules/@types"],
      allowJs: true,
    });

    tsDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  }

  monaco.editor.defineTheme('zest-dark-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'BB86C0', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'BB86C0' },
      
      { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'type.identifier', foreground: '4EC9B0' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'function', foreground: '9CDCFE' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'identifier', foreground: '9CDCFE' },
      { token: 'variable.predefined', foreground: '9CDCFE' },
      { token: 'storage.type', foreground: 'BB86C0' },
    ],
    colors: {
      'editor.background': '#191919',
      'editor.foreground': '#CFCFCF',
      'editorCursor.foreground': '#256C68',
      'editor.lineHighlightBackground': '#1A1A1A',
      'editor.selectionBackground': '#256C6844',
      'editorLineNumber.foreground': '#858487',
    }
  });

  registerAllSnippets();
  isMonacoConfigured = true;
};

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

  useEffect(() => {
    if (!containerRef.current) return;

    configureMonaco();

    const editor = monaco.editor.create(containerRef.current, {
      value: initialValue.current,
      language,
      theme: 'zest-dark-theme',
      automaticLayout: true,
      fontSize: 13,
      fontFamily: 'Geist Mono',
      minimap: { enabled: false },
      stickyScroll: { enabled: false },
      scrollbar: { 
        verticalScrollbarSize: 8, 
        horizontalScrollbarSize: 8,
        useShadows: false 
      },
      renderLineHighlight: 'all',
      fontLigatures: true,
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