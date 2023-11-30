export class Usuario{
    _id?: number;
    nombre: String;
    calle: String;
    no: String;
    col: String;
    cp: Number;
    correo: String;
    passwd: String;
    favoritos: string[];
    roles: string [];

    constructor(nombre: String, calle: String, no: String, col: String, cp: Number, correo: String, passwd: String){
            this.nombre = nombre;
            this.calle = calle;
            this.no = no;
            this.col = col;
            this.cp = cp;
            this.correo = correo;
            this.passwd = passwd;
            this.favoritos = [];
            this.roles = [];
        }
    }