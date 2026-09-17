import type {
  Opportunity,
  Profile,
  Stage,
  BusinessType,
  Need,
  Sector,
} from './opportunities';

export type Availability =
  | 'open'
  | 'ongoing'
  | 'closed'
  | 'consult'
  | 'upcoming'
  | 'stale';
export function availability(
  item: Opportunity,
  now = new Date(),
): Availability {
  if (item.status === 'closed') return 'closed';
  if (item.closesAt && now.getTime() > Date.parse(item.closesAt))
    return 'closed';
  if (item.opensAt && now.getTime() < Date.parse(item.opensAt))
    return 'upcoming';
  const reviewed = Date.parse(item.checkedAt + 'T12:00:00-05:00');
  if (now.getTime() - reviewed > 45 * 86400000) return 'stale';
  return item.status;
}
export const availabilityLabels: Record<Availability, string> = {
  open: 'Convocatoria abierta',
  ongoing: 'Acceso disponible',
  closed: 'Convocatoria cerrada',
  consult: 'Consultar convocatoria',
  upcoming: 'Próxima convocatoria',
  stale: 'Revisar vigencia',
};
export type MatchResult = {
  eligibleForSuggestions: boolean;
  score: number;
  reasons: string[];
  pending: string[];
};
export function matchOpportunity(
  item: Opportunity,
  profile: Profile,
  now = new Date(),
): MatchResult {
  const result: MatchResult = {
    eligibleForSuggestions: false,
    score: 0,
    reasons: [],
    pending: [],
  };
  if (item.matchEligible === false) {
    result.pending.push('Este fellowship selecciona perfiles individuales; el match actual evalúa negocios.');
    return result;
  }
  const state = availability(item, now);
  if (
    item.geography !== 'Global' &&
    item.geography !== 'Latinoamérica' &&
    (item.countryCode ? item.countryCode !== 'PE' : item.geography !== 'Perú')
  ) {
    result.pending.push(
      'El match actual está diseñado para negocios en Perú. Esta oportunidad corresponde a otro país.',
    );
    return result;
  }
  if (state === 'closed' || state === 'upcoming') {
    result.pending.push('La convocatoria no recibe postulaciones ahora.');
    return result;
  }
  if (!item.businessTypes.includes(profile.businessType)) {
    result.pending.push('Está orientado a otro tipo de emprendimiento.');
    return result;
  }
  if (!item.stages.includes(profile.stage)) {
    result.pending.push('Está orientado a una etapa distinta de tu negocio.');
    return result;
  }
  const sectorFits =
    item.sectors === 'todos' || item.sectors.includes(profile.sector);
  if (!sectorFits) {
    result.pending.push('El enfoque sectorial es distinto al de tu negocio.');
    return result;
  }
  const needs = profile.needs.filter((n) => item.needs.includes(n));
  if (!needs.length) {
    result.pending.push('No coincide con el apoyo que buscas ahora.');
    return result;
  }
  result.eligibleForSuggestions = true;
  result.score =
    65 +
    Math.round((20 * needs.length) / profile.needs.length) +
    (item.sectors === 'todos' ? 0 : 10);
  const labels: Record<Need, string> = {
    capital: 'financiamiento',
    mentoria: 'mentoría',
    tecnologia: 'herramientas',
    aprender: 'capacitación',
    vender: 'crecimiento comercial',
    formalizar: 'formalización',
  };
  result.reasons.push(
    'Coincide con tu búsqueda de ' +
      needs.map((n) => labels[n]).join(' y ') +
      '.',
  );
  result.reasons.push(
    'Contempla tu etapa: ' +
      {
        idea: 'idea',
        prototipo: 'prototipo',
        ventas: 'primeras ventas',
        crecimiento: 'crecimiento',
      }[profile.stage] +
      '.',
  );
  if (item.sectors !== 'todos')
    result.reasons.push('Su enfoque incluye tu sector.');
  if (
    item.location.startsWith('Lima') &&
    profile.region !== 'Lima' &&
    profile.region !== 'Callao'
  ) {
    result.score -= 15;
    result.pending.push(
      'Consulta si debes asistir a Lima y si puedes participar desde ' +
        profile.region +
        '.',
    );
  } else if (item.geography === 'Perú') {
    result.score += 5;
    if (item.mode === 'Presencial')
      result.pending.push(
        'Confirma la atención del centro y sus servicios en ' +
          profile.region +
          '.',
      );
  }
  if (item.geography === 'Global' || item.geography === 'Latinoamérica')
    result.pending.push(
      'Confirma con el programa la elegibilidad de tu perfil en Perú, incluidos edad e idioma cuando corresponda.',
    );
  if (state === 'consult' || state === 'stale') {
    result.score -= 5;
    result.pending.push(
      'Confirma que la convocatoria o el beneficio esté vigente.',
    );
  }
  result.pending.push(
    'Revisa los requisitos completos: el match indica afinidad, no aprobación.',
  );
  return result;
}
export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export function matchesText(item: Opportunity, query: string) {
  const haystack = normalize(
    [
      item.name,
      item.org,
      item.description,
      item.benefit,
      item.benefitType,
      item.location,
      ...item.requirements,
    ].join(' '),
  );
  return normalize(query)
    .trim()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}
export function validateProfile(
  value: unknown,
  allowedRegions: readonly string[],
): Profile | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const p = value as Record<string, unknown>;
  const stages: Stage[] = ['idea', 'prototipo', 'ventas', 'crecimiento'];
  const kinds: BusinessType[] = ['startup', 'negocio'];
  const sectors: Sector[] = [
    'tecnologia',
    'gastronomia',
    'agro',
    'comercio',
    'servicios',
    'industria',
    'sostenibilidad',
    'otro',
  ];
  const needs: Need[] = [
    'capital',
    'mentoria',
    'tecnologia',
    'aprender',
    'vender',
    'formalizar',
  ];
  if (
    !stages.includes(p.stage as Stage) ||
    !kinds.includes(p.businessType as BusinessType) ||
    !sectors.includes(p.sector as Sector) ||
    typeof p.region !== 'string' ||
    !allowedRegions.includes(p.region) ||
    !Array.isArray(p.needs) ||
    !p.needs.length ||
    p.needs.some((n) => !needs.includes(n)) ||
    p.needs.length > 6
  )
    return null;
  return {
    stage: p.stage as Stage,
    businessType: p.businessType as BusinessType,
    sector: p.sector as Sector,
    needs: [...new Set(p.needs)] as Need[],
    region: p.region,
  };
}
