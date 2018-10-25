// export interface Cities {
//   cityname?: string;
//   country?:string;
//   lon?: string;
//   lat?: string;
// }

export class Cities{
    // public cityname: string;
    // public country: string;
    public formattedname: string;
    public lon: string;
    public lat: string;
   
    constructor( formattedname: string, lon: string, lat: string){
        // this.cityname = cityname;
        // this.country = country;
        this.formattedname = formattedname;
        this.lon = lon;
        this.lat = lat;
    }


} 
