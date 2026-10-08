/**
 * IFCE Iventus - Banco de Dados Mockado
 * Dados realistas baseados na estrutura institucional do IFCE e nas telas do Figma
 */

export const INITIAL_DATA = {
  users: [
    {
      id: 'usr_1',
      name: 'Lais Holanda',
      email: 'lais.holanda@aluno.ifce.edu.br',
      role: 'participante', // 'participante' | 'professor' | 'administrador'
      matricula: '2022104508',
      curso: 'Engenharia da Computação',
      campus: 'Campus Fortaleza',
      telefone: '(85) 98844-2211',
      avatar: '/assets/images/avatar-lais.svg',
      bio: 'Estudante entusiasta de inteligência artificial e desenvolvimento web.'
    },
    {
      id: 'usr_2',
      name: 'Prof. Roberto Alves',
      email: 'roberto.alves@ifce.edu.br',
      role: 'professor',
      matricula: 'SIAPE 1984210',
      curso: 'Depto. de Telemática',
      campus: 'Campus Fortaleza',
      telefone: '(85) 99123-4567',
      avatar: '/assets/images/avatar-prof.svg',
      bio: 'Doutor em Ciência da Computação, pesquisador nas áreas de Redes e IA.'
    },
    {
      id: 'usr_3',
      name: 'Carlos Menezes',
      email: 'carlos.gestao@ifce.edu.br',
      role: 'administrador',
      matricula: 'SIAPE 3421990',
      curso: 'Coordenação de Extensão e Relações Comunitárias',
      campus: 'Reitoria IFCE',
      telefone: '(85) 98765-4321',
      avatar: '/assets/images/avatar-admin.svg',
      bio: 'Gestor institucional responsável pela aprovação de eventos e certificações.'
    }
  ],

  events: [
    {
      id: 'evt_1',
      title: 'Semana da Computação 2024',
      category: 'Tecnologia',
      dateStart: '2024-10-15',
      dateEnd: '2024-10-18',
      datesLabel: '15 a 18 de Outubro de 2024',
      timeLabel: '08:00h - 18:00h',
      location: 'Auditório Central - Campus Fortaleza',
      workload: '40 horas',
      workloadHours: 40,
      totalSeats: 150,
      occupiedSeats: 124,
      status: 'publicado', // 'publicado' | 'em_andamento' | 'rascunho' | 'encerrado'
      organizerId: 'usr_2',
      organizerName: 'Prof. Roberto Alves',
      cover: '/assets/images/event-comp.svg',
      description: 'A Semana da Computação do IFCE reúne grandes referências acadêmicas e de mercado em palestras, maratonas de programação e minicursos práticos focados em computação aplicada, sistemas distribuídos e inovação digital.'
    },
    {
      id: 'evt_2',
      title: 'Workshop de Inteligência Artificial',
      category: 'Inteligência Artificial',
      dateStart: '2024-11-05',
      dateEnd: '2024-11-06',
      datesLabel: '05 e 06 de Novembro de 2024',
      timeLabel: '14:00h - 18:00h',
      location: 'Laboratório de Redes - Bloco C',
      workload: '16 horas',
      workloadHours: 16,
      totalSeats: 40,
      occupiedSeats: 40,
      status: 'em_andamento',
      organizerId: 'usr_2',
      organizerName: 'Prof. Roberto Alves',
      cover: '/assets/images/event-ai.svg',
      description: 'Treinamento intensivo prático abordando fundamentos de Aprendizado de Máquina, Redes Neurais Convolucionais e aplicações modernas de Processamento de Linguagem Natural com bibliotecas Python.'
    },
    {
      id: 'evt_3',
      title: 'Mostra Científica IFCE',
      category: 'Ciência e Pesquisa',
      dateStart: '2024-11-20',
      dateEnd: '2024-11-22',
      datesLabel: '20 a 22 de Novembro de 2024',
      timeLabel: '09:00h - 17:00h',
      location: 'Ginásio Poliesportivo e Salas 1 a 6',
      workload: '30 horas',
      workloadHours: 30,
      totalSeats: 300,
      occupiedSeats: 215,
      status: 'publicado',
      organizerId: 'usr_2',
      organizerName: 'Prof. Roberto Alves',
      cover: '/assets/images/event-science.svg',
      description: 'Apresentação de projetos de iniciação científica, extensão e inovação desenvolvidos por alunos do ensino técnico, superior e pós-graduação de todos os campi do Ceará.'
    },
    {
      id: 'evt_4',
      title: 'Robótica Aplicada à Automação',
      category: 'Robótica',
      dateStart: '2024-12-02',
      dateEnd: '2024-12-04',
      datesLabel: '02 a 04 de Dezembro de 2024',
      timeLabel: '13:30h - 17:30h',
      location: 'Laboratório de Mecatrônica',
      workload: '20 horas',
      workloadHours: 20,
      totalSeats: 30,
      occupiedSeats: 18,
      status: 'publicado',
      organizerId: 'usr_2',
      organizerName: 'Prof. Roberto Alves',
      cover: '/assets/images/event-robotics.svg',
      description: 'Minicurso focado em robôs manipuladores industriais, microcontroladores ESP32 e integração com sensores IoT para automação inteligente em ambientes fabris.'
    },
    {
      id: 'evt_5',
      title: 'Simpósio de Energias Renováveis (Rascunho)',
      category: 'Engenharia',
      dateStart: '2025-01-15',
      dateEnd: '2025-01-16',
      datesLabel: '15 e 16 de Janeiro de 2025',
      timeLabel: '08:30h - 16:30h',
      location: 'Auditório Bezerra de Menezes',
      workload: '16 horas',
      workloadHours: 16,
      totalSeats: 100,
      occupiedSeats: 0,
      status: 'rascunho',
      organizerId: 'usr_2',
      organizerName: 'Prof. Roberto Alves',
      cover: '/assets/images/event-science.svg',
      description: 'Evento em estruturação sobre hidrogênio verde, energia solar e matrizes limpas no Nordeste brasileiro.'
    }
  ],

  // Inscrições dos alunos
  registrations: [
    {
      id: 'reg_1',
      eventId: 'evt_1',
      eventTitle: 'Semana da Computação 2024',
      userId: 'usr_1',
      userName: 'Lais Holanda',
      userEmail: 'lais.holanda@aluno.ifce.edu.br',
      matricula: '2022104508',
      curso: 'Engenharia da Computação',
      registrationDate: '2024-09-10',
      status: 'confirmada', // 'confirmada' | 'pendente' | 'cancelada'
      attended: true,
      ticketCode: 'IFCE-SC24-78901',
      certificateIssued: true
    },
    {
      id: 'reg_2',
      eventId: 'evt_2',
      eventTitle: 'Workshop de Inteligência Artificial',
      userId: 'usr_1',
      userName: 'Lais Holanda',
      userEmail: 'lais.holanda@aluno.ifce.edu.br',
      matricula: '2022104508',
      curso: 'Engenharia da Computação',
      registrationDate: '2024-09-15',
      status: 'confirmada',
      attended: true,
      ticketCode: 'IFCE-WIA24-44312',
      certificateIssued: true
    },
    {
      id: 'reg_3',
      eventId: 'evt_3',
      eventTitle: 'Mostra Científica IFCE',
      userId: 'usr_1',
      userName: 'Lais Holanda',
      userEmail: 'lais.holanda@aluno.ifce.edu.br',
      matricula: '2022104508',
      curso: 'Engenharia da Computação',
      registrationDate: '2024-09-20',
      status: 'confirmada',
      attended: false,
      ticketCode: 'IFCE-MC24-99823',
      certificateIssued: false
    },
    // Outros alunos no evento 'Semana da Computação 2024' para o Professor gerenciar presença
    {
      id: 'reg_4',
      eventId: 'evt_1',
      eventTitle: 'Semana da Computação 2024',
      userId: 'usr_4',
      userName: 'Ana Beatriz Souza',
      userEmail: 'ana.souza@aluno.ifce.edu.br',
      matricula: '2022103490',
      curso: 'Informática IFCE',
      registrationDate: '2024-09-12',
      status: 'confirmada',
      attended: true,
      ticketCode: 'IFCE-SC24-11029',
      certificateIssued: true
    },
    {
      id: 'reg_5',
      eventId: 'evt_1',
      eventTitle: 'Semana da Computação 2024',
      userId: 'usr_5',
      userName: 'Danilo Ramos',
      userEmail: 'danilo.ramos@aluno.ifce.edu.br',
      matricula: '2021105411',
      curso: 'Redes de Computadores',
      registrationDate: '2024-09-14',
      status: 'confirmada',
      attended: true,
      ticketCode: 'IFCE-SC24-55421',
      certificateIssued: false
    },
    {
      id: 'reg_6',
      eventId: 'evt_1',
      eventTitle: 'Semana da Computação 2024',
      userId: 'usr_6',
      userName: 'Beatriz Torres Mattos',
      userEmail: 'beatriz.mattos@aluno.ifce.edu.br',
      matricula: '2023101188',
      curso: 'Informática IFCE',
      registrationDate: '2024-09-15',
      status: 'confirmada',
      attended: false,
      ticketCode: 'IFCE-SC24-66321',
      certificateIssued: false
    },
    {
      id: 'reg_7',
      eventId: 'evt_1',
      eventTitle: 'Semana da Computação 2024',
      userId: 'usr_7',
      userName: 'Gabriel de Sá Silva',
      userEmail: 'gabriel.sa@aluno.ifce.edu.br',
      matricula: '2022108842',
      curso: 'Engenharia da Computação',
      registrationDate: '2024-09-16',
      status: 'confirmada',
      attended: true,
      ticketCode: 'IFCE-SC24-33129',
      certificateIssued: true
    },
    {
      id: 'reg_8',
      eventId: 'evt_1',
      eventTitle: 'Semana da Computação 2024',
      userId: 'usr_8',
      userName: 'Matheus Oliveira Ferreira',
      userEmail: 'matheus.ferreira@aluno.ifce.edu.br',
      matricula: '2021109923',
      curso: 'Informática IFCE',
      registrationDate: '2024-09-16',
      status: 'confirmada',
      attended: false,
      ticketCode: 'IFCE-SC24-77412',
      certificateIssued: false
    }
  ],

  // Solicitações pendentes de inscrição para o Administrador aprovar
  pendingApplications: [
    {
      id: 'app_1',
      applicantName: 'Felipe Santana Rocha',
      applicantEmail: 'felipe.rocha@ifce.edu.br',
      institutionRole: 'Aluno Externo / UFC',
      eventTitle: 'Workshop de Inteligência Artificial',
      eventId: 'evt_2',
      requestDate: '2024-09-28',
      status: 'pendente',
      reason: 'Pesquisador em Visão Computacional solicitando vaga suplementar.'
    },
    {
      id: 'app_2',
      applicantName: 'Mariana Duarte Gomes',
      applicantEmail: 'mariana.duarte@aluno.ifce.edu.br',
      institutionRole: 'Discente - Campus Quixadá',
      eventTitle: 'Semana da Computação 2024',
      eventId: 'evt_1',
      requestDate: '2024-09-29',
      status: 'pendente',
      reason: 'Solicitação de ajuda de custo e inscrição prioritária com apresentação de trabalho.'
    },
    {
      id: 'app_3',
      applicantName: 'Lucas Albuquerque Coelho',
      applicantEmail: 'lucas.coelho@aluno.ifce.edu.br',
      institutionRole: 'Discente - Campus Maracanaú',
      eventTitle: 'Robótica Aplicada à Automação',
      eventId: 'evt_4',
      requestDate: '2024-09-30',
      status: 'pendente',
      reason: 'Interesse em projeto conjunto de extensão com o campus Fortaleza.'
    }
  ],

  // Certificados emitidos
  certificates: [
    {
      id: 'cert_1',
      eventId: 'evt_1',
      eventTitle: 'Semana da Computação 2024',
      recipientId: 'usr_1',
      recipientName: 'Lais Holanda',
      recipientMatricula: '2022104508',
      workload: '40 horas',
      issueDate: '2024-10-19',
      validationCode: 'IFCE-CERT-2024-8842-X',
      status: 'emitido', // 'emitido' | 'aprovado' | 'pendente_aprovacao'
      signedBy: 'Prof. Roberto Alves / IFCE Coordenação'
    },
    {
      id: 'cert_2',
      eventId: 'evt_2',
      eventTitle: 'Workshop de Inteligência Artificial',
      recipientId: 'usr_1',
      recipientName: 'Lais Holanda',
      recipientMatricula: '2022104508',
      workload: '16 horas',
      issueDate: '2024-11-07',
      validationCode: 'IFCE-CERT-2024-3391-B',
      status: 'emitido',
      signedBy: 'Prof. Roberto Alves / IFCE Coordenação'
    }
  ]
};
