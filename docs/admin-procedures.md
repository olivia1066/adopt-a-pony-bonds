# Procédures admin — Pony Bonds

> La page admin a été supprimée le 26 mai 2026 car l'utilisation était trop occasionnelle
> (1 action / mois). Toutes les actions admin se font désormais directement dans Supabase.

## 🔓 Ouvrir une nouvelle campagne

1. Aller sur Supabase → Table Editor → table `campaigns`
2. Cliquer "+ Insert row"
3. Remplir :
   - `name` : nom interne (ex: `pony_bonds_2026_q3`)
   - `name_fr` / `name_en` : nom affiché aux investisseurs
   - `description_fr` / `description_en` : teaser de la campagne
   - `status` : `coming_soon` si pas encore ouverte / `ongoing` si on ouvre tout de suite
   - `target_amount` : montant cible (ex: 500000 pour 500K€)
   - `raised_amount` : 0 (par défaut)
   - `rate` : taux annuel (ex: 8.5)
   - `duration` : durée en mois (ex: 48)
4. Save
5. ⚠️ **Une seule campagne doit avoir status = `ongoing` à un instant T** (le site
   affiche la campagne active via `getActiveCampaign()` qui prend la première avec
   ce status)

## 🔒 Fermer une campagne (sold out)

1. Aller dans Table Editor → `campaigns`
2. Trouver la row de la campagne en cours
3. Modifier `status` : `ongoing` → `sold_out`
4. Mettre `raised_amount` = `target_amount` (pour afficher 100%)
5. Save

→ La page `/campagne` affichera automatiquement la barre à 100% et le CTA principal
deviendra "Rejoindre la waitlist" pour la prochaine.

## ⏸️ Mettre une campagne en pause / brouillon

1. Modifier `status` : `coming_soon`
2. Save

→ Le site affichera "Bientôt disponible" et tous les CTA seront orientés vers la
waitlist.

## 💰 Suivre les paiements

1. Table Editor → table `payments`
2. Filtrer par `investment_id` ou `investor_id`
3. Pour marquer un paiement comme reçu : modifier `status` → `paid` et `paid_at` → date

## 📊 KPIs rapides via SQL

Pour calculer le total levé en cours :

```sql
SELECT
  c.name,
  c.target_amount,
  COALESCE(SUM(i.amount), 0) AS raised_amount,
  COUNT(DISTINCT i.investor_id) AS nb_investors
FROM campaigns c
LEFT JOIN investments i ON i.campaign_id = c.id
WHERE c.status = 'ongoing'
GROUP BY c.id, c.name, c.target_amount;
```

À lancer dans Supabase → SQL Editor.

## 🚨 Synchronisation avec Pipedrive

Le webhook Supabase + workflow Pipedream sync auto les nouveaux inscrits waitlist
vers Pipedrive (table `waitlist_signups` → Person + Deal en stage "To process").

URL du webhook Pipedream : `https://eodgviex0qaqgy9.m.pipedream.net`

Pour modifier le workflow → [pipedream.com](https://pipedream.com)