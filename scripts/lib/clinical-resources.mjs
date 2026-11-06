// Synthetic resources for the exact filters used by rap-007 through rap-016.
export function clinicalFixtures(patientId) {
  const subject = { reference: `Patient/${patientId}` };
  const medicationCodeableConcept = { text: 'Synthetic test medication' };
  const date = '2026-01-01T12:00:00Z';
  return [
    { resourceType: 'Condition', subject, code: { text: 'Synthetic test condition' },
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] } },
    { resourceType: 'AllergyIntolerance', patient: subject, code: { text: 'Synthetic test allergy' },
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active' }] } },
    { resourceType: 'Observation', status: 'final', subject,
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory' }] }],
      code: { coding: [{ system: 'http://loinc.org', code: '718-7' }] }, effectiveDateTime: date,
      valueQuantity: { value: 14, unit: 'g/dL', system: 'http://unitsofmeasure.org', code: 'g/dL' } },
    { resourceType: 'DiagnosticReport', status: 'final', subject, effectiveDateTime: date,
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0074', code: 'LAB' }] }],
      code: { text: 'Synthetic test laboratory report' } },
    { resourceType: 'ImagingStudy', status: 'registered', subject },
    { resourceType: 'MedicationRequest', status: 'active', intent: 'order', subject,
      medicationCodeableConcept, authoredOn: date },
    { resourceType: 'MedicationDispense', status: 'completed', subject,
      medicationCodeableConcept, whenHandedOver: date },
    { resourceType: 'Immunization', status: 'completed', patient: subject,
      vaccineCode: { text: 'Synthetic test vaccine' }, occurrenceDateTime: date, primarySource: true },
    { resourceType: 'MedicationStatement', status: 'active', subject,
      medicationCodeableConcept, effectiveDateTime: date },
    { resourceType: 'Encounter', status: 'finished', subject,
      class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'AMB' },
      period: { start: date, end: '2026-01-01T13:00:00Z' } },
  ];
}
