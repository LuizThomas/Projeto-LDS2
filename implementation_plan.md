# IFCE Iventus - Refinamento da Logo e Moderação de Usuários pelo Administrador

Este plano estabelece a evolução do sistema IFCE Iventus para corrigir a redundância visual da logomarca na tela de login (exibindo unicamente o ícone geométrico "IV" do IFCE) e estruturar o fluxo de governança com moderação prévia obrigatória de novos usuários pelo Administrador.

## Decisões Críticas e Alinhamento

> [!IMPORTANT]
> **Decisões confirmadas com o usuário:**
> - **Identidade da Logo**: Na lateral esquerda da tela de login, será exibido exclusivamente o emblema gráfico "IV" (quadrados verdes com o ponto superior vermelho) centralizado e proeminente, eliminando o texto duplicado "iventus". O título "IFCE Iventus" virá logo abaixo de forma limpa e harmônica.
> - **Moderação Universal de Cadastros**: Todos os novos cadastros (Participante, Professor ou Administrador) passarão a ingressar no sistema com status `PENDENTE`. O acesso fica bloqueado até que um Administrador aprove expressamente a solicitação no painel.

---

## 1. Visão Geral e Conceito Central

- **O que faz**:
  1. **Ajuste de Identidade Visual**: Limpa o visual do layout split-screen da autenticação, garantindo que o símbolo gráfico icônico "IV" seja o protagonista sem cacofonia ou repetição textual.
  2. **Moderação de Acesso (RBAC)**: Ao submeter o formulário de cadastro, o usuário é direcionado para uma tela/notificação institucional informando que sua conta foi registrada com sucesso e aguarda homologação de um administrador do campus.
  3. **Painel do Administrador**: Uma nova interface dedicada ("Aprovação de Usuários" / "Solicitações de Cadastro") no menu lateral do Administrador, contendo listagem com nome, e-mail, perfil solicitado, data de criação e ações imediatas de "Aprovar" (verde) e "Recusar" (vermelho).
  4. **Proteção no Login**: Caso o usuário tente entrar antes da homologação, recebe feedback descritivo ("Seu cadastro está pendente de aprovação por um administrador"). Se for recusado, é informado com segurança.

- **Público-Alvo**: Novos participantes/estudantes, novos docentes e Administradores do IFCE responsáveis pela governança de acesso ao ecossistema acadêmico.

---

## 2. Experiência do Usuário e Design Visual

### Fluxos Principais

1. **Fluxo de Cadastro do Usuário**:
   - O usuário preenche nome, e-mail, perfil, senha e confirmação, aceitando os Termos de Uso.
   - Ao clicar em "Cadastrar", o sistema registra a conta com status `PENDENTE`.
   - Uma tela de sucesso institucional orienta: *"Cadastro realizado com sucesso! Sua solicitação foi enviada aos administradores do IFCE. Aguarde a confirmação institucional para efetuar login."*
   - Opção para "Voltar ao Login".

2. **Fluxo de Tentativa de Login de Conta Não Aprovada**:
   - Usuário digita suas credenciais na tela de login.
   - O sistema valida a senha, mas verifica o status da conta.
   - Se `PENDENTE`: Alerta amigável em tom âmbar/azul informando que a conta ainda aguarda liberação.
   - Se `RECUSADO`: Alerta explicativo em vermelho.
   - Se `ATIVO`: Acesso imediato ao painel conforme perfil.

3. **Fluxo de Moderação do Administrador**:
   - Administrador acessa a aba "Usuários" / "Aprovação de Cadastros" na barra lateral.
   - Badge numérico indica cadastros pendentes em tempo real.
   - Tabela com filtros (Pendentes, Aprovados, Recusados) e botões de ação rápida:
     - **Aprovar** (`#15803d` / verde): Altera status para `ATIVO` e libera login imediato.
     - **Recusar** (`#b91c1c` / vermelho): Altera status para `RECUSADO`.

---

## 3. Decisões de Produto & Arquitetura

1. **Separação de Código e Compatibilidade Vercel / Render**:
   - Tipagem TypeScript estrita com extensão do enum/status do usuário: `'ATIVO' | 'PENDENTE' | 'RECUSADO'`.
   - Modificações isoladas em camadas:
     - `src/types/index.ts`: inclusão de `status_conta` no modelo `Usuario`.
     - `src/services/store.ts`: lógica de validação no login, cadastro pendente e métodos `moderarUsuario(id, decisao)`.
     - `src/components/common/Logo.tsx`: suporte à propriedade `showText={false}` para renderizar somente o emblema "IV".
     - `src/components/auth/RegisterView.tsx` & `LoginView.tsx`: telas e mensagens atualizadas.
     - `src/components/views/AdminUsersView.tsx`: novo componente desacoplado para a moderação administrativa.
     - `database/schema.sql`: campo `status_conta ENUM('PENDENTE', 'ATIVO', 'RECUSADO') DEFAULT 'PENDENTE'` atualizado.

---

## 4. Diagrama da Arquitetura & Fluxo de Dados

```
┌─────────────────┐       Submete Cadastro      ┌────────────────────────┐
│  RegisterView   │ ──────────────────────────> │    store.register()    │
│                 │                             │ (status = 'PENDENTE')  │
└─────────────────┘                             └──────────┬─────────────┘
                                                           │
        ┌──────────────────────────────────────────────────┴──────────────────────────────────────────────────┐
        ▼                                                                                                     ▼
┌──────────────────────────────┐                                                              ┌──────────────────────────────┐
│ Tela de Sucesso Institucional│                                                              │      Painel Admin            │
│ "Aguarde confirmação do ADM" │                                                              │    AdminUsersView.tsx        │
└──────────────────────────────┘                                                              └──────────────┬───────────────┘
                                                                                                             │
                                                                                        Aprovar / Recusar    │
                                                                                                             ▼
┌──────────────────────────────┐                    Valida status                     ┌──────────────────────────────┐
│          LoginView           │ ◄─────────────────────────────────────────────────── │      status = 'ATIVO'        │
│    (Emblema "IV" limpo)      │                                                      └──────────────────────────────┘
└──────────────────────────────┘
```
