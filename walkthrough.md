# Vendo Ideias Imóveis - Walkthrough

O projeto "Vendo Ideias Imóveis" foi reconstruído com sucesso utilizando React 19, TypeScript, Vite e TailwindCSS.

## Funcionalidades Implementadas

### 1. Gestão Visual (Kanban)
- **Drag & Drop**: Mova imóveis entre "Disponível", "Reservado" e "Alugado".
- **Cards Ricos**: Visualização rápida de preço, endereço e status.

### 2. Autenticação & Segurança
- **Login Admin**: Usuário `vendoideias` / Senha `vendo1010`.
- **Social Login**: Simulação de login com Google.
- **Gestão de Perfil**: Edição de nome, email e foto.

### 3. Gestão de Entidades
- **CRUD Completo**: Criação e edição de Imóveis, Proprietários e Inquilinos.
- **Relacionamentos**: Vínculo automático entre Proprietários e Imóveis.

### 4. Exportação de Documentos
- **Ficha do Imóvel (PDF)**: Gere fichas técnicas com um clique.
- **Documentos do Inquilino (ZIP)**: Baixe pacote de documentos (Contrato, Vistoria).

## Como Rodar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse `http://localhost:5173`.

## Deploy e GitHub

- **Deploy**: Consulte [DEPLOY.md](file:///home/fabiano-martinelli/novo crm/DEPLOY.md) para instruções de deploy no Coolify/Oracle Cloud.
- **GitHub**: Consulte [GITHUB_INSTRUCTIONS.md](file:///home/fabiano-martinelli/novo crm/GITHUB_INSTRUCTIONS.md) para enviar o código para seu repositório.

## Estrutura de Arquivos

- `src/components`: Componentes UI (Sidebar, Kanban, Cards).
- `src/services`: Dados mockados e lógica de inicialização.
- `src/types.ts`: Definições de tipos TypeScript.
- `Dockerfile`: Configuração para deploy em container.
