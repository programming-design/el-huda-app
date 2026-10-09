# الهُدى — تطبيق أندرويد

مشروع Capacitor جاهز يحوّل موقع elhuda.online إلى تطبيق APK مع واجهة تطبيق أصلية الشكل:
شريط تنقل سفلي، شاشة بداية (Splash)، انتقالات سلسة، قائمة "المزيد"، تنبيه انقطاع الإنترنت، وإخفاء هيدر/فوتر الموقع.

## الطريقة 1 — على جهازك (Node 18+ و Android Studio أو JDK 17 + Android SDK)
```bash
npm install
npm run vendor          # مرة واحدة: يحمّل الخطوط والمكتبات لتعمل بدون إنترنت
npx cap add android
npm run assets          # يولّد أيقونات وشاشة البداية من مجلد resources
npx cap sync android
npm run apk             # الناتج: android/app/build/outputs/apk/debug/app-debug.apk
```

## الطريقة 2 — بدون تثبيت شيء (GitHub Actions)
ارفع المجلد إلى مستودع GitHub، ثم من تبويب Actions شغّل **Build APK**، وحمّل الملف من Artifacts.

## معاينة الواجهة في المتصفح
افتح `www/index.html` عبر أي سيرفر محلي وأضف `?app=1` للرابط.

## نسخة النشر على Google Play
```bash
keytool -genkey -v -keystore elhuda.keystore -alias elhuda -keyalg RSA -keysize 2048 -validity 10000
npm run aab             # ثم وقّع الملف وارفعه
```
