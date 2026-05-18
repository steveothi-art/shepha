# SHEFA — Créativité en Abondance
> Site vitrine de l'agence créative & digitale SHEFA, basée à Abidjan, Côte d'Ivoire.

---

## Structure des fichiers

```
shefa/
├── index.html        → Page principale (structure HTML)
├── Style_shefa.css   → Tous les styles du site
├── Main-shefa.js     → Interactions JS (preloader, cursor, animations...)
├── shefa.php         → Traitement du formulaire de contact → WhatsApp
└── README.md         → Ce fichier
```

---

## Fonctionnement du formulaire de contact

Le formulaire (`#contactForm`) envoie les données en **POST** vers `shefa.php`.

### Champs attendus
| Champ | Type | Obligatoire |
|---|---|---|
| `nom` | text | ✅ |
| `prenom` | text | ✅ |
| `tel` | tel | ✅ |
| `email` | email | ✅ |
| `description` | textarea | ✅ |

### Ce que fait `shefa.php`
1. Vérifie que la méthode est bien POST
2. Nettoie et valide les données
3. En cas d'erreur → redirige vers `index.html?errors=...#contact`
4. Si tout est valide → construit le message WhatsApp et redirige vers `wa.me/2250759582002`

### Numéro WhatsApp
Défini en haut de `shefa.php` :
```php
define('SHEFA_WHATSAPP', '2250759582002');
```
Modifier cette ligne pour changer le numéro.

---

## Prérequis pour faire fonctionner le PHP

> ⚠️ Le fichier `shefa.php` ne fonctionne **pas** si vous ouvrez `index.html` directement dans le navigateur (`file://`). Il faut obligatoirement un serveur PHP.

### En local (développement)
1. Installer [XAMPP](https://www.apachefriends.org/) ou [Laragon](https://laragon.org/)
2. Placer les fichiers dans le dossier `htdocs/shefa/`
3. Ouvrir `http://localhost/shefa/index.html`

### En ligne (production)
1. Uploader **tous les fichiers** à la racine de votre hébergement (ou dans un sous-dossier)
2. Vérifier que PHP est bien activé chez votre hébergeur
3. Tester en accédant directement à `https://votresite.com/shefa.php` — vous devez voir une redirection vers `index.html`

---

## Gestion des erreurs PHP côté JS

Ajoutez ce bloc dans `Main-shefa.js` pour afficher les erreurs PHP via le toast existant :

```js
// Erreurs retournées par shefa.php
const params = new URLSearchParams(window.location.search);
const phpErrors = params.get('errors');
if (phpErrors) {
  showToast(decodeURIComponent(phpErrors), 'error');
  window.history.replaceState({}, '', window.location.pathname + '#contact');
}
```

---

## Technologies utilisées

| Technologie | Usage |
|---|---|
| HTML5 | Structure de la page |
| CSS3 | Styles, animations, responsive |
| JavaScript (Vanilla) | Interactions, preloader, cursor, animations au scroll |
| PHP 7.4+ | Traitement du formulaire |
| Google Fonts | Playfair Display + Outfit |
| WhatsApp API (`wa.me`) | Redirection avec message pré-rempli |

---

## Personnalisation rapide

| Ce que vous voulez changer | Où |
|---|---|
| Numéro WhatsApp | `shefa.php` → ligne `define('SHEFA_WHATSAPP', ...)` |
| Couleurs | `Style_shefa.css` → variables `:root` (`--gold`, `--teal`...) |
| Statistiques hero (120+, 98%...) | `index.html` → attributs `data-target` des `.hs-num` |
| Textes et contenus | `index.html` directement |
| Animations JS | `Main-shefa.js` |

---

## Déploiement — checklist

- [ ] Tous les fichiers uploadés sur le serveur
- [ ] PHP activé sur l'hébergement
- [ ] `shefa.php` accessible via navigateur (test direct)
- [ ] Formulaire testé avec un vrai envoi
- [ ] WhatsApp s'ouvre avec le message pré-rempli
- [ ] Site testé sur mobile et desktop

---

## Contact & support

**Agence SHEFA**
- WhatsApp : [+225 07 59 58 20 02](https://wa.me/2250759582002)
- Localisation : Abidjan, Côte d'Ivoire 🇨🇮
- Disponibilité : Lun–Sam · 8h–20h

---

*© 2025 SHEFA — Créativité en Abondance*
