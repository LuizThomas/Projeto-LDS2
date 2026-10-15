export type PerfilUsuario = 'ADMINISTRADOR' | 'PROFESSOR' | 'PARTICIPANTE';

export type StatusConta = 'ATIVO' | 'PENDENTE' | 'RECUSADO';

export type StatusEvento = 'RASCUNHO' | 'PUBLICADO' | 'ENCERRADO' | 'CANCELADO';

export type StatusInscricao = 'CONFIRMADA' | 'CANCELADA';

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  senha_hash: string;
  matricula?: string | null;
  perfil: PerfilUsuario;
  status_conta?: StatusConta;
  foto_perfil?: string | null;
  telefone?: string | null;
  materias?: string | null;
  created_at: string;
}

export interface Evento {
  id_evento: number;
  id_organizador: number;
  organizador_nome?: string;
  titulo: string;
  descricao: string;
  banner_url?: string | null;
  data_inicio: string; // ISO string or YYYY-MM-DD HH:mm:ss
  data_fim: string;
  inicio_inscricoes: string;
  fim_inscricoes: string;
  status: StatusEvento;
  local: string;
  modalidade: 'Presencial' | 'Online';
  horario_formatado?: string;
  data_formatada?: string;
  created_at: string;
  inscritos_count?: number;
}

export interface Atividade {
  id_atividade: number;
  id_evento: number;
  titulo: string;
  descricao?: string;
  tipo: string; // 'Palestra', 'Minicurso', 'Workshop', 'Mesa Redonda', 'Apresentação de Artigos'
  data_hora_inicio: string;
  data_hora_fim: string;
  local: string;
  limite_vagas: number;
  vagas_ocupadas?: number;
  carga_horaria?: number; // em horas (ex: 4, 8, 20)
  created_at: string;
}

export interface Inscricao {
  id_inscricao: number;
  id_usuario: number;
  id_atividade: number;
  data_inscricao: string;
  status: StatusInscricao;
  // Joins para visualização
  usuario_nome?: string;
  usuario_email?: string;
  usuario_matricula?: string;
  usuario_turma?: string;
  usuario_perfil?: PerfilUsuario;
  atividade_titulo?: string;
  evento_titulo?: string;
  evento_id?: number;
  evento_local?: string;
  evento_modalidade?: 'Presencial' | 'Online';
  evento_data?: string;
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
  status_aprovacao?: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
  // Metadados informativos para renderização do certificado
  participante_nome?: string;
  participante_matricula?: string;
  participante_cpf?: string;
  evento_titulo?: string;
  atividade_titulo?: string;
  organizador_nome?: string;
  carga_horaria?: number;
  data_evento?: string;
}

export interface SolicitacaoInscricaoModeracao {
  id_inscricao: number;
  participante_nome: string;
  data_solicitacao: string;
  condicao: PerfilUsuario;
  evento_titulo: string;
  status_moderacao: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
}

export interface SolicitacaoCertificadoModeracao {
  id_certificado: number;
  evento_titulo: string;
  organizador_nome: string;
  data_solicitacao: string;
  status_moderacao: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
  participante_nome: string;
}
