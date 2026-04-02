export const getProjectName = (path: string | null): string => {
  if (!path) return '';
  const normalizedPath = path.replace(/[\\/]$/, '');
  return normalizedPath.split(/[\\/]/).pop() || path;
};