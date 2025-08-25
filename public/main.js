// Conectar ao servidor WebSocket
const socket = io();
        
let charts = {};
let previousPrices = {};

// Função para formatar números
function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined) return 'N/A';
    
    if (num >= 1e12) {
        return (num / 1e12).toFixed(decimals) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(decimals) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(decimals) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(decimals) + 'K';
    }
    
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}

// Função para formatar porcentagem
function formatPercentage(num) {
    if (num === null || num === undefined) return 'N/A';
    return num.toFixed(2) + '%';
}

// Função para criar gráfico sparkline
function createSparkline(containerId, data, color = '#4CAF50') {
    const ctx = document.getElementById(containerId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data: data,
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                fill: true,
                pointRadius: 0,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            interaction: {
                intersect: false
            }
        }
    });
}

// Função para renderizar stats globais
function renderGlobalStats(globalData) {
    if (!globalData) return;

    const statsHtml = `
        <div class="stat-card">
            <h3>Market Cap Total</h3>
            <div class="value">$${formatNumber(globalData.total_market_cap?.usd)}</div>
        </div>
        <div class="stat-card">
            <h3>Volume 24h</h3>
            <div class="value">$${formatNumber(globalData.total_volume?.usd)}</div>
        </div>
        <div class="stat-card">
            <h3>Dominância BTC</h3>
            <div class="value">${formatPercentage(globalData.market_cap_percentage?.btc)}</div>
        </div>
        <div class="stat-card">
            <h3>Criptomoedas Ativas</h3>
            <div class="value">${formatNumber(globalData.active_cryptocurrencies, 0)}</div>
        </div>
    `;
    
    document.getElementById('globalStats').innerHTML = statsHtml;
}

// Função para renderizar lista de criptomoedas
function renderCryptos(cryptos) {
    const grid = document.getElementById('cryptoGrid');
    const loading = document.getElementById('loading');
    
    let html = '';
    
    cryptos.forEach((crypto, index) => {
        const priceChange24h = crypto.price_change_percentage_24h || 0;
        const priceChange1h = crypto.price_change_percentage_1h_in_currency || 0;
        const priceChange7d = crypto.price_change_percentage_7d_in_currency || 0;
        
        const chartId = `chart-${crypto.id}`;
        const sparklineColor = priceChange24h >= 0 ? '#4CAF50' : '#f44336';
        
        // Verificar se o preço mudou para animação
        const flashClass = previousPrices[crypto.id] && 
                         previousPrices[crypto.id] !== crypto.current_price ? 'flash' : '';
        
        previousPrices[crypto.id] = crypto.current_price;
        
        html += `
            <div class="crypto-card ${flashClass}">
                <div class="crypto-header">
                    <img src="${crypto.image}" alt="${crypto.name}" class="crypto-icon">
                    <div class="crypto-info">
                        <h3>${crypto.name}</h3>
                        <div class="symbol">${crypto.symbol} #${crypto.market_cap_rank}</div>
                    </div>
                </div>
                
                <div class="crypto-price">$${formatNumber(crypto.current_price, 4)}</div>
                
                <div class="crypto-changes">
                    <div class="change-item">
                        <div class="label">1h</div>
                        <div class="value ${priceChange1h >= 0 ? 'positive' : 'negative'}">
                            ${formatPercentage(priceChange1h)}
                        </div>
                    </div>
                    <div class="change-item">
                        <div class="label">24h</div>
                        <div class="value ${priceChange24h >= 0 ? 'positive' : 'negative'}">
                            ${formatPercentage(priceChange24h)}
                        </div>
                    </div>
                    <div class="change-item">
                        <div class="label">7d</div>
                        <div class="value ${priceChange7d >= 0 ? 'positive' : 'negative'}">
                            ${formatPercentage(priceChange7d)}
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <canvas id="${chartId}"></canvas>
                </div>
                
                <div style="margin-top: 15px; font-size: 0.85rem; color: #666;">
                    <div>Market Cap: $${formatNumber(crypto.market_cap)}</div>
                    <div>Volume 24h: $${formatNumber(crypto.total_volume)}</div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    grid.style.display = 'grid';
    loading.style.display = 'none';
    
    // Criar gráficos após inserir HTML
    setTimeout(() => {
        cryptos.forEach(crypto => {
            const chartId = `chart-${crypto.id}`;
            const priceChange24h = crypto.price_change_percentage_24h || 0;
            const sparklineColor = priceChange24h >= 0 ? '#4CAF50' : '#f44336';
            
            // Destruir gráfico anterior se existir
            if (charts[chartId]) {
                charts[chartId].destroy();
            }
            
            // Criar novo gráfico
            if (crypto.sparkline_in_7d && crypto.sparkline_in_7d.length > 0) {
                charts[chartId] = createSparkline(chartId, crypto.sparkline_in_7d, sparklineColor);
            }
        });
    }, 100);
}

// Função para atualizar timestamp
function updateTimestamp(timestamp) {
    const date = new Date(timestamp);
    const formatted = date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('lastUpdate').textContent = `Última atualização: ${formatted}`;
}

// Escutar atualizações do WebSocket
socket.on('cryptoUpdate', (data) => {
    console.log('Dados recebidos:', data);
    
    if (data.cryptos) {
        renderCryptos(data.cryptos);
    }
    
    if (data.global) {
        renderGlobalStats(data.global);
    }
    
    if (data.lastUpdate) {
        updateTimestamp(data.lastUpdate);
    }
});

// Tratar desconexão
socket.on('disconnect', () => {
    document.querySelector('.status span').textContent = 'Desconectado - Tentando reconectar...';
    document.querySelector('.status-indicator').style.background = '#f44336';
});

// Tratar reconexão
socket.on('connect', () => {
    document.querySelector('.status span').textContent = 'Conectado - Atualizações em Tempo Real';
    document.querySelector('.status-indicator').style.background = '#4CAF50';
});