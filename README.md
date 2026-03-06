# CV Benjamin DUFFAU

Site statique en HTML / CSS / JavaScript, sans framework.

## Structure

- `index.html` : point d'entrée du site
- `styles.css` : styles globaux et styles print/PDF
- `script.js` : interactions, filtres, thème, export impression
- `cv_extracted.txt` : texte source conservé

## Déploiement Cloudflare Pages

Utiliser ce dossier comme racine du dépôt GitHub public.

Configuration Cloudflare Pages :

- Framework preset : `None`
- Build command : laisser vide
- Build output directory : `/`

## Déploiement

1. Créer un dépôt GitHub public avec le contenu de ce dossier.
2. Connecter le dépôt à Cloudflare Pages.
3. Déployer avec les paramètres ci-dessus.

## Développement local

Aucun build n'est nécessaire.

Ouvrir simplement `index.html` dans un navigateur.

## Notes

- Le site est 100% statique.
- Les chemins CSS et JS sont relatifs au fichier `index.html`.
- Le bouton PDF utilise la fenêtre d'impression du navigateur.
