'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  Compass,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Building2,
  Gift,
  Landmark,
  SlidersHorizontal,
  X,
  Check,
  MapPin,
  CircleHelp,
  RotateCcw,
  BookOpen,
  Handshake,
  ShieldCheck,
  Clock3,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import {
  opportunities,
  categoryLabels,
  stageLabels,
  sectorLabels,
  needLabels,
  regions,
  CATALOG_REVIEWED,
} from '@/lib/opportunities';
import type {
  Opportunity,
  Profile,
  Category,
  Stage,
  BusinessType,
  Need,
  Sector,
} from '@/lib/opportunities';
import {
  availability,
  availabilityLabels,
  matchOpportunity,
  matchesText,
  validateProfile,
} from '@/lib/match';
import type { MatchResult } from '@/lib/match';
import { useMappingTools } from '@/lib/webmcp';
import { OpportunityAtlas } from '@/components/opportunity-atlas';
import { SiteMark } from '@/components/site-mark';
import { ProviderLogo } from '@/components/provider-logo';
import { WelcomeGate } from '@/components/welcome-gate';
import { Contribute, UnsubscribeForm } from '@/components/contribute';
import { atlasCountries, countryOpportunities } from '@/lib/atlas';

type View = 'explore' | 'resources' | 'matches' | 'saved';
const icons = {
  incubacion: GraduationCap,
  financiamiento: Landmark,
  inversion: TrendingUp,
  herramientas: Gift,
  capacitacion: BookOpen,
  asesoria: Building2,
  mercados: Handshake,
  fellowships: UsersRound,
};
const dateFormat = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Lima',
});
const reviewedLabel = dateFormat.format(
  new Date(CATALOG_REVIEWED + 'T12:00:00-05:00'),
);

function scrollToCatalog() {
  document.getElementById('catalogo')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth',
  });
}

function ChoiceSelect({
  label,
  value,
  onChange,
  options,
  id,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  id?: string;
  className?: string;
}) {
  const generated = useId();
  return (
    <div className={'choice-select ' + className}>
      <label htmlFor={id || generated}>{label}</label>
      <Select
        value={value}
        onValueChange={(v) => {
          if (v !== null) onChange(v);
        }}
        items={options}
      >
        <SelectTrigger id={id || generated} aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function OpportunityCard({
  item,
  saved,
  toggle,
  onDetails,
  match,
  now,
}: {
  item: Opportunity;
  saved: boolean;
  toggle: () => void;
  onDetails: () => void;
  match?: MatchResult;
  now: Date;
}) {
  const state = availability(item, now);
  return (
    <article
      className={
        'opportunity-card ' + (state === 'closed' ? 'closed-card' : '')
      }
    >
      <div className="card-top">
        <ProviderLogo id={item.id} provider={item.org} />
        <button
          className={'bookmark-button ' + (saved ? 'saved' : '')}
          onClick={toggle}
          aria-label={
            (saved ? 'Quitar de guardados: ' : 'Guardar: ') + item.name
          }
          aria-pressed={saved}
        >
          <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="org-name">{item.org}</p>
      <h3>
        <button onClick={onDetails} className="card-title-button">
          {item.name}
        </button>
      </h3>
      <p className="card-description">{item.description}</p>
      <div className="tags">
        <span className="tag">
          {categoryLabels[item.category]
            .replace(' y beneficios', '')
            .replace(' y servicios', '')
            .replace(' y mentoría', '')}
        </span>
        <span className="tag neutral">{item.orgType}</span>
      </div>
      {match?.eligibleForSuggestions && (
        <div className="match-reason">
          <Sparkles size={14} />
          <div>
            <strong>
              {match.score >= 85 ? 'Alta afinidad' : 'Buena afinidad'}
            </strong>
            <p>{match.reasons[0]}</p>
          </div>
        </div>
      )}
      <div className="card-value">{item.benefit}</div>
      <div className="card-status">
        <span className={'status-dot ' + state} />
        <span>{availabilityLabels[state]}</span>
      </div>
      <a
        className="official-link"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={'Ir al sitio oficial de ' + item.name + ' (nueva pestaña)'}
      >
        Ir al sitio oficial <ArrowUpRight size={17} />
      </a>
      <button className="detail-link" onClick={onDetails}>
        Ver requisitos y detalles <ArrowRight size={13} />
      </button>
    </article>
  );
}

function MatchQuiz({
  open,
  setOpen,
  profile,
  onComplete,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  profile: Profile | null;
  onComplete: (p: Profile) => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Partial<Profile>>({ needs: [] });
  useEffect(() => {
    if (open) {
      setStep(0);
      setDraft(profile ?? { needs: [] });
    }
  }, [open, profile]);
  const ready =
    step === 0
      ? !!draft.stage
      : step === 1
        ? !!draft.businessType && !!draft.sector
        : step === 2
          ? !!draft.needs?.length
          : !!draft.region;
  const titles = [
    '¿En qué momento está tu negocio?',
    '¿Qué estás construyendo?',
    '¿Qué apoyo necesitas ahora?',
    '¿Desde dónde emprendes?',
  ];
  const descriptions = [
    'Tu etapa nos ayuda a encontrar el apoyo adecuado.',
    'Las oportunidades cambian según el tipo de negocio y el sector.',
    'Puedes elegir más de una opción.',
    'El cuestionario usa regiones de Perú. Incluye oportunidades regionales cuando aceptan candidaturas peruanas; verifica cada requisito.',
  ];
  const update = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setDraft((old) => ({ ...old, [key]: value }));
  const submit = () => {
    const valid = validateProfile(draft, regions);
    if (valid) {
      onComplete(valid);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="match-dialog" showCloseButton={false}>
        <DialogClose
          className="dialog-dismiss"
          aria-label="Cerrar cuestionario"
        >
          <X size={20} />
        </DialogClose>
        <div className="quiz-top">
          <span className="mini-icon">
            <Sparkles size={20} />
          </span>
          <p>ENCUENTRA TU MATCH</p>
          <span>{step + 1} de 4</span>
        </div>
        <Progress
          value={(step + 1) * 25}
          aria-label={'Paso ' + (step + 1) + ' de 4'}
          className="quiz-progress"
        />
        <DialogTitle className="quiz-title">{titles[step]}</DialogTitle>
        <DialogDescription className="quiz-description">
          {descriptions[step]}
        </DialogDescription>
        <div className="quiz-body" key={step}>
          {step === 0 && (
            <RadioGroup
              value={draft.stage ?? ''}
              onValueChange={(v) => update('stage', v as Stage)}
              aria-label="Etapa del negocio"
              className="quiz-options"
            >
              {Object.entries(stageLabels).map(([value, label], i) => (
                <label
                  key={value}
                  className={
                    'quiz-option ' + (draft.stage === value ? 'chosen' : '')
                  }
                >
                  <RadioGroupItem value={value} />
                  <span>
                    <strong>{label}</strong>
                    <small>
                      {
                        [
                          'Estoy definiendo o validando lo que quiero hacer.',
                          'Ya puedo mostrar cómo funciona mi solución.',
                          'Mi producto o servicio ya tiene clientes.',
                          'Tengo un negocio y busco expandirme.',
                        ][i]
                      }
                    </small>
                  </span>
                </label>
              ))}
            </RadioGroup>
          )}
          {step === 1 && (
            <>
              <RadioGroup
                value={draft.businessType ?? ''}
                onValueChange={(v) => update('businessType', v as BusinessType)}
                aria-label="Tipo de negocio"
                className="quiz-options"
              >
                <label
                  className={
                    'quiz-option ' +
                    (draft.businessType === 'startup' ? 'chosen' : '')
                  }
                >
                  <RadioGroupItem value="startup" />
                  <span>
                    <strong>Startup innovadora</strong>
                    <small>
                      Un producto o modelo que puede crecer a gran escala.
                    </small>
                  </span>
                </label>
                <label
                  className={
                    'quiz-option ' +
                    (draft.businessType === 'negocio' ? 'chosen' : '')
                  }
                >
                  <RadioGroupItem value="negocio" />
                  <span>
                    <strong>Negocio o pequeña empresa</strong>
                    <small>
                      Comercio, servicios, producción u otro emprendimiento.
                    </small>
                  </span>
                </label>
              </RadioGroup>
              <ChoiceSelect
                label="¿En qué sector?"
                value={draft.sector ?? ''}
                onChange={(v) => update('sector', v as Sector)}
                options={[
                  { value: '', label: 'Selecciona un sector' },
                  ...Object.entries(sectorLabels).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
              />
            </>
          )}
          {step === 2 && (
            <div className="needs-grid">
              {Object.entries(needLabels).map(([value, label]) => (
                <label
                  key={value}
                  className={
                    'need-option ' +
                    (draft.needs?.includes(value as Need) ? 'chosen' : '')
                  }
                >
                  <Checkbox
                    checked={draft.needs?.includes(value as Need) ?? false}
                    onCheckedChange={(checked) =>
                      update(
                        'needs',
                        checked
                          ? [...(draft.needs ?? []), value as Need]
                          : (draft.needs ?? []).filter((n) => n !== value),
                      )
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          )}
          {step === 3 && (
            <>
              <ChoiceSelect
                label="Región en Perú"
                value={draft.region ?? ''}
                onChange={(v) => update('region', v)}
                options={[
                  { value: '', label: 'Selecciona tu región' },
                  ...regions.map((r) => ({ value: r, label: r })),
                ]}
              />
              <div className="profile-preview">
                <ShieldCheck size={21} />
                <div>
                  <strong>Tu perfil se queda contigo.</strong>
                  <p>
                    Guardamos tus respuestas solo en este navegador. No
                    necesitas registrarte ni compartir datos personales.
                  </p>
                </div>
              </div>
              <p className="match-caveat">
                El match compara tu perfil con el enfoque de cada oportunidad.
                La institución confirma los requisitos y la admisión.
              </p>
            </>
          )}
        </div>
        <div className="quiz-actions">
          <button
            className="text-button"
            onClick={() => (step ? setStep(step - 1) : setOpen(false))}
          >
            <ArrowLeft size={16} />
            {step ? 'Atrás' : 'Ahora no'}
          </button>
          <button
            className="button primary"
            disabled={!ready}
            onClick={() => (step === 3 ? submit() : setStep(step + 1))}
          >
            {step === 3 ? 'Ver mis matches' : 'Continuar'}
            <ArrowRight size={16} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const [view, setView] = useState<View>('explore');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [orgType, setOrgType] = useState('all');
  const [scope, setScope] = useState('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState('recommended');
  const [saved, setSaved] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [details, setDetails] = useState<Opportunity | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [entered, setEntered] = useState(false);
  const [now, setNow] = useState(
    () => new Date(CATALOG_REVIEWED + 'T12:00:00-05:00'),
  );
  useEffect(() => {
    try { setEntered(sessionStorage.getItem('chancletazo.entered.v1') === 'yes'); } catch { /* La entrada funciona igual sin almacenamiento. */ }
    setNow(new Date());
    try {
      const localSaved: unknown = JSON.parse(
        localStorage.getItem('mapping.saved.v1') ?? '[]',
      );
      if (Array.isArray(localSaved))
        setSaved([
          ...new Set(
            localSaved.filter(
              (id): id is string =>
                typeof id === 'string' &&
                opportunities.some((o) => o.id === id),
            ),
          ),
        ]);
      setProfile(
        validateProfile(
          JSON.parse(localStorage.getItem('mapping.profile.v1') ?? 'null'),
          regions,
        ),
      );
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  const enterMap = () => {
    setEntered(true);
    try { sessionStorage.setItem('chancletazo.entered.v1', 'yes'); } catch { /* No es necesario para explorar. */ }
  };
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem('mapping.saved.v1', JSON.stringify(saved));
        localStorage.setItem('mapping.profile.v1', JSON.stringify(profile));
      } catch {
        setStorageError(true);
      }
    }
  }, [saved, profile, loaded]);
  const matchMap = useMemo(
    () =>
      new Map(
        opportunities.map((item) => [
          item.id,
          profile ? matchOpportunity(item, profile, now) : null,
        ]),
      ),
    [profile, now],
  );
  const matchCount = opportunities.filter(
    (o) => matchMap.get(o.id)?.eligibleForSuggestions,
  ).length;
  const resourceCount = opportunities.filter((o) => o.resource).length;
  const baseItems = useMemo(
    () =>
      opportunities.filter(
        (item) =>
          (view !== 'resources' || item.resource) &&
          (view !== 'saved' || saved.includes(item.id)) &&
          (view !== 'matches' || matchMap.get(item.id)?.eligibleForSuggestions),
      ),
    [view, saved, matchMap],
  );
  const filtered = useMemo(() => {
    const result = baseItems.filter(
      (item) =>
        (category === 'all' || item.category === category) &&
        (orgType === 'all' || item.orgType === orgType) &&
        (scope === 'all' ||
          (scope === 'Global' || scope === 'Latinoamérica'
            ? item.geography === scope
            : countryOpportunities(
                [item],
                atlasCountries.find((country) => country.name === scope) ??
                  atlasCountries[0],
              ).length > 0)) &&
        (!freeOnly || item.cost === 'gratis') &&
        (!availableOnly ||
          ['open', 'ongoing'].includes(availability(item, now))) &&
        matchesText(item, query),
    );
    return result.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'es');
      if (sort === 'deadline') {
        const da =
          availability(a, now) === 'open'
            ? Date.parse(a.closesAt ?? '')
            : Infinity;
        const db =
          availability(b, now) === 'open'
            ? Date.parse(b.closesAt ?? '')
            : Infinity;
        return (
          (Number.isFinite(da) ? da : Infinity) -
            (Number.isFinite(db) ? db : Infinity) ||
          a.name.localeCompare(b.name, 'es')
        );
      }
      if (view === 'matches')
        return (
          (matchMap.get(b.id)?.score ?? 0) - (matchMap.get(a.id)?.score ?? 0)
        );
      return (
        Number(availability(a, now) === 'closed') -
        Number(availability(b, now) === 'closed')
      );
    });
  }, [
    baseItems,
    category,
    orgType,
    scope,
    freeOnly,
    availableOnly,
    query,
    sort,
    view,
    now,
    matchMap,
  ]);
  const resetFilters = () => {
    setQuery('');
    setCategory('all');
    setOrgType('all');
    setScope('all');
    setFreeOnly(false);
    setAvailableOnly(false);
    setSort('recommended');
  };
  const switchView = (v: View) => {
    setView(v);
    resetFilters();
    scrollToCatalog();
  };
  const toggleSaved = (id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setAnnouncement(
      (saved.includes(id) ? 'Eliminado de' : 'Añadido a') + ' tus guardados.',
    );
  };
  const completeMatch = (p: Profile) => {
    setProfile(p);
    switchView('matches');
    setAnnouncement(
      'Tu selección está lista. ' +
        opportunities.filter(
          (o) => matchOpportunity(o, p, now).eligibleForSuggestions,
        ).length +
        ' oportunidades con afinidad.',
    );
  };
  const hasFilters =
    !!query ||
    category !== 'all' ||
    orgType !== 'all' ||
    scope !== 'all' ||
    freeOnly ||
    availableOnly;
  useMappingTools({
    query,
    setQuery,
    category,
    setCategory,
    view,
    setView,
    saved,
    setSaved,
    visible: filtered,
    resetFilters,
  });
  const title =
    view === 'resources'
      ? 'Recursos para avanzar'
      : view === 'saved'
        ? 'Tus oportunidades guardadas'
        : view === 'matches'
          ? 'Oportunidades para ti'
          : 'Descubre oportunidades';

  const filterFields = () => (
    <>
      <div className="filter-heading">
        <SlidersHorizontal size={17} />
        <h2>Explora a tu manera</h2>
        {hasFilters && (
          <button
            className="reset-filters"
            onClick={resetFilters}
            aria-label="Limpiar filtros"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      <p className="field-title">TIPO DE APOYO</p>
      <button
        className={'side-option ' + (category === 'all' ? 'selected' : '')}
        onClick={() => setCategory('all')}
        aria-pressed={category === 'all'}
      >
        <Compass size={17} />
        Todas las oportunidades
        <span className="option-count">{baseItems.length}</span>
      </button>
      {Object.entries(categoryLabels).map(([key, label]) => {
        const Icon = icons[key as Category];
        return (
          <button
            key={key}
            className={'side-option ' + (category === key ? 'selected' : '')}
            onClick={() => setCategory(key)}
            aria-pressed={category === key}
          >
            <Icon size={17} />
            <span>{label}</span>
            <span className="option-count">
              {baseItems.filter((o) => o.category === key).length}
            </span>
          </button>
        );
      })}
      <div className="filter-divider" />
      <ChoiceSelect
        label="¿Quién lo ofrece?"
        value={orgType}
        onChange={setOrgType}
        options={[
          { value: 'all', label: 'Todas las instituciones' },
          ...['Estado', 'Universidad', 'Empresa', 'Organización'].map((v) => ({
            value: v,
            label: v,
          })),
        ]}
      />
      <ChoiceSelect
        label="Origen de la oportunidad"
        value={scope}
        onChange={setScope}
        options={[
          { value: 'all', label: 'Todos los orígenes' },
          ...atlasCountries
            .filter(
              (country) => countryOpportunities(opportunities, country).length,
            )
            .map((country) => ({ value: country.name, label: country.name })),
          { value: 'Global', label: 'Programa global' },
          { value: 'Latinoamérica', label: 'Programa regional' },
        ]}
      />
      <label className="check-filter">
        <Checkbox checked={freeOnly} onCheckedChange={setFreeOnly} />
        <span>Solo acceso gratuito</span>
      </label>
      <label className="check-filter">
        <Checkbox checked={availableOnly} onCheckedChange={setAvailableOnly} />
        <span>Disponibles o abiertas</span>
      </label>
      <p className="filter-help">
        Los descuentos, créditos de uso e inversiones tienen condiciones
        propias. Revisa cada propuesta antes de postular.
      </p>
    </>
  );

  if (!entered) return <WelcomeGate onEnter={enterMap} />;

  return (
    <Tabs
      value={view}
      onValueChange={(value) => switchView(value as View)}
      className="site-shell"
    >
      <a className="skip-link" href="#oportunidades">
        Saltar a oportunidades
      </a>
      <header className="site-header">
        <a
          className="brand atlas-brand"
          href="#mapa"
          aria-label="La Combi, volver al mapa"
          onClick={(event) => {
            event.preventDefault();
            document.getElementById('mapa')?.scrollIntoView({ block: 'start' });
          }}
        >
          <SiteMark variant="header" />
        </a>
        <TabsList
          variant="line"
          className="main-nav"
          aria-label="Navegación principal"
        >
          <TabsTrigger
            className="nav-link"
            value="explore"
            onClick={scrollToCatalog}
          >
            Catálogo
          </TabsTrigger>
          <TabsTrigger
            className="nav-link"
            value="resources"
            onClick={scrollToCatalog}
          >
            Recursos
          </TabsTrigger>
          <TabsTrigger
            className="nav-link"
            value="matches"
            onClick={scrollToCatalog}
          >
            <Sparkles size={15} />
            Mis matches
            {profile && <span className="count-pill">{matchCount}</span>}
          </TabsTrigger>
          <TabsTrigger
            className="nav-link"
            value="saved"
            onClick={scrollToCatalog}
          >
            <Bookmark size={16} />
            Guardados<span className="count-pill">{saved.length}</span>
          </TabsTrigger>
        </TabsList>
        <button className="button primary" onClick={() => setQuizOpen(true)}>
          <Sparkles size={16} />
          <span>{profile ? 'Editar mi perfil' : 'Hacer mi match'}</span>
        </button>
      </header>
      <OpportunityAtlas
        onExplore={(selectedScope) => {
          switchView('explore');
          setScope(selectedScope);
        }}
        onMatch={() => setQuizOpen(true)}
      />
      <main className="main-wrap">
        <section className="intro catalog-intro" id="catalogo">
          <div>
            <h2>Menos búsqueda. Más movimiento.</h2>
            <p className="intro-copy">
              Programas, inversión y recursos para emprender en Latinoamérica.
            </p>
          </div>
          <div className="intro-note">
            <Compass size={25} />
            <p>
              <strong>
                {opportunities.length} oportunidades · {resourceCount} recursos
              </strong>
              <br />
              Estado, universidades, empresas y fondos.
            </p>
          </div>
        </section>
        <div className="workspace">
          <aside
            className="filter-sidebar"
            aria-label="Filtros de oportunidades"
          >
            {filterFields()}
            <div className="sidebar-note">
              <ShieldCheck size={19} />
              <p>
                Fuentes oficiales.
                <br />
                Enlaces directos.
                <br />
                Tú decides el siguiente paso.
              </p>
            </div>
            <button className="how-it-works" onClick={() => setAboutOpen(true)}>
              <CircleHelp size={15} />
              Cómo funciona
            </button>
          </aside>
          <section
            id="oportunidades"
            className="results-area"
            aria-label="Catálogo"
          >
            <div className="search-line">
              <label className="search-box">
                <Search size={19} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca un programa, recurso o institución…"
                  aria-label="Buscar oportunidades"
                />
                {query && (
                  <button
                    aria-label="Borrar búsqueda"
                    className="search-clear"
                    onClick={() => setQuery('')}
                  >
                    <X size={15} />
                  </button>
                )}
              </label>
              <button
                className="button secondary mobile-filter-toggle"
                onClick={() => setMobileFilters(true)}
                aria-label="Abrir filtros"
              >
                <SlidersHorizontal size={18} />
                {hasFilters && <span className="live-dot" />}
              </button>
            </div>
            {view !== 'saved' && (
              <div className={'match-banner ' + (profile ? 'has-profile' : '')}>
                <div className="sparkle-box">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2>
                    {profile
                      ? 'Tu perfil, tu punto de partida.'
                      : 'Hay oportunidades que encajan contigo.'}
                  </h2>
                  <p>
                    {profile
                      ? stageLabels[profile.stage] +
                        ' · ' +
                        sectorLabels[profile.sector] +
                        ' · ' +
                        profile.region
                      : 'Cuéntanos sobre tu negocio y descubre por dónde empezar.'}
                  </p>
                </div>
                <button
                  className="button banner-button"
                  onClick={() =>
                    profile ? switchView('matches') : setQuizOpen(true)
                  }
                >
                  {profile ? 'Ver mis matches' : 'Hacer mi match'}
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
            {view === 'saved' && (
              <p className="section-note">
                <Bookmark size={16} />
                Tu selección se guarda solo en este navegador.
              </p>
            )}
            {view === 'resources' && (
              <p className="section-note">
                Herramientas, formación y servicios que puedes aprovechar en tu
                siguiente paso.
              </p>
            )}
            {view === 'matches' && profile && (
              <div className="match-summary">
                <p>
                  Ordenadas por afinidad con tus respuestas.{' '}
                  <button onClick={() => setAboutOpen(true)}>
                    ¿Cómo se calcula?
                  </button>
                </p>
                <button
                  className="text-button"
                  onClick={() => {
                    setProfile(null);
                    setView('explore');
                    setAnnouncement('Perfil eliminado de este navegador.');
                  }}
                >
                  Borrar mi perfil
                </button>
              </div>
            )}
            <div className="results-heading">
              <div>
                <h2>{title}</h2>
                <p aria-live="polite">
                  {filtered.length}{' '}
                  {filtered.length === 1 ? 'oportunidad' : 'oportunidades'}
                  {hasFilters ? ' con estos filtros' : ''}
                </p>
              </div>
              <ChoiceSelect
                className="sort-select"
                label="Ordenar por"
                value={sort}
                onChange={setSort}
                options={[
                  {
                    value: 'recommended',
                    label:
                      view === 'matches' ? 'Afinidad' : 'Selección inicial',
                  },
                  { value: 'deadline', label: 'Cierre más próximo' },
                  { value: 'name', label: 'Nombre A–Z' },
                ]}
              />
            </div>
            {hasFilters && (
              <div className="active-filters">
                {category !== 'all' && (
                  <span>{categoryLabels[category as Category]}</span>
                )}
                {orgType !== 'all' && <span>{orgType}</span>}
                {scope !== 'all' && <span>{scope}</span>}
                {freeOnly && <span>Gratis</span>}
                {availableOnly && <span>Disponibles</span>}
                <button onClick={resetFilters}>
                  Limpiar filtros <X size={12} />
                </button>
              </div>
            )}
            <TabsContent value={view} className="catalog-panel">
              {view === 'matches' && !profile ? (
                <Empty className="empty-state">
                  <Sparkles size={35} />
                  <EmptyHeader>
                    <EmptyTitle>
                      Las mejores opciones empiezan por conocerte.
                    </EmptyTitle>
                    <EmptyDescription>
                      Responde cuatro pasos cortos y encuentra apoyo según tu
                      etapa, sector y objetivos.
                    </EmptyDescription>
                  </EmptyHeader>
                  <button
                    className="button primary"
                    onClick={() => setQuizOpen(true)}
                  >
                    Hacer mi match <ArrowRight size={16} />
                  </button>
                </Empty>
              ) : filtered.length ? (
                <div className="cards-grid">
                  {filtered.map((item) => (
                    <OpportunityCard
                      key={item.id}
                      item={item}
                      saved={saved.includes(item.id)}
                      toggle={() => toggleSaved(item.id)}
                      onDetails={() => setDetails(item)}
                      match={
                        view === 'matches'
                          ? (matchMap.get(item.id) ?? undefined)
                          : undefined
                      }
                      now={now}
                    />
                  ))}
                </div>
              ) : (
                <Empty className="empty-state">
                  {view === 'saved' && !saved.length ? (
                    <Bookmark size={33} />
                  ) : (
                    <Search size={33} />
                  )}
                  <EmptyHeader>
                    <EmptyTitle>
                      {view === 'saved' && !saved.length
                        ? 'Tu próxima oportunidad puede estar aquí.'
                        : 'No encontramos coincidencias.'}
                    </EmptyTitle>
                    <EmptyDescription>
                      {view === 'saved' && !saved.length
                        ? 'Guarda lo que te interesa con el marcador de cada tarjeta.'
                        : view === 'matches' && !hasFilters
                          ? 'El catálogo aún no cubre esa combinación. Prueba otros objetivos o explora todas las opciones.'
                          : 'Prueba otra búsqueda o amplía tus filtros.'}
                    </EmptyDescription>
                  </EmptyHeader>
                  <button
                    className="button secondary"
                    onClick={() =>
                      hasFilters ? resetFilters() : switchView('explore')
                    }
                  >
                    {hasFilters ? 'Limpiar filtros' : 'Explorar oportunidades'}
                  </button>
                </Empty>
              )}
            </TabsContent>
            <div className="catalog-footnote">
              <ShieldCheck size={15} />
              <p>
                Revisión editorial: {reviewedLabel}. Confirma requisitos y
                vigencia en la fuente oficial. Consulta el alcance de cada
                programa antes de postular.
              </p>
            </div>
          </section>
        </div>
        <Contribute />
        <footer className="site-footer">
          <a
            href="#mapa"
            className="footer-atlas-brand"
            onClick={(event) => {
              event.preventDefault();
              document
                .getElementById('mapa')
                ?.scrollIntoView({ block: 'start' });
            }}
          >
            <SiteMark variant="footer" />
          </a>
          <p>Oportunidades para moverte.</p>
          <a className="text-button" href="#colabora">¿Conoces más programas? Colabora aquí <ArrowUpRight size={13} /></a>
          <button className="text-button" onClick={() => setAboutOpen(true)}>
            Cómo funciona y privacidad <ArrowUpRight size={13} />
          </button>
          <span>Hecho para emprender en Latinoamérica</span>
        </footer>
        {storageError && (
          <p className="storage-note">
            Este navegador no permite guardar tus preferencias. Puedes seguir
            explorando, pero la selección puede perderse al cerrar.
          </p>
        )}
        <div className="sr-only" role="status" aria-live="polite">
          {announcement}
        </div>
      </main>
      <MatchQuiz
        open={quizOpen}
        setOpen={setQuizOpen}
        profile={profile}
        onComplete={completeMatch}
      />
      <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
        <SheetContent
          side="left"
          className="filters-sheet"
          showCloseButton={false}
        >
          <SheetClose className="dialog-dismiss" aria-label="Cerrar filtros">
            <X size={20} />
          </SheetClose>
          <SheetTitle>Personaliza tu búsqueda</SheetTitle>
          <SheetDescription>
            Combina filtros para encontrar el apoyo que necesitas.
          </SheetDescription>
          <div>{filterFields()}</div>
          <button
            className="button primary"
            onClick={() => setMobileFilters(false)}
          >
            Ver {filtered.length} oportunidades <ArrowRight size={16} />
          </button>
        </SheetContent>
      </Sheet>
      <Sheet
        open={!!details}
        onOpenChange={(open) => {
          if (!open) setDetails(null);
        }}
      >
        <SheetContent className="detail-sheet" showCloseButton={false}>
          {details && (
            <>
              <SheetClose
                className="dialog-dismiss"
                aria-label="Cerrar detalles"
              >
                <X size={20} />
              </SheetClose>
              <div className="detail-scroll">
                <ProviderLogo id={details.id} provider={details.org} large />
                <p className="org-name">{details.org}</p>
                <SheetTitle className="detail-title">{details.name}</SheetTitle>
                <SheetDescription className="detail-description">
                  {details.description}
                </SheetDescription>
                <div className="card-status">
                  <span
                    className={'status-dot ' + availability(details, now)}
                  />
                  {availabilityLabels[availability(details, now)]}
                </div>
                <dl className="detail-facts">
                  <div>
                    <dt>Tipo de beneficio</dt>
                    <dd>{details.benefitType}</dd>
                  </div>
                  <div>
                    <dt>Costo y condiciones</dt>
                    <dd>{details.costLabel}</dd>
                  </div>
                  <div>
                    <dt>
                      <MapPin size={13} />
                      Ubicación
                    </dt>
                    <dd>{details.location}</dd>
                  </div>
                  <div>
                    <dt>Modalidad</dt>
                    <dd>{details.mode}</dd>
                  </div>
                  {details.closesAt && (
                    <div>
                      <dt>
                        <Clock3 size={13} />
                        Cierre publicado
                      </dt>
                      <dd>{dateFormat.format(new Date(details.closesAt))}</dd>
                    </div>
                  )}
                </dl>
                {profile && (
                  <div className="detail-match">
                    <h3>
                      <Sparkles size={17} />
                      Tu afinidad con esta oportunidad
                    </h3>
                    {matchMap.get(details.id)?.reasons.map((r) => (
                      <p key={r}>
                        <Check size={14} />
                        {r}
                      </p>
                    ))}
                    {matchMap.get(details.id)?.pending.map((r) => (
                      <p key={r} className="pending-reason">
                        {r}
                      </p>
                    ))}
                  </div>
                )}
                <section className="detail-section">
                  <h3>Qué puedes obtener</h3>
                  <ul>
                    {details.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </section>
                <section className="detail-section">
                  <h3>Qué necesitas revisar</h3>
                  <ul>
                    {details.requirements.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </section>
                <div className="detail-note">
                  <CircleHelp size={18} />
                  <p>{details.note}</p>
                </div>
                <p className="source-note">
                  Revisado el{' '}
                  {dateFormat.format(
                    new Date(details.checkedAt + 'T12:00:00-05:00'),
                  )}
                  .{' '}
                  <a
                    href={details.sourceUrl ?? details.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Consultar fuente <ArrowUpRight size={12} />
                  </a>
                </p>
              </div>
              <div className="detail-actions">
                <button
                  className={
                    'button secondary ' +
                    (saved.includes(details.id) ? 'is-saved' : '')
                  }
                  onClick={() => toggleSaved(details.id)}
                  aria-pressed={saved.includes(details.id)}
                >
                  <Bookmark
                    size={17}
                    fill={saved.includes(details.id) ? 'currentColor' : 'none'}
                  />
                  {saved.includes(details.id) ? 'Guardado' : 'Guardar'}
                </button>
                <a
                  className="button primary"
                  href={details.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ir al sitio oficial <ArrowUpRight size={17} />
                </a>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="about-dialog" showCloseButton={false}>
          <DialogClose
            className="dialog-dismiss"
            aria-label="Cerrar información"
          >
            <X size={20} />
          </DialogClose>
          <DialogTitle>Un mapa para encontrar tu siguiente paso.</DialogTitle>
          <DialogDescription>
            Reunimos programas, inversión y recursos publicados por las propias
            instituciones.
          </DialogDescription>
          <div className="about-copy">
            <h3>Un atlas en expansión</h3>
            <p>
              Los países marcados como “Por mapear” todavía no tienen fichas
              en este catálogo. Los programas regionales pueden aceptar equipos
              de varios países; comprueba su alcance en la ficha oficial. El
              cuestionario de match usa regiones de Perú y puede mostrar
              oportunidades regionales que aceptan candidaturas peruanas. Aún
              no evalúa perfiles residentes en otros países.
            </p>
            <p>
              El mapa sitúa países, no sedes de instituciones. Cartografía de{' '}
              <a
                href="https://www.naturalearthdata.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Natural Earth
              </a>{' '}
              (
              <a
                href="/map-attribution.txt"
                target="_blank"
                rel="noopener noreferrer"
              >
                créditos del mapa
              </a>
              ).
            </p>
            <h3>Así funciona el match</h3>
            <p>
              Comparamos etapa, tipo de negocio, sector, objetivos y ubicación.
              Las convocatorias cerradas y los perfiles que no coinciden se
              excluyen de las recomendaciones. La afinidad prioriza tus
              objetivos; no es una probabilidad de admisión.
            </p>
            <h3>Información con contexto</h3>
            <p>
              Cada ficha enlaza al proveedor oficial. Las fechas conocidas
              vencen automáticamente. Después de 45 días sin revisión, indicamos
              que hace falta confirmar la vigencia. Las fuentes se actualizan de
              forma editorial, no en tiempo real.
            </p>
            <h3>Tus datos</h3>
            <p>
              Guardados y respuestas del match permanecen en este navegador. No
              pedimos nombre ni información financiera para explorar. Si eliges
              recibir novedades, guardamos tu correo y consentimiento por
              separado; si sugieres un programa, guardamos tu propuesta y solo
              el correo opcional que escribas. No vinculamos esos datos con tu
              perfil de match. Puedes eliminar tu perfil desde Mis matches,
              quitar cada guardado con su marcador y retirar tu correo desde
              el formulario de novedades. Revisamos sugerencias antes de
              publicarlas; no enviamos correos automáticos desde el sitio.
            </p>
            <UnsubscribeForm />
            <h3>Tu postulación</h3>
            <p>
              La inscripción, evaluación y contratación se realizan directamente
              con cada institución. Este es un catálogo independiente y no
              representa a las organizaciones listadas.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
