// Centralized Staff Portal Configuration (Stage 6)

export const STAFF_SUBMISSION_TYPES = {
  PUBLICATION: {
    id: 'PUBLICATION',
    label: 'Research Publication (Scopus / SCI / UGC)',
    category: 'RESEARCH',
    requiredEvidenceTypes: ['PUBLICATION_PROOF', 'DOI_LANDING_PAGE'],
    fields: [
      { name: 'title', label: 'Paper Title', type: 'text', required: true },
      { name: 'authors', label: 'Authors (Self & Co-authors)', type: 'text', required: true },
      { name: 'journalName', label: 'Journal / Conference Name', type: 'text', required: true },
      { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true },
      { name: 'doi', label: 'DOI / URL Link', type: 'text', required: false },
      { name: 'indexing', label: 'Indexing (Scopus, SCI, Web of Science, UGC CARE)', type: 'select', options: ['Scopus', 'SCI Indexed', 'Web of Science', 'UGC CARE', 'Other'], required: true },
    ],
  },
  RESEARCH: {
    id: 'RESEARCH',
    label: 'Extramural Funded Research Project',
    category: 'RESEARCH',
    requiredEvidenceTypes: ['SANCTION_LETTER'],
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      { name: 'fundingAgency', label: 'Funding Agency (DST, AICTE, ISRO, SERB, CSIR)', type: 'text', required: true },
      { name: 'amountLakhs', label: 'Sanctioned Amount (INR Lakhs)', type: 'number', required: true },
      { name: 'startDate', label: 'Sanction Date', type: 'date', required: true },
      { name: 'role', label: 'Role (PI / Co-PI)', type: 'select', options: ['Principal Investigator (PI)', 'Co-Principal Investigator (Co-PI)'], required: true },
    ],
  },
  FDP: {
    id: 'FDP',
    label: 'Faculty Development Program (ATAL / NPTEL FDP)',
    category: 'ACADEMIC',
    requiredEvidenceTypes: ['FDP_CERTIFICATE'],
    fields: [
      { name: 'title', label: 'FDP / Workshop / STTP Title', type: 'text', required: true },
      { name: 'organizer', label: 'Organizing Institution', type: 'text', required: true },
      { name: 'durationDays', label: 'Duration (Days)', type: 'number', required: true },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'mode', label: 'Mode', type: 'select', options: ['Online', 'Offline / Face-to-Face', 'Hybrid'], required: true },
    ],
  },
  PATENT: {
    id: 'PATENT',
    label: 'IPR Patent Published or Granted',
    category: 'INNOVATION',
    requiredEvidenceTypes: ['PATENT_CERTIFICATE', 'GAZETTE_PROOF'],
    fields: [
      { name: 'title', label: 'Patent Title', type: 'text', required: true },
      { name: 'applicationNumber', label: 'Patent Application Number', type: 'text', required: true },
      { name: 'status', label: 'Patent Status', type: 'select', options: ['Published', 'Granted'], required: true },
      { name: 'filingDate', label: 'Publication / Grant Date', type: 'date', required: true },
    ],
  },
  AWARD: {
    id: 'AWARD',
    label: 'Academic / Research Award & Recognition',
    category: 'ACHIEVEMENT',
    requiredEvidenceTypes: ['AWARD_CERTIFICATE'],
    fields: [
      { name: 'title', label: 'Award Title', type: 'text', required: true },
      { name: 'awardingBody', label: 'Awarding Body / Agency', type: 'text', required: true },
      { name: 'awardDate', label: 'Date Received', type: 'date', required: true },
    ],
  },
};

export const STAFF_PROFILE_SECTIONS = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'academic', title: 'Academic Qualifications' },
  { id: 'experience', title: 'Professional Experience' },
  { id: 'research', title: 'Research Profiles & IDs' },
  { id: 'contact', title: 'Contact Information' },
];
