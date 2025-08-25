// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cache para armazenar dados das criptomoedas
let cryptoCache = {
  data: [],
  lastUpdate: null
};

// Lista das principais criptomoedas
const CRYPTO_IDS = [
  'bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana',
  'polkadot', 'dogecoin', 'avalanche-2', 'polygon-matic', 'chainlink'
];

// Função para buscar dados das criptomoedas
async function fetchCryptoData() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: CRYPTO_IDS.join(','),
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: true,
        price_change_percentage: '1h,24h,7d'
      }
    });

    const cryptoData = response.data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      fully_diluted_valuation: coin.fully_diluted_valuation,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      sparkline_in_7d: coin.sparkline_in_7d.price,
      last_updated: coin.last_updated
    }));

    return cryptoData;
  } catch (error) {
    console.error('Erro ao buscar dados das criptomoedas:', error.message);
    return cryptoCache.data; // Retorna dados em cache em caso de erro
  }
}

// Função para buscar dados de mercado global
async function fetchGlobalData() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/global');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar dados globais:', error.message);
    return null;
  }
}

// Função para buscar trending coins
async function fetchTrendingCoins() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
    return response.data.coins.slice(0, 5);
  } catch (error) {
    console.error('Erro ao buscar trending coins:', error.message);
    return [];
  }
}

// Função para atualizar dados e emitir para clientes
async function updateAndBroadcast() {
  try {
    console.log('Atualizando dados das criptomoedas...');
    
    const [cryptoData, globalData, trendingCoins] = await Promise.all([
      fetchCryptoData(),
      fetchGlobalData(),
      fetchTrendingCoins()
    ]);

    cryptoCache.data = cryptoData;
    cryptoCache.lastUpdate = new Date().toISOString();

    // Emitir dados atualizados para todos os clientes conectados
    io.emit('cryptoUpdate', {
      cryptos: cryptoData,
      global: globalData,
      trending: trendingCoins,
      lastUpdate: cryptoCache.lastUpdate
    });

    console.log(`Dados atualizados e enviados para ${io.engine.clientsCount} clientes`);
  } catch (error) {
    console.error('Erro ao atualizar dados:', error.message);
  }
}

// Routes da API
app.get('/api/cryptos', async (req, res) => {
  try {
    if (!cryptoCache.data.length || !cryptoCache.lastUpdate) {
      cryptoCache.data = await fetchCryptoData();
      cryptoCache.lastUpdate = new Date().toISOString();
    }

    res.json({
      success: true,
      data: cryptoCache.data,
      lastUpdate: cryptoCache.lastUpdate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

app.get('/api/global', async (req, res) => {
  try {
    const globalData = await fetchGlobalData();
    res.json({
      success: true,
      data: globalData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

app.get('/api/trending', async (req, res) => {
  try {
    const trendingCoins = await fetchTrendingCoins();
    res.json({
      success: true,
      data: trendingCoins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

app.get('/api/crypto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true
      }
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Criptomoeda não encontrada'
    });
  }
});

// Servir arquivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Enviar dados iniciais para o cliente recém-conectado
  if (cryptoCache.data.length) {
    socket.emit('cryptoUpdate', {
      cryptos: cryptoCache.data,
      lastUpdate: cryptoCache.lastUpdate
    });
  }

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Atualizar dados a cada 30 segundos
setInterval(updateAndBroadcast, 30000);

// Primeira atualização ao iniciar o servidor
updateAndBroadcast();

const PORT = process.env.PORT || 3007;
server.listen(PORT, () => {
  console.log(`
🚀 Servidor rodando na porta ${PORT}
📊 Dashboard de Criptomoedas iniciado
🔄 Atualizações em tempo real ativas
  `);
});

module.exports = { app, server };