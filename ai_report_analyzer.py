"""
BIST Activity Report & KAP AI Analyzer (Gemini API Integration)
---------------------------------------------------------------
Bu servis Google Gemini API kullanarak 100+ sayfalık Faaliyet Raporlarını 
ve KAP duyurularını analiz eder, CapEx, Kapasite ve Risk değerlendirmesi üretir.
"""

import os
import sys
import json
import argparse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def analyze_report_with_gemini(symbol, text_content):
    api_key = os.environ.get("GEMINI_API_KEY", "")
    
    if not api_key:
        print("[AI UYARI] GEMINI_API_KEY bulunamadı. Simülasyon modunda çalışılıyor.")
        return {
            "symbol": symbol,
            "sentiment": "POZİTİF SİNYAL",
            "impact_score": 9,
            "capacity_utilization": "%88",
            "export_ratio": "%84",
            "fx_exposure": "+1.2 Milyar TL (Net Artıda)",
            "capex_plans": "15 Milyon EUR Otomasyon ve Tesis Genişletme",
            "ai_evaluation": "Kapasite kullanımı yüksek seviyede korunmuş, marjlar döviz pozisyonu sayesinde destekleniyor."
        }

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
        Sen uzman bir BIST finansal analistisin. {symbol} şirketinin aşağıdaki faaliyet raporu / KAP duyurusu metnini incele:
        
        Metin: {text_content}
        
        Aşağıdaki soruları Türkçe olarak kısa ve net yanıtla:
        1. Kapasite Kullanım Oranı (KKO) % kaçtır?
        2. İhracat Oranı % kaçtır?
        3. Döviz Pozisyon Riski var mıdır?
        4. Yatırım Planları (CapEx) nelerdir?
        5. Bu bildirim şirket NOPAT ve ROIC marjını nasıl etkiler (Pozitif/Riskli)?
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return {"symbol": symbol, "analysis": response.text}
    except Exception as e:
        print(f"[AI HATA] Gemini API Hatası: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Faaliyet Raporu AI Analizci")
    parser.add_argument("--symbol", default="FROTO", help="BIST Hisse Kodu (Örn: FROTO)")
    args = parser.parse_args()

    sample_text = """
    2026 1. Çeyrek Faaliyet Raporu: Fabrikalarımızda kapasite kullanım oranı %89 seviyesinde gerçekleşmiştir.
    Avrupa ihracat payı %79'a ulaşmış olup, elektrikli ticari araç bant çıkış sayısı hedeflerin %8 üzerindedir.
    Batarya montaj tesisi yatırımlarında 45M EUR harcama yapılmıştır.
    """

    print(f"[AI SERVİSİ] [{args.symbol}] Faaliyet Raporu Yapay Zeka Taraması Başlatılıyor...")
    res = analyze_report_with_gemini(args.symbol, sample_text)
    print("\n[OK] DEĞERLENDİRME SONUCU:")
    print(json.dumps(res, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
