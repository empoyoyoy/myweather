import { Component, ViewChild, ElementRef } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { Cities } from '../Cities';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';

import { ModalController, Platform } from '@ionic/angular';
import { CitymodalPage } from '../citymodal/citymodal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})


export class HomePage {
  
  city:string;
  rescity:string;
  rescountry:string;
  resstate:string;
  weatherdesc:string;
  weathericon:string;
  weathtempdeg:number;
  weathtempfar:number;
  weathhumidity:number;
  weathwindspeed_mps:number;
  
  countrycode:string;

  weathpreassure: string;
  weathtempdegmin:number;
  weathtempdegmax:number;

  weathloc: string;
  citiesres: Array<Cities> = [];  
  formattedname: Array<string> = [];
  lon: Array<string> = [];
  lat:  Array<string> = [];
  colsize:number = 1;

  citiesressing: Cities;

  @ViewChild('cityinp') cityinp: ElementRef;

  constructor(
    private _weatherservice: WeatherService,
    public modalController: ModalController, 
    private geolocation: Geolocation,
    private platform : Platform
  )
  {

    platform.ready().then(
      () => {
      //  this._weatherservice.getuserLoc();
      //  this.getWeather(this._weatherservice.long,this._weatherservice.lati,null)
        let datauserinf = this._weatherservice.getuserLoc();
        datauserinf.then(
          (data)=>{
            // console.log(data['longitude'])
            this.getWeather(data['longitude'],data['latitude'],null)
          }
        )
      }
    )
    //console.log(this._weatherservice.long)
      
//      console.log("asdasd   "+ datauserinf);
        
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   // resp.coords.latitude
    //   // resp.coords.longitude
    //  }).catch((error) => {
    //    console.log('Error getting location', error);
    //  });
   
      

    // this._weatherservice.getIp()
    //   .subscribe(
    //     (data)=>{
    //       console.log(data);
    //       this._weatherservice.getlocinfo(data)
    //         .subscribe(
    //           (data)=>{
    //             let lat = data['latitude']
    //             let lon = data['longitude'];
    //             let city = data['city'] + ' ' +data['country_code'];
    //             this.getWeather(lon,lat,city)
    //           }
    //         )
    //     }
    //   )
    
  }



  async moveToFirst()
  {
    let modal = await this.modalController.create({
    component: CitymodalPage
  });
    modal.present();
    const { data } = await modal.onWillDismiss();
//    console.log(data);
    this.getWeather(data.lon,data.lat,data.formattedname);
  }

  keltodeg(a){
    return Math.abs(Math.round((a - 273.15) * 100) / 100);
  }
  degtofa(a){
    return Math.abs(Math.round((a * 9/5 + 32 ) * 100) / 100)
  }

  // getQuery(inp: HTMLInputElement){
  //   if((inp.value.replace(/\s/g, "")).length>2){    
  //     this._weatherservice.getCitybyname(inp.value)
  //       .subscribe(
  //         (data)=>{
  //           console.log(data)
  //           this.citiesres = new Array<Cities>();
  //           for(let da of data){
  //              this.formattedname.push(da.formatted);
  //              this.citiesres.push(new Cities(da.formatted,da.geometry.lng,da.geometry.lat));
  //           }
  //            console.log(this.citiesres);             
  //         }
  //       )
  //   }else {
  //     this.citiesres = new Array<Cities>();
  //   }
  // }

  getWeather(lon,lat,loc){
    let la = Math.round(parseFloat(lat) * 100) / 100;
    let lo = Math.round(parseFloat(lon) * 100) / 100;
    this._weatherservice.getWeather(lo,la)
      .subscribe(
        (data) => {
          // console.log(data);
          this.weatherdesc = data['weather'][0]['description'];
          this.weathericon = "http://openweathermap.org/img/w/"+data['weather'][0]['icon']+".png";
          this.weathtempdeg = this.keltodeg(+data['main']['temp']);          
          this.weathtempfar = this.degtofa(this.weathtempdeg);          
          this.weathhumidity = +data['main']['humidity'];
          this.weathwindspeed_mps = +data['wind']['speed'];
          if(loc === null){
            this._weatherservice.getCity(lon,lat)
              .subscribe(
                (data)=>{
                  // console.log(data['results'][0].formatted);
                  this.weathloc = data['results'][0].formatted;
                }
              )
          }else{
            this.weathloc = loc;
          }
          
//          this.countrycode = "http://openweathermap.org/images/flags/"+(data['sys'].country).toLowerCase()+".png"; 
          this.countrycode = "http://assets.ipstack.com/flags/"+(data['sys'].country).toLowerCase()+".svg";
          let ee = this.gettime(parseInt(data['sys'].sunrise));
          
          this.weathpreassure = data['main'].pressure;
          this.weathtempdegmin = this.keltodeg(parseFloat(data['main'].temp_min));
          this.weathtempdegmax = this.keltodeg(parseFloat(data['main'].temp_max));                    
        }
      )

  }

  gettime(ee){
    let date = new Date(ee*1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();
  
    // Will display time in 10:30:23 format
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
  }

}


