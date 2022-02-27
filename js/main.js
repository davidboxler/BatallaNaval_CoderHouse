$(document).ready(() => {
  let sound = new Howl({
    src: ["img/audio.mp3"],
    volume: 0.2,
    loop: true,
  });
  sound.play();
});
/*=============== VARIABLES ===============*/

/*---------------- Tablero -----------------*/
const boardUser = document.querySelector(".board-player"); // Variable que contiene el tablero del usuario
const boardComputer = document.querySelector(".board-computer"); // Variable que contiene el tablero de la computadora
const itemRowsPlayer = document.querySelector(".rows-player"); // Variable que contiene la fila donde se alojan las coordenadas alfa del usuario
const itemRowsComputer = document.querySelector(".rows-computer"); // Variable que contiene la fila donde se alojan las coordenadas alfa de la computadora
const itemColumnPlayer = document.querySelector(".column-player"); // Variable que contiene la columna donde se alojan las coordenadas numericas del usuario
const itemColumnComputer = document.querySelector(".column-computer"); // Variable que contiene la columna donde se alojan las coordenadas numericas de la computadora
const letter = document.querySelector(".coordinate-letter"); // Contenedor de las coordenadas Alfa
const number = document.querySelector(".coordinate-number"); // Contenedor de las coordenadas numericas
const listaLetras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; // Lista de coordenadas Alfa
const listaNumeros = []; // Lista de coordenadas Numerica

/*---------------- Barcos -----------------*/
const ships = document.querySelectorAll(".ship");
const containerShips = document.querySelector(".container-ships"); // Contenedor de todos los barcos del usuario
const boat = document.querySelector(".boat-container"); // Variable que contiene la lancha del usuario
const submarine = document.querySelector(".submarine-container"); // Variable que contiene el submarino del usuario
const escortShip = document.querySelector(".escort-ship-container"); // Variable que contiene el escolta del usuario
const destroyer = document.querySelector(".destroyer-container"); // Variable que contiene el destructor del usuario
const aircraftCarrier = document.querySelector(".aircraft-carrier-container"); // Variable que contiene el portaAviones del usuario
const turnContainer = document.querySelector("#info__title"); // h3 que informa el turno del cada jugador
const infoContainer = document.querySelector("#info__span"); // h3 que informa que barco se ha hundido y quien lo hizo
const modalUser = document.querySelector(".modal__wins"); // Modal que informa que el usuario ganó
const modalComputer = document.querySelector(".modal__defeat"); // Modal que informa que la computadora ha ganado
const modalInfo = document.querySelector(".modal__info"); // Modal que informa que aún quedan barcos por ubicar
const closeModal = document.querySelector(".modal__close"); // Boton para cerrar el modal de victoria
const closeModalDefeat = document.querySelector(".modal__reset"); // Boton para cerrar el modal de derrota
const closeModalInfo = document.querySelector(".modal__continue"); // Boton para cerrar el modal de informacion

/*---------------- Fecha -----------------*/
const diasSemana = new Array(
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
);
const meses = new Array(
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
);
const fecha = new Date();
const hoy = fecha.getDay();
const mesActual = fecha.getMonth() + 1;

/*---------------- Botones -----------------*/
const btnGame = $("#game"); // Boton de inicio del juego
const btnRotate = $("#rotate"); // Boton para rotar la posicion de los barcos

let horizontal = true; // Variable booleana para saber si los barcos estan en posicion vertical u horizontal
let gameOver = false; // Variable booleana para dar Comienzo o fin al juego
let jugador = "user"; // Variable que indica que jugador está en turno
const userSquares = []; // Array que contiene todas las casillas del tablero del Usuario
const computerSquares = []; // Array que contiene todas las casillas del tablero de la Computadora
const computerShips = []; // Array que contiene todos los barcos de la computadora

const width = 10;

// Función que crea los 2 tableros del juego
function createBoard(grid, squares) {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.dataset.id = i;
    grid.appendChild(square);
    squares.push(square);
  }
}
// Función que crea las filas de los tableros del juego
function createRows(grid) {
  for (let i = 1; i < 11; i++) {
    const fila = document.createElement("div");
    fila.textContent = `${i}`;
    grid.appendChild(fila);
  }
}
// Función que crea las columnas de los tableros del juego
function createColumn(grid) {
  for (let j = 0; j < listaLetras.length; j++) {
    const columna = document.createElement("div");
    columna.textContent = `${listaLetras[j]}`;
    grid.appendChild(columna);
  }
}

// Llamadas a las funciónes
createBoard(boardUser, userSquares);
createBoard(boardComputer, computerSquares);

// Array que contiene los barcos
const shipsArray = [
  {
    name: "boat",
    positions: [
      [0, 1],
      [0, width],
    ],
    spaces: 2,
    status: "Activo",
  },
  {
    name: "submarine",
    positions: [
      [0, 1, 2],
      [0, width, width * 2],
    ],
    spaces: 3,
    status: "Activo",
  },
  {
    name: "escortShip",
    positions: [
      [0, 1, 2],
      [0, width, width * 2],
    ],
    spaces: 3,
    status: "Activo",
  },
  {
    name: "destroyer",
    positions: [
      [0, 1, 2, 3],
      [0, width, width * 2, width * 3],
    ],
    spaces: 4,
    status: "Activo",
  },
  {
    name: "aircraftCarrier",
    positions: [
      [0, 1, 2, 3, 4],
      [0, width, width * 2, width * 3, width * 4],
    ],
    spaces: 5,
    status: "Activo",
  },
];

/*=============== FUCTIONS-BUTTONS ===============*/

// Evento del boton "Jugar" que da comienzo al juego
btnGame.click(() => {
  if (containerShips.childElementCount == 0) {
    $("#game").css("display", "none");
    $("#rotate").css("display", "none");
    datosClima();
    $(".board__computer").mouseover(() => {
      $(".board__computer").css("cursor", "url(../img/mira.png), auto");
    });
    createRows(itemRowsPlayer);
    createRows(itemRowsComputer);
    createColumn(itemColumnPlayer);
    createColumn(itemColumnComputer);
    prepararTableros();
    iniciarJuego();
  } else {
    modalInfo.classList.add("modal--show");
  }
});

btnRotate.click(rotarBarcos);

/*=============== FUCTIONS ===============*/
// Función que rota los barcos dependiendo en que posicion están
function rotarBarcos() {
  if (horizontal) {
    boat.classList.toggle("boat-container-vertical");
    submarine.classList.toggle("submarine-container-vertical");
    escortShip.classList.toggle("escort-ship-container-vertical");
    destroyer.classList.toggle("destroyer-container-vertical");
    aircraftCarrier.classList.toggle("aircraft-carrier-container-vertical");
    horizontal = false;
    return;
  }
  if (!horizontal) {
    boat.classList.toggle("boat-container-vertical");
    submarine.classList.toggle("submarine-container-vertical");
    escortShip.classList.toggle("escort-ship-container-vertical");
    destroyer.classList.toggle("destroyer-container-vertical");
    aircraftCarrier.classList.toggle("aircraft-carrier-container-vertical");
    horizontal = true;
    return;
  }
}

// Función que realiza una animación para descubrir las filas, columnas y el tablero de la computadora
function prepararTableros() {
  $(".board-computer").animate(
    {
      opacity: 1,
    },
    1500
  );
  $(".rows-player").animate(
    {
      opacity: 1,
    },
    1500
  );
  $(".rows-computer").animate(
    {
      opacity: 1,
    },
    1500
  );
  $(".column-player").animate(
    {
      opacity: 1,
    },
    1500
  );
  $(".column-computer").animate(
    {
      opacity: 1,
    },
    1500
  );
}

// Función matemática que pinta en espacios aleatorios celdas de una grilla
// de esta forma crea los barcos de la Computadora
// gran parte del codigo fue extraído de stackoverflow
function generarBarcos(ship) {
  let randomDirection = Math.floor(Math.random() * ship.positions.length);
  let navy_Position = ship.positions[randomDirection];
  if (randomDirection === 0) position = 1;
  if (randomDirection === 1) position = 10;
  randomStart = Math.abs(
    Math.floor(
      Math.random() * computerSquares.length -
        ship.positions[0].length * position
    )
  );
  const centro = navy_Position.some((index) =>
    computerSquares[randomStart + index].classList.contains("taken")
  );
  const bordeDerecho = navy_Position.some(
    (index) => (randomStart + index) % width === width - 1
  );
  const bordeIzquierdo = navy_Position.some(
    (index) => (randomStart + index) % width === 0
  );

  if (!centro && !bordeDerecho && !bordeIzquierdo) {
    navy_Position.forEach((index) =>
      computerSquares[randomStart + index].classList.add("taken", ship.name)
    );
  } else {
    generarBarcos(ship);
  }
}

// Llamada a la función para generar los barcos de la computadora
generarBarcos(shipsArray[0]);
generarBarcos(shipsArray[1]);
generarBarcos(shipsArray[2]);
generarBarcos(shipsArray[3]);
generarBarcos(shipsArray[4]);

for (const element of computerSquares) {
  if (element.classList.contains("taken")) {
    computerShips.push(element.className, element.dataset.id);
  }
}

localStorage.setItem("Computer barcos", JSON.stringify(computerShips));

// Función que consume los datos del clima del archivo JSON y los muestra en pantalla
function datosClima() {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", "clima.json", true);

  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let datos = JSON.parse(this.responseText);

      let columna_1 = document.querySelector("#weather_col_1");
      let columna_2 = document.querySelector("#weather_col_2");
      let columna_3 = document.querySelector("#weather_col_3");
      let columna_4 = document.querySelector("#weather_col_4");
      columna_1.innerHTML = "";
      columna_2.innerHTML = "";
      columna_3.innerHTML = "";
      columna_4.innerHTML = "";

      for (let item of datos) {
        if (item.fecha == diasSemana[hoy]) {
          columna_1.innerHTML += `
          <li>Fecha: ${
            diasSemana[hoy]
          } / ${fecha.getHours()}:${fecha.getMinutes()} / ${
            meses[mesActual]
          }</li>
          <li>Direccion del Viento: ${item.direccionViento}</li>`;
          columna_2.innerHTML += `<li>Direccion de las Olas: ${item.direccionOlas}</li>
        <li>Nubosidad: ${item.nubosidad}</li>`;
          columna_3.innerHTML += `<li>Temperatura: ${item.temperatura}</li>
        <li>Altura de las Olas: ${item.alturaOlas}</li>`;
          columna_4.innerHTML += `<li>Intervalo de Olas: ${item.intervaloDeOlas}</li>
        <li>Altura de la Marea: ${item.alturaMareas}</li>`;
        }
      }
    }
  };
}

ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
userSquares.forEach((square) =>
  square.addEventListener("dragstart", dragStart)
);
userSquares.forEach((square) => square.addEventListener("dragover", dragOver));
userSquares.forEach((square) => square.addEventListener("drop", dragDrop));

let selectedShipNameWithIndex;
let arrastrarBarco;
let arrastrarBarcoLength;

ships.forEach((ship) =>
  ship.addEventListener("mousedown", (e) => {
    selectedShipNameWithIndex = e.target.id;
  })
);

// Función que se ejecuta cuando el usuario arrastra un barco
function dragStart() {
  arrastrarBarco = this;
  arrastrarBarcoLength = document.querySelectorAll(
    `.${arrastrarBarco.classList[1]} > * `
  ).length;
}

function dragOver(e) {
  e.preventDefault();
}

// Función que se ejecuta cuando el usuario suelta un barco en el tablero
function dragDrop() {
  let shipNameWithLastId = arrastrarBarco.lastElementChild.id;
  let shipClass = shipNameWithLastId.slice(0, -2);
  let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
  let shipLastId = lastShipIndex + parseInt(this.dataset.id);

  const bordeHorizontal = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81,
    91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83,
    93,
  ];
  const bordeVertical = [
    99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81,
    80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62,
    61, 60,
  ];

  let newbordeHorizontal = bordeHorizontal.splice(0, 10 * lastShipIndex);
  let newbordeVertical = bordeVertical.splice(0, 10 * lastShipIndex);

  let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

  shipLastId = shipLastId - selectedShipIndex;

  let pruebaH = parseInt(this.dataset.id) - selectedShipIndex + 0;
  let pruebaH1 = parseInt(this.dataset.id) - selectedShipIndex + 1;
  let pruebaH2 = parseInt(this.dataset.id) - selectedShipIndex + 2;
  let pruebaH3 = parseInt(this.dataset.id) - selectedShipIndex + 3;
  let pruebaH4 = parseInt(this.dataset.id) - selectedShipIndex + 4;
  
  userSquares[pruebaH].classList.contains("taken") ? pruebaH = true : pruebaH = false;
  userSquares[pruebaH1].classList.contains("taken") ? pruebaH1 = true : pruebaH1 = false;
  userSquares[pruebaH2].classList.contains("taken") ? pruebaH2 = true : pruebaH2 = false;
  userSquares[pruebaH3].classList.contains("taken") ? pruebaH3 = true : pruebaH3 = false;
  userSquares[pruebaH4].classList.contains("taken") ? pruebaH4 = true : pruebaH4 = false;

  let pruebaV = parseInt(this.dataset.id) - selectedShipIndex + width * 0;
  let pruebaV1 = parseInt(this.dataset.id) - selectedShipIndex + width * 1;
  let pruebaV2 = parseInt(this.dataset.id) - selectedShipIndex + width * 2;
  let pruebaV3 = parseInt(this.dataset.id) - selectedShipIndex + width * 3;
  let pruebaV4 = parseInt(this.dataset.id) - selectedShipIndex + width * 4;

  userSquares[pruebaV].classList.contains("taken") ? pruebaV = true : pruebaV = false;
  userSquares[pruebaV1].classList.contains("taken") ? pruebaV1 = true : pruebaV1 = false;
  userSquares[pruebaV2].classList.contains("taken") ? pruebaV2 = true : pruebaV2 = false;
  userSquares[pruebaV3].classList.contains("taken") ? pruebaV3 = true : pruebaV3 = false;
  userSquares[pruebaV4].classList.contains("taken") ? pruebaV4 = true : pruebaV4 = false;
  
  if (horizontal && !newbordeHorizontal.includes(shipLastId) && !pruebaH && !pruebaH1 && !pruebaH2 && !pruebaH3 && !pruebaH4) {
    for (let i = 0; i < arrastrarBarcoLength; i++) {
      let directionClass;
      if (i === 0) directionClass = "start";
      if (i === arrastrarBarcoLength - 1) directionClass = "end";
      userSquares[
        parseInt(this.dataset.id) - selectedShipIndex + i
      ].classList.add("taken", "horizontal", directionClass, shipClass);
    }
  } else if (!horizontal && !newbordeVertical.includes(shipLastId) && !pruebaV && !pruebaV1 && !pruebaV2 && !pruebaV3 && !pruebaV4) {
    for (let i = 0; i < arrastrarBarcoLength; i++) {
      let directionClass;
      if (i === 0) directionClass = "start";
      if (i === arrastrarBarcoLength - 1) directionClass = "end";
      userSquares[
        parseInt(this.dataset.id) - selectedShipIndex + width * i
      ].classList.add("taken", "vertical", directionClass, shipClass);
    }
  } else return;

  containerShips.removeChild(arrastrarBarco);
}

// Función que inicia el juego asignado los turnos a ambos jugadores
function iniciarJuego() {
  if (gameOver) return;
  if (jugador === "user") {
    turnContainer.innerHTML = "Tu turno";
    computerSquares.forEach((square) =>
      square.addEventListener("click", function () {
        diparoDelJugador(square);
      })
    );
  }
  if (jugador === "computer") {
    turnContainer.innerHTML = "Turno computadora";
    setTimeout(disparoDeLaComputadora, 1000);
  }
}

let boatCount = 0; // Contador de los aciertos del jugador a la lancha de la cpu
let submarineCount = 0; // Contador de los aciertos del jugador al submarino de la cpu
let escortShipCount = 0; // Contador de los aciertos del jugador al escolta de la cpu
let destroyerCount = 0; // Contador de los aciertos del jugador al destructor de la cpu
let aircraftCarrierCount = 0; // Contador de los aciertos del jugador al porta aviones de la cpu

// Función que determina la caida del disparo del usuario y realiza un conteo si este acertó en un barco enemigo
function diparoDelJugador(square) {
  if (!square.classList.contains("boom")) {
    if (square.classList.contains("boat")) boatCount++;
    if (square.classList.contains("submarine")) submarineCount++;
    if (square.classList.contains("escortShip")) escortShipCount++;
    if (square.classList.contains("destroyer")) destroyerCount++;
    if (square.classList.contains("aircraftCarrier")) aircraftCarrierCount++;
  }
  if (square.classList.contains("taken")) {
    square.classList.add("boom");
  } else {
    square.classList.add("miss");
  }
  verificarGanador();
  jugador = "computer";
  iniciarJuego();
}

let cpuboatCount = 0; // Contador de los aciertos de la cpu a la lancha del jugador
let cpusubmarineCount = 0; // Contador de los aciertos de la cpu al submarino del jugador
let cpuescortShipCount = 0; // Contador de los aciertos de la cpu al escolta del jugador
let cpudestroyerCount = 0; // Contador de los aciertos de la cpu al destructor del jugador
let cpuaircraftCarrierCount = 0; // Contador de los aciertos de la cpu al porta aviones del jugador

// Función que determina la caida del disparo de la computadora y realiza un conteo si esta acertó en un barco enemigo
function disparoDeLaComputadora() {
  let random = Math.floor(Math.random() * userSquares.length);
  console.log(random);
  if (!userSquares[random].classList.contains("boom")) {
    const acierto = userSquares[random].classList.contains("taken");
    userSquares[random].classList.add(acierto ? "boom" : "miss");
    if (userSquares[random].classList.contains("boat")) cpuboatCount++;
    if (userSquares[random].classList.contains("submarine"))
      cpusubmarineCount++;
    if (userSquares[random].classList.contains("escort-ship"))
      cpuescortShipCount++;
    if (userSquares[random].classList.contains("destroyer"))
      cpudestroyerCount++;
    if (userSquares[random].classList.contains("aircraft-carrier"))
      cpuaircraftCarrierCount++;
  } else disparoDeLaComputadora();
  jugador = "user";
  turnContainer.innerHTML = "Tu turno";
}

// Función que determina en base a la cantidad de aciertos quien es el ganador de la partida
function verificarGanador() {
  if (boatCount === 2) {
    infoContainer.innerHTML = "Has destruido la Lancha de la Computadora";
    boatCount = 10;
  }
  if (submarineCount === 3) {
    infoContainer.innerHTML = "Has hundido el submarino de la computadora";
    submarineCount = 10;
  }
  if (escortShipCount === 3) {
    infoContainer.innerHTML = "Has hundido el Escolta de la Computadora";
    escortShipCount = 10;
  }
  if (destroyerCount === 4) {
    infoContainer.innerHTML = "Has destruido el Destructor de la Computadora";
    destroyerCount = 10;
  }
  if (aircraftCarrierCount === 5) {
    infoContainer.innerHTML = "Has hundido el Porta Aviones de la Computadora";
    aircraftCarrierCount = 10;
  }
  if (cpuboatCount === 2) {
    infoContainer.innerHTML = "La computadora ha hundido tu Lancha";
    cpuboatCount = 10;
  }
  if (cpusubmarineCount === 3) {
    infoContainer.innerHTML = "La computadora ha hundido tu Submarino";
    cpusubmarineCount = 10;
  }
  if (cpuescortShipCount === 3) {
    infoContainer.innerHTML = "La computadora ha hundido tu Escolta";
    cpuescortShipCount = 10;
  }
  if (cpudestroyerCount === 4) {
    infoContainer.innerHTML = "La computadora ha hundido tu Destructor";
    cpudestroyerCount = 10;
  }
  if (cpuaircraftCarrierCount === 5) {
    infoContainer.innerHTML = "La computadora ha hundido tu Porta Aviones";
    cpuaircraftCarrierCount = 10;
  }
  if (
    boatCount +
      submarineCount +
      escortShipCount +
      destroyerCount +
      aircraftCarrierCount ===
    50
  ) {
    modalUser.classList.add("modal--show");
    finDelJuego();
  }
  if (
    cpuboatCount +
      cpusubmarineCount +
      cpuescortShipCount +
      cpudestroyerCount +
      cpuaircraftCarrierCount ===
    50
  ) {
    modalComputer.classList.add("modal--show");
    finDelJuego();
  }
}
// Función que termina el juego
function finDelJuego() {
  gameOver = true;
}

closeModal.addEventListener("click", () => {
  modalUser.classList.remove("modal--show");
  location.reload();
});

closeModalDefeat.addEventListener("click", () => {
  modalComputer.classList.remove("modal--show");
  location.reload();
});

closeModalInfo.addEventListener("click", () => {
  modalInfo.classList.remove("modal--show");
});
