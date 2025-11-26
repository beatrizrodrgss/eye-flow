# EYE-Flow - Sistema de Totem Acessível com Rastreamento Ocular

## Arquivos a Criar/Modificar

### 1. src/lib/webgazer-manager.ts
- Gerenciador do WebGazer
- Inicialização e calibração de 16 pontos
- Detecção de olhar com dwell time de 2s
- Controle de câmera e ponto vermelho

### 2. src/hooks/useEyeTracking.ts
- Hook customizado para rastreamento ocular
- Gerenciamento de estado de calibração
- Detecção de elementos focados pelo olhar
- Feedback visual de progresso (2s)

### 3. src/components/EyeTrackingCalibration.tsx
- Componente de calibração de 16 pontos
- Interface visual para calibração
- Feedback de progresso

### 4. src/components/EyeTrackingOverlay.tsx
- Overlay com câmera visível
- Ponto vermelho de rastreamento
- Botão de recalibração

### 5. src/components/Layout.tsx
- Layout principal com sidebar fixa
- 4 botões de navegação (Banco, Restaurante, Hospital, Configurações)
- Alternador de tema escuro
- Botão de suporte

### 6. src/pages/Index.tsx
- Tela inicial do EYE-Flow
- 3 botões principais (Banking, Restaurante, Totem Hospital)
- Integração com rastreamento ocular

### 7. src/pages/Banking.tsx
- Módulo Banco completo
- Fluxos: PIX, Saldo, TED/DOC
- Estados e navegação entre subfluxos

### 8. src/pages/Restaurant.tsx
- Módulo Restaurante completo
- Fluxos: Pedido, Retirada, Acompanhar Pedido
- Gerenciamento de pedidos

### 9. src/pages/Hospital.tsx
- Módulo Hospital completo
- Fluxos: Check-in, Agendar, Status da Consulta
- Gerenciamento de consultas

### 10. src/App.tsx
- Configuração de rotas
- Provider de tema
- Inicialização do WebGazer

### 11. src/index.css
- Estilos globais
- Tema azul pastel e branco
- Tema escuro com azul mais escuro
- Estilos para elementos arredondados

### 12. index.html
- Atualizar título para EYE-Flow
- Meta tags apropriadas

## Dependências Adicionais
- webgazer: ^2.0.0 (rastreamento ocular)
- zustand: para gerenciamento de estado global

## Cores do Sistema
- Tema Claro: Azul pastel (#A8DADC, #457B9D, #F1FAEE)
- Tema Escuro: Azul escuro (#1D3557, #457B9D, #A8DADC)
- Acentos: Branco e variações de azul

## Fluxo de Desenvolvimento
1. ✅ Estrutura base e configuração
2. ⏳ Sistema WebGazer e calibração
3. ⏳ Layout e componentes base
4. ⏳ Módulo Banco
5. ⏳ Módulo Restaurante
6. ⏳ Módulo Hospital
7. ⏳ Refinamento de UI/UX
8. ⏳ Testes de usabilidade