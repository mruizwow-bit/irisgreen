"""Estudio de máquinas e inventos (R43): banco de trabajo 2D con engranajes, palanca y balancín, poleas,
rampa y máquina en cadena con física real (Planck.js). Sustituye al estudio antiguo de máquinas y conserva
sus 18 retos en 5 niveles, su cálculo (ig-taller-maquinas-calc.js, sin cambios) y sus textos «Cómo calcula».
Fuentes verificadas: OpenStax College Physics 2e (Urone y Hinrichs, 2022), secciones 5.1, 6.1, 9.2 y 9.5."""

ENGINE = 'maquinas'
SLUG = {'es': 'maquinas', 'en': 'machines'}
SCRIPTS = ['ig-taller-maquinas-calc.js', 'ig-suite-maquinas-cadena.js', 'ig-suite-maquinas.js']
STYLES = ['ig-suite-maquinas.css']
LIBRARIES = 'Planck.js (MIT) para la física de la máquina en cadena; el dibujo es SVG propio de Iris Green'
LIBRARIES_EN = 'Planck.js (MIT) for the chain-machine physics; the drawing is Iris Green’s own SVG'

SOURCES_ES = (
    'Urone, Paul Peter y Hinrichs, Roger (2022). College Physics 2e. OpenStax (Rice University). '
    'Secciones 5.1 «Friction» (rozamiento, F = μN), 6.1 «Rotation Angle and Angular Velocity» (v = rω, en la base de la relación de transmisión), '
    '9.2 «The Second Condition for Equilibrium» (momentos o pares) y 9.5 «Simple Machines» (palanca, polea, plano inclinado y ventaja mecánica). '
    'https://openstax.org/details/books/college-physics-2e\n\n'
    'Planck.js, motor de física 2D en JavaScript basado en Box2D (licencia MIT): https://piqnt.com/planck.js/'
)
SOURCES_EN = (
    'Urone, Paul Peter and Hinrichs, Roger (2022). College Physics 2e. OpenStax (Rice University). '
    'Sections 5.1 “Friction” (F = μN), 6.1 “Rotation Angle and Angular Velocity” (v = rω, the basis of the gear ratio), '
    '9.2 “The Second Condition for Equilibrium” (moments or torques) and 9.5 “Simple Machines” (lever, pulley, inclined plane and mechanical advantage). '
    'https://openstax.org/details/books/college-physics-2e\n\n'
    'Planck.js, a 2D physics engine in JavaScript based on Box2D (MIT licence): https://piqnt.com/planck.js/'
)

PAGE = {
    'es': {
        'title': 'Máquinas e inventos',
        'description': 'Engranajes, palancas, balancines, poleas, rampas y máquinas en cadena con física real. Cálculo en vivo de velocidad, sentido, par, fuerza y rendimiento, con 24 retos en 5 niveles.',
        'lede': 'Un banco de trabajo para máquinas de verdad. Monta trenes de engranajes, mueve el apoyo de una palanca, elige poleas para subir una tonelada, ajusta una rampa o monta una máquina en cadena y pulsa Probar para verla funcionar.',
        'make': ['Un tren de engranajes con la relación que quieras', 'Un reloj: la aguja de las horas movida por la de los minutos', 'Un balancín equilibrado y una palanca para levantar una piedra',
                 'Un polipasto y su rendimiento', 'Una máquina en cadena con pasos contados', 'Una imagen (PNG o SVG) y una ficha técnica para imprimir'],
        'steps': [
            'Elige un montaje en la lista Estructura: Engranajes, Palanca, Poleas, Rampa o Máquina en cadena.',
            'Coloca piezas con la herramienta Añadir (clic o Intro en el lienzo). Elige una pieza para cambiar sus datos en Propiedades o muévela con las flechas.',
            'Mira el cálculo en Propiedades: velocidad, sentido, par, fuerza necesaria y rendimiento. Los avisos dicen si algo choca o se bloquea.',
            'Pulsa Probar para ver el movimiento. Con movimiento reducido, cada pulsación avanza un paso.',
            'Elige un reto en Propiedades: se comprueba solo. Guarda el proyecto, exporta la imagen o imprime la ficha técnica desde Archivo.',
        ],
        'sections': [
            {'h': 'Cinco montajes', 'p': 'Engranajes: ruedas dentadas en ejes, con un motor y una salida. Palanca: una tabla sobre un apoyo, con cargas y el punto donde empujas; sin fuerza es un balancín. Poleas: fija, móvil y polipastos de hasta 6 tramos de cuerda. Rampa: un plano inclinado para subir una caja con rozamiento. Máquina en cadena: bolas, dominós, rampas, balancines, péndulos, ruedas de paletas, cajas, trampolines y un cubo de meta que se mueven con física real.'},
            {'h': 'Cómo calcula', 'p': 'Engranajes: todos tienen dientes del mismo tamaño (módulo 2 mm), así que el tamaño depende del número de dientes. Dos engranajes que se tocan giran en sentidos contrarios, y la velocidad cambia en proporción inversa a los dientes: 20 contra 60 gira tres veces más despacio y con tres veces más par (el par es la fuerza de giro). Los del mismo eje giran juntos. El rendimiento de cada engrane (98 % si no lo cambias) resta un poco de par en cada paso.\n\n'
                                        'Palanca: la fuerza por su distancia al apoyo es igual a la carga por su distancia al apoyo. Esa multiplicación se llama momento. Con varias cargas se suman sus momentos.\n\n'
                                        'Poleas: la carga se reparte entre los tramos de cuerda que la sostienen, pero hay que tirar de más cuerda. Se cuenta un 5 % de pérdida por rozamiento en cada polea y 0,4 kg por cada polea móvil.\n\n'
                                        'Rampa: sin rozamiento, la fuerza es el peso por la altura partida por la longitud. El rozamiento (μ, un número que depende de las superficies) añade el peso por μ por el coseno del ángulo. El rendimiento compara el trabajo útil con el que haces.\n\n'
                                        'Máquina en cadena: un motor físico (Planck.js) calcula los choques y el movimiento. Cuenta un paso cada vez que una pieza se pone en marcha o que algo en movimiento toca una rampa, un trampolín o entra en el cubo, y anota qué pieza lo ha provocado.'},
            {'h': 'Retos', 'p': 'Nivel 1 · Primeros mecanismos: Tres veces más lento; Mismo sentido, misma velocidad; Levanta 60 kg con 20 kg; Equilibra el balancín; La mitad de esfuerzo; Subir un peso con una polea; Al cubo; Una cadena de tres.\n\n'
                                  'Nivel 2 · Fuerza y sentido: Cuatro veces más fuerza; Triple de rápido; Como una carretilla; Como unas pinzas; 100 kg con menos de 30; Rampa de carga.\n\n'
                                  'Nivel 3 · Trenes compuestos: Reloj con engranajes; Sesenta a uno; Poca fuerza y poca cuerda; Rampa con buen rendimiento; Seis pasos, cuatro piezas.\n\n'
                                  'Nivel 4 · Cargas grandes: Media tonelada; Una tonelada; Polipasto y rendimiento.\n\n'
                                  'Nivel 5 · Sin techo: Relación sorpresa; La gran máquina de 10 pasos.'},
            {'h': 'Límites del modelo', 'p': 'Es un modelo para aprender: no sustituye al cálculo de una máquina real ni a las normas de seguridad para levantar cargas. Las velocidades se dan en vueltas por minuto (rpm). El peso de la tabla de la palanca no se cuenta. En la máquina en cadena, la física es real pero simplificada: pequeños cambios de posición pueden cambiar el resultado, como pasa con las máquinas de verdad.'},
            {'h': 'Fuentes', 'p': SOURCES_ES},
        ],
        'links': [('Todo el taller', '/es/taller/'), ('Circuitos', '/es/taller/circuitos/'), ('Estructuras y puentes', '/es/taller/estructuras/'), ('Robótica', '/es/taller/robotica/')],
    },
    'en': {
        'title': 'Machines and inventions',
        'description': 'Gears, levers, seesaws, pulleys, ramps and chain-reaction machines with real physics. Live calculation of speed, direction, torque, force and efficiency, with 24 challenges on 5 levels.',
        'lede': 'A workbench for real machines. Build gear trains, move the pivot of a lever, choose pulleys to raise a tonne, adjust a ramp or build a chain-reaction machine and press Test to watch it work.',
        'make': ['A gear train with any ratio you like', 'A clock: the hour hand driven by the minute hand', 'A balanced seesaw and a lever to lift a rock',
                 'A pulley block and its efficiency', 'A chain-reaction machine with counted steps', 'An image (PNG or SVG) and a printable technical sheet'],
        'steps': [
            'Choose an assembly in the Structure list: Gears, Lever, Pulleys, Ramp or Chain machine.',
            'Place parts with the Add tool (click, or Enter on the canvas). Choose a part to change its data in Properties, or move it with the arrow keys.',
            'Read the calculation in Properties: speed, direction, torque, force needed and efficiency. Warnings tell you if something clashes or jams.',
            'Press Test to see the movement. With reduced motion, each press moves one step on.',
            'Pick a challenge in Properties: it checks itself. Save the project, export the image or print the technical sheet from File.',
        ],
        'sections': [
            {'h': 'Five assemblies', 'p': 'Gears: toothed wheels on axles, with a motor and an output. Lever: a plank on a pivot, with loads and the point where you push; with no force it is a seesaw. Pulleys: fixed, movable and pulley blocks with up to 6 lengths of rope. Ramp: an inclined plane to push a box up, with friction. Chain machine: balls, dominoes, ramps, seesaws, pendulums, paddle wheels, boxes, trampolines and a goal bucket that move with real physics.'},
            {'h': 'How it calculates', 'p': 'Gears: all of them have teeth of the same size (module 2 mm), so their size depends on the number of teeth. Two gears that touch turn in opposite directions, and the speed changes in inverse proportion to the teeth: 20 against 60 turns three times slower with three times the torque (torque is turning force). Gears on the same axle turn together. The efficiency of each mesh (98% unless you change it) takes a little torque away at each step.\n\n'
                                              'Lever: the force times its distance to the pivot equals the load times its distance to the pivot. That product is called the moment. With several loads, their moments add up.\n\n'
                                              'Pulleys: the load is shared between the lengths of rope that hold it, but you have to pull more rope. A 5% friction loss is counted for each pulley and 0.4 kg for each movable pulley.\n\n'
                                              'Ramp: without friction, the force is the weight times the height divided by the length. Friction (μ, a number that depends on the surfaces) adds the weight times μ times the cosine of the angle. Efficiency compares the useful work with the work you do.\n\n'
                                              'Chain machine: a physics engine (Planck.js) works out the collisions and the movement. It counts a step each time a part starts moving or something moving touches a ramp or a trampoline or lands in the bucket, and it notes which part caused it.'},
            {'h': 'Challenges', 'p': 'Level 1 · First mechanisms: Three times slower; Same direction, same speed; Lift 60 kg with 20 kg; Balance the seesaw; Half the effort; Raise a weight with a pulley; Into the bucket; A chain of three.\n\n'
                                       'Level 2 · Force and direction: Four times the force; Three times faster; Like a wheelbarrow; Like tweezers; 100 kg with under 30; Loading ramp.\n\n'
                                       'Level 3 · Compound trains: Clock with gears; Sixty to one; Little force and little rope; An efficient ramp; Six steps, four parts.\n\n'
                                       'Level 4 · Heavy loads: Half a tonne; One tonne; Pulley block and efficiency.\n\n'
                                       'Level 5 · No ceiling: Surprise ratio; The great 10-step machine.'},
            {'h': 'Limits of the model', 'p': 'It is a model for learning: it does not replace the calculation of a real machine or the safety rules for lifting loads. Speeds are given in turns per minute (rpm). The weight of the lever plank is not counted. In the chain machine the physics is real but simplified: small changes in position can change the result, just as with real machines.'},
            {'h': 'Sources', 'p': SOURCES_EN},
        ],
        'links': [('The whole workshop', '/en/workshop/'), ('Circuits', '/en/workshop/circuits/'), ('Structures and bridges', '/en/workshop/structures/'), ('Robotics', '/en/workshop/robotics/')],
    },
}

# ---------- Retos: títulos, objetivos y pistas (las reglas están en el JS) ----------
CH_ES = {
    'g1': ('Tres veces más lento', 'Monta dos engranajes para que la salida gire tres veces más despacio que el motor.', 'Si el motor tiene 20 dientes, busca uno con el triple de dientes.'),
    'g2': ('Mismo sentido, misma velocidad', 'Haz que la salida gire igual de rápido que el motor y en el mismo sentido.', 'Dos engranajes que se tocan giran en sentidos contrarios. Un tercero en medio devuelve el sentido.'),
    'p1': ('Levanta 60 kg con 20 kg', 'Mueve el punto de apoyo, la carga y el sitio donde empujas hasta levantar 60 kg haciendo como mucho 20 kg de fuerza. La tabla mide 3 m como mucho.', 'Cuanto más lejos del apoyo empujas y más cerca está la carga, menos fuerza hace falta.'),
    'b1': ('Equilibra el balancín', 'Dos cargas en un balancín: muévelas o cambia su masa hasta que el balancín quede recto.', 'La carga más pesada tiene que ir más cerca del apoyo. Mira el momento de cada una.'),
    'q1': ('La mitad de esfuerzo', 'Sube 40 kg haciendo como mucho 22 kg de fuerza.', 'La polea fija solo cambia la dirección. La polea móvil reparte el peso entre dos tramos de cuerda.'),
    'q0': ('Subir un peso con una polea', 'Sube un cubo de 20 kg hasta 3 m de altura tirando con 12 kg o menos.', 'Con una polea fija tiras de todo el peso. Prueba con una polea móvil.'),
    'k0': ('Al cubo', 'Haz que algo en movimiento acabe dentro del cubo de meta.', 'Una bola en lo alto de una rampa y el cubo justo donde cae. Pulsa Probar y ajusta.'),
    'k1': ('Una cadena de tres', 'Monta una máquina de tres pasos o más en la que cada paso lo pone en marcha el anterior. Escribe qué hace cada pieza.', 'Por ejemplo: una canica rueda por una rampa, cae sobre un balancín y el balancín empuja un dominó.'),
    'g3': ('Cuatro veces más fuerza', 'Consigue que la salida tenga por lo menos cuatro veces el par (la fuerza de giro) del motor.', 'Lo que se gana en fuerza se pierde en velocidad: un engranaje pequeño que mueve uno grande.'),
    'g4': ('Triple de rápido', 'La salida tiene que girar tres veces más rápido que el motor y en el mismo sentido.', 'Ahora el grande mueve al pequeño. Para el sentido, recuerda el engranaje del medio.'),
    'p2': ('Como una carretilla', 'Monta una palanca de segundo tipo: el apoyo en un extremo, la carga en medio y la fuerza en el otro extremo. 60 kg con 30 kg o menos.', 'En la carretilla, la rueda es el apoyo y tú levantas por los mangos.'),
    'p3': ('Como unas pinzas', 'Palanca de tercer tipo: la fuerza va entre el apoyo y la carga. Mueve 10 kg sin pasar de 25 kg de fuerza.', 'Este tipo pide más fuerza que la carga, pero la punta se mueve más y más rápido. Así funcionan tu brazo y unas pinzas.'),
    'q2': ('100 kg con menos de 30', 'Sube 100 kg haciendo menos de 30 kg de fuerza.', 'Cada polea pierde un poco por el rozamiento. Mira la diferencia entre la fuerza ideal y la real.'),
    'r1': ('Rampa de carga', 'Sube una caja de 100 kg a una plataforma de 1 m empujando con 40 kg o menos. El rozamiento es μ = 0,1.', 'Una rampa más larga tiene menos pendiente y pide menos fuerza, pero recorres más distancia.'),
    'g5': ('Reloj con engranajes', 'En un reloj, la aguja de los minutos da 12 vueltas mientras la de las horas da una. Monta ese tren: 12 veces más lento y en el mismo sentido.', 'Con un solo par no llegas. Pon dos engranajes en el mismo eje («delante» o «detrás»): 1:3 y luego 1:4.'),
    'g6': ('Sesenta a uno', 'De segundos a minutos: la salida da una vuelta por cada 60 del motor, sin usar engranajes de más de 60 dientes.', '60 = 3 × 4 × 5. Tres etapas en ejes compartidos.'),
    'q3': ('Poca fuerza y poca cuerda', 'Sube 50 kg a 2 m de altura con menos de 20 kg de fuerza y sin tirar de más de 8 m de cuerda.', 'Más tramos de cuerda: menos fuerza, pero más cuerda. Busca el equilibrio.'),
    'r2': ('Rampa con buen rendimiento', 'Sube 80 kg a 1,2 m con 50 kg de fuerza o menos y un rendimiento del 70 % o más. El rozamiento es μ = 0,15.', 'Si la rampa es muy larga y suave, el rozamiento se come más trabajo. Si es muy corta, pide demasiada fuerza.'),
    'k2': ('Seis pasos, cuatro piezas', 'Una máquina de seis pasos o más, con cuatro tipos de pieza distintos como mínimo. Todas las piezas que se mueven se ponen en marcha y cada una dice qué hace.', 'Las ruedas de paletas y los balancines cambian la dirección del movimiento.'),
    'p4': ('Media tonelada', 'Con una tabla de 3 m, levanta 500 kg haciendo como mucho 50 kg de fuerza.', 'Necesitas una ventaja de 10: el brazo de la fuerza, diez veces el de la carga.'),
    'q4': ('Una tonelada', 'Sube 1000 kg a 3 m con 250 kg de fuerza o menos (por ejemplo, entre cuatro personas) y 20 m de cuerda como mucho.', 'Las grúas de obra usan polipastos con muchos tramos de cuerda.'),
    'q5': ('Polipasto y rendimiento', 'Sube 120 kg con 40 kg de fuerza o menos y un rendimiento del 80 % o más.', 'Cada polea pierde un 5 %: más poleas dan menos fuerza, pero peor rendimiento.'),
    'g7': ('Relación sorpresa', 'Cada vez sale una relación distinta. Monta un tren de engranajes que la cumpla exactamente. Con «Otra relación» sale otra, sin fin.', 'Descompón la fracción: 5/16 es 1/2 × 5/8, o 10 dientes contra 32.'),
    'k3': ('La gran máquina de 10 pasos', 'Diez pasos o más, con seis tipos de pieza como mínimo, que acaben en el cubo. Todas las piezas que se mueven se ponen en marcha y cada una dice qué hace. Después, si quieres, constrúyela de verdad.', 'Imprime la ficha técnica: te sirve de guion para montarla.'),
}
CH_EN = {
    'g1': ('Three times slower', 'Build two gears so the output turns three times slower than the motor.', 'If the motor has 20 teeth, look for one with three times as many.'),
    'g2': ('Same direction, same speed', 'Make the output turn as fast as the motor and in the same direction.', 'Two gears that touch turn in opposite directions. A third one in the middle turns it back.'),
    'p1': ('Lift 60 kg with 20 kg', 'Move the pivot, the load and the place where you push until you lift 60 kg with a force of 20 kg at most. The plank is 3 m long at most.', 'The further from the pivot you push and the closer the load is, the less force you need.'),
    'b1': ('Balance the seesaw', 'Two loads on a seesaw: move them or change their mass until the seesaw is level.', 'The heavier load has to sit closer to the pivot. Look at the moment of each one.'),
    'q1': ('Half the effort', 'Raise 40 kg with a force of 22 kg at most.', 'A fixed pulley only changes the direction. A movable pulley shares the weight between two lengths of rope.'),
    'q0': ('Raise a weight with a pulley', 'Raise a 20 kg bucket to a height of 3 m pulling with 12 kg or less.', 'With a fixed pulley you pull the whole weight. Try a movable pulley.'),
    'k0': ('Into the bucket', 'Make something moving end up inside the goal bucket.', 'A ball at the top of a ramp and the bucket right where it lands. Press Test and adjust.'),
    'k1': ('A chain of three', 'Build a machine of three steps or more where each step is set off by the one before. Write what each part does.', 'For example: a marble rolls down a ramp, drops onto a seesaw and the seesaw pushes a domino.'),
    'g3': ('Four times the force', 'Make the output have at least four times the motor’s torque (turning force).', 'What you gain in force you lose in speed: a small gear driving a big one.'),
    'g4': ('Three times faster', 'The output must turn three times faster than the motor and in the same direction.', 'Now the big one drives the small one. For the direction, remember the gear in the middle.'),
    'p2': ('Like a wheelbarrow', 'Build a second-class lever: pivot at one end, load in the middle and force at the other end. 60 kg with 30 kg or less.', 'In a wheelbarrow, the wheel is the pivot and you lift the handles.'),
    'p3': ('Like tweezers', 'Third-class lever: the force goes between the pivot and the load. Move 10 kg with no more than 25 kg of force.', 'This kind needs more force than the load, but the tip moves further and faster. Your arm and tweezers work like this.'),
    'q2': ('100 kg with under 30', 'Raise 100 kg with a force under 30 kg.', 'Each pulley loses a little to friction. Look at the difference between the ideal and the real force.'),
    'r1': ('Loading ramp', 'Push a 100 kg box up to a 1 m platform with 40 kg of force or less. Friction is μ = 0.1.', 'A longer ramp is less steep and needs less force, but you push it further.'),
    'g5': ('Clock with gears', 'On a clock, the minute hand goes round 12 times while the hour hand goes round once. Build that train: 12 times slower and in the same direction.', 'One pair is not enough. Put two gears on the same axle (“in front” or “behind”): 1:3 and then 1:4.'),
    'g6': ('Sixty to one', 'From seconds to minutes: the output goes round once for every 60 turns of the motor, with no gear over 60 teeth.', '60 = 3 × 4 × 5. Three stages on shared axles.'),
    'q3': ('Little force and little rope', 'Raise 50 kg to a height of 2 m with under 20 kg of force and pulling no more than 8 m of rope.', 'More lengths of rope: less force, but more rope. Find the balance.'),
    'r2': ('An efficient ramp', 'Raise 80 kg to 1.2 m with 50 kg of force or less and an efficiency of 70% or more. Friction is μ = 0.15.', 'If the ramp is very long and gentle, friction eats more work. If it is very short, it needs too much force.'),
    'k2': ('Six steps, four parts', 'A machine of six steps or more, with at least four different kinds of part. Every moving part gets set off and each one says what it does.', 'Paddle wheels and seesaws change the direction of the movement.'),
    'p4': ('Half a tonne', 'With a 3 m plank, lift 500 kg with a force of 50 kg at most.', 'You need an advantage of 10: the force arm ten times the load arm.'),
    'q4': ('One tonne', 'Raise 1000 kg to 3 m with 250 kg of force or less (for example, four people) and 20 m of rope at most.', 'Building-site cranes use pulley blocks with many lengths of rope.'),
    'q5': ('Pulley block and efficiency', 'Raise 120 kg with 40 kg of force or less and an efficiency of 80% or more.', 'Each pulley loses 5%: more pulleys mean less force but lower efficiency.'),
    'g7': ('Surprise ratio', 'A different ratio comes up each time. Build a gear train that matches it exactly. “Another ratio” gives you a new one, endlessly.', 'Split the fraction: 5/16 is 1/2 × 5/8, or 10 teeth against 32.'),
    'k3': ('The great 10-step machine', 'Ten or more steps, with at least six kinds of part, ending in the bucket. Every moving part gets set off and each one says what it does. Then, if you like, build it for real.', 'Print the technical sheet: it works as a script for building it.'),
}

PART_ES = {'ball': 'Bola', 'domino': 'Dominó', 'ramp': 'Rampa', 'lever': 'Balancín', 'pendulum': 'Péndulo', 'wheel': 'Rueda de paletas', 'block': 'Caja', 'spring': 'Trampolín', 'bucket': 'Cubo de meta'}
PART_EN = {'ball': 'Ball', 'domino': 'Domino', 'ramp': 'Ramp', 'lever': 'Seesaw', 'pendulum': 'Pendulum', 'wheel': 'Paddle wheel', 'block': 'Box', 'spring': 'Trampoline', 'bucket': 'Goal bucket'}
PINFO_ES = {
    'ball': 'Una bola pesada que rueda y rebota un poco.', 'domino': 'Una ficha alta y estrecha: si la empujan arriba, cae sobre la siguiente.',
    'ramp': 'Una tabla fija. Con ángulo 0 es un estante. Ángulo negativo: baja hacia la derecha.', 'lever': 'Una tabla que gira sobre un apoyo fijo, hasta 40° a cada lado.',
    'pendulum': 'Una bola colgada de una varilla. Con ángulo distinto de 0 empieza a oscilar sola.', 'wheel': 'Una rueda de cuatro paletas sobre un eje fijo: si algo la golpea, gira.',
    'block': 'Una caja pesada que se desliza o se vuelca.', 'spring': 'Una superficie fija que hace rebotar lo que cae encima.', 'bucket': 'La meta: cuenta un paso cuando algo cae dentro.',
}
PINFO_EN = {
    'ball': 'A heavy ball that rolls and bounces a little.', 'domino': 'A tall, narrow tile: if it is pushed at the top, it falls onto the next one.',
    'ramp': 'A fixed plank. At angle 0 it is a shelf. A negative angle slopes down to the right.', 'lever': 'A plank that turns on a fixed pivot, up to 40° each way.',
    'pendulum': 'A ball hanging from a rod. With an angle other than 0 it starts swinging on its own.', 'wheel': 'A four-paddle wheel on a fixed axle: if something hits it, it turns.',
    'block': 'A heavy box that slides or tips over.', 'spring': 'A fixed surface that bounces back whatever falls on it.', 'bucket': 'The goal: it counts a step when something falls in.',
}
PULLEY_ES = {'fija': 'Polea fija', 'movil': 'Polea móvil', 'pol2': 'Polipasto de 2 tramos', 'pol3': 'Polipasto de 3 tramos', 'pol4': 'Polipasto de 4 tramos', 'pol6': 'Polipasto de 6 tramos'}
PULLEY_EN = {'fija': 'Fixed pulley', 'movil': 'Movable pulley', 'pol2': 'Pulley block, 2 ropes', 'pol3': 'Pulley block, 3 ropes', 'pol4': 'Pulley block, 4 ropes', 'pol6': 'Pulley block, 6 ropes'}
DIR_ES = {0: 'Derecha', 45: 'Abajo a la derecha', 90: 'Abajo', 135: 'Abajo a la izquierda', 180: 'Izquierda', 225: 'Arriba a la izquierda', 270: 'Arriba', 315: 'Arriba a la derecha'}
DIR_EN = {0: 'Right', 45: 'Down and right', 90: 'Down', 135: 'Down and left', 180: 'Left', 225: 'Up and left', 270: 'Up', 315: 'Up and right'}

HOW_ES = {
    'gears': 'Los engranajes tienen módulo 2 mm: el radio en milímetros es igual al número de dientes. Dos que engranan giran en sentidos contrarios y la velocidad cambia en proporción inversa a los dientes (v = r·ω en el punto de contacto). El par cambia al revés que la velocidad. El par real resta el rendimiento de cada engrane.',
    'lever': 'Momento = masa × gravedad × distancia al apoyo. La fuerza necesaria es el momento total de las cargas partido por la distancia de tu fuerza al apoyo. Ventaja mecánica = carga ÷ fuerza. El peso de la tabla no se cuenta.',
    'pulley': 'Fuerza ideal = (carga + 0,4 kg por polea móvil) ÷ tramos que la sostienen. Fuerza real = fuerza ideal ÷ 0,95 por cada polea. Cuerda = altura × tramos. Rendimiento = carga ÷ (fuerza real × tramos).',
    'ramp': 'Ángulo: seno = altura ÷ longitud. Fuerza ideal = masa × seno. Fuerza real = masa × (seno + μ × coseno). Rendimiento = seno ÷ (seno + μ × coseno) = trabajo útil ÷ trabajo hecho.',
    'chain': 'Planck.js mueve las piezas 60 veces por segundo con gravedad de 9,81 m/s². Una pieza cuenta como paso cuando se pone en marcha (más de 0,3 m/s); se anota la pieza que la tocaba. Las rampas y los trampolines cuentan cuando los toca algo que ya se movía; el cubo, cuando algo cae dentro.',
}
HOW_EN = {
    'gears': 'Gears have a 2 mm module: the radius in millimetres equals the number of teeth. Two meshing gears turn in opposite directions and the speed changes in inverse proportion to the teeth (v = r·ω at the contact point). Torque changes the other way round from speed. The real torque takes off the efficiency of each mesh.',
    'lever': 'Moment = mass × gravity × distance to the pivot. The force needed is the total moment of the loads divided by the distance from your force to the pivot. Mechanical advantage = load ÷ force. The weight of the plank is not counted.',
    'pulley': 'Ideal force = (load + 0.4 kg per movable pulley) ÷ lengths of rope holding it. Real force = ideal force ÷ 0.95 for each pulley. Rope = height × lengths. Efficiency = load ÷ (real force × lengths).',
    'ramp': 'Angle: sine = height ÷ length. Ideal force = mass × sine. Real force = mass × (sine + μ × cosine). Efficiency = sine ÷ (sine + μ × cosine) = useful work ÷ work done.',
    'chain': 'Planck.js moves the parts 60 times a second with gravity of 9.81 m/s². A part counts as a step when it starts moving (over 0.3 m/s); the part that was touching it is noted. Ramps and trampolines count when something already moving touches them; the bucket, when something lands inside.',
}

STRINGS = {
    'es': {
        'canvasLabel': 'Banco de trabajo de máquinas',
        'canvasHelp': 'Con el teclado: flechas para mover el cursor o lo que hayas elegido (Mayús: paso largo), Intro para actuar con la herramienta, N para pasar a la pieza siguiente, R para girar una pieza de la máquina en cadena y T para probar. Todo lo que hay en el lienzo está también en la lista Estructura.',
        'kmEnter': 'Intro o Espacio: elegir lo que hay en el cursor o añadir una pieza, según la herramienta',
        'kmTest': 'T: probar (con movimiento reducido, un paso) · Esc: parar',
        'kmNext': 'N: elegir la pieza siguiente (Mayús + N: la anterior). Con algo elegido, las flechas lo mueven o cambian su valor',
        'kmRotate': 'R: girar 5° la pieza elegida de la máquina en cadena (Mayús + R: al otro lado)',
        'stSeesaw': 'Palanca y balancín', 'stSeesawD': 'Dos cargas en un balancín. Muévelas hasta que quede recto.',
        'stPulley1': 'Subir un peso con una polea', 'stPulley1D': 'Un cubo de 20 kg y una polea fija. ¿Qué polea te ahorra fuerza?',
        'stClock': 'Reloj con engranajes', 'stClockD': 'La aguja de los minutos mueve un engranaje de 60 dientes. Completa el tren 1:12 para la de las horas.',
        'stRamp': 'Rampa de carga', 'stRampD': 'Una caja de 100 kg y una rampa demasiado corta. Ajusta su longitud.',
        'stHoist': 'Polipasto y rendimiento', 'stHoistD': 'Subir 120 kg con poca fuerza sin perder demasiado por el rozamiento.',
        'stStone': 'Levantar una piedra', 'stStoneD': 'Una palanca de 3 m y una piedra de 60 kg. Busca dónde poner el apoyo.',
        'stChain': 'Máquina en cadena', 'stChainD': 'Una bola, dominós y una rueda que acaban en el cubo. Pulsa Probar y amplíala hasta 10 pasos.',
        'stTrain': 'Tren de engranajes compuesto', 'stTrainD': 'Cuatro engranajes en dos capas. Llega a una relación de 60 a 1.',
        'mode_gears': 'Engranajes', 'mode_lever': 'Palanca', 'mode_pulley': 'Poleas', 'mode_ramp': 'Rampa', 'mode_chain': 'Máquina en cadena',
        'assemblies': 'Montajes', 'piecesOf': 'Piezas ({n})', 'stepsCounted': 'Pasos contados ({n})',
        'turnEvery': 'una vuelta cada {s} s', 'cw': 'sentido horario', 'ccw': 'sentido antihorario',
        'motorShort': 'M', 'outShort': 'S', 'loadShort': 'C{n}', 'ropePulled': 'cuerda recogida: {m} m', 'ropes1': 'Un tramo sostiene la carga', 'ropesN': '{n} tramos sostienen la carga',
        'rampBase': 'base: {m}', 'rampLen': 'rampa de {m} a {a}°', 'startTag': 'empieza aquí',
        'slowMo': 'Cámara lenta ×{f}', 'fastFwd': 'Acelerado ×{f}', 'playing': 'En marcha', 'stopped': 'Parado.', 'testDone': 'Prueba terminada.',
        'chDone': 'Reto cumplido', 'chNotYet': 'Todavía no: mira la lista.', 'chProgress': 'Reto: {a} de {b}',
        'stepGears': 'El motor avanza un octavo de vuelta.', 'stepN': 'Avance: {p} %', 'stepStart': 'Paso {n}: {p} empieza a moverse.', 'stepGoal': 'Paso {n}: {by} cae en {p}.',
        'stepBy': 'Paso {n}: {by} pone en marcha {p}.', 'stepTouch': 'Paso {n}: {by} llega a {p}.', 'stepSelf': 'Paso {n}: {p} se mueve sola, sin que nada la toque.',
        'noMoving': 'Pon al menos una pieza que se mueva (bola, dominó, caja, balancín, péndulo o rueda).', 'simulating': 'Calculando la física…',
        'simDone': 'Prueba lista: {n} pasos en {s} s.', 'goalReached': 'Algo ha llegado al cubo.', 'physicsError': 'No se ha podido cargar el motor físico. Recarga la página.',
        'stop': 'Parar', 'test': 'Probar', 'stepBtn': 'Avanzar un paso', 'play': 'Reproducir', 'prevStep': 'Paso anterior', 'nextStep': 'Paso siguiente', 'rewind': 'Al principio', 'rewound': 'De vuelta al principio.',
        'testTitle': 'Prueba', 'timeSec': 'Tiempo', 'timeline': 'Momento de la prueba', 'chainNotRun': 'Pulsa Probar: la física calcula el movimiento y cuenta los pasos.',
        'reducedNote': 'Tienes activado el movimiento reducido: Probar avanza paso a paso y no hay animación continua.',
        'challenge': 'Reto', 'chooseChallenge': 'Elegir reto', 'freeMode': 'Sin reto (modo libre)', 'freeModeText': 'Usa el banco como quieras. Puedes elegir un reto en cualquier momento; no se borra lo que has hecho.',
        'levelN': 'Nivel {n}', 'lvl1': 'Primeros mecanismos', 'lvl2': 'Fuerza y sentido', 'lvl3': 'Trenes compuestos', 'lvl4': 'Cargas grandes', 'lvl5': 'Sin techo',
        'chPicked': 'Reto elegido: {t}', 'randomGoal': 'Objetivo: relación {p}:{q}, {d}.', 'sameDir': 'en el mismo sentido que el motor', 'oppDir': 'en sentido contrario al motor',
        'anotherRatio': 'Otra relación', 'newRatio': 'Nueva relación', 'goToMode': 'Ir a {m}', 'tip': 'Pista', 'okWord': 'hecho', 'pendingWord': 'pendiente',
        'chkFree': 'Sin bloqueos ni choques', 'chkOut': 'Hay un engranaje de salida que gira', 'chkRatio': 'Relación {p}:{q} (ahora {g})', 'chkSameDir': 'Salida en el mismo sentido que el motor',
        'chkOppDir': 'Salida en sentido contrario al motor', 'chkTorque': 'Par ×{m} o más (ahora ×{g})', 'chkMaxTeeth': 'Ningún engranaje de más de {m} dientes',
        'chkTwoLoads': 'Dos cargas o más en el balancín', 'chkBalance': 'El balancín queda recto (momento sobrante: {m} kg·m)', 'chkLoad': 'Carga de {m} kg o más', 'chkMaxL': 'Tabla de {m} m como mucho',
        'chkEffort': 'Fuerza de {m} kg o menos (ahora {g} kg)', 'chkKind': 'Palanca de tipo {k} con una sola carga', 'chkHeight': 'Subir {m} m o más', 'chkRope': 'Cuerda de {m} m o menos (ahora {g} m)',
        'chkEff': 'Rendimiento del {m} % o más (ahora {g} %)', 'chkMu': 'Rozamiento del reto: μ = {m} o más', 'chkRun': 'La prueba está hecha con la máquina tal como está',
        'chkSteps': 'Al menos {m} pasos (ahora {n})', 'chkFit': 'La cadena no se corta: cada pieza la pone en marcha otra y se usan todas ({b} sueltas)', 'chkKinds': 'Al menos {m} tipos de pieza en los pasos (ahora {n})',
        'chkTexts': 'Cada pieza que cuenta dice qué hace', 'chkGoal': 'Algo cae dentro del cubo de meta',
        'motor': 'motor', 'output': 'salida', 'loose': 'suelto, no gira', 'gearN': 'Engranaje {n} ({z} dientes)', 'fulcrum': 'Apoyo', 'plank': 'Tabla', 'loadN': 'Carga {n}', 'effort': 'Fuerza',
        'pulleySet': 'Poleas', 'load': 'Carga', 'rampPiece': 'Rampa', 'box': 'Caja',
        'warning': 'Aviso', 'jam': 'Bloqueado: hay engranajes que tendrían que girar a dos velocidades a la vez.', 'collide': 'Hay {n} choques: engranajes que se pisan sin engranar (línea roja discontinua).',
        'speed': 'Velocidad', 'direction': 'Sentido', 'torqueIdeal': 'Par (veces el del motor)', 'torqueReal': 'Par real', 'meshesFromMotor': 'Engranes desde el motor',
        'teeth': 'Dientes', 'teethN': '{n} dientes', 'layer': 'Capa (1 detrás, 4 delante)', 'occupied': 'Ese eje ya tiene un engranaje en esa capa.', 'layerSet': 'Capa {n}',
        'posX': 'Posición x (horizontal)', 'posY': 'Posición y (vertical)', 'gearMoved': 'Engranaje movido.', 'makeMotor': 'Es el motor', 'makeOut': 'Es la salida',
        'motorSet': 'El engranaje {n} es el motor.', 'motorNotOut': 'El motor no puede ser también la salida.', 'outSet': 'El engranaje {n} es la salida.', 'outCleared': 'Sin salida marcada.',
        'newTeeth': 'Dientes del nuevo', 'direction2': 'Hacia dónde', 'addFromHere': 'Añadir a partir de este', 'addMeshed': 'Engranado al lado', 'addFront': 'Mismo eje, delante', 'addBack': 'Mismo eje, detrás',
        'deleteGear': 'Quitar engranaje', 'motorLine': 'Motor (engranaje {n})', 'outLine': 'Salida (engranaje {n})', 'ratio': 'Relación de transmisión', 'efficiency': 'Rendimiento',
        'noOut': 'Elige un engranaje y pulsa «Es la salida» para ver la relación.', 'looseLine': 'Sueltos, sin girar', 'rpm': 'Velocidad del motor', 'rpmSet': 'Motor cambiado.', 'motorDir': 'Sentido del motor',
        'motorTorque': 'Par del motor', 'torqueSet': 'Par del motor cambiado.', 'meshEff': 'Rendimiento de cada engrane', 'effSet': 'Rendimiento cambiado.', 'showHands': 'Mostrar agujas de reloj (motor: minutos; salida: horas)',
        'gearsHelp': 'Todos los dientes miden lo mismo (módulo 2 mm). Añade con la herramienta Engranaje: si lo sueltas cerca de otro, engrana solo; si lo sueltas en su centro, va en el mismo eje, delante.',
        'gearTableCap': 'Engranajes: velocidad, sentido y par', 'thN': 'N.º', 'thTeeth': 'Dientes', 'thLayer': 'Capa', 'thRpm': 'rpm', 'thDir': 'Sentido', 'thTorque': 'Par ×',
        'teethSet': 'Ahora tiene {n} dientes.', 'layerLimit': 'Solo hay cuatro capas: no cabe más delante o detrás.', 'tooMany': 'Has llegado al máximo de piezas.',
        'gearAdded': 'Engranaje {n} añadido, con {z} dientes.', 'meshesWith': 'Engrana con el {n}.', 'axleWith': 'En el mismo eje que el {n}.', 'gearAt': 'Engranaje en {x}, {y} mm',
        'effortOnFulcrum': 'Estás empujando justo en el punto de apoyo: así no se mueve.', 'netMoment': 'Momento de las cargas', 'turnsRight': 'baja la derecha', 'turnsLeft': 'baja la izquierda',
        'effortNeeded': 'Fuerza necesaria', 'pushUp': 'hacia arriba', 'pushDown': 'hacia abajo', 'mechAdv': 'Ventaja mecánica', 'leverKind': 'Tipo de palanca',
        'kind_1': 'Primer tipo: el apoyo está entre la carga y la fuerza (como un balancín).', 'kind_2': 'Segundo tipo: la carga está entre el apoyo y la fuerza (como una carretilla).', 'kind_3': 'Tercer tipo: la fuerza está entre el apoyo y la carga (como unas pinzas).',
        'seesawState': 'Balancín', 'balanced': 'Queda recto: está en equilibrio.', 'downRight': 'Baja por la derecha.', 'downLeft': 'Baja por la izquierda.',
        'armLength': 'Distancia al apoyo', 'moment': 'Momento', 'mass': 'Masa', 'posFromLeft': 'Distancia desde el extremo izquierdo', 'loadSet': 'Carga: {m} kg', 'moved2': 'Movido.', 'deleteLoad': 'Quitar carga',
        'plankLen': 'Longitud de la tabla', 'plankSet': 'Tabla de {m}', 'effortOn': 'Empujar o tirar con la mano (sin esto es un balancín)', 'effortOnDone': 'Ahora empujas con la mano.', 'effortOffDone': 'Ahora es un balancín.',
        'addLoad': 'Añadir carga', 'loadAdded': 'Carga añadida.', 'leverHelp': 'Las posiciones se miden desde el extremo izquierdo de la tabla. Elige el apoyo, una carga o la fuerza y muévelos con las flechas o con el campo de posición.',
        'effortReal': 'Fuerza real', 'effortIdeal': 'Fuerza ideal (sin rozamiento)', 'ropesHold': 'Tramos que sostienen la carga', 'ideal': 'ideal', 'ropeToPull': 'Cuerda de la que tiras', 'work': 'Trabajo para subir la carga',
        'pulleyKind': 'Montaje de poleas', 'height': 'Altura a subir', 'heightSet': 'Altura cambiada', 'pulleyHelp': 'Cada polea móvil pesa 0,4 kg y cada polea pierde un 5 % por rozamiento. Las poleas no reducen el trabajo: reparten el esfuerzo en más cuerda.',
        'angle': 'Ángulo', 'workUse': 'Trabajo útil (subir la caja)', 'workDone': 'Trabajo que haces', 'surface': 'Superficies (rozamiento aproximado)',
        'mu_0': 'Sin rozamiento (ideal)', 'mu_oil': 'Metal engrasado (≈ 0,03)', 'mu_010': 'Caja con patines (≈ 0,1)', 'mu_015': 'Plástico liso (≈ 0,15)', 'mu_wood': 'Madera sobre madera (≈ 0,3)', 'mu_rubber': 'Goma sobre cemento (≈ 0,7)',
        'muField': 'Coeficiente de rozamiento μ', 'muSet': 'Rozamiento cambiado.', 'rampLength': 'Longitud de la rampa', 'rampHeight': 'Altura de la plataforma', 'rampSet': 'Rampa cambiada.',
        'rampHelp': 'Elige la rampa para cambiar su longitud y su altura (flechas: izquierda y derecha, longitud; arriba y abajo, altura). Los valores de μ son aproximados: dependen de cada superficie.',
        'partInfo_ball': PINFO_ES['ball'], 'partInfo_domino': PINFO_ES['domino'], 'partInfo_ramp': PINFO_ES['ramp'], 'partInfo_lever': PINFO_ES['lever'], 'partInfo_pendulum': PINFO_ES['pendulum'],
        'partInfo_wheel': PINFO_ES['wheel'], 'partInfo_block': PINFO_ES['block'], 'partInfo_spring': PINFO_ES['spring'], 'partInfo_bucket': PINFO_ES['bucket'],
        'radius': 'Radio', 'heightF': 'Alto', 'width': 'Ancho', 'length': 'Longitud', 'angleF': 'Ángulo', 'pivotAt': 'Apoyo (0 = extremo izquierdo, 1 = derecho)', 'angleStart': 'Ángulo inicial',
        'partChanged': 'Pieza cambiada.', 'whatItDoes': 'Qué hace esta pieza', 'noteSet': 'Texto guardado.', 'makeStart': 'Empieza aquí', 'startSet': 'Empieza: {p}', 'settle': 'Apoyar sobre lo de debajo', 'settled': 'Apoyada.',
        'duplicate': 'Duplicar', 'duplicated': 'Pieza duplicada.', 'deletePart': 'Quitar pieza', 'notActivated': 'En la última prueba no se movió.', 'notTouched': 'En la última prueba nada la tocó.',
        'startPiece': 'Pieza que empieza', 'kick': 'Empujón inicial (negativo: hacia la izquierda)', 'kickSet': 'Empujón cambiado.',
        'stepsCountedL': 'Pasos contados', 'kindsL': 'Tipos de pieza en los pasos', 'goalL': 'Llega al cubo', 'durationL': 'Duración', 'yes': 'sí', 'no': 'no',
        'selfMoved': 'Se mueven solas, sin que nada las ponga en marcha: {l}. Revisa que estén bien apoyadas.', 'unusedParts': 'No se han movido: {l}.', 'runOutdated': 'Has cambiado la máquina: pulsa Probar otra vez para contar los pasos.',
        'chainHelp': 'Añade piezas con la herramienta Pieza: caen sobre lo que tienen debajo. La primera pieza que se mueve recibe el empujón inicial. Elige una pieza para escribir qué hace: sale en la ficha técnica.',
        'stepTableCap': 'Pasos de la última prueba', 'thStep': 'Paso', 'thPiece': 'Pieza', 'thBy': 'Qué la mueve', 'thTime': 'Segundo', 'byYou': 'tu empujón', 'byItself': 'nada: se mueve sola',
        'deleted': 'Quitado: {name}', 'partAdded': '{p} añadida.', 'partAt': '{p} en {x}, {y} m', 'rotated': 'Ángulo: {a}°', 'cursorAt': 'Cursor en {x}, {y} {u}', 'nothingHere': 'No hay nada ahí.',
        'toolSelect': 'Elegir', 'toolGear': 'Engranaje', 'toolPiece': 'Pieza', 'toolLoad': 'Carga', 'toolErase': 'Borrar', 'toolPan': 'Mover la vista', 'pieceKind': 'Pieza',
        'helpSelect': 'Toca una pieza para elegirla; arrástrala para moverla.', 'helpGear': 'Toca el banco para poner un engranaje.', 'helpPiece': 'Toca el banco para poner la pieza elegida.', 'helpLoad': 'Toca la tabla para poner otra carga.',
        'helpTest': 'Pone la máquina en marcha o avanza un paso.',
        'part_ball': PART_ES['ball'], 'part_domino': PART_ES['domino'], 'part_ramp': PART_ES['ramp'], 'part_lever': PART_ES['lever'], 'part_pendulum': PART_ES['pendulum'],
        'part_wheel': PART_ES['wheel'], 'part_block': PART_ES['block'], 'part_spring': PART_ES['spring'], 'part_bucket': PART_ES['bucket'],
        'altGear': 'Engranaje {n}: {z} dientes, capa {l}, {s}.', 'altLever': 'Tabla de {L} con el apoyo a {f}. Cargas: {loads}.', 'atM': 'a {m}', 'altEffort': 'Hace falta una fuerza de {e} a {p}.',
        'altPulley': '{k} con {l} kg: hay que tirar con {e}; {n} tramos de cuerda; {r} de cuerda.', 'altRamp': 'Rampa de {L} que sube {H} ({a}°) con una caja de {l} kg: hay que empujar con {e}.',
        'altChain': '{n} piezas: {l}.', 'chainEmpty': 'La máquina en cadena está vacía.',
        'exportPng': 'Imagen del montaje (PNG)', 'exportSvg': 'Dibujo del montaje (SVG)', 'exportSheet': 'Ficha técnica (imprimir o PDF)', 'exportError': 'No se ha podido crear la imagen.',
        'sheetTitle': 'Ficha técnica', 'sheetData': 'Datos', 'madeIn': 'Hecho en El taller de Iris Green · irisgreen.eu', 'howCalc': 'Cómo calcula',
        'modelNote': 'Es un modelo para aprender: no sustituye al cálculo de una máquina real ni a las normas de seguridad para levantar cargas.',
        'how_gears': HOW_ES['gears'], 'how_lever': HOW_ES['lever'], 'how_pulley': HOW_ES['pulley'], 'how_ramp': HOW_ES['ramp'], 'how_chain': HOW_ES['chain'],
        'ex_ramp1': 'La bola baja rodando', 'ex_ball1': 'Empieza la cadena', 'ex_shelf': 'Estante de los dominós', 'ex_domino1': 'La bola lo empuja', 'ex_domino': 'Cae sobre el siguiente',
        'ex_ball2': 'El último dominó la empuja fuera del estante', 'ex_ramp2': 'La bola baja hacia la izquierda', 'ex_wheel': 'La bola la hace girar al pasar', 'ex_shelf2': 'La bola rueda hasta el borde', 'ex_bucket': 'La meta',
    },
    'en': {
        'canvasLabel': 'Machine workbench',
        'canvasHelp': 'With a keyboard: arrow keys move the cursor or whatever you have chosen (Shift: bigger step), Enter acts with the tool, N moves to the next part, R turns a chain-machine part and T tests. Everything on the canvas is also in the Structure list.',
        'kmEnter': 'Enter or Space: choose what is under the cursor or add a part, depending on the tool',
        'kmTest': 'T: test (with reduced motion, one step) · Esc: stop',
        'kmNext': 'N: choose the next part (Shift + N: the previous one). With something chosen, the arrow keys move it or change its value',
        'kmRotate': 'R: turn the chosen chain-machine part by 5° (Shift + R: the other way)',
        'stSeesaw': 'Lever and seesaw', 'stSeesawD': 'Two loads on a seesaw. Move them until it is level.',
        'stPulley1': 'Raise a weight with a pulley', 'stPulley1D': 'A 20 kg bucket and a fixed pulley. Which pulley saves you force?',
        'stClock': 'Clock with gears', 'stClockD': 'The minute hand drives a 60-tooth gear. Complete the 1:12 train for the hour hand.',
        'stRamp': 'Loading ramp', 'stRampD': 'A 100 kg box and a ramp that is too short. Adjust its length.',
        'stHoist': 'Pulley block and efficiency', 'stHoistD': 'Raise 120 kg with little force without losing too much to friction.',
        'stStone': 'Lift a rock', 'stStoneD': 'A 3 m lever and a 60 kg rock. Find where to put the pivot.',
        'stChain': 'Chain-reaction machine', 'stChainD': 'A ball, dominoes and a wheel that end in the bucket. Press Test and extend it to 10 steps.',
        'stTrain': 'Compound gear train', 'stTrainD': 'Four gears on two layers. Reach a ratio of 60 to 1.',
        'mode_gears': 'Gears', 'mode_lever': 'Lever', 'mode_pulley': 'Pulleys', 'mode_ramp': 'Ramp', 'mode_chain': 'Chain machine',
        'assemblies': 'Assemblies', 'piecesOf': 'Parts ({n})', 'stepsCounted': 'Steps counted ({n})',
        'turnEvery': 'one turn every {s} s', 'cw': 'clockwise', 'ccw': 'anticlockwise',
        'motorShort': 'M', 'outShort': 'OUT', 'loadShort': 'L{n}', 'ropePulled': 'rope pulled: {m} m', 'ropes1': 'One length of rope holds the load', 'ropesN': '{n} lengths of rope hold the load',
        'rampBase': 'base: {m}', 'rampLen': '{m} ramp at {a}°', 'startTag': 'starts here',
        'slowMo': 'Slow motion ×{f}', 'fastFwd': 'Speeded up ×{f}', 'playing': 'Running', 'stopped': 'Stopped.', 'testDone': 'Test finished.',
        'chDone': 'Challenge complete', 'chNotYet': 'Not yet: check the list.', 'chProgress': 'Challenge: {a} of {b}',
        'stepGears': 'The motor moves on an eighth of a turn.', 'stepN': 'Progress: {p}%', 'stepStart': 'Step {n}: {p} starts moving.', 'stepGoal': 'Step {n}: {by} lands in {p}.',
        'stepBy': 'Step {n}: {by} sets off {p}.', 'stepTouch': 'Step {n}: {by} reaches {p}.', 'stepSelf': 'Step {n}: {p} moves on its own, with nothing touching it.',
        'noMoving': 'Add at least one part that moves (ball, domino, box, seesaw, pendulum or wheel).', 'simulating': 'Working out the physics…',
        'simDone': 'Test ready: {n} steps in {s} s.', 'goalReached': 'Something has reached the bucket.', 'physicsError': 'The physics engine could not be loaded. Reload the page.',
        'stop': 'Stop', 'test': 'Test', 'stepBtn': 'One step on', 'play': 'Play', 'prevStep': 'Previous step', 'nextStep': 'Next step', 'rewind': 'Back to the start', 'rewound': 'Back to the start.',
        'testTitle': 'Test', 'timeSec': 'Time', 'timeline': 'Moment in the test', 'chainNotRun': 'Press Test: the physics works out the movement and counts the steps.',
        'reducedNote': 'You have reduced motion switched on: Test moves one step at a time and there is no continuous animation.',
        'challenge': 'Challenge', 'chooseChallenge': 'Choose a challenge', 'freeMode': 'No challenge (free mode)', 'freeModeText': 'Use the workbench however you like. You can pick a challenge at any time; your work is not cleared.',
        'levelN': 'Level {n}', 'lvl1': 'First mechanisms', 'lvl2': 'Force and direction', 'lvl3': 'Compound trains', 'lvl4': 'Heavy loads', 'lvl5': 'No ceiling',
        'chPicked': 'Challenge chosen: {t}', 'randomGoal': 'Goal: ratio {p}:{q}, {d}.', 'sameDir': 'in the same direction as the motor', 'oppDir': 'in the opposite direction to the motor',
        'anotherRatio': 'Another ratio', 'newRatio': 'New ratio', 'goToMode': 'Go to {m}', 'tip': 'Hint', 'okWord': 'done', 'pendingWord': 'to do',
        'chkFree': 'No jams or clashes', 'chkOut': 'There is an output gear that turns', 'chkRatio': 'Ratio {p}:{q} (now {g})', 'chkSameDir': 'Output in the same direction as the motor',
        'chkOppDir': 'Output in the opposite direction to the motor', 'chkTorque': 'Torque ×{m} or more (now ×{g})', 'chkMaxTeeth': 'No gear over {m} teeth',
        'chkTwoLoads': 'Two or more loads on the seesaw', 'chkBalance': 'The seesaw stays level (moment left over: {m} kg·m)', 'chkLoad': 'Load of {m} kg or more', 'chkMaxL': 'Plank of {m} m at most',
        'chkEffort': 'Force of {m} kg or less (now {g} kg)', 'chkKind': 'Class {k} lever with a single load', 'chkHeight': 'Raise it {m} m or more', 'chkRope': 'Rope of {m} m or less (now {g} m)',
        'chkEff': 'Efficiency of {m}% or more (now {g}%)', 'chkMu': 'The challenge’s friction: μ = {m} or more', 'chkRun': 'The test has been run with the machine as it is now',
        'chkSteps': 'At least {m} steps (now {n})', 'chkFit': 'The chain does not break: each part is set off by another and all are used ({b} loose)', 'chkKinds': 'At least {m} kinds of part in the steps (now {n})',
        'chkTexts': 'Each part that counts says what it does', 'chkGoal': 'Something lands inside the goal bucket',
        'motor': 'motor', 'output': 'output', 'loose': 'loose, not turning', 'gearN': 'Gear {n} ({z} teeth)', 'fulcrum': 'Pivot', 'plank': 'Plank', 'loadN': 'Load {n}', 'effort': 'Force',
        'pulleySet': 'Pulleys', 'load': 'Load', 'rampPiece': 'Ramp', 'box': 'Box',
        'warning': 'Warning', 'jam': 'Jammed: some gears would have to turn at two speeds at once.', 'collide': 'There are {n} clashes: gears that overlap without meshing (dashed red line).',
        'speed': 'Speed', 'direction': 'Direction', 'torqueIdeal': 'Torque (times the motor’s)', 'torqueReal': 'Real torque', 'meshesFromMotor': 'Meshes from the motor',
        'teeth': 'Teeth', 'teethN': '{n} teeth', 'layer': 'Layer (1 at the back, 4 at the front)', 'occupied': 'That axle already has a gear on that layer.', 'layerSet': 'Layer {n}',
        'posX': 'Position x (horizontal)', 'posY': 'Position y (vertical)', 'gearMoved': 'Gear moved.', 'makeMotor': 'It is the motor', 'makeOut': 'It is the output',
        'motorSet': 'Gear {n} is the motor.', 'motorNotOut': 'The motor cannot also be the output.', 'outSet': 'Gear {n} is the output.', 'outCleared': 'No output marked.',
        'newTeeth': 'Teeth of the new one', 'direction2': 'Which way', 'addFromHere': 'Add from this one', 'addMeshed': 'Meshed beside it', 'addFront': 'Same axle, in front', 'addBack': 'Same axle, behind',
        'deleteGear': 'Remove gear', 'motorLine': 'Motor (gear {n})', 'outLine': 'Output (gear {n})', 'ratio': 'Gear ratio', 'efficiency': 'Efficiency',
        'noOut': 'Choose a gear and press “It is the output” to see the ratio.', 'looseLine': 'Loose, not turning', 'rpm': 'Motor speed', 'rpmSet': 'Motor changed.', 'motorDir': 'Motor direction',
        'motorTorque': 'Motor torque', 'torqueSet': 'Motor torque changed.', 'meshEff': 'Efficiency of each mesh', 'effSet': 'Efficiency changed.', 'showHands': 'Show clock hands (motor: minutes; output: hours)',
        'gearsHelp': 'All teeth are the same size (2 mm module). Add with the Gear tool: if you drop it near another one, it meshes by itself; if you drop it on its centre, it goes on the same axle, in front.',
        'gearTableCap': 'Gears: speed, direction and torque', 'thN': 'No.', 'thTeeth': 'Teeth', 'thLayer': 'Layer', 'thRpm': 'rpm', 'thDir': 'Direction', 'thTorque': 'Torque ×',
        'teethSet': 'It now has {n} teeth.', 'layerLimit': 'There are only four layers: nothing more fits in front or behind.', 'tooMany': 'You have reached the maximum number of parts.',
        'gearAdded': 'Gear {n} added, with {z} teeth.', 'meshesWith': 'It meshes with gear {n}.', 'axleWith': 'On the same axle as gear {n}.', 'gearAt': 'Gear at {x}, {y} mm',
        'effortOnFulcrum': 'You are pushing right on the pivot: that way nothing moves.', 'netMoment': 'Moment of the loads', 'turnsRight': 'the right side goes down', 'turnsLeft': 'the left side goes down',
        'effortNeeded': 'Force needed', 'pushUp': 'upwards', 'pushDown': 'downwards', 'mechAdv': 'Mechanical advantage', 'leverKind': 'Kind of lever',
        'kind_1': 'First class: the pivot is between the load and the force (like a seesaw).', 'kind_2': 'Second class: the load is between the pivot and the force (like a wheelbarrow).', 'kind_3': 'Third class: the force is between the pivot and the load (like tweezers).',
        'seesawState': 'Seesaw', 'balanced': 'It stays level: it is balanced.', 'downRight': 'It goes down on the right.', 'downLeft': 'It goes down on the left.',
        'armLength': 'Distance to the pivot', 'moment': 'Moment', 'mass': 'Mass', 'posFromLeft': 'Distance from the left end', 'loadSet': 'Load: {m} kg', 'moved2': 'Moved.', 'deleteLoad': 'Remove load',
        'plankLen': 'Plank length', 'plankSet': 'Plank of {m}', 'effortOn': 'Push or pull by hand (without this it is a seesaw)', 'effortOnDone': 'Now you push by hand.', 'effortOffDone': 'Now it is a seesaw.',
        'addLoad': 'Add load', 'loadAdded': 'Load added.', 'leverHelp': 'Positions are measured from the left end of the plank. Choose the pivot, a load or the force and move them with the arrow keys or the position field.',
        'effortReal': 'Real force', 'effortIdeal': 'Ideal force (no friction)', 'ropesHold': 'Lengths of rope holding the load', 'ideal': 'ideal', 'ropeToPull': 'Rope you pull', 'work': 'Work to raise the load',
        'pulleyKind': 'Pulley set-up', 'height': 'Height to raise', 'heightSet': 'Height changed', 'pulleyHelp': 'Each movable pulley weighs 0.4 kg and each pulley loses 5% to friction. Pulleys do not reduce the work: they spread the effort over more rope.',
        'angle': 'Angle', 'workUse': 'Useful work (raising the box)', 'workDone': 'Work you do', 'surface': 'Surfaces (approximate friction)',
        'mu_0': 'No friction (ideal)', 'mu_oil': 'Oiled metal (≈ 0.03)', 'mu_010': 'Box on skids (≈ 0.1)', 'mu_015': 'Smooth plastic (≈ 0.15)', 'mu_wood': 'Wood on wood (≈ 0.3)', 'mu_rubber': 'Rubber on concrete (≈ 0.7)',
        'muField': 'Friction coefficient μ', 'muSet': 'Friction changed.', 'rampLength': 'Ramp length', 'rampHeight': 'Platform height', 'rampSet': 'Ramp changed.',
        'rampHelp': 'Choose the ramp to change its length and height (arrow keys: left and right, length; up and down, height). The μ values are approximate: they depend on each surface.',
        'partInfo_ball': PINFO_EN['ball'], 'partInfo_domino': PINFO_EN['domino'], 'partInfo_ramp': PINFO_EN['ramp'], 'partInfo_lever': PINFO_EN['lever'], 'partInfo_pendulum': PINFO_EN['pendulum'],
        'partInfo_wheel': PINFO_EN['wheel'], 'partInfo_block': PINFO_EN['block'], 'partInfo_spring': PINFO_EN['spring'], 'partInfo_bucket': PINFO_EN['bucket'],
        'radius': 'Radius', 'heightF': 'Height', 'width': 'Width', 'length': 'Length', 'angleF': 'Angle', 'pivotAt': 'Pivot (0 = left end, 1 = right end)', 'angleStart': 'Starting angle',
        'partChanged': 'Part changed.', 'whatItDoes': 'What this part does', 'noteSet': 'Text saved.', 'makeStart': 'Starts here', 'startSet': 'Starts: {p}', 'settle': 'Rest it on what is below', 'settled': 'Resting.',
        'duplicate': 'Duplicate', 'duplicated': 'Part duplicated.', 'deletePart': 'Remove part', 'notActivated': 'In the last test it did not move.', 'notTouched': 'In the last test nothing touched it.',
        'startPiece': 'Part that starts', 'kick': 'Starting push (negative: to the left)', 'kickSet': 'Push changed.',
        'stepsCountedL': 'Steps counted', 'kindsL': 'Kinds of part in the steps', 'goalL': 'Reaches the bucket', 'durationL': 'Duration', 'yes': 'yes', 'no': 'no',
        'selfMoved': 'These move on their own, with nothing setting them off: {l}. Check that they are resting properly.', 'unusedParts': 'These did not move: {l}.', 'runOutdated': 'You have changed the machine: press Test again to count the steps.',
        'chainHelp': 'Add parts with the Part tool: they drop onto whatever is below them. The first part that moves gets the starting push. Choose a part to write what it does: it appears on the technical sheet.',
        'stepTableCap': 'Steps in the last test', 'thStep': 'Step', 'thPiece': 'Part', 'thBy': 'Set off by', 'thTime': 'Second', 'byYou': 'your push', 'byItself': 'nothing: it moves on its own',
        'deleted': 'Removed: {name}', 'partAdded': '{p} added.', 'partAt': '{p} at {x}, {y} m', 'rotated': 'Angle: {a}°', 'cursorAt': 'Cursor at {x}, {y} {u}', 'nothingHere': 'There is nothing there.',
        'toolSelect': 'Select', 'toolGear': 'Gear', 'toolPiece': 'Part', 'toolLoad': 'Load', 'toolErase': 'Erase', 'toolPan': 'Move the view', 'pieceKind': 'Part',
        'helpSelect': 'Tap a part to choose it; drag it to move it.', 'helpGear': 'Tap the workbench to place a gear.', 'helpPiece': 'Tap the workbench to place the chosen part.', 'helpLoad': 'Tap the plank to add another load.',
        'helpTest': 'Starts the machine or moves one step on.',
        'part_ball': PART_EN['ball'], 'part_domino': PART_EN['domino'], 'part_ramp': PART_EN['ramp'], 'part_lever': PART_EN['lever'], 'part_pendulum': PART_EN['pendulum'],
        'part_wheel': PART_EN['wheel'], 'part_block': PART_EN['block'], 'part_spring': PART_EN['spring'], 'part_bucket': PART_EN['bucket'],
        'altGear': 'Gear {n}: {z} teeth, layer {l}, {s}.', 'altLever': 'A {L} plank with the pivot at {f}. Loads: {loads}.', 'atM': 'at {m}', 'altEffort': 'It needs a force of {e} at {p}.',
        'altPulley': '{k} with {l} kg: you pull with {e}; {n} lengths of rope; {r} of rope.', 'altRamp': 'A {L} ramp rising {H} ({a}°) with a {l} kg box: you push with {e}.',
        'altChain': '{n} parts: {l}.', 'chainEmpty': 'The chain machine is empty.',
        'exportPng': 'Image of the assembly (PNG)', 'exportSvg': 'Drawing of the assembly (SVG)', 'exportSheet': 'Technical sheet (print or PDF)', 'exportError': 'The image could not be created.',
        'sheetTitle': 'Technical sheet', 'sheetData': 'Data', 'madeIn': 'Made in the Iris Green workshop · irisgreen.eu', 'howCalc': 'How it calculates',
        'modelNote': 'It is a model for learning: it does not replace the calculation of a real machine or the safety rules for lifting loads.',
        'how_gears': HOW_EN['gears'], 'how_lever': HOW_EN['lever'], 'how_pulley': HOW_EN['pulley'], 'how_ramp': HOW_EN['ramp'], 'how_chain': HOW_EN['chain'],
        'ex_ramp1': 'The ball rolls down', 'ex_ball1': 'Starts the chain', 'ex_shelf': 'Shelf for the dominoes', 'ex_domino1': 'The ball pushes it', 'ex_domino': 'Falls onto the next one',
        'ex_ball2': 'The last domino pushes it off the shelf', 'ex_ramp2': 'The ball rolls down to the left', 'ex_wheel': 'The ball spins it as it goes past', 'ex_shelf2': 'The ball rolls to the edge', 'ex_bucket': 'The goal',
    },
}

for _lang, _ch in (('es', CH_ES), ('en', CH_EN)):
    for _id, (_t, _g, _tip) in _ch.items():
        STRINGS[_lang]['ch_' + _id] = _t
        STRINGS[_lang]['chg_' + _id] = _g
        STRINGS[_lang]['cht_' + _id] = _tip
    for _k, _v in (PULLEY_ES if _lang == 'es' else PULLEY_EN).items():
        STRINGS[_lang]['pulley_' + _k] = _v
    for _k, _v in (DIR_ES if _lang == 'es' else DIR_EN).items():
        STRINGS[_lang]['dir_' + str(_k)] = _v

assert set(CH_ES) == set(CH_EN)
assert set(STRINGS['es']) == set(STRINGS['en']), set(STRINGS['es']) ^ set(STRINGS['en'])
assert set(PAGE['es']) == set(PAGE['en'])
