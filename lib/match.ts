import type {
  Opportunity,
  Profile,
  Stage,
  BusinessType,
  Need,
  Sector,
} from './opportunities';
import { legacyPeruRegions } from './opportunities.ts';
import { atlasCountries } from './atlas.ts';

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
  const country = atlasCountries.find((c) => c.code === profile.countryCode);
  if (!country) {
    result.pending.push('Selecciona un país válido para calcular tu match.');
    return result;
  }
  if (item.matchEligible === false) {
    result.pending.push('Este fellowship selecciona perfiles individuales; el match actual evalúa negocios.');
    return result;
  }
  const state = availability(item, now);
  const crossBorder = item.geography === 'Global' ||
    item.geography === 'Latinoamérica' || item.matchScope === 'Latinoamérica';
  const origin = item.countryCode ?? atlasCountries.find((c) => c.name === item.geography)?.code;
  if (!crossBorder && origin !== country.code) {
    result.pending.push(
      `La ficha está catalogada en ${item.geography}; no tenemos confirmado su alcance para negocios en ${country.name}.`,
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
  if (!crossBorder) {
    result.score += 5;
    result.reasons.push(`Tiene una ficha local en ${country.name}.`);
    result.pending.push('Confirma los requisitos de residencia, registro del negocio y cobertura local.');
  }
  if (item.mode !== 'Virtual')
    result.pending.push(
      `${item.mode === 'Por confirmar' ? 'Confirma la modalidad y la sede indicadas' : 'Revisa la sede y la asistencia requerida'}: ${item.location}. El país seleccionado no confirma disponibilidad para viajar.`,
    );
  if (crossBorder)
    result.pending.push(
      `Confirma con el programa la elegibilidad de tu perfil desde ${country.name}, incluidos país de residencia, registro del negocio, edad e idioma cuando corresponda.`,
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
  // Legacy profiles could only select a Peruvian department. Migrate once
  // without overriding an explicit (even invalid) country in newer profiles.
  const countryCode = p.countryCode === undefined &&
    typeof p.region === 'string' && legacyPeruRegions.includes(p.region)
    ? 'PE' : p.countryCode;
  const country = atlasCountries.find((c) => c.code === countryCode);
  if (
    !stages.includes(p.stage as Stage) ||
    !kinds.includes(p.businessType as BusinessType) ||
    !sectors.includes(p.sector as Sector) ||
    !country ||
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
    countryCode: country.code,
  };
}
