"""
BIST KAP & Financial Alert Telegram Bot Notifier
-----------------------------------------------
Bu servis kritik KAP bildirimlerini veya ROIC / Borç riski alarm eşiklerini 
kullanıcının telefonuna anlık Telegram mesajı olarak gönderir.
"""

import os
import sys
import requests
import argparse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def send_telegram_alert(token, chat_id, title, symbol, body):
    if not token or not chat_id or token == "YOUR_TELEGRAM_BOT_TOKEN_HERE":
        print("[TELEGRAM UYARI] Token/ChatID girilmemiş. Simülasyon modunda konsola yazdırılıyor:")
        print("==================================================")
        print(f"📱 TELEGRAM MESAJI [{symbol}]:")
        print(f"🚨 {title}")
        print(f"📝 {body}")
        print("==================================================")
        return True

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    text = f"🚨 *BIST İKAZ BİLDİRİMİ* [{symbol}]\n\n*Başlık:* {title}\n\n*Açıklama:* {body}"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown"
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print("[OK] Telegram mesajı başarıyla gönderildi!")
            return True
        else:
            print(f"[HATA] Telegram Hatası ({response.status_code}): {response.text}")
            return False
    except Exception as e:
        print(f"[HATA] Bağlantı Hatası: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="BIST Telegram İkaz Botu")
    parser.add_argument("--test", action="store_true", help="Test bildirimi gönder")
    args = parser.parse_args()

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "YOUR_TELEGRAM_BOT_TOKEN_HERE")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "YOUR_TELEGRAM_CHAT_ID_HERE")

    print("[TELEGRAM SERVİSİ] Telegram İkaz Bot Servisi Test Ediliyor...")
    send_telegram_alert(
        token=token,
        chat_id=chat_id,
        symbol="EGEEN",
        title="Yüksek ROIC & İhracat Anlaşması İkazı",
        body="EGEEN 45 Milyon EUR tutarında yeni aks dingili ihracat sözleşmesi imzaladı. Yıllık NOPAT katkısı +%12 beklenmektedir."
    )

if __name__ == "__main__":
    main()
