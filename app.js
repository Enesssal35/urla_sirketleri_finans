// BIST Financial & KAP Terminal Application Logic
// Pre-configured Telegram Bot Settings for User

let activeTab = "dashboard";
let currentSortKey = "order"; // Preserves user's exact 1 to 14 stock ordering
let sortAscending = true;
let selectedSector = "all";
let searchKeyword = "";
let modalChartInstance = null;
let compareChartInstance = null;
let technicalChartInstance = null;
let matrixMetric = "roic";
let currentTheme = localStorage.getItem("bist_theme") || "light";

// State Data
let userPortfolio = JSON.parse(localStorage.getItem("bist_user_portfolio")) || {
    "EGEEN": { qty: 5, cost: 5200 },
    "FROTO": { qty: 250, cost: 72.50 },
    "CLEBI": { qty: 15, cost: 1420 },
    "ISMEN": { qty: 500, cost: 34.00 }
};

let customAlertRules = JSON.parse(localStorage.getItem("bist_custom_rules")) || [
    { id: 1, stockCode: "FROTO", metric: "roic", operator: ">=", value: 28, label: "Mükemmel Verim", badgeType: "badge-emerald" },
    { id: 2, stockCode: "ALL", metric: "peRatio", operator: "<=", value: 8, label: "Cazip F/K", badgeType: "badge-cyan" },
    { id: 3, stockCode: "ALL", metric: "netDebtToEbitda", operator: ">=", value: 1.5, label: "Borç Riski", badgeType: "badge-rose" }
];

let telegramConfig = JSON.parse(localStorage.getItem("bist_telegram_config")) || {
    botToken: "8752508671:AAHh0MFDP5fHiSxNNIvZNjwTdyX6O1i5LHM",
    chatId: "1243180648"
};

document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem("bist_telegram_config", JSON.stringify(telegramConfig));

    applyTheme(currentTheme);
    initLucideIcons();
    renderCustomTickerTape();
    renderOverviewMetrics();
    renderFinancialTable();
    renderHistoricalMatrix();
    renderComparisonChart();
    renderTechnicalPaneChart("FROTO");
    renderKapFeed();
    renderMagicFormulaTable();
    renderPortfolioTable();
    renderCustomRulesList();
    loadTelegramConfigUI();
    setupEventListeners();
});

function initLucideIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

function switchTab(tabId, btnElement = null) {
    activeTab = tabId;

    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

    const targetPane = document.getElementById(tabId);
    if (targetPane) {
        targetPane.classList.add("active");
    }

    if (btnElement) {
        btnElement.classList.add("active");
    } else {
        const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (btn) btn.classList.add("active");
    }

    if (tabId === "portfolioPane") {
        renderPortfolioTable();
    } else if (tabId === "customRulesPane") {
        renderCustomRulesList();
    } else if (tabId === "compareChartPane") {
        renderComparisonChart();
    } else if (tabId === "tradingviewPane") {
        renderTechnicalPaneChart(document.getElementById("tvSymbolSelect")?.value || "FROTO");
    } else if (tabId === "historicalMatrix") {
        renderHistoricalMatrix();
    } else if (tabId === "magicFormula") {
        renderMagicFormulaTable();
    }

    initLucideIcons();
}

function renderCustomTickerTape() {
    const track = document.getElementById("tickerTapeTrack");
    if (!track) return;

    const items = [...BIST_STOCKS, ...BIST_STOCKS];

    track.innerHTML = items.map(stock => {
        const changeClass = stock.change >= 0 ? "trend-up" : "trend-down";
        const changeSign = stock.change >= 0 ? "+" : "";

        return `
            <div class="ticker-item" onclick="openCompanyModal('${stock.code}')" style="cursor: pointer;">
                <span class="ticker-symbol">${stock.order}. ${stock.code}</span>
                <span class="ticker-price">${stock.price.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺</span>
                <span class="${changeClass}">${changeSign}%${stock.change}</span>
            </div>
        `;
    }).join("");
}

function renderPortfolioTable() {
    const tbody = document.getElementById("portfolioTableBody");
    if (!tbody) return;

    let totalCost = 0;
    let totalCurrentValue = 0;
    let weightedRoicSum = 0;
    let weightedRoeSum = 0;

    tbody.innerHTML = BIST_STOCKS.map(stock => {
        const holding = userPortfolio[stock.code] || { qty: 0, cost: 0 };
        const qty = holding.qty || 0;
        const costPrice = holding.cost || 0;

        const positionCost = qty * costPrice;
        const positionValue = qty * stock.price;
        const pnl = positionValue - positionCost;
        const pnlPercent = positionCost > 0 ? ((pnl / positionCost) * 100).toFixed(2) : 0;
        const pnlClass = pnl >= 0 ? "trend-up" : "trend-down";
        const pnlSign = pnl >= 0 ? "+" : "";

        totalCost += positionCost;
        totalCurrentValue += positionValue;

        if (positionValue > 0) {
            weightedRoicSum += (stock.metrics.roic * positionValue);
            weightedRoeSum += (stock.metrics.roe * positionValue);
        }

        return `
            <tr>
                <td><strong>#${stock.order}</strong></td>
                <td>
                    <div class="stock-title">${stock.code}</div>
                    <div class="stock-name">${stock.name}</div>
                </td>
                <td><strong>${stock.price.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺</strong></td>
                <td>
                    <input type="number" class="portfolio-input" value="${qty}" min="0" 
                           onchange="updatePortfolioItem('${stock.code}', 'qty', this.value)">
                </td>
                <td>
                    <input type="number" step="0.01" class="portfolio-input" value="${costPrice}" min="0"
                           onchange="updatePortfolioItem('${stock.code}', 'cost', this.value)">
                </td>
                <td>${positionCost.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺</td>
                <td><strong>${positionValue.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺</strong></td>
                <td class="${pnlClass}">
                    <strong>${pnlSign}${pnl.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺</strong>
                    <div style="font-size: 0.78rem;">(${pnlSign}%${pnlPercent})</div>
                </td>
                <td><span class="badge-highlight badge-emerald">%${stock.metrics.roic}</span></td>
            </tr>
        `;
    }).join("");

    const totalPnl = totalCurrentValue - totalCost;
    const totalPnlPercent = totalCost > 0 ? ((totalPnl / totalCost) * 100).toFixed(2) : 0;
    const weightedRoic = totalCurrentValue > 0 ? (weightedRoicSum / totalCurrentValue).toFixed(1) : 0;

    const valEl = document.getElementById("portTotalValue");
    const costEl = document.getElementById("portTotalCost");
    const pnlEl = document.getElementById("portTotalPnl");
    const roicEl = document.getElementById("portWeightedRoic");

    if (valEl) valEl.innerText = `${totalCurrentValue.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺`;
    if (costEl) costEl.innerText = `${totalCost.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺`;
    if (pnlEl) pnlEl.innerHTML = `<span class="${totalPnl >= 0 ? 'trend-up' : 'trend-down'}">${totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺ (%${totalPnlPercent})</span>`;
    if (roicEl) roicEl.innerText = `%${weightedRoic}`;

    initLucideIcons();
}

function updatePortfolioItem(code, field, value) {
    if (!userPortfolio[code]) userPortfolio[code] = { qty: 0, cost: 0 };
    userPortfolio[code][field] = parseFloat(value) || 0;
    localStorage.setItem("bist_user_portfolio", JSON.stringify(userPortfolio));
    renderPortfolioTable();
}

function renderCustomRulesList() {
    const listContainer = document.getElementById("customRulesList");
    if (!listContainer) return;

    if (customAlertRules.length === 0) {
        listContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem;">Henüz özel kural eklenmedi.</div>`;
        return;
    }

    listContainer.innerHTML = customAlertRules.map(rule => {
        const metricLabel = rule.metric === "roic" ? "ROIC" : (rule.metric === "roe" ? "ROE" : (rule.metric === "peRatio" ? "F/K" : "Net Borç/FAVÖK"));
        return `
            <div class="rule-pill">
                <span>[${rule.stockCode}] ${metricLabel} ${rule.operator} ${rule.value}</span>
                <span class="badge-highlight ${rule.badgeType}">${rule.label}</span>
                <i data-lucide="trash-2" style="width: 14px; cursor: pointer; color: var(--accent-danger);" onclick="deleteCustomRule(${rule.id})"></i>
            </div>
        `;
    }).join("");

    initLucideIcons();
}

function addCustomRule() {
    const stockCode = document.getElementById("ruleStock").value;
    const metric = document.getElementById("ruleMetric").value;
    const operator = document.getElementById("ruleOperator").value;
    const value = parseFloat(document.getElementById("ruleValue").value);
    const label = document.getElementById("ruleLabel").value || "Özel Sinyal";
    const badgeType = document.getElementById("ruleBadge").value;

    if (isNaN(value)) {
        alert("Lütfen geçerli bir kural değeri girin.");
        return;
    }

    const newRule = {
        id: Date.now(),
        stockCode,
        metric,
        operator,
        value,
        label,
        badgeType
    };

    customAlertRules.push(newRule);
    localStorage.setItem("bist_custom_rules", JSON.stringify(customAlertRules));
    renderCustomRulesList();
    renderFinancialTable();
}

function deleteCustomRule(id) {
    customAlertRules = customAlertRules.filter(r => r.id !== id);
    localStorage.setItem("bist_custom_rules", JSON.stringify(customAlertRules));
    renderCustomRulesList();
    renderFinancialTable();
}

function evaluateCustomRules(stock) {
    let triggeredBadges = [];

    customAlertRules.forEach(rule => {
        if (rule.stockCode === "ALL" || rule.stockCode === stock.code) {
            let stockVal = getNestedValue(stock, rule.metric);
            let isMatch = false;

            if (rule.operator === ">=" && stockVal >= rule.value) isMatch = true;
            else if (rule.operator === "<=" && stockVal <= rule.value) isMatch = true;
            else if (rule.operator === ">" && stockVal > rule.value) isMatch = true;
            else if (rule.operator === "<" && stockVal < rule.value) isMatch = true;

            if (isMatch) {
                triggeredBadges.push(`<span class="badge-highlight ${rule.badgeType}">${rule.label}</span>`);
            }
        }
    });

    return triggeredBadges.join(" ");
}

function loadTelegramConfigUI() {
    const tokenInput = document.getElementById("tgTokenInput");
    const chatIdInput = document.getElementById("tgChatIdInput");
    if (tokenInput) tokenInput.value = telegramConfig.botToken || "";
    if (chatIdInput) chatIdInput.value = telegramConfig.chatId || "";
}

function saveTelegramConfig() {
    const token = document.getElementById("tgTokenInput").value.trim();
    const chatId = document.getElementById("tgChatIdInput").value.trim();

    telegramConfig.botToken = token;
    telegramConfig.chatId = chatId;
    localStorage.setItem("bist_telegram_config", JSON.stringify(telegramConfig));

    alert("Telegram ayarlarınız kaydedildi!");
}

function sendTestTelegramMessage() {
    const token = telegramConfig.botToken || document.getElementById("tgTokenInput").value.trim();
    const chatId = telegramConfig.chatId || document.getElementById("tgChatIdInput").value.trim();

    if (!token || !chatId) {
        alert("Lütfen önce Telegram Bot Token ve Chat ID bilgilerinizi girin.");
        return;
    }

    const message = encodeURIComponent(`🚨 BIST ROIC/ROE Terminal Test Bildirimi!\n\n14 BIST hissenizin takibi aktif edilmiştir.\nEGEEN ROIC: %42.1\nFROTO ROE: %52.4\n\nBaşarıyla bağlandınız! 🎉`);
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.ok) {
                alert("✅ Telegram test mesajı telefonunuza gönderildi!");
            } else {
                if (data.description && data.description.includes("chat not found")) {
                    alert(`⚠️ Telegram Hatası: Telegram uygulamanızda yeni oluşturduğunuz bota girip bir kez '/start' (Başlat) mesajı atmanız gerekmektedir.\n\nArdından tekrar test butonuna basın!`);
                } else {
                    alert(`❌ Telegram Hatası: ${data.description}`);
                }
            }
        })
        .catch(err => alert("Bağlantı hatası: " + err.message));
}

function renderTechnicalPaneChart(code) {
    const stock = BIST_STOCKS.find(s => s.code === code) || BIST_STOCKS[2];
    const ctx = document.getElementById("technicalPaneCanvas");
    const titleEl = document.getElementById("technicalChartTitle");
    const tvLinkEl = document.getElementById("tvDirectLink");

    if (titleEl) titleEl.innerText = `${stock.code} - ${stock.name} Canlı Performans & Verimlilik Grafiği`;
    if (tvLinkEl) tvLinkEl.href = `https://tr.tradingview.com/symbols/BIST-${stock.code}/`;

    if (!ctx) return;
    if (technicalChartInstance) technicalChartInstance.destroy();

    const quarters = stock.historical8Q.map(h => h.quarter);
    const roicData = stock.historical8Q.map(h => h.roic);
    const roeData = stock.historical8Q.map(h => h.roe);
    const revenueData = stock.historical8Q.map(h => h.revenue);

    const textThemeColor = currentTheme === "dark" ? "#f8fafc" : "#0f172a";
    const gridThemeColor = currentTheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)";

    technicalChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: quarters,
            datasets: [
                { type: 'line', label: 'ROIC (%)', data: roicData, borderColor: '#0284c7', borderWidth: 3, yAxisID: 'y' },
                { type: 'line', label: 'ROE (%)', data: roeData, borderColor: '#4f46e5', borderWidth: 3, yAxisID: 'y' },
                { type: 'bar', label: 'Çeyreklik Satış Geliri (Milyon TL)', data: revenueData, backgroundColor: 'rgba(16, 185, 129, 0.3)', borderColor: '#10b981', borderWidth: 1, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textThemeColor } } },
            scales: {
                x: { ticks: { color: textThemeColor }, grid: { color: gridThemeColor } },
                y: { type: 'linear', position: 'left', ticks: { color: textThemeColor } },
                y1: { type: 'linear', position: 'right', ticks: { color: '#10b981' } }
            }
        }
    });
}

function changeTvPaneSymbol(code) {
    renderTechnicalPaneChart(code);
}

function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bist_theme", theme);

    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
        if (theme === "dark") themeBtn.innerHTML = `<i data-lucide="sun"></i> Açık Moda Geç`;
        else themeBtn.innerHTML = `<i data-lucide="moon"></i> Koyu Moda Geç`;
        initLucideIcons();
    }

    if (compareChartInstance) renderComparisonChart();
    renderTechnicalPaneChart(document.getElementById("tvSymbolSelect")?.value || "FROTO");
}

function toggleTheme() {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
}

function renderOverviewMetrics() {
    const avgRoe = (BIST_STOCKS.reduce((acc, stock) => acc + stock.metrics.roe, 0) / BIST_STOCKS.length).toFixed(1);
    const avgRoic = (BIST_STOCKS.reduce((acc, stock) => acc + stock.metrics.roic, 0) / BIST_STOCKS.length).toFixed(1);
    const topRoicStock = [...BIST_STOCKS].sort((a, b) => b.metrics.roic - a.metrics.roic)[0];

    const metricsContainer = document.getElementById("summaryGrid");
    if (!metricsContainer) return;

    metricsContainer.innerHTML = `
        <div class="metric-card">
            <div class="metric-header"><span>PORTFÖY ORTALAMA ROIC</span><div class="metric-icon icon-cyan"><i data-lucide="zap"></i></div></div>
            <div class="metric-value">%${avgRoic}</div>
            <div class="metric-subtext">14 Şirket Sermaye Verimlilik Ortalama</div>
        </div>
        <div class="metric-card">
            <div class="metric-header"><span>PORTFÖY ORTALAMA ROE</span><div class="metric-icon icon-blue"><i data-lucide="trending-up"></i></div></div>
            <div class="metric-value">%${avgRoe}</div>
            <div class="metric-subtext">Özkaynak Karlılık Oranı</div>
        </div>
        <div class="metric-card">
            <div class="metric-header"><span>ROIC VERİMLİLİK LİDERİ</span><div class="metric-icon icon-emerald"><i data-lucide="award"></i></div></div>
            <div class="metric-value">${topRoicStock.code} (%${topRoicStock.metrics.roic})</div>
            <div class="metric-subtext">${topRoicStock.name}</div>
        </div>
        <div class="metric-card">
            <div class="metric-header"><span>PORTFÖY HİSSE SAYISI</span><div class="metric-icon icon-amber"><i data-lucide="layers"></i></div></div>
            <div class="metric-value">14 BIST Şirketi</div>
            <div class="metric-subtext">Kullanıcıya Özel Sıralı Liste</div>
        </div>
    `;
    initLucideIcons();
}

function renderFinancialTable() {
    const tbody = document.getElementById("financialTableBody");
    if (!tbody) return;

    let filtered = BIST_STOCKS.filter(stock => {
        const matchesSearch = stock.code.toLowerCase().includes(searchKeyword.toLowerCase()) || stock.name.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesSector = selectedSector === "all" || stock.sector === selectedSector;
        return matchesSearch && matchesSector;
    });

    filtered.sort((a, b) => {
        let valA = getNestedValue(a, currentSortKey);
        let valB = getNestedValue(b, currentSortKey);
        return sortAscending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    tbody.innerHTML = filtered.map(stock => {
        const roicBadgeClass = stock.metrics.roic >= 35 ? 'badge-emerald' : (stock.metrics.roic >= 25 ? 'badge-cyan' : 'badge-amber');
        const roeBadgeClass = stock.metrics.roe >= 40 ? 'badge-emerald' : 'badge-amber';
        const netDebtClass = stock.metrics.netDebtToEbitda <= 0 ? 'badge-emerald' : (stock.metrics.netDebtToEbitda > 1.5 ? 'badge-rose' : 'badge-amber');
        const changeClass = stock.change >= 0 ? "trend-up" : "trend-down";
        const changeSign = stock.change >= 0 ? "+" : "";

        const customBadgesHtml = evaluateCustomRules(stock);

        return `
            <tr>
                <td><strong>#${stock.order}</strong></td>
                <td>
                    <div class="stock-cell">
                        <div class="stock-avatar">${stock.code.slice(0,3)}</div>
                        <div>
                            <div class="stock-title">${stock.code}</div>
                            <div class="stock-name">${stock.name}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge-highlight badge-cyan">${stock.sector}</span></td>
                <td>
                    <strong>${stock.price.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺</strong>
                    <div class="${changeClass}" style="font-size: 0.78rem;">${changeSign}%${stock.change}</div>
                </td>
                <td><span class="badge-highlight ${roicBadgeClass}">%${stock.metrics.roic}</span></td>
                <td><span class="badge-highlight ${roeBadgeClass}">%${stock.metrics.roe}</span></td>
                <td>
                    <div style="font-size: 0.82rem;">
                        <div>Marj: <strong>%${stock.metrics.dupont.netMargin}</strong></div>
                        <div>Devir: <strong>${stock.metrics.dupont.assetTurnover}x</strong></div>
                        <div>Kaldıraç: <strong>${stock.metrics.dupont.leverage}x</strong></div>
                    </div>
                </td>
                <td>${stock.metrics.peRatio}x</td>
                <td>${stock.metrics.pbRatio}x</td>
                <td><span class="badge-highlight ${netDebtClass}">${stock.metrics.netDebtToEbitda}x</span></td>
                <td>
                    ${stock.metrics.roic >= 35 ? '<span class="badge-highlight badge-emerald">Yüksek Verim</span>' : '<span class="badge-highlight badge-cyan">Sağlıklı</span>'}
                    ${customBadgesHtml}
                </td>
                <td>
                    <button class="btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="openCompanyModal('${stock.code}')">
                        <i data-lucide="bar-chart-2"></i> Detay & Rapor
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    initLucideIcons();
}

function getNestedValue(obj, path) {
    if (path.includes(".")) {
        const parts = path.split(".");
        return parts.reduce((acc, part) => acc && acc[part], obj);
    }
    return obj.metrics[path] !== undefined ? obj.metrics[path] : obj[path];
}

function renderHistoricalMatrix() {
    const tableEl = document.getElementById("historicalMatrixBody");
    if (!tableEl) return;

    const quarters = ["2024/Q2", "2024/Q3", "2024/Q4", "2025/Q1", "2025/Q2", "2025/Q3", "2025/Q4", "2026/Q1"];

    tableEl.innerHTML = BIST_STOCKS.map(stock => {
        const qData = stock.historical8Q;
        const qFirst = qData[0][matrixMetric];
        const qLast = qData[qData.length - 1][matrixMetric];
        const delta = (qLast - qFirst).toFixed(1);
        const deltaClass = delta >= 0 ? "trend-up" : "trend-down";

        const qCells = quarters.map(q => {
            const item = qData.find(d => d.quarter === q);
            const val = item ? item[matrixMetric] : 0;
            let bgClass = val >= 38 ? "heatmap-emerald-dark" : (val >= 30 ? "heatmap-emerald" : (val >= 20 ? "heatmap-cyan" : "heatmap-amber"));
            return `<td class="heatmap-cell ${bgClass}">%${val}</td>`;
        }).join("");

        return `
            <tr>
                <td>
                    <div style="font-weight: 800; font-family: var(--font-heading);">${stock.order}. ${stock.code}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${stock.name}</div>
                </td>
                ${qCells}
                <td><span class="trend-indicator ${deltaClass}">${delta >= 0 ? '▲' : '▼'} %${Math.abs(delta)}</span></td>
            </tr>
        `;
    }).join("");

    initLucideIcons();
}

function setMatrixMetric(metric) {
    matrixMetric = metric;
    document.getElementById("btnMatrixRoic").classList.toggle("active", metric === "roic");
    document.getElementById("btnMatrixRoe").classList.toggle("active", metric === "roe");
    renderHistoricalMatrix();
}

function renderComparisonChart() {
    const ctx = document.getElementById("compareChartCanvas");
    if (!ctx) return;
    if (compareChartInstance) compareChartInstance.destroy();

    const selectedCodes = ["EGEEN", "CLEBI", "FROTO", "ISMEN", "LKMNH"];
    const quarters = ["2024/Q2", "2024/Q3", "2024/Q4", "2025/Q1", "2025/Q2", "2025/Q3", "2025/Q4", "2026/Q1"];
    const colors = ["#0284c7", "#4f46e5", "#10b981", "#d97706", "#9333ea"];
    const textThemeColor = currentTheme === "dark" ? "#f8fafc" : "#0f172a";

    const datasets = selectedCodes.map((code, idx) => {
        const stock = BIST_STOCKS.find(s => s.code === code);
        return {
            label: `${code} ROIC (%)`,
            data: stock ? stock.historical8Q.map(h => h.roic) : [],
            borderColor: colors[idx % colors.length],
            borderWidth: 3, tension: 0.3
        };
    });

    compareChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: quarters, datasets: datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textThemeColor } } },
            scales: { x: { ticks: { color: textThemeColor } }, y: { ticks: { color: textThemeColor } } }
        }
    });
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Sira No,Hisse Kodu,Sirket Adi,Sektor,Dogrulanmis BIST Fiyati (TL),ROIC (%),ROE (%),Net Marj (%),Varlik Devir Hizi,Kaldırac,F/K,PD/DD,Net Borc/FAVOK\n";

    BIST_STOCKS.forEach(s => {
        const row = [
            s.order, s.code, `"${s.name}"`, `"${s.sector}"`, s.price,
            s.metrics.roic, s.metrics.roe, s.metrics.dupont.netMargin,
            s.metrics.dupont.assetTurnover, s.metrics.dupont.leverage,
            s.metrics.peRatio, s.metrics.pbRatio, s.metrics.netDebtToEbitda
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BIST_14_Hisse_ROIC_ROE_Rapor_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function renderKapFeed() {
    const feedContainer = document.getElementById("kapFeedGrid");
    if (!feedContainer) return;

    let allDisclosures = [];
    BIST_STOCKS.forEach(stock => {
        stock.kapDisclosures.forEach(disc => {
            allDisclosures.push({ ...disc, stockCode: stock.code, stockName: stock.name });
        });
    });

    allDisclosures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    feedContainer.innerHTML = allDisclosures.map(disc => {
        const sentimentClass = disc.sentiment === "positive" ? "badge-emerald" : "badge-amber";
        return `
            <div class="kap-card">
                <div>
                    <div class="kap-header">
                        <span class="kap-ticker-badge">${disc.stockCode} - ${disc.category}</span>
                        <span class="kap-date">${disc.date}</span>
                    </div>
                    <div class="kap-title">${disc.title}</div>
                    <div class="kap-summary">${disc.summary}</div>
                </div>
                <div>
                    <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                        <span class="badge-highlight ${sentimentClass}">CANLI POZİTİF SİNYAL</span>
                        <span style="font-size: 0.78rem; color: var(--text-muted);">Etki: <strong>${disc.impactScore}/10</strong></span>
                    </div>
                    <div class="ai-eval-box">
                        <div class="ai-eval-title"><i data-lucide="sparkles"></i> Yapay Zeka Canlı İkaz:</div>
                        <div>${disc.aiEvaluation}</div>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    initLucideIcons();
}

function renderMagicFormulaTable() {
    const container = document.getElementById("magicFormulaBody");
    if (!container) return;

    const ranked = calculateMagicFormula(BIST_STOCKS);

    container.innerHTML = ranked.map((stock, index) => {
        const earningsYield = ((1 / stock.metrics.peRatio) * 100).toFixed(2);
        const compositeScore = ((stock.metrics.roic * 0.6) + (earningsYield * 0.4)).toFixed(1);

        return `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>
                    <div class="stock-title">${stock.code}</div>
                    <div class="stock-name">${stock.name}</div>
                </td>
                <td><span class="badge-highlight badge-emerald">%${stock.metrics.roic}</span></td>
                <td>%${earningsYield} (${stock.metrics.peRatio}x F/K)</td>
                <td><span class="badge-highlight badge-cyan">${compositeScore} Puan</span></td>
                <td>${index < 3 ? '<span class="badge-highlight badge-emerald">MÜKEMMEL SEÇİM</span>' : '<span class="badge-highlight badge-amber">NÖTR</span>'}</td>
            </tr>
        `;
    }).join("");

    initLucideIcons();
}

function openCompanyModal(code) {
    const stock = BIST_STOCKS.find(s => s.code === code);
    if (!stock) return;

    const modal = document.getElementById("companyModal");
    document.getElementById("modalTitle").innerHTML = `${stock.code} - ${stock.name}`;
    document.getElementById("modalBody").innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="font-size: 0.95rem; font-weight: 700;">
                BIST Fiyatı: <span style="color: var(--accent-primary); font-family: var(--font-mono);">${stock.price.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺</span>
            </div>
            <a href="https://tr.tradingview.com/symbols/BIST-${stock.code}/" target="_blank" class="btn-primary" style="font-size: 0.82rem; padding: 6px 14px;">
                <i data-lucide="external-link"></i> TradingView.com'da Canlı Gör (BIST:${stock.code})
            </a>
        </div>

        <div class="modal-grid-2" style="margin-bottom: 20px;">
            <div class="chart-container-box">
                <h4 style="font-family: var(--font-heading); margin-bottom: 12px; color: var(--text-primary);">
                    8 Çeyreklik ROE vs ROIC Trend Grafiği (2024/Q2 - 2026/Q1)
                </h4>
                <canvas id="modalChartCanvas"></canvas>
            </div>
            <div>
                <h4 style="font-family: var(--font-heading); margin-bottom: 12px; color: var(--text-primary);">
                    DuPont Analizi (ROE %${stock.metrics.roe})
                </h4>
                <div style="background: var(--bg-main); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Net Marj:</span><strong>%${stock.metrics.dupont.netMargin}</strong></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Devir Hızı:</span><strong>${stock.metrics.dupont.assetTurnover}x</strong></div>
                    <div style="display: flex; justify-content: space-between;"><span>Kaldıraç:</span><strong>${stock.metrics.dupont.leverage}x</strong></div>
                </div>

                <h4 style="font-family: var(--font-heading); margin-bottom: 12px; color: var(--text-primary);">
                    ROIC & Sermaye Yapısı
                </h4>
                <div style="background: var(--bg-main); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>ROIC (Sermaye Getirisi):</span><strong style="color: var(--accent-success);">%${stock.metrics.roic}</strong></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>NOPAT:</span><strong>${stock.metrics.nopat} Milyon TL</strong></div>
                    <div style="display: flex; justify-content: space-between;"><span>Yatırılan Sermaye:</span><strong>${stock.metrics.investedCapital} Milyon TL</strong></div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add("active");

    setTimeout(() => {
        const ctx = document.getElementById("modalChartCanvas");
        if (modalChartInstance) modalChartInstance.destroy();
        const textThemeColor = currentTheme === "dark" ? "#f8fafc" : "#0f172a";

        modalChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: stock.historical8Q.map(h => h.quarter),
                datasets: [
                    { label: 'ROIC (%)', data: stock.historical8Q.map(h => h.roic), borderColor: '#0284c7', borderWidth: 3, tension: 0.3 },
                    { label: 'ROE (%)', data: stock.historical8Q.map(h => h.roe), borderColor: '#4f46e5', borderWidth: 3, tension: 0.3 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textThemeColor } } },
                scales: { x: { ticks: { color: textThemeColor } }, y: { ticks: { color: textThemeColor } } }
            }
        });
    }, 50);
}

function closeModal() {
    document.getElementById("companyModal").classList.remove("active");
    if (modalChartInstance) { modalChartInstance.destroy(); modalChartInstance = null; }
}

function setupEventListeners() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const btnEl = e.currentTarget;
            const tabId = btnEl.getAttribute("data-tab");
            switchTab(tabId, btnEl);
        });
    });

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchKeyword = e.target.value;
            renderFinancialTable();
        });
    }

    const sectorSelect = document.getElementById("sectorFilter");
    if (sectorSelect) {
        sectorSelect.addEventListener("change", (e) => {
            selectedSector = e.target.value;
            renderFinancialTable();
        });
    }
}

function sortTable(key) {
    if (currentSortKey === key) sortAscending = !sortAscending;
    else { currentSortKey = key; sortAscending = false; }
    renderFinancialTable();
}
