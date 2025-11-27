# 👁️ Eye-Flow

**Sistema de navegação por rastreamento ocular para acessibilidade digital**

Eye-Flow é uma aplicação web inovadora que permite a navegação completa através do rastreamento ocular, tornando interfaces digitais acessíveis para pessoas com mobilidade reduzida. O sistema utiliza a webcam para detectar o movimento dos olhos e permite interações apenas olhando para os elementos da tela.

---

## 🎯 Funcionalidades

### 🏦 **Módulo Bancário (Banco)**
- Transferências PIX
- Consulta de saldo (Poupança, Conta Corrente, Investimentos)
- Transferências TED
- Confirmação de operações com segurança

### 🍔 **Módulo Restaurante**
- Fazer pedidos de combos
- Sistema de retirada
- Acompanhamento de pedidos em tempo real

### 🏥 **Módulo Hospitalar (Totem Hospital)**
- Check-in por período (Manhã, Tarde, Noite)
- Agendamento de consultas
- Consulta de status de agendamentos

### ⚙️ **Recursos de Acessibilidade**
- ✅ **Rastreamento ocular** com WebGazer.js
- ✅ **Navegação por mouse** (modo alternativo)
- ✅ **Tempo de dwell configurável** (1 segundo padrão)
- ✅ **Feedback visual** com progresso de foco
- ✅ **Modo escuro/claro**
- ✅ **Interface responsiva**

---

## 🚀 Tecnologias Utilizadas

- **React** 18 + TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **WebGazer.js** - Rastreamento ocular
- **React Router** - Navegação
- **Lucide React** - Ícones
- **Shadcn/ui** - Componentes UI

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- Webcam funcional
- Navegador moderno (Chrome, Edge, Firefox)

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/beatrizrodrgss/eye-flow.git
cd eye-flow
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:5173
```

---

## 🎮 Como Usar

### 1️⃣ **Calibração Inicial**

Ao abrir a aplicação pela primeira vez:
1. **Permita o acesso à webcam** quando solicitado
2. Você verá uma **grade de pontos de calibração**
3. **Clique em cada ponto** olhando diretamente para ele
4. Complete todos os 16 pontos para melhor precisão

💡 **Dica**: Mantenha a cabeça relativamente parada e olhe apenas com os olhos

### 2️⃣ **Navegação por Rastreamento Ocular**

- **Olhe para um botão** por 1 segundo (você verá uma barra de progresso)
- O botão será **ativado automaticamente** quando o tempo completar
- A **câmera fica visível** no canto superior esquerdo para monitoramento

### 3️⃣ **Navegação por Mouse (Alternativa)**

- Todos os botões também funcionam com **clique do mouse**
- Útil para demonstrações ou quando o rastreamento não está disponível

### 4️⃣ **Recalibração**

- Clique no **botão circular azul** no canto inferior direito
- Repita o processo de calibração para melhorar a precisão

---

## 📁 Estrutura do Projeto

```
eye-flow/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Layout.tsx       # Layout principal com navegação
│   │   ├── EyeTrackingOverlay.tsx
│   │   ├── EyeTrackingCalibration.tsx
│   │   └── ui/              # Componentes Shadcn/ui
│   ├── pages/               # Páginas da aplicação
│   │   ├── Index.tsx        # Página inicial
│   │   ├── Banking.tsx      # Módulo bancário
│   │   ├── Restaurant.tsx   # Módulo restaurante
│   │   ├── Hospital.tsx     # Módulo hospitalar
│   │   └── Settings.tsx     # Configurações
│   ├── hooks/               # Custom hooks
│   │   └── useEyeTracking.ts
│   ├── lib/                 # Utilitários
│   │   └── webgazer-manager.ts  # Gerenciador WebGazer
│   └── App.tsx              # Componente raiz
├── public/                  # Arquivos estáticos
└── package.json
```

---

## 🎨 Capturas de Tela

### Tela Inicial
Interface principal com três módulos principais: Banco, Restaurante e Totem Hospitalar.

### Calibração
Sistema de calibração com 16 pontos para precisão máxima do rastreamento ocular.

### Módulo Bancário
Fluxos completos de PIX, TED e consulta de saldo com confirmação visual.

---

## 🔧 Configurações Técnicas

### Parâmetros do WebGazer
- **Dwell Time**: 1000ms (1 segundo)
- **Filtro Kalman**: Ativado (estabilização)
- **Moving Average**: Buffer de 10 pontos (suavização)
- **Tamanho da câmera**: 160px
- **Posição da câmera**: Superior esquerdo

### Otimizações Implementadas
- ✅ Suavização de gaze com média móvel
- ✅ Filtro Kalman para redução de jitter
- ✅ Feedback visual de progresso
- ✅ Área de tolerância de 20px para melhor UX

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Autores

- **Beatriz Rodrigues** - [@beatrizrodrgss](https://github.com/beatrizrodrgss)

---

## 🙏 Agradecimentos

- [WebGazer.js](https://webgazer.cs.brown.edu/) - Biblioteca de rastreamento ocular
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Lucide](https://lucide.dev/) - Ícones

---

## 📞 Suporte

Para dúvidas ou sugestões, abra uma [issue](https://github.com/beatrizrodrgss/eye-flow/issues) no GitHub.

---

<div align="center">
  <strong>Desenvolvido com ❤️ para tornar a tecnologia mais acessível</strong>
</div>
