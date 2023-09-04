# slido
Projekat je rađen u sklopu predmeta Odabrana poglavlja kompjuterskih nauka. Slijede specifikacije.

Kreirati aplikaciju koja će pomoći u interakciji publike tokom predavanja, konferencija i drugih sličnih događaja.
Aplikacija se sastoji od više modula, te je predviđena za korištenje različitim tipovima korisnika:
- administrator sistema,
- predavač,
- publika.

Administrator sistema je korisnik koji ima osnovnu kontrolu kad dešavanjima u sistemu. Može raditi CRUD operacija nad svim šifrarnicima (lookup tabelama), može brisati postojeće korisnike, te ih može blokirati na period od 15 ili 30 dana. Administrator sistema vidi sva zakazana predavanja, te može brisati buduća predavanja. Više korisnika može imati ulogu administratora sistema. Admin korisnici se dodaju direktno kroz bazu podataka.

Predavači su registrovani korisnici koji imaju veliki broj mogućnosti u sistemu. Predavači zakazuju predavanja, dijele pristupne podatke gostima (publici), odgovaraju na pitanja, filtriraju pitanja, prate izvještaje i drugo.

Publiku čine gosti sistema (korisnici koji nisu registrovani). Pristupaju putem linka ili koda određenom predavanju, imaju mogućnost postavljanja pitanja, odobravanja već postavljenih pitanja i drugo.

U nastavku će biti navedene detaljnije specifikacije za svaki tip korisnika.

* Modul 1: Administrator sistema
    - Ima mogućnost administracije svih korisnika (predavača), te dogovorenih predavanja;
    - Ima mogućnost uređivanja svih šifrarnika koji se koriste u sistemu;
    - Ima mogućnost uređivanja liste zabranjenih riječi.

* Modul 2: Predavač
    - Ima mogućnost registracije na sistem;
    - Ima mogućnost kreiranja predavanja na jednostavan način. Pri tome, svako predavanje se kreira unosom koda, naziva, vremena i pravila ponavljanja (npr. jednom sedmično do 15. juna). Predavač može učitati sliku koja će predstavljati pozadinu stranice tog predavanja (cover);
    - Vidi listu svih svojih predavanja, sa statistikom (broj postavljenih i odgovorenih pitanja);
    - Ima mogućnost podjele koda za pristup predavanju (jedna stranica gdje se krupno vidi kod);
    - Ima mogućnost pregleda svih postavljenih pitanja za neko predavanje. Predavač može svako pitanje izbrisati, odgovoriti (prelazi u listu odgovorenih pitanja), sakriti (prelazi u listu skrivenih pitanja). Predavač ima mogućnost različitog sortiranja predavanja (vremenski, po broju odobravanja);
    - Ima mogućnost dobijanja mail izvještaja nakon svakog održanog predavanja. U mail izvještaju ima listu svih pitanja i broj odobravanja, kao i ukupnu statistiku broja postavljenih i odgovorenih pitanja;
    - Predavač ima listu skrivenih pitanja. Neko pitanje će biti skriveno, ukoliko sadrži neku od zabranjenih riječi u sistemu.Predavač može po volji otvoriti tu listu i odabrati da odgovori na neko pitanje;
    - Predavač ima mogućnost podjele pristupnog linka za neko predavanje na mailove gostiju.

* Modul 3: Publika
    - Pristupom na osnovnu stranicu sistema ima mogućnost unosa koda kojeg podijeli predavač. Ispravnim unosom koda, dobijaju listu svih postavljenih pitanja na tom predavanju, kao i mogućnost odobravanja postavljenih pitanja (lajkanje) ili postavljanja novih pitanja;
    - Imaju mogućnost pristupa nekom predavanju putem linka kojeg podijeli predavač na mail;
    - Imaju mogućnost filtriranja i sortiranja postavljenih pitanja.

# demo video: https://www.youtube.com/watch?v=DNp3JyJnf-s&ab_channel=AlmaBasic