# Rusinfo Alkohol Selvhjelpsapp

## Om prosjektet
En anonym digital selvhjelpsapp for unge alkoholbrukere, utviklet i samarbeid med 
RUSinfo (Velferdsetaten, Oslo kommune). Appen hjelper brukere å bli mer bevisste 
på eget alkoholforbruk gjennom logging, dagbok og gamification.

## Tech Stack
- **React Native / Expo** – cross-platform (iOS og Android)
- **Firebase Authentication** – anonym innlogging (ingen persondata)
- **Firebase Firestore** – lagring av anonyme AUDIT-svar til RUSinfo
- **AsyncStorage** – lokal lagring på brukerens enhet
- **Expo Router** – navigasjon

## Mappestruktur
```
app/
├── onboarding/
│   ├── index.tsx        ← velkomstskjerm (auto-videre etter 2.5s)
│   ├── info.tsx         ← alder, kjønn, fylke (sendes til Firebase)
│   ├── maal.tsx         ← brukerens mål (lagres lokalt)
│   └── inspirasjon.tsx  ← brukerens inspirasjon (lagres lokalt)
├── index.tsx            ← dashboard/hjem
├── drikklogg.tsx        ← logg alkoholinntak (lokalt)
├── dagbok.tsx           ← private notater (lokalt)
├── prestasjoner.tsx     ← badges og streaks (lokalt)
├── info.tsx             ← informasjon om alkohol
└── _layout.tsx          ← tab-navigasjon
```

## Datalagring
| Data | Hvor | Hvorfor |
|---|---|---|
| Drikklogg | AsyncStorage (lokalt) | Sensitiv, aldri forlater telefonen |
| Dagbok | AsyncStorage (lokalt) | Privat |
| Prestasjoner/streaks | AsyncStorage (lokalt) | Personlig |
| Mål og inspirasjon | AsyncStorage (lokalt) | Personlig |
| Alder/kjønn/fylke | Firebase Firestore | Statistikk for RUSinfo |
| AUDIT-svar | Firebase Firestore | RUSinfo trenger denne dataen |
| Bruker-ID | Firebase Auth | Anonym, ingen persondata |

## Onboarding-flyt
1. Velkomstskjerm (auto-videre etter 2.5 sek)
2. Fyll inn info (alder, kjønn, fylke)
3. Velg mål (slutte / drikke mindre / få oversikt)
4. Velg inspirasjon (forhåndsdefinerte valg + "Annet")
5. → Dashboard

Når onboarding er fullført lagres `onboardingFullfort: true` i AsyncStorage.
Neste gang appen åpnes hoppes onboarding over.

## Kjøre prosjektet
```bash
npm install
npx expo start
```
Scan QR-koden med Expo Go på telefonen.

## Branching
- `main` – stabil, ferdig kode
- `dev` – aktiv utvikling (alle pusher hit)

## Gruppemedlemmer
- Rohit Kumar 
- Tuva Solhaug
- Morten Simensen

## Oppdragsgiver
RUSinfo / Velferdsetaten, Oslo kommune  
Kontakt: sturla.johansen@vel.oslo.kommune.no