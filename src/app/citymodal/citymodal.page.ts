import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WeatherService } from '../services/weather.service';
import { Cities } from '../Cities';

@Component({
  selector: 'app-citymodal',
  templateUrl: './citymodal.page.html',
  styleUrls: ['./citymodal.page.scss'],
})
export class CitymodalPage implements OnInit {
  citiesres: Array<Cities> = [];  
  cityselected: Cities;
  weatherdesc:Array<string> = [];
  weathericon:Array<string> = [];
  countrycode:Array<string> = [];
  weathtempdeg:Array<number> = [];

  long:string;
  lati:string;
  
  constructor(private modalCtrl:ModalController,private _weatherservice: WeatherService) { 
    let datauserinf = this._weatherservice.getuserLoc();
        datauserinf.then(
          (data)=>{
            // let lat = data['latitude']
            // let lon = data['longitude'];
            this.long = JSON.stringify(data['longitude']);
            this.lati = JSON.stringify(data['latitude']);
          }
        )

  }

  ngOnInit() {
  }

  closeModal()
  {
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
    //             this.cityselected = new Cities(city,lon,lat)
    //             console.log(data);
    //             this.modalCtrl.dismiss(this.cityselected);
    //           }
    //         )
    //     }
    //   )

      
    this._weatherservice.getCity(this.long,this.lati)
        .subscribe(
          (data)=>{
            let city = data['results'][0].formatted;
            this.cityselected = new Cities(city,this.long,this.lati);
            this.modalCtrl.dismiss(this.cityselected);
          }
        )
    
  }
  getQuery(inp: HTMLInputElement){
    let p = inp.value;
    p = p.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
    if((inp.value.replace(/\s/g, "")).length>2){    
      this.getQuery1(p);
    }else {
      this.citiesres = new Array<Cities>();
    }
    // console.log(p)
  }

  getQuery1(inp){
    this._weatherservice.getCitybyname(inp)
      .subscribe(
        (data)=>{
          this.citiesres = new Array<Cities>();
          this.weatherdesc = new Array<string>();
          this.weathericon = new Array<string>();
          this.weathtempdeg = new Array<number>();  
          this.countrycode  = new Array<string>();
          for(let da of data){
              this.citiesres.push(new Cities(da.formatted,da.geometry.lng,da.geometry.lat));
              this.countrycode .push("http://assets.ipstack.com/flags/"+(da.components['ISO_3166-1_alpha-2']).toLowerCase()+".svg");
              this.getWeather(da.geometry.lng,da.geometry.lat)
              
          }
          // console.log(data);
        }
      )
  }

  cityinfo(lon,lat,formattedname) {   
    this.cityselected = new Cities(formattedname,lon,lat)
    this.modalCtrl.dismiss(this.cityselected);
  }

  getWeather(lon,lat){
    let la = Math.round(parseFloat(lat) * 100) / 100;
    let lo = Math.round(parseFloat(lon) * 100) / 100;
    this._weatherservice.getWeather(lo,la)
      .subscribe(
        (data) => {
          // console.log(data);
          this.weatherdesc.push(data['weather'][0]['description']);
          this.weathericon.push("http://openweathermap.org/img/w/"+data['weather'][0]['icon']+".png");
          this.weathtempdeg.push(this.keltodeg(+data['main']['temp']));          
           
        }
      )

  }
  keltodeg(a){
    return Math.abs(Math.round((a - 273.15) * 100) / 100);
  }

  onCancel(a){
    this.weatherdesc = [];
    this.weathericon = [];
    this.weathtempdeg = [];  
    this.countrycode  = [];
    this.citiesres = new Array<Cities>();
  }

}
