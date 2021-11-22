# SmartCity API
API for SmartCity project at Henallux IG3

## Authors
- BERNARD Nicolas (etu42888@henallux.be)
- BERG Thibaut (etu43163@henallux.be)

## .env file
Add a .env file for database connection 

```
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
    - PATCH ❌
    - DELETE ❌
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
    - DELETE ❌
- **Participation**
  - GET ✅
  - POST ✅
  - DELETE ✅
    - Delete a specific link ✅
    - Delete Links For an User ✅
    - Delete Links For an Event ✅

## Questions
- Gestion des clefs étrangères dans les vues en back office ?
- Charger seulement de X à X données (pour pas tout charger d'un coup)
- Comment gérer les delete ? (clef étrangères)

## Remarques
- Changer name par id -> ReportType
