import { GoogleGenAI, Type } from "@google/genai";
import { Palette } from '../types';

function getEnvApiKey(): string | undefined {
    // Support multiple env var sources across dev/prod setups
    // Vite: import.meta.env.VITE_GEMINI_API_KEY
    // Define replacements: process.env.GEMINI_API_KEY or process.env.API_KEY (via vite.config.ts)
    // Guard against the literal string "undefined" being injected by define()
    const candidates = [
        // @ts-ignore - import.meta.env is provided by Vite at runtime
        typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY,
        (process as any)?.env?.GEMINI_API_KEY,
        (process as any)?.env?.API_KEY,
    ];

    for (const value of candidates) {
        if (typeof value === 'string' && value.trim() && value !== 'undefined') {
            return value.trim();
        }
    }
    return undefined;
}

function getAiClient() {
    const apiKey = getEnvApiKey();
    if (!apiKey) {
        throw new Error(
            "Missing Gemini API key. Set API_KEY, VITE_GEMINI_API_KEY, or GEMINI_API_KEY."
        );
    }
    return new GoogleGenAI({ apiKey });
}

const paletteSchema = {
    type: Type.OBJECT,
    properties: {
        palette: {
            type: Type.ARRAY,
            description: "An array of 5 objects, each with a hex color code and a descriptive name.",
            items: {
                type: Type.OBJECT,
                properties: {
                    hex: {
                        type: Type.STRING,
                        description: "A hex color code string (e.g., '#RRGGBB')."
                    },
                    name: {
                        type: Type.STRING,
                        description: "A creative, descriptive name for the color."
                    }
                },
                required: ["hex", "name"]
            }
        }
    },
    required: ["palette"]
};

// Robustly extract plain text from different SDK result shapes
function extractResponseText(result: any): string {
    try {
        if (result && result.response && typeof result.response.text === 'function') {
            return result.response.text();
        }
        if (result && typeof result.text === 'function') {
            return result.text();
        }
        const parts = result?.candidates?.[0]?.content?.parts ?? [];
        const firstText = parts.find((p: any) => typeof p?.text === 'string')?.text;
        return typeof firstText === 'string' ? firstText : '';
    } catch {
        return '';
    }
}

// Attempt to parse JSON even if surrounded by extra text
function tryParseJsonLoose(input: string): any {
    if (!input) return null;
    // If input already looks like JSON, try directly
    try { return JSON.parse(input); } catch {}
    // Extract the first {...} or [..] block
    const startObj = input.indexOf('{');
    const startArr = input.indexOf('[');
    let start = -1;
    if (startObj !== -1 && startArr !== -1) start = Math.min(startObj, startArr);
    else start = Math.max(startObj, startArr);
    if (start === -1) return null;
    const endObj = input.lastIndexOf('}');
    const endArr = input.lastIndexOf(']');
    const end = Math.max(endObj, endArr);
    if (end <= start) return null;
    const slice = input.slice(start, end + 1);
    try { return JSON.parse(slice); } catch { return null; }
}

// Local fallback palette generator (deterministic from theme string)
function generateLocalPalette(theme: string): Palette {
    function hashStringToInt(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }
    function hslToHex(h: number, s: number, l: number): string {
        s /= 100; l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, '0');
        return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
    }

    const base = hashStringToInt(theme || 'palette');
    const baseHue = base % 360;
    const variants = [ -20, 0, 20, 160, 200 ].map((d) => (baseHue + d + 360) % 360);
    const sats = [70, 65, 60, 55, 75];
    const lights = [45, 55, 65, 35, 50];
    const names = [
        'Primary', 'Secondary', 'Accent', 'Muted', 'Highlight'
    ];
    return variants.map((h, idx) => ({
        hex: hslToHex(h, sats[idx], lights[idx]),
        name: `${names[idx]} ${theme ? `(${theme})` : ''}`.trim()
    }));
}

export async function generatePalette(theme: string): Promise<Palette> {
    try {
        const ai = getAiClient();
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Generate a color palette of 5 hex codes and a descriptive name for each color, for the theme: "${theme}". Return strictly JSON with shape {"palette":[{"hex":"#RRGGBB","name":"..."},...]}.`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: paletteSchema,
            },
        } as any);

        const textOut = extractResponseText(result)?.trim();
        if (!textOut) {
            throw new Error("Empty response from model.");
        }

        const data = tryParseJsonLoose(textOut);
        if (data?.palette && Array.isArray(data.palette) && data.palette.length > 0) {
            return data.palette.slice(0, 5);
        }
        throw new Error("Invalid response format from API.");
    } catch (error) {
        console.warn("Falling back to local palette due to AI error:", error);
        // Fallback to a deterministic local palette
        return generateLocalPalette(theme);
    }
}

export async function namePaletteFromHex(hexCodes: string[]): Promise<Palette> {
    try {
        const ai = getAiClient();
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Given the following hex color codes [${hexCodes.join(', ')}], provide a creative and descriptive name for each color. Return strictly JSON: {"palette":[{"hex":"#RRGGBB","name":"..."},...]}.`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: paletteSchema,
            },
        } as any);

        const textOut = extractResponseText(result)?.trim();
        const data = tryParseJsonLoose(textOut);
        if (data?.palette && Array.isArray(data.palette) && data.palette.length > 0) {
            return data.palette.slice(0, 5);
        }
        throw new Error("Invalid response format from API for naming colors.");
    } catch (error) {
        console.error("Error naming palette:", error);
        // Fallback to generic names if API fails
        return hexCodes.map((hex, i) => ({ hex, name: `Color ${i + 1}` }));
    }
}

export async function generatePaletteFromImage(base64Data: string, mimeType: string): Promise<Palette> {
    try {
        const ai = getAiClient();
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType,
            },
        };
        const textPart = { text: 'Generate a color palette of 5 hex codes and a descriptive name for each color, based on this image. Return strictly JSON with shape {"palette":[{"hex":"#RRGGBB","name":"..."},...]}."' };

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [imagePart, textPart] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: paletteSchema,
            },
        } as any);

        const textOut = extractResponseText(result)?.trim();
        if (!textOut) {
            throw new Error("Empty response from model.");
        }
        const data = tryParseJsonLoose(textOut);
        if (data?.palette && Array.isArray(data.palette) && data.palette.length > 0) {
            return data.palette.slice(0, 5);
        }
        throw new Error("Invalid response format from API.");
    } catch (error) {
        console.warn("Falling back to local palette (image) due to AI error:", error);
        // With no API, fallback: just produce a palette seeded by mimeType+first chars of base64
        const seed = `${mimeType}:${base64Data.slice(0, 32)}`;
        return generateLocalPalette(seed);
    }
}