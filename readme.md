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
```
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
    - POST ❌
    - PATCH ❌
    - DELETE ❌
- **Report**
    - GET ✅
    - ALL ✅
    - POST ❌
    - PATCH ❌
    - DELETE ❌
- **ReportType**
    - GET ✅
    - ALL ✅
    - POST ✅
    - PATCH ✅
    - DELETE ❌
- **Participation**
  - GET ❌
  - POST ❌
  - DELETE ❌

## Questions
- Mettre const client = pool.connect dans un try catch ? (Si jamais bdd n'est pas dispo)
- On doit retourner toutes les infos ? Ou juste ce qu'on a besoin ?
Ex : Si on get /user:id, on doit retourner tous les événements auquels il participe ? 
- Mettre une table pour les roles et une table pour les etats d'un report (En cours, terminé, à traiter)
- 
## Remarques
- Changer name par id -> ReportType
