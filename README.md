# Tableau de bord de supervision homelab

🇫🇷 [Français](#français) · 🇬🇧 [English](#english)

**Essayer l'outil :** https://valentin-auger-laboratoire.github.io/portfolio/outils/homelab/

---

## Français

### Ce que fait l'outil
Page de supervision d'un réseau domestique, en HTML / CSS / JavaScript pur (graphiques en SVG, aucune bibliothèque).

- **État de chaque service** : en ligne, dégradé, hors ligne, avec icône et libellé (pas seulement une couleur).
- **Courbe de latence** des 60 dernières sondes, seuil d'alerte en pointillés, échecs marqués, valeur au survol.
- **Disponibilité** par service et globale, latence moyenne, nombre d'alertes en cours.
- **Ressources** (démo) : disque et température du NAS, CPU et mémoire du serveur domotique, avec seuils « à surveiller » et « critique ».
- **Journal des incidents** : chaque changement d'état, avec l'heure.

**Règles d'état** (dans `homelab.js`, fonction `nextStatus`) :
| État | Condition |
|---|---|
| En ligne | joignable, latence sous le seuil |
| Dégradé | latence au-dessus du seuil, ou échec isolé |
| Hors ligne | 3 échecs consécutifs |

### Deux modes
**Démo** : homelab **fictif et simulé** (routeur, switch, NAS, serveur domotique, DNS local, imprimante 3D, accès Internet). Ce n'est pas un réseau réel. On peut provoquer une panne, un ralentissement ou un disque qui se remplit pour voir les alertes se déclencher.

**Mode réel** : on colle une configuration JSON et la page sonde ces services depuis le navigateur.
```json
{
  "interval": 15,
  "services": [
    { "name": "NAS", "url": "http://192.168.1.10:5000", "kind": "Stockage" },
    { "name": "Home Assistant", "url": "http://192.168.1.20:8123", "warnMs": 200 }
  ]
}
```
Chaque sonde est une requête HTTP en mode `no-cors` : une réponse, quelle qu'elle soit, compte comme « joignable », et son temps de réponse sert de latence. La configuration est gardée dans le navigateur (`localStorage`) ; rien n'est envoyé ailleurs.

### Limites
- Depuis la page en ligne (HTTPS), le navigateur **bloque les adresses `http://` du réseau local** (contenu mixte). Pour superviser son réseau : ouvrir `index.html` en local (fichier ou `python -m http.server`), ou utiliser des services en HTTPS.
- La sonde vérifie qu'un service web répond, pas qu'il fonctionne correctement ; pas de ping ICMP (impossible depuis un navigateur).
- Les ressources (disque, CPU…) ne sont disponibles qu'en démo : en réel, il faudrait un agent sur chaque machine.

### Fichiers
| Fichier | Rôle |
|---|---|
| `homelab.js` | Moteur : sondes (simulée et HTTP), règles d'état, journal, lecture de la configuration |
| `index.html` | Interface, bilingue FR / EN |
| `tests/test.js` | Tests du moteur |

```bash
node tests/test.js
```

---

## English

### What the tool does
Monitoring page for a home network, in plain HTML / CSS / JavaScript (SVG charts, no library).

- **Status of each service**: up, degraded, down, with icon and label (not colour alone).
- **Latency chart** of the last 60 probes, dashed alert threshold, failures marked, value on hover.
- Per-service and overall **availability**, average latency, number of active alerts.
- **Resources** (demo): NAS disk and temperature, home automation server CPU and memory, with "watch" and "critical" thresholds.
- **Incident log**: every status change, with its time.

**Status rules** (in `homelab.js`, `nextStatus` function):
| Status | Condition |
|---|---|
| Up | reachable, latency below threshold |
| Degraded | latency above threshold, or a single failure |
| Down | 3 consecutive failures |

### Two modes
**Demo**: a **fictional, simulated** homelab (router, switch, NAS, home automation server, local DNS, 3D printer, Internet access). It is not a real network. You can trigger an outage, a slowdown or a filling disk to watch the alerts fire.

**Live mode**: paste a JSON configuration (see above) and the page probes those services from the browser. Each probe is a `no-cors` HTTP request: any response counts as "reachable", and its response time is used as latency. The configuration is kept in the browser (`localStorage`); nothing is sent anywhere else.

### Limitations
- From the online page (HTTPS), the browser **blocks local `http://` addresses** (mixed content). To monitor your own network, open `index.html` locally (file or `python -m http.server`), or use HTTPS services.
- The probe checks that a web service answers, not that it works correctly; no ICMP ping (impossible from a browser).
- Resources (disk, CPU…) are only available in the demo: live mode would need an agent on each machine.

### Files
| File | Purpose |
|---|---|
| `homelab.js` | Engine: probes (simulated and HTTP), status rules, log, configuration parsing |
| `index.html` | User interface, bilingual FR / EN |
| `tests/test.js` | Engine tests |

```bash
node tests/test.js
```
