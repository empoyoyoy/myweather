import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey:string;
  defUrl:string;
  ipAddress:any;
  long:string;
  lati:string;
  constructor(
    private _httpclient: HttpClient,
    private geolocation: Geolocation
    //private _http:Http
  ){
    this.apiKey='9ae9d93f5a80c3f1db84039850ed85ff';
    this.defUrl="http://api.openweathermap.org/data/2.5/weather?APPID="+this.apiKey+"&q=";

//    https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
    
    console.log("Service Connected!");    
   }

   getWeather(lon,lat){
    // weather?lat=35&lon=139
    this.defUrl="http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID="+this.apiKey;
    let urltar:string = this.defUrl;
    return this._httpclient.get(urltar)
      .map(
          (response) => {
              return response;
          }
      );
  }

  getCity(long,lat){
    const url = "https://api.opencagedata.com/geocode/v1/json?q="+lat+"+"+long+"&key=4512dbfa1cf04d4e88deda2d392203dc"
    return this._httpclient.get(url)
      .map(
          (response) => {
              return response;
          }
      );
  }

  getCitybyname(city){
    const url = "https://api.opencagedata.com/geocode/v1/json?q="+city+"&key=4512dbfa1cf04d4e88deda2d392203dc"
    return this._httpclient.get(url)
      .map(
          (response) => {
                let e:any[];
                e = response['results'].filter(
                    (dat) => {
                        let p = city;
                        if((dat.components.city != null) || (dat.components.town != null) || (dat.components.city_district != null)) {
                            if((dat.components.city == p) || (dat.components.town == p) || (dat.components.city_district == p)) {
                                return dat;
                            }
                        }
                    }
                );
                return e;
          }
      );
  }

  getIp(){
   return this._httpclient.get('https://jsonip.com/')
    .map(
        (ipOfNetwork) =>{
            return ipOfNetwork['ip'];
            //console.log(JSON.stringify(ipOfNetwork))
            //console.log(JSON.parse(JSON.stringify(ipOfNetwork)[0]['ip']))
        } 
    );
  }

  getlocinfo(ipAddress){
    //let ipAddress = this.getIp();
    const url = "http://api.ipstack.com/"+ipAddress+"?access_key=92392dd125395e86a9587ca665d4ec4c";
    return this._httpclient.get(url)
      .map(
          (response) => {
              return response;
          }
      );
    //return ipAddress;

  }

  getuserLoc(){
    let geoOptions: GeolocationOptions = {
      enableHighAccuracy:true,
      timeout:5000,
      maximumAge:10,
    };
   return this.geolocation.getCurrentPosition(geoOptions).then((data: Geoposition) => {
      //latitude  14.687436799999999
      //longitude 121.07120640000001
      console.log("Success", data.coords);
    //   let lon = data.coords.longitude;
    //   let lat = data.coords.latitude;
    //   this.lati = JSON.stringify(lat);
    //   this.long = JSON.stringify(lon);
    return data.coords;
      //this.getWeather(lon,lat,null)
    }, (error: PositionError) => {
      console.log("Error", error);
    });

  }


}
