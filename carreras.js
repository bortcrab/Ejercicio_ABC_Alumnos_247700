class Carrera {
  constructor(id, nombre, alumnos) {
    this.id = id;
    this.nombre = nombre;
    this.alumnos = (alumnos !== undefined) ? alumnos : []; // Lista de alumnos en la carrera
  }
}

export default Carrera;