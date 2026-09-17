// Original program/provider marks. Provenance: public/logos/SOURCES.md.
export type ProviderLogoAsset = {
  src: string;
  name: string;
  kind: 'program' | 'provider';
  darkBackground?: boolean;
};

export const providerLogos: Record<string, ProviderLogoAsset> = {
  'bcp-contigo': {
    src: '/logos/bcp.svg',
    name: 'BCP',
    kind: 'provider',
  },
  'aws-activate': {
    src: '/logos/aws-alt.png',
    name: 'Amazon Web Services',
    kind: 'provider',
  },
  'nvidia-inception': {
    src: '/logos/nvidia.png',
    name: 'NVIDIA',
    kind: 'provider',
  },
  'red-cite': {
    src: '/logos/itp.png',
    name: 'Instituto Tecnológico de la Producción',
    kind: 'provider',
  },
  'ruta-exportadora': {
    src: '/logos/promperu.png',
    name: 'PROMPERÚ',
    kind: 'provider',
  },
  'startup-peru': {
    src: '/logos/startup-peru.png',
    name: 'StartUp Perú',
    kind: 'program',
  },
  'uni-incubacion': {
    src: '/logos/startup-uni-alt.png',
    name: 'Startup UNI',
    kind: 'provider',
  },
  'uni-impulso': {
    src: '/logos/startup-uni-alt.png',
    name: 'Startup UNI',
    kind: 'provider',
  },
  'google-cloud': {
    src: '/logos/google-cloud.svg',
    name: 'Google Cloud',
    kind: 'provider',
  },
  nexcamp: {
    src: '/logos/nexum.png',
    name: 'Nexum · PUCP',
    kind: 'provider',
  },
  nexpro: {
    src: '/logos/nexpro.png',
    name: 'Nexpro',
    kind: 'program',
    darkBackground: true,
  },
  'emprende-up': {
    src: '/logos/emprende-up.png',
    name: 'Emprende UP',
    kind: 'provider',
  },
  climatech: {
    src: '/logos/emprende-up.png',
    name: 'Emprende UP',
    kind: 'provider',
  },
  'mibanco-academia': {
    src: '/logos/mibanco-academia.png',
    name: 'Academia del Progreso · Mibanco',
    kind: 'program',
  },
  'alicorp-crecemos': {
    src: '/logos/alicorp.svg',
    name: 'Alicorp',
    kind: 'provider',
  },
  'alicorp-proveedores': {
    src: '/logos/alicorp.svg',
    name: 'Alicorp',
    kind: 'provider',
  },
  'mype-digital': {
    src: '/logos/produce.png',
    name: 'Ministerio de la Producción',
    kind: 'provider',
  },
  'proinnovate-calendario': {
    src: '/logos/proinnovate.png',
    name: 'ProInnóvate',
    kind: 'provider',
  },
  'microsoft-startups': {
    src: '/logos/microsoft.png',
    name: 'Microsoft',
    kind: 'provider',
  },
  'hubspot-bootstrap': {
    src: '/logos/hubspot-startups.png',
    name: 'HubSpot for Startups',
    kind: 'program',
  },
  'notion-startups': {
    src: '/logos/notion.png',
    name: 'Notion',
    kind: 'provider',
  },
  'endeavor-dream': {
    src: '/logos/endeavor.svg',
    name: 'Endeavor Perú',
    kind: 'provider',
  },
  'tu-empresa': {
    src: '/logos/tu-empresa.png',
    name: 'Programa Nacional Tu Empresa',
    kind: 'provider',
  },
  'mujer-produce': {
    src: '/logos/tu-empresa.png',
    name: 'Programa Nacional Tu Empresa',
    kind: 'provider',
  },
};
