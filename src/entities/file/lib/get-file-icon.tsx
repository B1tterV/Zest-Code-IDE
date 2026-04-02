import { FC, SVGProps } from 'react';
import { ReactComponent as IconGit } from '@/icons/file-icons/git.svg?skip-colors';
import { ReactComponent as IconHtml } from '@/icons/file-icons/html.svg?skip-colors';
import { ReactComponent as IconJson } from '@/icons/file-icons/json.svg?skip-colors';
import { ReactComponent as IconMarkdown } from '@/icons/file-icons/markdown.svg?skip-colors';
import { ReactComponent as IconReact } from '@/icons/file-icons/react.svg?skip-colors';
import { ReactComponent as IconRust } from '@/icons/file-icons/rust.svg?skip-colors';
import { ReactComponent as IconToml } from '@/icons/file-icons/toml.svg?skip-colors';
import { ReactComponent as IconTypescriptConfig } from '@/icons/file-icons/typescript-config.svg?skip-colors';
import { ReactComponent as IconTypescriptFile } from '@/icons/file-icons/typescript-file.svg?skip-colors';
import { ReactComponent as IconVite } from '@/icons/file-icons/vite.svg?skip-colors';
import { ReactComponent as IconVue } from '@/icons/file-icons/vue.svg?skip-colors';
import { ReactComponent as IconYaml } from '@/icons/file-icons/yaml.svg?skip-colors';
import { ReactComponent as IconFolder } from '@/icons/file-icons/folder.svg?skip-colors';
import { ReactComponent as IconFolderOpen } from '@/icons/file-icons/folder-open.svg?skip-colors';
import { ReactComponent as IconFile } from '@/icons/file-icons/file.svg?skip-colors';
import { ReactComponent as IconCss } from '@/icons/file-icons/css.svg?skip-colors';
import { ReactComponent as IconTailwind } from '@/icons/file-icons/tailwind.svg?skip-colors';
import { ReactComponent as IconVitest } from '@/icons/file-icons/vitest.svg?skip-colors';
import { ReactComponent as IconFont } from '@/icons/file-icons/font.svg?skip-colors';

type IconComponent = FC<SVGProps<SVGSVGElement>>;

export const getFileIcon = (
  name: string, 
  isDir: boolean, 
  isOpen?: boolean,
  stack: string[] = []
): IconComponent => {
  if (isDir) return isOpen ? IconFolderOpen : IconFolder;

  const lowerName = name.toLowerCase();
  const ext = name.split('.').pop()?.toLowerCase();
  
  if (lowerName.includes('vite.config')) return IconVite;
  if (lowerName.includes('tailwind.config')) return IconTailwind;
  if (lowerName === 'tsconfig.json') return IconTypescriptConfig;

  console.log(stack)

  if (ext === 'css') {
    if (stack.includes('tailwindcss')) return IconTailwind;
  }
  
  if (ext === 'ts' || ext === 'js') {
    if (lowerName.includes('test') && stack.includes('vitest')) return IconVitest;
  }

  switch (ext) {
    case 'tsx':
    case 'jsx': return IconReact;
    case 'ts':  return IconTypescriptFile;
    case 'rs':  return IconRust;
    case 'json': return IconJson;
    case 'html': return IconHtml;
    case 'vue':  return IconVue;
    case 'md':   return IconMarkdown;
    case 'env':
    case 'toml': return IconToml;
    case 'yaml':
    case 'yml':  return IconYaml;
    case 'css':  return IconCss;
    case 'gitignore':  return IconGit;
    case 'otf':
    case 'woff':
    case 'woff2':
    case 'eot':
    case 'ttf':  return IconFont;
    default:     return IconFile;
  }
};