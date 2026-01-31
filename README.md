# Application de gestion de dépenses personnelles

> MEMBRES DU GROUPE :
>
> - **RADIFERA RASAMOELIJAONA Monica**

## 1. Présentation du Projet

Ce projet est une application web permettant de suivre et gérer ses dépenses personnelles de manière simple.  
Il permet d’enregistrer des dépenses, de les consulter et de les conserver dans le temps grâce à une base de données persistante.

### Fonctionnalités principales

• Ajout de dépenses personnelles  
• Consultation des dépenses enregistrées  
• Stockage persistant des données  
• Interface web accessible à distance  
• Exposition sécurisée via Cloudflare Tunnel

### Lien d’accès

Lien généré dynamiquement lors du lancement du tunnel Cloudflare  
Exemple  
https://xxxxxx.trycloudflare.com

---

## 2. Architecture Technique

### Description globale

L’architecture repose sur une stack Docker Compose composée de plusieurs services communiquant via un réseau bridge interne.

Le frontend fournit l’interface utilisateur.  
Le backend gère la logique applicative et l’accès aux données.  
PostgreSQL assure le stockage persistant des dépenses.  
Caddy agit comme reverse proxy.  
Cloudflared expose l’application publiquement via Cloudflare Tunnel.  
Adminer permet l’administration de la base de données.

### Schéma d’infrastructure

Le schéma ci dessous est généré automatiquement à partir du fichier architecture.puml présent à la racine du dépôt.

![Architecture du Projet](https://kroki.io/plantuml/svg?src=https://raw.githubusercontent.com/MonicaRad/projetDocker/main/architecture.puml)


### Description des services

| Service         | Image Docker       | Rôle                      | Port interne    |
| --------------- | ------------------ | ------------------------- | --------------- |
| Frontend        | Image custom       | Interface utilisateur     | 80              |
| Backend         | Image custom       | Logique métier et API     | Port applicatif |
| Base de données | postgres:16-alpine | Stockage des données      | 5432            |
| Reverse proxy   | caddy:2            | Routage HTTP              | 80              |
| Tunnel          | cloudflared        | Exposition Internet       | N/A             |
| Admin DB        | adminer            | Administration PostgreSQL | 8080            |

## 3. Guide d’installation

### Prérequis

Docker
Docker Compose

### Installation et lancement

1. Cloner le dépôt

```bash
git clone https://github.com/votre-user/votre-repo.git
cd votre-repo
```

2. Lancer la stack

```bash
docker compose up -d
```

3. Vérifier l’état des services

```bash
docker compose ps
```

4. Récupérer l’URL publique

```bash
docker compose logs -f cloudflared
```

---

## 4. Méthodologie et Transparence IA

### Organisation

Le projet a été réalisé individuellement.
Le travail a été structuré en plusieurs phases : conception de l’architecture, mise en place de Docker Compose, développement de l’application, puis déploiement et débogage.

### Utilisation de l’intelligence artificielle

Outil utilisé
ChatGPT

Usages
• Aide à la compréhension des erreurs Docker et Cloudflared
• Assistance à la configuration Docker Compose
• Aide à la rédaction de la documentation

## 5. Difficultés rencontrées et solutions

Problème
Le backend démarrait avant que la base de données ne soit prête.

Solution
Ajout d’un healthcheck PostgreSQL et utilisation de depends_on avec condition service_healthy.

Problème
Instabilité du tunnel Cloudflare avec le protocole QUIC.

Solution
Forçage du protocole HTTP2 dans la configuration de cloudflared.
