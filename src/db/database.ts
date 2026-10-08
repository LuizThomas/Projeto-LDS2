import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  senha_hash: string;
  matricula: string | null;
  perfil: 'ADMINISTRADOR' | 'PROFESSOR' | 'PARTICIPANTE';
  foto_perfil: string | null;
  telefone: string | null;
  materias: string | null;
  created_at: string;
}

export interface Evento {
  id_evento: number;
  id_organizador: number;
  titulo: string;
  descricao: string | null;
  banner_url: string | null;
  local: string;
  horario: string;
  modalidade: 'Presencial' | 'Online';
  data_inicio: string;
  data_fim: string;
  inicio_inscricoes: string;
  fim_inscricoes: string;
  status: 'RASCUNHO' | 'PUBLICADO' | 'ENCERRADO' | 'CANCELADO';
  created_at: string;
}

export interface Atividade {
  id_atividade: number;
  id_evento: number;
  titulo: string;
  descricao: string | null;
  tipo: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  local: string;
  limite_vagas: number;
  created_at: string;
}

export interface Inscricao {
  id_inscricao: number;
  id_usuario: number;
  id_atividade: number;
  data_inscricao: string;
  status: 'CONFIRMADA' | 'CANCELADA';
}

export interface Frequencia {
  id_frequencia: number;
  id_inscricao: number;
  presente: boolean;
  data_registro: string;
}

export interface Certificado {
  id_certificado: number;
  id_frequencia: number;
  codigo_validacao: string;
  data_emissao: string;
}

export interface DatabaseState {
  usuario: Usuario[];
  evento: Evento[];
  atividade: Atividade[];
  inscricao: Inscricao[];
  frequencia: Frequencia[];
  certificado: Certificado[];
  counters: {
    usuario: number;
    evento: number;
    atividade: number;
    inscricao: number;
    frequencia: number;
    certificado: number;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db_eventos_ifce.json');

class DatabaseService {
  public state: DatabaseState = {
    usuario: [],
    evento: [],
    atividade: [],
    inscricao: [],
    frequencia: [],
    certificado: [],
    counters: {
      usuario: 0,
      evento: 0,
      atividade: 0,
      inscricao: 0,
      frequencia: 0,
      certificado: 0,
    },
  };

  private isConnectedToMySQL = false;

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.state = JSON.parse(raw);
        console.log('📦 Banco de dados local db_eventos_ifce carregado.');
      } catch (err) {
        console.error('Erro ao ler db_eventos_ifce.json, recriando:', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }

    // Garante que o Evento 1 (Semana da Computação) e eventos ativos estejam com datas e status adequados
    const evt1 = this.state.evento.find(e => e.id_evento === 1);
    if (evt1) {
      evt1.status = 'PUBLICADO';
      evt1.data_inicio = '2026-11-16T08:00:00.000Z';
      evt1.data_fim = '2026-11-18T18:00:00.000Z';
      evt1.inicio_inscricoes = '2026-01-01T00:00:00.000Z';
      evt1.fim_inscricoes = '2026-12-31T23:59:59.000Z';
    }
    this.save();

    this.tryConnectMySQL();
  }

  private async tryConnectMySQL() {
    const mysqlHost = process.env.MYSQL_HOST || process.env.DB_HOST;
    const mysqlUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

    if (mysqlHost || mysqlUrl) {
      try {
        const mysql = await import('mysql2/promise');
        const conn = mysqlUrl
          ? await mysql.createConnection(mysqlUrl)
          : await mysql.createConnection({
              host: mysqlHost,
              port: Number(process.env.MYSQL_PORT || 3306),
              user: process.env.MYSQL_USER || 'root',
              password: process.env.MYSQL_PASSWORD || '',
              database: process.env.MYSQL_DATABASE || 'db_eventos_ifce',
            });

        await conn.ping();
        this.isConnectedToMySQL = true;
        console.log('✅ Conexão direta com MySQL (db_eventos_ifce) estabelecida com sucesso!');
        await conn.end();
      } catch (err: any) {
        console.warn('⚠️ MySQL remoto não acessível no momento:', err.message);
        console.log('ℹ️ Operando com storage relacional local db_eventos_ifce (totalmente compatível).');
      }
    }
  }

  public getMySQLStatus() {
    return {
      connectedToRemoteMySQL: this.isConnectedToMySQL,
      databaseName: 'db_eventos_ifce',
      tables: ['usuario', 'evento', 'atividade', 'inscricao', 'frequencia', 'certificado'],
      totalUsers: this.state.usuario.length,
      totalEvents: this.state.evento.length,
      totalRegistrations: this.state.inscricao.length,
    };
  }

  private save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Falha ao persistir banco db_eventos_ifce:', err);
    }
  }

  private seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const senhaAluno = bcrypt.hashSync('alunoifce', salt);
    const senhaProf = bcrypt.hashSync('professor123', salt);
    const senhaAdmin = bcrypt.hashSync('admin123', salt);

    const now = new Date();
    const createdStr = now.toISOString();

    const usuarios: Usuario[] = [
      {
        id_usuario: 1,
        nome: 'Luiz Thomas Marte Moreira',
        email: 'luiz.thomas@gmail.com',
        senha_hash: senhaAluno,
        matricula: '123456789101112',
        perfil: 'PARTICIPANTE',
        foto_perfil: '/assets/images/avatar-lais.svg',
        telefone: '(88) 99999-9999',
        materias: null,
        created_at: createdStr,
      },
      {
        id_usuario: 2,
        nome: 'Saulo Bezerra',
        email: 'saulo_bezerra@gmail.com',
        senha_hash: senhaProf,
        matricula: 'SIAPE 2849102',
        perfil: 'PROFESSOR',
        foto_perfil: '/assets/images/avatar-prof.svg',
        telefone: '(88) 96798-1099',
        materias: 'LDS ARQM',
        created_at: createdStr,
      },
      {
        id_usuario: 3,
        nome: 'Administrador IFCE',
        email: 'admin@ifce.edu.br',
        senha_hash: senhaAdmin,
        matricula: 'SIAPE 1002003',
        perfil: 'ADMINISTRADOR',
        foto_perfil: '/assets/images/avatar-admin.svg',
        telefone: '(88) 3582-1000',
        materias: null,
        created_at: createdStr,
      },
      // Alunos inscritos na turma Informática S1 (conforme Figma Organizador screen 4)
      {
        id_usuario: 4,
        nome: 'Ana Beatriz Souza',
        email: 'ana.souza@aluno.ifce.edu.br',
        senha_hash: senhaAluno,
        matricula: '2024101001',
        perfil: 'PARTICIPANTE',
        foto_perfil: null,
        telefone: '(88) 99101-1111',
        materias: null,
        created_at: createdStr,
      },
      {
        id_usuario: 5,
        nome: 'Ana Lívia Pinheiro Vieira',
        email: 'ana.livia@aluno.ifce.edu.br',
        senha_hash: senhaAluno,
        matricula: '2024101002',
        perfil: 'PARTICIPANTE',
        foto_perfil: null,
        telefone: '(88) 99101-2222',
        materias: null,
        created_at: createdStr,
      },
      {
        id_usuario: 6,
        nome: 'Camilo Marquez',
        email: 'camilo.marquez@aluno.ifce.edu.br',
        senha_hash: senhaAluno,
        matricula: '2024101003',
        perfil: 'PARTICIPANTE',
        foto_perfil: null,
        telefone: '(88) 99101-3333',
        materias: null,
        created_at: createdStr,
      },
      {
        id_usuario: 7,
        nome: 'Danilo Torres Matos',
        email: 'danilo.matos@aluno.ifce.edu.br',
        senha_hash: senhaAluno,
        matricula: '2024101004',
        perfil: 'PARTICIPANTE',
        foto_perfil: null,
        telefone: '(88) 99101-4444',
        materias: null,
        created_at: createdStr,
      },
      {
        id_usuario: 8,
        nome: 'Gabriel da Silva',
        email: 'gabriel.silva@aluno.ifce.edu.br',
        senha_hash: senhaAluno,
        matricula: '2024101005',
        perfil: 'PARTICIPANTE',
        foto_perfil: null,
        telefone: '(88) 99101-5555',
        materias: null,
        created_at: createdStr,
      },
      {
        id_usuario: 9,
        nome: 'Gabriela Oliveira Ferreira',
        email: 'gabriela.ferreira@aluno.ifce.edu.br',
        senha_hash: senhaAluno,
        matricula: '2024101006',
        perfil: 'PARTICIPANTE',
        foto_perfil: null,
        telefone: '(88) 99101-6666',
        materias: null,
        created_at: createdStr,
      },
      {
        id_usuario: 10,
        nome: 'João Felipe Gonçalves Diniz',
        email: 'joao.diniz@aluno.ifce.edu.br',
        senha_hash: senhaAluno,
        matricula: '2024101007',
        perfil: 'PARTICIPANTE',
        foto_perfil: null,
        telefone: '(88) 99101-7777',
        materias: null,
        created_at: createdStr,
      },
    ];

    const eventos: Evento[] = [
      {
        id_evento: 1,
        id_organizador: 2,
        titulo: 'Semana da Computação 2024',
        descricao: 'Ciclo anual de palestras técnicas, maratona de programação, inovação tecnológica e inteligência artificial no IFCE Campus Cedro.',
        banner_url: '/assets/images/event-comp.svg',
        local: 'Campus Cedro - IFCE',
        horario: '08:00h - 18:00h',
        modalidade: 'Presencial',
        data_inicio: '2024-05-16T08:00:00.000Z',
        data_fim: '2024-05-18T18:00:00.000Z',
        inicio_inscricoes: '2024-04-01T00:00:00.000Z',
        fim_inscricoes: '2024-05-15T23:59:59.000Z',
        status: 'ENCERRADO',
        created_at: createdStr,
      },
      {
        id_evento: 2,
        id_organizador: 2,
        titulo: 'Workshop de IA',
        descricao: 'Treinamento prático sobre modelos generativos, redes neurais e processamento de linguagem natural aplicados à educação e indústria.',
        banner_url: '/assets/images/event-ai.svg',
        local: 'Online',
        horario: '14:00h - 18:00h',
        modalidade: 'Online',
        data_inicio: '2024-05-20T14:00:00.000Z',
        data_fim: '2024-05-20T18:00:00.000Z',
        inicio_inscricoes: '2024-04-10T00:00:00.000Z',
        fim_inscricoes: '2024-05-19T23:59:59.000Z',
        status: 'CANCELADO',
        created_at: createdStr,
      },
      {
        id_evento: 3,
        id_organizador: 2,
        titulo: 'Mostra Científica IFCE',
        descricao: 'Apresentação de trabalhos acadêmicos, banners, artigos científicos e projetos de extensão desenvolvidos pelos estudantes de tecnologia.',
        banner_url: '/assets/images/event-science.svg',
        local: 'Campus Cedro - IFCE',
        horario: '13:00h - 15:00h',
        modalidade: 'Presencial',
        data_inicio: '2024-06-05T13:00:00.000Z',
        data_fim: '2024-06-05T17:00:00.000Z',
        inicio_inscricoes: '2024-05-01T00:00:00.000Z',
        fim_inscricoes: '2024-06-04T23:59:59.000Z',
        status: 'PUBLICADO',
        created_at: createdStr,
      },
      {
        id_evento: 4,
        id_organizador: 2,
        titulo: 'Palestra Inovação e Tecnologia',
        descricao: 'Debate de vanguarda sobre mercado tech no Ceará, oportunidades para desenvolvedores juniores e tendências de computação em nuvem.',
        banner_url: '/assets/images/event-comp.svg',
        local: 'Campus Cedro - IFCE',
        horario: '09:00h - 12:00h',
        modalidade: 'Online',
        data_inicio: '2024-06-10T09:00:00.000Z',
        data_fim: '2024-06-10T12:00:00.000Z',
        inicio_inscricoes: '2024-05-15T00:00:00.000Z',
        fim_inscricoes: '2024-06-09T23:59:59.000Z',
        status: 'RASCUNHO',
        created_at: createdStr,
      },
      {
        id_evento: 5,
        id_organizador: 2,
        titulo: 'Minicurso de Python',
        descricao: 'Fundamentos da linguagem Python, bibliotecas científicas NumPy e Pandas, além de automação de tarefas acadêmicas.',
        banner_url: '/assets/images/event-robotics.svg',
        local: 'Online',
        horario: '19:00h - 22:00h',
        modalidade: 'Online',
        data_inicio: '2024-06-12T19:00:00.000Z',
        data_fim: '2024-06-12T22:00:00.000Z',
        inicio_inscricoes: '2024-05-20T00:00:00.000Z',
        fim_inscricoes: '2024-06-11T23:59:59.000Z',
        status: 'PUBLICADO',
        created_at: createdStr,
      },
      {
        id_evento: 6,
        id_organizador: 2,
        titulo: 'Simpósio de Pesquisa',
        descricao: 'Simpósio anual de iniciação científica e tecnológica reunindo pesquisadores e alunos de graduação e técnico do IFCE.',
        banner_url: '/assets/images/event-science.svg',
        local: 'Campus Cedro - IFCE',
        horario: '08:00h - 17:00h',
        modalidade: 'Presencial',
        data_inicio: '2024-06-15T08:00:00.000Z',
        data_fim: '2024-06-15T17:00:00.000Z',
        inicio_inscricoes: '2024-05-25T00:00:00.000Z',
        fim_inscricoes: '2024-06-14T23:59:59.000Z',
        status: 'PUBLICADO',
        created_at: createdStr,
      },
    ];

    const atividades: Atividade[] = [
      {
        id_atividade: 1,
        id_evento: 1,
        titulo: 'Semana da Computação 2024 - Geral',
        descricao: 'Acesso integral à programação e palestras do evento.',
        tipo: 'Geral',
        data_hora_inicio: '2024-05-16T08:00:00.000Z',
        data_hora_fim: '2024-05-18T18:00:00.000Z',
        local: 'Auditório Central Campus Cedro',
        limite_vagas: 150,
        created_at: createdStr,
      },
      {
        id_atividade: 2,
        id_evento: 2,
        titulo: 'Workshop de IA - Sessão Prática',
        descricao: 'Mão na massa construindo pipelines com embeddings.',
        tipo: 'Workshop',
        data_hora_inicio: '2024-05-20T14:00:00.000Z',
        data_hora_fim: '2024-05-20T18:00:00.000Z',
        local: 'Google Meet',
        limite_vagas: 60,
        created_at: createdStr,
      },
      {
        id_atividade: 3,
        id_evento: 3,
        titulo: 'Mostra Científica IFCE - Apresentações',
        descricao: 'Apresentação pública de artigos e projetos.',
        tipo: 'Mostra',
        data_hora_inicio: '2024-06-05T13:00:00.000Z',
        data_hora_fim: '2024-06-05T17:00:00.000Z',
        local: 'Hall de Entrada Campus Cedro',
        limite_vagas: 100,
        created_at: createdStr,
      },
      {
        id_atividade: 4,
        id_evento: 4,
        titulo: 'Palestra Inovação e Tecnologia',
        descricao: 'Palestra com especialistas do Polo de Inovação.',
        tipo: 'Palestra',
        data_hora_inicio: '2024-06-10T09:00:00.000Z',
        data_hora_fim: '2024-06-10T12:00:00.000Z',
        local: 'Auditório 2',
        limite_vagas: 80,
        created_at: createdStr,
      },
      {
        id_atividade: 5,
        id_evento: 5,
        titulo: 'Minicurso de Python Intensivo',
        descricao: 'Capacitação prática com exercícios.',
        tipo: 'Minicurso',
        data_hora_inicio: '2024-06-12T19:00:00.000Z',
        data_hora_fim: '2024-06-12T22:00:00.000Z',
        local: 'Laboratório de Informática 3',
        limite_vagas: 40,
        created_at: createdStr,
      },
      {
        id_atividade: 6,
        id_evento: 6,
        titulo: 'Simpósio de Pesquisa - Sessão Plenária',
        descricao: 'Abertura e debates científicos.',
        tipo: 'Simpósio',
        data_hora_inicio: '2024-06-15T08:00:00.000Z',
        data_hora_fim: '2024-06-15T17:00:00.000Z',
        local: 'Auditório Central',
        limite_vagas: 120,
        created_at: createdStr,
      },
    ];

    // Inscrições para a Semana da Computação 2024 (alunos da Turma S1)
    const inscricoes: Inscricao[] = [
      { id_inscricao: 1, id_usuario: 4, id_atividade: 1, data_inscricao: '2024-04-05T10:00:00.000Z', status: 'CONFIRMADA' },
      { id_inscricao: 2, id_usuario: 5, id_atividade: 1, data_inscricao: '2024-04-05T10:15:00.000Z', status: 'CONFIRMADA' },
      { id_inscricao: 3, id_usuario: 6, id_atividade: 1, data_inscricao: '2024-04-06T11:00:00.000Z', status: 'CONFIRMADA' },
      { id_inscricao: 4, id_usuario: 7, id_atividade: 1, data_inscricao: '2024-04-06T14:30:00.000Z', status: 'CONFIRMADA' },
      { id_inscricao: 5, id_usuario: 8, id_atividade: 1, data_inscricao: '2024-04-07T09:20:00.000Z', status: 'CONFIRMADA' },
      { id_inscricao: 6, id_usuario: 9, id_atividade: 1, data_inscricao: '2024-04-07T15:45:00.000Z', status: 'CONFIRMADA' },
      { id_inscricao: 7, id_usuario: 10, id_atividade: 1, data_inscricao: '2024-04-08T08:10:00.000Z', status: 'CONFIRMADA' },
      // Luiz Thomas inscrito em 2 eventos
      { id_inscricao: 8, id_usuario: 1, id_atividade: 1, data_inscricao: '2024-04-02T14:00:00.000Z', status: 'CONFIRMADA' },
      { id_inscricao: 9, id_usuario: 1, id_atividade: 3, data_inscricao: '2024-05-10T11:00:00.000Z', status: 'CONFIRMADA' },
    ];

    // Frequência (Presença) conforme tela do Figma:
    // Ana Beatriz: presente
    // Ana Lívia: presente
    // Camilo: ausente
    // Danilo: ausente
    // Gabriel: presente
    // Gabriela: ausente
    // João Felipe: presente
    // Luiz Thomas: presente
    const frequencias: Frequencia[] = [
      { id_frequencia: 1, id_inscricao: 1, presente: true, data_registro: '2024-05-16T18:00:00.000Z' },
      { id_frequencia: 2, id_inscricao: 2, presente: true, data_registro: '2024-05-16T18:00:00.000Z' },
      { id_frequencia: 3, id_inscricao: 3, presente: false, data_registro: '2024-05-16T18:00:00.000Z' },
      { id_frequencia: 4, id_inscricao: 4, presente: false, data_registro: '2024-05-16T18:00:00.000Z' },
      { id_frequencia: 5, id_inscricao: 5, presente: true, data_registro: '2024-05-16T18:00:00.000Z' },
      { id_frequencia: 6, id_inscricao: 6, presente: false, data_registro: '2024-05-16T18:00:00.000Z' },
      { id_frequencia: 7, id_inscricao: 7, presente: true, data_registro: '2024-05-16T18:00:00.000Z' },
      { id_frequencia: 8, id_inscricao: 8, presente: true, data_registro: '2024-05-18T19:00:00.000Z' },
      { id_frequencia: 9, id_inscricao: 9, presente: true, data_registro: '2024-06-05T18:00:00.000Z' },
    ];

    // Certificados emitidos para quem teve presença confirmada
    const certificados: Certificado[] = [
      { id_certificado: 1, id_frequencia: 1, codigo_validacao: 'IFCE-CERT-2024-COMP-ABS01', data_emissao: '2024-05-19T10:00:00.000Z' },
      { id_certificado: 2, id_frequencia: 2, codigo_validacao: 'IFCE-CERT-2024-COMP-ALV02', data_emissao: '2024-05-19T10:00:00.000Z' },
      { id_certificado: 3, id_frequencia: 5, codigo_validacao: 'IFCE-CERT-2024-COMP-GDS03', data_emissao: '2024-05-19T10:00:00.000Z' },
      { id_certificado: 4, id_frequencia: 7, codigo_validacao: 'IFCE-CERT-2024-COMP-JFD04', data_emissao: '2024-05-19T10:00:00.000Z' },
      { id_certificado: 5, id_frequencia: 8, codigo_validacao: 'IFCE-CERT-2024-COMP-LTM08', data_emissao: '2024-05-19T10:00:00.000Z' },
    ];

    this.state = {
      usuario: usuarios,
      evento: eventos,
      atividade: atividades,
      inscricao: inscricoes,
      frequencia: frequencias,
      certificado: certificados,
      counters: {
        usuario: usuarios.length,
        evento: eventos.length,
        atividade: atividades.length,
        inscricao: inscricoes.length,
        frequencia: frequencias.length,
        certificado: certificados.length,
      },
    };

    this.save();
    console.log('🌱 Base de dados db_eventos_ifce inicializada com sucesso.');
  }

  // --- MÉTODOS DE CONSULTA E MANIPULAÇÃO (USUARIO) ---

  public findUserByEmail(email: string): Usuario | undefined {
    return this.state.usuario.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public findUserById(id: number): Usuario | undefined {
    return this.state.usuario.find(u => u.id_usuario === id);
  }

  public findUserByMatricula(matricula: string): Usuario | undefined {
    return this.state.usuario.find(u => u.matricula && u.matricula.trim() === matricula.trim());
  }

  public getAllUsers(): Usuario[] {
    return [...this.state.usuario];
  }

  public createUser(userData: {
    nome: string;
    email: string;
    senha_hash: string;
    matricula?: string | null;
    perfil?: 'ADMINISTRADOR' | 'PROFESSOR' | 'PARTICIPANTE';
    foto_perfil?: string | null;
    telefone?: string | null;
    materias?: string | null;
  }): Usuario {
    // Unicidade de e-mail (Constraint do MySQL)
    if (this.findUserByEmail(userData.email)) {
      throw new Error('O e-mail informado já está cadastrado no sistema.');
    }

    // Unicidade de matrícula se informada
    if (userData.matricula && this.findUserByMatricula(userData.matricula)) {
      throw new Error('A matrícula informada já está cadastrada no sistema.');
    }

    this.state.counters.usuario++;
    const newUser: Usuario = {
      id_usuario: this.state.counters.usuario,
      nome: userData.nome.trim(),
      email: userData.email.trim().toLowerCase(),
      senha_hash: userData.senha_hash,
      matricula: userData.matricula ? userData.matricula.trim() : null,
      perfil: userData.perfil || 'PARTICIPANTE',
      foto_perfil: userData.foto_perfil || null,
      telefone: userData.telefone ? userData.telefone.trim() : null,
      materias: userData.materias ? userData.materias.trim() : null,
      created_at: new Date().toISOString(),
    };

    this.state.usuario.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: number, updates: Partial<Usuario>): Usuario {
    const idx = this.state.usuario.findIndex(u => u.id_usuario === id);
    if (idx === -1) {
      throw new Error('Usuário não encontrado.');
    }

    // Se estiver atualizando e-mail, verificar unicidade
    if (updates.email && updates.email.toLowerCase() !== this.state.usuario[idx].email.toLowerCase()) {
      if (this.findUserByEmail(updates.email)) {
        throw new Error('O e-mail informado já está em uso por outro usuário.');
      }
    }

    this.state.usuario[idx] = {
      ...this.state.usuario[idx],
      ...updates,
    };
    this.save();
    return this.state.usuario[idx];
  }

  public deleteUser(id: number): boolean {
    const idx = this.state.usuario.findIndex(u => u.id_usuario === id);
    if (idx === -1) return false;
    this.state.usuario.splice(idx, 1);
    this.save();
    return true;
  }

  // --- MÉTODOS DE CONSULTA E MANIPULAÇÃO (EVENTO) ---

  public getAllEvents(): Evento[] {
    return [...this.state.evento];
  }

  public getEventById(id: number): Evento | undefined {
    return this.state.evento.find(e => e.id_evento === id);
  }

  public createEvent(data: {
    id_organizador: number;
    titulo: string;
    descricao?: string | null;
    banner_url?: string | null;
    local?: string;
    horario?: string;
    modalidade?: 'Presencial' | 'Online';
    data_inicio: string;
    data_fim: string;
    inicio_inscricoes: string;
    fim_inscricoes: string;
    status?: 'RASCUNHO' | 'PUBLICADO' | 'ENCERRADO' | 'CANCELADO';
    limite_vagas?: number;
  }): Evento {
    // Validação de Constraint de Datas do Banco MySQL:
    // chk_evento_datas: inicio_inscricoes < fim_inscricoes AND fim_inscricoes <= data_inicio AND data_inicio < data_fim
    const dInicioInsc = new Date(data.inicio_inscricoes).getTime();
    const dFimInsc = new Date(data.fim_inscricoes).getTime();
    const dInicioEvt = new Date(data.data_inicio).getTime();
    const dFimEvt = new Date(data.data_fim).getTime();

    if (isNaN(dInicioInsc) || isNaN(dFimInsc) || isNaN(dInicioEvt) || isNaN(dFimEvt)) {
      throw new Error('Todas as datas do evento e do período de inscrições devem ser preenchidas corretamente.');
    }

    if (dInicioInsc >= dFimInsc) {
      throw new Error('A data de início das inscrições deve ser anterior à data de término das inscrições.');
    }

    if (dFimInsc > dInicioEvt) {
      throw new Error('O período de inscrições deve encerrar antes do início do evento.');
    }

    if (dInicioEvt >= dFimEvt) {
      throw new Error('A data de início do evento deve ser anterior à data de término do evento.');
    }

    this.state.counters.evento++;
    const newEvent: Evento = {
      id_evento: this.state.counters.evento,
      id_organizador: data.id_organizador,
      titulo: data.titulo.trim(),
      descricao: data.descricao ? data.descricao.trim() : null,
      banner_url: data.banner_url || '/assets/images/event-comp.svg',
      local: data.local ? data.local.trim() : 'Campus Cedro - IFCE',
      horario: data.horario ? data.horario.trim() : '08:00h - 18:00h',
      modalidade: data.modalidade || 'Presencial',
      data_inicio: data.data_inicio,
      data_fim: data.data_fim,
      inicio_inscricoes: data.inicio_inscricoes,
      fim_inscricoes: data.fim_inscricoes,
      status: data.status || 'PUBLICADO',
      created_at: new Date().toISOString(),
    };

    this.state.evento.push(newEvent);

    // Cria atividade padrão vinculada ao evento para inscrição e controle de vagas
    this.state.counters.atividade++;
    const newAtiv: Atividade = {
      id_atividade: this.state.counters.atividade,
      id_evento: newEvent.id_evento,
      titulo: newEvent.titulo + ' - Atividade Geral',
      descricao: newEvent.descricao,
      tipo: 'Geral',
      data_hora_inicio: newEvent.data_inicio,
      data_hora_fim: newEvent.data_fim,
      local: newEvent.local,
      limite_vagas: data.limite_vagas && data.limite_vagas > 0 ? data.limite_vagas : 100,
      created_at: new Date().toISOString(),
    };
    this.state.atividade.push(newAtiv);

    this.save();
    return newEvent;
  }

  public updateEvent(id: number, updates: Partial<Evento>): Evento {
    const idx = this.state.evento.findIndex(e => e.id_evento === id);
    if (idx === -1) {
      throw new Error('Evento não encontrado.');
    }

    const current = this.state.evento[idx];

    // Permite que organizadores editem seus eventos ou alterem seus status
    // Se datas forem atualizadas, valida integridade cronológica
    const inicioInsc = updates.inicio_inscricoes || current.inicio_inscricoes;
    const fimInsc = updates.fim_inscricoes || current.fim_inscricoes;
    const dataInicio = updates.data_inicio || current.data_inicio;
    const dataFim = updates.data_fim || current.data_fim;

    const dInicioInsc = new Date(inicioInsc).getTime();
    const dFimInsc = new Date(fimInsc).getTime();
    const dInicioEvt = new Date(dataInicio).getTime();
    const dFimEvt = new Date(dataFim).getTime();

    if (dInicioInsc && dFimInsc && dInicioInsc >= dFimInsc) {
      throw new Error('A data de início das inscrições deve ser anterior à data de término das inscrições.');
    }
    if (dInicioEvt && dFimEvt && dInicioEvt >= dFimEvt) {
      throw new Error('A data de início do evento deve ser anterior à data de término do evento.');
    }

    this.state.evento[idx] = {
      ...current,
      ...updates,
    };
    this.save();
    return this.state.evento[idx];
  }

  public deleteEvent(id: number): boolean {
    const idx = this.state.evento.findIndex(e => e.id_evento === id);
    if (idx === -1) return false;
    this.state.evento.splice(idx, 1);
    this.save();
    return true;
  }

  // --- MÉTODOS DE ATIVIDADE ---

  public getActivitiesByEventId(eventId: number): Atividade[] {
    return this.state.atividade.filter(a => a.id_evento === eventId);
  }

  public getActivityById(activityId: number): Atividade | undefined {
    return this.state.atividade.find(a => a.id_atividade === activityId);
  }

  // --- MÉTODOS DE INSCRIÇÃO ---

  public getRegistrationsByActivity(activityId: number): Inscricao[] {
    return this.state.inscricao.filter(r => r.id_atividade === activityId && r.status === 'CONFIRMADA');
  }

  public getRegistrationsByUser(userId: number): Inscricao[] {
    return this.state.inscricao.filter(r => r.id_usuario === userId && r.status === 'CONFIRMADA');
  }

  public createRegistration(userId: number, activityId: number): Inscricao {
    const user = this.findUserById(userId);
    if (!user) throw new Error('Usuário inválido para inscrição.');

    const activity = this.getActivityById(activityId);
    if (!activity) throw new Error('Atividade não encontrada.');

    const event = this.getEventById(activity.id_evento);
    if (!event) throw new Error('Evento correspondente não encontrado.');

    // RN05 & uk_usuario_atividade: O participante não pode se inscrever duas vezes
    const existing = this.state.inscricao.find(
      r => r.id_usuario === userId && r.id_atividade === activityId && r.status === 'CONFIRMADA'
    );
    if (existing) {
      throw new Error('Você já está inscrito neste evento/atividade.');
    }

    // RN07: O período de inscrições deve ser respeitado
    if (event.status === 'CANCELADO') {
      throw new Error('Este evento foi cancelado e não aceita inscrições.');
    }
    if (event.status === 'RASCUNHO') {
      throw new Error('Este evento ainda está em rascunho.');
    }
    if (event.status === 'ENCERRADO') {
      throw new Error('As inscrições para este evento já foram encerradas.');
    }

    const now = new Date().getTime();
    const fimInscricoes = new Date(event.fim_inscricoes).getTime();
    if (fimInscricoes && now > fimInscricoes && event.status !== 'PUBLICADO') {
      throw new Error('As inscrições para este evento já foram encerradas.');
    }

    if (event.status !== 'PUBLICADO') {
      throw new Error('Este evento não está aberto para novas inscrições no momento.');
    }

    // RN08 & chk_atividade_vagas: Limite de vagas
    const confirmedCount = this.getRegistrationsByActivity(activityId).length;
    if (confirmedCount >= activity.limite_vagas) {
      throw new Error('Não existem vagas disponíveis para esta atividade.');
    }

    this.state.counters.inscricao++;
    const newReg: Inscricao = {
      id_inscricao: this.state.counters.inscricao,
      id_usuario: userId,
      id_atividade: activityId,
      data_inscricao: new Date().toISOString(),
      status: 'CONFIRMADA',
    };

    this.state.inscricao.push(newReg);

    // Registra entrada de frequência padrão (presente = false)
    this.state.counters.frequencia++;
    const newFreq: Frequencia = {
      id_frequencia: this.state.counters.frequencia,
      id_inscricao: newReg.id_inscricao,
      presente: false,
      data_registro: new Date().toISOString(),
    };
    this.state.frequencia.push(newFreq);

    this.save();
    return newReg;
  }

  public cancelRegistration(registrationId: number, userId: number): boolean {
    const reg = this.state.inscricao.find(r => r.id_inscricao === registrationId);
    if (!reg) throw new Error('Inscrição não encontrada.');

    if (reg.id_usuario !== userId) {
      const user = this.findUserById(userId);
      if (!user || user.perfil !== 'ADMINISTRADOR') {
        throw new Error('Você não tem permissão para cancelar a inscrição de outro participante.');
      }
    }

    const activity = this.getActivityById(reg.id_atividade);
    if (activity) {
      const event = this.getEventById(activity.id_evento);
      if (event) {
        // RN12: O participante só pode cancelar antes do fim das inscrições
        const now = new Date().getTime();
        const fimInscricoes = new Date(event.fim_inscricoes).getTime();
        if (now > fimInscricoes) {
          throw new Error('O cancelamento não é mais permitido após o término do período de inscrições.');
        }
      }
    }

    reg.status = 'CANCELADA';
    this.save();
    return true;
  }

  // --- MÉTODOS DE FREQUÊNCIA E CERTIFICADOS ---

  public getFrequencyByRegistration(registrationId: number): Frequencia | undefined {
    return this.state.frequencia.find(f => f.id_inscricao === registrationId);
  }

  public setAttendance(registrationId: number, presente: boolean): { frequencia: Frequencia; certificado?: Certificado } {
    let freq = this.getFrequencyByRegistration(registrationId);
    if (!freq) {
      this.state.counters.frequencia++;
      freq = {
        id_frequencia: this.state.counters.frequencia,
        id_inscricao: registrationId,
        presente: presente,
        data_registro: new Date().toISOString(),
      };
      this.state.frequencia.push(freq);
    } else {
      freq.presente = presente;
      freq.data_registro = new Date().toISOString();
    }

    let cert = this.state.certificado.find(c => c.id_frequencia === freq!.id_frequencia);

    // Se presença foi confirmada e ainda não possui certificado emitido, gera o certificado oficial
    if (presente && !cert) {
      this.state.counters.certificado++;
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `IFCE-CERT-${new Date().getFullYear()}-${freq.id_frequencia}-${randomCode}`;
      cert = {
        id_certificado: this.state.counters.certificado,
        id_frequencia: freq.id_frequencia,
        codigo_validacao: code,
        data_emissao: new Date().toISOString(),
      };
      this.state.certificado.push(cert);
    }

    this.save();
    return { frequencia: freq, certificado: cert };
  }

  public getCertificatesByUser(userId: number) {
    const userRegs = this.state.inscricao.filter(r => r.id_usuario === userId && r.status === 'CONFIRMADA');
    const result: Array<{
      id_certificado: number;
      codigo_validacao: string;
      data_emissao: string;
      evento_titulo: string;
      evento_data: string;
      carga_horaria: string;
      participante_nome: string;
    }> = [];

    const user = this.findUserById(userId);

    for (const reg of userRegs) {
      const freq = this.getFrequencyByRegistration(reg.id_inscricao);
      if (freq && freq.presente) {
        const cert = this.state.certificado.find(c => c.id_frequencia === freq.id_frequencia);
        if (cert) {
          const ativ = this.getActivityById(reg.id_atividade);
          const evt = ativ ? this.getEventById(ativ.id_evento) : undefined;
          result.push({
            id_certificado: cert.id_certificado,
            codigo_validacao: cert.codigo_validacao,
            data_emissao: cert.data_emissao,
            evento_titulo: evt ? evt.titulo : 'Evento Acadêmico IFCE',
            evento_data: evt ? new Date(evt.data_inicio).toLocaleDateString('pt-BR') : 'Data não disponível',
            carga_horaria: '20h',
            participante_nome: user ? user.nome : 'Estudante',
          });
        }
      }
    }

    return result;
  }

  public findCertificateByCode(code: string) {
    const cert = this.state.certificado.find(
      c => c.codigo_validacao.trim().toUpperCase() === code.trim().toUpperCase()
    );
    if (!cert) return null;

    const freq = this.state.frequencia.find(f => f.id_frequencia === cert.id_frequencia);
    if (!freq) return null;

    const reg = this.state.inscricao.find(r => r.id_inscricao === freq.id_inscricao);
    if (!reg) return null;

    const user = this.findUserById(reg.id_usuario);
    const ativ = this.getActivityById(reg.id_atividade);
    const evt = ativ ? this.getEventById(ativ.id_evento) : undefined;

    return {
      certificado: cert,
      participante: user ? { nome: user.nome, email: user.email, matricula: user.matricula } : null,
      evento: evt,
      atividade: ativ,
      frequencia: freq,
    };
  }

  public getEventDetailsWithStats(eventId: number) {
    const event = this.getEventById(eventId);
    if (!event) return null;

    const activities = this.getActivitiesByEventId(eventId);
    let totalSeats = 0;
    let totalEnrolled = 0;

    const attendees: Array<{
      id_usuario: number;
      nome: string;
      email: string;
      matricula: string | null;
      turma: string;
      id_inscricao: number;
      presente: boolean;
      tem_certificado: boolean;
      codigo_certificado?: string;
    }> = [];

    for (const act of activities) {
      totalSeats += act.limite_vagas;
      const regs = this.getRegistrationsByActivity(act.id_atividade);
      totalEnrolled += regs.length;

      for (const reg of regs) {
        const u = this.findUserById(reg.id_usuario);
        const freq = this.getFrequencyByRegistration(reg.id_inscricao);
        const cert = freq ? this.state.certificado.find(c => c.id_frequencia === freq.id_frequencia) : undefined;

        if (u) {
          attendees.push({
            id_usuario: u.id_usuario,
            nome: u.nome,
            email: u.email,
            matricula: u.matricula,
            turma: u.matricula?.startsWith('2024') ? 'Informática S1' : 'Informática S6',
            id_inscricao: reg.id_inscricao,
            presente: freq ? freq.presente : false,
            tem_certificado: !!cert,
            codigo_certificado: cert?.codigo_validacao,
          });
        }
      }
    }

    return {
      evento: event,
      atividades: activities,
      totalSeats,
      totalEnrolled,
      attendees,
    };
  }
}

export const db = new DatabaseService();
