# SmartCity API
API pour le projet SmartCity Henallux IG3 <br/>
Projet disponible publiquement sur [GitHub](https://github.com/ThibBer/smartcity_api)

# Auteurs
- BERNARD Nicolas (etu42888@henallux.be)
- BERG Thibaut (etu43163@henallux.be)

# Installation
Ce projet requiert [NodeJS](https://nodejs.org/en/)

## .env file
Créer un fichier .env à la racine du projet qui contient :<br/>

```
PORT=
DATABASE_HOST=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_PORT=
SECRET_TOKEN=
```

## Commandes
```
vagrant up
npm install
npm run initDB
npm start
```

```
npm run genDoc
```

- vagrant up : Initialise la VM contenant la base de données PostgreSQL
- npm install : Installation des dépendances de l'API
  npm run initDB : Initialise la BDD suivant les infos fournies dans le .env
- npm start : Lance l'application
- npm run genDoc : Génère la documentation swagger

L'application se lance sur http://localhost:PORT
La variable PORT prends **2001** comme valeur par défaut si elle n'est pas précisée dans les variables d'environnement

### API
- **Événement**
  - GET
  - POST
  - PATCH
  - DELETE
- **Connexion**
  - POST
- **Participation**
  - GET
  - POST
  - DELETE
- **Signalement**
  - GET
  - POST
  - PATCH
  - DELETE
- **Type de signalement**
  - GET
  - POST
  - PATCH
  - DELETE
- **Utilisateur**
  - GET
  - POST
  - PATCH
  - DELETE
  
# Documentation Swagger
[Documentation JSON Swagger](./swagger/spec.json) <br/>
[Editeur Swagger](https://editor.swagger.io/) permettant de visualier la documentation
