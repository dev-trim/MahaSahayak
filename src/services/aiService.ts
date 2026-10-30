import { GoogleGenAI } from '@google/genai';
import type { AIServiceResponse, Language, GovernmentService } from '../types';
import { services } from '../data/services';

const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const isKeyConfigured =
  typeof rawApiKey === 'string' &&
  rawApiKey.trim() !== '' &&
  !rawApiKey.includes('your_gemini_api_key') &&
  !rawApiKey.includes('PLACEHOLDER');

let genAIClient: GoogleGenAI | null = null;
if (isKeyConfigured) {
  try {
    genAIClient = new GoogleGenAI({ apiKey: rawApiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client, falling back to local engine:', err);
  }
}

/**
 * Intelligent local matcher that maps natural language queries to official services
 */
export function findMatchingService(query: string): GovernmentService {
  const normalized = query.toLowerCase().trim();

  // Keyword rules & scoring
  let bestService: GovernmentService = services[0];
  let highestScore = -1;

  for (const s of services) {
    let score = 0;

    // Check ID
    if (normalized.includes(s.id)) score += 15;

    // Check service names (English, Marathi, Hindi)
    if (normalized.includes(s.serviceName.toLowerCase())) score += 20;
    if (s.serviceNameMr && normalized.includes(s.serviceNameMr.toLowerCase())) score += 25;
    if (s.serviceNameHi && normalized.includes(s.serviceNameHi.toLowerCase())) score += 25;

    // Check individual keywords
    if (s.keywords) {
      for (const kw of s.keywords) {
        if (normalized.includes(kw.toLowerCase())) {
          score += 8;
        }
      }
    }

    // Specific intent patterns
    if (s.id === 'aadhaar-services') {
      if (
        normalized.includes('aadhaar') ||
        normalized.includes('aadhar') ||
        normalized.includes('uidai') ||
        normalized.includes('आधार')
      ) {
        score += 15;
      }
    } else if (s.id === 'income-certificate') {
      if (
        normalized.includes('income') ||
        normalized.includes('aay') ||
        normalized.includes('उत्पन्न') ||
        normalized.includes('आय') ||
        normalized.includes('salary') ||
        normalized.includes('scholarship')
      ) {
        score += 12;
      }
    } else if (s.id === 'caste-certificate') {
      if (
        normalized.includes('caste') ||
        normalized.includes('जाती') ||
        normalized.includes('जात') ||
        normalized.includes('जाति') ||
        normalized.includes('sc') ||
        normalized.includes('st') ||
        normalized.includes('obc') ||
        normalized.includes('vjnt') ||
        normalized.includes('barti')
      ) {
        score += 12;
      }
    } else if (s.id === 'domicile-certificate') {
      if (
        normalized.includes('domicile') ||
        normalized.includes('अधिवास') ||
        normalized.includes('डोमिसाइल') ||
        normalized.includes('डोमिसाईल') ||
        normalized.includes('residence proof') ||
        normalized.includes('15 year')
      ) {
        score += 15;
      }
    } else if (s.id === 'non-creamy-layer') {
      if (
        normalized.includes('creamy') ||
        normalized.includes('ncl') ||
        normalized.includes('नॉन-क्रिमी') ||
        normalized.includes('non creamy') ||
        normalized.includes('8 lakh')
      ) {
        score += 20;
      }
    } else if (s.id === 'birth-certificate') {
      if (
        normalized.includes('birth') ||
        normalized.includes('जन्म') ||
        normalized.includes('born') ||
        normalized.includes('crsorgi')
      ) {
        score += 15;
      }
    } else if (s.id === 'death-certificate') {
      if (
        normalized.includes('death') ||
        normalized.includes('मृत्यू') ||
        normalized.includes('मृत्यु') ||
        normalized.includes('expire')
      ) {
        score += 15;
      }
    } else if (s.id === 'driving-licence') {
      if (
        normalized.includes('driving') ||
        normalized.includes('licence') ||
        normalized.includes('license') ||
        normalized.includes('वाहन') ||
        normalized.includes('ड्रायव्हिंग') ||
        normalized.includes('rto') ||
        normalized.includes('parivahan') ||
        normalized.includes('sarathi')
      ) {
        score += 15;
      }
    } else if (s.id === 'pan-card') {
      if (
        normalized.includes('pan') ||
        normalized.includes('पॅन') ||
        normalized.includes('पैन') ||
        normalized.includes('nsdl') ||
        normalized.includes('tax')
      ) {
        score += 15;
      }
    } else if (s.id === 'ration-card') {
      if (
        normalized.includes('ration') ||
        normalized.includes('rashan') ||
        normalized.includes('रेशन') ||
        normalized.includes('राशन') ||
        normalized.includes('bpl') ||
        normalized.includes('food') ||
        normalized.includes('dhanya')
      ) {
        score += 15;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestService = s;
    }
  }

  // Default to Aaple Sarkar portal hub if nothing matched specifically
  if (highestScore <= 0) {
    const general = services.find((s) => s.id === 'aaple-sarkar');
    if (general) return general;
  }

  return bestService;
}

/**
 * Builds a structured AIServiceResponse from a GovernmentService model
 */
export function buildResponseFromService(
  service: GovernmentService,
  lang: Language = 'en'
): AIServiceResponse {
  let localTitle = service.serviceName;
  if (lang === 'mr' && service.serviceNameMr) {
    localTitle = service.serviceNameMr;
  } else if (lang === 'hi' && service.serviceNameHi) {
    localTitle = service.serviceNameHi;
  }

  const youtubeQueries = [
    service.youtubeSearchQuery,
    `How to apply for ${service.serviceName} Maharashtra step by step`,
    `Aaple Sarkar ${service.serviceName} online process guide`,
  ];

  const officialLinks = service.officialLinks || [
    { label: `${service.serviceName} - Official Portal`, url: service.officialPortal },
    { label: 'Aaple Sarkar Maharashtra Portal', url: 'https://aaplesarkar.mahaonline.gov.in' },
  ];

  return {
    serviceId: service.id,
    serviceName: service.serviceName,
    serviceNameLocal: localTitle,
    department: service.department,
    category: service.category,
    overview: service.description,
    eligibility: service.eligibility,
    requiredDocuments: service.requiredDocuments,
    applicationSteps: service.applicationSteps,
    officialLinks,
    youtubeSearchQueries: youtubeQueries,
    faqs: service.faqs || [
      {
        question: `How can I track my ${service.serviceName} application?`,
        answer: `You can track your application status using the Application Token / Reference Number on ${service.officialPortal}.`,
      },
      {
        question: `What should I do if my ${service.serviceName} application is rejected?`,
        answer: `Under the Maharashtra Right to Public Services Act (RTS), you have the legal right to view the written rejection reason and file a First Appeal online within 30 days on Aaple Sarkar.`,
      },
    ],
    warnings: service.warnings || [
      'Always access official portals ending in .gov.in or .nic.in to prevent cyber fraud.',
      'Never pay unofficial cash fees to middlemen or touts.',
    ],
    processingTime: service.processingTime,
    fees: service.fees,
    confidenceScore: 0.95,
  };
}

/**
 * Analyzes natural language requirements using Gemini API with intelligent local fallback
 */
export async function analyzeRequirement(
  userInput: string,
  language: Language = 'en'
): Promise<AIServiceResponse> {
  // If user passed a service ID directly (e.g. from service cards)
  const exactMatch = services.find(
    (s) => s.id.toLowerCase() === userInput.toLowerCase().trim()
  );
  if (exactMatch) {
    return buildResponseFromService(exactMatch, language);
  }

  // Try Gemini API if key is available
  if (genAIClient) {
    try {
      const languageInstruction =
        language === 'mr'
          ? 'Respond with overview, steps, and explanations in Marathi (मराठी).'
          : language === 'hi'
          ? 'Respond with overview, steps, and explanations in Hindi (हिन्दी).'
          : 'Respond in clear, accessible English.';

      const prompt = `You are "MahaSahayak", the official AI citizen assistance engine for Maharashtra, India.
A citizen has described their requirement or situation:
"${userInput}"

Carefully analyze the requirement and identify the matching Maharashtra or Central Government service.
Provide the response strictly as valid JSON conforming to this schema without Markdown or backticks:
{
  "serviceName": "Official name of the service (e.g. Income Certificate)",
  "serviceNameLocal": "Service name in local language",
  "department": "Name of the government department (e.g. Revenue Department, Govt of Maharashtra)",
  "category": "maharashtra" or "central",
  "overview": "Beginner-friendly explanation of what this service is, why it is needed, and validity",
  "eligibility": ["Eligibility criteria 1", "Eligibility criteria 2", "Eligibility criteria 3"],
  "requiredDocuments": ["Document 1 with accepted alternatives", "Document 2", "Document 3"],
  "applicationSteps": ["Step 1: Visit portal...", "Step 2: Register with...", "Step 3: Upload...", "Step 4: Pay fee..."],
  "officialLinks": [
    {"label": "Official Portal Name", "url": "https://..."},
    {"label": "Department Page", "url": "https://..."}
  ],
  "youtubeSearchQueries": [
    "How to apply for [service] Maharashtra online step by step",
    "Aaple Sarkar [service] document upload tutorial"
  ],
  "faqs": [
    {"question": "FAQ Question 1", "answer": "Practical answer 1"},
    {"question": "FAQ Question 2", "answer": "Practical answer 2"}
  ],
  "warnings": [
    "Security caution: Only use official .gov.in domains",
    "Important statutory deadline or fee warning"
  ],
  "processingTime": "e.g. 7-15 working days",
  "fees": "e.g. ₹33.60 to ₹50 on Aaple Sarkar"
}

Important Rules:
- Prioritize Maharashtra Aaple Sarkar (aaplesarkar.mahaonline.gov.in) for state services.
- Prioritize official Central portals (UIDAI, Parivahan, NSDL, CRSORGI) for central services.
- Never invent unofficial websites, fake fees, or pretend the application was already submitted.
- ${languageInstruction}`;

      const response = await genAIClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      // Clean JSON in case markdown block is present
      const cleanJson = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson) as AIServiceResponse;

      // Find matching service in our verified directory for reference ID and official links verification
      const matched = findMatchingService(parsed.serviceName || userInput);
      parsed.serviceId = matched.id;
      if (!parsed.officialLinks || parsed.officialLinks.length === 0) {
        parsed.officialLinks = matched.officialLinks || [
          { label: matched.serviceName, url: matched.officialPortal },
        ];
      }

      return parsed;
    } catch (apiError) {
      console.warn('Gemini API call failed or timed out, activating local knowledge engine:', apiError);
      // Fallback seamlessly to local knowledge base
    }
  }

  // Local knowledge engine matching
  const matchedService = findMatchingService(userInput);
  return buildResponseFromService(matchedService, language);
}

/**
 * Analyzes uploaded requirement document / image
 */
export async function analyzeDocumentRequirement(
  file: File,
  userDescription: string,
  language: Language = 'en'
): Promise<AIServiceResponse> {
  const combinedContext = `${file.name} ${userDescription}`.trim();

  // If Gemini API is available and file is image or small text, use multimodal capability
  if (genAIClient) {
    try {
      if (file.type.startsWith('image/')) {
        const base64Data = await fileToBase64(file);
        const languageInstruction =
          language === 'mr'
            ? 'Respond with overview, steps, and explanation in Marathi (मराठी).'
            : language === 'hi'
            ? 'Respond with overview, steps, and explanation in Hindi (हिन्दी).'
            : 'Respond in English.';

        const prompt = `You are MahaSahayak, the Maharashtra citizen service assistant.
The citizen uploaded an image related to a government service requirement (e.g., electricity bill, birth record, mark sheet, ration card, notice, or certificate).
The citizen added this note: "${userDescription || 'Please tell me what government service this is needed for and how to apply'}".

Identify what this document is, what government service in Maharashtra it is typically required for (e.g. Domicile, Income, Caste, Ration Card, Aadhaar, etc.), and provide complete application instructions.
Provide the response strictly as valid JSON without markdown:
{
  "serviceName": "Official name of the service",
  "serviceNameLocal": "Local title",
  "department": "Government Department",
  "category": "maharashtra" or "central",
  "overview": "Explanation including confirmation of the document they uploaded and how it fits into the application",
  "eligibility": ["Eligibility 1", "Eligibility 2"],
  "requiredDocuments": ["Document 1", "Document 2"],
  "applicationSteps": ["Step 1", "Step 2", "Step 3"],
  "officialLinks": [{"label": "Portal", "url": "https://..."}],
  "youtubeSearchQueries": ["How to apply..."],
  "faqs": [{"question": "...", "answer": "..."}],
  "warnings": ["..."],
  "processingTime": "...",
  "fees": "..."
}
${languageInstruction}`;

        const response = await genAIClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: file.type,
                    data: base64Data,
                  },
                },
                { text: prompt },
              ],
            },
          ],
        });

        const text = response.text || '';
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson) as AIServiceResponse;
        const matched = findMatchingService(parsed.serviceName || combinedContext);
        parsed.serviceId = matched.id;
        return parsed;
      }
    } catch (docError) {
      console.warn('Gemini document vision analysis failed, falling back to local extractor:', docError);
    }
  }

  // Fallback: If text file, try reading snippet
  let extractedText = '';
  if (file.type === 'text/plain') {
    try {
      extractedText = await file.text();
    } catch {
      // ignore
    }
  }

  const fullPrompt = `${file.name} ${extractedText.slice(0, 500)} ${userDescription}`;
  const matchedService = findMatchingService(fullPrompt);
  const response = buildResponseFromService(matchedService, language);

  // Customize overview with document acknowledgment
  response.overview = `Based on your uploaded document (${file.name}) and description, you appear to be preparing for ${matchedService.serviceName}. ${response.overview}`;

  return response;
}

/**
 * Ask a follow-up question regarding a specific service
 */
export async function askServiceQuestion(
  serviceName: string,
  userQuestion: string,
  language: Language = 'en'
): Promise<string> {
  if (genAIClient) {
    try {
      const languageInstruction =
        language === 'mr'
          ? 'Respond in Marathi (मराठी).'
          : language === 'hi'
          ? 'Respond in Hindi (हिन्दी).'
          : 'Respond in English.';

      const prompt = `You are MahaSahayak, citizen assistance AI for Maharashtra.
Service: ${serviceName}
Citizen's Question: "${userQuestion}"

Provide a concise, helpful, and accurate response based strictly on official Maharashtra / Central government guidelines. Avoid legal jargon. Mention relevant official documents or portals if helpful.
${languageInstruction}`;

      const res = await genAIClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (res.text) return res.text;
    } catch (err) {
      console.warn('AI follow-up question failed, using local guidance:', err);
    }
  }

  // Local fallback response
  if (language === 'mr') {
    return `${serviceName} बाबत आपल्या प्रश्नासाठी: अधिकृत Aaple Sarkar (aaplesarkar.mahaonline.gov.in) पोर्टलनुसार, सर्व कागदपत्रांची मूळ प्रत किंवा स्व-साक्षांकित प्रत अपलोड करणे अनिवार्य आहे. कोणत्याही अडचणीसाठी टोल-फ्री हेल्पलाइन १८०० १२० ८०४० वर संपर्क साधा.`;
  } else if (language === 'hi') {
    return `${serviceName} के संबंध में आपके प्रश्न के लिए: आधिकारिक आपले सरकार (aaplesarkar.mahaonline.gov.in) पोर्टल के दिशानिर्देशों के अनुसार, आवश्यक दस्तावेजों की स्पष्ट प्रति अपलोड करें। अधिक जानकारी हेतु टोल-फ्री हेल्पलाइन १८०० १२० ८०४० पर संपर्क करें।`;
  }

  return `Regarding your question about ${serviceName}: According to standard Maharashtra Aaple Sarkar / Central guidelines, ensure all documents are clearly scanned in PDF/JPEG format under 256KB. For urgent official assistance, you may contact the Aaple Sarkar Citizen Helpline at 1800 120 8040.`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
