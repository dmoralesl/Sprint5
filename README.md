# Sprint 5: TypeScript i APIs

Tasca basada en crear una web fent ús de TypeScript per esciure el codi i consumint una API que mostra acudits aleatoriament.

### Estructura

La estructura base d'aquest project s'ha inspirtat en parts d'aquesta [guia](https://www.digitalocean.com/community/tutorials/typescript-new-project) oferida per DigitalOcean.



### Instal·lació

Fent ús del gestor de paquets npm instal·larem les dependencies del projecte. Són porques i es basen en typescript i eslint, juntament amb les seves dependencies de tipat específiques per a typescript.

```bash
npm install
```

Un cop al comandament anterior acaba satisfactoriament, no caldrá transpil·lar el codi typescript o scss, ja que al respositori es proveeixen els fitxers .js i .css corresponents.

S'haurà d'obrir l'arxiu "index.html" situat a l'arrel del directori mitjançant un Live Server.

### Comandaments útils

Per compilar els fitxers scss a css en aquest projecte: 

```bash
sass src/assets/styles/main.scss src/assets/styles/main.css
```

Per transpil·lar els fitxers .ts a Javascript:

```bash
npm run tsc
```
