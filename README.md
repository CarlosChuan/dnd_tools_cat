# Generador de Blocs d'Estadístiques D&D 5e

Una eina per crear blocs d'estadístiques de monstres de D&D 5e. Omple el formulari de l'esquerra, veu el bloc actualitzar-se en temps real a la dreta, i exporta'l com a PNG o imprimeix-lo.

---

## Com obrir-lo

**Opció ràpida — des de Claude Code**
Escriu `/start` al chat de Claude Code i ell arrencarà el servidor automàticament. Després obre el navegador a `http://localhost:8000`.

## Com modificar-lo amb Claude

Obre aquest projecte a [Claude Code](https://claude.ai/code). Pots descriure els canvis en llenguatge normal — no cal saber programar.

### Exemples d'instruccions que pots donar a Claude

**Canviar textos / etiquetes**
> "Canvia l'etiqueta del botó 'Guardar' per 'Desa el monstre'"

> "Reanomena la secció 'Armes de Foc' a 'Armes de Foc i Explosius'"

**Afegir o canviar camps del formulari**
> "Afegeix un camp de text per a 'Accions de Cau' just sota la secció d'Accions Llegendàries"

> "Afegeix un desplegable per a l'alineament del monstre amb les opcions: Legal Bo, Neutral, Caòtic Malvat"

**Canviar l'aparença del bloc d'estadístiques**
> "Fes que el nom del monstre es mostri en vermell fosc en lloc de negre"

> "Fes el bloc d'estadístiques més ample perquè hi càpiga més text per línia"

**Afegir mecàniques**
> "Afegeix una casella que, quan estigui marcada, mostri una secció de 'Llançament d'Encanteris' amb un camp per a la llista d'encanteris"

> "Afegeix un camp de 'Recàrrega' al costat de cada acció, amb les opcions: —, 5–6, 4–6, 3–6"

**Desar / carregar**
> "Quan desi un monstre en un fitxer, que també inclogui la data en el nom del fitxer"

### Consells
- Com més específic siguis, millor. En lloc de "arregla la CA", digues "el camp de CA no s'actualitza quan canvio el desplegable de tipus d'armadura — arregla-ho".
- Si alguna cosa es trenca, explica-li a Claude el que veus: "El bloc d'estadístiques queda en blanc després de fer X" i ho resoldrà.
- Claude pot llegir el codi ell mateix, així que no cal que expliquis com funciona l'aplicació — simplement descriu el que vols.
