/**
 * Helper to resolve static asset URLs safely in all environments:
 * - AI Studio preview (served at root /)
 * - GitHub Pages with repo subpath (e.g. /DashBoard-UTBK/ or /dashboard-utbk/)
 * - Custom domain or relative deployments (./)
 */
export function getAssetUrl(relativePath: string): string {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${cleanBase}${cleanPath}`;
}

export const TESLA_LOGO_ICON = getAssetUrl('assets/aistudio/Dokumen_dari_RNA__1__5243d24d.png');
export const TESLA_LOGO_BANNER = getAssetUrl('assets/aistudio/Dokumen_dari_RNA_462b1175.png');
