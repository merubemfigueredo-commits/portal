# Central de Ferramentas Fiscais

Página inicial em React + Vite que reúne sete ferramentas fiscais e financeiras brasileiras em um único lugar.

## O que está incluído

- Busca por nome, tema ou finalidade
- Filtros por categoria
- Cards responsivos com acesso direto
- Links que abrem as ferramentas em uma nova aba
- Navegação responsiva para celular
- Seção explicando o fluxo de uso
- Metadados básicos para compartilhamento e mecanismos de busca

## Requisitos

- Node.js 20 ou superior
- npm 10 ou pnpm 9 ou superior

## Como executar

Dentro desta pasta, instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:5173` no navegador.

## Como gerar a versão de produção

```bash
npm run build
npm run serve
```

A versão compilada ficará em `dist/public`.

## Ferramentas vinculadas

Os cards direcionam para as aplicações originais:

- [Calculadoras fiscais](https://calc-fiscal.streamlit.app/)
- [DFCs](https://dfc-app.streamlit.app/)
- [Diário de caixa](https://diariocx.streamlit.app/)
- [DRE](https://create-dre.streamlit.app/)
- [Índices financeiros](https://indices-financeiros.streamlit.app/)
- [Risco e retorno](https://risco-retorno.streamlit.app/)
- [Simples Nacional](https://s-nacional.streamlit.app/)

## Personalização

Para alterar os nomes, descrições, categorias, cores ou links, edite o array `tools` em:

```text
src/App.tsx
```

Para alterar cores, tipografia e aparência global, edite:

```text
src/index.css
```
