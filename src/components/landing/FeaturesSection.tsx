import { motion } from "framer-motion";
import {
  Palette,
  Volume2,
  Cpu,
  Shield,
  Download,
  Layers,
  TrendingUp,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Efeitos Visuais IA",
    description: "Ajuste brilho, contraste e filtros com IA para criar variações visuais únicas que performam no TikTok e Reels."
  },
  {
    icon: Volume2,
    title: "Áudio e Timing Inteligente",
    description: "Modulação de áudio e cortes precisos para manter a retenção e evitar copyright em plataformas de vídeo."
  },
  {
    icon: Cpu,
    title: "Renderização GPU Ultra-Rápida",
    description: "Use o poder da nuvem para renderizar centenas de criativos de dropshipping em minutos, não horas."
  },
  {
    icon: Shield,
    title: "Anti-Detecção Avançada",
    description: "Tecnologia exclusiva de hash e metadata spoofing para blindar suas contas contra shadowban por conteúdo duplicado."
  },
  {
    icon: Download,
    title: "Download em Massa",
    description: "Baixe seu conteúdo viral organizado pronto para postar em múltiplas contas e perfis dark."
  },
  {
    icon: Layers,
    title: "Compatibilidade Universal",
    description: "Importe e exporte em formatos otimizados para Instagram, YouTube Shorts, TikTok e Facebook Ads."
  },
  {
    icon: TrendingUp,
    title: "Escalabilidade Infinita",
    description: "A ferramenta secreta dos top players para gerenciar operações de PLR e Dropshipping em escala."
  },
  {
    icon: Clock,
    title: "Automação de Criativos",
    description: "Transforme um único vídeo vencedor em uma campanha inteira de testes A/B automaticamente."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que Você Precisa para{" "}
            <span className="gradient-text">Escalar seu Conteúdo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recursos poderosos projetados para ajudar criadores a maximizar seu alcance em todas as plataformas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="glass rounded-xl p-6 hover:border-primary/50 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:glow-primary transition-all">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
