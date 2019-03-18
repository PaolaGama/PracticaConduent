import { Component } from '@angular/core';
import * as XLSX from 'ts-xlsx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  datosMemoria: any;
  archivo: File;
  nombreArchivo = "";
  arregloAlumnos:any[] = [];
  promedioGeneral :number = 0;
  calificacionesAlumno :any[] = [];
  calMejorAlumno: any = '';
  calPeorAlumno: any = '';
  nomMejorAlumno: string = '';
  nomPeorAlumno: string = '';
  mostrarModal:boolean = false;
  public chartType: string = 'line';

  chartDatasets: Array<any> = [
    { 
      data: [], 
      label: '' 
    }
  ];

  public chartLabels: Array<any> = [];

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  cargarArchivo(event){
    this.archivo = event.target.files[0];
    this.nombreArchivo = this.archivo.name;
  }

  leerInfo(){
    if(this.archivo){
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
          this.datosMemoria = fileReader.result;
          var data = new Uint8Array(this.datosMemoria);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var nombreHojaExcel = workbook.SheetNames[0];
          var hojaExcel = workbook.Sheets[nombreHojaExcel];
          this.arregloAlumnos = XLSX.utils.sheet_to_json(hojaExcel,{raw:true});
          this.calcularPromedioAlumnos();
      }
      fileReader.readAsArrayBuffer(this.archivo);
    }else{
      document.getElementById("modalbutton").click();
    }

  }

  calcularPromedioAlumnos(){
    let acumulador = 0;
    let numAlumnos = 0;
    for(let i = 0;i<this.arregloAlumnos.length;i++){
      this.chartLabels[i] = this.arregloAlumnos[i].Nombres;
      this.calificacionesAlumno[i] = this.arregloAlumnos[i].Calificacion;
      acumulador += this.arregloAlumnos[i].Calificacion;
      numAlumnos ++;
    }
    this.asignarValoresGrafica();
    this.obtenerMejorPeorAlumno();
    this.promedioGeneral = acumulador / numAlumnos;
    
  }

  asignarValoresGrafica(){
    this.chartDatasets = [
      {
       data : this.calificacionesAlumno,
       label: 'Calificaciones de Alumnos' 
      }
    ]
  }

  obtenerMejorPeorAlumno(){
    this.calMejorAlumno =  this.arregloAlumnos[0].Calificacion;
    this.nomMejorAlumno = this.arregloAlumnos[0]['Nombres']+' '+this.arregloAlumnos[0]['Apellido Paterno']+' '+this.arregloAlumnos[0]['Apellido Materno'];
    this.calPeorAlumno = this.arregloAlumnos[0].Calificacion;
    this.nomPeorAlumno = this.arregloAlumnos[0]['Nombres']+' '+this.arregloAlumnos[0]['Apellido Paterno']+' '+this.arregloAlumnos[0]['Apellido Materno'];

    for(let i = 0;i<this.arregloAlumnos.length;i++){
      
      if(this.arregloAlumnos[i].Calificacion > this.calMejorAlumno){
        this.calMejorAlumno = this.arregloAlumnos[i].Calificacion;
        this.nomMejorAlumno = this.arregloAlumnos[i]['Nombres']+' '+this.arregloAlumnos[i]['Apellido Paterno']+' '+this.arregloAlumnos[i]['Apellido Materno'];
      }

      if(this.arregloAlumnos[i].Calificacion < this.calPeorAlumno){
        this.calPeorAlumno = this.arregloAlumnos[i].Calificacion;
        this.nomPeorAlumno = this.arregloAlumnos[i]['Nombres']+' '+this.arregloAlumnos[i]['Apellido Paterno']+' '+this.arregloAlumnos[i]['Apellido Materno'];
      }

    }
    console.log(this.arregloAlumnos[0]['Nombres']+' '+this.arregloAlumnos[0]['Apellido Materno']+' '+this.arregloAlumnos[0]['Apellido Paterno']);
  }

  

    
}
