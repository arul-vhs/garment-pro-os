// AI service abstraction. Frontend stub now; swap `provider` later to wire
// to Lovable AI Gateway, OpenAI, etc. without touching call sites.

export type AIRequest = {
  task: "measurement-suggest" | "delivery-predict" | "design-recommend" | "summary";
  input: Record<string, unknown>;
};
export type AIResponse = { suggestion: string; confidence: number; meta?: Record<string, unknown> };

export interface AIProvider {
  name: string;
  enabled: boolean;
  invoke: (req: AIRequest) => Promise<AIResponse>;
}

const StubProvider: AIProvider = {
  name: "stub",
  enabled: true,
  invoke: async (req) => {
    await new Promise((r) => setTimeout(r, 250));
    switch (req.task) {
      case "measurement-suggest":
        return { suggestion: "Suggested chest +0.5\" based on previous 3 fittings.", confidence: 0.82 };
      case "delivery-predict":
        return { suggestion: "Estimated 7–9 days based on current workload.", confidence: 0.74 };
      case "design-recommend":
        return { suggestion: "Try Italian notch-lapel slim fit — matches customer's last 2 orders.", confidence: 0.69 };
      case "summary":
        return { suggestion: "Revenue trending +18% MoM; top category: Suits.", confidence: 0.88 };
    }
  },
};

let provider: AIProvider = StubProvider;
export function registerAIProvider(p: AIProvider) { provider = p; }
export function getAIProvider() { return provider; }
export async function ask(req: AIRequest) { return provider.invoke(req); }
