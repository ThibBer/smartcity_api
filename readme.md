# SmartCity API
API for SmartCity project at Henallux IG3

## Authors
- BERNARD Nicolas (etu42888@henallux.be)
- BERG Thibaut (etu43163@henallux.be)

## .env file
Add a .env file for database connection at the root of the project

```
PORT=

DATABASE_HOST=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_PORT=
SECRET_TOKEN=
```

## Passwords
- For thibaut.berg@hotmail.com the password is test
- For nicolas.bernard@gmail.com the password is test2

❌ ✅
### API
- **User**
    - GET ✅
    - ALL ✅
    - POST ✅
    - PATCH ✅
    - DELETE ✅
- **Event**
    - GET ✅
    - ALL ✅
    - POST ✅
    - PATCH ✅
    - DELETE ✅
- **Report**
    - GET ✅
    - ALL ✅
    - POST ✅
    - PATCH ✅
    - DELETE ✅
- **ReportType**
    - GET ✅
    - ALL ✅
    - POST ✅
    - PATCH ✅
    - DELETE ✅
- **Participation**
  - GET ✅
  - POST ✅
  - DELETE ✅
    - Delete a specific link ✅
    - Delete Links For an User ✅
    - Delete Links For an Event ✅

## Tests postman
Tester ce qui est return dans le body
On peut faire + de 10 tests mais si une fausse = - de points
Ne pas tester une route avec un fichier



Changer || par ?? -> ok
Attention doc offset majuscule et minuscule (site officiel) -> ok (reste erreurs d'avoir un body pour les delete)
POST code 201 au lieu de 200 -> ok
Utiliser drop cascade pour supprimer
Ne pas faire de select * car si 1 000 000 lignes = petits problème
Utilisation du on delete set null
Vérifier les select * dans le models
Ne pas copier la doc pour le jwt utils

## Améliorations:
