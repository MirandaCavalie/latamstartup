// Original program/provider marks. Provenance: public/logos/SOURCES.md.
export type ProviderLogoAsset = {
  src: string;
  name: string;
  kind: 'program' | 'provider';
  darkBackground?: boolean;
};

export const providerLogos: Record<string, ProviderLogoAsset> = {
  'prendho-incubacion': { src: '/logos/prendho.png', name: 'Prendho UTPL', kind: 'provider' },
  'bolivia-plei': { src: '/logos/emprender-futuro.png', name: 'Fundación Emprender Futuro', kind: 'provider' },
  'ande-centros-pymes': { src: '/logos/ande.svg', name: 'ANDE', kind: 'provider' },
  'paraguay-sbdc': { src: '/logos/mic.png', name: 'MIC Paraguay', kind: 'provider' },
  'tec-catalitec': { src: '/logos/tec.svg', name: 'TEC Costa Rica', kind: 'provider' },
  'panama-innovar': { src: '/logos/ciudad-del-saber.svg', name: 'Ciudad del Saber', kind: 'provider' },
  'guatemala-mineco-sde': { src: '/logos/mineco.png', name: 'MINECO Guatemala', kind: 'provider' },
  'honduras-senprende': { src: '/logos/senprende.jpg', name: 'SENPRENDE', kind: 'provider' },
  'salvador-cdmype': { src: '/logos/conamype.jpg', name: 'CONAMYPE', kind: 'provider' },
  'nicaragua-ci-startups': { src: '/logos/centro-innovacion.webp', name: 'Centro de Innovación Nicaragua', kind: 'provider' },
  'dominicana-mipymes-pucmm': { src: '/logos/pucmm.svg', name: 'PUCMM', kind: 'provider' },
  'cuba-taller-emprende': { src: '/logos/cubaemprende.png', name: 'CubaEmprende', kind: 'provider' },
  'haiti-banj-labs': { src: '/logos/banj.png', name: 'Banj', kind: 'provider' },
  'venezuela-impact-hub': { src: '/logos/impact-hub-caracas.svg', name: 'Impact Hub Caracas', kind: 'provider', darkBackground: true },
  'ife-accelerator': {
    src: '/logos/tecnologico-de-monterrey.svg',
    name: 'Tecnológico de Monterrey',
    kind: 'provider',
  },
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
  'incmty-accelerator': { src: '/logos/incmty.svg', name: 'incMTY', kind: 'provider' },
  'startup-mexico-aceleracion': { src: '/logos/startup-mexico.png', name: 'Startup México', kind: 'provider' },
  'nafin-fundamentos': { src: '/logos/nafin.png', name: 'Nacional Financiera', kind: 'provider' },
  '500-latam': { src: '/logos/500-global.svg', name: '500 Global', kind: 'provider' },
  'latitud-fellowship': { src: '/logos/latitud.png', name: 'Latitud', kind: 'provider' },
  'innpulsa-convocatorias': { src: '/logos/innpulsa.png', name: 'iNNpulsa Colombia', kind: 'provider' },
  'fondo-emprender-sena': { src: '/logos/fondo-emprender.svg', name: 'Fondo Emprender', kind: 'program' },
  'rockstart-latam': { src: '/logos/rockstart.svg', name: 'Rockstart', kind: 'provider' },
  'startup-chile-ignite': { src: '/logos/startup-chile.png', name: 'Start-Up Chile', kind: 'provider' },
  'sercotec-capital-semilla': { src: '/logos/sercotec.svg', name: 'Sercotec', kind: 'provider' },
  'platanus-programa': { src: '/logos/platanus.svg', name: 'Platanus', kind: 'provider' },
  'endeavor-argentina-premio': { src: '/logos/endeavor-argentina.svg', name: 'Endeavor Argentina', kind: 'provider' },
  'empretec-taller': { src: '/logos/empretec.png', name: 'Fundación Empretec Argentina', kind: 'provider' },
  'emprendimiento-argentino': { src: '/logos/argentina-gob.svg', name: 'Gobierno de Argentina', kind: 'provider' },
  'sebrae-startups': { src: '/logos/sebrae.svg', name: 'Sebrae', kind: 'provider' },
  'bndes-garagem': { src: '/logos/bndes-garagem.png', name: 'BNDES Garagem', kind: 'program' },
  'brasil-mais-produtivo': { src: '/logos/brasil-mais-produtivo.webp', name: 'Brasil Mais Produtivo', kind: 'program' },
  'puentes-antigravity': { src: '/logos/antigravity.png', name: 'Antigravity Capital', kind: 'provider' },
  'ylai-fellowship': { src: '/logos/ylai.png', name: 'YLAI', kind: 'program' },
  'makers-fellowship': { src: '/logos/makers.png', name: 'Makers Fellowship', kind: 'program' },
};
