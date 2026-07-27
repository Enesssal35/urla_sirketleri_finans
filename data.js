// BIST 14 Stock Financial & KAP Database with WACC & Valuation Rules
// EXACT USER ORDER: EGEEN, CLEBI, FROTO, BRSAN, CCOLA, OTKAR, ISMEN, PGSUS, ANSGR, LOGO, LKMNH, ALKA, SODSN, ALTNY
const BIST_STOCKS = [
    {
        order: 1,
        symbol: "EGEEN.IS",
        code: "EGEEN",
        name: "Ege Endüstri ve Ticaret A.Ş.",
        sector: "Otomotiv Yan Sanayi",
        price: 5450.00,
        change: -0.55,
        marketCap: 17.1,
        metrics: {
            roe: 38.5, roic: 42.1, wacc: 22.5, nopat: 2840, investedCapital: 6745, netIncome: 3120, equity: 8100,
            totalDebt: 1200, cash: 2555, revenue: 9450, assets: 12400, netDebtToEbitda: -0.4, peRatio: 12.4, pbRatio: 4.80,
            dupont: { netMargin: 33.0, assetTurnover: 0.76, leverage: 1.53 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 31.0, roic: 34.5, wacc: 24.0, nopat: 580, netIncome: 520, revenue: 1850 },
            { quarter: "2024/Q3", roe: 32.5, roic: 35.8, wacc: 23.5, nopat: 620, netIncome: 580, revenue: 1980 },
            { quarter: "2024/Q4", roe: 33.8, roic: 36.9, wacc: 23.0, nopat: 650, netIncome: 620, revenue: 2050 },
            { quarter: "2025/Q1", roe: 33.0, roic: 36.2, wacc: 23.2, nopat: 640, netIncome: 600, revenue: 2000 },
            { quarter: "2025/Q2", roe: 34.2, roic: 37.8, wacc: 22.8, nopat: 690, netIncome: 680, revenue: 2100 },
            { quarter: "2025/Q3", roe: 36.1, roic: 39.5, wacc: 22.5, nopat: 750, netIncome: 790, revenue: 2350 },
            { quarter: "2025/Q4", roe: 37.8, roic: 41.0, wacc: 22.5, nopat: 780, netIncome: 810, revenue: 2400 },
            { quarter: "2026/Q1", roe: 38.5, roic: 42.1, wacc: 22.5, nopat: 810, netIncome: 840, revenue: 2600 }
        ],
        alerts: [
            { id: 1, type: "success", title: "Yüksek ROIC İkazı", message: "ROIC %42.1 ile WACC (%22.5) maliyetinin %19.6 üzerinde EVA katma değeri yaratıyor." }
        ],
        kapDisclosures: [
            {
                id: "KAP-EGEEN-101", date: "2026-07-24 18:30", category: "Özel Durum Açıklaması",
                title: "Yeni Ürün Serisi ve İhracat Sözleşmesi", summary: "45M EUR tutarında 3 yıllık aks dingili tedarik sözleşmesi imzalandı.",
                sentiment: "positive", impactScore: 9, aiEvaluation: "NOPAT marjını ve EVA katma değerini olumlu etkileyecek."
            }
        ],
        activityReportSummary: { capacityUtilization: 88, exportRatio: 84, fxPosition: "+1.2M TL", capexPlans: "15M EUR otomasyon.", swot: { strengths: ["Yüksek ROIC vs WACC farkı"], risks: ["Avrupa pazar yavaşlaması"] } }
    },
    {
        order: 2,
        symbol: "CLEBI.IS",
        code: "CLEBI",
        name: "Çelebi Hava Servisi A.Ş.",
        sector: "Havacılık & Yer Hizmetleri",
        price: 1498.00,
        change: 0.54,
        marketCap: 36.4,
        metrics: {
            roe: 48.2, roic: 36.8, wacc: 24.0, nopat: 3150, investedCapital: 8560, netIncome: 3420, equity: 7095,
            totalDebt: 4200, cash: 2740, revenue: 14200, assets: 16800, netDebtToEbitda: 0.8, peRatio: 10.6, pbRatio: 5.13,
            dupont: { netMargin: 24.1, assetTurnover: 0.85, leverage: 2.37 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 38.0, roic: 29.1, wacc: 25.5, nopat: 520, netIncome: 580, revenue: 2600 },
            { quarter: "2024/Q3", roe: 41.5, roic: 31.8, wacc: 25.0, nopat: 720, netIncome: 810, revenue: 3200 },
            { quarter: "2024/Q4", roe: 39.8, roic: 30.5, wacc: 24.8, nopat: 610, netIncome: 690, revenue: 2800 },
            { quarter: "2025/Q1", roe: 40.2, roic: 31.0, wacc: 24.5, nopat: 630, netIncome: 700, revenue: 2900 },
            { quarter: "2025/Q2", roe: 42.0, roic: 32.5, wacc: 24.2, nopat: 680, netIncome: 720, revenue: 3100 },
            { quarter: "2025/Q3", roe: 45.5, roic: 34.8, wacc: 24.0, nopat: 890, netIncome: 980, revenue: 3900 },
            { quarter: "2025/Q4", roe: 47.1, roic: 35.9, wacc: 24.0, nopat: 790, netIncome: 840, revenue: 3500 },
            { quarter: "2026/Q1", roe: 48.2, roic: 36.8, wacc: 24.0, nopat: 820, netIncome: 880, revenue: 3700 }
        ],
        alerts: [{ id: 1, type: "success", title: "Güçlü ROE & EVA Katma Değeri", message: "ROE %48.2, ROIC (%36.8) WACC'ın (%24.0) belirgin şekilde üzerinde." }],
        kapDisclosures: [{ id: "KAP-CLEBI-201", date: "2026-07-20 11:15", category: "Özel Durum Açıklaması", title: "Delhi Havalimanı Sözleşme Uzatımı", summary: "Lisans 5 yıl uzatıldı.", sentiment: "positive", impactScore: 9, aiEvaluation: "Ciro ve sermaye getirisi garantisi." }],
        activityReportSummary: { capacityUtilization: 82, exportRatio: 68, fxPosition: "+850M TL", capexPlans: "Endonezya yatırımı.", swot: { strengths: ["Hindistan pazar hakimiyeti"], risks: ["Seyahat kısıtları"] } }
    },
    {
        order: 3,
        symbol: "FROTO.IS",
        code: "FROTO",
        name: "Ford Otomotiv Sanayi A.Ş.",
        sector: "Otomotiv",
        price: 79.00,
        change: -0.50,
        marketCap: 277.2,
        metrics: {
            roe: 52.4, roic: 29.5, wacc: 21.0, nopat: 31200, investedCapital: 105760, netIncome: 35800, equity: 68320,
            totalDebt: 62000, cash: 24560, revenue: 215000, assets: 185000, netDebtToEbitda: 1.2, peRatio: 7.74, pbRatio: 4.05,
            dupont: { netMargin: 16.65, assetTurnover: 1.16, leverage: 2.71 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 44.0, roic: 24.5, wacc: 22.5, nopat: 5800, netIncome: 6200, revenue: 41000 },
            { quarter: "2024/Q3", roe: 46.2, roic: 25.8, wacc: 22.0, nopat: 6400, netIncome: 7100, revenue: 45000 },
            { quarter: "2024/Q4", roe: 47.5, roic: 26.5, wacc: 21.8, nopat: 7100, netIncome: 7800, revenue: 49000 },
            { quarter: "2025/Q1", roe: 46.8, roic: 26.0, wacc: 21.5, nopat: 6800, netIncome: 7400, revenue: 46000 },
            { quarter: "2025/Q2", roe: 48.1, roic: 27.2, wacc: 21.2, nopat: 7200, netIncome: 7900, revenue: 48000 },
            { quarter: "2025/Q3", roe: 50.3, roic: 28.1, wacc: 21.0, nopat: 8100, netIncome: 8800, revenue: 53000 },
            { quarter: "2025/Q4", roe: 51.8, roic: 29.0, wacc: 21.0, nopat: 8800, netIncome: 9600, revenue: 58000 },
            { quarter: "2026/Q1", roe: 52.4, roic: 29.5, wacc: 21.0, nopat: 8700, netIncome: 9500, revenue: 56000 }
        ],
        alerts: [{ id: 1, type: "success", title: "BIST ROE Lideri & Cazip F/K", message: "ROE %52.4 ile sektör şampiyonu, F/K 7.74x." }],
        kapDisclosures: [{ id: "KAP-FROTO-301", date: "2026-07-25 09:30", category: "Özel Durum Açıklaması", title: "Elektrikli Araç Üretimi Güncellemesi", summary: "Custom & Courier üretimi beklentileri aştı.", sentiment: "positive", impactScore: 8, aiEvaluation: "Marj artışı." }],
        activityReportSummary: { capacityUtilization: 89, exportRatio: 79, fxPosition: "+2.4B EUR", capexPlans: "Batarya tesisi.", swot: { strengths: ["Ford Europe anlaşması"], risks: ["Avrupa pazar daralması"] } }
    },
    {
        order: 4,
        symbol: "BRSAN.IS",
        code: "BRSAN",
        name: "Borusan Birleşik Boru Fabrikaları A.Ş.",
        sector: "Metal Ana Sanayi / Çelik Boru",
        price: 570.50,
        change: 2.33,
        marketCap: 80.9,
        metrics: {
            roe: 28.4, roic: 24.1, wacc: 23.5, nopat: 5840, investedCapital: 24230, netIncome: 6200, equity: 21830,
            totalDebt: 9800, cash: 7400, revenue: 54000, assets: 41200, netDebtToEbitda: 0.5, peRatio: 13.0, pbRatio: 3.70,
            dupont: { netMargin: 11.48, assetTurnover: 1.31, leverage: 1.89 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 19.5, roic: 16.2, wacc: 24.5, nopat: 1050, netIncome: 1100, revenue: 10200 },
            { quarter: "2024/Q3", roe: 21.0, roic: 17.5, wacc: 24.2, nopat: 1180, netIncome: 1220, revenue: 11000 },
            { quarter: "2024/Q4", roe: 22.8, roic: 18.9, wacc: 24.0, nopat: 1290, netIncome: 1350, revenue: 11800 },
            { quarter: "2025/Q1", roe: 22.0, roic: 18.2, wacc: 23.8, nopat: 1200, netIncome: 1250, revenue: 11200 },
            { quarter: "2025/Q2", roe: 24.0, roic: 20.1, wacc: 23.6, nopat: 1320, netIncome: 1300, revenue: 12000 },
            { quarter: "2025/Q3", roe: 26.2, roic: 22.0, wacc: 23.5, nopat: 1480, netIncome: 1550, revenue: 13800 },
            { quarter: "2025/Q4", roe: 27.5, roic: 23.4, wacc: 23.5, nopat: 1560, netIncome: 1650, revenue: 14200 },
            { quarter: "2026/Q1", roe: 28.4, roic: 24.1, wacc: 23.5, nopat: 1610, netIncome: 1700, revenue: 14000 }
        ],
        alerts: [{ id: 1, type: "success", title: "ABD Yatırımı Katkısı", message: "ABD tesisi sonrası ROIC WACC'ı (%23.5) aşmaya başladı." }],
        kapDisclosures: [{ id: "KAP-BRSAN-401", date: "2026-07-22 16:20", category: "Özel Durum Açıklaması", title: "ABD Enerji Boruları İhalesi", summary: "92M USD ihale kazanıldı.", sentiment: "positive", impactScore: 9, aiEvaluation: "NOPAT'a +%8 katkı." }],
        activityReportSummary: { capacityUtilization: 76, exportRatio: 72, fxPosition: "+450M USD", capexPlans: "Bergama modernizasyonu.", swot: { strengths: ["ABD üretici avantajı"], risks: ["Sac fiyat dalgalanması"] } }
    },
    {
        order: 5,
        symbol: "CCOLA.IS",
        code: "CCOLA",
        name: "Coca-Cola İçecek A.Ş.",
        sector: "Hızlı Tüketim / İçecek",
        price: 91.15,
        change: 0.05,
        marketCap: 231.8,
        metrics: {
            roe: 31.8, roic: 27.4, wacc: 22.0, nopat: 12400, investedCapital: 45250, netIncome: 13900, equity: 43710,
            totalDebt: 18500, cash: 16960, revenue: 108000, assets: 92000, netDebtToEbitda: 0.2, peRatio: 16.6, pbRatio: 5.30,
            dupont: { netMargin: 12.87, assetTurnover: 1.17, leverage: 2.11 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 26.5, roic: 22.8, wacc: 23.0, nopat: 2600, netIncome: 2800, revenue: 22000 },
            { quarter: "2024/Q3", roe: 28.0, roic: 24.0, wacc: 22.8, nopat: 3400, netIncome: 3700, revenue: 28000 },
            { quarter: "2024/Q4", roe: 27.2, roic: 23.2, wacc: 22.5, nopat: 2700, netIncome: 2900, revenue: 21000 },
            { quarter: "2025/Q1", roe: 27.8, roic: 23.8, wacc: 22.5, nopat: 2800, netIncome: 3000, revenue: 23000 },
            { quarter: "2025/Q2", roe: 29.1, roic: 25.0, wacc: 22.2, nopat: 2950, netIncome: 3100, revenue: 25000 },
            { quarter: "2025/Q3", roe: 30.5, roic: 26.2, wacc: 22.0, nopat: 3850, netIncome: 4100, revenue: 31000 },
            { quarter: "2025/Q4", roe: 31.2, roic: 26.9, wacc: 22.0, nopat: 3100, netIncome: 3200, revenue: 24000 },
            { quarter: "2026/Q1", roe: 31.8, roic: 27.4, wacc: 22.0, nopat: 3300, netIncome: 3500, revenue: 28000 }
        ],
        alerts: [{ id: 1, type: "success", title: "Nakit Akış İstikrarı", message: "Orta Asya katkısıyla tutarlı ROIC vs WACC yayılımı." }],
        kapDisclosures: [{ id: "KAP-CCOLA-501", date: "2026-07-18 14:00", category: "Yeni Tesis", title: "Özbekistan 3. Fabrika Açılışı", summary: "Semerkant yeni hat devreye girdi.", sentiment: "positive", impactScore: 8, aiEvaluation: "Sabit maliyetleri düşürecek." }],
        activityReportSummary: { capacityUtilization: 81, exportRatio: 61, fxPosition: "+310M USD", capexPlans: "Bangladeş entegrasyonu.", swot: { strengths: ["Mükemmel dağıtım ağı"], risks: ["Şeker vergileri"] } }
    },
    {
        order: 6,
        symbol: "OTKAR.IS",
        code: "OTKAR",
        name: "Otokar Otomotiv ve Savunma Sanayi A.Ş.",
        sector: "Savunma & Ticari Araç",
        price: 327.00,
        change: -1.80,
        marketCap: 39.2,
        metrics: {
            roe: 35.6, roic: 28.2, wacc: 23.0, nopat: 4950, investedCapital: 17550, netIncome: 5120, equity: 14380,
            totalDebt: 9800, cash: 6630, revenue: 34500, assets: 31200, netDebtToEbitda: 0.9, peRatio: 7.65, pbRatio: 2.72,
            dupont: { netMargin: 14.84, assetTurnover: 1.10, leverage: 2.17 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 26.0, roic: 20.0, wacc: 24.5, nopat: 810, netIncome: 880, revenue: 6500 },
            { quarter: "2024/Q3", roe: 27.5, roic: 21.2, wacc: 24.0, nopat: 920, netIncome: 990, revenue: 7200 },
            { quarter: "2024/Q4", roe: 29.0, roic: 22.5, wacc: 23.8, nopat: 1010, netIncome: 1100, revenue: 7900 },
            { quarter: "2025/Q1", roe: 28.5, roic: 22.0, wacc: 23.5, nopat: 980, netIncome: 1020, revenue: 7100 },
            { quarter: "2025/Q2", roe: 30.2, roic: 23.5, wacc: 23.2, nopat: 1050, netIncome: 1050, revenue: 7500 },
            { quarter: "2025/Q3", roe: 32.4, roic: 25.1, wacc: 23.0, nopat: 1220, netIncome: 1280, revenue: 8800 },
            { quarter: "2025/Q4", roe: 34.0, roic: 26.8, wacc: 23.0, nopat: 1310, netIncome: 1390, revenue: 9400 },
            { quarter: "2026/Q1", roe: 35.6, roic: 28.2, wacc: 23.0, nopat: 1340, netIncome: 1400, revenue: 8800 }
        ],
        alerts: [{ id: 1, type: "success", title: "Savunma İhracat Patlaması", message: "ROIC %20.0'dan %28.2'ye fırladı." }],
        kapDisclosures: [{ id: "KAP-OTKAR-601", date: "2026-07-26 10:00", category: "Özel Durum Açıklaması", title: "Romanya Zırhlı Araç İmzası", summary: "1059 adet 4x4 zırhlı araç için imza töreni.", sentiment: "positive", impactScore: 10, aiEvaluation: "Tarihin en büyük ihracatı." }],
        activityReportSummary: { capacityUtilization: 85, exportRatio: 76, fxPosition: "+1.1B EUR", capexPlans: "Kapasite artırımı.", swot: { strengths: ["NATO standart zırhlılar"], risks: ["Bürokratik onaylar"] } }
    },
    {
        order: 7,
        symbol: "ISMEN.IS",
        code: "ISMEN",
        name: "İş Yatırım Menkul Değerler A.Ş.",
        sector: "Aracı Kurum / Finans",
        price: 36.30,
        change: 0.78,
        marketCap: 54.5,
        metrics: {
            roe: 56.8, roic: 48.9, wacc: 25.0, nopat: 11200, investedCapital: 22900, netIncome: 12450, equity: 21918,
            totalDebt: 5400, cash: 4418, revenue: 28500, assets: 49500, netDebtToEbitda: -0.1, peRatio: 4.37, pbRatio: 2.48,
            dupont: { netMargin: 43.68, assetTurnover: 0.58, leverage: 2.26 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 48.0, roic: 40.0, wacc: 26.0, nopat: 2200, netIncome: 2400, revenue: 5800 },
            { quarter: "2024/Q3", roe: 50.1, roic: 42.2, wacc: 25.8, nopat: 2500, netIncome: 2750, revenue: 6400 },
            { quarter: "2024/Q4", roe: 51.5, roic: 43.5, wacc: 25.5, nopat: 2600, netIncome: 2900, revenue: 6800 },
            { quarter: "2025/Q1", roe: 50.8, roic: 43.0, wacc: 25.5, nopat: 2450, netIncome: 2700, revenue: 6200 },
            { quarter: "2025/Q2", roe: 52.0, roic: 44.1, wacc: 25.2, nopat: 2600, netIncome: 2800, revenue: 6500 },
            { quarter: "2025/Q3", roe: 54.2, roic: 46.0, wacc: 25.0, nopat: 2850, netIncome: 3100, revenue: 7200 },
            { quarter: "2025/Q4", roe: 55.9, roic: 47.8, wacc: 25.0, nopat: 3000, netIncome: 3250, revenue: 7600 },
            { quarter: "2026/Q1", roe: 56.8, roic: 48.9, wacc: 25.0, nopat: 3050, netIncome: 3300, revenue: 7200 }
        ],
        alerts: [{ id: 1, type: "success", title: "Rekor ROE Zirvesi", message: "ROE %56.8 ile zirvede." }],
        kapDisclosures: [{ id: "KAP-ISMEN-701", date: "2026-07-21 17:10", category: "Finansal Rapor", title: "Halka Arz & Komisyon Gelirleri", summary: "Hacim payı %14.2'ye yükseldi.", sentiment: "positive", impactScore: 8, aiEvaluation: "Sermayesiz büyüyen iş modeli." }],
        activityReportSummary: { capacityUtilization: 95, exportRatio: 12, fxPosition: "+450M TL Likit Aktif", capexPlans: "Yapay zeka alım robotu.", swot: { strengths: ["BIST pazar liderliği"], risks: ["BIST işlem hacmi düşüşü"] } }
    },
    {
        order: 8,
        symbol: "PGSUS.IS",
        code: "PGSUS",
        name: "Pegasus Hava Taşımacılığı A.Ş.",
        sector: "Havacılık",
        price: 161.60,
        change: 0.75,
        marketCap: 80.8,
        metrics: {
            roe: 34.2, roic: 19.8, wacc: 22.5, nopat: 18400, investedCapital: 92929, netIncome: 14500, equity: 42397,
            totalDebt: 61500, cash: 10968, revenue: 98000, assets: 142000, netDebtToEbitda: 2.1, peRatio: 5.57, pbRatio: 1.90,
            dupont: { netMargin: 14.80, assetTurnover: 0.69, leverage: 3.35 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 28.0, roic: 16.2, wacc: 23.5, nopat: 2600, netIncome: 2700, revenue: 19000 },
            { quarter: "2024/Q3", roe: 35.0, roic: 20.1, wacc: 23.0, nopat: 5400, netIncome: 5900, revenue: 32000 },
            { quarter: "2024/Q4", roe: 30.5, roic: 17.5, wacc: 22.8, nopat: 1800, netIncome: 1900, revenue: 19500 },
            { quarter: "2025/Q1", roe: 29.2, roic: 16.8, wacc: 22.8, nopat: 1900, netIncome: 2000, revenue: 18500 },
            { quarter: "2025/Q2", roe: 31.0, roic: 18.0, wacc: 22.5, nopat: 2800, netIncome: 3100, revenue: 21000 },
            { quarter: "2025/Q3", roe: 38.5, roic: 22.4, wacc: 22.5, nopat: 6100, netIncome: 6800, revenue: 36000 },
            { quarter: "2025/Q4", roe: 33.1, roic: 19.1, wacc: 22.5, nopat: 2000, netIncome: 2200, revenue: 21000 },
            { quarter: "2026/Q1", roe: 34.2, roic: 19.8, wacc: 22.5, nopat: 2150, netIncome: 2400, revenue: 20000 }
        ],
        alerts: [{ id: 1, type: "warning", title: "Sezonluk Oynaklık & WACC Uyarısı", message: "ROIC (%19.8) WACC (%22.5) sermaye maliyetinin altında seyrediyor." }],
        kapDisclosures: [{ id: "KAP-PGSUS-801", date: "2026-07-15 18:00", category: "Trafik Sonuçları", title: "Haziran 2026 Yolcu Rakamları", summary: "Dış hat yolcusu %14 arttı.", sentiment: "positive", impactScore: 8, aiEvaluation: "EUR bazlı RASK güçlü." }],
        activityReportSummary: { capacityUtilization: 87, exportRatio: 78, fxPosition: "+1.4B EUR", capexPlans: "A321neo teslimatları.", swot: { strengths: ["LCC marj avantajı"], risks: ["Yakıt fiyatları"] } }
    },
    {
        order: 9,
        symbol: "ANSGR.IS",
        code: "ANSGR",
        name: "Anadolu Sigorta A.Ş.",
        sector: "Sigortacılık",
        price: 26.84,
        change: -1.11,
        marketCap: 26.8,
        metrics: {
            roe: 44.5, roic: 38.2, wacc: 24.5, nopat: 7200, investedCapital: 18848, netIncome: 7900, equity: 17750,
            totalDebt: 4100, cash: 3002, revenue: 42000, assets: 68000, netDebtToEbitda: 0.1, peRatio: 3.39, pbRatio: 1.51,
            dupont: { netMargin: 18.80, assetTurnover: 0.62, leverage: 3.83 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 36.0, roic: 30.5, wacc: 25.5, nopat: 1400, netIncome: 1450, revenue: 8500 },
            { quarter: "2024/Q3", roe: 38.2, roic: 32.5, wacc: 25.2, nopat: 1650, netIncome: 1720, revenue: 9400 },
            { quarter: "2024/Q4", roe: 39.5, roic: 33.8, wacc: 25.0, nopat: 1800, netIncome: 1890, revenue: 9900 },
            { quarter: "2025/Q1", roe: 38.8, roic: 33.0, wacc: 24.8, nopat: 1750, netIncome: 1800, revenue: 9200 },
            { quarter: "2025/Q2", roe: 39.5, roic: 33.8, wacc: 24.8, nopat: 1550, netIncome: 1650, revenue: 9500 },
            { quarter: "2025/Q3", roe: 42.1, roic: 36.0, wacc: 24.5, nopat: 1850, netIncome: 1980, revenue: 10800 },
            { quarter: "2025/Q4", roe: 43.8, roic: 37.5, wacc: 24.5, nopat: 1950, netIncome: 2100, revenue: 11200 },
            { quarter: "2026/Q1", roe: 44.5, roic: 38.2, wacc: 24.5, nopat: 2050, netIncome: 2170, revenue: 10500 }
        ],
        alerts: [{ id: 1, type: "success", title: "Teknik Karlılık Zirvede", message: "ROE %44.5 seviyesine ulaştı." }],
        kapDisclosures: [{ id: "KAP-ANSGR-901", date: "2026-07-19 12:45", category: "Prim Üretimi", title: "Brüt Prim Üretimi Artışı", summary: "%62 artışla 28.4B TL prim.", sentiment: "positive", impactScore: 8, aiEvaluation: "Enflasyon üzeri zam yeteneği." }],
        activityReportSummary: { capacityUtilization: 90, exportRatio: 0, fxPosition: "+250M TL Portföy", capexPlans: "Yapay zeka hasar yazılımı.", swot: { strengths: ["İş Bankası ağı"], risks: ["Afet riskleri"] } }
    },
    {
        order: 10,
        symbol: "LOGO.IS",
        code: "LOGO",
        name: "Logo Yazılım Sanayi ve Ticaret A.Ş.",
        sector: "Bilişim / Yazılım",
        price: 133.60,
        change: -0.67,
        marketCap: 13.4,
        metrics: {
            roe: 36.2, roic: 39.4, wacc: 21.5, nopat: 1420, investedCapital: 3604, netIncome: 1480, equity: 4088,
            totalDebt: 650, cash: 1134, revenue: 4800, assets: 5900, netDebtToEbitda: -0.6, peRatio: 9.05, pbRatio: 3.27,
            dupont: { netMargin: 30.83, assetTurnover: 0.81, leverage: 1.44 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 29.5, roic: 31.8, wacc: 23.0, nopat: 280, netIncome: 290, revenue: 950 },
            { quarter: "2024/Q3", roe: 31.0, roic: 33.2, wacc: 22.5, nopat: 330, netIncome: 340, revenue: 1080 },
            { quarter: "2024/Q4", roe: 32.8, roic: 35.0, wacc: 22.0, nopat: 370, netIncome: 390, revenue: 1200 },
            { quarter: "2025/Q1", roe: 31.8, roic: 34.2, wacc: 22.0, nopat: 340, netIncome: 350, revenue: 1020 },
            { quarter: "2025/Q2", roe: 32.5, roic: 35.1, wacc: 21.8, nopat: 310, netIncome: 320, revenue: 1050 },
            { quarter: "2025/Q3", roe: 34.1, roic: 37.0, wacc: 21.5, nopat: 360, netIncome: 380, revenue: 1200 },
            { quarter: "2025/Q4", roe: 35.5, roic: 38.6, wacc: 21.5, nopat: 400, netIncome: 420, revenue: 1350 },
            { quarter: "2026/Q1", roe: 36.2, roic: 39.4, wacc: 21.5, nopat: 350, netIncome: 360, revenue: 1200 }
        ],
        alerts: [{ id: 1, type: "success", title: "SaaS Bulut Dönüşümü", message: "ROIC %39.4 ile rekor seviyede." }],
        kapDisclosures: [{ id: "KAP-LOGO-1001", date: "2026-07-23 15:30", category: "Özel Durum Açıklaması", title: "Bulut Gelirleri Artışı", summary: "ARR %78 artış gösterdi.", sentiment: "positive", impactScore: 9, aiEvaluation: "Marj kalitesi artıyor." }],
        activityReportSummary: { capacityUtilization: 92, exportRatio: 34, fxPosition: "+18M EUR", capexPlans: "ERP yapay zeka entegrasyonu.", swot: { strengths: ["ERP pazar liderliği"], risks: ["Yazılımcı maliyetleri"] } }
    },
    {
        order: 11,
        symbol: "LKMNH.IS",
        code: "LKMNH",
        name: "Lokman Hekim Engürü Sağlık A.Ş.",
        sector: "Sağlık & Hastanecilik",
        price: 14.52,
        change: -0.75,
        marketCap: 3.2,
        metrics: {
            roe: 32.4, roic: 28.5, wacc: 23.0, nopat: 450, investedCapital: 1580, netIncome: 490, equity: 1512,
            totalDebt: 380, cash: 312, revenue: 2450, assets: 2200, netDebtToEbitda: 0.2, peRatio: 6.53, pbRatio: 2.11,
            dupont: { netMargin: 20.0, assetTurnover: 1.11, leverage: 1.45 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 25.0, roic: 21.0, wacc: 24.5, nopat: 80, netIncome: 85, revenue: 480 },
            { quarter: "2024/Q3", roe: 26.8, roic: 22.5, wacc: 24.0, nopat: 95, netIncome: 100, revenue: 540 },
            { quarter: "2024/Q4", roe: 28.5, roic: 24.0, wacc: 23.8, nopat: 110, netIncome: 115, revenue: 590 },
            { quarter: "2025/Q1", roe: 27.9, roic: 23.2, wacc: 23.5, nopat: 102, netIncome: 108, revenue: 530 },
            { quarter: "2025/Q2", roe: 29.1, roic: 24.8, wacc: 23.2, nopat: 112, netIncome: 118, revenue: 570 },
            { quarter: "2025/Q3", roe: 30.5, roic: 26.2, wacc: 23.0, nopat: 125, netIncome: 132, revenue: 620 },
            { quarter: "2025/Q4", roe: 31.8, roic: 27.4, wacc: 23.0, nopat: 135, netIncome: 142, revenue: 660 },
            { quarter: "2026/Q1", roe: 32.4, roic: 28.5, wacc: 23.0, nopat: 120, netIncome: 128, revenue: 610 }
        ],
        alerts: [{ id: 1, type: "success", title: "Sağlık Turizmi Büyümesi", message: "Yurtdışı hasta doluluk oranı yükseliyor." }],
        kapDisclosures: [{ id: "KAP-LKMNH-1101", date: "2026-07-22 14:15", category: "Yeni Tesis", title: "Ankara Hastane Ek Hizmet Binası", summary: "Yeni 60 yatak kapasiteli tanı merkezi açıldı.", sentiment: "positive", impactScore: 8, aiEvaluation: "Sağlık turizmi gelirlerini artıracak." }],
        activityReportSummary: { capacityUtilization: 86, exportRatio: 28, fxPosition: "+4.5M USD", capexPlans: "Tüp bebek ve onkoloji yatırımı.", swot: { strengths: ["Sağlık turizmi döviz girdisi"], risks: ["Tıbbi cihaz ithal maliyeti"] } }
    },
    {
        order: 12,
        symbol: "ALKA.IS",
        code: "ALKA",
        name: "Alkim Kağıt Sanayi ve Ticaret A.Ş.",
        sector: "Kağıt & Ambalaj",
        price: 9.09,
        change: -2.26,
        marketCap: 4.8,
        metrics: {
            roe: 27.5, roic: 31.2, wacc: 22.0, nopat: 680, investedCapital: 2179, netIncome: 710, equity: 2580,
            totalDebt: 450, cash: 851, revenue: 3800, assets: 3400, netDebtToEbitda: -0.5, peRatio: 6.76, pbRatio: 1.86,
            dupont: { netMargin: 18.68, assetTurnover: 1.11, leverage: 1.31 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 22.0, roic: 25.0, wacc: 23.5, nopat: 140, netIncome: 145, revenue: 780 },
            { quarter: "2024/Q3", roe: 23.5, roic: 26.5, wacc: 23.0, nopat: 165, netIncome: 170, revenue: 890 },
            { quarter: "2024/Q4", roe: 24.8, roic: 28.0, wacc: 22.8, nopat: 175, netIncome: 180, revenue: 920 },
            { quarter: "2025/Q1", roe: 23.8, roic: 27.0, wacc: 22.5, nopat: 160, netIncome: 165, revenue: 820 },
            { quarter: "2025/Q2", roe: 24.1, roic: 27.5, wacc: 22.2, nopat: 150, netIncome: 155, revenue: 850 },
            { quarter: "2025/Q3", roe: 25.8, roic: 29.1, wacc: 22.0, nopat: 175, netIncome: 185, revenue: 980 },
            { quarter: "2025/Q4", roe: 26.9, roic: 30.5, wacc: 22.0, nopat: 185, netIncome: 195, revenue: 1020 },
            { quarter: "2026/Q1", roe: 27.5, roic: 31.2, wacc: 22.0, nopat: 165, netIncome: 175, revenue: 950 }
        ],
        alerts: [{ id: 1, type: "info", title: "GES Katkısı", message: "GES ile düşen elektrik maliyetleri." }],
        kapDisclosures: [{ id: "KAP-ALKA-1201", date: "2026-07-10 11:00", category: "Yatırım", title: "GES Tesisi Devreye Alındı", summary: "8.5 MWp GES açıldı.", sentiment: "positive", impactScore: 8, aiEvaluation: "Enerji tasarrufu." }],
        activityReportSummary: { capacityUtilization: 94, exportRatio: 42, fxPosition: "+12M USD", capexPlans: "GES faz-2.", swot: { strengths: ["Düşük borç seviyesi"], risks: ["Selüloz fiyatları"] } }
    },
    {
        order: 13,
        symbol: "SODSN.IS",
        code: "SODSN",
        name: "Sodaş Sodyum Sanayii A.Ş.",
        sector: "Kimya / Madencilik",
        price: 8.45,
        change: 0.12,
        marketCap: 2.1,
        metrics: {
            roe: 33.1, roic: 38.0, wacc: 22.5, nopat: 310, investedCapital: 815, netIncome: 335, equity: 1012,
            totalDebt: 120, cash: 317, revenue: 1450, assets: 1350, netDebtToEbitda: -0.6, peRatio: 6.26, pbRatio: 2.07,
            dupont: { netMargin: 23.10, assetTurnover: 1.07, leverage: 1.33 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 27.0, roic: 31.0, wacc: 24.0, nopat: 65, netIncome: 68, revenue: 300 },
            { quarter: "2024/Q3", roe: 28.5, roic: 32.8, wacc: 23.5, nopat: 80, netIncome: 82, revenue: 340 },
            { quarter: "2024/Q4", roe: 30.0, roic: 34.0, wacc: 23.0, nopat: 88, netIncome: 90, revenue: 360 },
            { quarter: "2025/Q1", roe: 29.2, roic: 33.2, wacc: 23.0, nopat: 78, netIncome: 80, revenue: 320 },
            { quarter: "2025/Q2", roe: 30.1, roic: 34.2, wacc: 22.8, nopat: 70, netIncome: 75, revenue: 330 },
            { quarter: "2025/Q3", roe: 31.8, roic: 36.1, wacc: 22.5, nopat: 85, netIncome: 90, revenue: 380 },
            { quarter: "2025/Q4", roe: 32.5, roic: 37.2, wacc: 22.5, nopat: 88, netIncome: 92, revenue: 390 },
            { quarter: "2026/Q1", roe: 33.1, roic: 38.0, wacc: 22.5, nopat: 74, netIncome: 78, revenue: 350 }
        ],
        alerts: [{ id: 1, type: "info", title: "Borçsuz Verimlilik", message: "ROIC %38.0 ile yüksek verim." }],
        kapDisclosures: [{ id: "KAP-SODSN-1301", date: "2026-06-28 16:00", category: "Kapasite Artırımı", title: "Tuz Gölü Tesisi Deneme Üretimi", summary: "Kapasite 180 bin ton.", sentiment: "positive", impactScore: 7, aiEvaluation: "Satış hacmi artışı." }],
        activityReportSummary: { capacityUtilization: 91, exportRatio: 38, fxPosition: "+8.5M USD", capexPlans: "Güneş buharlaştırma havuzları.", swot: { strengths: ["Monopol kaynak"], risks: ["İşlem hacmi"] } }
    },
    {
        order: 14,
        symbol: "ALTNY.IS",
        code: "ALTNY",
        name: "Altınay Savunma Teknolojileri A.Ş.",
        sector: "Savunma Sanayi & İHA / Robotik",
        price: 16.67,
        change: -1.94,
        marketCap: 19.2,
        metrics: {
            roe: 41.2, roic: 35.4, wacc: 23.5, nopat: 2150, investedCapital: 6073, netIncome: 2380, equity: 5776,
            totalDebt: 1800, cash: 1503, revenue: 9200, assets: 9800, netDebtToEbitda: 0.1, peRatio: 8.06, pbRatio: 3.32,
            dupont: { netMargin: 25.86, assetTurnover: 0.93, leverage: 1.69 }
        },
        historical8Q: [
            { quarter: "2024/Q2", roe: 30.0, roic: 25.5, wacc: 25.0, nopat: 380, netIncome: 410, revenue: 1500 },
            { quarter: "2024/Q3", roe: 32.5, roic: 27.8, wacc: 24.5, nopat: 490, netIncome: 530, revenue: 1900 },
            { quarter: "2024/Q4", roe: 34.8, roic: 29.5, wacc: 24.2, nopat: 580, netIncome: 620, revenue: 2200 },
            { quarter: "2025/Q1", roe: 33.5, roic: 28.5, wacc: 24.0, nopat: 520, netIncome: 550, revenue: 1700 },
            { quarter: "2025/Q2", roe: 35.0, roic: 30.1, wacc: 23.8, nopat: 420, netIncome: 450, revenue: 1800 },
            { quarter: "2025/Q3", roe: 38.2, roic: 32.8, wacc: 23.5, nopat: 560, netIncome: 610, revenue: 2300 },
            { quarter: "2025/Q4", roe: 40.1, roic: 34.5, wacc: 23.5, nopat: 660, netIncome: 710, revenue: 2700 },
            { quarter: "2026/Q1", roe: 41.2, roic: 35.4, wacc: 23.5, nopat: 570, netIncome: 610, revenue: 2400 }
        ],
        alerts: [{ id: 1, type: "success", title: "Savunma Robotik Büyümesi", message: "ROIC %35.4 seviyesinde." }],
        kapDisclosures: [{ id: "KAP-ALTNY-1401", date: "2026-07-24 17:00", category: "Özel Durum Açıklaması", title: "SSB İnsansız Kara Araçları Anlaşması", summary: "38M USD sözleşme imzalandı.", sentiment: "positive", impactScore: 9, aiEvaluation: "Marj katlama beklentisi." }],
        activityReportSummary: { capacityUtilization: 88, exportRatio: 52, fxPosition: "+42M USD", capexPlans: "Dilovası test merkezi.", swot: { strengths: ["Alt sistem yerli üretici"], risks: ["İşletme sermayesi"] } }
    }
];

function calculateMagicFormula(stocks) {
    return [...stocks].sort((a, b) => {
        const scoreA = (a.metrics.roic * 0.6) + ((1 / a.metrics.peRatio) * 100 * 0.4);
        const scoreB = (b.metrics.roic * 0.6) + ((1 / b.metrics.peRatio) * 100 * 0.4);
        return scoreB - scoreA;
    });
}
