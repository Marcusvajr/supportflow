import { Injectable, ServiceUnavailableException } from '@nestjs/common';

export type AiProviderResult = {
  text: string;
  provider: string;
};

export abstract class AiSummaryProvider {
  abstract generate(context: string): Promise<AiProviderResult>;
}

@Injectable()
export class OpenAiCompatibleSummaryProvider extends AiSummaryProvider {
  async generate(context: string): Promise<AiProviderResult> {
    const url = process.env.AI_PROVIDER_URL ?? 'https://openrouter.ai/api/v1/chat/completions';
    const apiKey = process.env.AI_API_KEY ?? process.env.OPENROUTER_API_KEY ?? '';
    const model = process.env.AI_MODEL ?? 'openai/gpt-4o-mini';

    if (!apiKey) {
      throw new ServiceUnavailableException('Resumo por IA não está configurado neste ambiente.');
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          max_tokens: 500,
          messages: [
            {
              role: 'system',
              content: 'Você resume chamados técnicos usando somente os fatos fornecidos. Não invente causas, testes, resultados ou decisões. Responda em português do Brasil, de forma objetiva, com: contexto, testes realizados, diagnóstico registrado e pendências. Se algo não existir, diga que não foi registrado.',
            },
            { role: 'user', content: context },
          ],
        }),
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new ServiceUnavailableException('O provedor de IA está temporariamente indisponível.');
    }

    if (!response.ok) {
      throw new ServiceUnavailableException('O provedor de IA está temporariamente indisponível.');
    }

    const body = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = body.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new ServiceUnavailableException('O provedor de IA não retornou um resumo válido.');
    }

    return { text: text.slice(0, 5000), provider: model };
  }
}
