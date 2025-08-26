# 🚀 Crypto Dashboard - Tempo Real

Dashboard de criptomoedas com atualizações em tempo real, exibindo preços, gráficos e estatísticas do mercado crypto.

## 📊 Funcionalidades

- ✅ Atualizações em tempo real via WebSocket
- 📈 Gráficos sparkline interativos
- 💰 Top 10 criptomoedas por market cap
- 📊 Estatísticas globais do mercado
- 🎨 Interface moderna e responsiva
- 🔄 Animações de mudança de preço
- 📱 Design mobile-first

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **Socket.IO** - Comunicação WebSocket em tempo real
- **Axios** - Cliente HTTP para APIs
- **CORS** - Middleware para Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Estrutura da aplicação
- **CSS3** - Estilização com gradientes e animações
- **JavaScript (ES6+)** - Lógica do cliente
- **Chart.js** - Biblioteca para gráficos interativos
- **Socket.IO Client** - Cliente WebSocket

### APIs Externas
- **CoinGecko API** - Dados de criptomoedas em tempo real

### Ferramentas de Desenvolvimento
- **Nodemon** - Hot reload para desenvolvimento
- **npm** - Gerenciador de pacotes

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v14.0.0 ou superior)
- npm

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd crypto-dashboard
```

2. Instale as dependências:
```bash
npm install
```

3. Execute em modo desenvolvimento:
```bash
npm run dev
```

4. Execute em produção:
```bash
npm start
```

5. Acesse no navegador:
```
http://localhost:3007
```

## 📁 Estrutura do Projeto

```
crypto-dashboard/
├── server.js              # Servidor Express + Socket.IO
├── package.json           # Dependências e scripts
├── public/                # Arquivos estáticos
│   ├── index.html        # Interface principal
│   ├── style.css         # Estilos CSS
│   └── main.js           # JavaScript do cliente
└── README.md             # Documentação
```

## 🔧 Configuração

### Variáveis de Ambiente
- `PORT` - Porta do servidor (padrão: 3007)

### Criptomoedas Monitoradas
O dashboard monitora as seguintes criptomoedas:
- Bitcoin (BTC)
- Ethereum (ETH)
- BNB (BNB)
- Cardano (ADA)
- Solana (SOL)
- Polkadot (DOT)
- Dogecoin (DOGE)
- Avalanche (AVAX)
- Polygon (MATIC)
- Chainlink (LINK)

## 📡 API Endpoints

### REST API
- `GET /api/cryptos` - Lista de criptomoedas
- `GET /api/global` - Estatísticas globais
- `GET /api/trending` - Criptomoedas em alta
- `GET /api/crypto/:id` - Detalhes de uma criptomoeda

### WebSocket Events
- `cryptoUpdate` - Atualizações em tempo real dos preços

## 🎨 Recursos Visuais

- **Design Glassmorphism** - Efeitos de vidro translúcido
- **Gradientes Modernos** - Paleta de cores atrativa
- **Animações Suaves** - Transições e hover effects
- **Gráficos Interativos** - Sparklines com Chart.js
- **Indicadores Visuais** - Status de conexão e mudanças de preço

## 📱 Responsividade

- Totalmente responsivo para desktop, tablet e mobile
- Grid adaptativo que se ajusta ao tamanho da tela
- Typography scaling para diferentes dispositivos

## 🔄 Atualizações

- Dados atualizados a cada 30 segundos
- Conexão WebSocket persistente
- Reconexão automática em caso de perda de conexão
- Cache inteligente para melhor performance

## 🚦 Status do Projeto

- ✅ Dashboard básico funcionando
- ✅ WebSocket em tempo real
- ✅ Interface responsiva
- ✅ Gráficos interativos
- 🔄 Em desenvolvimento: Mais métricas e alertas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença Apache 2.0. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Emerson Dev - [GitHub](https://github.com/devemersoncosta)

## 📞 Suporte

Para suporte, envie um email para emersoncurry72@gmail.com ou abra uma issue no GitHub.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
