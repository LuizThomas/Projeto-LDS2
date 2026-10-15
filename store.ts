import { Usuario, Evento, Atividade, Inscricao, Frequencia, Certificado, SolicitacaoInscricaoModeracao, SolicitacaoCertificadoModeracao } from '../types';

const STORAGE_KEY = 'ifce_iventus_data_v2';

interface StoreData {
  currentUser: Usuario;
  usuarios: Usuario[];
  eventos: Evento[];
  atividades: Atividade[];
  inscricoes: Inscricao[];
  frequencias: Frequencia[];
  certificados: Certificado[];
  favoritos: number[]; // ids de eventos favoritos
  solicitacoesInscricao: SolicitacaoInscricaoModeracao[];
  solicitacoesCertificado: SolicitacaoCertificadoModeracao[];
}

const INITIAL_USUARIOS: Usuario[] = [
  {
    id_usuario: 1,
    nome: 'Luiz Thomas Marte Moreira',
    email: 'luiz.thomas@gmail.com',
    senha_hash: '$2b$10$w8.1fceIventusSimulatedHashPart',
    matricula: '123456789101112',
    perfil: 'PARTICIPANTE',
    foto_perfil: null,
    telefone: '(88) 99999-9999',
    materias: null,
    created_at: '2024-01-10T10:00:00Z',
  },
  {
    id_usuario: 2,
    nome: 'Lucas Nogueira',
    email: 'lucas.nogueira@ifce.edu.br',
    senha_hash: '$2b$10$w8.1fceIventusSimulatedHashAdm',
    matricula: 'ADM-2024-991',
    perfil: 'ADMINISTRADOR',
    foto_perfil: null,
    telefone: '(88) 98888-0001',
    materias: 'Gestão de Tecnologia e Redes',
    created_at: '2023-12-01T08:00:00Z',
  },
  {
    id_usuario: 3,
    nome: 'Saulo Bezerra',
    email: 'saulo_bezerra@gmail.com',
    senha_hash: '$2b$10$w8.1fceIventusSimulatedHashProf',
    matricula: 'DOC-8831',
    perfil: 'PROFESSOR',
    foto_perfil: null,
    telefone: '(88) 96798-1099',
    materias: 'LDS ARQM',
    created_at: '2023-11-15T09:00:00Z',
  },
  {
    id_usuario: 4,
    nome: 'José Olinda',
    email: 'jose.olinda@ifce.edu.br',
    senha_hash: '$2b$10$w8.1fceIventusSimulatedHashProf2',
    matricula: 'DOC-7720',
    perfil: 'PROFESSOR',
    foto_perfil: null,
    telefone: '(88) 97777-2233',
    materias: 'Algoritmos e Estruturas de Dados',
    created_at: '2023-10-10T11:00:00Z',
  },
  {
    id_usuario: 5,
    nome: 'Lyrane Brito Bezerra',
    email: 'lyrane@ifce.edu.br',
    senha_hash: '$2b$10$w8.1fceIventusSimulatedHashProf3',
    matricula: 'DOC-5501',
    perfil: 'PROFESSOR',
    foto_perfil: null,
    telefone: '(88) 99655-4433',
    materias: 'Inteligência Artificial',
    created_at: '2024-02-01T14:00:00Z',
  },
  {
    id_usuario: 6,
    nome: 'Diego Teixeira Silva',
    email: 'diego.silva@ifce.edu.br',
    senha_hash: '$2b$10$w8.1fceIventusSimulatedHashAdm2',
    matricula: 'ADM-2024-884',
    perfil: 'ADMINISTRADOR',
    foto_perfil: null,
    telefone: '(88) 98111-2244',
    materias: null,
    created_at: '2024-01-05T08:30:00Z',
  },
  {
    id_usuario: 7,
    nome: 'Carlos Eduardo Bezerra Duarte',
    email: 'carlos.eduardo@gmail.com',
    senha_hash: '$2b$10$w8.1fceIventusSimulatedHashPart2',
    matricula: '20231044001',
    perfil: 'PARTICIPANTE',
    foto_perfil: null,
    telefone: '(88) 99444-1122',
    materias: null,
    created_at: '2024-03-01T10:00:00Z',
  },
  {
    id_usuario: 8,
    nome: 'Luiz Guilherme Sales Ferreira',
    email: 'luiz.guilherme@gmail.com',
    senha_hash: '$2b$10$w8.1fceIventusSimulatedHashPart3',
    matricula: '20231044002',
    perfil: 'PARTICIPANTE',
    foto_perfil: null,
    telefone: '(88) 99333-7788',
    materias: null,
    created_at: '2024-03-02T11:00:00Z',
  },
  // Alunos da turma Informática S1 (Mockup Organizador)
  {
    id_usuario: 9,
    nome: 'Ana Beatriz Souza',
    email: 'ana.beatriz@aluno.ifce.edu.br',
    senha_hash: '$2b$10$hash',
    matricula: '20241INFO01',
    perfil: 'PARTICIPANTE',
    foto_perfil: null,
    created_at: '2024-02-15T10:00:00Z',
  },
  {
    id_usuario: 10,
    nome: 'Ana Lívia Pinheiro Vieira',
    email: 'ana.livia@aluno.ifce.edu.br',
    senha_hash: '$2b$10$hash',
    matricula: '20241INFO02',
    perfil: 'PARTICIPANTE',
    foto_perfil: null,
    created_at: '2024-02-15T10:05:00Z',
  },
  {
    id_usuario: 11,
    nome: 'Camilo Marquez',
    email: 'camilo.marquez@aluno.ifce.edu.br',
    senha_hash: '$2b$10$hash',
    matricula: '20241INFO03',
    perfil: 'PARTICIPANTE',
    foto_perfil: null,
    created_at: '2024-02-15T10:10:00Z',
  },
  {
    id_usuario: 12,
    nome: 'Danilo Torres Matos',
    email: 'danilo.matos@aluno.ifce.edu.br',
    senha_hash: '$2b$10$hash',
    matricula: '20241INFO04',
    perfil: 'PARTICIPANTE',
    foto_perfil: null,
    created_at: '2024-02-15T10:15:00Z',
  },
  {
    id_usuario: 13,
    nome: 'Gabriel da Silva',
    email: 'gabriel.silva@aluno.ifce.edu.br',
    senha_hash: '$2b$10$hash',
    matricula: '20241INFO05',
    perfil: 'PARTICIPANTE',
    foto_perfil: null,
    created_at: '2024-02-15T10:20:00Z',
  },
  {
    id_usuario: 14,
    nome: 'Gabriela Oliveira Ferreira',
    email: 'gabriela.ferreira@aluno.ifce.edu.br',
    senha_hash: '$2b$10$hash',
    matricula: '20241INFO06',
    perfil: 'PARTICIPANTE',
    foto_perfil: null,
    created_at: '2024-02-15T10:25:00Z',
  },
  {
    id_usuario: 15,
    nome: 'João Felipe Gonçalves Diniz',
    email: 'joao.felipe@aluno.ifce.edu.br',
    senha_hash: '$2b$10$hash',
    matricula: '20241INFO07',
    perfil: 'PARTICIPANTE',
    status_conta: 'ATIVO',
    foto_perfil: null,
    created_at: '2024-02-15T10:30:00Z',
  },
  // Usuários com cadastro aguardando aprovação pelo Administrador
  {
    id_usuario: 16,
    nome: 'Mariana Ribeiro Feitosa',
    email: 'mariana.feitosa@gmail.com',
    senha_hash: '$2b$10$hash',
    matricula: '20241INFO08',
    perfil: 'PARTICIPANTE',
    status_conta: 'PENDENTE',
    foto_perfil: null,
    telefone: '(88) 99888-1122',
    created_at: '2026-10-14T09:15:00Z',
  },
  {
    id_usuario: 17,
    nome: 'Prof. Rodrigo Cavalcante Maia',
    email: 'rodrigo.maia@ifce.edu.br',
    senha_hash: '$2b$10$hash',
    matricula: 'DOC-9912',
    perfil: 'PROFESSOR',
    status_conta: 'PENDENTE',
    foto_perfil: null,
    telefone: '(88) 99777-3344',
    materias: 'Sistemas Embarcados e IoT',
    created_at: '2026-10-14T10:30:00Z',
  },
];

const INITIAL_EVENTOS: Evento[] = [
  {
    id_evento: 1,
    id_organizador: 3,
    organizador_nome: 'Saulo Bezerra',
    titulo: 'Semana da Computação 2024',
    descricao: 'A Semana da Computação é o maior evento acadêmico integrado de ciência da computação e tecnologia do IFCE Campus Cedro. Inclui minicursos práticos, maratonas de programação, palestras sobre o mercado de tecnologia e mostras de projetos de iniciação científica e extensão.',
    banner_url: null,
    data_inicio: '2024-05-16 08:00:00',
    data_fim: '2024-05-18 18:00:00',
    inicio_inscricoes: '2024-04-01 00:00:00',
    fim_inscricoes: '2024-05-15 23:59:59',
    status: 'PUBLICADO',
    local: 'Campus Cedro - IFCE',
    modalidade: 'Presencial',
    horario_formatado: '08:00h - 18:00h',
    data_formatada: '16 a 18 de Maio de 2024',
    created_at: '2024-03-01T10:00:00Z',
    inscritos_count: 108,
  },
  {
    id_evento: 2,
    id_organizador: 5,
    organizador_nome: 'Lyrane Brito Bezerra',
    titulo: 'Workshop de IA',
    descricao: 'Workshop imersivo abordando Modelos de Linguagem de Grande Escala (LLMs), Visão Computacional e agentes inteligentes aplicados à resolução de problemas regionais e automação sustentável no estado do Ceará.',
    banner_url: null,
    data_inicio: '2024-05-20 14:00:00',
    data_fim: '2024-05-20 18:00:00',
    inicio_inscricoes: '2024-04-10 00:00:00',
    fim_inscricoes: '2024-05-19 23:59:59',
    status: 'CANCELADO',
    local: 'Online',
    modalidade: 'Online',
    horario_formatado: '14:00h - 18:00h',
    data_formatada: '20 de Maio de 2024',
    created_at: '2024-03-10T11:00:00Z',
    inscritos_count: 0,
  },
  {
    id_evento: 3,
    id_organizador: 3,
    organizador_nome: 'Saulo Bezerra',
    titulo: 'Mostra Científica IFCE',
    descricao: 'Apresentação de artigos, banners científicos e protótipos de engenharia e computação desenvolvidos pelos grupos de pesquisa do IFCE. Espaço propício para networking com pesquisadores, empresas juniores e fomento à inovação.',
    banner_url: null,
    data_inicio: '2024-06-05 13:00:00',
    data_fim: '2024-06-05 17:00:00',
    inicio_inscricoes: '2024-05-01 00:00:00',
    fim_inscricoes: '2024-06-04 23:59:59',
    status: 'PUBLICADO',
    local: 'Campus Cedro - IFCE',
    modalidade: 'Presencial',
    horario_formatado: '13:00h - 15:00h',
    data_formatada: '05 de Junho de 2024',
    created_at: '2024-03-15T09:00:00Z',
    inscritos_count: 85,
  },
  {
    id_evento: 4,
    id_organizador: 2,
    organizador_nome: 'Lucas Nogueira',
    titulo: 'Palestra Inovação e Tecnologia',
    descricao: 'Discussão sobre as novas fronteiras da computação em nuvem, metodologias ágeis em equipes multidisciplinares e práticas de Clean Architecture em projetos de alta escala.',
    banner_url: null,
    data_inicio: '2024-06-10 09:00:00',
    data_fim: '2024-06-10 11:30:00',
    inicio_inscricoes: '2024-05-15 00:00:00',
    fim_inscricoes: '2024-06-09 23:59:59',
    status: 'RASCUNHO',
    local: 'Campus Cedro - IFCE',
    modalidade: 'Presencial',
    horario_formatado: '09:00h - 11:30h',
    data_formatada: '10 de Junho de 2024',
    created_at: '2024-04-01T08:00:00Z',
    inscritos_count: 0,
  },
  {
    id_evento: 5,
    id_organizador: 4,
    organizador_nome: 'José Olinda',
    titulo: 'Minicurso de Python',
    descricao: 'Minicurso prático com foco em análise exploratória de dados, manipulação com Pandas e visualização gráfica com Seaborn e Matplotlib para iniciação científica.',
    banner_url: null,
    data_inicio: '2024-06-12 14:00:00',
    data_fim: '2024-06-12 18:00:00',
    inicio_inscricoes: '2024-05-20 00:00:00',
    fim_inscricoes: '2024-06-11 23:59:59',
    status: 'PUBLICADO',
    local: 'Online',
    modalidade: 'Online',
    horario_formatado: '14:00h - 18:00h',
    data_formatada: '12 de Junho de 2024',
    created_at: '2024-04-05T12:00:00Z',
    inscritos_count: 45,
  },
  {
    id_evento: 6,
    id_organizador: 3,
    organizador_nome: 'Saulo Bezerra',
    titulo: 'Simpósio de Pesquisa',
    descricao: 'Encontro com avaliadores externos, bancas de qualificação e palestras magnas sobre fomento à pesquisa pelo CNPq e FUNCAP no interior cearense.',
    banner_url: null,
    data_inicio: '2024-06-15 08:30:00',
    data_fim: '2024-06-15 17:30:00',
    inicio_inscricoes: '2024-05-25 00:00:00',
    fim_inscricoes: '2024-06-14 23:59:59',
    status: 'PUBLICADO',
    local: 'Campus Cedro - IFCE',
    modalidade: 'Presencial',
    horario_formatado: '08:30h - 17:30h',
    data_formatada: '15 de Junho de 2024',
    created_at: '2024-04-10T15:00:00Z',
    inscritos_count: 60,
  },
  {
    id_evento: 7,
    id_organizador: 2,
    organizador_nome: 'Lucas Nogueira',
    titulo: 'E.A.G.L.E. 2026',
    descricao: 'Encontro Acadêmico de Grandes Lideranças Estudantis e Extensão Tecnológica. Programação integrando todos os campi do IFCE.',
    banner_url: null,
    data_inicio: '2026-09-30 08:00:00',
    data_fim: '2026-10-02 18:00:00',
    inicio_inscricoes: '2026-08-01 00:00:00',
    fim_inscricoes: '2026-09-29 23:59:59',
    status: 'PUBLICADO',
    local: 'Auditório Principal - IFCE',
    modalidade: 'Presencial',
    horario_formatado: '08:00h - 18:00h',
    data_formatada: '30 de Setembro a 02 de Outubro de 2026',
    created_at: '2026-08-01T10:00:00Z',
    inscritos_count: 140,
  },
  {
    id_evento: 8,
    id_organizador: 4,
    organizador_nome: 'José Olinda',
    titulo: 'Semana da Computação 2023',
    descricao: 'Edição histórica com oficinas de Arduino, maratona de programação competitiva e painel sobre mulheres na tecnologia.',
    banner_url: null,
    data_inicio: '2023-05-12 08:00:00',
    data_fim: '2023-05-14 18:00:00',
    inicio_inscricoes: '2023-04-01 00:00:00',
    fim_inscricoes: '2023-05-11 23:59:59',
    status: 'ENCERRADO',
    local: 'Campus Cedro - IFCE',
    modalidade: 'Presencial',
    horario_formatado: '08:00h - 18:00h',
    data_formatada: '12 de Maio de 2023',
    created_at: '2023-04-01T10:00:00Z',
    inscritos_count: 120,
  },
];

const INITIAL_ATIVIDADES: Atividade[] = [
  {
    id_atividade: 1,
    id_evento: 1,
    titulo: 'Palestra Magna: Engenharia de Software Moderna e Cloud',
    descricao: 'Palestra inaugural sobre arquiteturas resilientes e observabilidade.',
    tipo: 'Palestra',
    data_hora_inicio: '2024-05-16 09:00:00',
    data_hora_fim: '2024-05-16 11:30:00',
    local: 'Auditório Central',
    limite_vagas: 120,
    vagas_ocupadas: 108,
    carga_horaria: 20,
    created_at: '2024-03-05T10:00:00Z',
  },
  {
    id_atividade: 2,
    id_evento: 2,
    titulo: 'Workshop Prático: Agentes Inteligentes com LLMs',
    descricao: 'Construção de aplicações com modelos generativos.',
    tipo: 'Workshop',
    data_hora_inicio: '2024-05-20 14:00:00',
    data_hora_fim: '2024-05-20 18:00:00',
    local: 'Sala Virtual Google Meet',
    limite_vagas: 50,
    vagas_ocupadas: 0,
    carga_horaria: 8,
    created_at: '2024-03-12T10:00:00Z',
  },
  {
    id_atividade: 3,
    id_evento: 3,
    titulo: 'Mostra Científica: Apresentação de Pôsteres e Protótipos',
    descricao: 'Avaliação presencial de trabalhos de pesquisa.',
    tipo: 'Apresentação de Artigos',
    data_hora_inicio: '2024-06-05 13:00:00',
    data_hora_fim: '2024-06-05 17:00:00',
    local: 'Pátio Acadêmico IFCE',
    limite_vagas: 100,
    vagas_ocupadas: 85,
    carga_horaria: 15,
    created_at: '2024-03-16T10:00:00Z',
  },
  {
    id_atividade: 4,
    id_evento: 5,
    titulo: 'Minicurso: Python para Ciência de Dados',
    descricao: 'Hands-on com NumPy, Pandas e visualização de dados.',
    tipo: 'Minicurso',
    data_hora_inicio: '2024-06-12 14:00:00',
    data_hora_fim: '2024-06-12 18:00:00',
    local: 'Laboratório Virtual',
    limite_vagas: 45,
    vagas_ocupadas: 45,
    carga_horaria: 12,
    created_at: '2024-04-06T10:00:00Z',
  },
];

const INITIAL_INSCRICOES: Inscricao[] = [
  // Luiz Thomas (Participante ativo) inscrito em Semana da Computação 2024 e Mostra Científica IFCE
  {
    id_inscricao: 1,
    id_usuario: 1,
    id_atividade: 1,
    data_inscricao: '2024-04-10T14:22:00Z',
    status: 'CONFIRMADA',
    usuario_nome: 'Luiz Thomas Marte Moreira',
    evento_titulo: 'Semana da Computação 2024',
    evento_id: 1,
    evento_local: 'Campus Cedro - IFCE',
    evento_modalidade: 'Presencial',
    evento_data: '16 a 18 de Maio de 2024',
  },
  {
    id_inscricao: 2,
    id_usuario: 1,
    id_atividade: 3,
    data_inscricao: '2024-05-02T16:15:00Z',
    status: 'CONFIRMADA',
    usuario_nome: 'Luiz Thomas Marte Moreira',
    evento_titulo: 'Mostra Científica IFCE',
    evento_id: 3,
    evento_local: 'Campus Cedro - IFCE',
    evento_modalidade: 'Presencial',
    evento_data: '05 de Junho de 2024',
  },
  // Alunos da Turma Informática S1 na Semana da Computação 2024 (Mockup Organizador)
  {
    id_inscricao: 3,
    id_usuario: 9,
    id_atividade: 1,
    data_inscricao: '2024-04-05T09:00:00Z',
    status: 'CONFIRMADA',
    usuario_nome: 'Ana Beatriz Souza',
    usuario_turma: 'Informática S1',
    usuario_matricula: '20241INFO01',
    evento_titulo: 'Semana da Computação 2024',
    evento_id: 1,
  },
  {
    id_inscricao: 4,
    id_usuario: 10,
    id_atividade: 1,
    data_inscricao: '2024-04-05T09:05:00Z',
    status: 'CONFIRMADA',
    usuario_nome: 'Ana Lívia Pinheiro Vieira',
    usuario_turma: 'Informática S1',
    usuario_matricula: '20241INFO02',
    evento_titulo: 'Semana da Computação 2024',
    evento_id: 1,
  },
  {
    id_inscricao: 5,
    id_usuario: 11,
    id_atividade: 1,
    data_inscricao: '2024-04-05T09:10:00Z',
    status: 'CONFIRMADA',
    usuario_nome: 'Camilo Marquez',
    usuario_turma: 'Informática S1',
    usuario_matricula: '20241INFO03',
    evento_titulo: 'Semana da Computação 2024',
    evento_id: 1,
  },
  {
    id_inscricao: 6,
    id_usuario: 12,
    id_atividade: 1,
    data_inscricao: '2024-04-05T09:15:00Z',
    status: 'CONFIRMADA',
    usuario_nome: 'Danilo Torres Matos',
    usuario_turma: 'Informática S1',
    usuario_matricula: '20241INFO04',
    evento_titulo: 'Semana da Computação 2024',
    evento_id: 1,
  },
  {
    id_inscricao: 7,
    id_usuario: 13,
    id_atividade: 1,
    data_inscricao: '2024-04-05T09:20:00Z',
    status: 'CONFIRMADA',
    usuario_nome: 'Gabriel da Silva',
    usuario_turma: 'Informática S1',
    usuario_matricula: '20241INFO05',
    evento_titulo: 'Semana da Computação 2024',
    evento_id: 1,
  },
  {
    id_inscricao: 8,
    id_usuario: 14,
    id_atividade: 1,
    data_inscricao: '2024-04-05T09:25:00Z',
    status: 'CONFIRMADA',
    usuario_nome: 'Gabriela Oliveira Ferreira',
    usuario_turma: 'Informática S1',
    usuario_matricula: '20241INFO06',
    evento_titulo: 'Semana da Computação 2024',
    evento_id: 1,
  },
  {
    id_inscricao: 9,
    id_usuario: 15,
    id_atividade: 1,
    data_inscricao: '2024-04-05T09:30:00Z',
    status: 'CONFIRMADA',
    usuario_nome: 'João Felipe Gonçalves Diniz',
    usuario_turma: 'Informática S1',
    usuario_matricula: '20241INFO07',
    evento_titulo: 'Semana da Computação 2024',
    evento_id: 1,
  },
];

const INITIAL_FREQUENCIAS: Frequencia[] = [
  // Presenças marcadas conforme mockup do Organizador
  { id_frequencia: 1, id_inscricao: 3, presente: true, data_registro: '2024-05-16T10:00:00Z' }, // Ana Beatriz Souza (Marcado)
  { id_frequencia: 2, id_inscricao: 4, presente: true, data_registro: '2024-05-16T10:00:00Z' }, // Ana Lívia (Marcado)
  { id_frequencia: 3, id_inscricao: 5, presente: false, data_registro: '2024-05-16T10:00:00Z' }, // Camilo (Não marcado)
  { id_frequencia: 4, id_inscricao: 6, presente: false, data_registro: '2024-05-16T10:00:00Z' }, // Danilo (Não marcado)
  { id_frequencia: 5, id_inscricao: 7, presente: true, data_registro: '2024-05-16T10:00:00Z' }, // Gabriel da Silva (Marcado)
  { id_frequencia: 6, id_inscricao: 8, presente: false, data_registro: '2024-05-16T10:00:00Z' }, // Gabriela (Não marcado)
  { id_frequencia: 7, id_inscricao: 9, presente: true, data_registro: '2024-05-16T10:00:00Z' }, // João Felipe (Marcado)
];

const INITIAL_CERTIFICADOS: Certificado[] = [
  // Certificados do participante Luiz Thomas (Mockup: Certificados - Participante.png)
  {
    id_certificado: 1,
    id_frequencia: 101,
    codigo_validacao: 'IFCE-SC23-9F8A-7C21-BD3E-88A1',
    data_emissao: '2023-05-12T17:00:00Z',
    status_aprovacao: 'APROVADO',
    participante_nome: 'Luiz Thomas Marte Moreira',
    participante_matricula: '123456789101112',
    evento_titulo: 'Semana da Computação 2023',
    atividade_titulo: 'Ciclo de Minicursos e Palestras Técnicas',
    organizador_nome: 'José Olinda',
    carga_horaria: 20,
    data_evento: '12/05/2023',
  },
  {
    id_certificado: 2,
    id_frequencia: 102,
    codigo_validacao: 'IFCE-CP23-5A1D-33C8-990E-44B2',
    data_emissao: '2023-08-15T18:00:00Z',
    status_aprovacao: 'APROVADO',
    participante_nome: 'Luiz Thomas Marte Moreira',
    participante_matricula: '123456789101112',
    evento_titulo: 'Ciclo de Palestras 2023',
    atividade_titulo: 'Encontros de Atualização Tecnológica',
    organizador_nome: 'Saulo Bezerra',
    carga_horaria: 10,
    data_evento: '15/08/2023',
  },
  {
    id_certificado: 3,
    id_frequencia: 103,
    codigo_validacao: 'IFCE-OR23-441F-AA82-120D-99C3',
    data_emissao: '2023-08-20T16:00:00Z',
    status_aprovacao: 'APROVADO',
    participante_nome: 'Luiz Thomas Marte Moreira',
    participante_matricula: '123456789101112',
    evento_titulo: 'Oficina de Robótica',
    atividade_titulo: 'Desenvolvimento e Automação com Microcontroladores',
    organizador_nome: 'Lucas Nogueira',
    carga_horaria: 15,
    data_evento: '20/08/2023',
  },
  {
    id_certificado: 4,
    id_frequencia: 104,
    codigo_validacao: 'IFCE-DS23-662E-0081-33FA-11E4',
    data_emissao: '2023-10-10T19:00:00Z',
    status_aprovacao: 'APROVADO',
    participante_nome: 'Luiz Thomas Marte Moreira',
    participante_matricula: '123456789101112',
    evento_titulo: 'Mini Curso de Data Science',
    atividade_titulo: 'Introdução aos Modelos Preditivos e Análise Estatística',
    organizador_nome: 'José Olinda',
    carga_horaria: 8,
    data_evento: '10/10/2023',
  },
];

const INITIAL_SOLICITACOES_INSCRICAO: SolicitacaoInscricaoModeracao[] = [
  {
    id_inscricao: 101,
    participante_nome: 'Luiz Thomas Marte Moreira',
    data_solicitacao: '19/09/2026',
    condicao: 'PARTICIPANTE',
    evento_titulo: 'Semana da Computação 2026',
    status_moderacao: 'PENDENTE',
  },
  {
    id_inscricao: 102,
    participante_nome: 'Lyrane Brito Bezerra',
    data_solicitacao: '19/09/2026',
    condicao: 'PROFESSOR',
    evento_titulo: 'Encontro de Docentes e Pesquisa',
    status_moderacao: 'PENDENTE',
  },
  {
    id_inscricao: 103,
    participante_nome: 'Diego Teixeira Silva',
    data_solicitacao: '19/09/2026',
    condicao: 'ADMINISTRADOR',
    evento_titulo: 'Simpósio de Gestão Acadêmica',
    status_moderacao: 'PENDENTE',
  },
  {
    id_inscricao: 104,
    participante_nome: 'Carlos Eduardo Bezerra Duarte',
    data_solicitacao: '18/09/2026',
    condicao: 'PARTICIPANTE',
    evento_titulo: 'Workshop de Robótica Móvel',
    status_moderacao: 'PENDENTE',
  },
  {
    id_inscricao: 105,
    participante_nome: 'Luiz Guilherme Sales Ferreira',
    data_solicitacao: '18/09/2026',
    condicao: 'PARTICIPANTE',
    evento_titulo: 'Seminário de Cibersegurança',
    status_moderacao: 'PENDENTE',
  },
];

const INITIAL_SOLICITACOES_CERTIFICADO: SolicitacaoCertificadoModeracao[] = [
  {
    id_certificado: 201,
    evento_titulo: 'Semana da Computação 2023',
    organizador_nome: 'José Olinda',
    data_solicitacao: '19/09/2026',
    status_moderacao: 'PENDENTE',
    participante_nome: 'Luiz Thomas Marte Moreira',
  },
  {
    id_certificado: 202,
    evento_titulo: 'E.A.G.L.E. 2026',
    organizador_nome: 'Lucas Nogueira',
    data_solicitacao: '31/09/2026',
    status_moderacao: 'PENDENTE',
    participante_nome: 'Ana Lívia Pinheiro Vieira',
  },
  {
    id_certificado: 203,
    evento_titulo: 'Workshop de IA',
    organizador_nome: 'Lyrane Bezerra',
    data_solicitacao: '07/10/2026',
    status_moderacao: 'PENDENTE',
    participante_nome: 'Gabriel da Silva',
  },
  {
    id_certificado: 204,
    evento_titulo: 'Mostra Científica IFCE',
    organizador_nome: 'Saulo Bezerra',
    data_solicitacao: '10/10/2026',
    status_moderacao: 'PENDENTE',
    participante_nome: 'João Felipe Gonçalves Diniz',
  },
  {
    id_certificado: 205,
    evento_titulo: 'Minicurso de Python',
    organizador_nome: 'José Olinda',
    data_solicitacao: '19/10/2026',
    status_moderacao: 'PENDENTE',
    participante_nome: 'Carlos Eduardo Bezerra Duarte',
  },
];

export class AppStore {
  private data: StoreData;
  private listeners: Set<() => void> = new Set();
  private idCounter: number = Date.now();

  private nextUniqueId(): number {
    this.idCounter = Math.max(this.idCounter + 1, Date.now());
    return this.idCounter;
  }

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StoreData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoreData = JSON.parse(stored);
        
        // Sanitize and guarantee no duplicated IDs across collections
        if (parsed && Array.isArray(parsed.certificados)) {
          const seenCertIds = new Set<number>();
          parsed.certificados = parsed.certificados.map((c, idx) => {
            let id = c.id_certificado;
            if (!id || seenCertIds.has(id)) {
              id = Date.now() + idx + Math.floor(Math.random() * 100000);
            }
            seenCertIds.add(id);
            return { ...c, id_certificado: id };
          });
        }

        if (parsed && Array.isArray(parsed.inscricoes)) {
          const seenInscIds = new Set<number>();
          parsed.inscricoes = parsed.inscricoes.map((i, idx) => {
            let id = i.id_inscricao;
            if (!id || seenInscIds.has(id)) {
              id = Date.now() + 5000 + idx;
            }
            seenInscIds.add(id);
            return { ...i, id_inscricao: id };
          });
        }

        if (parsed && Array.isArray(parsed.usuarios)) {
          // Garante que todo usuário possua status_conta e adiciona exemplos pendentes para demonstração se não existirem
          const hasPending = parsed.usuarios.some((u) => u.status_conta === 'PENDENTE');
          if (!hasPending) {
            parsed.usuarios.push(
              {
                id_usuario: 16,
                nome: 'Mariana Ribeiro Feitosa',
                email: 'mariana.feitosa@gmail.com',
                senha_hash: '$2b$10$hash',
                matricula: '20241INFO08',
                perfil: 'PARTICIPANTE',
                status_conta: 'PENDENTE',
                foto_perfil: null,
                telefone: '(88) 99888-1122',
                created_at: '2026-10-14T09:15:00Z',
              },
              {
                id_usuario: 17,
                nome: 'Prof. Rodrigo Cavalcante Maia',
                email: 'rodrigo.maia@ifce.edu.br',
                senha_hash: '$2b$10$hash',
                matricula: 'DOC-9912',
                perfil: 'PROFESSOR',
                status_conta: 'PENDENTE',
                foto_perfil: null,
                telefone: '(88) 99777-3344',
                materias: 'Sistemas Embarcados e IoT',
                created_at: '2026-10-14T10:30:00Z',
              }
            );
          }
          parsed.usuarios = parsed.usuarios.map((u) => ({
            ...u,
            status_conta: u.status_conta || 'ATIVO',
          }));
        }

        return parsed;
      }
    } catch {
      // fallback to initial
    }

    return {
      currentUser: INITIAL_USUARIOS[0], // Default: Luiz Thomas (Participante)
      usuarios: INITIAL_USUARIOS,
      eventos: INITIAL_EVENTOS,
      atividades: INITIAL_ATIVIDADES,
      inscricoes: INITIAL_INSCRICOES,
      frequencias: INITIAL_FREQUENCIAS,
      certificados: INITIAL_CERTIFICADOS,
      favoritos: [1, 3], // Default: Semana da Computação e Mostra Científica
      solicitacoesInscricao: INITIAL_SOLICITACOES_INSCRICAO,
      solicitacoesCertificado: INITIAL_SOLICITACOES_CERTIFICADO,
    };
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // ignore quota errors
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  // Getters
  public getCurrentUser(): Usuario {
    return this.data.currentUser;
  }

  public getUsuarios(): Usuario[] {
    return [...this.data.usuarios];
  }

  public getUsuariosPendentes(): Usuario[] {
    return this.data.usuarios.filter((u) => u.status_conta === 'PENDENTE');
  }

  public getEventos(): Evento[] {
    return [...this.data.eventos];
  }

  public getAtividades(): Atividade[] {
    return [...this.data.atividades];
  }

  public getInscricoes(): Inscricao[] {
    return [...this.data.inscricoes];
  }

  public getFrequencias(): Frequencia[] {
    return [...this.data.frequencias];
  }

  public getCertificados(): Certificado[] {
    return [...this.data.certificados];
  }

  public getFavoritos(): number[] {
    return [...this.data.favoritos];
  }

  public getSolicitacoesInscricao(): SolicitacaoInscricaoModeracao[] {
    return [...this.data.solicitacoesInscricao];
  }

  public getSolicitacoesCertificado(): SolicitacaoCertificadoModeracao[] {
    return [...this.data.solicitacoesCertificado];
  }

  // Auth & User actions
  public switchUser(id_usuario: number): void {
    const user = this.data.usuarios.find((u) => u.id_usuario === id_usuario);
    if (user) {
      this.data.currentUser = user;
      this.save();
    }
  }

  public login(email: string): { success: boolean; message?: string } {
    const user = this.data.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }

    if (user.status_conta === 'PENDENTE') {
      return {
        success: false,
        message: 'Seu cadastro foi realizado com sucesso, mas ainda está pendente de confirmação por um administrador do IFCE. Aguarde a aprovação.',
      };
    }

    if (user.status_conta === 'RECUSADO') {
      return {
        success: false,
        message: 'Seu cadastro foi recusado pela administração do IFCE. Entre em contato com a coordenação caso considere um equívoco.',
      };
    }

    this.data.currentUser = user;
    this.save();
    return { success: true };
  }

  public register(nome: string, email: string, perfil: Usuario['perfil']): { success: boolean; message?: string } {
    if (this.data.usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Já existe um usuário cadastrado com este e-mail.' };
    }

    const newUser: Usuario = {
      id_usuario: this.nextUniqueId(),
      nome,
      email,
      senha_hash: '$2b$10$newUserSimulatedHash',
      matricula: perfil === 'PARTICIPANTE' ? `20241${Math.floor(1000 + Math.random() * 9000)}` : `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      perfil,
      status_conta: 'PENDENTE',
      created_at: new Date().toISOString(),
    };

    this.data.usuarios.push(newUser);
    // Usuário novo não loga imediatamente, fica pendente para aprovação do Administrador
    this.save();
    return {
      success: true,
      message: 'Cadastro realizado com sucesso! Aguarde um administrador confirmar o seu cadastro.',
    };
  }

  public moderarUsuario(id_usuario: number, decisao: 'APROVAR' | 'RECUSAR'): void {
    const user = this.data.usuarios.find((u) => u.id_usuario === id_usuario);
    if (user) {
      user.status_conta = decisao === 'APROVAR' ? 'ATIVO' : 'RECUSADO';
      this.save();
    }
  }

  public updateProfile(id_usuario: number, updates: Partial<Usuario>): void {
    const idx = this.data.usuarios.findIndex((u) => u.id_usuario === id_usuario);
    if (idx !== -1) {
      this.data.usuarios[idx] = { ...this.data.usuarios[idx], ...updates };
      if (this.data.currentUser.id_usuario === id_usuario) {
        this.data.currentUser = this.data.usuarios[idx];
      }
      this.save();
    }
  }

  // Favorite toggle
  public toggleFavorito(id_evento: number): void {
    if (this.data.favoritos.includes(id_evento)) {
      this.data.favoritos = this.data.favoritos.filter((id) => id !== id_evento);
    } else {
      this.data.favoritos.push(id_evento);
    }
    this.save();
  }

  // Event actions
  public createEvento(novo: Omit<Evento, 'id_evento' | 'created_at' | 'inscritos_count'>): Evento {
    const eventId = this.nextUniqueId();
    const atividadeId = this.nextUniqueId();

    const created: Evento = {
      ...novo,
      id_evento: eventId,
      created_at: new Date().toISOString(),
      inscritos_count: 0,
      organizador_nome: this.data.currentUser.nome,
    };
    this.data.eventos.unshift(created);

    // Cria também uma atividade principal vinculada
    const novaAtividade: Atividade = {
      id_atividade: atividadeId,
      id_evento: created.id_evento,
      titulo: `Sessão Principal - ${created.titulo}`,
      tipo: 'Palestra',
      data_hora_inicio: created.data_inicio,
      data_hora_fim: created.data_fim,
      local: created.local,
      limite_vagas: 100,
      vagas_ocupadas: 0,
      carga_horaria: 20,
      created_at: new Date().toISOString(),
    };
    this.data.atividades.push(novaAtividade);

    this.save();
    return created;
  }

  public updateEvento(id_evento: number, updates: Partial<Evento>): void {
    const idx = this.data.eventos.findIndex((e) => e.id_evento === id_evento);
    if (idx !== -1) {
      this.data.eventos[idx] = { ...this.data.eventos[idx], ...updates };
      this.save();
    }
  }

  // Inscriptions
  public inscrever(id_evento: number, id_usuario: number): { success: boolean; message: string } {
    const evento = this.data.eventos.find((e) => e.id_evento === id_evento);
    if (!evento) return { success: false, message: 'Evento não encontrado.' };

    const atividade = this.data.atividades.find((a) => a.id_evento === id_evento) || {
      id_atividade: this.nextUniqueId(),
      id_evento,
      titulo: evento.titulo,
      tipo: 'Geral',
      data_hora_inicio: evento.data_inicio,
      data_hora_fim: evento.data_fim,
      local: evento.local,
      limite_vagas: 100,
      carga_horaria: 20,
      created_at: new Date().toISOString(),
    };

    const already = this.data.inscricoes.find(
      (i) => i.id_usuario === id_usuario && i.id_atividade === atividade.id_atividade && i.status === 'CONFIRMADA'
    );
    if (already) {
      return { success: false, message: 'Você já possui inscrição confirmada para este evento.' };
    }

    const novaInscricao: Inscricao = {
      id_inscricao: this.nextUniqueId(),
      id_usuario,
      id_atividade: atividade.id_atividade,
      data_inscricao: new Date().toISOString(),
      status: 'CONFIRMADA',
      usuario_nome: this.data.currentUser.nome,
      evento_titulo: evento.titulo,
      evento_id: evento.id_evento,
      evento_local: evento.local,
      evento_modalidade: evento.modalidade,
      evento_data: evento.data_formatada || evento.data_inicio,
    };

    this.data.inscricoes.push(novaInscricao);
    evento.inscritos_count = (evento.inscritos_count || 0) + 1;
    this.save();

    return { success: true, message: 'Inscrição realizada com sucesso no IFCE Iventus!' };
  }

  public cancelarInscricao(id_inscricao: number): void {
    const inscricao = this.data.inscricoes.find((i) => i.id_inscricao === id_inscricao);
    if (inscricao) {
      inscricao.status = 'CANCELADA';
      const evento = this.data.eventos.find((e) => e.id_evento === inscricao.evento_id);
      if (evento && evento.inscritos_count && evento.inscritos_count > 0) {
        evento.inscritos_count -= 1;
      }
      this.save();
    }
  }

  // Frequência
  public togglePresenca(id_inscricao: number): void {
    const freq = this.data.frequencias.find((f) => f.id_inscricao === id_inscricao);
    if (freq) {
      freq.presente = !freq.presente;
      freq.data_registro = new Date().toISOString();
    } else {
      this.data.frequencias.push({
        id_frequencia: this.nextUniqueId(),
        id_inscricao,
        presente: true,
        data_registro: new Date().toISOString(),
      });
    }
    this.save();
  }

  public isPresente(id_inscricao: number): boolean {
    const freq = this.data.frequencias.find((f) => f.id_inscricao === id_inscricao);
    return Boolean(freq && freq.presente);
  }

  // Emitir Certificado para Aluno
  public emitirCertificado(alunoNome: string, matricula: string, eventoTitulo: string, cargaHoraria: number = 20): Certificado {
    // Evita duplicidade se o certificado já foi emitido para o mesmo aluno e evento
    const existing = this.data.certificados.find(
      (c) => c.participante_nome === alunoNome && c.evento_titulo === eventoTitulo
    );
    if (existing) {
      return existing;
    }

    const certId = this.nextUniqueId();
    const freqId = this.nextUniqueId();
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const randomHex2 = Math.random().toString(16).substring(2, 6).toUpperCase();
    const codigo = `IFCE-${eventoTitulo.slice(0, 3).toUpperCase()}-${randomHex}-${randomHex2}-CERT-${certId.toString().slice(-4)}`;

    const cert: Certificado = {
      id_certificado: certId,
      id_frequencia: freqId,
      codigo_validacao: codigo,
      data_emissao: new Date().toISOString(),
      status_aprovacao: 'APROVADO',
      participante_nome: alunoNome,
      participante_matricula: matricula,
      evento_titulo: eventoTitulo,
      atividade_titulo: 'Participação Geral e Aproveitamento nas Atividades Acadêmicas',
      organizador_nome: this.data.currentUser.nome || 'Coordenação Geral IFCE',
      carga_horaria: cargaHoraria,
      data_evento: new Date().toLocaleDateString('pt-BR'),
    };

    this.data.certificados.unshift(cert);
    this.save();
    return cert;
  }

  // Moderação Admin
  public moderarInscricao(id_inscricao: number, decisao: 'APROVAR' | 'RECUSAR'): void {
    const item = this.data.solicitacoesInscricao.find((s) => s.id_inscricao === id_inscricao);
    if (item) {
      item.status_moderacao = decisao === 'APROVAR' ? 'APROVADO' : 'RECUSADO';
      this.save();
    }
  }

  public moderarCertificado(id_certificado: number, decisao: 'APROVAR' | 'RECUSAR'): void {
    const item = this.data.solicitacoesCertificado.find((s) => s.id_certificado === id_certificado);
    if (item) {
      item.status_moderacao = decisao === 'APROVAR' ? 'APROVADO' : 'RECUSADO';
      this.save();
    }
  }

  public validarCertificado(codigo: string): Certificado | null {
    const clean = codigo.trim().toUpperCase();
    return this.data.certificados.find((c) => c.codigo_validacao.toUpperCase() === clean) || null;
  }

  public resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.loadData();
    this.notify();
  }
}

export const store = new AppStore();
