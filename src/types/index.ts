export interface GovernmentService {
  id: string;
  serviceName: string;
  serviceNameMr?: string;
  serviceNameHi?: string;
  category: 'maharashtra' | 'central';
  department: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  officialPortal: string;
  processingTime: string;
  fees: string;
  youtubeSearchQuery: string;
  lastVerified: string;
  icon?: string;
  subcategory?: 'certificates' | 'identity' | 'licences' | 'welfare' | 'revenue';
  keywords?: string[];
  faqs?: { question: string; answer: string }[];
  warnings?: string[];
  officialLinks?: { label: string; url: string }[];
}

export interface AIServiceResponse {
  serviceId?: string;
  serviceName: string;
  serviceNameLocal?: string;
  department: string;
  category: 'maharashtra' | 'central';
  overview: string;
  eligibility: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  officialLinks: { label: string; url: string }[];
  youtubeSearchQueries: string[];
  faqs: { question: string; answer: string }[];
  warnings: string[];
  processingTime: string;
  fees: string;
  confidenceScore?: number;
}

export type Language = 'en' | 'mr' | 'hi';

export interface TranslationStrings {
  brandName: string;
  tagline: string;
  navHome: string;
  navAssistant: string;
  navUpload: string;
  navDirectory: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  searchButton: string;
  uploadButton: string;
  popularServices: string;
  popularServicesSubtitle: string;
  exampleSearches: string;
  serviceDirectory: string;
  directorySubtitle: string;
  overview: string;
  requiredDocuments: string;
  stepByStep: string;
  officialLinks: string;
  videoTutorials: string;
  faqs: string;
  aboutTitle: string;
  howItWorks: string;
  resources: string;
  privacyPolicy: string;
  disclaimer: string;
  disclaimerText: string;
  resetSearch: string;
  loading: string;
  noResults: string;
  uploadTitle: string;
  uploadDescription: string;
  uploadWarning: string;
  maxFileSize: string;
  optionalDescription: string;
  analyzeDocument: string;
  viewGuide: string;
  officialPortal: string;
  processingTime: string;
  fees: string;
  stateGov: string;
  centralGov: string;
  documentsChecked: string;
  allDocumentsReady: string;
  printGuide: string;
  copySummary: string;
  askFollowUp: string;
  askFollowUpPlaceholder: string;
  sendQuestion: string;
}

export interface UploadedFile {
  file: File;
  preview: string;
  type: string;
}
