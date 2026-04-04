import * as monaco from "monaco-editor";

const snippetModules = import.meta.glob("../config/snippets/**/*.json", {
  eager: true,
});

export const registerAllSnippets = () => {
  const languages = monaco.languages.getLanguages();

  languages.forEach((lang) => {
    monaco.languages.registerCompletionItemProvider(lang.id, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        // Используем Map для дедупликации по префиксу
        const uniqueSnippets = new Map<
          string,
          monaco.languages.CompletionItem
        >();

        for (const path in snippetModules) {
          const fileName = path.toLowerCase();
          const langId = lang.id.toLowerCase();

          if (
            fileName.includes(`/${langId}.json`) ||
            fileName.includes(`/${langId}/`)
          ) {
            const module: any = snippetModules[path];
            const content = module.default || module;

            if (content && typeof content === "object") {
              Object.entries(content).forEach(([name, s]: [string, any]) => {
                const prefix = s.prefix || name;

                // Если такой префикс уже есть в Map — пропускаем (оставляем первый найденный)
                if (uniqueSnippets.has(prefix)) return;

                if (!s.prefix && !s.body) return;

                uniqueSnippets.set(prefix, {
                  label: prefix,
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  documentation: s.description || name,
                  insertText: Array.isArray(s.body)
                    ? s.body.join("\n")
                    : s.body,
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  range: range,
                  sortText: prefix,
                });
              });
            }
          }
        }

        // Превращаем Map обратно в массив
        return {
          suggestions: Array.from(uniqueSnippets.values()),
          incomplete: false,
        };
      },
    });
  });
};
