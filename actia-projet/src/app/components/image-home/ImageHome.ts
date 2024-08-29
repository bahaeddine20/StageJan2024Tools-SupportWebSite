export class ImageHome {
    id: number;
    nom: string;
    type: string;
    picByte?: Uint8Array; // Utilisez Uint8Array pour les tableaux de bytes
  
    constructor(id: number, nom: string, type: string, picByte?: Uint8Array) {
      this.id = id;
      this.nom = nom;
      this.type = type;
      this.picByte = picByte;
    }
  }
  