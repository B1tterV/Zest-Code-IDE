import { setupTypeAcquisition } from '@typescript/ata';
import * as ts from 'typescript';
import * as monaco from 'monaco-editor';

export const createATA = () => {
  return setupTypeAcquisition({
    projectName: 'zest-code-runtime',
    typescript: ts,
    delegate: {
      receivedFile: (code, path) => {
        const virtualPath = `file:///node_modules/${path}`;
        (monaco.languages as any).typescript.typescriptDefaults.addExtraLib(code, virtualPath);
        (monaco.languages as any).typescript.javascriptDefaults.addExtraLib(code, virtualPath);
      }
    }
  });
};