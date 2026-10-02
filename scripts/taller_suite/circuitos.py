"""Estudio de circuitos (R43): editor de esquemas en rejilla con símbolos al estilo de IEC 60617, en dos modos:
Electricidad (leyes de Kirchhoff y de Ohm) y Lógica (puertas, biestables D, reloj lento y tabla de verdad).
Sustituye al estudio antiguo de circuitos y conserva sus 14 retos en 5 niveles, su cálculo
(ig-taller-circuitos-calc.js, sin cambios) y sus valores de componentes.
Fuentes verificadas: OpenStax University Physics Volume 2 (Ling, Sanny y Moebs, 2016), 9.4 y 10.3;
IEC 60617 (base de datos de símbolos gráficos para esquemas, https://std.iec.ch/iec60617)."""

ENGINE = 'circuitos'
SLUG = {'es': 'circuitos', 'en': 'circuits'}
SCRIPTS = ['ig-taller-circuitos-calc.js', 'ig-suite-circuitos.js']
STYLES = ['ig-suite-circuitos.css']
LIBRARIES = 'sin bibliotecas externas: esquema SVG y cálculo propios de Iris Green'
LIBRARIES_EN = 'no outside libraries: Iris Green’s own SVG schematic and calculation'

SOURCES_ES = (
    'Ling, Samuel J.; Sanny, Jeff y Moebs, William (2016). University Physics Volume 2. OpenStax (Rice University). '
    'Secciones 9.4 «Ohm’s Law» y 10.3 «Kirchhoff’s Rules» (capítulo 10, «Direct-Current Circuits»). https://openstax.org/details/books/university-physics-volume-2\n\n'
    'Comisión Electrotécnica Internacional (IEC). IEC 60617, «Graphical symbols for diagrams» (base de datos). https://std.iec.ch/iec60617 . '
    'Los símbolos del estudio siguen su estilo (resistencia rectangular, lámpara con aspa, puertas lógicas rectangulares con &, ≥1, =1 y 1); son dibujos propios, no copias de la norma.'
)
SOURCES_EN = (
    'Ling, Samuel J.; Sanny, Jeff and Moebs, William (2016). University Physics Volume 2. OpenStax (Rice University). '
    'Sections 9.4 “Ohm’s Law” and 10.3 “Kirchhoff’s Rules” (chapter 10, “Direct-Current Circuits”). https://openstax.org/details/books/university-physics-volume-2\n\n'
    'International Electrotechnical Commission (IEC). IEC 60617, “Graphical symbols for diagrams” (database). https://std.iec.ch/iec60617 . '
    'The studio’s symbols follow its style (rectangular resistor, lamp with a cross, rectangular logic gates with &, ≥1, =1 and 1); they are Iris Green’s own drawings, not copies of the standard.'
)

PAGE = {
    'es': {
        'title': 'Circuitos',
        'description': 'Monta circuitos eléctricos y lógicos en una rejilla con símbolos normalizados: pilas, bombillas, LED, interruptores, motores, medidores, puertas lógicas, biestables y tabla de verdad automática. 14 retos en 5 niveles.',
        'lede': 'Una placa para montar circuitos de verdad. En Electricidad, la corriente se calcula al momento: bombillas que brillan, LED que se funden y motores que giran. En Lógica, puertas, memoria y sumas en binario.',
        'make': ['Una luz con interruptor', 'Un LED con su resistencia calculada', 'Una luz de escalera', 'Un semáforo con reloj y biestables', 'Un sumador binario', 'El esquema en SVG o PNG y la tabla de verdad en CSV'],
        'steps': [
            'Elige Electricidad o Lógica en la lista Estructura.',
            'Con Poner, elige un componente en la lista y toca la placa (o pulsa Intro en el cursor). R lo gira.',
            'Con Cable, toca un terminal y después otro. También puedes conectar desde Propiedades, con dos listas.',
            'Con Usar, cambia interruptores, conmutadores y entradas; mantén un pulsador para cerrarlo.',
            'Elige un reto en Propiedades: se comprueba solo. Guarda el proyecto o exporta desde Archivo.',
        ],
        'sections': [
            {'h': 'Cómo calcula', 'p': 'En Electricidad se usan las leyes de Kirchhoff y la ley de Ohm: la corriente que entra en cada punto es la que sale, y en cada componente la tensión es la corriente por la resistencia (V = I × R). Los LED se tratan como una puerta que se abre a partir de cierta tensión. El amperímetro tiene 1 Ω por dentro y el voltímetro 10 MΩ, como los medidores reales, que cambian un poco lo que miden.\n\n'
                                        'En Lógica, cada cable vale 0 o 1. Las puertas se calculan hasta que todo queda quieto; los biestables D cambian solo en el pulso de reloj. El reloj es lento (como mucho, un pulso por segundo) y solo funciona cuando lo pones en marcha.'},
            {'h': 'Valores y límites', 'p': 'Valores aproximados: pila AA de 1,5 V, grupo de tres pilas de 4,5 V y pila de 9 V, con su resistencia interna; bombilla de 4,5 V y 0,3 A; LED rojo de 2 V que se funde por encima de 30 mA; motor de 8 Ω.\n\n'
                                           'Es un modelo para aprender. No sirve para montar instalaciones de la red eléctrica de casa: esas tienen tensiones peligrosas.'},
            {'h': 'Retos', 'p': 'Nivel 1 · Electricidad, primeras luces: Encender una luz; Dos bombillas bien encendidas; Un interruptor para dos luces.\n\n'
                                  'Nivel 2 · Electricidad con cuidado: Un LED sin fundirlo; Luz de escalera; Un motor en los dos sentidos.\n\n'
                                  'Nivel 3 · Lógica, puertas: A y no B; Semisumador; Votación de tres.\n\n'
                                  'Nivel 4 · Lógica, memoria y sumas: Sumador completo; Todo con NO-Y; Semáforo; Sumador binario de dos bits.\n\n'
                                  'Nivel 5 · Sin techo: Tabla misteriosa.'},
            {'h': 'Fuentes', 'p': SOURCES_ES},
        ],
        'links': [('Todo el taller', '/es/taller/'), ('Máquinas e inventos', '/es/taller/maquinas/'), ('Robótica', '/es/taller/robotica/'), ('Programación', '/es/taller/programacion/')],
    },
    'en': {
        'title': 'Circuits',
        'description': 'Build electrical and logic circuits on a grid with standard symbols: batteries, bulbs, LEDs, switches, motors, meters, logic gates, flip-flops and an automatic truth table. 14 challenges on 5 levels.',
        'lede': 'A board for building real circuits. In Electricity, the current is worked out instantly: bulbs that shine, LEDs that burn out and motors that turn. In Logic, gates, memory and binary sums.',
        'make': ['A light with a switch', 'An LED with its resistor worked out', 'A two-way staircase light', 'A traffic light with a clock and flip-flops', 'A binary adder', 'The schematic as SVG or PNG and the truth table as CSV'],
        'steps': [
            'Choose Electricity or Logic in the Structure list.',
            'With Place, choose a part in the list and tap the board (or press Enter at the cursor). R turns it.',
            'With Wire, tap one terminal and then another. You can also connect from Properties, with two lists.',
            'With Use, change switches, changeover switches and inputs; hold a push button to close it.',
            'Pick a challenge in Properties: it checks itself. Save the project or export from File.',
        ],
        'sections': [
            {'h': 'How it calculates', 'p': 'Electricity uses Kirchhoff’s laws and Ohm’s law: the current flowing into each point is the current flowing out, and in each part the voltage is the current times the resistance (V = I × R). LEDs are treated as a gate that opens above a certain voltage. The ammeter has 1 Ω inside and the voltmeter 10 MΩ, like real meters, which change what they measure slightly.\n\n'
                                              'In Logic, each wire is 0 or 1. Gates are worked out until everything is settled; D flip-flops only change on the clock pulse. The clock is slow (one pulse a second at most) and only runs when you start it.'},
            {'h': 'Values and limits', 'p': 'Approximate values: 1.5 V AA battery, 4.5 V pack of three and 9 V battery, with their internal resistance; 4.5 V 0.3 A bulb; 2 V red LED that burns out above 30 mA; 8 Ω motor.\n\n'
                                              'It is a model for learning. It is not for wiring anything to the mains at home: mains voltages are dangerous.'},
            {'h': 'Challenges', 'p': 'Level 1 · Electricity, first lights: Light a bulb; Two bright bulbs; One switch for two lights.\n\n'
                                       'Level 2 · Electricity with care: An LED without burning it out; Staircase light; A motor both ways.\n\n'
                                       'Level 3 · Logic, gates: A and not B; Half adder; Vote of three.\n\n'
                                       'Level 4 · Logic, memory and sums: Full adder; Everything from NAND; Traffic light; Two-bit binary adder.\n\n'
                                       'Level 5 · No ceiling: Mystery table.'},
            {'h': 'Sources', 'p': SOURCES_EN},
        ],
        'links': [('The whole workshop', '/en/workshop/'), ('Machines and inventions', '/en/workshop/machines/'), ('Robotics', '/en/workshop/robotics/'), ('Coding', '/en/workshop/coding/')],
    },
}

CH_ES = {
    'c1': ('Encender una luz', 'Una pila, una bombilla y cables: haz que la bombilla luzca por lo menos a la mitad.', 'La corriente necesita un camino cerrado: sale por el + de la pila, pasa por la bombilla y vuelve al −.'),
    'c2': ('Dos bombillas bien encendidas', 'Dos bombillas con una sola pila, y las dos al 80 % o más.', 'Una detrás de otra (en serie) se reparten la tensión. Una al lado de otra (en paralelo) cada una recibe la pila entera.'),
    'c3': ('Un interruptor para dos luces', 'Un solo interruptor enciende y apaga las dos bombillas a la vez.', 'Pon el interruptor en la parte del camino por la que pasa toda la corriente.'),
    'c4': ('Un LED sin fundirlo', 'Enciende un LED rojo con la pila de 9 V. Sin nada más, se funde: pon una resistencia para que pasen entre 5 y 25 mA.', 'Ley de Ohm: la resistencia se lleva lo que sobra, 9 − 2 = 7 V. 7 V entre 0,02 A son 350 Ω.'),
    'c5': ('Luz de escalera', 'Una bombilla que se enciende y se apaga desde abajo y desde arriba: cualquiera de los dos conmutadores la cambia.', 'Une las dos salidas de un conmutador con las dos del otro. Los comunes van a la pila y a la bombilla.'),
    'c6': ('Un motor en los dos sentidos', 'Con dos conmutadores, haz que el motor gire en un sentido o en el otro.', 'Si la corriente entra por el otro lado del motor, gira al revés. Cada conmutador elige a qué lado de la pila va cada cable del motor.'),
    'l1': ('A y no B', 'La luz S se enciende solo cuando A está a 1 y B está a 0.', 'Una puerta NO delante de B y luego una puerta Y.'),
    'l2': ('Semisumador', 'Suma dos bits A y B: S es el resultado y C es lo que «me llevo».', '1 + 1 = 10 en binario: S = 0 y C = 1. Mira qué puerta da 1 solo cuando las entradas son distintas.'),
    'l3': ('Votación de tres', 'La luz S se enciende cuando al menos dos de las tres entradas A, B y C están a 1.', 'Mira cada pareja: A y B, A y C, B y C. Si alguna pareja está entera a 1, S se enciende.'),
    'l4': ('Sumador completo', 'Suma A + B + E (E es lo que se trae de la columna anterior). Salidas S y C.', 'Dos semisumadores seguidos y una puerta O para juntar lo que se lleva cada uno.'),
    'l5': ('Todo con NO-Y', 'La O exclusiva (S = 1 si A y B son distintos) usando solo puertas NO-Y.', 'Se puede con cuatro puertas NO-Y. Empieza por NO-Y(A, B).'),
    'l6': ('Semáforo', 'Con el reloj y dos biestables D, haz un semáforo: con cada pulso pasa de verde (V) a ámbar (A), a rojo (R) y vuelta al verde. Siempre una sola luz.', 'Dos biestables cuentan 00, 01, 10 y vuelta a 00. Una puerta NO-O de las dos salidas vale para el verde.'),
    'l7': ('Sumador binario de dos bits', 'Suma dos números de dos bits: A1A0 + B1B0 = S2S1S0.', 'Un semisumador para las unidades (A0 + B0) y un sumador completo para la columna siguiente.'),
    'l8': ('Tabla misteriosa', 'Cada vez sale una tabla de verdad distinta con tres entradas. Construye un circuito que la cumpla. No se acaban.', 'Una puerta Y por cada fila con S = 1, y una O que las junte, siempre funciona. Luego intenta usar menos puertas.'),
}
CH_EN = {
    'c1': ('Light a bulb', 'A battery, a bulb and wires: make the bulb shine at least halfway.', 'The current needs a closed path: it leaves the battery’s +, goes through the bulb and comes back to the −.'),
    'c2': ('Two bright bulbs', 'Two bulbs on a single battery, both at 80% or more.', 'One after the other (in series) they share the voltage. Side by side (in parallel) each gets the whole battery.'),
    'c3': ('One switch for two lights', 'A single switch turns both bulbs on and off together.', 'Put the switch on the part of the path that all the current goes through.'),
    'c4': ('An LED without burning it out', 'Light a red LED with the 9 V battery. On its own it burns out: add a resistor so that 5 to 25 mA flows.', 'Ohm’s law: the resistor takes what is left over, 9 − 2 = 7 V. 7 V divided by 0.02 A is 350 Ω.'),
    'c5': ('Staircase light', 'A bulb that goes on and off from downstairs and upstairs: either of the two changeover switches changes it.', 'Join the two outputs of one changeover switch to the two of the other. The common terminals go to the battery and the bulb.'),
    'c6': ('A motor both ways', 'With two changeover switches, make the motor turn one way or the other.', 'If the current goes into the other side of the motor, it turns the other way. Each switch chooses which side of the battery each motor wire goes to.'),
    'l1': ('A and not B', 'Light S comes on only when A is 1 and B is 0.', 'A NOT gate in front of B and then an AND gate.'),
    'l2': ('Half adder', 'Add two bits A and B: S is the sum and C is the carry.', '1 + 1 = 10 in binary: S = 0 and C = 1. Look for the gate that gives 1 only when the inputs differ.'),
    'l3': ('Vote of three', 'Light S comes on when at least two of the three inputs A, B and C are 1.', 'Look at each pair: A and B, A and C, B and C. If any pair is all 1, S comes on.'),
    'l4': ('Full adder', 'Add A + B + E (E is the carry coming in from the previous column). Outputs S and C.', 'Two half adders in a row and an OR gate to join the carry from each.'),
    'l5': ('Everything from NAND', 'Exclusive OR (S = 1 if A and B differ) using only NAND gates.', 'It can be done with four NAND gates. Start with NAND(A, B).'),
    'l6': ('Traffic light', 'With the clock and two D flip-flops, build a traffic light: each pulse goes from green (V) to amber (A), to red (R) and back to green. Always a single light.', 'Two flip-flops count 00, 01, 10 and back to 00. A NOR gate of the two outputs works for green. (V, A and R keep the Spanish initials of the colours.)'),
    'l7': ('Two-bit binary adder', 'Add two two-bit numbers: A1A0 + B1B0 = S2S1S0.', 'A half adder for the units (A0 + B0) and a full adder for the next column.'),
    'l8': ('Mystery table', 'A different three-input truth table appears each time. Build a circuit that matches it. They never run out.', 'One AND gate for each row with S = 1, and an OR joining them, always works. Then try to use fewer gates.'),
}

TYPES_ES = {'battery': 'Pila', 'resistor': 'Resistencia', 'lamp': 'Bombilla', 'led': 'LED', 'switch': 'Interruptor', 'spdt': 'Conmutador', 'push': 'Pulsador', 'motor': 'Motor',
            'ammeter': 'Amperímetro', 'voltmeter': 'Voltímetro', 'input': 'Entrada', 'out': 'Luz de salida', 'and': 'Puerta Y', 'or': 'Puerta O', 'not': 'Puerta NO',
            'nand': 'Puerta NO-Y', 'nor': 'Puerta NO-O', 'xor': 'O exclusiva', 'dff': 'Biestable D', 'clock': 'Reloj'}
TYPES_EN = {'battery': 'Battery', 'resistor': 'Resistor', 'lamp': 'Bulb', 'led': 'LED', 'switch': 'Switch', 'spdt': 'Changeover switch', 'push': 'Push button', 'motor': 'Motor',
            'ammeter': 'Ammeter', 'voltmeter': 'Voltmeter', 'input': 'Input', 'out': 'Output light', 'and': 'AND gate', 'or': 'OR gate', 'not': 'NOT gate',
            'nand': 'NAND gate', 'nor': 'NOR gate', 'xor': 'Exclusive OR', 'dff': 'D flip-flop', 'clock': 'Clock'}
INFO_ES = {
    'battery': 'Pila: el terminal + es el de la raya larga y fina. Tiene una pequeña resistencia interna.', 'resistor': 'Resistencia: frena la corriente. I = V / R.',
    'lamp': 'Bombilla de 4,5 V: luce al 100 % con 1,35 W; con casi el doble se funde.', 'led': 'LED: solo deja pasar la corriente del ánodo (triángulo) al cátodo (raya) y se funde por encima de 30 mA.',
    'switch': 'Interruptor: abierto no deja pasar la corriente; cerrado, sí. Se cambia con Usar.', 'spdt': 'Conmutador: une su terminal común con la salida 1 o con la 2.',
    'push': 'Pulsador: solo cierra el circuito mientras lo mantienes pulsado (con el puntero, con Espacio o con la casilla «Mantener pulsado»).',
    'motor': 'Motor: gira si pasan más de 120 mA; el sentido depende de por dónde entra la corriente.', 'ammeter': 'Amperímetro: mide la corriente que lo atraviesa. Se pone en serie, en el camino de la corriente.',
    'voltmeter': 'Voltímetro: mide la tensión entre sus dos terminales. Se pone en paralelo, a los dos lados de lo que mides.',
    'input': 'Entrada: vale 0 o 1. Se cambia con Usar.', 'out': 'Luz de salida: se enciende si su terminal vale 1.', 'and': 'Y (&): da 1 si las dos entradas son 1.',
    'or': 'O (≥1): da 1 si alguna entrada es 1.', 'not': 'NO (1 con círculo): da lo contrario de su entrada.', 'nand': 'NO-Y: lo contrario de Y. Con ella sola se puede construir cualquier otra puerta.',
    'nor': 'NO-O: lo contrario de O.', 'xor': 'O exclusiva (=1): da 1 si las entradas son distintas.', 'dff': 'Biestable D: guarda un bit. En cada pulso de reloj copia en Q lo que hay en D. La salida con círculo es Q̄, lo contrario de Q.',
    'clock': 'Reloj: da un pulso cada vez que pulsas «Pulso» o, si lo pones en marcha, uno cada 1, 2 o 4 segundos.',
}
INFO_EN = {
    'battery': 'Battery: the + terminal is the long thin line. It has a small internal resistance.', 'resistor': 'Resistor: it slows the current down. I = V / R.',
    'lamp': '4.5 V bulb: it shines at 100% with 1.35 W; with almost twice that it burns out.', 'led': 'LED: it only lets current through from the anode (triangle) to the cathode (bar) and burns out above 30 mA.',
    'switch': 'Switch: open, it does not let current through; closed, it does. Change it with Use.', 'spdt': 'Changeover switch: it joins its common terminal to output 1 or output 2.',
    'push': 'Push button: it only closes the circuit while you hold it down (with the pointer, with Space or with the “Hold it down” box).',
    'motor': 'Motor: it turns if more than 120 mA flows; the direction depends on which side the current comes in.', 'ammeter': 'Ammeter: it measures the current flowing through it. It goes in series, in the path of the current.',
    'voltmeter': 'Voltmeter: it measures the voltage between its two terminals. It goes in parallel, on both sides of what you measure.',
    'input': 'Input: it is 0 or 1. Change it with Use.', 'out': 'Output light: it comes on if its terminal is 1.', 'and': 'AND (&): gives 1 if both inputs are 1.',
    'or': 'OR (≥1): gives 1 if any input is 1.', 'not': 'NOT (1 with a circle): gives the opposite of its input.', 'nand': 'NAND: the opposite of AND. With it alone you can build any other gate.',
    'nor': 'NOR: the opposite of OR.', 'xor': 'Exclusive OR (=1): gives 1 if the inputs differ.', 'dff': 'D flip-flop: it stores one bit. On each clock pulse it copies D into Q. The output with a circle is Q̄, the opposite of Q.',
    'clock': 'Clock: it gives a pulse each time you press “Pulse” or, if you start it, one every 1, 2 or 4 seconds.',
}
PIN_ES = {'a': 'terminal 1', 'b': 'terminal 2', 'plus': 'terminal +', 'minus': 'terminal −', 'anode': 'ánodo', 'cathode': 'cátodo', 'c': 'común', 't1': 'salida 1', 't2': 'salida 2',
          'in1': 'entrada 1', 'in2': 'entrada 2', 'o': 'salida', 'i': 'entrada', 'd': 'entrada D', 'clk': 'entrada de reloj', 'q': 'salida Q', 'qn': 'salida Q̄'}
PIN_EN = {'a': 'terminal 1', 'b': 'terminal 2', 'plus': '+ terminal', 'minus': '− terminal', 'anode': 'anode', 'cathode': 'cathode', 'c': 'common', 't1': 'output 1', 't2': 'output 2',
          'in1': 'input 1', 'in2': 'input 2', 'o': 'output', 'i': 'input', 'd': 'D input', 'clk': 'clock input', 'q': 'Q output', 'qn': 'Q̄ output'}
GATE_ES = {'and': 'Y', 'or': 'O', 'not': 'NO', 'nand': 'NO-Y', 'nor': 'NO-O', 'xor': 'O exclusiva', 'dff': 'biestable D'}
GATE_EN = {'and': 'AND', 'or': 'OR', 'not': 'NOT', 'nand': 'NAND', 'nor': 'NOR', 'xor': 'XOR', 'dff': 'D flip-flop'}
TOOLS_ES = {'select': ('Elegir', 'Toca un componente o un cable para elegirlo; arrástralo para moverlo.'), 'place': ('Poner', 'Elige el componente en la lista y toca la placa.'),
            'wire': ('Cable', 'Toca un terminal y después otro.'), 'use': ('Usar', 'Toca un interruptor, un conmutador o una entrada para cambiarlo; mantén un pulsador.'),
            'erase': ('Borrar', 'Toca un componente o un cable para quitarlo.'), 'pan': ('Mover la vista', 'Arrastra para mover la vista.')}
TOOLS_EN = {'select': ('Select', 'Tap a part or a wire to choose it; drag it to move it.'), 'place': ('Place', 'Choose the part in the list and tap the board.'),
            'wire': ('Wire', 'Tap one terminal and then another.'), 'use': ('Use', 'Tap a switch, changeover switch or input to change it; hold a push button.'),
            'erase': ('Erase', 'Tap a part or a wire to remove it.'), 'pan': ('Move the view', 'Drag to move the view.')}

STRINGS = {
    'es': {
        'canvasLabel': 'Placa de circuitos',
        'canvasHelp': 'Con el teclado: flechas para mover el cursor por la rejilla (o lo que hayas elegido), Intro para actuar con la herramienta. P poner, C cable, U usar, E elegir, B borrar; R gira, N pasa al siguiente, T pone en marcha el reloj o el flujo y K da un pulso. Todo está también en la lista Estructura.',
        'kcEnter': 'Intro: actuar en el cursor (poner, elegir un terminal para el cable, usar o elegir)',
        'kcTools': 'P poner · C cable · U usar · E elegir · B borrar',
        'kcRotate': 'R: girar el componente elegido (Mayús + R: al otro lado)',
        'kcNext': 'N: elegir el siguiente componente o cable (Mayús + N: el anterior)',
        'kcClock': 'T: reloj (Lógica) o animación del flujo (Electricidad) · K: un pulso de reloj · Espacio con Usar: mantener un pulsador',
        'stLight': 'Encender una luz', 'stLightD': 'Pila, interruptor y bombilla. Falta un cable: únelo y cierra el interruptor.',
        'stTraffic': 'Semáforo', 'stTrafficD': 'Reloj y dos biestables ya unidos. Añade la puerta y los cables que faltan para las tres luces.',
        'stGates': 'Puertas Y y O', 'stGatesD': 'Dos entradas y dos puertas con su tabla de verdad. Conviértelo en un semisumador.',
        'stAdder': 'Sumador binario completo', 'stAdderD': 'Suma A + B + E con cinco puertas. Amplíalo a dos bits.',
        'stLed': 'LED con resistencia calculada', 'stLedD': 'Pila de 9 V, resistencia de 330 Ω, LED rojo, amperímetro y voltímetro.',
        'stLogicEmpty': 'Placa de lógica vacía', 'stLogicEmptyD': 'Para montar puertas desde cero.',
        'mode_elec': 'Electricidad', 'mode_logic': 'Lógica', 'circuitKind': 'Tipo de circuito', 'countN': '{n} piezas', 'componentsN': 'Componentes ({n})', 'wiresN': 'Cables ({n})', 'wireShort': 'Cable {n}',
        'wireN': 'Cable de {a} a {b}', 'wireFrom': 'Cable desde {p}', 'wireStart': 'Cable empezado en {p}. Elige otro terminal.', 'wireAdded': 'Cable de {a} a {b}.', 'wireExists': 'Ya hay un cable entre esos terminales.',
        'wireDeleted': 'Cable quitado.', 'noPinHere': 'Ahí no hay ningún terminal. Los terminales son los puntos oscuros de los extremos.', 'terminal': 'Terminal',
        'placed': '{p} puesto.', 'noRoom': 'No cabe ahí: acércalo al centro de la placa.', 'noRotate': 'En Lógica las puertas no se giran: las entradas van a la izquierda.', 'rotated': 'Girado: {a}°', 'moved': 'Movido.',
        'cancelled': 'Cancelado.', 'nothingHere': 'No hay nada ahí.', 'nothingToUse': 'Ese componente no se usa: se cambia en Propiedades.', 'tooMany': 'Demasiados componentes para la placa.',
        'deleted': 'Quitado: {name}', 'cursorAt': 'Punto {x}, {y}: {what}', 'emptyPoint': 'libre',
        'pushDown': 'Pulsador apretado.', 'pushUp': 'Pulsador suelto.', 'pressedW': 'apretado', 'releasedW': 'suelto', 'swClosed': 'cerrado', 'swOpen': 'abierto', 'posN': 'posición {n}',
        'burnt': 'fundido', 'off': 'apagado', 'lit': 'encendido', 'reverse': 'al revés: no deja pasar', 'reverseShort': 'al revés', 'stoppedM': 'parado', 'shortShort': 'cortocircuito', 'shortShortCap': 'Cortocircuito',
        'cw': 'sentido horario', 'ccw': 'sentido antihorario', 'clockShort': 'reloj',
        'bat_aa': '1,5 V (una pila AA)', 'bat_pack': '4,5 V (tres pilas AA)', 'bat_v9': '9 V (pila de petaca)',
        'led_rojo': 'rojo', 'led_verde': 'verde', 'led_amarillo': 'amarillo', 'led_azul': 'azul',
        'warning': 'Aviso', 'short': 'Cortocircuito: la corriente vuelve a la pila sin pasar por nada que la frene. En la realidad, la pila se calentaría y se estropearía.',
        'lampBurnt': 'La bombilla se fundiría: le llega demasiada corriente. Pon una pila más pequeña o algo en serie que la frene.',
        'ledBurnt': 'El LED se fundiría: pasan más de 30 mA. Pon una resistencia en serie (mira el cálculo del LED).', 'resHot': 'La resistencia se calienta mucho (más de 0,5 W).',
        'reading': 'Lectura', 'current': 'Corriente', 'voltage': 'Tensión', 'power': 'Potencia', 'brightness': 'Brillo', 'state': 'Estado',
        'batteryKind': 'Pila', 'resValue': 'Resistencia', 'resStd': 'Valores de la serie E12', 'ledColor': 'Color del LED', 'closedLabel': 'Cerrado', 'position': 'Posición', 'holdPressed': 'Mantener pulsado',
        'ledCalcTitle': 'Resistencia para este LED', 'ledCalc': 'R = (V − Vf) ÷ I = ({v} − {f}) V ÷ 0,0{i} A ≈ {r} Ω. El valor comercial más cercano por encima es {s}.',
        'label': 'Nombre (hasta 4 letras)', 'labelSet': 'Nombre: {l}', 'value': 'Valor', 'pulse': 'Pulso de reloj', 'pulsed': 'Pulso {n}.',
        'connectionsTitle': 'Conexiones', 'nothingConnected': 'nada', 'fromPin': 'Desde el terminal', 'toPin': 'Hasta', 'addWireBtn': 'Añadir cable', 'connections': '{n} cables',
        'rotate': 'Girar', 'toggle': 'Cambiar', 'deleteComp': 'Quitar componente', 'posX': 'Columna (x)', 'posY': 'Fila (y)',
        'noCurrent': 'no pasa corriente', 'currentShared': 'pasa corriente (se reparte en el nudo)', 'flowAB': 'del primer terminal al segundo', 'flowBA': 'del segundo terminal al primero', 'unconnected': 'sin conectar',
        'route': 'Recorrido', 'routeH': 'primero horizontal', 'routeV': 'primero vertical', 'routeSet': 'Recorrido cambiado.', 'deleteWire': 'Quitar cable',
        'emptyElec': 'Pon una pila y algo que consuma: bombilla, LED o motor. Después únelos con cables.', 'noBattery': 'Falta una pila.', 'cantSolve': 'No se puede calcular este circuito.',
        'batLine': 'da {i} con {v} V entre sus terminales', 'flowAnim': 'Animar el flujo de corriente (puntos que avanzan despacio)', 'flowReduced': 'Con movimiento reducido, el flujo se ve con flechas quietas.',
        'flowOn': 'Animación del flujo en marcha.', 'flowOff': 'Animación del flujo parada.', 'flowStart': 'Animar flujo', 'readCircuit': 'Leer el circuito', 'flowStop': 'Parar flujo',
        'legendElec': 'Cable azul y grueso con flecha: pasa corriente en el sentido de la flecha (de + a − por fuera de la pila). Oscuro: no pasa. Las bombillas y los LED brillan según la corriente.',
        'emptyLogic': 'Pon entradas, puertas y luces de salida, y únelas con cables.', 'conflict': 'Dos salidas están unidas en el mismo cable. Cada cable debe tener una sola salida.', 'oscillates': 'El circuito no se estabiliza: cambia sin parar.',
        'outputsL': 'Salidas ahora', 'noOutputs': 'no hay luces de salida', 'outputsNow': 'Salidas: {o}.', 'pulsesL': 'Pulsos de reloj', 'clockSpeed': 'Velocidad del reloj', 'hz': '{f} pulsos por segundo',
        'clockStart': 'Poner en marcha el reloj', 'clockStop': 'Parar el reloj', 'clockOn': 'Reloj en marcha: {f} pulsos por segundo.', 'clockOff': 'Reloj parado.', 'clockRunning': 'Reloj · {f}/s · {n} pulsos',
        'resetFF': 'Biestables a 0', 'resetDone': 'Biestables a 0.',
        'legendLogic': 'Cable naranja, grueso y continuo: vale 1. Gris y discontinuo: vale 0. Punteado claro: sin conectar.',
        'ttCap': 'Tabla de verdad del circuito', 'ttFF': '(con los biestables como están ahora)', 'ttTooMany': 'Más de 6 entradas: la tabla sería demasiado larga.', 'ttNeed': 'La tabla de verdad aparece cuando hay entradas y luces de salida.', 'outMark': '(salida)',
        'targetCap': 'Tabla que tiene que cumplir', 'summary': '{n} componentes y {w} cables.', 'emptyBoard': 'La placa está vacía.',
        'challenge': 'Reto', 'chooseChallenge': 'Elegir reto', 'freeMode': 'Sin reto (modo libre)', 'freeModeText': 'Usa la placa como quieras. Puedes elegir un reto en cualquier momento; no se borra lo que has hecho.',
        'levelN': 'Nivel {n}', 'lvl1': 'Electricidad: primeras luces', 'lvl2': 'Electricidad con cuidado', 'lvl3': 'Lógica: puertas', 'lvl4': 'Lógica: memoria y sumas', 'lvl5': 'Sin techo',
        'chPicked': 'Reto elegido: {t}', 'chDone': 'Reto cumplido', 'chNotYet': 'Así va. Cambia lo que haga falta: se comprueba solo.', 'chProgress': 'Reto: {a} de {b}', 'goToMode': 'Ir a {m}',
        'prepare': 'Poner las entradas y salidas del reto', 'prepared': 'Entradas y salidas puestas.', 'anotherTable': 'Otra tabla', 'newTable': 'Tabla nueva.', 'tip': 'Pista', 'okWord': 'hecho', 'pendingWord': 'pendiente',
        'chkLabels': 'Entradas y salidas con los nombres {l}', 'chkNoConflict': 'Ningún cable con dos salidas', 'chkNoOsc': 'El circuito se estabiliza', 'chkTable': 'Tabla: {ok} de {n} valores bien',
        'chkOnly': 'Solo {p}', 'chkOneLight': 'Una sola luz en cada paso', 'chkOrder': 'Orden correcto durante 8 pulsos', 'chkClock': 'Hay un reloj en la placa', 'chkLamps': 'Bombillas: {n} (mínimo {m})', 'chkHas': 'Incluye: {p}',
        'chkNoShort': 'Sin cortocircuitos en ninguna posición', 'chkBright': 'Todas las bombillas al {p} % o más', 'chkOffToo': 'Todas apagadas con el interruptor abierto', 'chkNoBurn': 'Nada se funde',
        'chkLed': 'Un LED encendido con entre {a} y {b} mA', 'chkStair': 'Cada conmutador cambia la luz', 'chkReverse': 'El motor gira en los dos sentidos', 'chkBattery': 'Pila de {b}',
        'partKind': 'Componente', 'howCalc': 'Cómo calcula',
        'how_elec': 'Análisis de nudos con las leyes de Kirchhoff (la corriente que entra en un nudo es la que sale) y la ley de Ohm (V = I × R). Pila con resistencia interna; bombilla de 15 Ω; LED de 2 V (rojo) con 10 Ω internos; motor de 8 Ω; amperímetro de 1 Ω; voltímetro de 10 MΩ.',
        'how_logic': 'Cada cable vale 0 o 1. Las puertas se recalculan hasta que nada cambia (como mucho 64 vueltas: si no, avisa de que oscila). Los biestables D copian D en Q en el flanco de subida del reloj. La tabla de verdad prueba todas las combinaciones de entradas, ordenadas por nombre.',
        'schematicTitle': 'Esquema', 'exportSvg': 'Esquema (SVG)', 'exportPng': 'Esquema (PNG)', 'exportCsv': 'Tabla de verdad (CSV)', 'exportError': 'No se ha podido crear la imagen.', 'csvOnlyLogic': 'La tabla de verdad es del modo Lógica: cambia a Lógica para exportarla.',
    },
    'en': {
        'canvasLabel': 'Circuit board',
        'canvasHelp': 'With a keyboard: arrow keys move the cursor round the grid (or whatever you have chosen), Enter acts with the tool. P place, C wire, U use, E select, B erase; R turns, N moves to the next one, T starts the clock or the flow and K gives a pulse. Everything is also in the Structure list.',
        'kcEnter': 'Enter: act at the cursor (place, choose a terminal for the wire, use or select)',
        'kcTools': 'P place · C wire · U use · E select · B erase',
        'kcRotate': 'R: turn the chosen part (Shift + R: the other way)',
        'kcNext': 'N: choose the next part or wire (Shift + N: the previous one)',
        'kcClock': 'T: clock (Logic) or flow animation (Electricity) · K: one clock pulse · Space with Use: hold a push button',
        'stLight': 'Light a bulb', 'stLightD': 'Battery, switch and bulb. One wire is missing: join it and close the switch.',
        'stTraffic': 'Traffic light', 'stTrafficD': 'A clock and two flip-flops already joined. Add the gate and the wires missing for the three lights.',
        'stGates': 'AND and OR gates', 'stGatesD': 'Two inputs and two gates with their truth table. Turn it into a half adder.',
        'stAdder': 'Full binary adder', 'stAdderD': 'Adds A + B + E with five gates. Extend it to two bits.',
        'stLed': 'LED with its resistor worked out', 'stLedD': '9 V battery, 330 Ω resistor, red LED, ammeter and voltmeter.',
        'stLogicEmpty': 'Empty logic board', 'stLogicEmptyD': 'For building gates from scratch.',
        'mode_elec': 'Electricity', 'mode_logic': 'Logic', 'circuitKind': 'Kind of circuit', 'countN': '{n} parts', 'componentsN': 'Parts ({n})', 'wiresN': 'Wires ({n})', 'wireShort': 'Wire {n}',
        'wireN': 'Wire from {a} to {b}', 'wireFrom': 'Wire from {p}', 'wireStart': 'Wire started at {p}. Choose another terminal.', 'wireAdded': 'Wire from {a} to {b}.', 'wireExists': 'There is already a wire between those terminals.',
        'wireDeleted': 'Wire removed.', 'noPinHere': 'There is no terminal there. Terminals are the dark dots at the ends.', 'terminal': 'Terminal',
        'placed': '{p} placed.', 'noRoom': 'It does not fit there: move it towards the middle of the board.', 'noRotate': 'In Logic, gates do not turn: inputs go on the left.', 'rotated': 'Turned: {a}°', 'moved': 'Moved.',
        'cancelled': 'Cancelled.', 'nothingHere': 'There is nothing there.', 'nothingToUse': 'That part is not used: change it in Properties.', 'tooMany': 'Too many parts for the board.',
        'deleted': 'Removed: {name}', 'cursorAt': 'Point {x}, {y}: {what}', 'emptyPoint': 'empty',
        'pushDown': 'Push button held down.', 'pushUp': 'Push button released.', 'pressedW': 'held down', 'releasedW': 'released', 'swClosed': 'closed', 'swOpen': 'open', 'posN': 'position {n}',
        'burnt': 'burnt out', 'off': 'off', 'lit': 'lit', 'reverse': 'the wrong way round: no current', 'reverseShort': 'reversed', 'stoppedM': 'stopped', 'shortShort': 'short circuit', 'shortShortCap': 'Short circuit',
        'cw': 'clockwise', 'ccw': 'anticlockwise', 'clockShort': 'clock',
        'bat_aa': '1.5 V (one AA battery)', 'bat_pack': '4.5 V (three AA batteries)', 'bat_v9': '9 V (PP3 battery)',
        'led_rojo': 'red', 'led_verde': 'green', 'led_amarillo': 'yellow', 'led_azul': 'blue',
        'warning': 'Warning', 'short': 'Short circuit: the current goes back to the battery without passing through anything that slows it down. In real life the battery would get hot and be damaged.',
        'lampBurnt': 'The bulb would burn out: too much current reaches it. Use a smaller battery or put something in series to slow it down.',
        'ledBurnt': 'The LED would burn out: more than 30 mA flows. Put a resistor in series (see the LED calculation).', 'resHot': 'The resistor gets very hot (over 0.5 W).',
        'reading': 'Reading', 'current': 'Current', 'voltage': 'Voltage', 'power': 'Power', 'brightness': 'Brightness', 'state': 'State',
        'batteryKind': 'Battery', 'resValue': 'Resistance', 'resStd': 'E12 series values', 'ledColor': 'LED colour', 'closedLabel': 'Closed', 'position': 'Position', 'holdPressed': 'Hold it down',
        'ledCalcTitle': 'Resistor for this LED', 'ledCalc': 'R = (V − Vf) ÷ I = ({v} − {f}) V ÷ 0.0{i} A ≈ {r} Ω. The nearest standard value above it is {s}.',
        'label': 'Name (up to 4 letters)', 'labelSet': 'Name: {l}', 'value': 'Value', 'pulse': 'Clock pulse', 'pulsed': 'Pulse {n}.',
        'connectionsTitle': 'Connections', 'nothingConnected': 'nothing', 'fromPin': 'From terminal', 'toPin': 'To', 'addWireBtn': 'Add wire', 'connections': '{n} wires',
        'rotate': 'Turn', 'toggle': 'Change', 'deleteComp': 'Remove part', 'posX': 'Column (x)', 'posY': 'Row (y)',
        'noCurrent': 'no current', 'currentShared': 'current flows (it splits at the junction)', 'flowAB': 'from the first terminal to the second', 'flowBA': 'from the second terminal to the first', 'unconnected': 'not connected',
        'route': 'Route', 'routeH': 'horizontal first', 'routeV': 'vertical first', 'routeSet': 'Route changed.', 'deleteWire': 'Remove wire',
        'emptyElec': 'Add a battery and something that uses power: a bulb, an LED or a motor. Then join them with wires.', 'noBattery': 'A battery is missing.', 'cantSolve': 'This circuit cannot be worked out.',
        'batLine': 'gives {i} with {v} V across its terminals', 'flowAnim': 'Animate the current flow (dots moving slowly)', 'flowReduced': 'With reduced motion, the flow is shown with still arrows.',
        'flowOn': 'Flow animation running.', 'flowOff': 'Flow animation stopped.', 'flowStart': 'Animate flow', 'readCircuit': 'Read the circuit', 'flowStop': 'Stop flow',
        'legendElec': 'Thick blue wire with an arrow: current flows in the direction of the arrow (from + to − outside the battery). Dark: no current. Bulbs and LEDs shine according to the current.',
        'emptyLogic': 'Add inputs, gates and output lights, and join them with wires.', 'conflict': 'Two outputs are joined on the same wire. Each wire must have a single output.', 'oscillates': 'The circuit does not settle: it keeps changing.',
        'outputsL': 'Outputs now', 'noOutputs': 'no output lights', 'outputsNow': 'Outputs: {o}.', 'pulsesL': 'Clock pulses', 'clockSpeed': 'Clock speed', 'hz': '{f} pulses a second',
        'clockStart': 'Start the clock', 'clockStop': 'Stop the clock', 'clockOn': 'Clock running: {f} pulses a second.', 'clockOff': 'Clock stopped.', 'clockRunning': 'Clock · {f}/s · {n} pulses',
        'resetFF': 'Flip-flops to 0', 'resetDone': 'Flip-flops set to 0.',
        'legendLogic': 'Thick, solid orange wire: it is 1. Grey and dashed: it is 0. Light dotted: not connected.',
        'ttCap': 'Truth table of the circuit', 'ttFF': '(with the flip-flops as they are now)', 'ttTooMany': 'More than 6 inputs: the table would be too long.', 'ttNeed': 'The truth table appears when there are inputs and output lights.', 'outMark': '(output)',
        'targetCap': 'Table it has to match', 'summary': '{n} parts and {w} wires.', 'emptyBoard': 'The board is empty.',
        'challenge': 'Challenge', 'chooseChallenge': 'Choose a challenge', 'freeMode': 'No challenge (free mode)', 'freeModeText': 'Use the board however you like. You can pick a challenge at any time; your work is not cleared.',
        'levelN': 'Level {n}', 'lvl1': 'Electricity: first lights', 'lvl2': 'Electricity with care', 'lvl3': 'Logic: gates', 'lvl4': 'Logic: memory and sums', 'lvl5': 'No ceiling',
        'chPicked': 'Challenge chosen: {t}', 'chDone': 'Challenge complete', 'chNotYet': 'So far so good. Change whatever you need: it checks itself.', 'chProgress': 'Challenge: {a} of {b}', 'goToMode': 'Go to {m}',
        'prepare': 'Add the challenge’s inputs and outputs', 'prepared': 'Inputs and outputs added.', 'anotherTable': 'Another table', 'newTable': 'New table.', 'tip': 'Hint', 'okWord': 'done', 'pendingWord': 'to do',
        'chkLabels': 'Inputs and outputs named {l}', 'chkNoConflict': 'No wire with two outputs', 'chkNoOsc': 'The circuit settles', 'chkTable': 'Table: {ok} of {n} values right',
        'chkOnly': 'Only {p}', 'chkOneLight': 'A single light at each step', 'chkOrder': 'Right order for 8 pulses', 'chkClock': 'There is a clock on the board', 'chkLamps': 'Bulbs: {n} (at least {m})', 'chkHas': 'Includes: {p}',
        'chkNoShort': 'No short circuit in any position', 'chkBright': 'All bulbs at {p}% or more', 'chkOffToo': 'All off with the switch open', 'chkNoBurn': 'Nothing burns out',
        'chkLed': 'An LED lit with between {a} and {b} mA', 'chkStair': 'Each changeover switch changes the light', 'chkReverse': 'The motor turns both ways', 'chkBattery': 'Battery of {b}',
        'partKind': 'Part', 'howCalc': 'How it calculates',
        'how_elec': 'Nodal analysis with Kirchhoff’s laws (the current into a junction equals the current out) and Ohm’s law (V = I × R). Battery with internal resistance; 15 Ω bulb; 2 V (red) LED with 10 Ω inside; 8 Ω motor; 1 Ω ammeter; 10 MΩ voltmeter.',
        'how_logic': 'Each wire is 0 or 1. Gates are worked out again until nothing changes (64 rounds at most: otherwise it warns that it oscillates). D flip-flops copy D into Q on the rising edge of the clock. The truth table tries every combination of inputs, sorted by name.',
        'schematicTitle': 'Schematic', 'exportSvg': 'Schematic (SVG)', 'exportPng': 'Schematic (PNG)', 'exportCsv': 'Truth table (CSV)', 'exportError': 'The image could not be created.', 'csvOnlyLogic': 'The truth table belongs to Logic mode: switch to Logic to export it.',
    },
}

for _lang, _ch, _ty, _inf, _pin, _gate, _tools in (('es', CH_ES, TYPES_ES, INFO_ES, PIN_ES, GATE_ES, TOOLS_ES), ('en', CH_EN, TYPES_EN, INFO_EN, PIN_EN, GATE_EN, TOOLS_EN)):
    for _id, (_t, _g, _tip) in _ch.items():
        STRINGS[_lang]['ch_' + _id] = _t
        STRINGS[_lang]['chg_' + _id] = _g
        STRINGS[_lang]['cht_' + _id] = _tip
    for _k, _v in _ty.items():
        STRINGS[_lang]['part_' + _k] = _v
    for _k, _v in _inf.items():
        STRINGS[_lang]['info_' + _k] = _v
    for _k, _v in _pin.items():
        STRINGS[_lang]['pin_' + _k] = _v
    for _k, _v in _gate.items():
        STRINGS[_lang]['gate_' + _k] = _v
    for _k, (_l, _hp) in _tools.items():
        STRINGS[_lang]['tool_' + _k] = _l
        STRINGS[_lang]['toolHelp_' + _k] = _hp

assert set(CH_ES) == set(CH_EN)
assert set(STRINGS['es']) == set(STRINGS['en']), set(STRINGS['es']) ^ set(STRINGS['en'])
assert set(PAGE['es']) == set(PAGE['en'])
