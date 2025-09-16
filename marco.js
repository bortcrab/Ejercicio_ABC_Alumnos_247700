// Longitud del nombre más largo.
let maximoNombre = 6;
let maximoCarrera = 11; // Este es para la carrera del alumno.
let colorTabla;

export function crearMarco(lista, entidad, color) {
    colorTabla = color;

    // Con un foreach iteramos el arreglo.
    for (let elemento of lista) {
        // Evaluamos si la longitud del nombre de la entidad es más grande que la actual.
        if (elemento.nombre.length > maximoNombre) {
            maximoNombre = elemento.nombre.length; // Actualizamos el máximo.
        }
    }

    // Aquí es para calcular el máximo de la carrera en el caso de los alumnos.
    if (entidad === 'alumnos') {
        for (let elemento of lista) {
            if (elemento.carrera !== null && elemento.carrera.length > maximoCarrera) {
                maximoCarrera = elemento.carrera.length;
            }
        }
    }

    if (entidad === 'alumnos') marcoAlumnos(lista);
    if (entidad === 'carreras') marcoCarreras(lista);
    // Reseteamos los máximos
    maximoNombre = 6;
    maximoCarrera = 11;
}

function marcoAlumnos(lista) {
    // Imprimimos el borde superior.
    console.log(`\n${colorTabla}+------+${'-'.repeat(maximoNombre)}+${'-'.repeat(maximoCarrera)}+\x1b[0m`);
    console.log(`${colorTabla}|  ID  |Nombre${' '.repeat(maximoNombre - 6)}|Carrera${' '.repeat(maximoCarrera - 7)}|\x1b[0m`);
    console.log(`${colorTabla}+------+${'-'.repeat(maximoNombre)}+${'-'.repeat(maximoCarrera)}+\x1b[0m`);

    // Usamos un foreach para imprimir cada alumno.
    for (let elemento of lista) {
        let nombre = elemento.nombre;
        let carrera = (elemento.carrera !== null) ? elemento.carrera : 'Sin asignar';
        let id = elemento.id;
        // Imprimimos la fila. Los espacios los calculamos restándole la longitud de cada palabra al máximo.
        console.log(`${colorTabla}|${id + ' '.repeat(6 - id.toString().length)}|${nombre + ' '.repeat(maximoNombre - nombre.length)}|${carrera + ' '.repeat(maximoCarrera - carrera.length)}|\x1b[0m`);
    }

    // Repetimos el borde para la parte inferior.
    console.log(`${colorTabla}+------+${'-'.repeat(maximoNombre)}+${'-'.repeat(maximoCarrera)}+\x1b[0m`);
}

function marcoCarreras(lista) {
    // Imprimimos el borde superior.
    console.log(`\n${colorTabla}+------+${'-'.repeat(maximoNombre)}+-------+\x1b[0m`);
    console.log(`${colorTabla}|  ID  |Nombre${' '.repeat(maximoNombre - 6)}|Alumnos|\x1b[0m`);
    console.log(`${colorTabla}+------+${'-'.repeat(maximoNombre)}+-------+\x1b[0m`);

    // Usamos un foreach para imprimir cada carrera.
    for (let elemento of lista) {
        let nombre = elemento.nombre;
        let alumnos = elemento.alumnos.length;
        let id = elemento.id;
        // Imprimimos la fila. Los espacios los calculamos restándole la longitud de cada palabra al máximo.
        console.log(`${colorTabla}|${id + ' '.repeat(6 - id.toString().length)}|${nombre + ' '.repeat(maximoNombre - nombre.length)}|${alumnos + ' '.repeat(7 - alumnos.toString().length)}|\x1b[0m`);
    }

    // Repetimos el borde para la parte inferior.
    console.log(`${colorTabla}+------+${'-'.repeat(maximoNombre)}+-------+\x1b[0m`);
}