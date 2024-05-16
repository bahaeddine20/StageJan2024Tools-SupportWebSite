import { Membre as MembreModel } from "../Membre/membre";

export class Activite {
    constructor(
        public id:number,
        public name:string,
        public technology:string,
        public description:string,
        public image:string,
        public equipe:MembreModel[]

    ){}
}
