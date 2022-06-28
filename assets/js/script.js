
let music = document.getElementById("musicTema");
const BTN_MUTE = document.getElementById("volume-off");
const BTN_UP = document.getElementById("volume-up");
const BTN_SAVE = document.getElementById("save");
/* Add efeito sonoro de virada de carta */
const soundCard = new Audio('/assets/audio/card.wav');

// Tocar a música ao interagir com o corpo do site.
document.body.addEventListener("mousemove", function () {
    music.play();
});

// Função para mutar a música tema.
function mute() {
    music.muted = true;
    BTN_MUTE.style.display = 'block';
    BTN_UP.style.display = 'none';
}
// Função para remover o mute da música.
function up() {
    music.muted = false;
    BTN_MUTE.style.display = 'none';
    BTN_UP.style.display = 'block';
}

// Cookies - Pegar valores. 
let score = Cookies.get('score');
let player = Cookies.get('player');

if (score == undefined) {
    score = 9999;
} else {
    // Add ao menu de Melhor pontuação valor do recorde.
    document.getElementById('score').innerHTML = '<div class="score-players"><h3>' + Cookies.get('player') + '</h3><h3>' + Cookies.get('score') + '</h3></div>';
}

const cards = document.querySelectorAll('.card');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;

//função para virar carta, acionando o efeito sonoro de virada de carta.
function flipCard() {
    soundCard.play();
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    hasFlippedCard = false;
    checkForMatch();
}

let cont = 0, win = 0;
//função que checa se as cartas são iguais
function checkForMatch() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
        disableCards();
        win++;
        cont++;
        document.getElementById("contTo").innerHTML = cont;
        if (win === 9) {
            document.getElementById("winner").style.animation = "transitionGame 2s ease-in-out forwards";
            document.getElementById("winner").style.display = "flex";
            document.getElementById("winner").style.visibility = "visible";
        }
        return;
    }
    cont++;
    document.getElementById("contTo").innerHTML = cont;
    unflipCards();
}

//função que desabilita as cartas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

//funcão que desvira as cartas
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

//função que reseta o tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

//função que embaralha as cartas
(function shuffle() {
    cards.forEach((card) => {
        let ramdomPosition = Math.floor(Math.random() * 18);
        card.style.order = ramdomPosition;
    })
})();

//adiciona evento de clique na carta
cards.forEach((card) => {
    card.addEventListener('click', flipCard)
});

BTN_SAVE.addEventListener("click", function () {
    if (cont <= parseInt(score)) {
        Cookies.set('player', document.getElementById("nickname").value, { expires: 365 });
        Cookies.set('score', cont, { expires: 365 });
        alert("Novo Recorde!!!");
        document.getElementById('score').innerHTML = '<div class="score-players"><h3>' + Cookies.get('player') + '</h3><h3>' + Cookies.get('score') + '</h3></div>';
    } else {
        alert("Sua pontuação ainda não atingiu a melhor, continue tentando!");
    }

})