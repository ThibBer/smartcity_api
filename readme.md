# SmartCity API
API for SmartCity project at Henallux IG3

## Authors
- BERNARD Nicolas (etu42888@henallux.be)
- BERG Thibaut (etu43163@henallux.be)

## .env file
Add a .env file for database connection at the root of the project

```
API_PORT=

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

## Questions
Comment ça se passe quand le middleware à besoin d'une info dans le body/url et qu'il ne la trouvé pas ? Il doit aussi renvoyer 400 ? Ou juste 403 ?
Comment faire quand un middleware doit faire des vérifications qui nécéssitent des requêtes SQL
Séparer les Authorization dans des fichiers != en fonction du type (user, report, etc ...) ?


## Remarques
