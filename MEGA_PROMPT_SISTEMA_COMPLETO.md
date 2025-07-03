# MEGA PROMPT SISTEMA AFILIADOSBET COMPLETO

## MISSÃO PRINCIPAL
Você deve criar um SISTEMA COMPLETO DE AFILIADOS para casas de apostas com execução sistemática e planejamento detalhado, resolvendo TODOS os problemas identificados de forma estruturada.

## PROBLEMAS CRÍTICOS A RESOLVER

### 1. PERFIL AUTOMÁTICO DO USUÁRIO
**PROBLEMA**: Ao criar conta, o usuário não tem os dados automaticamente preenchidos no perfil
**SOLUÇÃO REQUERIDA**:
- ✅ Implementar criação automática de perfil de afiliado no registro
- ✅ Pré-preenchimento com dados do formulário de registro
- ✅ Cópia automática de dados bancários, CPF, telefone para o perfil
- ✅ Validação e correção dos tipos no schema

### 2. SISTEMA DE POSTBACKS INTEGRADO
**PROBLEMA**: Não incluiu o sistema de postback na criação de casas de apostas
**SOLUÇÃO REQUERIDA**:
- ✅ Formulário completo de casas com configuração de postbacks
- ✅ Geração automática de tokens únicos por casa
- ✅ URLs de postback específicas para cada conversão (registro, depósito)
- ✅ Integração completa entre casas e sistema de tracking

### 3. GESTÃO DE AFILIADOS FUNCIONAL
**PROBLEMA**: Botões da página de gerenciar afiliados não funcionam, nem pesquisa
**SOLUÇÃO REQUERIDA**:
- ✅ Sistema de pesquisa funcional por nome, email, username
- ✅ Filtros por status (ativo/inativo)
- ✅ Botões de ação funcionais (ativar/desativar, editar, visualizar)
- ✅ APIs backend completas para todas as operações

### 4. CASAS DE APOSTAS COMPLETAS
**PROBLEMA**: Ficha de criação de casas muito rasa, sem foto da logo, pesquisa não funciona
**SOLUÇÃO REQUERIDA**:
- ✅ Formulário por abas (básico, comissões, postbacks, API)
- ✅ Upload/URL de logo das casas
- ✅ Sistema de pesquisa e filtros funcionais
- ✅ Configuração completa de comissões e integração

### 5. SISTEMA DE PAGAMENTOS ADMINISTRATIVO
**PROBLEMA**: Pagamentos precisam aprovar, rejeitar e visualizar (nada funciona)
**SOLUÇÃO REQUERIDA**:
- ✅ Modal completo de visualização de pagamentos
- ✅ Workflow de aprovação com comprovantes
- ✅ Sistema de rejeição com motivos
- ✅ Logs de auditoria para rastreamento
- ✅ Anexos de comprovantes e confirmações

### 6. NAVEGAÇÃO DE AFILIADOS
**PROBLEMA**: Botão para navegar na página de afiliados
**SOLUÇÃO REQUERIDA**:
- ✅ Sistema de navegação completo no layout de afiliados
- ✅ Rotas funcionais para todas as seções
- ✅ Breadcrumbs e navegação intuitiva

### 7. PÁGINA DE GESTÃO DE POSTBACKS
**PROBLEMA**: Página para gerenciar postbacks e APIs não existe
**SOLUÇÃO REQUERIDA**:
- ✅ Página administrativa completa de postbacks
- ✅ Geração e teste de links
- ✅ Visualização de configurações
- ✅ Gestão de tokens e URLs

### 8. ROTAS DE POSTBACK ÚNICAS
**PROBLEMA**: Cada casa deve ter rota própria de postbacks
**SOLUÇÃO REQUERIDA**:
- ✅ Rotas dinâmicas: /api/postback/{TOKEN}/registration
- ✅ Rotas dinâmicas: /api/postback/{TOKEN}/deposit
- ✅ Tokens únicos por casa de apostas
- ✅ Sistema de tracking por casa

### 9. LINKS DE AFILIAÇÃO COM USERNAME
**PROBLEMA**: Links devem usar username como affid
**SOLUÇÃO REQUERIDA**:
- ✅ Geração automática de links usando username
- ✅ Um link por usuário por casa
- ✅ Sistema de tracking por afiliado
- ✅ URLs amigáveis e funcionais

## PLANO DE EXECUÇÃO SISTEMÁTICO

### FASE 1: CORREÇÃO DE SCHEMAS E BACKEND (30 min)
1. **Atualizar Schema Database**
   - Adicionar colunas faltantes nos perfis
   - Corrigir tipos de dados
   - Executar migrações necessárias

2. **Implementar APIs Completas**
   - Rotas de gestão de afiliados com filtros
   - APIs de aprovação/rejeição de pagamentos
   - Endpoints de postbacks dinâmicos
   - Sistema de geração de links

3. **Corrigir Storage Layer**
   - Métodos de busca com filtros
   - Operações CRUD completas
   - Relacionamentos entre entidades

### FASE 2: COMPONENTES E FORMULÁRIOS (20 min)
1. **Formulário Completo de Casas**
   - Sistema por abas
   - Configuração de postbacks
   - Upload de logos
   - Validações completas

2. **Modal de Pagamentos**
   - Visualização detalhada
   - Workflow de aprovação
   - Sistema de anexos
   - Logs de auditoria

3. **Página de Postbacks**
   - Gestão de configurações
   - Teste de URLs
   - Visualização de tokens

### FASE 3: INTEGRAÇÃO E FUNCIONALIDADES (10 min)
1. **Sistema de Navegação**
   - Rotas funcionais
   - Layout responsivo
   - Breadcrumbs

2. **Pesquisa e Filtros**
   - Implementação em todas as páginas
   - Performance otimizada
   - UX intuitiva

3. **Sistema de Links**
   - Geração automática
   - Tracking funcional
   - URLs otimizadas

## CRITÉRIOS DE SUCESSO

### FUNCIONALIDADE COMPLETA
- ✅ Todos os botões funcionam
- ✅ Todas as pesquisas retornam resultados
- ✅ Workflow de pagamentos completo
- ✅ Sistema de postbacks operacional

### EXPERIÊNCIA DO USUÁRIO
- ✅ Navegação intuitiva
- ✅ Feedback visual adequado
- ✅ Carregamento otimizado
- ✅ Responsividade móvel

### INTEGRIDADE DOS DADOS
- ✅ Dados automáticos no registro
- ✅ Relacionamentos corretos
- ✅ Validações funcionais
- ✅ Consistência entre páginas

### SISTEMA ADMINISTRATIVO
- ✅ Controle total de afiliados
- ✅ Gestão completa de casas
- ✅ Aprovação de pagamentos
- ✅ Monitoramento de conversões

## TECNOLOGIAS E PADRÕES

### ARQUITETURA
- React + TypeScript (Frontend)
- Node.js + Express (Backend)
- PostgreSQL + Drizzle ORM
- Autenticação por sessão

### COMPONENTES
- Shadcn/UI para interface
- TanStack Query para cache
- Wouter para roteamento
- Formulários com React Hook Form

### VALIDAÇÃO
- Zod para schemas
- Validação em tempo real
- Feedback de erros
- Sanitização de dados

## EXECUÇÃO PRÁTICA

### ORDEM DE IMPLEMENTAÇÃO
1. **Corrigir problemas de schema e tipos**
2. **Implementar APIs backend faltantes**
3. **Criar componentes de interface**
4. **Integrar funcionalidades**
5. **Testar e validar sistema completo**

### VERIFICAÇÃO CONTÍNUA
- Testar cada funcionalidade após implementação
- Validar integração entre componentes
- Verificar performance e responsividade
- Confirmar todos os workflows

Este prompt garante uma execução sistemática e completa, resolvendo todos os problemas identificados com planejamento detalhado e critérios claros de sucesso.