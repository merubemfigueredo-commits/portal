import { type CSSProperties, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  Calculator,
  ChartNoAxesCombined,
  Check,
  CircleDollarSign,
  ClipboardList,
  ExternalLink,
  FileBarChart,
  Landmark,
  Menu,
  MoveRight,
  PiggyBank,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

const queryClient = new QueryClient();

type Tool = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  category: string;
  tag: string;
  url: string;
  icon: typeof Calculator;
  accent: string;
  featured?: boolean;
};

const tools: Tool[] = [
  {
    id: 'calculadoras-fiscais',
    title: 'Calculadoras fiscais',
    eyebrow: 'Cálculo tributário',
    description: 'ICMS, ISS, PIS, COFINS e outros cálculos reunidos para consultas rápidas e seguras.',
    category: 'Tributário',
    tag: 'Mais acessada',
    url: 'https://calc-fiscal.streamlit.app/',
    icon: Calculator,
    accent: '#dfb54a',
    featured: true,
  },
  {
    id: 'dfcs',
    title: 'DFCs',
    eyebrow: 'Fluxo de caixa',
    description: 'Estruture e analise a demonstração dos fluxos de caixa da sua empresa.',
    category: 'Financeiro',
    tag: 'Gestão',
    url: 'https://dfc-app.streamlit.app/',
    icon: ArrowDownToLine,
    accent: '#4a9b8f',
  },
  {
    id: 'diario-de-caixa',
    title: 'Diário de caixa',
    eyebrow: 'Rotina financeira',
    description: 'Registre movimentações, acompanhe saldos e mantenha o caixa sob controle.',
    category: 'Financeiro',
    tag: 'Rotina',
    url: 'https://diariocx.streamlit.app/',
    icon: ClipboardList,
    accent: '#d78262',
  },
  {
    id: 'dre',
    title: 'DRE',
    eyebrow: 'Resultado',
    description: 'Monte uma visão clara de receitas, custos e resultado operacional.',
    category: 'Financeiro',
    tag: 'Análise',
    url: 'https://create-dre.streamlit.app/',
    icon: FileBarChart,
    accent: '#5787ac',
  },
  {
    id: 'indices',
    title: 'Índices financeiros',
    eyebrow: 'Saúde do negócio',
    description: 'Calcule liquidez, rentabilidade e endividamento para interpretar o negócio.',
    category: 'Análise',
    tag: 'Indicadores',
    url: 'https://indices-financeiros.streamlit.app/',
    icon: ChartNoAxesCombined,
    accent: '#b77a9e',
  },
  {
    id: 'risco-e-retorno',
    title: 'Risco e retorno',
    eyebrow: 'Decisão',
    description: 'Compare cenários, visualize o risco e dê mais contexto às suas escolhas.',
    category: 'Análise',
    tag: 'Cenários',
    url: 'https://risco-retorno.streamlit.app/',
    icon: TrendingUp,
    accent: '#728d5a',
  },
  {
    id: 'simples-nacional',
    title: 'Simples Nacional',
    eyebrow: 'Regime tributário',
    description: 'Encontre a faixa e estime a alíquota para empresas do Simples Nacional.',
    category: 'Tributário',
    tag: 'Regimes',
    url: 'https://s-nacional.streamlit.app/',
    icon: Landmark,
    accent: '#c48d4a',
  },
];

const categories = ['Todos', 'Tributário', 'Financeiro', 'Análise'];

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = tool.icon;
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noreferrer"
      data-testid={`link-tool-${tool.id}`}
      className={`tool-card reveal reveal-delay-${Math.min(index + 1, 4)} group flex min-h-[248px] flex-col rounded-[1.15rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 no-underline`}
      style={{ '--tool-accent': tool.accent } as CSSProperties}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-2xl text-[hsl(var(--foreground))]"
          style={{ backgroundColor: `${tool.accent}24` }}
        >
          <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
        </div>
        <span className="rounded-full border border-[hsl(var(--border))] px-2.5 py-1 font-data text-[10px] font-medium uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
          {tool.tag}
        </span>
      </div>
      <div className="mt-7">
        <p className="font-data text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--primary))]">{tool.eyebrow}</p>
        <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.02em] text-[hsl(var(--card-foreground))]">{tool.title}</h3>
        <p className="mt-2 max-w-[34ch] text-sm leading-6 text-[hsl(var(--muted-foreground))]">{tool.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))]">
          Abrir ferramenta <ExternalLink aria-hidden="true" size={14} />
        </span>
        <ArrowRight aria-hidden="true" className="card-arrow text-[hsl(var(--muted-foreground))]" size={17} />
      </div>
    </a>
  );
}

function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleTools = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase('pt-BR').trim();
    return tools.filter((tool) => {
      const matchesCategory = category === 'Todos' || tool.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${tool.title} ${tool.description} ${tool.eyebrow} ${tool.category}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const resetFilters = () => {
    setQuery('');
    setCategory('Todos');
  };

  return (
    <main className="app-shell min-h-[100dvh] overflow-hidden">
      <header className="relative z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.82)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <a href="#inicio" data-testid="link-brand" className="flex items-center gap-3 no-underline">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[0_7px_0_hsl(var(--accent))]">
              <CircleDollarSign aria-hidden="true" size={22} strokeWidth={1.8} />
            </span>
            <span className="leading-none">
              <strong className="block font-display text-[15px] font-bold tracking-[-0.03em] text-[hsl(var(--foreground))]">Central de</strong>
              <span className="block pt-1 font-data text-[10px] font-medium uppercase tracking-[0.16em] text-[hsl(var(--primary))]">Ferramentas fiscais</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
            <a href="#ferramentas" data-testid="link-nav-ferramentas" className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">Ferramentas</a>
            <a href="#como-funciona" data-testid="link-nav-como-funciona" className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">Como funciona</a>
            <a href="#rodape" data-testid="link-nav-sobre" className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">Sobre a central</a>
          </nav>
          <button
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-toggle-menu"
            className="flex size-10 items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] md:hidden"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-[hsl(var(--border))] px-5 py-3 md:hidden" aria-label="Navegação móvel">
            <a href="#ferramentas" onClick={() => setMenuOpen(false)} data-testid="link-mobile-ferramentas" className="block border-b border-[hsl(var(--border))] py-3 text-sm font-medium">Ferramentas</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)} data-testid="link-mobile-como-funciona" className="block border-b border-[hsl(var(--border))] py-3 text-sm font-medium">Como funciona</a>
            <a href="#rodape" onClick={() => setMenuOpen(false)} data-testid="link-mobile-sobre" className="block py-3 text-sm font-medium">Sobre a central</a>
          </nav>
        )}
      </header>

      <section id="inicio" className="hero-mesh relative isolate overflow-hidden text-[hsl(var(--sidebar-foreground))]">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:px-10 lg:pb-28">
          <div className="reveal max-w-2xl">
            <div className="mb-7 flex items-center gap-3 font-data text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--sidebar-primary))]">
              <span className="size-2 rounded-full bg-[hsl(var(--sidebar-primary))]" />
              Sete instrumentos à sua disposição
            </div>
            <h1 className="text-balance font-display text-[clamp(3.25rem,8vw,6.65rem)] font-semibold leading-[.91] tracking-[-0.075em]">
              A conta certa começa <span className="text-[hsl(var(--sidebar-primary))]">aqui.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-[hsl(var(--sidebar-foreground)/.72)] sm:text-lg">
              Um ponto de partida confiável para cálculos fiscais, análises financeiras e decisões mais bem informadas.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#ferramentas" data-testid="link-hero-ferramentas" className="group inline-flex items-center gap-3 rounded-lg bg-[hsl(var(--sidebar-primary))] px-5 py-3.5 text-sm font-bold text-[hsl(var(--sidebar-primary-foreground))] no-underline transition-transform hover:-translate-y-0.5">
                Explorar ferramentas <MoveRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" size={17} />
              </a>
              <span className="font-data text-[10px] uppercase tracking-[0.12em] text-[hsl(var(--sidebar-foreground)/.55)]">Sem cadastro · acesso direto</span>
            </div>
          </div>
          <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[510px]">
            <div className="absolute -inset-5 rounded-[2rem] border border-[hsl(var(--sidebar-primary)/.18)]" />
            <div className="relative rounded-[1.3rem] border border-[hsl(var(--sidebar-foreground)/.14)] bg-[hsl(var(--sidebar)/.6)] p-5 shadow-2xl backdrop-blur-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-[hsl(var(--sidebar-foreground)/.15)] pb-5">
                <div>
                  <p className="font-data text-[10px] uppercase tracking-[.16em] text-[hsl(var(--sidebar-foreground)/.52)]">Painel de instrumentos</p>
                  <p className="mt-2 font-display text-lg font-semibold">Escolha seu próximo cálculo</p>
                </div>
                <Sparkles aria-hidden="true" className="text-[hsl(var(--sidebar-primary))]" size={20} />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-5">
                {[
                  { icon: Calculator, label: 'Tributos', value: '03' },
                  { icon: BarChart3, label: 'Finanças', value: '04' },
                  { icon: ShieldCheck, label: 'Confiável', value: '01' },
                  { icon: PiggyBank, label: 'Direto ao ponto', value: '∞' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-[hsl(var(--sidebar-foreground)/.12)] bg-[hsl(var(--sidebar-foreground)/.04)] p-4">
                    <Icon aria-hidden="true" size={18} className="mb-5 text-[hsl(var(--sidebar-primary))]" strokeWidth={1.7} />
                    <div className="flex items-end justify-between gap-2">
                      <span className="text-xs text-[hsl(var(--sidebar-foreground)/.62)]">{label}</span>
                      <span className="font-data text-sm text-[hsl(var(--sidebar-foreground))]">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-xl bg-[hsl(var(--sidebar-primary)/.12)] p-3 text-xs text-[hsl(var(--sidebar-foreground)/.72)]">
                <Check aria-hidden="true" className="text-[hsl(var(--sidebar-primary))]" size={16} />
                Ferramentas abertas em uma nova aba
              </div>
            </div>
          </div>
        </div>
        <div className="instrument-line absolute bottom-0 left-0 right-0 opacity-60" />
      </section>

      <section id="ferramentas" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="reveal max-w-xl">
            <p className="font-data text-[10px] font-semibold uppercase tracking-[.2em] text-[hsl(var(--primary))]">A sua bancada de trabalho</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.06em] text-[hsl(var(--foreground))] sm:text-5xl">Instrumentos para o dia a dia.</h2>
            <p className="mt-4 text-base leading-7 text-[hsl(var(--muted-foreground))]">Encontre o que precisa, abra a ferramenta e volte para a sua decisão. Sem caminhos longos.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 font-data text-xs text-[hsl(var(--muted-foreground))]">
            <span className="size-2 rounded-full bg-[hsl(var(--accent))]" />
            {tools.length.toString().padStart(2, '0')} ferramentas disponíveis
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.65)] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-2">
          <label className="relative flex min-h-12 flex-1 items-center">
            <Search aria-hidden="true" className="absolute left-4 text-[hsl(var(--muted-foreground))]" size={19} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome, tema ou finalidade..."
              aria-label="Buscar ferramentas"
              data-testid="input-search-tools"
              className="h-full w-full rounded-xl border-0 bg-transparent pl-12 pr-4 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring)/.2)]"
            />
          </label>
          <div className="flex gap-1 overflow-x-auto px-1 pb-1 sm:pb-0">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                data-testid={`button-filter-${item.toLocaleLowerCase('pt-BR')}`}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${category === item ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="font-data text-[11px] text-[hsl(var(--muted-foreground))]" data-testid="text-results-count">
            Mostrando <span className="font-semibold text-[hsl(var(--foreground))]">{visibleTools.length.toString().padStart(2, '0')}</span> de {tools.length.toString().padStart(2, '0')}
          </p>
          {(query || category !== 'Todos') && (
            <button type="button" onClick={resetFilters} data-testid="button-reset-filters" className="flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))] hover:underline">
              <RotateCcw size={13} /> Limpar filtros
            </button>
          )}
        </div>

        {visibleTools.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTools.map((tool, index) => <ToolCard key={tool.id} tool={tool} index={index} />)}
          </div>
        ) : (
          <div className="mt-5 flex min-h-[300px] flex-col items-center justify-center rounded-[1.15rem] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card)/.45)] px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[hsl(var(--muted))] text-[hsl(var(--primary))]"><Search size={23} /></div>
            <h3 className="mt-5 font-display text-xl font-semibold">Nenhum instrumento encontrado</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">Tente outra palavra ou volte à visão completa da central.</p>
            <button type="button" onClick={resetFilters} data-testid="button-empty-reset" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5">
              <RotateCcw size={14} /> Ver todas as ferramentas
            </button>
          </div>
        )}
      </section>

      <section id="como-funciona" className="scroll-mt-16 border-y border-[hsl(var(--border))] bg-[hsl(var(--muted)/.55)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="font-data text-[10px] font-semibold uppercase tracking-[.2em] text-[hsl(var(--primary))]">Um jeito simples</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-.06em] sm:text-5xl">Da dúvida à clareza em três movimentos.</h2>
            </div>
            <div className="divide-y divide-[hsl(var(--border))]">
              {[
                ['01', 'Escolha o instrumento', 'Cada ferramenta tem uma finalidade clara. Comece pelo assunto que você precisa analisar.'],
                ['02', 'Preencha com seus dados', 'As aplicações foram desenhadas para consultas objetivas, com o contexto que importa.'],
                ['03', 'Use o resultado', 'Abra, calcule e leve a informação para a próxima decisão do seu negócio.'],
              ].map(([number, title, text]) => (
                <div key={number} className="grid gap-4 py-6 sm:grid-cols-[64px_1fr] sm:gap-6 first:pt-0 last:pb-0">
                  <span className="font-data text-sm font-semibold text-[hsl(var(--accent))]">{number}</span>
                  <div><h3 className="font-display text-xl font-semibold">{title}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-[hsl(var(--muted-foreground))]">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer id="rodape" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-10 border-b border-[hsl(var(--border))] pb-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><CircleDollarSign size={19} /></span>
              <span className="font-display text-lg font-bold tracking-[-.04em]">Central de Ferramentas</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Uma coleção prática para quem transforma números em decisões todos os dias.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-3">
            {tools.map((tool) => <a key={tool.id} href={tool.url} target="_blank" rel="noreferrer" data-testid={`link-footer-${tool.id}`} className="flex items-center gap-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">{tool.title}<ExternalLink size={11} /></a>)}
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-[11px] text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
          <span>Feito para a rotina fiscal e financeira brasileira.</span>
          <span className="flex items-center gap-2"><ExternalLink size={12} /> Todos os instrumentos abrem em uma nova aba.</span>
        </div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
