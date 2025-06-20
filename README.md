# Sistema Municipal de Recursos Humanos - Frontend

Este é o frontend do Sistema Municipal de Recursos Humanos, desenvolvido em Angular com foco em boas práticas de desenvolvimento, experiência do usuário e arquitetura limpa.

## 🚀 Tecnologias Utilizadas

- **Angular 18** - Framework principal com standalone components
- **Angular Material** - Componentes de UI e Design System
- **TypeScript** - Linguagem de programação com tipagem forte
- **RxJS** - Programação reativa para operações assíncronas
- **SCSS** - Pré-processador CSS para estilização
- **Material Icons** - Ícones do Google Material Design
- **Roboto Font** - Tipografia padrão do Material Design

## 📋 Funcionalidades

### 🏛️ Gerenciamento de Secretarias
- Listagem completa com paginação e ordenação
- Cadastro de novas secretarias com validação
- Edição de secretarias existentes
- Exclusão com confirmação de segurança
- **Validações:**
  - Nome: obrigatório, 2-100 caracteres
  - Sigla: obrigatória, 2-10 caracteres, deve ser única

### 👥 Gerenciamento de Servidores
- Listagem completa com paginação e ordenação
- Cadastro de novos servidores com validação completa
- Edição de servidores existentes
- Exclusão com confirmação de segurança
- Associação obrigatória com secretaria
- **Validações:**
  - Nome: obrigatório, 2-100 caracteres
  - Email: obrigatório, formato válido, deve ser único
  - Data de nascimento: obrigatória, idade entre 18-75 anos
  - Secretaria: obrigatória, deve existir no sistema

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/app/
├── components/                    # Componentes da aplicação
│   ├── dashboard.component.ts     # Tela principal com tabs
│   ├── secretarias/
│   │   ├── secretarias-list.component.ts      # Lista de secretarias
│   │   ├── secretaria-form-dialog.component.ts # Formulário de secretaria
│   │   └── index.ts               # Barrel exports
│   └── servidores/
│       ├── servidores-list.component.ts       # Lista de servidores
│       ├── servidor-form-dialog.component.ts  # Formulário de servidor
│       └── index.ts               # Barrel exports
├── models/                        # Interfaces e tipos TypeScript
│   ├── secretaria.model.ts        # Modelo da Secretaria
│   ├── servidor.model.ts          # Modelo do Servidor
│   ├── api-response.model.ts      # Tipos de resposta da API
│   └── index.ts                   # Barrel exports
├── services/                      # Serviços para comunicação
│   ├── base-api.service.ts        # Serviço base com tratamento de erros
│   ├── secretaria.service.ts      # Operações CRUD de secretarias
│   ├── servidor.service.ts        # Operações CRUD de servidores
│   ├── notification.service.ts    # Serviço de notificações
│   └── index.ts                   # Barrel exports
└── shared/                        # Componentes compartilhados
    ├── components/
    │   ├── loading-spinner.component.ts       # Spinner de carregamento
    │   ├── confirmation-dialog.component.ts   # Dialog de confirmação
    │   └── index.ts               # Barrel exports
    └── utils/                     # Utilitários (reservado para futuro)
```

### Princípios Aplicados

- **Standalone Components** - Arquitetura moderna do Angular 18
- **Reactive Forms** - Validação robusta e experiência fluida
- **Programação Reativa** - RxJS para operações assíncronas
- **Tratamento Centralizado de Erros** - User-friendly e consistente
- **Responsive Design** - Adaptável a todos os dispositivos
- **Loading States** - Feedback visual durante operações
- **Confirmações de Segurança** - Para operações destrutivas
- **Clean Code** - Código limpo e bem documentado
- **TypeScript Strict Mode** - Tipagem forte em todo o projeto

## 🎨 Interface do Usuário

### Design System
- **Material Design 3** - Sistema de design moderno
- **Paleta de cores** - Tema Indigo/Pink pré-configurado
- **Tipografia** - Roboto em diferentes pesos (300, 400, 500)
- **Ícones** - Material Icons via Google Fonts
- **Animações** - Transições suaves e feedback visual
- **Acessibilidade** - Tooltips, labels e navegação por teclado

### Componentes Principais
- **Dashboard** - Interface principal com navegação por tabs
- **Tabelas de Dados** - Com ordenação e paginação Material
- **Formulários Modais** - Dialogs para criação e edição
- **Estados de Loading** - Spinners e progress bars
- **Notificações** - Snackbars para feedback de ações
- **Confirmações** - Dialogs para operações críticas

### Funcionalidades de UX
- **Estados de Loading** - Durante carregamento de dados
- **Estados de Erro** - Com opção de retry
- **Estados Vazios** - Quando não há dados para exibir
- **Feedback Visual** - Para todas as ações do usuário
- **Responsividade** - Interface adaptável a qualquer tela

## 🔧 Instalação e Execução

### Pré-requisitos
- **Node.js** 18.0.0 ou superior
- **npm** 9.0.0 ou superior (ou yarn equivalente)
- **Angular CLI** 18.0.0 ou superior (opcional, mas recomendado)

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do frontend
cd municipal-client

# Instale as dependências
npm install

# Instale o Angular CLI globalmente (opcional)
npm install -g @angular/cli
```

### Comandos de Execução
```bash
# Servidor de desenvolvimento
npm start
# ou
ng serve
# Aplicação disponível em http://localhost:4200

# Build para produção
npm run build
# ou
ng build --configuration production

# Servidor de desenvolvimento com hot reload
ng serve --open
```

### Comandos de Teste
```bash
# Testes unitários
npm test
# ou
ng test

# Testes com coverage
ng test --code-coverage

# Testes end-to-end (se configurado)
ng e2e

# Lint do código
ng lint
```

## 🌐 Configuração da API

Por padrão, a aplicação conecta à API backend em `http://localhost:8080/api`.

### Endpoints utilizados:
- **Secretarias:**
  - `GET /secretarias` - Listar todas
  - `POST /secretarias` - Criar nova
  - `PUT /secretarias/{id}` - Atualizar
  - `DELETE /secretarias/{id}` - Excluir

- **Servidores:**
  - `GET /servidores` - Listar todos
  - `POST /servidores` - Criar novo
  - `PUT /servidores/{id}` - Atualizar
  - `DELETE /servidores/{id}` - Excluir

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints:

- **Desktop** (1200px+) - Layout completo com todas as colunas
- **Tablet** (768px - 1199px) - Layout adaptado com colunas essenciais
- **Mobile** (< 768px) - Layout otimizado para toque

### Funcionalidades Responsivas:
- Tabelas com scroll horizontal em telas pequenas
- Formulários adaptáveis ao tamanho da tela
- Botões e ícones otimizados para toque
- Navegação simplificada em dispositivos móveis

## 🔐 Segurança e Validação

### Validações Client-side:
- **Secretarias:** Nome e sigla obrigatórios, limites de caracteres
- **Servidores:** Nome, email, data nascimento e secretaria obrigatórios
- **Idade:** Validação automática para faixa 18-75 anos
- **Email:** Validação de formato e unicidade
- **Datas:** Validação de formato e valores lógicos

**Angular:** 18.x  
**Material:** 18.x  
**TypeScript:** 5.x
