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
- Différence entre http code 404 et 204 ?

## Remarques
- Changer name par id -> ReportType

## Générer les $ pour les requetes SQL
```javascript
const limit = 11;

let data = "$1";
for(let i = 2; i <= limit; i++){
    data += (", $" + i);
}
```