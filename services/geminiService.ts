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
            "Missing Gemini API key. Set VITE_GEMINI_API_KEY, GEMINI_API_KEY, or API_KEY as an environment variable."
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

export async function generatePalette(theme: string): Promise<Palette> {
    try {
        const ai = getAiClient();
        const prompt = `Generate a color palette of 5 hex codes and a descriptive name for each color, for the theme: "${theme}".`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: paletteSchema,
            },
        });

        // Prefer text if available; otherwise, scan parts for a JSON string
        const text = response.text;
        const jsonText = typeof text === 'string' && text.trim()
            ? text.trim()
            : (() => {
                const parts = (response as any)?.candidates?.[0]?.content?.parts ?? [];
                const firstText = parts.find((p: any) => typeof p?.text === 'string')?.text;
                return typeof firstText === 'string' ? firstText.trim() : '';
            })();

        if (!jsonText) {
            throw new Error("Empty response from model.");
        }

        const data = JSON.parse(jsonText);

        if (data.palette && Array.isArray(data.palette) && data.palette.length > 0) {
            return data.palette.slice(0, 5); // Ensure exactly 5 colors
        } else {
            throw new Error("Invalid response format from API.");
        }
    } catch (error) {
        console.error("Error generating palette:", error);
        throw new Error("Failed to generate palette. Please check your API key and try again.");
    }
}

export async function namePaletteFromHex(hexCodes: string[]): Promise<Palette> {
    try {
        const ai = getAiClient();
        const prompt = `Given the following hex color codes [${hexCodes.join(', ')}], provide a creative and descriptive name for each color. Return the original hex code and the new name.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: paletteSchema,
            },
        });

        const text = response.text;
        const jsonText = typeof text === 'string' && text.trim()
            ? text.trim()
            : (() => {
                const parts = (response as any)?.candidates?.[0]?.content?.parts ?? [];
                const firstText = parts.find((p: any) => typeof p?.text === 'string')?.text;
                return typeof firstText === 'string' ? firstText.trim() : '';
            })();

        const data = JSON.parse(jsonText);

        if (data.palette && Array.isArray(data.palette) && data.palette.length > 0) {
            return data.palette.slice(0, 5);
        } else {
            throw new Error("Invalid response format from API for naming colors.");
        }
    } catch (error) {
        console.error("Error naming palette:", error);
        // Fallback to generic names if API fails
        return hexCodes.map((hex, i) => ({ hex, name: `Color ${i + 1}` }));
    }
}

export async function generatePaletteFromImage(base64Data: string, mimeType: string): Promise<Palette> {
    try {
        const ai = getAiClient();
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType,
            },
        };
        const textPart = { text: 'Generate a color palette of 5 hex codes and a descriptive name for each color, based on this image.' };

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: 'user', parts: [imagePart, textPart] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: paletteSchema,
            },
        });

        const text = response.text;
        const jsonText = typeof text === 'string' && text.trim()
            ? text.trim()
            : (() => {
                const parts = (response as any)?.candidates?.[0]?.content?.parts ?? [];
                const firstText = parts.find((p: any) => typeof p?.text === 'string')?.text;
                return typeof firstText === 'string' ? firstText.trim() : '';
            })();

        if (!jsonText) {
            throw new Error("Empty response from model.");
        }

        const data = JSON.parse(jsonText);

        if (data.palette && Array.isArray(data.palette) && data.palette.length > 0) {
            return data.palette.slice(0, 5); // Ensure exactly 5 colors
        } else {
            throw new Error("Invalid response format from API.");
        }
    } catch (error) {
        console.error("Error generating palette from image:", error);
        throw new Error("Failed to generate palette from image. Please check your API key and try again.");
    }
}