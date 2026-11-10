import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dev server must run on port 3000 as per AI Studio environment constraints.
// In production on Cloud Run, use process.env.PORT (typically 8080).
const PORT = process.env.NODE_ENV === 'production' && process.env.PORT
  ? Number(process.env.PORT)
  : 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Lazy initializer for GoogleGenAI SDK with required telemetry User-Agent
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi di secrets/environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// API Endpoint: AI Smart Assistant for Upload & Data Editing
app.post('/api/ai/edit-upload', async (req: Request, res: Response) => {
  try {
    const ai = getAiClient();
    const { rawInput, instruction, currentStudents, mode } = req.body;

    if (!rawInput && !instruction) {
      return res.status(400).json({ error: 'Data atau instruksi tidak boleh kosong.' });
    }

    const systemInstruction = `Anda adalah Asisten AI Spesialis Kurikulum & Data Intensif UTBK SNBT Indonesia.
Tugas Anda adalah memproses, mengedit, memvalidasi, atau mengekstrak data siswa intensif UTBK dari teks mentah, file CSV, JSON, atau instruksi host bimbel.

Format Subtest Standar UTBK SNBT BP3:
1. TPS: pu (Penalaran Umum), ppu (Pengetahuan & Pemahaman Umum), kbm (Kemampuan Memahami Bacaan & Menulis), pk (Pengetahuan Kuantitatif).
2. Literasi: lbi (Literasi Bahasa Indonesia), lbe (Literasi Bahasa Inggris), pm (Penalaran Matematika).
Rentang skor standar: 300 - 850 (skala UTBK nasional).

Aturan Pemrosesan:
1. Normalisasi nama kampus PTN dan program studi (contoh: 'fk ui' -> 'Pendidikan Dokter (FK), Universitas Indonesia (UI)'; 'stei itb' -> 'Sekolah Teknik Elektro & Informatika (STEI), Institut Teknologi Bandung (ITB)'; 'ilkom ugm' -> 'Ilmu Komputer, Universitas Gadjah Mada (UGM)').
2. Perkirakan atau sesuaikan nilai passing grade realistis jika tidak ada.
3. Jika user meminta penambahan nilai Try Out baru (misal 'Tambahkan TO-7'), buatkan entri tryOuts baru dengan nilai 7 subtest yang konsisten dan hitung totalScore rata-ratanya.
4. Buatkan evaluasi 7 subtest yang mendalam (strengths, weaknesses, recommendations) dan catatan bimbingan tutor jika data baru ditambahkan.
5. Kembalikan data dalam format JSON yang terstruktur.`;

    const prompt = `
Instruksi Pengguna / Host: "${instruction || 'Ekstrak dan rapikan data siswa berikut ke format baku'}"
Mode Operasi: "${mode || 'smart_edit'}"

Data Masukan Mentah / File Upload:
${rawInput || '(Tidak ada teks mentah, jalankan instruksi terhadap data siswa saat ini)'}

Data Siswa Saat Ini di Sistem (sebagai konteks jika ingin mengedit/mengupdate):
${JSON.stringify(currentStudents?.slice(0, 10) || [], null, 2)}

Tolong kembalikan respons JSON dengan skema:
{
  "summary": "Ringkasan jelas mengenai apa yang dilakukan/diedit oleh AI (dalam Bahasa Indonesia)",
  "actionType": "update" | "add" | "replace",
  "students": [
    // Array objek siswa lengkap dengan field: id, password, name, school, classGroup, targetScore, choice1, choice2, tryOuts, evaluations, tutorNotes, updatedAt
  ],
  "warnings": ["Catatan atau peringatan jika ada data yang diestimasi"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            actionType: { type: Type.STRING },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            students: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  password: { type: Type.STRING },
                  name: { type: Type.STRING },
                  school: { type: Type.STRING },
                  classGroup: { type: Type.STRING },
                  targetScore: { type: Type.NUMBER },
                  choice1: {
                    type: Type.OBJECT,
                    properties: {
                      university: { type: Type.STRING },
                      major: { type: Type.STRING },
                      passingGradeEstimate: { type: Type.NUMBER },
                      degree: { type: Type.STRING },
                      accreditation: { type: Type.STRING }
                    },
                    required: ['university', 'major', 'passingGradeEstimate']
                  },
                  choice2: {
                    type: Type.OBJECT,
                    properties: {
                      university: { type: Type.STRING },
                      major: { type: Type.STRING },
                      passingGradeEstimate: { type: Type.NUMBER },
                      degree: { type: Type.STRING },
                      accreditation: { type: Type.STRING }
                    },
                    required: ['university', 'major', 'passingGradeEstimate']
                  },
                  tryOuts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        toId: { type: Type.STRING },
                        title: { type: Type.STRING },
                        date: { type: Type.STRING },
                        totalScore: { type: Type.NUMBER },
                        subtests: {
                          type: Type.OBJECT,
                          properties: {
                            pu: { type: Type.NUMBER },
                            ppu: { type: Type.NUMBER },
                            kbm: { type: Type.NUMBER },
                            pk: { type: Type.NUMBER },
                            lbi: { type: Type.NUMBER },
                            lbe: { type: Type.NUMBER },
                            pm: { type: Type.NUMBER }
                          },
                          required: ['pu', 'ppu', 'kbm', 'pk', 'lbi', 'lbe', 'pm']
                        }
                      },
                      required: ['toId', 'title', 'totalScore', 'subtests']
                    }
                  },
                  evaluations: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        subtestKey: { type: Type.STRING },
                        subtestName: { type: Type.STRING },
                        category: { type: Type.STRING },
                        currentScore: { type: Type.NUMBER },
                        targetScore: { type: Type.NUMBER },
                        nationalAverage: { type: Type.NUMBER },
                        status: { type: Type.STRING },
                        accuracyRate: { type: Type.NUMBER },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ['subtestKey', 'subtestName', 'currentScore', 'status']
                    }
                  },
                  tutorNotes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        date: { type: Type.STRING },
                        tutorName: { type: Type.STRING },
                        note: { type: Type.STRING },
                        category: { type: Type.STRING }
                      },
                      required: ['date', 'tutorName', 'note']
                    }
                  }
                },
                required: ['id', 'name', 'school', 'targetScore', 'choice1', 'tryOuts']
              }
            }
          },
          required: ['summary', 'students']
        }
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsedJson
    });

  } catch (error: any) {
    console.error('Error in /api/ai/edit-upload:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Terjadi kesalahan saat memproses data dengan AI.'
    });
  }
});

// Vite Middleware for development, or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    // Support requests prefixed with /DashBoard-UTBK seamlessly in dev
    app.use((req, res, next) => {
      if (req.url.startsWith('/DashBoard-UTBK')) {
        req.url = req.url.replace(/^\/DashBoard-UTBK/, '') || '/';
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    // In production, serve both /DashBoard-UTBK and root
    app.use('/DashBoard-UTBK', express.static(path.join(__dirname, 'dist')));
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
