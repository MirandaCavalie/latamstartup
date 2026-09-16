'use client';
import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { categoryLabels } from './opportunities';
import type { Opportunity } from './opportunities';

type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};
type ModelContext = {
  registerTool: (
    tool: Tool,
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
type Options = {
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  view: string;
  setView: (v: 'explore' | 'resources' | 'matches' | 'saved') => void;
  saved: string[];
  setSaved: (ids: string[]) => void;
  visible: Opportunity[];
  resetFilters: () => void;
};
const summarize = (items: Opportunity[]) =>
  items.map(({ id, name, org, url, category }) => ({
    id,
    name,
    org,
    url,
    category,
  }));
function record(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('Se esperaba un objeto.');
  return input as Record<string, unknown>;
}
export function useMappingTools(options: Options) {
  const ref = useRef(options);
  ref.current = options;
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tools: Tool[] = [
      {
        name: 'search_mapping_opportunities',
        title: 'Buscar oportunidades en Mapping',
        description:
          'Busca en el catálogo y actualiza los resultados visibles. No abre enlaces ni envía postulaciones.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', maxLength: 200 },
            category: {
              type: 'string',
              enum: ['all', ...Object.keys(categoryLabels)],
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const v = record(input);
          if (
            Object.keys(v).some((k) => !['query', 'category'].includes(k)) ||
            typeof v.query !== 'string' ||
            v.query.length > 200 ||
            ('category' in v &&
              (typeof v.category !== 'string' ||
                !['all', ...Object.keys(categoryLabels)].includes(v.category)))
          )
            throw new Error('Búsqueda o categoría inválida.');
          flushSync(() => {
            ref.current.resetFilters();
            ref.current.setView('explore');
            ref.current.setQuery(v.query as string);
            ref.current.setCategory((v.category as string) ?? 'all');
          });
          return {
            count: ref.current.visible.length,
            opportunities: summarize(ref.current.visible),
          };
        },
      },
      {
        name: 'read_mapping_results',
        title: 'Leer resultados de Mapping',
        description:
          'Devuelve las oportunidades visibles y los identificadores guardados en este navegador.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute(input) {
          if (Object.keys(record(input)).length)
            throw new Error('No se aceptan parámetros.');
          return {
            view: ref.current.view,
            query: ref.current.query,
            category: ref.current.category,
            count: ref.current.visible.length,
            opportunities: summarize(ref.current.visible),
            savedIds: ref.current.saved,
          };
        },
      },
    ];
    tools.forEach((tool) => {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {
          /* Browsers without the experimental interface keep the normal UI. */
        });
      } catch {
        /* Optional browser capability. */
      }
    });
    return () => lifecycle.abort();
  }, []);
}
