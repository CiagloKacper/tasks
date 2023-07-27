// ZADANIE 1

// deklaracja klasy StringBuilder
class StringBuilder {
    // construktor na inicjacje clasy wpisze wartość baseString do wartości value
    //constructor(baseString = '') -> gdy nie podamy baseString przyjmię on pustego stringa
    constructor(baseString = '') {
        this.value = baseString;
    }
    //   metoda append dodaję przyjęty string na koniec zmiennej value (stringi w JS można dodawać ze sobą)
    append(str) {
        this.value += str;
        // return this zwróci aktualne dane umożliwiając wywołanie kolejnych funkcji -> w innym przypadku musimy każdą metode wywoływać osobno
        return this;
    }
    //  metoda prepend dodaję str na początek -> warto zaznaczyć że trzeba tu użyć innego operatora dodawania (w metodzie append += dodaje się str do bazowego stringa)
    prepend(str) {
        this.value = str + this.value;
        return this;
    }
    //  aby zastosować ten sam operator co przy metodzie append() można również wykonać kod w ten sposób:
    // prepend(str){
    // str += this.value; --- do zmiennej str dodajemy wartość value ( w logice ułoży się to wtedy 'str-this.value')
    // this.value = str; --- nadpisujemy domyślną wartość nową stworzoną linijkę wyżej
    // } ->osobiście nie polecam tego rozwiązania, dodaje się niepotrzebne obliczenia gdy można zastosować od razu sumę

    // metoda pad dodaje obustronnie wartość str
    pad(str) {
        this.value = str + this.value + str;
        return this;
    }
}

const builder = new StringBuilder('.');

builder
    .append('^')
    .prepend('^')
    .pad("=");

console.log(builder); // '=^.^='


// ZADANIE 2

function createBoxes(amount) {
    // Znajduję węzeł diva, do którego będziemy wstawiać następne div'y
    const boxHandler = document.getElementById('boxes');
    // po ponownym wprowadzeniu danych najpierw czyści wcześniejsze wyniki
    boxHandler.innerHTML = '';
    // Deklarujemy bazowy rozmiar div'a
    //  rozpoczęcię pętli -> wykona się tyle razy ile user wprowadził /amount/
    let size = 30;
    for (let i = 0; i < amount; i++) {
        // za każdym razem odwołujemy się do funkcji getRandomColor() która generuje losowy kolor rgb
        const randomColor = getRandomColor();

        // tworzymy w węźle diva
        const box = document.createElement('div');
        // nadajemy mu styl poprzez wcześniej zdeklarowane zmienne
        // w JS można dodawać zmienne w string poprzez zastosowanie `` a nie '' aby zastosować zmienną należy poprzedzić ją ${ /zmienna/ } <- maszyna wie że ma się tutaj spodziewać jakiś danych, nie traktuje tego jak tekstu - będzie to interpretować inaczej
        box.style.width = `${size}px`;
        box.style.height = `${size}px`;
        // wcześniej stworzony color rgb teraz przypisujemy stworzonemu div
        box.style.backgroundColor = randomColor;

        // stworzony div przypisujemy jako "dziecko" boxHandler'a czyli div#boxes
        boxHandler.appendChild(box);
        
        // Każdy kolejny element wzrasta o 10
        size += 10;
    }
}

// zapisujemy to jako osobną fukncje, ale można też to wstawić na spokojnie w pętli -> dbanie o czysty i przejrzysty kod :)
function getRandomColor() {
    // Math.floor - > zaokrągla liczbę w dół -> Math.random() w js generuje liczbę od 0 do 1 -> aby uzyskać odpowiedni przedział losowania należy pomnozyć przez chcianą liczbę (działa w przypadku gdy losujemy od 0 do x) - jeśli chcemy od y do x musimy wykonać Math.Random()*x+y
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    // funkcja zwraca string gotowy pod styl css
    return `rgb(${r}, ${g}, ${b})`;
}
// funkcja usuwająca div#boxes
function destroyBoxes() {
    const boxHandler = document.getElementById('boxes');
    boxHandler.remove();
}

// funkcja poprzedzająca createBoxes - > pobiera informacje o przyjętych wartościach
function createClicked() {
    // pobiera informacje z input#js-input a dokładnie wartośc podanego inputa -> parseInt() wymusza przyjęcie liczb
    const amount = parseInt(document.getElementById('js-input').value);
    // wywołuję funkcje createBoxes( /amount/ );
    createBoxes(amount);
}


// ZADANIE 3

//znajduje węzeł który wczytuje
const loadComponent = document.getElementById('loadingComp');
let page = 0;
const myList = document.getElementById('gallery');

// deklaruje intersectionObserver który po znalezieniu wywoła funkcje FetchData()
const observer = new IntersectionObserver(
    FetchData,
    {
        root: null,
        threshold: 1.0
    });
// observer ustawiamy na komponent ładowania
observer.observe(loadComponent);
// klucz api do pixabay
const apiKey = '38496414-9e2110abbd12ac34c6d60f5bb';

// status czy użytkownik szuka obrazka (potwierdzenie formularza)
let hasSubmitted = false;

// funkcja przyjmująca dane
function SubmitForm(event) {
    // co odświeżenie listy jest ona czyszczona
    myList.innerHTML = '';
    // ustawiamy stronę od zero (w pierwszej iteracji zawsze dodajemy 1)
    page = 0;
    // ustawiamy status na prawdę -> aby funkcja FetchData wiedziała, że przesłaliśmy formularz
    hasSubmitted = true;
    FetchData([{ isIntersecting: true }]);
    event.preventDefault();
}

function FetchData(entries) {
    // sprawdza czy wywołany observer zobaczył obiekt na ekranie czy "stracił go z oczu" -> przestał być widoczny
    // w tym przypadku warunek sprawdza czy komponent ładowania się pokazał
    if (entries[0].isIntersecting & hasSubmitted) {
        page++;
        // otrzymanie z formularza wartości szukanej
        const query = document.getElementById('query').value;
        // link do api (klucz deklarowany wcześniej plus wartość szukana)
        const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&page=${page}`;
        // wykonanie zapytania metodą GET
        fetch(apiUrl)
            // otrzymana odpowiedz przerabiana na format obiektu
            .then(response => response.json())
            // dane są później przetwarzane
            .then(data => {
                // wyniki otwiera się w pętli (każdy wynik przejdzie przez pętlę tworzącą kartę)
                data.hits.forEach(e => {
                    // tworzy się <li></li> czyli kolejny element punktowanej listy (ul - unordinary list)
                    const card = document.createElement('li');
                    // do li dopisujemy grafikę ( <img/> ) oraz akapid wywołujący funkcję showModal
                    card.innerHTML = `
                        <p onclick="ShowModal('${e.largeImageURL}')">
                            <img src="${e.webformatURL}"/>
                        </p>
                    `;
                    // dodajemy <li></li> do listy
                    myList.appendChild(card);
                });
            });
    }
};

// funkcja wyświetlająda okno powiększonego zdjęcia
function ShowModal(link) {
    // tworzy 'instancje' wtyczki basicLightbox ze zdjęcięm w które się kliknęło
    const instance = basicLightbox.create(`
        <img src="${link}" alt=''"/>
    `)

    // otwiera instancje modala
    instance.show();
}