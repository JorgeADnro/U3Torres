export class Libro{
    _id: number;
    titulo: String;
    editorial: String;
    fechpubl: String;
    gen: String;
    sinop: String;
    numpag: String;
    foto?: string;

    constructor(_id: number, titulo: String, editorial: String, fechpubl: String, gen: String, sinop: String, numpag: String, foto: string){
            this.titulo = titulo;
            this.editorial = editorial;
            this.fechpubl = fechpubl;
            this.gen = gen;
            this.sinop = sinop;
            this.numpag = numpag;
            this.foto = foto;
            this._id = _id
        }
    }