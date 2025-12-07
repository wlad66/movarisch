**Workflow Corretto per Modifiche Docker**

**SEMPRE seguire questi passaggi:**

**Modifica il file sul VPS (non nel container):**



**Rebuild dell'immagine:**



**Riavvia con la nuova immagine:**



**MAI fare:**

❌ docker cp seguito da docker-compose restart (perde le modifiche)

❌ Modifiche dirette dentro il container senza rebuild

