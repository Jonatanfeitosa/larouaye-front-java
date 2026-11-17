import type { Integrante } from '../types/integrante.ts'

// Dados de identificação da equipe (não é conteúdo jurídico). Preencham os RMs!
export const INTEGRANTES: Integrante[] = [
  {
    id: 'davi-felix',
    nome: 'Davi Felix',
    rm: '569393',
    papel: 'Inteligência Artificial e Chatbot',
    descricao: 'Treina e disponibiliza os dois modelos de Machine Learning e a API Flask que classifica as dúvidas.',
    tecnologias: ['Python', 'Flask', 'scikit-learn'],
  },
  {
    id: 'fernando-oliveira',
    nome: 'Fernando Oliveira',
    rm: '570196',
    papel: 'Front-End React',
    descricao: 'Constrói a interface acessível do LarOuAyê e a integração com a API Java.',
    tecnologias: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    id: 'jonatan-feitosa',
    nome: 'Jonatan Feitosa',
    rm: '570452',
    papel: 'Java, regras jurídicas e integração',
    descricao: 'Desenvolve a API central, o motor jurídico e a comunicação entre front, Flask e banco.',
    tecnologias: ['Java', 'Spring Boot', 'JDBC'],
  },
  {
    id: 'marcelo-da-mata',
    nome: 'Marcelo da Mata',
    rm: '569584',
    papel: 'Computational Thinking Using Python',
    descricao: 'Cria o orientador de aquisição por terminal e valida e testa o front.',
    tecnologias: ['Python', 'JSON', 'Testes'],
  },
  {
    id: 'vinicius-liberato',
    nome: 'Vinícius Liberato',
    rm: '571480',
    papel: 'Oracle e modelagem de dados',
    descricao: 'Modela e implementa o banco relacional que guarda consultas, orientações e progresso.',
    tecnologias: ['Oracle SQL', 'Data Modeler'],
  },
]
