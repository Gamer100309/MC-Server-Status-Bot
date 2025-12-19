\# 🌐 Neue Sprache hinzufügen - Quick Guide



\## ⚡ In 5 Schritten:



\### 1. Kopieren

```bash

cp texts/en.json texts/es.json

```



\### 2. `\_meta` anpassen

```json

{

&nbsp; "\_meta": {

&nbsp;   "language": "es",

&nbsp;   "languageName": "Español",

&nbsp;   "flag": "🇪🇸"

&nbsp; }

}

```



\### 3. Texte übersetzen

\- ✅ Nur die \*\*Werte\*\* übersetzen

\- ❌ \*\*Variablen `{serverName}`\*\* NICHT ändern

\- ❌ \*\*Keys\*\* NICHT ändern

\- ❌ \*\*Struktur\*\* NICHT ändern



\### 4. Validieren

```bash

node Debug/check-languages.js

```



\### 5. Bot neustarten

```bash

node index.js

```



---



\## ⚠️ DIE WICHTIGSTEN REGELN:



\### ✅ RICHTIG:

```json

"title": "{emoji} {serverName} ist Online"

"title": "{emoji} {serverName} está en línea"

```



\### ❌ FALSCH:

```json

"title": "{emoticon} {nombreServidor} En línea"

```



\*\*→ Variablen in `{}` NIEMALS übersetzen!\*\*



---



\## 🎯 Fertig!



Sprache erscheint automatisch in `/setup → Texts \& Language` ✨

