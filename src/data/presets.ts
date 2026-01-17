
import { VisualEffectsState } from "@/components/dashboard/VisualEffects";
import { TimingAudioState } from "@/components/dashboard/TimingAudio";
import { ProcessingState } from "@/components/dashboard/ProcessingSettings";

export interface Preset {
    id: string;
    title: string;
    description: string;
    copy: {
        header: string;
        subHeader: string;
        items: { icon: string; text: string; highlight?: string }[];
    };
    values: {
        visual: VisualEffectsState;
        timing: TimingAudioState;
        processing: Partial<ProcessingState>;
    };
}

export const PRESETS: Preset[] = [
    {
        id: "viral-scale",
        title: "Escala Viral (Padrão)",
        description: "Estratégia validada para crescimento rápido no Instagram/TikTok.",
        copy: {
            header: "🔥 Estratégia de Escala Viral",
            subHeader: "Configuração Automática para Máxima Performance no Instagram.",
            items: [
                { icon: "✓", text: "21 Variações (Postar 3x por dia durante uma semana)", highlight: "21 Variações" },
                { icon: "✓", text: "Postar como \"Reels de Teste\" (Trial Reels)", highlight: "\"Reels de Teste\"" },
                { icon: "✓", text: "Metadados Únicos (Engana o algoritmo para evitar shadowban)", highlight: "Metadados Únicos" },
                { icon: "✓", text: "Use sempre o vídeo original com alta qualidade", highlight: "alta qualidade" },
            ]
        },
        values: {
            visual: {
                brightness: [-6, 5],
                contrast: [-7, 6],
                saturation: [0, 10],
                hue: [-5, 5],
            },
            timing: {
                zoom: [1, 8],
                cutStart: [0, 0.3],
                cutEnd: [0, 0.3],
                volume: [-2, 2],
            },
            processing: {
                variations: 21,
            }
        }
    },
    {
        id: "creative-test",
        title: "Teste Criativo (A/B)",
        description: "Pequenas variações para validar qual gancho segura mais.",
        copy: {
            header: "🧪 Teste Criativo A/B",
            subHeader: "Descubra qual versão do seu vídeo retém mais o público.",
            items: [
                { icon: "⚡", text: "10 Variações Controladas", highlight: "10 Variações" },
                { icon: "⚡", text: "Foco em pequenas mudanças de Zoom e Corte", highlight: "Zoom e Corte" },
                { icon: "⚡", text: "Ideal para testar o mesmo conteúdo em horários diferentes", highlight: "horários diferentes" },
                { icon: "⚡", text: "Compare as métricas de retenção de cada um", highlight: "métricas de retenção" },
            ]
        },
        values: {
            visual: {
                brightness: [-3, 3],
                contrast: [-3, 3],
                saturation: [-5, 5],
                hue: [-2, 2], // Subtler
            },
            timing: {
                zoom: [1, 5], // Less aggressive zoom
                cutStart: [0, 0.5], // Slightly more variation in start
                cutEnd: [0, 0.5],
                volume: [-1, 1],
            },
            processing: {
                variations: 10,
            }
        }
    },
    {
        id: "niche-domination",
        title: "Dominação de Nicho",
        description: "Volume massivo para múltiplas contas (Dark/Affiliate).",
        copy: {
            header: "🚀 Dominação de Nicho (Massivo)",
            subHeader: "Produção em massa para rodar em múltiplas contas ou Dark Channels.",
            items: [
                { icon: "💎", text: "50 Variações Únicas", highlight: "50 Variações" },
                { icon: "💎", text: "Alterações visuais mais agressivas para evitar detecção", highlight: "evitar detecção" },
                { icon: "💎", text: "Distribua em pelo menos 5 contas diferentes", highlight: "5 contas diferentes" },
                { icon: "💎", text: "Use Proxies ou 4G se for postar tudo do mesmo celular", highlight: "Proxies ou 4G" },
            ]
        },
        values: {
            visual: {
                brightness: [-10, 10], // More aggressive
                contrast: [-10, 10],
                saturation: [-10, 20],
                hue: [-8, 8],
            },
            timing: {
                zoom: [1, 15], // Aggressive zoom
                cutStart: [0, 1.0], // Big cuts
                cutEnd: [0, 1.0],
                volume: [-3, 3],
            },
            processing: {
                variations: 50,
            }
        }
    }
];
