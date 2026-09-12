export interface ControlRequirement { id: string; framework: string; name: string; requiredEvidenceTypes: string[]; maxAgeDays: number; }
export interface Evidence { id: string; type: string; collectedAt: string; source: string; checksum: string; valid: boolean; }
export interface ControlAssessment { controlId: string; status: "satisfied" | "stale" | "missing" | "invalid"; evidenceIds: string[]; reasons: string[]; }
export interface EvidenceGap { controlId: string; severity: "medium" | "high" | "critical"; missingTypes: string[]; staleEvidenceIds: string[]; }

export function assessControl(control: ControlRequirement, evidence: Evidence[], now = new Date()): ControlAssessment {
  const relevant = evidence.filter(e => control.requiredEvidenceTypes.includes(e.type));
  const stale = relevant.filter(e => now.getTime() - new Date(e.collectedAt).getTime() > control.maxAgeDays * 86_400_000);
  const invalid = relevant.filter(e => !e.valid);
  const missingTypes = control.requiredEvidenceTypes.filter(t => !relevant.some(e => e.type === t));
  if (invalid.length) return { controlId: control.id, status: "invalid", evidenceIds: invalid.map(e => e.id), reasons: ["One or more evidence items are marked invalid"] };
  if (missingTypes.length) return { controlId: control.id, status: "missing", evidenceIds: relevant.map(e => e.id), reasons: [`Missing evidence types: ${missingTypes.join(", ")}`] };
  if (stale.length) return { controlId: control.id, status: "stale", evidenceIds: relevant.map(e => e.id), reasons: [`Evidence exceeds freshness window: ${stale.map(e => e.id).join(", ")}`] };
  return { controlId: control.id, status: "satisfied", evidenceIds: relevant.map(e => e.id), reasons: ["Required evidence is present, valid and fresh"] };
}

export function buildGap(control: ControlRequirement, assessment: ControlAssessment, evidence: Evidence[]): EvidenceGap | undefined {
  if (assessment.status === "satisfied") return undefined;
  const missingTypes = control.requiredEvidenceTypes.filter(t => !evidence.some(e => e.type === t));
  const staleEvidenceIds = evidence.filter(e => assessment.status === "stale" && control.requiredEvidenceTypes.includes(e.type)).map(e => e.id);
  return { controlId: control.id, severity: assessment.status === "invalid" ? "critical" : assessment.status === "missing" ? "high" : "medium", missingTypes, staleEvidenceIds };
}
