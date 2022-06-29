/* Música Tema */
let music = document.getElementById("musicTheme");

/* Efeito sonoro de virada da carta */
const soundCard = new Audio('/assets/audio/card.wav');

// Tocar a música ao interagir com o corpo do site.
document.body.addEventListener("mousemove", function () {
    music.play();
});

const BTN_MUTE = document.getElementById("volume-off");
const BTN_UP = document.getElementById("volume-up");

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

// Cookies - Get dos valores. 
let score = Cookies.get('score');
let player = Cookies.get('player');

// Comparar se existe um recorde armazenado no cookie.
if (score == undefined) {
    score = 9999;
} else {
    // Add ao menu de Melhor pontuação valor do recorde.
    document.getElementById('score').innerHTML = '<div class="score-players"><h3>' + Cookies.get('player') + '</h3><h3>' + Cookies.get('score') + ' Tentativas</h3></div>';
}

// Trabalhando os Cards do Jogo
const cards = document.querySelectorAll('.card');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;

//função para virar a carta, acionando o efeito sonoro da virada de carta.
function flipCard() {
    // Efeito sonoro da virada de carta.
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
    checkMatch();
}

// Variáveis para armazenar tentativas e acertos.
let cont = 0, win = 0;
//função que checa se os valores do dataset das cartas são iguais.
function checkMatch() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
        disableCards();
        win++;
        cont++;
        document.getElementById("contTo").innerHTML = cont;
        // Comparando o número de acertos com o total necessário para vencer o jogo!
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

//função para desabilitar as cartas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

//funcão que desvira as cartas
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        // Remove as classes flip ativas
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

//função que reseta o jogo
function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

//função para embaralhar as cartas 
(function shuffleCards() {
    let i = 0;
    let array = [];
    while (array.length < 18) {
        var numSorteado = Math.floor(Math.random() * 18);
        if (array.indexOf(numSorteado) == -1) {
            array.push(numSorteado);
        }
    }
    cards.forEach((card) => {
        card.style.order = array[i];
        i++
    })
})();

// Adiciona evento de clique na carta
cards.forEach((card) => {
    card.addEventListener('click', flipCard)
});

const BTN_SAVE = document.getElementById("save");
// Salvar no cookie o menor resultado para completar o jogo.
BTN_SAVE.addEventListener("click", function () {
    if (cont <= parseInt(score)) {
        Cookies.set('player', document.getElementById("nickname").value, { expires: 365 });
        Cookies.set('score', cont, { expires: 365 });
        alert("Novo Recorde!!!");
        document.getElementById('score').innerHTML = '<div class="score-players"><h3>' + Cookies.get('player') + '</h3><h3>' + Cookies.get('score') + ' Tentativas</h3></div>';
    } else {
        alert("Sua pontuação não foi a melhor, continue tentando!");
    }
    document.getElementById('winner').style.display = 'none';
});