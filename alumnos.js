class Alumno {
    constructor(id, nombre, carrera) {
        this.id = id;
        this.nombre = nombre;
        this.carrera = (carrera !== undefined) ? carrera : null; // Inicialmente sin asignar a ninguna carrera
    }
}

export default Alumno;
