
# Projeto 10 Lista de Tarefas

Aplicação web moderna e responsiva de gerenciamento de tarefas (To-Do List) com autenticação, categorias personalizadas, análises com gráficos, calendário e gamificação.

---

## Sumário

- [Últimas Alterações](#%C3%BAltimas-altera%C3%A7%C3%B5es)
- [Stack Tecnológica](#stack-tecnol%C3%B3gica)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Mapa de Rotas](#mapa-de-rotas)
- [Modelo de Dados](#modelo-de-dados)
- [Fluxo de Dados](#fluxo-de-dados)
- [Componentes](#componentes)
- [Serviços](#servi%C3%A7os)
- [Gamificação](#gamifica%C3%A7%C3%A3o)
- [Como Rodar](#como-rodar)
- [Build de Produção](#build-de-produ%C3%A7%C3%A3o)
- [PWA](#pwa)
- [Comparação: v1 (backup) vs v2 (app_build)](#compara%C3%A7%C3%A3o-v1-backup-vs-v2-app_build)
- [Melhorias Futuras](#melhorias-futuras)

---

## Últimas Alterações

| Tipo | Descrição |
|------|-----------|
| 🗑️ Adicionado | **Lixeira**: soft delete com 30 dias de retenção, aba em Configurações com restaurar/excluir/esvaziar |
| ✨ Adicionado | **Dias úteis (seg-sex)**: nova opção de repetição que avança apenas em dias úteis, pulando sábados e domingos |
| ✨ Adicionado | **Filtro "Sem Data"**: novo filtro na FilterBar + badge "Sem prazo" no TaskCard + card "Sem Prazo" no Dashboard substituindo "Foco Hoje" |
| 🔧 Melhorado | **Agrupamento por categoria**: lista de tarefas agrupada por categoria com cabeçalhos coloridos, pendentes primeiro, concluídas depois |
| 🔧 Melhorado | **Subtarefas movidas**: reposicionadas para logo abaixo da descrição no formulário de tarefas |
| 🔧 Melhorado | **FilterBar unificada**: todos os filtros + tags em um único dropdown substituindo os 9 botões inline |
| 🔧 Melhorado | **Dashboard simplificado**: TodayWidget sem stats redundantes (concluídas/pendentes/atrasadas), mantendo apenas saudação + data |
| 🔧 Melhorado | **Gráfico de prioridade**: pizza substituída por barras horizontais, eliminando truncamento das labels |
| 🔧 Renomeado | **"Template" → "Tarefa Modelo"**: UI renomeada em todos os lugares — botões, prompts, títulos em Configurações |
| ❌ Removido | **KanbanBoard**: visualização kanban com drag-and-drop removida |
| ❌ Removido | **Stat card "Foco Hoje"**: substituído pelo card "Sem Prazo" no Dashboard |
| ✨ Adicionado | **Horário nas datas**: coluna `due_time` (TIME) no Supabase, input `type="time"` no TaskForm, exibição nos cards/detalhes/calendário, `isOverdue`/`isDueToday` com suporte a horário, `formatDateTime` |
| ✨ Adicionado | **Horário nas datas**: coluna `due_time` (TIME) no Supabase, input `type="time"` no TaskForm, exibição nos cards/detalhes/calendário, `isOverdue`/`isDueToday` com suporte a horário, `formatDateTime` |
| ✨ Adicionado | **Hábitos**: tabelas `habits`/`habit_logs` no Supabase, página `/habitos` com filtros, HabitCard (checkbox + streak + progresso), HabitForm (frequência diária/semanal/personalizada), widget no Dashboard, 3 conquistas de hábitos |
| ✨ Adicionado | **Tags e Labels**: tabelas `tags`/`task_tags` (SQL), CRUD em Configurações, `TagInput` com autocomplete + chips coloridos no TaskForm, exibição no TaskCard/TaskDetailModal, **filtro por tags** no FilterBar |
| ✨ Adicionado | **Modo escuro (Dark Mode)**: toggle Lua/Sol na Sidebar, `dark:` variants em todos os componentes (6 blocos: infra, páginas, cards, modais, widgets, utilitários), preferência persistida em localStorage |
| ✨ Adicionado | **Pomodoro Timer Fase 2**: gamificação (`totalPomodoros`, conquista "100 Pomodoros"), 5º stat card "Foco Hoje" no Dashboard, gráfico "Pomodoros por Dia" na página Análises |
| ✨ Adicionado | **Pomodoro Timer Fase 1**: tabela `pomodoros` no Supabase, `PomodoroContext` global (setInterval, Web Audio API beep, ciclo foco/pausa curta/pausa longa), `PomodoroWidget` flutuante (bottom-6 right-6, SVG progress ring, colapsável), `PomodoroFullScreen` (z-100, ESC sai Espaço pausa), botão "Focar" no TaskCard/TaskDetailModal, configurações de duração em Settings |
| ✨ Adicionado | **TaskDetailModal**: modal com detalhes completos da tarefa, subtarefas com checkbox inline, botões editar/excluir/focar |
| ✨ Adicionado | **Subtarefas**: coluna `parent_id` + `ON DELETE CASCADE`, campo no TaskForm, exibição aninhada no TaskCard ("X/Y concluídas" + "Ver detalhes") |
| ✨ Adicionado | **Tarefas recorrentes**: coluna `repeat_rule` (diária/semanal/mensal/anual), seletor no TaskForm, clone automático ao concluir via `getNextRecurringDate` |
| ✨ Adicionado | Descrição/observações (textarea) e **reordenação por drag** (coluna `position` + @dnd-kit/sortable) |
| ✨ Adicionado | **Editar tarefa**: ícone de lápis no hover do TaskCard, TaskForm preenchido para edição |
| ✨ Adicionado | Botão **"Nova Tarefa"** no Dashboard entre saudação e stats |
| ✨ Adicionado | Opção de **dispensar notificações** individualmente (localStorage) |
| ✨ Adicionado | Seção **"Zona de Perigo"** com exclusão de conta multi-etapas |
| ✨ Adicionado | Função RPC `delete_user_account` e serviço `account.js` |
| 🔧 Corrigido | `showPicker()` nos inputs type="date" para abrir calendário nativo |
| 🔧 Corrigido | Labels do gráfico pizza (renderPieLabel externo com labelLine) |
| 🔧 Corrigido | Tecla Espaço no PomodoroFullScreen ignorada quando foco está em INPUT/TEXTAREA |
| ❌ Removido | ~~StreakBadge do Dashboard~~ |

---

## Stack Tecnológica

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| **Framework** | React | 18.3.1 |
| **Build Tool** | Vite | 5.4.2 |
| **Roteamento** | React Router DOM | 6.26.0 |
| **Estilização** | Tailwind CSS | 3.4.10 |
| **Pós-processador CSS** | PostCSS + Autoprefixer | 8.4.20 |
| **Backend/Database** | Supabase (PostgreSQL) | 2.108.1 |
| **Ícones** | Lucide React | 0.441.0 |
| **Gráficos** | Recharts | 3.8.1 |
| **Datas** | date-fns | 3.6.0 |
| **Drag & Drop** | @dnd-kit (core + sortable + utilities) | 6.3.1 / 10.0.0 |
| **Gerenciamento de Estado** | Context API + useReducer | nativo |
| **Áudio** | Web Audio API (beep do Pomodoro) | nativo |
| **PWA** | Service Worker + Web Manifest | nativo |
| **Gerenciador de Pacotes** | npm | -- |

---

## Estrutura do Projeto

```
app_build/                          # Projeto ativo (produção)
├── index.html                      # Entry point HTML + PWA meta + Google Fonts (Inter)
├── package.json                    # Dependências e scripts
├── vite.config.js                  # Configuração Vite + React plugin
├── tailwind.config.js              # Configuração Tailwind (fonte Inter)
├── postcss.config.js               # Configuração PostCSS
├── supabase_schema.sql             # Schema SQL do Supabase (inicial)
├── migrations/
│   ├── 001_initial.sql              # Schema inicial (mesmo que supabase_schema.sql)
│   └── 002_add_deleted_at.sql       # Coluna deleted_at + índice para lixeira
│
├── public/
│   ├── manifest.json               # Manifest PWA (nome, ícones, tema)
│   ├── sw.js                       # Service Worker (cache-first)
│   └── icon.svg                    # Ícone do app (checkmark azul)
│
├── src/
│   ├── main.jsx                    # Ponto de entrada React
│   │   └── Providers: BrowserRouter > AuthProvider > TaskProvider > PomodoroProvider
│   │
│   ├── App.jsx                     # Definição de rotas + useTheme + PomodoroWidget + PomodoroFullScreen
│   │   └── Rotas: / /tarefas /analises /calendario /configuracoes /login
│   │
│   ├── index.css                   # Diretivas Tailwind + dark body + estilos customizados
│   │
│   ├── hooks/
│   │   └── useTheme.js            # Hook para alternar dark mode (class no <html>)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx         # Estado de autenticação global
│   │   ├── TaskContext.jsx         # Estado global das tarefas (useReducer + Supabase)
│   │   ├── PomodoroContext.jsx     # Timer global, ciclo foco/pausa, persistência Supabase
│   │   ├── HabitContext.jsx        # Estado global de hábitos (useReducer)
│   │   └── TemplateContext.jsx     # Estado global de templates (useReducer)
│   │
│   ├── services/
│   │   ├── supabaseClient.js       # Inicialização do cliente Supabase
│   │   ├── storage.js              # Operações CRUD de tarefas + tags no Supabase
│   │   ├── profile.js              # Leitura/criação de perfil do usuário
│   │   ├── settings.js             # Configurações locais (localStorage) + pomodoro durations
│   │   ├── gamification.js         # Lógica de streaks, achievements + totalPomodoros
│   │   ├── categories.js           # CRUD de categorias personalizadas
│   │   ├── pomodoros.js            # CRUD de sessões pomodoro no Supabase
│   │   ├── tags.js                 # CRUD de tags personalizadas
│   │   ├── templates.js            # CRUD de templates de tarefas
│   │   └── account.js              # Exclusão de conta (RPC + verificação)
│   │
│   ├── utils/
│   │   ├── constants.js            # Categorias, prioridades, filtros, REPEAT_OPTIONS, mapas
│   │   └── helpers.js              # Formatação de datas, getNextRecurringDate
│   │
│   ├── components/
│   │   ├── Sidebar.jsx             # Navegação lateral responsiva + toggle dark mode
│   │   ├── ProtectedRoute.jsx      # Guarda de autenticação com loading spinner
│   │   ├── TaskList.jsx            # Renderizador de lista (sortable), separa pais/subtarefas
│   │   ├── TaskCard.jsx            # Card com repeat icon, subtask progress, focar, tags chips, badge "Sem prazo"
│   │   ├── TaskForm.jsx            # Modal com campos + repeat_rule + subtarefas + TagInput + toggle foco
│   │   ├── TaskDetailModal.jsx     # Modal de detalhes com subtarefas, tags, editar/excluir/foco
│   │   ├── FilterBar.jsx           # Barra de filtros com contadores + dropdown de tags
│   │   ├── SearchBar.jsx           # Campo de busca por título
│   │   ├── EmptyState.jsx          # Placeholder visual para lista vazia
│   │   ├── ProgressBar.jsx         # Barra de progresso animada
│   │   ├── TodayWidget.jsx         # Saudação + estatísticas do dia
│   │   ├── WeekCalendar.jsx        # Mini-calendário semanal (7 dias)
│   │   ├── UpcomingDeadlines.jsx   # Próximos 6 prazos
│   │   ├── NotificationBell.jsx    # Sino de notificações com dropdown e dispensa
│   │   ├── Achievements.jsx        # Conquistas da gamificação (inclui "100 Pomodoros")
│   │   ├── (KanbanBoard removido)
│   │   ├── DeleteAccountModal.jsx  # Modal multi-etapas de exclusão de conta
│   │   ├── PomodoroWidget.jsx      # Timer flutuante (bottom-6 right-6, colapsável, progress ring)
│   │   ├── PomodoroFullScreen.jsx  # Tela cheia (z-100, ESC sai, Espaço pausa)
│   │   ├── TagInput.jsx            # Input de tags com autocomplete + chips coloridos
│   │   └── TemplatePicker.jsx      # Modal seletor de tarefas modelo pré-cadastradas
│   │
│   └── pages/
│       ├── LoginPage.jsx           # Tela de login/cadastro
│       ├── DashboardPage.jsx       # Dashboard com 5 stat cards, today tasks, deadlines, achievements
│       ├── TarefasPage.jsx         # Gerenciamento com filtros, busca, lista agrupada por categoria, tags
│       ├── AnalisesPage.jsx        # Gráficos semanais, pomodoros, categoria, prioridade (barras horizontais)
│       ├── CalendarioPage.jsx      # Calendário mensal com tasks indicators
│       └── ConfiguracoesPage.jsx   # Perfil, metas, notificações, pomodoro, categorias, tags, perigo
│
└── dist/                           # Build de produção
    ├── index.html
    ├── manifest.json
    ├── sw.js
    ├── icon.svg
    └── assets/
        ├── index-*.css
        └── index-*.js
```

**Total: ~4.800 linhas de código em 57 arquivos fonte.**

---

## Funcionalidades Implementadas

### Gerenciamento de Tarefas
- **CRUD Completo**: Criar, listar, editar e excluir tarefas
- **Checkbox de conclusão** com riscado automático e redução de opacidade
- **Descrição/observações**: texto livre editável no formulário, expansível no card
- **Reordenação por drag**: coluna `position`, @dnd-kit/sortable com drag handle (apenas nos filtros sem agrupamento)
- **Edição**: ícone de lápis no hover do card, modal preenchido para edição

### Categorias
- 3 categorias padrão: Trabalho (azul), Pessoal (verde), Estudos (roxo)
- **Categorias personalizadas**: criar, editar e excluir com 8 cores predefinidas
- Persistência no Supabase com RLS

### Prioridades
- Alta (vermelho), Média (âmbar), Baixa (verde)
- Badges coloridos visíveis no card

### Tarefas Recorrentes
- 5 opções: Diária, Dias úteis (seg-sex), Semanal, Mensal, Anual
- Seletor no formulário de criação/edição (TaskForm)
- Ao concluir a tarefa atual, clona automaticamente com a próxima data calculada via `getNextRecurringDate`
- Ícone de repetição visível no TaskCard

### Subtarefas
- Armazenadas como linhas independentes com `parent_id` + `ON DELETE CASCADE`
- Criadas via campos extras no TaskForm ("Adicionar subtarefa")
- Exibidas aninhadas dentro do TaskCard (contagem "X/Y concluídas" + "Ver detalhes")
- Checkbox inline no TaskDetailModal para marcar individualmente
- Subtarefas NÃO herdam tags do pai

### Filtros e Busca
- 9 filtros: Todas, Hoje, Esta Semana, Urgentes, Lembretes, Atrasadas, **Sem Data**, Pendentes, Concluídas
- **FilterBar unificada**: todos os filtros + tags em único dropdown
- Contadores dinâmicos em cada filtro
- Busca textual por título
- Estado do filtro preservado na URL

### Visualizações
- **Lista**: visualização vertical padrão com **agrupamento por categoria**
- Pendentes aparecem primeiro, concluídas depois (dentro de cada categoria)
- Cabeçalhos de categoria com fundo colorido translúcido

### Autenticação (Supabase Auth)
- Login e cadastro com email/senha
- Rotas protegidas (redireciona para `/login` se não autenticado)
- Sessão persistente entre recarregamentos
- Criação automática de perfil no cadastro (trigger SQL)

### Páginas

| Página | Rota | Descrição |
|--------|------|-----------|
| **Login** | `/login` | Formulário de login/cadastro com toggle |
| **Dashboard** | `/` | Saudação com nome, 5 stat cards (total/pendentes/concluídas/atrasadas/Sem Prazo), tarefas de hoje, mini-calendário semanal, próximos prazos, streak, conquistas, progresso, alertas |
| **Tarefas** | `/tarefas` | Lista completa com filtros unificados, busca, agrupamento por categoria, botão "Nova Tarefa", "Tarefa Modelo", tags, subtarefas, TaskDetailModal |
| **Análises** | `/analises` | Gráfico semanal de barras, produtividade por categoria, prioridade (barras horizontais), **pomodoros por dia** (BarChart), stat de pomodoros |
| **Calendário** | `/calendario` | Grade mensal com indicadores, navegação entre meses, clique no dia |
| **Configurações** | `/configuracoes` | Aba Geral (Perfil, meta diária, notificações, durações do Pomodoro, categorias, tags, tarefas modelo, zona de perigo) + aba **Lixeira** (soft delete com 30 dias, restaurar/excluir/esvaziar) |

### Análises e Gráficos (Recharts)
- Gráfico de barras semanal (7 dias)
- Produtividade por categoria (porcentagem de conclusão)
- Barras horizontais por prioridade (Alta/Média/Baixa)
- **Gráfico de pomodoros por dia** (BarChart semanal)
- **5º stat card**: "Sem Prazo" no Dashboard + card de pomodoros nas Análises

### Gamificação
- **Streak**: contagem de dias consecutivos de uso (localStorage)
- **Conquistas**: "100 Tarefas", "Estreak de 30 Dias", "Semana Sem Atrasos", "100 Pomodoros"
- **Badge de Streak**: ícone de fogo com contagem
- **Porcentagem de produtividade** no dashboard

### Notificações
- Sino com dropdown exibindo tarefas com vencimento hoje e tarefas atrasadas
- Badge numérico no ícone
- Dispensa individual persistida em localStorage

### Pomodoro Timer
- **Timer global** (PomodoroContext): `setInterval` com ciclo foco → pausa curta → pausa longa
- **Widget flutuante**: posição fixa bottom-6 right-6, colapsável, SVG progress ring circular, controles play/pause/stop/skip
- **Tela cheia**: `fixed z-[100]`, timer 7xl-8xl, ESC sai, Espaço pausa/pausa (ignorado se foco em input)
- **Persistência**: sessões salvas no Supabase (tabela `pomodoros`) imediatamente ao completar
- **Web Audio API**: beep ao final de cada ciclo
- **Auto-start**: pausa curta/longa inicia automaticamente após o foco
- **"Focar"** botão no TaskCard e TaskDetailModal
- **Configurável**: durações de foco, pausa curta, pausa longa e quantidade de ciclos em Configurações
- **Gamificação**: contagem `totalPomodoros` (localStorage) + conquista "100 Pomodoros"

### Modo Escuro (Dark Mode)
- Implementado com `darkMode: 'class'` no Tailwind
- **Toggle manual**: botão Lua/Sol na Sidebar (não segue `prefers-color-scheme`)
- **Persistência**: preferência salva no `localStorage` via `useTheme.js`
- **Cobertura total**: `dark:` variants aplicadas em todas as páginas, componentes, modais, widgets (6 blocos)
- **Ícones de stat cards**: fundos adaptados (`dark:bg-{color}-900/30`)

### Tags e Labels
- **Modelo normalizado**: tabelas `tags` e `task_tags` (relação N:N)
- **CRUD completo**: criar, editar nome/cor, excluir tags em Configurações (8 cores predefinidas)
- **TagInput**: componente de entrada com autocomplete, dropdown, chips coloridos com X para remover
- **Exibição**: chips coloridos visíveis no TaskCard e TaskDetailModal
- **Filtro por tags**: dropdown no FilterBar com bolinhas coloridas, prefixo `tag:` no filtro da URL
- **Subtarefas**: NÃO herdam tags do pai (independência)

### Hábitos
- **Modelo de dados**: tabelas `habits` + `habit_logs` com RLS
- **Frequências**: Diário, Semanal, Personalizado (dias específicos Dom a Sáb)
- **Meta por dia**: valor numérico com barra de progresso no card
- **Streak**: dias consecutivos exibido como `🔥 N`
- **Página dedicada**: rota `/habitos` com 3 filtros, HabitCard, HabitForm modal
- **Widget no Dashboard**: até 4 hábitos de hoje com checkbox inline
- **Gamificação**: conquistas "1 semana de hábito", "30 dias de hábito", "Todos os hábitos hoje"

### Tarefas Modelo
- **Modelo de dados**: tabela `templates` (`name`, `title`, `description`, `category`, `priority`, `subtitles` JSONB, `tag_ids` INT[]) com RLS
- **Salvar como tarefa modelo**: checkbox "💾 Salvar como tarefa modelo" no TaskForm, salva junto com a criação da tarefa
- **Usar tarefa modelo**: botão "📋 Tarefa Modelo" na página Tarefas → `TemplatePicker` modal → TaskForm pré-preenchido
- **Botão rápido**: ícone `FileText` no hover do TaskRow (Dashboard) e botão "Tarefa Modelo" no `TaskDetailModal` — ambos com `prompt()` para nome
- **Gerenciamento**: seção "Tarefas Modelo" em Configurações com CRUD inline (nome, título, categoria, prioridade)
- **Context próprio**: `TemplateContext` com useReducer + persistência Supabase

### Horário nas Datas
- **Coluna `due_time` (TIME)**: opcional, adicionada via `ALTER TABLE` sem quebrar registros existentes
- **Input**: `type="time"` ao lado do `type="date"` no TaskForm, com `showPicker()`
- **Exibição**: formatado como "15 de junho às 14:30" nos cards, detalhes, calendário e deadlines
- **Filtros**: `isOverdue` e `isDueToday` consideram horário para determinar se a tarefa está atrasada/hoje
- **Ordenação**: `due_time` como critério secundário após `due_date`

### UI/UX
- Design responsivo (sidebar recolhível em mobile)
- Animações: slide-in de cards, hover effects, transições suaves
- Barra de progresso animada com gradiente
- Estado vazio ilustrado
- Checkbox customizado arredondado
- Destaque visual: borda vermelha para atrasadas, âmbar para lembretes
- Contraste WCAG, alvo de toque mínimo 44px

### PWA
- Service Worker com estratégia cache-first
- Web App Manifest (nome, ícone, tema)
- Instalável como aplicativo

---

## Mapa de Rotas

```
/login          → LoginPage       (pública)
/               → DashboardPage   (protegida)
/tarefas        → TarefasPage     (protegida)
/habitos        → HabitsPage      (protegida)
/analises       → AnalisesPage    (protegida)
/calendario     → CalendarioPage  (protegida)
/configuracoes  → ConfiguracoesPage (protegida)
*               → redireciona para /
```

Todas as rotas (exceto `/login`) são envolvidas pelo componente `ProtectedRoute` que verifica se o usuário está autenticado e redireciona para `/login` se necessário.

---

## Modelo de Dados

### Supabase (PostgreSQL)

#### Tabela `tasks`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `BIGINT GENERATED ALWAYS AS IDENTITY` | Chave primária |
| `title` | `TEXT NOT NULL` | Título da tarefa |
| `description` | `TEXT` | Descrição/observações |
| `category` | `TEXT DEFAULT 'trabalho'` | Categoria |
| `priority` | `TEXT DEFAULT 'media'` | Prioridade (alta/media/baixa) |
| `due_date` | `DATE` | Data de vencimento (opcional) |
| `due_time` | `TIME` | Horário de vencimento (opcional) |
| `completed` | `BOOLEAN DEFAULT FALSE` | Status de conclusão |
| `remind_me` | `BOOLEAN DEFAULT FALSE` | Flag de lembrete |
| `repeat_rule` | `TEXT` | Frequência de recorrência (daily/weekdays/weekly/monthly/yearly) |
| `parent_id` | `BIGINT REFERENCES tasks ON DELETE CASCADE` | ID da tarefa pai (subtarefas) |
| `position` | `INT` | Ordem de exibição (drag-and-drop) |
| `user_id` | `UUID REFERENCES auth.users` | Dono da tarefa |
| `deleted_at` | `TIMESTAMPTZ` | Data da exclusão (lixeira); `NULL` = tarefa ativa |
| `created_at` | `TIMESTAMPTZ DEFAULT NOW()` | Data de criação |

#### Tabela `profiles`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `UUID REFERENCES auth.users PRIMARY KEY` | FK para auth.users |
| `name` | `TEXT NOT NULL` | Nome do usuário |
| `created_at` | `TIMESTAMPTZ DEFAULT NOW()` | Data de criação |

#### Tabela `categories`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `BIGINT GENERATED ALWAYS AS IDENTITY` | Chave primária |
| `name` | `TEXT NOT NULL` | Nome da categoria |
| `color` | `TEXT DEFAULT '#3B82F6'` | Cor hexadecimal |
| `user_id` | `UUID REFERENCES auth.users NOT NULL` | Dono da categoria |
| `created_at` | `TIMESTAMPTZ DEFAULT NOW()` | Data de criação |

#### Tabela `pomodoros`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `BIGINT GENERATED ALWAYS AS IDENTITY` | Chave primária |
| `user_id` | `UUID REFERENCES auth.users NOT NULL` | Dono da sessão |
| `task_id` | `BIGINT REFERENCES tasks ON DELETE SET NULL` | Tarefa focada (opcional) |
| `duration` | `INT NOT NULL` | Duração em segundos |
| `type` | `TEXT NOT NULL` | Tipo: `focus`/`short_break`/`long_break` |
| `completed_at` | `TIMESTAMPTZ DEFAULT NOW()` | Momento da conclusão |
| `created_at` | `TIMESTAMPTZ DEFAULT NOW()` | Data de criação |

#### Tabela `tags`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `BIGINT GENERATED ALWAYS AS IDENTITY` | Chave primária |
| `name` | `TEXT NOT NULL` | Nome da tag |
| `color` | `TEXT DEFAULT '#3B82F6'` | Cor hexadecimal |
| `user_id` | `UUID REFERENCES auth.users NOT NULL` | Dono da tag |
| `created_at` | `TIMESTAMPTZ DEFAULT NOW()` | Data de criação |

#### Tabela `templates`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `BIGINT GENERATED ALWAYS AS IDENTITY` | Chave primária |
| `name` | `TEXT NOT NULL` | Nome do template |
| `title` | `TEXT NOT NULL` | Título pré-preenchido da tarefa |
| `description` | `TEXT` | Descrição padrão |
| `category` | `TEXT DEFAULT 'trabalho'` | Categoria fixa |
| `priority` | `TEXT DEFAULT 'media'` | Prioridade fixa |
| `remind_me` | `BOOLEAN DEFAULT FALSE` | Lembrete padrão |
| `repeat_rule` | `TEXT` | Recorrência padrão |
| `color` | `TEXT DEFAULT '#3B82F6'` | Cor do template |
| `subtitles` | `JSONB DEFAULT '[]'` | Array de subtarefas modelo |
| `tag_ids` | `INT[] DEFAULT '{}'` | Array de IDs de tags fixas |
| `user_id` | `UUID REFERENCES auth.users NOT NULL` | Dono do template |
| `created_at` | `TIMESTAMPTZ DEFAULT NOW()` | Data de criação |

#### Tabela `task_tags`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `task_id` | `BIGINT REFERENCES tasks ON DELETE CASCADE` | FK para tasks |
| `tag_id` | `BIGINT REFERENCES tags ON DELETE CASCADE` | FK para tags |

#### Row Level Security (RLS)
- **Profiles**: SELECT próprio, UPDATE próprio
- **Categories**: SELECT/INSERT/UPDATE/DELETE próprias
- **Pomodoros**: INSERT próprio, SELECT próprio
- **Tags**: SELECT/INSERT/UPDATE/DELETE próprias
- **Task_tags**: INSERT/SELECT/DELETE via subquery `EXISTS (SELECT 1 FROM tasks WHERE id = task_id AND user_id = auth.uid())`
- **Tasks**: (gerenciado via service layer com filtro por `user_id`)

#### Trigger
- `on_auth_user_created`: cria perfil automaticamente no cadastro

---

## Fluxo de Dados

```
Usuário → dispatch(action) → TaskContext (useReducer) → novo estado
                                                            ↓
                                                    storage.sync()
                                                    (Supabase CRUD)
                                                            ↓
                                                    Supabase (PostgreSQL)
```

O estado global é gerenciado via `Context API + useReducer` no `TaskContext.jsx`. As ações (ADD_TASK, TOGGLE_TASK, DELETE_TASK, UPDATE_TASK, SET_TASKS) atualizam o estado local e sincronizam com o Supabase através do service layer (`storage.js`).

Para autenticação, o `AuthContext.jsx` gerencia sessão do Supabase Auth e expõe `signIn`, `signUp` e `signOut`.

---

## Componentes

### Árvore de Componentes

```
<App>
  <AuthProvider>
    <TaskProvider>
      <PomodoroProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" → <LoginPage />
            <Route path="/" → <ProtectedRoute>
              <DashboardPage>
                <TodayWidget />         ← saudação + data
                <NotificationBell />    ← notificações
                <ProgressBar />         ← progresso geral
                <WeekCalendar />        ← mini-calendário
                <UpcomingDeadlines />   ← próximos prazos
                <Achievements />        ← conquistas
                <Sidebar />             ← navegação lateral
              </DashboardPage>
              <PomodoroWidget />        ← timer flutuante
              <PomodoroFullScreen />    ← tela cheia
            />
            <Route path="/tarefas" → <ProtectedRoute>
              <TarefasPage>
                <SearchBar />           ← busca textual
                <FilterBar />           ← dropdown único de filtros + tags
                <TaskList>              ← lista agrupada por categoria
                  <TaskCard />          ← cada tarefa (tags, subtasks, focar, sem prazo)
                </TaskList>
                <TaskDetailModal />     ← modal detalhes
                <TaskForm />            ← modal criar/editar (tags, repeat, subtasks)
                <Sidebar />
              </TarefasPage>
              <PomodoroWidget />
              <PomodoroFullScreen />
            />
            <Route path="/analises" → <ProtectedRoute>
              <AnalisesPage>
                <Sidebar />
              </AnalisesPage>
              <PomodoroWidget />
              <PomodoroFullScreen />
            />
            <Route path="/calendario" → <ProtectedRoute>
              <CalendarioPage>
                <Sidebar />
              </CalendarioPage>
              <PomodoroWidget />
              <PomodoroFullScreen />
            />
            <Route path="/configuracoes" → <ProtectedRoute>
              <ConfiguracoesPage>
                <Sidebar />
              </ConfiguracoesPage>
              <PomodoroWidget />
              <PomodoroFullScreen />
            />
          </Routes>
        </BrowserRouter>
      </PomodoroProvider>
    </TaskProvider>
  </AuthProvider>
</App>
```

### Descrição dos Componentes

| Componente | Arquivo | Linhas | Função |
|-----------|---------|--------|--------|
| `Sidebar` | `components/Sidebar.jsx` | 99 | Navegação com 5 links, info do usuário, botão sair + toggle dark mode; responsiva |
| `ProtectedRoute` | `components/ProtectedRoute.jsx` | 21 | Guarda de autenticação com loading spinner |
| `TaskForm` | `components/TaskForm.jsx` | 220+ | Modal com título, descrição (subtarefas abaixo), categoria, prioridade, data, horário, lembrete, repeat_rule (com dias úteis), TagInput, toggle "Iniciar foco", toggle "Salvar como tarefa modelo" |

| `TaskList` | `components/TaskList.jsx` | 140+ | Lista com agrupamento opcional por categoria, cabeçalhos coloridos, sortable (@dnd-kit) quando sem agrupamento, ordena pendentes primeiro |
| `TaskDetailModal` | `components/TaskDetailModal.jsx` | 170+ | Modal de detalhes com subtarefas, tag chips, data+horário, botões editar/excluir/foco/Tarefa Modelo |
| `FilterBar` | `components/FilterBar.jsx` | 110+ | Dropdown único com todos os filtros + tags, contadores e ícones por filtro |
| `SearchBar` | `components/SearchBar.jsx` | 16 | Input de busca com ícone de lupa |
| `TaskCard` | `components/TaskCard.jsx` | 200+ | Card com checkbox, título (click → detail modal), badges, data+horário, repeat icon, subtask progress, tag chips, badge "Sem prazo", lixeira/edição/Foco |
| `PomodoroWidget` | `components/PomodoroWidget.jsx` | 100+ | Timer flutuante (fixed bottom-6 right-6), colapsável, SVG progress ring, play/pause/stop/skip |
| `PomodoroFullScreen` | `components/PomodoroFullScreen.jsx` | 80+ | Tela cheia (z-100), timer 7xl-8xl, ESC sai, Espaço pausa (ignorado em inputs), ciclo dots |
| `TagInput` | `components/TagInput.jsx` | 60+ | Input com autocomplete + dropdown, chips coloridos com X para remover |
| `TemplatePicker` | `components/TemplatePicker.jsx` | 50+ | Modal seletor de tarefas modelo com cards e botão "Criar do zero" |
| `TodayWidget` | `components/TodayWidget.jsx` | 36 | Saudação (Bom dia/tarde/noite) + data formatada |
| `WeekCalendar` | `components/WeekCalendar.jsx` | 63 | Grade semanal com datas e dia atual destacado |
| `UpcomingDeadlines` | `components/UpcomingDeadlines.jsx` | 51 | Lista dos próximos 6 prazos com dias restantes |
| `NotificationBell` | `components/NotificationBell.jsx` | 80+ | Sino com dropdown de tarefas de hoje/atrasadas + dispensa individual |
| `ProgressBar` | `components/ProgressBar.jsx` | 19 | Barra de progresso animada com gradiente |
| `Achievements` | `components/Achievements.jsx` | 60+ | Grid de conquistas com ícones, progresso e "100 Pomodoros" |
| `DeleteAccountModal` | `components/DeleteAccountModal.jsx` | 140 | Modal multi-etapas de exclusão de conta (verificar → avisar → confirmar) |
| `EmptyState` | `components/EmptyState.jsx` | 17 | Ilustração para lista vazia |

---

## Serviços

| Serviço | Arquivo | Linhas | Função |
|---------|---------|--------|--------|
| `supabaseClient` | `services/supabaseClient.js` | 6 | Cria e exporta cliente Supabase |
| `storage` | `services/storage.js` | 190+ | CRUD de tarefas + tags no Supabase (getTasks com JOIN tags, softDeleteTask, restoreTask, getTrashTasks, cleanupTrash, permanentlyDeleteTask) |
| `profile` | `services/profile.js` | 29 | Busca e criação de perfil do usuário |
| `settings` | `services/settings.js` | 25+ | Leitura/gravação no localStorage (dailyGoal, notifications, theme, pomodoro durations) |
| `gamification` | `services/gamification.js` | 80+ | Lógica de streak, conquistas (inclui "100 Pomodoros"), produtividade, totalPomodoros |
| `categories` | `services/categories.js` | 63 | CRUD de categorias personalizadas no Supabase |
| `pomodoros` | `services/pomodoros.js` | 40+ | saveSession, getTodayStats, getWeekStats no Supabase |
| `tags` | `services/tags.js` | 50+ | CRUD de tags personalizadas no Supabase (getTags, createTag, updateTag, deleteTag) |
| `templates` | `services/templates.js` | 45+ | CRUD de tarefas modelo (getTemplates, createTemplate, updateTemplate, deleteTemplate) |
| `account` | `services/account.js` | 11 | Exclusão de conta (verificação de senha + RPC Supabase) |

---

## Gamificação

### Streak (Sequência de Dias)
- Armazenado no `localStorage` como `gamification_streak`
- Verificado a cada carregamento do dashboard
- Inclui `lastDate`, `count` e `maxCount`
- Se o usuário acessa em dias consecutivos, o contador incrementa
- Se pula um dia, o contador reinicia

### Conquistas
- **100 Tarefas** (`achievement_100_tasks`): ao completar 100 tarefas
- **Estreak de 30 Dias** (`achievement_30_day_streak`): ao atingir 30 dias consecutivos
- **Semana Sem Atrasos** (`achievement_no_overdue_week`): quando nenhuma tarefa está atrasada
- **100 Pomodoros** (`achievement_100_pomodoros`): ao completar 100 sessões de foco

### Pomodoros
- Contagem total (`totalPomodoros`) persistida em localStorage
- Incrementada automaticamente pelo `PomodoroContext` ao concluir cada ciclo foco

### Produtividade
- Calculada como `completas / total * 100`
- Exibida no dashboard via `ProgressBar`

---

## Como Rodar

### Pré-requisitos
- Node.js 18+
- npm 9+
- Projeto Supabase configurado

### Setup

```bash
cd app_build

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie um arquivo .env na raiz do app_build com:
# VITE_SUPABASE_URL=https://seu-projeto.supabase.co
# VITE_SUPABASE_ANON_KEY=sua-chave-anon

# Executar schema SQL no Supabase
# Abra supabase_schema.sql e execute no SQL Editor do Supabase

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor será iniciado em `http://localhost:5173`.

### Scripts Disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento (Vite)
npm run build     # Gera build de produção em dist/
npm run preview   # Preview do build de produção
```

---

## Build de Produção

```bash
cd app_build
npm run build
```

O build gera os arquivos otimizados em `app_build/dist/`:
- HTML minificado
- CSS purgado (Tree-shaking do Tailwind)
- JS com code-splitting
- Service Worker e Manifest copiados para a raiz do `dist/`

Para fazer deploy, sirva o conteúdo de `dist/` em qualquer servidor estático (Vercel, Netlify, GitHub Pages, etc.).

---

## PWA

O aplicativo é uma **Progressive Web App**:
- **Service Worker** (`public/sw.js`): cache-first de assets estáticos
- **Web Manifest** (`public/manifest.json`): nome, ícone SVG, tema azul
- Instalável como aplicativo nativo no celular/desktop

---

## Comparação: v1 (backup) vs v2 (app_build)

| Funcionalidade | v1 (backup) | v2 (app_build) |
|---------------|-------------|-----------------|
| **Armazenamento** | LocalStorage apenas | Supabase (PostgreSQL) |
| **Autenticação** | ❌ | ✅ Supabase Auth |
| **Navegação** | Navbar (topo) | Sidebar (lateral responsiva + dark toggle) |
| **Dashboard** | ❌ | ✅ 5 stat cards, today tasks, deadlines, achievements |
| **Configurações** | ❌ | ✅ Meta, notificações, pomodoro, categorias, tags, perigo |
| **Categorias personalizadas** | ❌ | ✅ CRUD com 8 cores |
| **Tags / Labels** | ❌ | ✅ N:N com CRUD + TagInput + filtro |
| **Gamificação** | ❌ | ✅ Streak + 4 conquistas (inclui "100 Pomodoros") |
| **Kanban drag-and-drop** | ❌ | ~~✅ @dnd-kit~~ ❌ removido |
| **Busca** | ❌ | ✅ SearchBar |
| **Barra de progresso** | ❌ | ✅ ProgressBar animada |
| **Filtros** | 3 (Todas/Pendentes/Concluídas) | 9 + **filtro por tags** (dropdown unificado) |
| **Notificações** | ❌ | ✅ NotificationBell com dispensa |
| **Páginas** | 3 | 7 (+ Hábitos) |
| **Gráficos** | Recharts | Recharts (semanal, categoria, **barras prioridade**, **pomodoros**) |
| **Pomodoro Timer** | ❌ | ✅ Global + widget + tela cheia + gamificação |
| **Modo Escuro** | ❌ | ✅ `darkMode: 'class'`, toggle manual, cobertura total |
| **Subtarefas** | ❌ | ✅ parent_id ON DELETE CASCADE |
| **Tarefas Recorrentes** | ❌ | ✅ Diária/Dias úteis/Semanal/Mensal/Anual com auto-clone |
| **Descrição nas tarefas** | ❌ | ✅ Textarea expansível |
| **Reordenação** | ❌ | ✅ @dnd-kit/sortable com position (filtros sem agrupamento) |
| **Editar tarefa** | ❌ | ✅ Ícone de lápis + modal preenchido |
| **Horário nas datas** | ❌ | ✅ Coluna due_time + input time + formatDateTime |
| **Hábitos** | ❌ | ✅ habits + habit_logs, página dedicada, widget, conquistas |
| **Tarefas Modelo** | ❌ | ✅ Salvar/usar tarefas modelo, CRUD em Configurações, botões no Dashboard/Detalhes |
| **Lixeira / Soft Delete** | ❌ | ✅ Soft delete + restore + auto-cleanup 30 dias + aba em Configurações |

---

## Melhorias Futuras

- **Listas compartilhadas**: tarefas multi-usuário via Supabase Realtime
- **Notificações push**: com Service Worker e Supabase Realtime
- **Upload de anexos**: imagens/documentos nas tarefas (via Supabase Storage)
- **Exportação**: CSV ou JSON das tarefas
- **Testes automatizados**: Vitest + React Testing Library
- **TypeScript**: migração gradual para tipagem estática
- **Internacionalização**: suporte a múltiplos idiomas

---

## Estimativas de Tempo de Desenvolvimento

### Com assistência de IA (opencode)
~30 horas distribuídas em múltiplas sessões.

### Desenvolvimento 100% manual (sem IA)
~100-120 horas (~3 semanas full-time).

### Comparativo por funcionalidade

| Funcionalidade | Com IA | Sem IA |
|---------------|--------|--------|
| Setup + Auth + CRUD | ~4h | ~16h |
| Views + Filtros + Busca | ~3h | ~12h |
| Dashboard + Analytics + Calendário | ~4h | ~16h |
| Configurações + Gamificação | ~3h | ~10h |
| Recorrentes + Subtarefas + DetailModal | ~3h | ~10h |
| Pomodoro Timer (F1 + F2) | ~4h | ~16h |
| Dark Mode (6 blocos) | ~3h | ~12h |
| Tags e Labels | ~3h | ~8h |
| Hábitos | ~2h | ~8h |
| Tarefas Modelo | ~2h | ~8h |
| Horário nas datas | ~1h | ~4h |
| Lixeira / Soft Delete | ~30min | ~4h |
| Refinamentos + README | ~2h | ~8h |
| **Total** | **~34h** | **~128h** |

> A estimativa "sem IA" considera um desenvolvedor full-stack familiarizado com React, Tailwind, Supabase e date-fns, sem contar tempo de aprendizado ou pesquisa de documentação.

---

## Licença

Projeto privado — todos os direitos reservados.
