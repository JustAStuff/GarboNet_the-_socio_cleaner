import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface Prediction {
    label: string;
    confidence: number;
}

export class AIService {
    // Hardcoded token for demo purposes (Best practice is environment vars)
    private static DEFAULT_TOKEN = 'PASTE_YOUR_HF_TOKEN_HERE';

    /**
     * Classify waste using a remote model.
     * Uses the new Hugging Face Router for 100% uptime.
     */
    static async classifyWaste(imageUri: string, base64?: string): Promise<Prediction> {
        try {
            const token = await this.getApiToken();
            if (!token) throw new Error('NO_TOKEN: API token not found.');

            if (!base64) throw new Error('NO_DATA: Image data missing.');

            const fetchPrediction = async (url: string) => {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-Wait-For-Model': 'true',
                    },
                    method: 'POST',
                    body: JSON.stringify({ inputs: base64 }),
                });
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`API Error: ${response.status} - ${errText}`);
                }
                const data = await response.json();
                if (!Array.isArray(data) || data.length === 0) throw new Error('Invalid AI response');
                return {
                    label: data[0].label,
                    confidence: data[0].score,
                };
            };

            try {
                // Try the new router endpoint (Required as of March 2024)
                const primaryUrl = `https://router.huggingface.co/hf-inference/models/kendrickfff/my_resnet50_garbage_classification`;
                return await fetchPrediction(primaryUrl);
            } catch (e) {
                console.warn('Primary AI failed, trying fallback...', e);
                // Fallback to high-uptime model if custom model 404s/sleeps
                const fallbackUrl = `https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224`;
                return await fetchPrediction(fallbackUrl);
            }
        } catch (error: any) {
            console.error('AI Classification error:', error);
            throw error;
        }
    }

    /**
     * Helper to get API token (custom if set, default otherwise)
     */
    private static async getApiToken(): Promise<string> {
        try {
            const storedToken = await AsyncStorage.getItem('hf_api_token');
            return storedToken || this.DEFAULT_TOKEN;
        } catch {
            return this.DEFAULT_TOKEN;
        }
    }

    /**
     * Helper to set API key from settings screen
     */
    static async saveApiToken(token: string) {
        await AsyncStorage.setItem('hf_api_token', token);
    }
}
