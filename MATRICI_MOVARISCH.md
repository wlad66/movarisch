# MoVaRisCh - Matrici di Valutazione del Rischio

Questo documento contiene le matrici visive utilizzate dall'algoritmo MoVaRisCh per il calcolo del rischio chimico.

---

## Matrice 1: Quantità in Uso

Relazione tra **Proprietà Chimico-Fisiche** e **Quantità in Uso** per determinare l'indicatore di **Disponibilità (D)**.

![Matrice 1 - Quantità in Uso](C:/Users/rferr/.gemini/antigravity/brain/47319a3f-bc9b-430f-bbce-681f24765b99/uploaded_image_1765041697382.jpg)

### Valori dell'indicatore di disponibilità (D)
- **Bassa** à D = 1
- **Medio/Bassa** à D = 2
- **Medio/Alta** à D = 3
- **Alta** à D = 4

---

## Matrice 2: Tipologia d'Uso

Relazione tra **Disponibilità (D)** e **Tipologia d'Uso** per determinare l'indicatore di **Uso (U)**.

![Matrice 2 - Tipologia d'Uso](C:/Users/rferr/.gemini/antigravity/brain/47319a3f-bc9b-430f-bbce-681f24765b99/uploaded_image_0_1765041783050.jpg)

### Valori dell'indicatore d'uso (U)
- **Basso** à U = 1
- **Medio** à U = 2
- **Alto** à U = 3

---

## Matrice 3: Tipologia di Controllo

Relazione tra **Uso (U)** e **Tipologia di Controllo** per determinare l'indicatore di **Compensazione (C)**.

![Matrice 3 - Tipologia di Controllo](C:/Users/rferr/.gemini/antigravity/brain/47319a3f-bc9b-430f-bbce-681f24765b99/uploaded_image_1765041839678.jpg)

### Valori dell'indicatore di compensazione (C)
- **Basso** à C = 1
- **Medio** à C = 2
- **Alto** à C = 3

---

## Matrice 4: Tempo di Esposizione

Relazione tra **Compensazione (C)** e **Tempo di Esposizione** per determinare il **Sub-indice di Intensità (I)**.

![Matrice 4 - Tempo di Esposizione](C:/Users/rferr/.gemini/antigravity/brain/47319a3f-bc9b-430f-bbce-681f24765b99/uploaded_image_1_1765041876385.jpg)

### Valori del sub-indice di Intensità (I)
- **Bassa** à I = 1
- **Medio/Bassa** à I = 3
- **Medio/Alta** à I = 7
- **Alto** à I = 10

---

## Matrice 5: Esposizione Cutanea

Relazione tra **Tipologia d'Uso** e **Livello di Contatto** per determinare l'**Esposizione Cutanea (E_cute)**.

![Matrice 5 - Esposizione Cutanea](C:/Users/rferr/.gemini/antigravity/brain/47319a3f-bc9b-430f-bbce-681f24765b99/uploaded_image_1765041913883.jpg)

### Valori da assegnare ad E_cute
- **Basso** à E_cute = 1
- **Medio** à E_cute = 3
- **Alto** à E_cute = 7
- **Molto alto** à E_cute = 10

---

## Legenda Colori

| Colore | Significato | Livello di Rischio |
|--------|-------------|-------------------|
| 🟦 Ciano | Basso | Minimo |
| 🟨 Giallo | Medio/Basso | Moderato |
| 🟩 Verde | Medio/Alto | Elevato |
| 🟪 Magenta | Alto | Molto Elevato |

---

## Flusso di Calcolo

```
1. QUANTITÀ + STATO FISICO → D (Disponibilità)
2. D + TIPOLOGIA USO → U (Uso)
3. U + TIPO CONTROLLO → C (Compensazione)
4. C + TEMPO ESPOSIZIONE → I (Intensità)
5. E_inalatorio = I × d (distanza)
6. R_inalatorio = P × E_inalatorio
```

---

**Documento**: Matrici MoVaRisCh  
**Versione**: 1.0  
**Data**: Dicembre 2025
