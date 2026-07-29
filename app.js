// BIST Financial & KAP Terminal Application Logic with Live BIST Price Synchronization

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
    botToken: "",
    chatId: ""
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

    // Start Automatic Live Engine (BIST Live Prices + Auto KAP Feed Scanner)
    startAutomaticLiveEngine();
});

function initLucideIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Automatic Real-Time BIST Live Price Synchronization
async function fetchLiveBistPrices() {
    const proxies = [
        (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`
    ];

    let updated = false;

    for (let stock of BIST_STOCKS) {
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}?interval=1m`;
        let success = false;

        try {
            const res = await fetch(yahooUrl);
            if (res.ok) {
                const data = await res.json();
                const meta = data.chart?.result?.[0]?.meta;
                if (meta && meta.regularMarketPrice) {
                    stock.price = meta.regularMarketPrice;
                    const prevClose = meta.chartPreviousClose || meta.previousClose;
                    if (prevClose > 0) {
                        stock.change = parseFloat((((stock.price - prevClose) / prevClose) * 100).toFixed(2));
                    }
                    success = true;
                    updated = true;
                }
            }
        } catch (e) {
            // Direct fetch failed, fallback to CORS proxies
        }

        if (!success) {
            for (let proxyFn of proxies) {
                try {
                    const proxyUrl = proxyFn(yahooUrl);
                    const res = await fetch(proxyUrl);
                    if (res.ok) {
                        const data = await res.json();
                        const meta = data.chart?.result?.[0]?.meta;
                        if (meta && meta.regularMarketPrice) {
                            stock.price = meta.regularMarketPrice;
                            const prevClose = meta.chartPreviousClose || meta.previousClose;
                            if (prevClose > 0) {
                                stock.change = parseFloat((((stock.price - prevClose) / prevClose) * 100).toFixed(2));
                            }
                            updated = true;
                            break;
                        }
                    }
                } catch (err) {}
            }
        }
    }

    if (updated) {
        renderOverviewMetrics();
        renderFinancialTable();
        renderCustomTickerTape();
        if (activeTab === "portfolioPane") renderPortfolioTable();
    }
}

// Exact ROIC - WACC Evaluation Rules from User Image
function getRoicWaccEvaluation(roic, wacc) {
    const eva = parseFloat((roic - wacc).toFixed(1));
    if (eva < 0) {
        return {
            badge: `<span class="badge-highlight badge-rose">🔴 Değer yok ediyor.</span>`,
            text: "Değer yok ediyor.",
            scoreText: `< 0 (EVA -%${Math.abs(eva)})`,
            badgeShort: `<span class="badge-highlight badge-rose">🔴 -%${Math.abs(eva)} (Yok Ediyor)</span>`
        };
    } else if (eva <= 5.0) {
        return {
            badge: `<span class="badge-highlight badge-amber">🟡 Sermaye maliyetini az farkla geçiyor.</span>`,
            text: "Sermaye maliyetini az farkla geçiyor.",
            scoreText: `0-5 puan (+%${eva})`,
            badgeShort: `<span class="badge-highlight badge-amber">🟡 +%${eva} (Az Farkla)</span>`
        };
    } else if (eva <= 10.0) {
        return {
            badge: `<span class="badge-highlight badge-emerald">🟢 İyi şirket.</span>`,
            text: "İyi şirket.",
            scoreText: `5-10 puan (+%${eva})`,
            badgeShort: `<span class="badge-highlight badge-emerald">🟢 +%${eva} (İyi)</span>`
        };
    } else if (eva <= 15.0) {
        return {
            badge: `<span class="badge-highlight badge-emerald">🟢 Çok kaliteli şirket.</span>`,
            text: "Çok kaliteli şirket.",
            scoreText: `10-15 puan (+%${eva})`,
            badgeShort: `<span class="badge-highlight badge-emerald">🟢 +%${eva} (Çok Kaliteli)</span>`
        };
    } else {
        return {
            badge: `<span class="badge-highlight" style="background: rgba(245, 158, 11, 0.18); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.4);">⭐ Elit şirketler. Uzun vadede bileşik getiri oluşturma potansiyeli yüksektir.</span>`,
            text: "Elit şirketler. Uzun vadede bileşik getiri oluşturma potansiyeli yüksektir.",
            scoreText: `15+ puan (+%${eva})`,
            badgeShort: `<span class="badge-highlight badge-amber" style="background: rgba(245, 158, 11, 0.2); color: #d97706;">⭐ +%${eva} (Elit)</span>`
        };
    }
}

function getRoicBadge(roic) {
    if (roic >= 30) return `<span class="badge-highlight badge-emerald">🟢 %${roic} (Yüksek)</span>`;
    if (roic >= 20) return `<span class="badge-highlight badge-amber">🟡 %${roic} (Makul)</span>`;
    return `<span class="badge-highlight badge-rose">🔴 %${roic} (Düşük)</span>`;
}

function getWaccBadge(wacc) {
    return `<span class="badge-highlight badge-cyan">🔵 %${wacc}</span>`;
}

function getEvaBadge(roic, wacc) {
    const evalData = getRoicWaccEvaluation(roic, wacc);
    return evalData.badgeShort;
}

function getRoeBadge(roe) {
    if (roe >= 40) return `<span class="badge-highlight badge-emerald">🟢 %${roe} (Yüksek)</span>`;
    if (roe >= 25) return `<span class="badge-highlight badge-amber">🟡 %${roe} (Makul)</span>`;
    return `<span class="badge-highlight badge-rose">🔴 %${roe} (Düşük)</span>`;
}

function getPeBadge(pe) {
    if (pe <= 8.0) return `<span class="badge-highlight badge-emerald">🟢 ${pe}x (Cazip)</span>`;
    if (pe <= 14.0) return `<span class="badge-highlight badge-amber">🟡 ${pe}x (Makul)</span>`;
    return `<span class="badge-highlight badge-rose">🔴 ${pe}x (Yüksek)</span>`;
}

function getPbBadge(pb) {
    if (pb <= 2.5) return `<span class="badge-highlight badge-emerald">🟢 ${pb}x (Cazip)</span>`;
    if (pb <= 4.5) return `<span class="badge-highlight badge-amber">🟡 ${pb}x (Makul)</span>`;
    return `<span class="badge-highlight badge-rose">🔴 ${pb}x (Yüksek)</span>`;
}

function getDebtBadge(netDebt) {
    if (netDebt <= 0) return `<span class="badge-highlight badge-emerald">🟢 ${netDebt}x (Borçsuz)</span>`;
    if (netDebt <= 1.5) return `<span class="badge-highlight badge-amber">🟡 ${netDebt}x (Makul)</span>`;
    return `<span class="badge-highlight badge-rose">🔴 ${netDebt}x (Borç Riski)</span>`;
}

// Explicit Valuation Decision Rule Engine
function getValuationDecisionRule(stock) {
    const evalData = getRoicWaccEvaluation(stock.metrics.roic, stock.metrics.wacc);

    return {
        badge: evalData.badge,
        explanation: `<strong>ROIC - WACC Kuralı (${evalData.scoreText}):</strong> ${evalData.text}`
    };
}

function openValuationRulesHelpModal() {
    const modal = document.getElementById("valuationRulesHelpModal");
    if (modal) modal.classList.add("active");
}

function closeValuationRulesHelpModal() {
    const modal = document.getElementById("valuationRulesHelpModal");
    if (modal) modal.classList.remove("active");
}

// ----------------------------------------------------
// 1. Tab Switcher System
// ----------------------------------------------------
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

// ----------------------------------------------------
// 2. Custom HTML5 Live Ticker Tape Generator
// ----------------------------------------------------
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

// ----------------------------------------------------
// 3. Portfolio Management & Weighted ROIC / WACC Calculator
// ----------------------------------------------------
function renderPortfolioTable() {
    const tbody = document.getElementById("portfolioTableBody");
    if (!tbody) return;

    let totalCost = 0;
    let totalCurrentValue = 0;
    let weightedRoicSum = 0;
    let weightedWaccSum = 0;

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
            weightedWaccSum += (stock.metrics.wacc * positionValue);
        }

        const eva = stock.metrics.roic - stock.metrics.wacc;

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
                <td>${getRoicBadge(stock.metrics.roic)}</td>
                <td>${getWaccBadge(stock.metrics.wacc)}</td>
                <td>${getEvaBadge(stock.metrics.roic, stock.metrics.wacc)}</td>
            </tr>
        `;
    }).join("");

    const totalPnl = totalCurrentValue - totalCost;
    const totalPnlPercent = totalCost > 0 ? ((totalPnl / totalCost) * 100).toFixed(2) : 0;
    const weightedRoic = totalCurrentValue > 0 ? (weightedRoicSum / totalCurrentValue).toFixed(1) : 0;
    const weightedWacc = totalCurrentValue > 0 ? (weightedWaccSum / totalCurrentValue).toFixed(1) : 0;
    const netEva = (weightedRoic - weightedWacc).toFixed(1);

    const valEl = document.getElementById("portTotalValue");
    const costEl = document.getElementById("portTotalCost");
    const pnlEl = document.getElementById("portTotalPnl");
    const roicEl = document.getElementById("portWeightedRoic");
    const waccEl = document.getElementById("portWeightedWacc");
    const evaEl = document.getElementById("portNetEva");

    if (valEl) valEl.innerText = `${totalCurrentValue.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺`;
    if (costEl) costEl.innerText = `${totalCost.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺`;
    if (pnlEl) pnlEl.innerHTML = `<span class="${totalPnl >= 0 ? 'trend-up' : 'trend-down'}">${totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺ (%${totalPnlPercent})</span>`;
    if (roicEl) roicEl.innerText = `%${weightedRoic}`;
    if (waccEl) waccEl.innerText = `%${weightedWacc}`;
    if (evaEl) evaEl.innerHTML = `<span class="${netEva >= 0 ? 'trend-up' : 'trend-down'}">${netEva >= 0 ? '+' : ''}%${netEva} EVA</span>`;

    initLucideIcons();
}

function updatePortfolioItem(code, field, value) {
    if (!userPortfolio[code]) userPortfolio[code] = { qty: 0, cost: 0 };
    userPortfolio[code][field] = parseFloat(value) || 0;
    localStorage.setItem("bist_user_portfolio", JSON.stringify(userPortfolio));
    renderPortfolioTable();
}

// ----------------------------------------------------
// 4. Custom Alert Rules Builder Modülü
// ----------------------------------------------------
function renderCustomRulesList() {
    const listContainer = document.getElementById("customRulesList");
    if (!listContainer) return;

    if (customAlertRules.length === 0) {
        listContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem;">Henüz özel kural eklenmedi.</div>`;
        return;
    }

    listContainer.innerHTML = customAlertRules.map(rule => {
        const metricLabel = rule.metric === "roic" ? "ROIC" : (rule.metric === "wacc" ? "WACC" : (rule.metric === "roe" ? "ROE" : (rule.metric === "peRatio" ? "F/K" : "Net Borç/FAVÖK")));
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

// ----------------------------------------------------
// 5. Telegram Notification Bot Config
// ----------------------------------------------------
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

    const message = encodeURIComponent(`🚨 BIST ROIC/ROE/WACC Terminal Test Bildirimi!\n\n14 BIST hissenizin takibi aktif edilmiştir.\nEGEEN ROIC: %42.1 | WACC: %22.5 (EVA +%19.6)\nFROTO ROE: %52.4\n\nBaşarıyla bağlandınız! 🎉`);
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

// ----------------------------------------------------
// 6. Technical & Comparison Charts
// ----------------------------------------------------
function renderTechnicalPaneChart(code) {
    const stock = BIST_STOCKS.find(s => s.code === code) || BIST_STOCKS[2];
    const ctx = document.getElementById("technicalPaneCanvas");
    const titleEl = document.getElementById("technicalChartTitle");
    const tvLinkEl = document.getElementById("tvDirectLink");

    if (titleEl) titleEl.innerText = `${stock.code} - ${stock.name} Canlı Performans, ROIC & WACC Grafiği`;
    if (tvLinkEl) tvLinkEl.href = `https://tr.tradingview.com/symbols/BIST-${stock.code}/`;

    if (!ctx) return;
    if (technicalChartInstance) technicalChartInstance.destroy();

    const quarters = stock.historical8Q.map(h => h.quarter);
    const roicData = stock.historical8Q.map(h => h.roic);
    const waccData = stock.historical8Q.map(h => h.wacc);
    const roeData = stock.historical8Q.map(h => h.roe);
    const revenueData = stock.historical8Q.map(h => h.revenue);

    const textThemeColor = currentTheme === "dark" ? "#f8fafc" : "#0f172a";
    const gridThemeColor = currentTheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)";

    technicalChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: quarters,
            datasets: [
                { type: 'line', label: 'ROIC (%)', data: roicData, borderColor: '#10b981', borderWidth: 3, yAxisID: 'y' },
                { type: 'line', label: 'WACC (%)', data: waccData, borderColor: '#0284c7', borderWidth: 2, borderDash: [5, 5], yAxisID: 'y' },
                { type: 'line', label: 'ROE (%)', data: roeData, borderColor: '#4f46e5', borderWidth: 3, yAxisID: 'y' },
                { type: 'bar', label: 'Çeyreklik Satış Geliri (Milyon TL)', data: revenueData, backgroundColor: 'rgba(245, 158, 11, 0.25)', borderColor: '#f59e0b', borderWidth: 1, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textThemeColor } } },
            scales: {
                x: { ticks: { color: textThemeColor }, grid: { color: gridThemeColor } },
                y: { type: 'linear', position: 'left', ticks: { color: textThemeColor } },
                y1: { type: 'linear', position: 'right', ticks: { color: '#f59e0b' } }
            }
        }
    });
}

function changeTvPaneSymbol(code) {
    renderTechnicalPaneChart(code);
}

// ----------------------------------------------------
// 7. Core Table & Overview Renderers
// ----------------------------------------------------
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
    const avgWacc = (BIST_STOCKS.reduce((acc, stock) => acc + stock.metrics.wacc, 0) / BIST_STOCKS.length).toFixed(1);
    const avgEva = (avgRoic - avgWacc).toFixed(1);
    const topRoicStock = [...BIST_STOCKS].sort((a, b) => b.metrics.roic - a.metrics.roic)[0];

    const metricsContainer = document.getElementById("summaryGrid");
    if (!metricsContainer) return;

    metricsContainer.innerHTML = `
        <div class="metric-card">
            <div class="metric-header"><span>PORTFÖY ORTALAMA ROIC</span><div class="metric-icon icon-cyan"><i data-lucide="zap"></i></div></div>
            <div class="metric-value">%${avgRoic}</div>
            <div class="metric-subtext">14 Şirket Sermaye Verimliliği</div>
        </div>
        <div class="metric-card">
            <div class="metric-header"><span>ORTALAMA WACC MALİYETİ</span><div class="metric-icon icon-purple"><i data-lucide="percent"></i></div></div>
            <div class="metric-value">%${avgWacc}</div>
            <div class="metric-subtext">Ağırlıklı Sermaye Maliyeti</div>
        </div>
        <div class="metric-card">
            <div class="metric-header"><span>NET EVA KATMA DEĞER SPREAD</span><div class="metric-icon icon-emerald"><i data-lucide="sparkles"></i></div></div>
            <div class="metric-value trend-up">+%${avgEva}</div>
            <div class="metric-subtext">ROIC - WACC Net Verim Farkı</div>
        </div>
        <div class="metric-card">
            <div class="metric-header"><span>PORTFÖY ORTALAMA ROE</span><div class="metric-icon icon-blue"><i data-lucide="trending-up"></i></div></div>
            <div class="metric-value">%${avgRoe}</div>
            <div class="metric-subtext">Özkaynak Karlılık Oranı</div>
        </div>
        <div class="metric-card">
            <div class="metric-header"><span>VERİMLİLİK LİDERİ</span><div class="metric-icon icon-emerald"><i data-lucide="award"></i></div></div>
            <div class="metric-value">${topRoicStock.code} (%${topRoicStock.metrics.roic})</div>
            <div class="metric-subtext">${topRoicStock.name}</div>
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
        const changeClass = stock.change >= 0 ? "trend-up" : "trend-down";
        const changeSign = stock.change >= 0 ? "+" : "";

        const customBadgesHtml = evaluateCustomRules(stock);
        const valuationRule = getValuationDecisionRule(stock);

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
                <td>${getRoicBadge(stock.metrics.roic)}</td>
                <td>${getWaccBadge(stock.metrics.wacc)}</td>
                <td>${getEvaBadge(stock.metrics.roic, stock.metrics.wacc)}</td>
                <td>${getRoeBadge(stock.metrics.roe)}</td>
                <td>
                    <div style="font-size: 0.82rem;">
                        <div>Marj: <strong>%${stock.metrics.dupont.netMargin}</strong></div>
                        <div>Devir: <strong>${stock.metrics.dupont.assetTurnover}x</strong></div>
                        <div>Kaldıraç: <strong>${stock.metrics.dupont.leverage}x</strong></div>
                    </div>
                </td>
                <td>${getPeBadge(stock.metrics.peRatio)}</td>
                <td>${getPbBadge(stock.metrics.pbRatio)}</td>
                <td>${getDebtBadge(stock.metrics.netDebtToEbitda)}</td>
                <td>
                    <div>${valuationRule.badge}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; max-width: 220px;">
                        ${valuationRule.explanation}
                    </div>
                    ${customBadgesHtml ? `<div style="margin-top: 4px;">${customBadgesHtml}</div>` : ''}
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
    if (path === "eva") {
        return obj.metrics.roic - obj.metrics.wacc;
    }
    if (path.includes(".")) {
        const parts = path.split(".");
        return parts.reduce((acc, part) => acc && acc[part], obj);
    }
    return obj.metrics[path] !== undefined ? obj.metrics[path] : obj[path];
}

function renderHistoricalMatrix() {
    const tableEl = document.getElementById("historicalMatrixBody");
    const headerEl = document.getElementById("historicalMatrixHeader");
    if (!tableEl) return;

    const allQuarters = BIST_STOCKS[0].historical8Q.map(h => h.quarter);

    if (headerEl) {
        headerEl.innerHTML = `
            <tr>
                <th style="min-width: 140px;">Hisse Kodu</th>
                ${allQuarters.map(q => `<th style="text-align: center; min-width: 75px;">${q}</th>`).join('')}
                <th style="min-width: 120px;">${allQuarters.length}-Çeyreklik Trend</th>
            </tr>
        `;
    }

    tableEl.innerHTML = BIST_STOCKS.map(stock => {
        const qData = stock.historical8Q;
        const getItemVal = (item) => {
            if (!item) return 0;
            if (matrixMetric === "eva") return parseFloat((item.roic - item.wacc).toFixed(1));
            return item[matrixMetric] || item["roic"];
        };

        const qFirst = getItemVal(qData[0]);
        const qLast = getItemVal(qData[qData.length - 1]);
        const delta = (qLast - qFirst).toFixed(1);
        const deltaClass = delta >= 0 ? "trend-up" : "trend-down";

        const qCells = allQuarters.map(q => {
            const item = qData.find(d => d.quarter === q);
            const val = getItemVal(item);
            let bgClass = "heatmap-cyan";

            if (matrixMetric === "roic" || matrixMetric === "roe") {
                bgClass = val >= 38 ? "heatmap-emerald-dark" : (val >= 30 ? "heatmap-emerald" : (val >= 20 ? "heatmap-cyan" : "heatmap-amber"));
            } else if (matrixMetric === "eva") {
                bgClass = val >= 15 ? "heatmap-emerald-dark" : (val >= 10 ? "heatmap-emerald" : (val >= 5 ? "heatmap-cyan" : (val >= 0 ? "heatmap-amber" : "heatmap-rose")));
            } else {
                bgClass = "heatmap-cyan";
            }
            const prefix = (matrixMetric === "eva" && val > 0) ? "+" : "";
            return `<td class="heatmap-cell ${bgClass}">${prefix}%${val}</td>`;
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
    const btnRoic = document.getElementById("btnMatrixRoic");
    const btnRoe = document.getElementById("btnMatrixRoe");
    const btnWacc = document.getElementById("btnMatrixWacc");
    const btnEva = document.getElementById("btnMatrixEva");
    const indicatorName = document.getElementById("activeMatrixName");

    if (btnRoic) btnRoic.classList.toggle("active", metric === "roic");
    if (btnRoe) btnRoe.classList.toggle("active", metric === "roe");
    if (btnWacc) btnWacc.classList.toggle("active", metric === "wacc");
    if (btnEva) btnEva.classList.toggle("active", metric === "eva");

    if (indicatorName) {
        if (metric === "roic") indicatorName.innerText = "⚡ ROIC (Sermaye Verimliliği) Matrisi";
        else if (metric === "roe") indicatorName.innerText = "📈 ROE (Özkaynak Kârlılığı) Matrisi";
        else if (metric === "wacc") indicatorName.innerText = "🔵 WACC (Sermaye Maliyeti) Matrisi";
        else if (metric === "eva") indicatorName.innerText = "✨ EVA (Ekonomik Katma Değer) Matrisi";
    }

    renderHistoricalMatrix();
}

function renderComparisonChart() {
    const ctx = document.getElementById("compareChartCanvas");
    if (!ctx) return;
    if (compareChartInstance) compareChartInstance.destroy();

    const selectedCodes = ["EGEEN", "CLEBI", "FROTO", "ISMEN", "LKMNH"];
    const stockRef = BIST_STOCKS.find(s => s.code === "EGEEN") || BIST_STOCKS[0];
    const quarters = stockRef.historical8Q.map(h => h.quarter);
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
    csvContent += "Sira No,Hisse Kodu,Sirket Adi,Sektor,Dogrulanmis BIST Fiyati (TL),ROIC (%),WACC (%),EVA Spread (%),ROE (%),Net Marj (%),Varlik Devir Hizi,Kaldırac,F/K,PD/DD,Net Borc/FAVOK\n";

    BIST_STOCKS.forEach(s => {
        const eva = (s.metrics.roic - s.metrics.wacc).toFixed(1);
        const row = [
            s.order, s.code, `"${s.name}"`, `"${s.sector}"`, s.price,
            s.metrics.roic, s.metrics.wacc, eva, s.metrics.roe, s.metrics.dupont.netMargin,
            s.metrics.dupont.assetTurnover, s.metrics.dupont.leverage,
            s.metrics.peRatio, s.metrics.pbRatio, s.metrics.netDebtToEbitda
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BIST_14_Hisse_ROIC_ROE_WACC_Rapor_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function renderKapFeed() {
    const feedContainer = document.getElementById("kapFeedGrid");
    const stockFilter = document.getElementById("kapStockFilter") ? document.getElementById("kapStockFilter").value : "ALL";
    const sentimentFilter = document.getElementById("kapSentimentFilter") ? document.getElementById("kapSentimentFilter").value : "ALL";
    const searchQuery = document.getElementById("kapSearchInput") ? document.getElementById("kapSearchInput").value.trim().toLowerCase() : "";
    const countBadge = document.getElementById("kapCountBadge");

    if (!feedContainer) return;

    let allDisclosures = [];
    BIST_STOCKS.forEach(stock => {
        if (stock.kapDisclosures) {
            stock.kapDisclosures.forEach(disc => {
                allDisclosures.push({ ...disc, stockCode: stock.code, stockName: stock.name });
            });
        }
    });

    // 1. Stock Filter
    if (stockFilter && stockFilter !== "ALL") {
        allDisclosures = allDisclosures.filter(d => d.stockCode === stockFilter);
    }

    // 2. Sentiment Filter
    if (sentimentFilter && sentimentFilter !== "ALL") {
        allDisclosures = allDisclosures.filter(d => d.sentiment === sentimentFilter);
    }

    // 3. Search Query Filter
    if (searchQuery) {
        allDisclosures = allDisclosures.filter(d => {
            const text = (d.title + " " + d.summary + " " + (d.positiveImpact || "") + " " + (d.negativeImpact || "") + " " + d.stockCode + " " + d.category).toLowerCase();
            return text.includes(searchQuery);
        });
    }

    // Sort newest date first
    allDisclosures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Update Counter Badge
    if (countBadge) {
        countBadge.innerHTML = `📂 Toplam <strong>${allDisclosures.length}</strong> Arşivlenmiş KAP İkazı`;
    }

    if (allDisclosures.length === 0) {
        feedContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-lg); color: var(--text-muted);">
                <i data-lucide="search-x" style="width: 42px; height: 42px; margin-bottom: 12px; opacity: 0.5;"></i>
                <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 4px;">Aradığınız Kriterlere Uygun KAP İkazı Bulunamadı</div>
                <div style="font-size: 0.88rem;">Filtreleri sıfırlayarak tüm 14 hissenin tarihsel KAP arşivine göz atabilirsiniz.</div>
            </div>
        `;
        initLucideIcons();
        return;
    }

    feedContainer.innerHTML = allDisclosures.map(disc => {
        const sentimentClass = disc.sentiment === "positive" ? "badge-emerald" : "badge-amber";
        const sentimentLabel = disc.sentiment === "positive" ? "🟢 POZİTİF SİNYAL" : "⚠️ RİSK SİNYALİ";

        return `
            <div class="kap-card">
                <div>
                    <div class="kap-header">
                        <span class="kap-ticker-badge">${disc.stockCode} - ${disc.category}</span>
                        <span class="kap-date">${disc.date}</span>
                    </div>
                    <div class="kap-title" style="font-size: 1.05rem; line-height: 1.4; margin-bottom: 8px;">${disc.title}</div>
                    <div class="kap-summary" style="margin-bottom: 12px; color: var(--text-secondary); font-size: 0.88rem;">${disc.summary}</div>

                    <!-- Highlighted Positive and Negative Sides -->
                    <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10b981; padding: 8px 12px; border-radius: 4px; margin-bottom: 8px; font-size: 0.84rem; line-height: 1.4;">
                        <strong style="color: #10b981;">🟢 Olumlu Tarafı:</strong> ${disc.positiveImpact || ''}
                    </div>

                    <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px; font-size: 0.84rem; line-height: 1.4;">
                        <strong style="color: #ef4444;">🔴 Olumsuz Yön / Risk:</strong> ${disc.negativeImpact || ''}
                    </div>
                </div>
                <div>
                    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <span class="badge-highlight ${sentimentClass}">${sentimentLabel}</span>
                        <span style="font-size: 0.78rem; color: var(--text-muted);">KAP Etkisi: <strong>${disc.impactScore}/10</strong></span>
                    </div>
                    <div class="ai-eval-box" style="background: var(--bg-main); border: 1px solid var(--border-color); padding: 10px 12px; border-radius: var(--radius-md);">
                        <div class="ai-eval-title" style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 4px;">
                            <i data-lucide="zap"></i> ROE / ROIC / WACC Etkisi:
                        </div>
                        <div style="font-weight: 700; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-primary);">
                            ${disc.financialImpactTag || ''}
                        </div>
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
        const valuationRule = getValuationDecisionRule(stock);

        return `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>
                    <div class="stock-title">${stock.code}</div>
                    <div class="stock-name">${stock.name}</div>
                </td>
                <td>${getRoicBadge(stock.metrics.roic)}</td>
                <td>${getWaccBadge(stock.metrics.wacc)}</td>
                <td>%${earningsYield} (${stock.metrics.peRatio}x F/K)</td>
                <td><span class="badge-highlight badge-cyan">${compositeScore} Puan</span></td>
                <td>
                    <div>${valuationRule.badge}</div>
                    <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 4px;">
                        ${valuationRule.explanation}
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    initLucideIcons();
}

function openCompanyModal(code) {
    const stock = BIST_STOCKS.find(s => s.code === code);
    if (!stock) return;

    const modal = document.getElementById("companyModal");
    const eva = (stock.metrics.roic - stock.metrics.wacc).toFixed(1);
    const valuationRule = getValuationDecisionRule(stock);

    document.getElementById("modalTitle").innerHTML = `${stock.code} - ${stock.name}`;
    document.getElementById("modalBody").innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div style="font-size: 0.95rem; font-weight: 700;">
                BIST Fiyatı: <span style="color: var(--accent-primary); font-family: var(--font-mono);">${stock.price.toLocaleString("tr-TR", {minimumFractionDigits: 2})} ₺</span>
            </div>
            <a href="https://tr.tradingview.com/symbols/BIST-${stock.code}/" target="_blank" class="btn-primary" style="font-size: 0.82rem; padding: 6px 14px;">
                <i data-lucide="external-link"></i> TradingView.com'da Canlı Gör (BIST:${stock.code})
            </a>
        </div>

        <!-- Değerleme Kararı Açıklaması Kutu -->
        <div style="background: var(--bg-main); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-weight: 700; color: var(--text-primary);">Değerleme Kararı & Kuralı:</span>
                ${valuationRule.badge}
            </div>
            <div style="font-size: 0.88rem; color: var(--text-secondary);">
                ${valuationRule.explanation}
            </div>
        </div>

        <div class="modal-grid-2" style="margin-bottom: 20px;">
            <div class="chart-container-box">
                <h4 style="font-family: var(--font-heading); margin-bottom: 12px; color: var(--text-primary);">
                    8 Çeyreklik ROE vs ROIC vs WACC Trend Grafiği (2024/Q2 - 2026/Q1)
                </h4>
                <canvas id="modalChartCanvas"></canvas>
            </div>
            <div>
                <h4 style="font-family: var(--font-heading); margin-bottom: 12px; color: var(--text-primary);">
                    ROIC, WACC & EVA Katma Değer Analizi
                </h4>
                <div style="background: var(--bg-main); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>ROIC (Sermaye Getirisi):</span><strong style="color: var(--accent-success);">%${stock.metrics.roic}</strong></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>WACC (Sermaye Maliyeti):</span><strong style="color: var(--accent-primary);">%${stock.metrics.wacc}</strong></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>EVA Spread (Fark):</span><strong class="${eva >= 0 ? 'trend-up' : 'trend-down'}">${eva >= 0 ? '+' : ''}%${eva}</strong></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>NOPAT:</span><strong>${stock.metrics.nopat} Milyon TL</strong></div>
                    <div style="display: flex; justify-content: space-between;"><span>Yatırılan Sermaye:</span><strong>${stock.metrics.investedCapital} Milyon TL</strong></div>
                </div>

                <h4 style="font-family: var(--font-heading); margin-bottom: 12px; color: var(--text-primary);">
                    DuPont Analizi (ROE %${stock.metrics.roe})
                </h4>
                <div style="background: var(--bg-main); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Net Marj:</span><strong>%${stock.metrics.dupont.netMargin}</strong></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Devir Hızı:</span><strong>${stock.metrics.dupont.assetTurnover}x</strong></div>
                    <div style="display: flex; justify-content: space-between;"><span>Kaldıraç:</span><strong>${stock.metrics.dupont.leverage}x</strong></div>
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
                    { label: 'ROIC (%)', data: stock.historical8Q.map(h => h.roic), borderColor: '#10b981', borderWidth: 3, tension: 0.3 },
                    { label: 'WACC (%)', data: stock.historical8Q.map(h => h.wacc || stock.metrics.wacc), borderColor: '#0284c7', borderWidth: 2, borderDash: [5, 5], tension: 0.3 },
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

function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;
    const iconName = type === "success" ? "check-circle" : "info";
    toast.innerHTML = `
        <i data-lucide="${iconName}" style="width: 20px; height: 20px; color: ${type === "success" ? "var(--accent-success)" : "var(--accent-secondary)"}"></i>
        <div>${message}</div>
    `;
    container.appendChild(toast);
    initLucideIcons();

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(50px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function manualRefreshKapFeed() {
    const spinnerHeader = document.getElementById("headerKapSpinner");
    const spinnerTab = document.getElementById("kapSyncSpinner");

    if (spinnerHeader) spinnerHeader.classList.add("spin-icon");
    if (spinnerTab) spinnerTab.classList.add("spin-icon");

    showToast("🔄 BIST Fiyatları & KAP Akışı Taranıyor...", "info");

    fetchLiveBistPrices();

    setTimeout(() => {
        renderKapFeed();

        if (spinnerHeader) spinnerHeader.classList.remove("spin-icon");
        if (spinnerTab) spinnerTab.classList.remove("spin-icon");

        showToast("⚡ BIST Canlı Fiyatları & KAP Akışı Başarıyla Güncellendi!", "success");
    }, 1000);
}

function startAutomaticLiveEngine() {
    // Initial live fetch
    fetchLiveBistPrices();

    // Silent background live price update every 60 seconds (No popup spam)
    setInterval(() => {
        fetchLiveBistPrices();
    }, 60000);
}
