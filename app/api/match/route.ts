import { getDatabase } from '@/db';
import { reserveIntake, intakePaused } from '@/lib/intake-budget';
import { readSmallJson, sameOriginJson } from '@/lib/request-checks';
import { hashToken, PRIVACY_VERSION, MATCH_POLICY_VERSION, validDeletionToken } from '@/lib/privacy';
import { validateProfile, matchOpportunity } from '@/lib/match';
import { opportunities } from '@/lib/opportunities';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOriginJson(request)) return Response.json({ error: 'Solicitud no válida.' }, { status: 400 });
  const data = await readSmallJson(request);
  const profile = validateProfile(data?.profile);
  if (!profile || data?.consent !== true || data.privacyVersion !== PRIVACY_VERSION || !validDeletionToken(data.deletionToken)) {
    return Response.json({ error: 'Revisa el perfil y el consentimiento.' }, { status: 400 });
  }
  const now = new Date();
  // Store only enumerated fields, never an email, free text, IP or user agent.
  const recommended = opportunities.filter((item) => matchOpportunity(item, profile, now).eligibleForSuggestions).map((item) => item.id);
  try {
    if (!await reserveIntake(getDatabase(), 'match')) return intakePaused();
    await getDatabase().prepare(`INSERT INTO match_profiles
      (deletion_hash, country_code, stage, business_type, sector, needs, recommended_ids, privacy_version, algorithm_version)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(deletion_hash) DO UPDATE SET country_code=excluded.country_code, stage=excluded.stage,
      business_type=excluded.business_type, sector=excluded.sector, needs=excluded.needs,
      recommended_ids=excluded.recommended_ids, privacy_version=excluded.privacy_version,
      algorithm_version=excluded.algorithm_version, updated_at=CURRENT_TIMESTAMP, consent_at=CURRENT_TIMESTAMP`)
      .bind(await hashToken(data.deletionToken), profile.countryCode, profile.stage, profile.businessType,
        profile.sector, JSON.stringify(profile.needs), JSON.stringify(recommended), PRIVACY_VERSION, MATCH_POLICY_VERSION).run();
    return Response.json({ ok: true });
  } catch {
    console.error('Match storage failed');
    return Response.json({ error: 'No pudimos compartir las respuestas. Tu match funciona igualmente.' }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!sameOriginJson(request)) return Response.json({ error: 'Solicitud no válida.' }, { status: 400 });
  const data = await readSmallJson(request);
  if (!validDeletionToken(data?.deletionToken)) return Response.json({ error: 'Código privado no válido.' }, { status: 400 });
  try {
    await getDatabase().prepare('DELETE FROM match_profiles WHERE deletion_hash = ?').bind(await hashToken(data.deletionToken)).run();
    return Response.json({ ok: true });
  } catch {
    console.error('Match removal failed');
    return Response.json({ error: 'No pudimos eliminar las respuestas. Inténtalo otra vez.' }, { status: 503 });
  }
}
