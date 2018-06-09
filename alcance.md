# DVI-project

**Título**: Mega Man (conocido en Japón como Rockman)

**Año**: 1987

**Plataforma**: NES (Nintendo Entertainment System)

**Distribuidores**: Capcom

**Datos**:
  - Es el primer videojuego donde aparece por primera vez el personaje que da nombre al mismo e inició la serie de videojuegos Mega Man.
  - La decimoprimera entrega de la saga saldrá este año 2018 para Nintendo Switch.
  - Será el primer juego de la saga en 8 años, después de la cancelación de Mega Man Universe y otros juegos del universo por parte de Capcom.
  - El videjuego tuvo su propia serie de televisión cancelada tras solo 2 temporadas.

**Objetivos iniciales**:
  - Vamos a implementar uno de los niveles originales del juego, más concretamente el que corresponde al enemigo "Fireman", recreándolo exactamente como fue originalmente diseñado.
  - Intentaremos realizar todas las mecanicas del original (mismos enemigos, vidas, puntos de control, físicas originales).
  - Nuestra idea es implementar también el jefe final que se encuentra al final del nivel con los mismos movimientos.
  - Además también añadiremos la pantalla de título del juego, que en el juego original se usaba para seleccionar entre varios enemigos (en nuestro caso sólo podremos escoger el enemigo de fuego).

###1. Diseño del juego

	**1.1 Objetivo del juego**
	El juego tiene un objetivo claro y sencillo: llegar con vida al final del nivel, donde se encuentra el boss, para derrotarle y obtener el objeto que posee. Si esto se cosigue, se gana, pero, por el contrario, si te quedas sin vida por el camino o te caes a la lava que hay en determinados puntos del nivel, mueres y tienes que volver a intentarlo.
	Hay 3 vidas iniciales para intentarlo, aunque se pueden recoger más por el camino.
	Para poder controlarlo usa:
		- Correr: teclas de direcciones derecha e izquierda.
		- Saltar: tecla X.
		- Disparar: tecla Espacio o tecla Z.
		- Subir y bajar escaleras: tecla de dirección Arriba y Abajo. Puedes descolgarte en cualquier momento con X.

	**1.2 Principales mecanicas**
	- Balas: solo puede haber 3 a la vez en pantalla y, por tanto, desaparecen al salir por un lado de la pantalla para que se pueda seguir disparando.
	- Escaleras: Megaman sube y baja por ellas. Tienen unos sprites invisibles arriba y abajo llamados "tileCheckers" para que puedan notificar a Megaman una vez ha llegado arriba o abajo del todo. Según la dirección en la que se esté avanzando, se bajará de una forma o de otra.
	- Spawner de Fireball: se usa para que estos enemigos surjan de la lava con una cierta velocidad hacia arriba durante unos segundos. Luego, se recolocan y van hacia abajo persiguiendo a Megaman.
	- Spawner de Shark: tienen un intervalo en el eje X y otro intervalo en el eje Y de forma que si Megaman está en ellos, estos enemigos surgen en su misma posición y avanzan hacia él. Es decir, forman una especie de cuadrado y si está dentro de él, se producen más enemigos cada cierto tiempo.
	- Cámara: sigue a Megaman en determinados puntos del nivel, en otros enfoca siempre un determinado plano predefinido. Además, tiene movimientos suaves al desplazarse de una escena a otra.
	- Barras de fuego: hay dos tipos: horizontales y verticales. Las verticales tienen un sprite invisible abajo para poder ocultarse sin que siga apareciendo en el nivel. Las balas no pueden atravesarla cuando está levantada.
	- Checkpoints: existe uno a la mitad del nivel y otro en el pasillo final. Si mueres y te quedan vidas empezarás en ellos en vez de al principio.
	- Puertas: sirven para cerrar ciertas partes de los niveles. Una vez entras y se cierra no puedes volver hacia atrás. Existen dos, casi al final del nivel.
	- Implementación de jefe final: al final del escenario, puedes luchar con Fireman, al que le hemos construído una IA y tiene un ataque especial en el que lanza una explosion de fuego.


	**1.3 Personajes**
	Megaman: es el personaje protagonista. Tiene las habilidades de desplazarse por la pantalla, saltar, disparar y subir escaleras.
	Fireman: es el jefe final del nivel.
	Wheel e Inverted Wheel: el primero sale del suelo y el segundo cuelga del techo. Cuando megaman está cerca, disparan varias balas en distintas direcciones, intentando que alguna le dé.
	Shark: son enemigos que tienen un movimiento sinusoidal y que al tocar o megaman o morir, producen varias explosiones que se expanden.
	Fireball: suben desde la lava en diversos puntos del escenario y luego se mueven hacia donde este Megaman, persiguiendole a una velocidad predefinida.
	Roomba: se mueven en el suelo de un lado a otro cuando Megaman está cerca.

2. Diseño de la implementación
	El juego está dividido en 7 archivos js:
	1. practica3.js: inicia Quintus y los demás componentes y carga los archivos necesarios para el correcto funcionamiento del juego. Una vez hecho esto, carga el nivel en pantalla.
	2. startAnimations.js: contiene todas las animaciones necesarias para el funcionamiento del juego. Tiene animaciones tanto para las distintas hojas de sprites utilizadas en Megaman, como de enemigos, objetos y elementos del escenario.
	3. scenes.js: tiene el código del nivel implementado ("level1"), el de la pantalla inicial de título ("maintitle"), el de los créditos ("endGame") y del hud de Megaman y del jefe, que se activa al llegar a él.
	4. sprites.js: contiene la definición y el comportamiento de todos los sprites relacionados con los personajes usados en el juego, que comprenden a Megaman, a todos los enemigos mencionados, explosiones, balas, objetos y las barras de vida utilizadas.
	5. spritesStage.js: contiene a todos los sprites utilizados en el escenario: escaleras, lava, barras de fuego horizontales y verticales, puertas que se cierran y sprites invisibles para controlar distintas variables ("black", "tilechecker").
	6. components.js: componentes utilizados para abstraer funciones en el código:
		- DefaultEnemy: comportamiento básico de los enemigos, cuando golpean a Megaman le hacen daño y cuando son golpeados por una de sus balas, reciben daño. Además, se les añade la posibilidad de dejar un objeto cuando mueren, con una cierta probabilidad.
		- Stats: necesario para darle a todos los enemigos y al propio personaje principal una vida, un poder (el daño que hacen, la vida que quitan) y si son invencibles o no.
		- PlatformerControlsMegaman: se relega a este componente el funcionamiento del movimiento del Megaman según la tecla que estemos pulsando en ese momento. Esto es porque queríamos hacer que los controles fueran más fieles a como se controlaba originalmente.
		- Doors: componente para extraer el funcionamiento de las dos puertas que hay al final del nivel, que se cierran una vez has pasado por ellas con un movimiento predefinido.

3. Postmortem
	Ahora que tenemos el proyecto terminado, vamos a hacer un análisis de nuestro trabajo:
	
	- ¿Qué ha salido bien?
	Lo principal y más importante es que al final hemos sido capaces de realizar todo lo que queríamos hacer e implementar. Creemos que nuestro nivel es una recreación bastante fiel del nivel correspondiente del juego original, llegando al punto de que si juegas a uno y a otro seguidos, solo unos pequeños detalles te harán decantarte por cuál es el juego de NES y cuál es nuestra recreación. Además, hemos sido capaces de repartirnos muy bien el trabajo y trabajar todos juntos sin pisar uno el trabajo de otro, en parte gracias a Github. También hemos sido capaces de arreglar entre los tres los problemas que iban surgiendo, sin importar qué los hubiera causado.

	- ¿Qué ha salido mal? / ¿Qué se podría mejorar?
	Antes de la presentación teníamos varias cosas a mejorar que hemos ido solucionando estos últimos días. Hemos modularizado el código, hemos implementado al enemigo final que faltaba, hemos suavizado el movimiento de cámara, hemos arreglado el WheelInvertido (que colgaba alejado del techo) y hemos añadido las puertas.
	Además, tuvimos problemas con la máscara de colisión al principio, ya que en el juego original Megaman es más grande que los elementos del escenario y, al intentar conseguir ese efecto, nos dimos cuenta de que chocaba con distintos elementos del escenario y no podía, por ejemplo, subir escaleras. Para solucionarlo tuvimos que retocar desde código la máscara de colisión de este personaje.
	Las escaleras fueron también uno de los mayores problemas. Tuvimos que probar varios métodos antes de llegar a la solución de los "tileCheckers", que notifican de cuando se llega al principio y al final.
	Pensamos que pocas cosas se podrían mejorar ya que, como hemos dicho, nos ha quedado una recreación bastante fiel del nivel original. Quizá se podrían haber añadido alguno de los otros poderes que se consiguen al derrotar a los demás jefes finales, pero como estamos simulando solo el nivel que se suele jugar primero tampoco es un añadido importante.

4. Equipo de trabajo y reparto de tareas
	Ruben Izquierdo: 33,33 %. 
	Alejandro Nieto: 33,33 %
	Alejandro Sevilla: 33,33 %. Implementación del movimiento de Megaman, escaleras, enemigos Shark y Fireball, cámara y sus movimientos, spawners de enemigos, checkpoints, realización de la demo, realización de la memoria.

5. Fuentes y referencias
  - Para la información del juego, hemos usado:
    https://es.wikipedia.org/wiki/Mega_Man_(videojuego_de_1987)
  - Hemos usado esta página para obtener una referencia jugable del nivel que hemos implementado:
  	http://www.8bbit.com/play/mega-man/541
  - Hemos utilizado sprites y fondos obtenidos en: 
  	https://www.spriters-resource.com/nes/mm/
  	http://thegamersjournal.com/action/nes/megaman/sprites.php
  	http://www.sprites-inc.co.uk/sprite.php?local=Classic/MM1
  - La música y sonidos hemos obtenido de: 
  	https://www.sounds-resource.com/nes/megaman