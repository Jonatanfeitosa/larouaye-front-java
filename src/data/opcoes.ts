// Opções de formulário (rótulos de tela). Os CÓDIGOS das etapas precisam bater com o Java: ver CONTRATO-API.md.
export const ETAPAS_COMPRA = [
  { valor: 'PESQUISA_IMOVEL', rotulo: '1. Pesquisa e escolha do imóvel' },
  { valor: 'ANALISE_DOCUMENTAL', rotulo: '2. Análise documental' },
  { valor: 'NEGOCIACAO_CONTRATO', rotulo: '3. Negociação e contrato' },
  { valor: 'ESCRITURA', rotulo: '4. Escritura ou instrumento aplicável' },
  { valor: 'ITBI_TRIBUTOS', rotulo: '5. ITBI e tributos' },
  { valor: 'REGISTRO_IMOVEL', rotulo: '6. Registro imobiliário' },
] as const

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ',
  'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

export const OPCOES_UF = UFS.map((uf) => ({ valor: uf, rotulo: uf }))
