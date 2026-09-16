export type Category =
  | 'incubacion'
  | 'financiamiento'
  | 'herramientas'
  | 'capacitacion'
  | 'asesoria'
  | 'mercados';
export type Stage = 'idea' | 'prototipo' | 'ventas' | 'crecimiento';
export type BusinessType = 'startup' | 'negocio';
export type Need =
  | 'capital'
  | 'mentoria'
  | 'tecnologia'
  | 'aprender'
  | 'vender'
  | 'formalizar';
export type Sector =
  | 'tecnologia'
  | 'gastronomia'
  | 'agro'
  | 'comercio'
  | 'servicios'
  | 'industria'
  | 'sostenibilidad'
  | 'otro';
export type Profile = {
  stage: Stage;
  businessType: BusinessType;
  sector: Sector;
  needs: Need[];
  region: string;
};
export type Opportunity = {
  id: string;
  name: string;
  org: string;
  orgType: 'Estado' | 'Universidad' | 'Empresa' | 'Organización';
  category: Category;
  resource: boolean;
  description: string;
  benefit: string;
  benefitType:
    | 'Subvención'
    | 'Créditos de uso'
    | 'Descuento'
    | 'Formación'
    | 'Acompañamiento'
    | 'Acceso comercial'
    | 'Directorio';
  cost: 'gratis' | 'pago' | 'condicionado' | 'consultar';
  costLabel: string;
  mark: string;
  color: string;
  url: string;
  sourceUrl?: string;
  stages: Stage[];
  businessTypes: BusinessType[];
  sectors: Sector[] | 'todos';
  needs: Need[];
  geography: 'Perú' | 'Global';
  location: string;
  mode: 'Virtual' | 'Presencial' | 'Híbrido' | 'Por confirmar';
  status: 'open' | 'ongoing' | 'consult' | 'closed';
  opensAt?: string;
  closesAt?: string;
  benefits: string[];
  requirements: string[];
  note: string;
  checkedAt: string;
};

export const categoryLabels: Record<Category, string> = {
  incubacion: 'Incubación y mentoría',
  financiamiento: 'Financiamiento',
  herramientas: 'Herramientas y beneficios',
  capacitacion: 'Capacitación',
  asesoria: 'Asesoría y servicios',
  mercados: 'Acceso a mercados',
};
export const stageLabels: Record<Stage, string> = {
  idea: 'Tengo una idea',
  prototipo: 'Tengo un prototipo',
  ventas: 'Ya tengo ventas',
  crecimiento: 'Quiero escalar',
};
export const needLabels: Record<Need, string> = {
  capital: 'Conseguir financiamiento',
  mentoria: 'Recibir mentoría',
  tecnologia: 'Acceder a herramientas',
  aprender: 'Aprender y capacitarme',
  vender: 'Llegar a más clientes',
  formalizar: 'Formalizar mi negocio',
};
export const sectorLabels: Record<Sector, string> = {
  tecnologia: 'Tecnología',
  gastronomia: 'Gastronomía y alimentos',
  agro: 'Agro y agroindustria',
  comercio: 'Comercio',
  servicios: 'Servicios',
  industria: 'Industria y manufactura',
  sostenibilidad: 'Sostenibilidad',
  otro: 'Otro sector',
};
export const regions = [
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali',
];
export const CATALOG_REVIEWED = '2026-09-16';
const allStages: Stage[] = ['idea', 'prototipo', 'ventas', 'crecimiento'];
const activeStages: Stage[] = ['prototipo', 'ventas', 'crecimiento'];
const both: BusinessType[] = ['startup', 'negocio'];
const base = {
  resource: false,
  stages: allStages,
  businessTypes: both,
  sectors: 'todos' as const,
  geography: 'Perú' as const,
  location: 'Todo Perú',
  mode: 'Por confirmar' as const,
  status: 'consult' as const,
  cost: 'consultar' as const,
  costLabel: 'Consultar condiciones',
  checkedAt: CATALOG_REVIEWED,
};

export const opportunities: Opportunity[] = [
  {
    ...base,
    id: 'startup-peru',
    name: 'StartUp Perú',
    org: 'ProInnóvate · PRODUCE',
    orgType: 'Estado',
    category: 'financiamiento',
    description:
      'Capital semilla y acompañamiento para emprendimientos innovadores con potencial de crecimiento.',
    benefit: 'Capital semilla concursable',
    benefitType: 'Subvención',
    mark: 'SP',
    color: 'rose',
    url: 'https://www.gob.pe/institucion/proinnovate/campa%C3%B1as/4434-startup-peru',
    stages: activeStages,
    businessTypes: ['startup'],
    needs: ['capital', 'mentoria'],
    cost: 'condicionado',
    costLabel: 'Cofinanciamiento según concurso',
    benefits: [
      'Capital semilla para proyectos seleccionados.',
      'Acompañamiento de entidades de soporte al emprendimiento.',
    ],
    requirements: [
      'Ventaja competitiva basada en innovación y potencial de crecimiento.',
      'Revisar la categoría, las bases vigentes y los requisitos del equipo.',
      'La contrapartida y los montos dependen del concurso.',
    ],
    note: 'La iniciativa reúne distintas convocatorias. Consulta la edición vigente antes de preparar tu postulación.',
  },
  {
    ...base,
    id: 'aws-activate',
    name: 'AWS Activate',
    org: 'Amazon Web Services',
    orgType: 'Empresa',
    category: 'herramientas',
    resource: true,
    description:
      'Créditos de nube y recursos técnicos para construir tu producto y reducir sus costos iniciales.',
    benefit: 'Créditos para servicios AWS',
    benefitType: 'Créditos de uso',
    mark: 'aws',
    color: 'orange',
    url: 'https://aws.amazon.com/aws-startups/learn/applying-for-aws-activate-credits-a-step-by-step-guide/',
    stages: activeStages,
    businessTypes: ['startup'],
    needs: ['tecnologia'],
    geography: 'Global',
    location: 'Online · programa global',
    mode: 'Virtual',
    status: 'ongoing',
    cost: 'condicionado',
    costLabel: 'Créditos sujetos a aprobación',
    benefits: [
      'Créditos aplicables a servicios elegibles de AWS.',
      'Recursos técnicos, formación y orientación para startups.',
    ],
    requirements: [
      'Empresa creada en los últimos 10 años y sitio web funcional.',
      'El nivel Founders está dirigido a startups autofinanciadas nuevas en Activate.',
      'Portfolio requiere vinculación con un proveedor de Activate y su ID.',
      'Revisar límites por etapa, créditos previos y condiciones territoriales.',
    ],
    note: 'Son créditos de consumo, no dinero en efectivo. El excedente, los servicios excluidos y el consumo posterior al vencimiento pueden generar cargos.',
  },
  {
    ...base,
    id: 'bcp-contigo',
    name: 'Contigo Emprendedor',
    org: 'BCP',
    orgType: 'Empresa',
    category: 'capacitacion',
    resource: true,
    description:
      'Cursos, asesorías y herramientas para tu negocio. Puedes acceder aunque no seas cliente del banco.',
    benefit: 'Capacitación y recursos gratuitos',
    benefitType: 'Formación',
    mark: 'BCP',
    color: 'blue',
    url: 'https://www.viabcp.com/contigo-emprendedor-bcp',
    needs: ['aprender', 'vender', 'formalizar'],
    mode: 'Virtual',
    status: 'ongoing',
    cost: 'gratis',
    costLabel: 'Gratis · sin ser cliente',
    benefits: [
      'Capacitaciones y herramientas de gestión empresarial.',
      'Guías de WhatsApp Business y plantillas de gestión.',
      'Acceso a iniciativas de acompañamiento con requisitos propios.',
    ],
    requirements: [
      'Emprendedores, micro y pequeños empresarios de Perú.',
      'Cada iniciativa puede exigir negocio en marcha, RUC u otros requisitos.',
      'El contenido general no exige ser cliente del BCP.',
    ],
    note: 'La gratuidad del contenido no significa admisión automática a premios o programas con cupos.',
  },
  {
    ...base,
    id: 'uni-incubacion',
    name: 'Incubación Startup UNI',
    org: 'Universidad Nacional de Ingeniería',
    orgType: 'Universidad',
    category: 'incubacion',
    description:
      'Formación y mentorías para equipos que ya tienen un prototipo funcional o primeras señales de tracción.',
    benefit: 'Postula hasta el 25 sep. 2026',
    benefitType: 'Acompañamiento',
    mark: 'UNI',
    color: 'burgundy',
    url: 'https://startup.uni.edu.pe/programas/incubacion',
    stages: ['prototipo', 'ventas'],
    businessTypes: ['startup'],
    needs: ['mentoria', 'capital', 'vender'],
    location: 'Lima · consultar modalidad',
    status: 'open',
    opensAt: '2026-08-10T00:00:00-05:00',
    closesAt: '2026-09-25T23:59:00-05:00',
    benefits: [
      'Talleres en finanzas, ventas y preparación para inversión.',
      'Mentoría, comunidad y respaldo para financiamiento.',
      'Premios de capital semilla para los mejores equipos del Demo Day.',
    ],
    requirements: [
      'Prototipo funcional, producto mínimo viable o tracción inicial.',
      'Equipo definido y compromiso con las actividades.',
      'No admite proyectos que solo estén en etapa de idea.',
    ],
    note: 'La página indica 10 vacantes. Confirma costos y modalidad en las bases oficiales. Los premios no se entregan a todos los participantes.',
  },
  {
    ...base,
    id: 'google-cloud',
    name: 'Google Cloud for Startups',
    org: 'Google',
    orgType: 'Empresa',
    category: 'herramientas',
    resource: true,
    description:
      'Créditos de infraestructura y apoyo técnico para startups tecnológicas, según su etapa.',
    benefit: 'Créditos de nube por nivel',
    benefitType: 'Créditos de uso',
    mark: 'G',
    color: 'blue',
    url: 'https://cloud.google.com/startup/benefits?hl=es-419',
    stages: activeStages,
    businessTypes: ['startup'],
    needs: ['tecnologia'],
    geography: 'Global',
    location: 'Online · programa global',
    mode: 'Virtual',
    status: 'ongoing',
    cost: 'condicionado',
    costLabel: 'Beneficio sujeto a elegibilidad',
    benefits: [
      'Créditos de Google Cloud según el nivel aprobado.',
      'Formación técnica y beneficios adicionales de productos Google.',
    ],
    requirements: [
      'Start: startup tecnológica con MVP funcional y planes de buscar capital de riesgo.',
      'Requisitos de antigüedad y créditos anteriores según nivel.',
      'Scale exige financiamiento elegible; las condiciones difieren de Start.',
      'Revisar exclusiones para agencias, consultoras y otras actividades.',
    ],
    note: 'No equivale a efectivo ni garantiza el monto máximo anunciado. Verifica elegibilidad territorial, servicios cubiertos, copagos y vencimiento.',
  },
  {
    ...base,
    id: 'tu-empresa',
    name: 'Tu Empresa · Centros CDE',
    org: 'Ministerio de la Producción',
    orgType: 'Estado',
    category: 'asesoria',
    resource: true,
    description:
      'Encuentra orientación y acompañamiento para formalizar tu negocio a través de la red de centros empresariales.',
    benefit: 'Acompañamiento para formalizar',
    benefitType: 'Acompañamiento',
    mark: 'TE',
    color: 'green',
    url: 'https://www.gob.pe/institucion/tuempresa/campa%C3%B1as/74558-conoce-sobre-los-centros-de-desarrollo-empresarial-cde-agente',
    needs: ['formalizar', 'aprender'],
    mode: 'Presencial',
    status: 'ongoing',
    cost: 'condicionado',
    costLabel: 'Asesoría gratis · gastos según trámite',
    benefits: [
      'Orientación sobre formalización de empresas.',
      'Acceso a centros y aliados en distintas regiones.',
      'Tarifas preferenciales con notarías aliadas según condiciones.',
    ],
    requirements: [
      'Consultar el centro de atención correspondiente a tu región.',
      'Reunir los documentos que solicite el centro para tu caso.',
    ],
    note: 'La asesoría es gratuita. Confirma los gastos notariales y las exoneraciones aplicables; formalizar no es necesariamente un trámite sin costo.',
  },
  {
    ...base,
    id: 'nexcamp',
    name: 'NEXCAMP',
    org: 'Nexum · PUCP',
    orgType: 'Universidad',
    category: 'incubacion',
    description:
      'Aceleración para startups con ventas y un modelo de negocio definido que buscan crecer hacia nuevos mercados.',
    benefit: 'Aceleración y conexiones',
    benefitType: 'Acompañamiento',
    mark: 'NX',
    color: 'blue',
    url: 'https://cide.pucp.edu.pe/nexum/programa-aceleracion/',
    stages: ['ventas', 'crecimiento'],
    businessTypes: ['startup'],
    needs: ['mentoria', 'vender', 'capital'],
    location: 'Lima · consultar modalidad',
    benefits: [
      'Acompañamiento para fortalecer y acelerar el negocio.',
      'Conexiones con el ecosistema de emprendimiento.',
    ],
    requirements: [
      'Startup en etapa avanzada con modelo de negocio definido.',
      'Ventas demostrables y visión de expansión internacional.',
      'Revisar requisitos, fechas y costo de la edición vigente.',
    ],
    note: 'La página describe el programa; no se ha confirmado una convocatoria abierta para esta fecha.',
  },
  {
    ...base,
    id: 'emprende-up',
    name: 'Incubación Emprende UP',
    org: 'Universidad del Pacífico',
    orgType: 'Universidad',
    category: 'incubacion',
    description:
      'Acompañamiento para afinar un modelo de negocio innovador y convertirlo en una empresa sostenible.',
    benefit: 'Mentoría y desarrollo de negocio',
    benefitType: 'Acompañamiento',
    mark: 'UP',
    color: 'blue',
    url: 'https://emprendeup.pe/incubacion/',
    stages: activeStages,
    needs: ['mentoria', 'vender'],
    location: 'Lima · consultar modalidad',
    benefits: [
      'Mentores y asesorías para desarrollar el modelo de negocio.',
      'Conexiones con el ecosistema emprendedor.',
    ],
    requirements: [
      'Emprendimiento innovador, dinámico y con potencial de escalar.',
      'Proceso de admisión propio del programa.',
      'Revisar políticas sobre participación simultánea en otros programas.',
    ],
    note: 'La página conserva referencias a ediciones anteriores. Confirma convocatoria, duración y tarifas con Emprende UP.',
  },
  {
    ...base,
    id: 'climatech',
    name: 'ClimaTech',
    org: 'Emprende UP',
    orgType: 'Universidad',
    category: 'incubacion',
    description:
      'Iniciativa que conecta emprendimientos y actores del ecosistema para desarrollar soluciones frente a la crisis climática.',
    benefit: 'Apoyo a emprendimientos verdes',
    benefitType: 'Acompañamiento',
    mark: 'CT',
    color: 'green',
    url: 'https://emprendeup.pe/climatech/',
    needs: ['mentoria', 'aprender'],
    sectors: ['sostenibilidad', 'agro', 'industria', 'tecnologia'],
    benefits: [
      'Programas de incubación y actividades de formación.',
      'Conexiones con academia, empresas y sector público.',
    ],
    requirements: [
      'Propuesta vinculada con soluciones climáticas o sostenibilidad.',
      'Confirmar criterios y calendario de la actividad específica.',
    ],
    note: 'La disponibilidad y los beneficios dependen de cada actividad. La afinidad temática no garantiza elegibilidad.',
  },
  {
    ...base,
    id: 'mibanco-academia',
    name: 'Academia del Progreso',
    org: 'Mibanco',
    orgType: 'Empresa',
    category: 'capacitacion',
    resource: true,
    description:
      'Aprende sobre gestión del negocio, salud crediticia y ventas digitales con cursos a tu ritmo.',
    benefit: 'Cursos gratuitos online',
    benefitType: 'Formación',
    mark: 'Mi',
    color: 'green',
    url: 'https://academiadelprogreso.mibanco.com.pe/',
    needs: ['aprender', 'vender'],
    mode: 'Virtual',
    status: 'ongoing',
    cost: 'gratis',
    costLabel: 'Gratis',
    benefits: [
      'Cursos y contenidos digitales de educación financiera.',
      'Test del Emprendedor Digital y webinars.',
      'Cursos con certificación según condiciones de la plataforma.',
    ],
    requirements: [
      'Acceso a internet.',
      'Revisar las condiciones de registro y de cada curso.',
    ],
    note: 'Capacitarte no implica contratar un crédito ni garantiza su aprobación.',
  },
  {
    ...base,
    id: 'alicorp-crecemos',
    name: 'Crecemos Juntos',
    org: 'Alicorp',
    orgType: 'Empresa',
    category: 'capacitacion',
    resource: true,
    description:
      'Formación para mejorar la gestión, las ventas y la operación de panaderías, restaurantes y otros negocios.',
    benefit: 'Formación para negocios',
    benefitType: 'Formación',
    mark: 'a',
    color: 'rose',
    url: 'https://crecemosjuntos.com.pe/',
    sourceUrl:
      'https://www.alicorp.com.pe/media/PDF/REPORTE-INTEGRADO-ALICORP-2024-VF.pdf',
    stages: ['prototipo', 'ventas', 'crecimiento'],
    businessTypes: ['negocio'],
    sectors: ['gastronomia', 'servicios'],
    needs: ['aprender', 'vender'],
    mode: 'Virtual',
    benefits: [
      'Contenidos de gestión de negocios y operación.',
      'Actividades formativas del ecosistema Alicorp.',
    ],
    requirements: [
      'Consultar si el curso está dirigido a tu rubro o requiere ser cliente.',
      'Las alianzas y programas con certificación tienen condiciones propias.',
    ],
    note: 'La fuente corporativa confirma la iniciativa. La disponibilidad y el acceso al curso se deben comprobar directamente en la plataforma.',
  },
  {
    ...base,
    id: 'mujer-produce',
    name: 'Mujer Produce',
    org: 'Programa Nacional Tu Empresa',
    orgType: 'Estado',
    category: 'capacitacion',
    resource: true,
    description:
      'Capacitaciones para mujeres que lideran un negocio y quieren fortalecer sus habilidades empresariales y digitales.',
    benefit: 'Capacitaciones gratuitas',
    benefitType: 'Formación',
    mark: 'MP',
    color: 'purple',
    url: 'https://www.gob.pe/81083-acceder-a-las-capacitaciones-del-programa-mujer-produce',
    stages: ['ventas', 'crecimiento'],
    needs: ['aprender', 'vender'],
    mode: 'Virtual',
    status: 'ongoing',
    cost: 'gratis',
    costLabel: 'Gratis',
    benefits: [
      'Formación en gestión empresarial y desarrollo personal.',
      'Contenidos ajustados a un diagnóstico inicial.',
    ],
    requirements: [
      'Ser una emprendedora con negocio en marcha.',
      'La MYPE debe estar liderada por mujeres.',
      'Completar la ficha de diagnóstico del programa.',
    ],
    note: 'El match no recoge género: revisa este requisito antes de inscribirte y consulta el calendario de capacitaciones.',
  },
  {
    ...base,
    id: 'red-cite',
    name: 'Red CITE',
    org: 'Instituto Tecnológico de la Producción',
    orgType: 'Estado',
    category: 'asesoria',
    resource: true,
    description:
      'Localiza centros de apoyo tecnológico para mejorar productos y procesos en distintas cadenas productivas.',
    benefit: 'Asistencia técnica por sector',
    benefitType: 'Directorio',
    mark: 'CITE',
    color: 'rose',
    url: 'https://www.gob.pe/institucion/itp/campa%C3%B1as/99751-itp-conoce-el-directorio-de-la-red-cite-a-nivel-nacional',
    stages: activeStages,
    sectors: ['agro', 'gastronomia', 'industria', 'sostenibilidad'],
    needs: ['tecnologia', 'aprender'],
    mode: 'Presencial',
    status: 'ongoing',
    benefits: [
      'Directorio oficial de centros, regiones y contactos.',
      'Acceso al centro especializado que corresponda a tu producto.',
    ],
    requirements: [
      'Elegir el CITE según cadena productiva y ubicación.',
      'Solicitar condiciones, alcance y tarifa del servicio concreto.',
    ],
    note: 'Los servicios varían entre centros. No todos son gratuitos ni están disponibles en cada región.',
  },
  {
    ...base,
    id: 'mype-digital',
    name: 'Centros Mype Digital',
    org: 'Ministerio de la Producción',
    orgType: 'Estado',
    category: 'asesoria',
    resource: true,
    description:
      'Encuentra organizaciones que ayudan a pequeñas empresas a incorporar herramientas digitales.',
    benefit: 'Asesoría para digitalizar',
    benefitType: 'Directorio',
    mark: 'MD',
    color: 'blue',
    url: 'https://www.gob.pe/r/centrosmype',
    stages: ['ventas', 'crecimiento'],
    businessTypes: ['negocio'],
    needs: ['tecnologia', 'aprender', 'vender'],
    status: 'ongoing',
    benefits: [
      'Directorio filtrable por tipo de centro y región.',
      'Organizaciones que ofrecen asesorías, talleres y capacitación.',
    ],
    requirements: [
      'Consultar requisitos, modalidad y tarifas con el centro elegido.',
      'La cobertura depende de la ubicación del proveedor.',
    ],
    note: 'El directorio permite encontrar prestadores; la inscripción y las condiciones se resuelven directamente con ellos.',
  },
  {
    ...base,
    id: 'ruta-exportadora',
    name: 'Ruta Exportadora',
    org: 'PROMPERÚ',
    orgType: 'Estado',
    category: 'mercados',
    resource: true,
    description:
      'Servicios para preparar tu empresa para exportar y fortalecer su competitividad internacional.',
    benefit: 'Preparación para exportar',
    benefitType: 'Acompañamiento',
    mark: 'P',
    color: 'rose',
    url: 'https://rutex.promperu.gob.pe/',
    stages: ['ventas', 'crecimiento'],
    needs: ['vender', 'aprender'],
    status: 'ongoing',
    benefits: [
      'Talleres, capacitación y asistencia técnica.',
      'Servicios para avanzar en la internacionalización.',
    ],
    requirements: [
      'Registro y evaluación según el servicio solicitado.',
      'Revisar los requisitos de empresa, producto y preparación exportadora.',
    ],
    note: 'Los servicios se adaptan a la etapa del negocio. No se garantiza conseguir compradores ni contratos.',
  },
  {
    ...base,
    id: 'alicorp-proveedores',
    name: 'Sé proveedor de Alicorp',
    org: 'Alicorp',
    orgType: 'Empresa',
    category: 'mercados',
    resource: true,
    description:
      'Conoce las condiciones para presentar tu empresa como potencial proveedor de una gran compañía.',
    benefit: 'Ruta de acceso comercial',
    benefitType: 'Acceso comercial',
    mark: 'a',
    color: 'rose',
    url: 'https://www.alicorp.com.pe/pe/es/clientes-y-proveedores',
    stages: ['ventas', 'crecimiento'],
    needs: ['vender'],
    status: 'ongoing',
    cost: 'condicionado',
    costLabel: 'Homologación y requisitos propios',
    benefits: [
      'Información oficial sobre incorporación de proveedores.',
      'Requisitos según actividad comercial, fabricación, servicios o logística.',
    ],
    requirements: [
      'Homologación de calidad o equivalente.',
      'Evaluación financiera, legal, operativa y de gestión.',
      'Certificación de buenas prácticas laborales indicada por Alicorp.',
    ],
    note: 'Es un proceso comercial, no una convocatoria de subsidios. Cumplir requisitos no garantiza una compra o contrato.',
  },
  {
    ...base,
    id: 'microsoft-startups',
    name: 'Microsoft for Startups',
    org: 'Microsoft',
    orgType: 'Empresa',
    category: 'herramientas',
    resource: true,
    description:
      'Recursos técnicos, beneficios de Azure y apoyo para startups que desarrollan productos de software propios.',
    benefit: 'Créditos y apoyo técnico',
    benefitType: 'Créditos de uso',
    mark: 'MS',
    color: 'blue',
    url: 'https://learn.microsoft.com/en-us/startups/microsoft-for-startups/overview',
    businessTypes: ['startup'],
    needs: ['tecnologia', 'vender'],
    geography: 'Global',
    location: 'Online · programa global',
    mode: 'Virtual',
    status: 'ongoing',
    cost: 'condicionado',
    costLabel: 'Sujeto a aprobación y nivel',
    benefits: [
      'Créditos y recursos técnicos según oferta aprobada.',
      'Apoyo para desarrollar y comercializar el producto.',
    ],
    requirements: [
      'Producto o servicio de software propio; empresa privada con fines de lucro.',
      'Sede en un país donde Azure esté disponible.',
      'No haber alcanzado Serie C; revisar límites de créditos previos.',
      'Se excluyen consultoras, agencias y otras actividades indicadas.',
    ],
    note: 'Los beneficios y la elegibilidad se validan con Microsoft. Los consumos no cubiertos pueden ser facturados.',
  },
  {
    ...base,
    id: 'hubspot-bootstrap',
    name: 'HubSpot for Startups',
    org: 'HubSpot · Bootstrap Program',
    orgType: 'Empresa',
    category: 'herramientas',
    resource: true,
    description:
      'Descuentos en herramientas de ventas y gestión de clientes para startups autofinanciadas elegibles.',
    benefit: 'Descuentos en software CRM',
    benefitType: 'Descuento',
    mark: 'H',
    color: 'orange',
    url: 'https://www.hubspot.com/startups/bootstrap-program',
    stages: activeStages,
    businessTypes: ['startup'],
    needs: ['tecnologia', 'vender'],
    mode: 'Virtual',
    status: 'ongoing',
    cost: 'pago',
    costLabel: 'Software de pago con descuento',
    benefits: [
      'Descuentos según aprobación del programa.',
      'Recursos, comunidad y ofertas para miembros.',
    ],
    requirements: [
      'Empresa constituida en un país elegible: Perú está incluido.',
      'Fundada en los últimos cinco años.',
      'Revisar el resto de condiciones y los planes admitidos.',
    ],
    note: 'Un descuento no equivale a acceso gratuito. Confirma compromiso anual, precio final y tarifa al terminar la promoción.',
  },
  {
    ...base,
    id: 'notion-startups',
    name: 'Notion for Startups',
    org: 'Notion',
    orgType: 'Empresa',
    category: 'herramientas',
    resource: true,
    description:
      'Acceso promocional para organizar documentos, proyectos y conocimiento del equipo.',
    benefit: 'Meses promocionales según perfil',
    benefitType: 'Descuento',
    mark: 'N',
    color: 'black',
    url: 'https://www.notion.com/startups',
    stages: activeStages,
    needs: ['tecnologia'],
    geography: 'Global',
    location: 'Online · programa global',
    mode: 'Virtual',
    status: 'ongoing',
    cost: 'condicionado',
    costLabel: 'Promoción temporal',
    benefits: [
      'Acceso promocional a herramientas de Notion según elegibilidad.',
      'Beneficios adicionales para perfiles aprobados.',
    ],
    requirements: [
      'Cliente no pagador, correo de trabajo válido y menos de 100 empleados.',
      'No haber recibido promociones previas de Notion.',
      'El plazo depende del perfil: startup, pequeña empresa o socio de su red.',
    ],
    note: 'La página distingue ofertas de 1, 3 o 6 meses. Confirma el beneficio asignado, cobertura territorial y precio al finalizar.',
  },
  {
    ...base,
    id: 'nvidia-inception',
    name: 'NVIDIA Inception',
    org: 'NVIDIA',
    orgType: 'Empresa',
    category: 'herramientas',
    resource: true,
    description:
      'Formación, recursos técnicos y beneficios para startups que desarrollan soluciones tecnológicas.',
    benefit: 'Membresía gratuita para startups',
    benefitType: 'Acompañamiento',
    mark: 'NV',
    color: 'green',
    url: 'https://www.nvidia.com/en-us/startups/',
    stages: activeStages,
    businessTypes: ['startup'],
    needs: ['tecnologia', 'aprender'],
    geography: 'Global',
    location: 'Online · programa global',
    mode: 'Virtual',
    status: 'ongoing',
    cost: 'gratis',
    costLabel: 'Membresía gratuita',
    benefits: [
      'Recursos técnicos y capacitación.',
      'Precios preferenciales y beneficios sujetos a condiciones.',
    ],
    requirements: [
      'Empresa constituida hace menos de 10 años.',
      'Al menos un desarrollador y sitio web operativo.',
      'No admite consultoras, desarrollo tercerizado ni otras actividades excluidas.',
    ],
    note: 'La membresía no exige participación accionaria. Los beneficios no garantizan hardware gratuito ni disponibilidad de equipos; revisa condiciones territoriales.',
  },
  {
    ...base,
    id: 'proinnovate-calendario',
    name: 'Calendario de ProInnóvate',
    org: 'Ministerio de la Producción',
    orgType: 'Estado',
    category: 'financiamiento',
    resource: true,
    description:
      'Consulta la programación oficial de concursos de innovación, digitalización y desarrollo empresarial.',
    benefit: 'Fechas y bases de concursos',
    benefitType: 'Directorio',
    mark: 'PI',
    color: 'rose',
    url: 'https://www.gob.pe/institucion/proinnovate/pages/54489-conocer-el-calendario-de-financiamientos-de-proinnovate',
    needs: ['capital', 'tecnologia'],
    status: 'ongoing',
    mode: 'Virtual',
    cost: 'gratis',
    costLabel: 'Consulta gratuita',
    benefits: [
      'Calendario y acceso a concursos por categorías.',
      'Información oficial de lanzamiento y cierre.',
    ],
    requirements: [
      'Los requisitos corresponden a cada concurso.',
      'Distinguir convocatorias para empresas de las dirigidas a entidades de soporte.',
    ],
    note: 'El calendario no es una postulación. Las fechas y presupuestos pueden cambiar; prevalecen las bases y comunicaciones oficiales.',
  },
  {
    ...base,
    id: 'uni-impulso',
    name: 'Preincubación Impulso 2G',
    org: 'Startup UNI',
    orgType: 'Universidad',
    category: 'incubacion',
    description:
      'Programa para validar una idea innovadora y avanzar hacia el primer prototipo con mentoría.',
    benefit: 'Edición 2026 finalizada',
    benefitType: 'Acompañamiento',
    mark: 'UNI',
    color: 'burgundy',
    url: 'https://startup.uni.edu.pe/programas/pre-incubacion',
    stages: ['idea', 'prototipo'],
    businessTypes: ['startup'],
    needs: ['mentoria', 'aprender'],
    status: 'closed',
    location: 'Lima · consultar próxima edición',
    cost: 'pago',
    costLabel: 'Programa pagado · consultar próxima edición',
    benefits: [
      'Formación en validación y desarrollo de prototipos.',
      'Mentoría e infraestructura según el programa.',
    ],
    requirements: [
      'Idea innovadora y con potencial de crecimiento.',
      'Equipo y compromiso con el programa según bases.',
    ],
    note: 'La web y las bases de 2026 muestran calendarios diferentes, ambos ya pasados. Se conserva como referencia para una próxima edición.',
  },
  {
    ...base,
    id: 'nexpro',
    name: 'Nexpro Multisectorial',
    org: 'Nexum · PUCP',
    orgType: 'Universidad',
    category: 'incubacion',
    description:
      'Incubación para startups con un producto validado, ventas y potencial de crecimiento.',
    benefit: 'Convocatoria 2026 cerrada',
    benefitType: 'Acompañamiento',
    mark: 'NX',
    color: 'blue',
    url: 'https://cide.pucp.edu.pe/nexum/multisectorial/',
    stages: ['ventas', 'crecimiento'],
    businessTypes: ['startup'],
    needs: ['mentoria', 'capital', 'vender'],
    mode: 'Híbrido',
    location: 'Lima + virtual',
    status: 'closed',
    closesAt: '2026-08-25T23:59:59-05:00',
    cost: 'pago',
    costLabel: 'S/ 2,200 general · edición 2026',
    benefits: [
      'Mentoría y recursos para desarrollar el negocio.',
      'Respaldo para postular a Startup Perú y beneficios de aliados.',
    ],
    requirements: [
      'Equipo con producto mínimo viable validado.',
      'La página señala ventas de al menos S/ 50,000 en el último año.',
      'Revisar costos, agenda presencial y condiciones de admisión.',
    ],
    note: 'El cierre publicado fue el 25 de agosto de 2026. No se presenta como una postulación abierta.',
  },
  {
    ...base,
    id: 'endeavor-dream',
    name: 'Dream Bigger',
    org: 'Endeavor Perú',
    orgType: 'Organización',
    category: 'incubacion',
    description:
      'Acompañamiento para empresas innovadoras con ventas y un equipo que busca escalar.',
    benefit: 'Convocatoria 2026 cerrada',
    benefitType: 'Acompañamiento',
    mark: 'E',
    color: 'black',
    url: 'https://endeavor.org.pe/dream-bigger-program-2026/',
    stages: ['ventas', 'crecimiento'],
    businessTypes: ['startup'],
    needs: ['mentoria', 'capital', 'vender'],
    status: 'closed',
    closesAt: '2026-06-12T23:59:59-05:00',
    mode: 'Híbrido',
    cost: 'pago',
    costLabel: 'US$ 200 + IGV al mes · edición 2026',
    benefits: [
      'Diagnóstico, talleres y mentorías individuales.',
      'Acceso a comunidad y eventos del ecosistema.',
    ],
    requirements: [
      'Operaciones en Perú y ventas anuales entre US$ 30,000 y US$ 350,000.',
      'Equipo de al menos cinco personas.',
      'Crecimiento mensual sostenido según requisitos del programa.',
    ],
    note: 'La convocatoria cerró el 12 de junio de 2026. El programa se conserva para conocerlo y consultar futuras ediciones.',
  },
];
