const KEY_ICON = '\u{1F511}';
const state = {
  theme: 'light',
  authed: false,
  page: 'dashboard',
  email: '', password: '', showPassword: false, loginError: '', loginLoading: false,
  labFilter: 'todas', labQuery: '',
};

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '\u{1F4CA}' },
  { key: 'cantina', label: 'Cantina', icon: '\u{1F34E}' },
  { key: 'laboratorios', label: 'Laboratórios', icon: '\u{1F9EA}' },
  { key: 'busca-ativa', label: 'Busca Ativa', icon: '\u{1F50D}' },
  { key: 'professores', label: 'Professores', icon: '\u{1F393}' },
  { key: 'conflitos', label: 'Conflitos', icon: '\u{26A0}\u{FE0F}' },
  { key: 'estacionamento', label: 'Estacionamento', icon: '\u{1F697}' },
  { key: 'chaves', label: 'Chaves', icon: KEY_ICON },
  { key: 'relatorios', label: 'Relatórios', icon: '\u{1F4C8}' },
  { key: 'configuracoes', label: 'Configurações', icon: '\u{2699}\u{FE0F}' },
];

const PAGE_META = {
  dashboard: ['Dashboard', 'Visão geral dos processos da Escola do Futuro.'],
  cantina: ['Cantina', 'Produção e pedidos da cantina.'],
  laboratorios: ['Reserva de Laboratórios', 'Solicitações e aprovações de uso dos laboratórios.'],
  'busca-ativa': ['Busca Ativa', 'Acompanhamento de alunos.'],
  professores: ['Professores × Cursos', 'Vínculo entre professores e cursos.'],
  conflitos: ['Conflitos de Matrícula', 'Sobreposições e pendências de matrícula.'],
  estacionamento: ['Estacionamento', 'Solicitações de vagas.'],
  chaves: ['Controle de Chaves', 'Retirada e devolução de chaves.'],
  relatorios: ['Relatórios', 'Relatórios gerenciais.'],
  configuracoes: ['Configurações', 'Preferências do sistema.'],
};

const stats = [
  { label: 'Alunos ativos', value: '1.248', trend: '+8% em relação ao mês anterior', icon: '\u{1F465}' },
  { label: 'Laboratórios', value: '6', trend: '2 reservados hoje', icon: '\u{1F9EA}' },
  { label: 'Solicitações pendentes', value: '14', trend: '+3 desde ontem', icon: '\u{1F4CB}' },
  { label: 'Estacionamento', value: '3', trend: 'aguardando análise', icon: '\u{1F697}' },
];

const pendencias = [
  { icon: '\u{1F9EA}', title: 'Laboratório 02', desc: '2 solicitações aguardando análise', tone: 'warning' },
  { icon: '\u{1F697}', title: 'Estacionamento', desc: '3 solicitações pendentes', tone: 'warning' },
  { icon: '\u{1F34E}', title: 'Cantina', desc: 'Previsão de produção aguardando atualização', tone: 'info' },
];

const atividades = [
  { title: 'Solicitação criada', desc: 'Reserva do Laboratório 02 solicitada por Mariana Alves', time: 'há 12 min' },
  { title: 'Chave retirada', desc: 'Sala 14 — retirada por João Pedro (Coordenação)', time: 'há 40 min' },
  { title: 'Solicitação aprovada', desc: 'Estacionamento — vaga liberada para visitante', time: 'há 1h' },
  { title: 'Conflito detectado', desc: 'Turma 3ºB com sobreposição de horário — Matemática', time: 'há 2h' },
];

let reservas = [
  { id: 1, lab: 'Laboratório 01', solicitante: 'Mariana Alves', turma: '2º A', data: '25/08/2026', horario: '08:00–09:40', status: 'pendente' },
  { id: 2, lab: 'Laboratório 02', solicitante: 'Carlos Eduardo', turma: '3º B', data: '25/08/2026', horario: '10:00–11:40', status: 'aprovada' },
  { id: 3, lab: 'Laboratório 03', solicitante: 'Fernanda Lima', turma: '1º C', data: '26/08/2026', horario: '14:00–15:40', status: 'aprovada' },
  { id: 4, lab: 'Laboratório 02', solicitante: 'João Pedro', turma: '2º B', data: '26/08/2026', horario: '16:00–17:40', status: 'recusada' },
  { id: 5, lab: 'Laboratório 01', solicitante: 'Camila Rocha', turma: '3º A', data: '27/08/2026', horario: '08:00–09:40', status: 'pendente' },
];

const STATUS_LABEL = { pendente: 'Pendente', aprovada: 'Aprovada', recusada: 'Recusada' };
const STATUS_TONE = { pendente: 'warning', aprovada: 'success', recusada: 'danger' };

function render() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const app = document.getElementById('app');
  app.innerHTML = state.authed ? renderShell() : renderLogin();
  bindEvents();
}

function renderLogin() {
  return `
    <div class="login">
      <div class="login__panel">
        <div class="login__brand">
          <span class="login__brand-mark">\u{1F916}</span>
          <div>
            <p class="login__brand-name">Escola do Futuro</p>
            <p class="login__brand-sub">Sistema de Gestão Interna</p>
          </div>
        </div>
        <h1 class="login__tagline">Gestão inteligente para uma escola do futuro.</h1>
        <p class="login__desc">Acompanhe processos, reservas e solicitações da instituição em um único lugar.</p>
      </div>
      <div class="login__form-side">
        <form class="login__form" id="login-form">
          <h2>Entrar</h2>
          <p class="hint">Use suas credenciais institucionais para acessar o sistema.</p>
          ${state.loginError ? `<div class="login__alert">\u{26A0}\u{FE0F} <span>${state.loginError}</span></div>` : ''}
          <div class="field">
            <label>E-mail</label>
            <div class="field-control">
              <input id="email" type="email" placeholder="nome@escoladofuturo.com.br" value="${state.email}" />
            </div>
          </div>
          <div class="field">
            <label>Senha</label>
            <div class="field-control">
              <input id="password" type="${state.showPassword ? 'text' : 'password'}" placeholder="Digite sua senha" value="${state.password}" />
              <button type="button" id="toggle-pw">${state.showPassword ? '\u{1F648}' : '\u{1F441}\u{FE0F}'}</button>
            </div>
          </div>
          <div class="login__row">
            <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" /> Lembrar acesso</label>
          </div>
          <button type="submit" class="btn" style="width:100%;">${state.loginLoading ? 'Entrando…' : 'Entrar'}</button>
        </form>
      </div>
    </div>
  `;
}

function renderShell() {
  const [title, subtitle] = PAGE_META[state.page];
  return `
    <div class="shell active">
      <aside class="sidebar">
        <div class="sidebar__brand">
          <span class="sidebar__brand-mark">\u{1F916}</span>
          <div class="sidebar__brand-text"><b>EFG</b><span>Gestão Interna</span></div>
        </div>
        <nav class="sidebar__nav">
          ${NAV.map(n => `<button class="sidebar__item ${state.page === n.key ? 'active' : ''}" data-nav="${n.key}">${n.icon} <span>${n.label}</span></button>`).join('')}
        </nav>
        <div class="sidebar__footer">
          <span class="sidebar__avatar">${(state.email || 'U').charAt(0).toUpperCase()}</span>
          <div>
            <div class="sidebar__user-name">${state.email ? state.email.split('@')[0] : 'Usuário'}</div>
            <div class="sidebar__user-role">colaborador</div>
          </div>
          <button class="sidebar__logout" id="logout" title="Sair">\u{1F6AA}</button>
        </div>
      </aside>
      <div class="main">
        <header class="header">
          <div><h1>${title}</h1><p>${subtitle}</p></div>
          <div class="header__actions">
            <button class="icon-btn" id="theme-toggle" title="Alternar tema">${state.theme === 'dark' ? '\u{2600}\u{FE0F}' : '\u{1F319}'}</button>
            <button class="icon-btn" title="Notificações">\u{1F514}<span class="badge-dot">2</span></button>
          </div>
        </header>
        <main class="content">${renderPage()}</main>
      </div>
    </div>
  `;
}

function renderPage() {
  if (state.page === 'dashboard') return renderDashboard();
  if (state.page === 'laboratorios') return renderLaboratorios();
  const [title] = PAGE_META[state.page];
  return `
    <div class="empty-state">
      <div class="empty-state__icon">\u{1F6A7}</div>
      <h3>Módulo em desenvolvimento</h3>
      <p>Esta funcionalidade será disponibilizada nas próximas etapas do projeto.</p>
    </div>
  `;
}

function renderDashboard() {
  return `
    <div class="stats">
      ${stats.map(s => `
        <div class="card">
          <div class="stat-card__top"><span class="label">${s.label}</span><span class="stat-card__icon">${s.icon}</span></div>
          <p class="stat-card__value">${s.value}</p>
          <p class="stat-card__trend">${s.trend}</p>
        </div>
      `).join('')}
    </div>
    <div class="grid2">
      <div class="card">
        <h2 class="section-title">Pendências</h2>
        ${pendencias.map(p => `
          <div class="list-item">
            <span class="list-icon">${p.icon}</span>
            <div class="list-text"><span class="list-title">${p.title}</span><span class="list-caption">${p.desc}</span></div>
            <span class="badge badge--${p.tone}">${p.tone === 'warning' ? 'Pendente' : 'Info'}</span>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <h2 class="section-title">Atividades recentes</h2>
        ${atividades.map(a => `
          <div class="list-item">
            <span class="timeline-dot"></span>
            <div class="list-text"><span class="list-title">${a.title}</span><span class="list-caption">${a.desc}</span></div>
            <span class="list-caption">${a.time}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderLaboratorios() {
  const tabs = [
    { key: 'todas', label: 'Todas' },
    { key: 'pendente', label: 'Pendentes' },
    { key: 'aprovada', label: 'Aprovadas' },
    { key: 'recusada', label: 'Recusadas' },
  ];
  const filtered = reservas.filter(r => {
    const matchStatus = state.labFilter === 'todas' || r.status === state.labFilter;
    const q = state.labQuery.toLowerCase();
    const matchQuery = !q || r.solicitante.toLowerCase().includes(q) || r.turma.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  return `
    <div class="card toolbar">
      <div class="tabs">
        ${tabs.map(t => `
          <button class="tab ${state.labFilter === t.key ? 'active' : ''}" data-lab-tab="${t.key}">
            ${t.label}<span class="count">${t.key === 'todas' ? reservas.length : reservas.filter(r => r.status === t.key).length}</span>
          </button>
        `).join('')}
      </div>
      <div class="toolbar-row">
        <div class="search-input">
          \u{1F50D} <input id="lab-search" placeholder="Buscar por solicitante ou turma…" value="${state.labQuery}" />
        </div>
        <button class="btn">+ Nova reserva</button>
      </div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead><tr><th>Laboratório</th><th>Solicitante</th><th>Turma</th><th>Data</th><th>Horário</th><th>Status</th><th style="text-align:right;">Ações</th></tr></thead>
        <tbody>
          ${filtered.length === 0 ? `<tr><td colspan="7" style="text-align:center;color:var(--color-text-muted);padding:32px;">Nenhuma reserva encontrada</td></tr>` :
            filtered.map(r => `
              <tr>
                <td>${r.lab}</td><td>${r.solicitante}</td><td>${r.turma}</td><td>${r.data}</td><td>${r.horario}</td>
                <td><span class="badge badge--${STATUS_TONE[r.status]}">${STATUS_LABEL[r.status]}</span></td>
                <td>
                  <div class="row-actions">
                    ${r.status === 'pendente' ? `
                      <button class="btn btn--ghost btn--sm" data-approve="${r.id}">Aprovar</button>
                      <button class="btn btn--ghost btn--sm" data-reject="${r.id}">Recusar</button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function bindEvents() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      state.email = email; state.password = password;
      if (!email.includes('@') || password.length < 4) {
        state.loginError = 'E-mail ou senha inválidos.';
        render();
        return;
      }
      state.loginLoading = true; state.loginError = '';
      render();
      setTimeout(() => { state.loginLoading = false; state.authed = true; render(); }, 500);
    });
    document.getElementById('toggle-pw')?.addEventListener('click', () => {
      state.showPassword = !state.showPassword; render();
    });
  }

  document.getElementById('logout')?.addEventListener('click', () => {
    state.authed = false; state.page = 'dashboard'; render();
  });
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark'; render();
  });
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => { state.page = el.dataset.nav; render(); });
  });
  document.querySelectorAll('[data-lab-tab]').forEach(el => {
    el.addEventListener('click', () => { state.labFilter = el.dataset.labTab; render(); });
  });
  document.getElementById('lab-search')?.addEventListener('input', (e) => {
    state.labQuery = e.target.value; render();
  });
  document.querySelectorAll('[data-approve]').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.approve);
      reservas = reservas.map(r => r.id === id ? { ...r, status: 'aprovada' } : r);
      render();
    });
  });
  document.querySelectorAll('[data-reject]').forEach(el => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.reject);
      reservas = reservas.map(r => r.id === id ? { ...r, status: 'recusada' } : r);
      render();
    });
  });
}

render();
