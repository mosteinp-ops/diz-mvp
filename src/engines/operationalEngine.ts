export interface OperationalInsight {
  headline: string
  risk: 'low' | 'medium' | 'high'
  direction: string
}

export function generateOperationalInsight(text: string): OperationalInsight {
  const normalized = text.toLowerCase()

  if (normalized.includes('custo') && normalized.includes('subiu')) {
    return {
      headline: 'Seu custo subiu mais rápido que a entrada.',
      risk: 'high',
      direction: 'Revisar margem por produto nas últimas duas semanas.',
    }
  }

  if (normalized.includes('caixa') && normalized.includes('apertado')) {
    return {
      headline: 'Seu caixa apertou hoje.',
      risk: 'high',
      direction: 'Priorizar saída essencial e renegociar vencimentos curtos.',
    }
  }

  return {
    headline: 'A operação pede foco em margem antes de crescer volume.',
    risk: 'medium',
    direction: 'Concentrar decisão no ponto de maior drenagem financeira.',
  }
}
