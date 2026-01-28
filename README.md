## 1. Spustenie projektu

**Inštalácia potrebných knižníc:**

```bash
npm install
```

**Spustenie vývojového servera:**

```bash
npm run start
```

---

# Úlohy:

Po splnení každej úlohy si odškrtnite príslušný bod. ([ ] -> [x]). Za každým commitom spravte push na GitHub, aby bola aktuálna práca dostupná online.

- [ ] 0. Vytvorte vetvu s názvom `feature/PRIEZVISKO/task-list`. Spravte commit s popisom "Vytvorená vetva feature/to-do-list".
- [ ] 1. Vytvorte textový input, ktorý bude mať placeholder "Zadajte text". Spravte commit s popisom "Vytvorený textový input".
- [ ] 2. Pridajte tlačidlo s textom "ADD TASK". Spravte commit s popisom "Pridané tlačidlo".
- [ ] 3. Po kliknutí sa obsah textového inputu zobrazí v konzole. Vytvorte funkciu, ktorá to vykoná. Spravte commit s popisom "Pridaná funkcia na zobrazenie textu v konzole".
- [ ] 5. Vytvorte oblasť, kde sa budú zobrazovať úlohy. Spravte commit s popisom "Vytvorená oblasť na zobrazenie úloh".
- [ ] 6. Po kliknutí na tlačidlo sa text z inputu pridá do zoznamu úloh a zobrazí sa v oblasti na zobrazenie úloh. Spravte commit s popisom "Pridaná funkcia na pridanie úlohy do zoznamu".
- [ ] 7. Po pridaní úlohy sa textový input vyčistí. Spravte commit s popisom "Vyčistenie textového inputu po pridaní úlohy".
- [ ] 8. Pridajte možnosť odstrániť úlohu zo zoznamu. Pridajte ikonu koša ku každej udalosti. Spravte commit s popisom "Pridaná funkcia na odstránenie úlohy zo zoznamu".
- [ ] 9. Po kliknutí na ikonu koša sa úloha odstráni zo zoznamu. Spravte commit s popisom "Úloha odstránená zo zoznamu po kliknutí na ikonu koša".
- [ ] 10. Spravte push na GitHub, tak aby bola vaša vetva dostupná online.

---

CHEATSHEET:

- Použite `useState` na správu stavu úloh.
- Použite `map` na zobrazenie zoznamu úloh.
- Použite `filter` na odstránenie úlohy zo zoznamu.
- Nezabudnite na správne kľúče pri renderovaní zoznamov v Reacte.
- Ikony môžete použiť z knižnice `react-icons` (napr. `import { FaTrash } from 'react-icons/fa';`).
- Môžete použiť funkciu `Date.now()` na generovanie jedinečných ID
- Využite react native-paper, inštalácia cez npm:

```bash
npm install react-native-paper
```

- Štýly môžete pridať podľa vlastného uváženia.
- Premýšlajte nad rozdelením komponentov, aby bol kód prehľadnejší.
- Nezabudnite na správne pomenovanie vetvy podľa vzoru `feature/PRIEZVISKO/task-list`.
- Commit spravte až po dokončení každej úlohy.
- Pri pushovaní vetvy na GitHub použite príkaz `git push origin feature/PRIEZVISKO/task-list`.
