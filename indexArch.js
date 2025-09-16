// Modulos clases que se necesitan
import { createInterface } from 'readline';
import { readFile, writeFileSync } from 'fs';
import Alumno from './alumnos.js';
import Carrera from './carreras.js';
import { crearMarco } from './marco.js'; // Este módulo es para generar un marco con la lista de entidades.

const rl = createInterface({
    input: process.stdin, //proceso de entrada (pregunta o instrucciones para leer entrada de datos)
    output: process.stdout //funcion que procesa el dato recibido en el input lo transforma y genera un output
});

// Archivos con los datos a manejar.
const dataFolder = './data/';
const alumnosFile = dataFolder + 'alumnos.json';
const carrerasFile = dataFolder + 'carreras.json';
const idsFile = dataFolder + 'ids.json';

// Arreglos con las entidades y sus últimos IDs.
let alumnos = [];
let carreras = [];
let ids;

/*
Función callback que se manda a llamar cada vez que se cargan datos
desde los archivos.
*/
function callbackCargaDatos(entidad) {
    return (err, data) => {
        if (err) { // Si hubo un error lo imprimimos.
            console.error(`\n${negritas}${rojo}Error leyendo ${entidad}:`, err);
            return;
        }
        try {
            // Parseamos (los convertimos a un objeto) los datos del json.
            const parseado = JSON.parse(data);

            if (entidad === 'alumnos') {
                /*
                Usamos map para que por cada elemento parseado se cree un nuevo
                alumno con sus datos.
                */
                alumnos = parseado.map(a => new Alumno(a.id, a.nombre, a.carrera));
            } else if (entidad === 'carreras') {
                // Aquí lo mismo de arriba.
                carreras = parseado.map(c => new Carrera(c.id, c.nombre, c.alumnos));
            } else if (entidad === 'ids') ids = parseado; // Guardamos los últimos IDs usados.
        } catch (e) {
            // Si hubo un error paseando.
            console.error(`${rojo}Error parseando ${entidad}:`, e);
        }
    };
}

// Con esta función ses mandan a leer los datos y se manda a llamar el callback.
function cargarDatos() {
    readFile(alumnosFile, 'utf8', callbackCargaDatos('alumnos'));
    readFile(carrerasFile, 'utf8', callbackCargaDatos('carreras'));
    readFile(idsFile, 'utf8', callbackCargaDatos('ids'));
}

// Con esta mandamos a guardar los datos que tenemos en los arreglos.
function guardarDatos() {
    // stringify() convierte objetos js a objetos json. El 2 es la indentación en el json.
    writeFileSync(alumnosFile, JSON.stringify(alumnos, null, 2), 'utf8');
    writeFileSync(carrerasFile, JSON.stringify(carreras, null, 2), 'utf8');
    writeFileSync(idsFile, JSON.stringify(ids, null, 2), 'utf8');
}

// CÓDIGO DE COLORES PARA LA TERMINAL
// Tipos de letra
const normal = "\x1b[0m";
const negritas = "\x1b[1m";
const subrayado = "\x1b[4m";

// Colores de texto
const negro = "\x1b[30m";
const rojo = "\x1b[31m";
const verde = "\x1b[32m";
const amarillo = "\x1b[33m";
const azul = "\x1b[34m";
const morado = "\x1b[35m";
const cyan = "\x1b[36m";
const blanco = "\x1b[37m";

// Colores de fondo
const bgNegro = "\x1b[40m";
const bgRojo = "\x1b[41m";
const bgVerde = "\x1b[42m";
const bgAmarillo = "\x1b[43m";
const bgAzul = "\x1b[44m";
const bgMorado = "\x1b[45m";
const bgCyan = "\x1b[46m";
const bgBlanco = "\x1b[47m";

function mostrarMenuPrincipal() {
    console.log(`\n${negritas}${bgAmarillo}••• MENÚ •••${normal}`);
    console.log(`${azul}1. Alumnos${normal}`);
    console.log(`${verde}2. Carreras${normal}`);
    console.log(`${rojo}3. Salir${normal}`);
}

// Función que devuelve los colores (texto y fondo) dependiendo de la entidad.
// Azul para alumnos y verde para carreras.
function coloresEntidad(entidad) {
    let colores = [normal, normal];
    if (entidad === 'alumnos') colores = [azul, bgAzul];
    else if (entidad === 'carreras') colores = [verde, bgVerde];
    return colores;
}

function mostrarSubMenuEntidad(entidad) {
    // Obtenemos el colores de la entidad
    let colores = coloresEntidad(entidad);

    console.log(`\n${colores[1]}••• ${entidad.toUpperCase()} •••${normal}${colores[0]}`);
    console.log('1. Ver listado');
    console.log('2. Agregar');
    console.log('3. Borrar');
    console.log('4. Cambiar');
    console.log('5. Agregar alumno a carrera');
    console.log('6. Volver al menú principal');
}

// Función para mostrar el listado de elementos de una entidad.
function mostrarListado(entidad) {
    let lista;
    // Checamos el tipo de entidad que va a haber en la lista.
    if (entidad === 'alumnos') lista = alumnos;
    else if (entidad === 'carreras') lista = carreras;

    // Checamos si la lista está vacía.
    if (lista.length === 0) {
        console.log(`\n${rojo}No hay registros de ${entidad}${normal}`);
        return;
    }

    let colores = coloresEntidad(entidad);
    // Creamos la lista que se mostrará.
    crearMarco(lista, entidad, colores[1]);
}

// Función para agregar entidades a la lista.
function agregar(entidad, Clase) {
    // Le preguntamos al usuario el nombre ya sea del alumno o la carrera.
    rl.question(`${amarillo}Nombre: ${normal}`, nombre => {
        // Le asignamos un id (+1 que el anterior de su tipo de entidad).
        let nuevoId = ++ids[entidad];
        /**
         * Creamos la entidad. No le mandamos arreglo de alumnos ni nombre de carrera
         * ya que en los constructores de cada clase nos encargamos de eso.
         */
        let nuevo = new Clase(nuevoId, nombre);

        // Agregamos la entidad a su arreglo correspondiente.
        if (entidad === 'alumnos') alumnos.push(nuevo);
        if (entidad === 'carreras') carreras.push(nuevo);
        // Mandamos a guardar los datos a los archivos.
        guardarDatos();
        console.log(`\n${verde}Registrado correctamente${normal}`);
        seleccionarAccionEntidad(entidad); // Devolvemos el menú a las opciones de la entidad.
    });
}

// Función para borrar una entidad
function borrar(entidad) {
    mostrarListado(entidad); // Mostramos la lista, ya sea de alumnos o carreras.
    // Le pedimos al usuario un id para borrar.
    rl.question(`${amarillo}ID a borrar: ${normal}`, input => {
        let lista;
        if (entidad === 'alumnos') lista = alumnos;
        if (entidad === 'carreras') lista = carreras;
        /**
         * Buscamos el índice de la lista donde concuerde el id de la entidad con lo
         * introducido por el usuario.
         */
        const index = lista.findIndex(x => x.id == input);
        if (index !== -1) {
            // Con splice() le decimos que borre 1 elemento en el índice encontrado y lo guardamos en una variable.
            const eliminado = lista.splice(index, 1)[0];

            if (entidad === 'alumnos') { // Si se borró un alumno.
                // Borramos el ID del alumno de la carrera donde aparezca.
                carreras.forEach(c => {
                    c.alumnos = c.alumnos.filter(aId => aId != eliminado.id);
                });
            } else if (entidad === 'carreras') { // Si se borró una carrera.
                // Ponemos null en la propiedad carrera de todos los alumnos que estuvieran en esa carrera.
                alumnos.forEach(a => {
                    if (a.carrera === eliminado.nombre) {
                        a.carrera = null;
                    }
                });
            }

            // Mandamos a guardar los datos en los archivos.
            guardarDatos();
            console.log(`\n${verde}Borrado correctamente${normal}`);
        } else {
            console.log(`\n${rojo}ID no encontrado${normal}`);
        }
        seleccionarAccionEntidad(entidad); // Devolvemos el menú a las opciones de la entidad.
    });
}

// Función para cambiar de nombre, tanto para alumnos como carreras.
function cambiar(entidad) {
    mostrarListado(entidad); // Mostramos la lista, ya sea de alumnos o carreras.
    // Le pedimos al usuario un id para cambiar.
    rl.question(`${amarillo}ID a cambiar: ${normal}`, input => {
        let lista;
        if (entidad === 'alumnos') lista = alumnos;
        if (entidad === 'carreras') lista = carreras;

        // Obtenemos la entidad cuyo ID sea igual al que proporcionó el usuario.
        const item = lista.find(x => x.id == input);
        if (item) {
            // Le pedimos al usuario un nuevo nombre.
            rl.question(`${amarillo}Nuevo nombre: ${normal}`, nuevoNombre => {
                item.nombre = nuevoNombre;
                // Mandamos a guardar los datos.
                guardarDatos();
                console.log(`\n${verde}Actualizado correctamente${normal}`);
                seleccionarAccionEntidad(entidad); // Devolvemos el menú a las opciones de la entidad.
            });
        } else {
            console.log(`\n${rojo}ID no encontrado${normal}`);
            seleccionarAccionEntidad(entidad); // Devolvemos el menú a las opciones de la entidad.
        }
    });
}

// Función para asignar un alumno a la carrera
function asignarAlumnoACarrera(entidad) {
    // Por si no hay alumnos.
    if (alumnos.length === 0) {
        console.log(`\n${rojo}No hay registros de alumnos${normal}`);
        seleccionarAccionEntidad(entidad); // Volvemos al menú
        return;
    }

    // Mostramos la lista de alumnos.
    mostrarListado('alumnos');
    // Le pedimos un ID al usuario.
    rl.question(`${amarillo}ID del alumno: ${normal}`, idAlumno => {
        // Obtenemos el objeto.
        const alumno = alumnos.find(a => a.id == idAlumno);
        if (!alumno) {
            // Por si no se encuentra un alumno con el ID dado.
            console.log(`\n${rojo}Alumno no encontrado${normal}`);
            seleccionarAccionEntidad('alumnos');
            return;
        }

        // Por si no hay carreras.
        if (carreras.length === 0) {
            console.log(`\n${rojo}No hay registros de carreras${normal}`);
            seleccionarAccionEntidad(entidad);
            return;
        }

        // Mostramos la lista de alumnos.
        mostrarListado('carreras');
        // Le pedimos un ID al usuario.
        rl.question(`${amarillo}ID de la carrera: ${normal}`, idCarrera => {
            // Obtenemos la carrera con el ID dado.
            const carrera = carreras.find(c => c.id == idCarrera);
            if (!carrera) { // Por si no se encuetra.
                console.log(`\n${rojo}Carrera no encontrada${normal}`);
            } else {
                // Si la carrera no tiene asociado el ID del alumno, lo metemos al arreglo.
                if (!carrera.alumnos.includes(alumno.id)) carrera.alumnos.push(alumno.id);
                // Y actualizamos la carrera a la que pertenece el alumno.
                alumno.carrera = carrera.nombre;
                // Mandamos a guardar los datos.
                guardarDatos();
                console.log(`\n${verde}Alumno asignado a la carrera correctamente${normal}`);
            }
            seleccionarAccionEntidad(entidad);
        });
    });
}

// Función para mostrar el menú principal donde se ven las entidades.
function seleccionarAccionPrincipal() {
    // Se cargan los datos y se muestra el menú.
    cargarDatos();
    mostrarMenuPrincipal();
    // Se le pide una opción al usuario.
    rl.question(`${amarillo}Seleccione una opción: ${normal}`, opcion => {
        switch (opcion) {
            case '1':
                seleccionarAccionEntidad('alumnos');
                break;
            case '2':
                seleccionarAccionEntidad('carreras');
                break;
            case '3':
                console.log(`${negritas}${morado}¡Hasta luego!${normal}`);
                guardarDatos();
                rl.close();
                break;
            default:
                console.log(`\n${rojo}Opción no válida.`);
                seleccionarAccionPrincipal();
        }
    });
}

// Función del menú de cada entidad.
function seleccionarAccionEntidad(entidad) {
    cargarDatos();
    mostrarSubMenuEntidad(entidad);
    let colores = coloresEntidad(entidad);
    rl.question(`${amarillo}Seleccione una opción en ${colores[0]}${entidad}${amarillo}:${normal} `, opcion => {
        switch (opcion) {
            case '1':
                mostrarListado(entidad);
                seleccionarAccionEntidad(entidad);
                break;
            case '2':
                agregar(entidad, entidad === 'alumnos' ? Alumno : Carrera);
                break;
            case '3':
                borrar(entidad, entidad === 'alumnos' ? Alumno : Carrera);
                break;
            case '4':
                cambiar(entidad, entidad === 'alumnos' ? Alumno : Carrera);
                break;
            case '5':
                asignarAlumnoACarrera(entidad);
                break;
            case '6':
                seleccionarAccionPrincipal();
                break;
            default:
                console.log(`\n${rojo}Opción no válida.`);
                seleccionarAccionEntidad(entidad);
        }
    });
}

// Iniciar el programa
seleccionarAccionPrincipal();