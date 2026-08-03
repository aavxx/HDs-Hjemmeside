# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Spamfilter på kontaktformularen

`api/_spam.ts` filtrerer bot-henvendelser fra, før der sendes mails. Der er tre lag:

1. **Honningkrukke** – et skjult felt i formularen (`hjemmeside`). Kun bots udfylder det.
2. **Tidsmåling** – formularen sender, hvor lang tid der gik fra siden blev vist.
   Under 2,5 sekunder er ikke et menneske.
3. **Indholdspoint** – tilfældige bogstavstrenge, links, HTML, kendte spam-ord og
   gmail-adresser med mange punktummer giver point. Fra 4 point regnes henvendelsen
   som spam (`SPAM_THRESHOLD`).

Derudover må samme IP højst sende 5 henvendelser i timen.

Blokerede henvendelser får svaret "ok", så botten ikke kan prøve sig frem, men de
sender ingen mails. De gemmes i stedet i portalens **papirkurv** med `[Spam]` i
emnefeltet, så en fejlvurderet henvendelse kan findes frem igen.

Bliver filteret for hårdt eller for blødt, justeres `SPAM_THRESHOLD` i
`api/_spam.ts`. Testene i `api/_spam.test.ts` dækker både rigtige henvendelser og
den spam, siden får i dag – kør dem med `npm test`.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
