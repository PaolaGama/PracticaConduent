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
  //promedio por grado
  promedioPrimerGrado: number = 0;
  promedioSegundoGrado: number = 0;
  promedioTercerGrado: number = 0;
  promedioPorGrado :any[] = [];
  //grafica
  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }
  
  /**Grafica Calificaciones Generales */
  public chartTypeGeneral: string = 'bar';

  public chartDatasetsGeneral: Array<any> = [
    { 
      data: [], 
      label: '' }
  ];

  public chartLabelsGeneral: Array<any> = [];

  /**Asigna los valores a graficar */
  asignarValoresGraficaGeneral(){
    this.chartDatasetsGeneral = [
      {
      data : this.calificacionesAlumno,
      label: 'Calificaciones de Alumnos' 
      }
    ]
  }
  /**Fin Grafica Calificaciones Generales */

  /**Grafica Promedio por Grado*/
  public chartTypeGrado: string = 'pie';
  
  chartDatasetsGrado: Array<any> = [
    { 
      data: [], 
      label: '' 
    }
  ];
  
  public chartLabelsGrado: Array<any> = ['1er Grado', '2do Grado', '3er Grado'];

  public chartColorsGrado: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870'],
      borderWidth: 2,
    }
  ];

  /**Asigna los valores a graficar */
  asignarValoresGraficaGrado(){
    this.chartDatasetsGrado = [
      {
       data : this.promedioPorGrado,
       label: 'Promedio por Grado' 
      }
    ]
  }
  /**Fin Grafica Promedio por Grado */

  /**Carga archivo en memoria */
  cargarArchivo(event){
    this.archivo = event.target.files[0];
    this.nombreArchivo = this.archivo.name;
  }

  /**Lee los datos del archivo Excel */
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
          this.obtenerPromedioPorGrado();
      }
      fileReader.readAsArrayBuffer(this.archivo);
    }else{
      document.getElementById("modalbutton").click();
    }

  }

  /**Calcula el promedio general de los alumnos */
  calcularPromedioAlumnos(){
    let acumulador = 0;
    let numAlumnos = 0;
    for(let i = 0;i<this.arregloAlumnos.length;i++){
      this.chartLabelsGeneral[i] = this.arregloAlumnos[i].Nombres;
      this.calificacionesAlumno[i] = this.arregloAlumnos[i].Calificacion;
      acumulador += this.arregloAlumnos[i].Calificacion;
      numAlumnos ++;
    }
    this.asignarValoresGraficaGeneral();
    this.obtenerMejorPeorAlumno();
    this.promedioGeneral = acumulador / numAlumnos;
    
  }

  /**Obtiene el nombre completo y calificacion del peor y mejor alumno */
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
  }

  /**Obtener Promedio por Grado */
  obtenerPromedioPorGrado(){
    let contPrimerGrado = 0, acumPrimerGrado = 0;
    let contSegundoGrado = 0, acumSegundoGrado = 0;
    let contTercerGrado = 0, acumTercerGrado = 0;
    for(let i = 0;i<this.arregloAlumnos.length;i++){
        switch (this.arregloAlumnos[i].Grado){
          case 1:
            acumPrimerGrado += this.arregloAlumnos[i].Calificacion;
            contPrimerGrado ++;
            break;
          case 2:
            acumSegundoGrado += this.arregloAlumnos[i].Calificacion;
            contSegundoGrado ++;
            break;
          case 3:
            acumTercerGrado += this.arregloAlumnos[i].Calificacion;
            contTercerGrado ++;
            break;
        }
      }
    this.promedioPrimerGrado = acumPrimerGrado / contPrimerGrado;
    this.promedioSegundoGrado = acumSegundoGrado / contSegundoGrado;
    this.promedioTercerGrado = acumTercerGrado / contTercerGrado;
    Array.prototype.push.apply(
      this.promedioPorGrado, [this.promedioPrimerGrado, this.promedioSegundoGrado, this.promedioTercerGrado])
      //console.log(this.promedioPorGrado);
      this.asignarValoresGraficaGrado();
    }
    
  }

