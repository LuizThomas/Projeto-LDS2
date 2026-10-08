# IFCE Iventus - Plataforma de Gestão de Eventos Científicos

Sistema web completo desenvolvido para o **Trabalho de Conclusão de Curso (TCC)** da disciplina de **Laboratório de Desenvolvimento de Software (LDS)** do curso Técnico Integrado em Informática do **Instituto Federal de Educação, Ciência e Tecnologia do Ceará (IFCE) — Campus Cedro**.

- **Professor Orientador:** Saulo Lima Bezerra
- **Turma:** S6 Integrado em Informática
- **Equipe:** Luiz Thomas, Emerson Pereira, Carlos Eduardo, Kauan Torres

---

## 🏛️ Sobre o Projeto

O **IFCE Iventus** centraliza e automatiza a gestão dos eventos científicos e acadêmicos do campus, resolvendo os problemas de retrabalho com planilhas manuais e garantindo confiabilidade no controle de presenças e na emissão de certificados acadêmicos digitais.

### Principais Funcionalidades:
1. **Autenticação Real:** Login rigoroso com validação de credenciais via `bcryptjs`, cadastro seguro e recuperação de senha.
2. **Perfis de Acesso (RBAC):**
   - **PARTICIPANTE (Aluno):** Consulta catálogo de eventos, realiza inscrições, visualiza QR code/comprovante, cancela inscrições no prazo e emite certificados oficiais em PDF.
   - **PROFESSOR (Organizador):** Cria eventos (modal verde), edita eventos próprios (modal amarelo), altera status (Publicado, Ativo, Encerrado, Cancelado, Rascunho), gerencia frequência com checklist interativo e emite/importa certificados em PDF.
   - **ADMINISTRADOR:** Gestão institucional, relatórios gerenciais e exportação de dados.
3. **Catálogo & Inscrições:** Controle estrito de vagas, prevenção de inscrições duplicadas e respeito aos prazos de início e encerramento.
4. **Certificados Acadêmicos Digitais:** Geração e download de certificados oficiais em PDF com brasão institucional, código de autenticidade único e validação pública.
5. **Uploads Reais:** Upload funcional de banners de eventos e fotos de perfil.
6. **Relatórios Gerenciais:** Exportação da lista de alunos inscritos em planilha Excel (CSV formatado) e PDF.

---

## 🗄️ Modelo Físico do Banco de Dados (MySQL)

O sistema utiliza o banco de dados oficial **`db_eventos_ifce`** com as seguintes tabelas e regras de integridade relacional:

- **`usuario`:** Dados do participante/professor/administrador, foto de perfil, telefone, matérias e senha com hash seguro.
- **`evento`:** Título, organizador, banner, local, datas e constraints de período (`chk_evento_datas`: `inicio_inscricoes < fim_inscricoes <= data_inicio < data_fim`).
- **`atividade`:** Atividades vinculadas ao evento com limite de vagas e horários.
- **`inscricao`:** Vínculo usuário-atividade com garantia de inscrição única (`uk_usuario_atividade`).
- **`frequencia`:** Registro de presença por atividade.
- **`certificado`:** Código de validação único vinculado à presença confirmada do aluno.

---

## 👥 Credenciais para Teste e Avaliação

| Perfil | Nome | E-mail | Senha |
|---|---|---|---|
| **Participante** | Luiz Thomas Marte Moreira | `luiz.thomas@gmail.com` | `alunoifce` |
| **Professor** | Saulo Bezerra | `saulo_bezerra@gmail.com` | `professor123` |
| **Administrador** | Administrador IFCE | `admin@ifce.edu.br` | `admin123` |

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 22 ou superior
- npm

### Instalação
```bash
npm install
```

### Execução em Desenvolvimento
```bash
npm run dev
```
O sistema iniciará o servidor full-stack Express + Vite na porta **3000** (`http://localhost:3000`).

### Build de Produção
```bash
npm run build
npm start
```

---

## 🌐 Implantação (Deploy)

### Render (Backend & Full-Stack)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node server.ts` (ou `npm start`)
- **Variáveis de Ambiente:**
  - `PORT`: 3000 (ou atribuída dinamicamente pelo Render)
  - `JWT_SECRET`: chave secreta
  - `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` ou `MYSQL_URL`: credenciais da sua instância MySQL.

### Vercel (Frontend)
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: `Vite`
