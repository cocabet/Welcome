var professorsObj;

function e() {
    var n = arguments.length;
    var element;
    if (n > 0) {
        element = document.createElement(arguments[0]);
        for (var i = 1; i < n; i++) {
            var arg = arguments[i];
            if (typeof(arg) == "string")
                arg = document.createTextNode(arg);
            element.appendChild(arg);
        }
    }
    return element;
}

function $(id) {
    var r = null;
    if (Array.isArray(id))
        r = id.map($);
    else
        r = document.getElementById(id);
    return r;
}

function get(url,Funcion) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    	//4: completado  200:respuesta corrrecta
		if (this.readyState == 4 && this.status == 200) {
			Funcion(this.responseText);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}


function get2(url,Funcion,variable) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    	//4: completado  200:respuesta corrrecta
		if (this.readyState == 4 && this.status == 200) {
			Funcion(this.responseText,variable);
		}
	};		
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function get3(url,Funcion,arreglo1,arreglo2) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    	//4: completado  200:respuesta corrrecta
		if (this.readyState == 4 && this.status == 200) {
			Funcion(this.responseText,arreglo1,arreglo2);
		}
	};		
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}


function SelectInstituto(responseText) {
	var select = $('institutos');
	var obj=JSON.parse(responseText);
	
	for (var i = 0; i <obj.length; i++) {
		select.appendChild(e('option',obj[i]['nombre']));
		var institute=select.lastChild;
		institute.setAttribute('value',obj[i]['id']);
	}

}


function SelectAnio(responseText) {
var select = $('matricula');
	var obj=JSON.parse(responseText);
	for (var i = 0; i <obj.length; i++) {

		var li = document.createElement("li");
		li.setAttribute('value',obj[i]['id']);
		var Inoption = document.createTextNode(obj[i]['id']);
		li.appendChild(Inoption);
		select.appendChild(li);
		$('matricula').addEventListener('click',GraficaMXC);
	}

}

//Graficación Matricula por Carrera
function GraficaMXC(evt) {
	var pid=evt.target.value;
	get2(urlGrupo,ObtnerDatosAnio,pid);//Obtener datos para la grafica
}

function ObtnerDatosAnio(responseText,pid) {
	var datosG = JSON.parse(responseText).filter(function(data){
		return data.anio == pid;
	});
	get2(urlCarrera,ObtenerDatosCarrera,datosG);
}


function ObtenerDatosCarrera(responseText,Arreglo) {
	var CarreraID = new Array();
	var CarreraName=new Array();
	var Process;
    var arraFrecuency=new Array();
	var obj=JSON.parse(responseText);	

	for (var i = 0; i <obj.length; i++) {
		CarreraID[i]=(obj[i]['id']);
		CarreraName[i]=(obj[i]['nombre']);
	}

	for(i = 0; i < CarreraID.length; i++) {
        Process= Arreglo.filter(function(data){
			return data.carrera_id == CarreraID[i];
		});
		var conta=0;
		for (var k = 0; k < Process.length; k++) {
			conta += Process[k].alumnos;
		}
		arraFrecuency[i]=conta;
    }
    var datos="Alumnos"
    Graficar(arraFrecuency,CarreraName,datos);
}


function MostrarProfs(responseText) {
	var specs = $('InfProf');
	var listPro = $('profesores');
	var instituto = $('institutos').value;
	var professorsObj = JSON.parse(responseText).filter(function(data){
		return data.instituto_id == instituto;
	});
		
	while(specs.hasChildNodes())
		specs.removeChild(specs.firstChild);
	
	while(listPro.hasChildNodes())
		listPro.removeChild(listPro.firstChild);	


	for (var i = 0 ; i < professorsObj.length; i++) {
        listPro.appendChild(e('option',professorsObj[i]['nombres'] + ' ' + professorsObj[i]['apellidos']));
		var opt=listPro.lastChild;
        opt.setAttribute('id',professorsObj[i]['id']);
		opt.setAttribute('value',professorsObj[i]['id']);
		$('profesores').addEventListener('click',InfoProf);
	}
}


function MosInfoProfe(responseText,pid) {
	var specs = $('InfProf');
    var profe = JSON.parse(responseText).filter(function(data){
		return data.id == pid;
	});

    while(specs.hasChildNodes())
		specs.removeChild(specs.firstChild);

	for (var i = 0 ; i < profe.length; i++) {
		specs.appendChild(e('label',"Nombre: "));
		specs.appendChild(e('label', profe[i]['nombres']));
		specs.appendChild(e('br'));
		specs.appendChild(e('label',"Apellidos: "));
		specs.appendChild(e('label',profe[i]['apellidos']));
		specs.appendChild(e('br'));
		specs.appendChild(e('label',"Grado:"));
		
		if(profe[i]['grado']==3)
			specs.appendChild(e('label',"Doctorado"));
		else if(profe[i]['grado']==2)
				specs.appendChild(e('label',"Maestría"));
			else
				specs.appendChild(e('label',"Licenciatura/Ingeniería"));	
		specs.appendChild(e('br'));
		specs.appendChild(e('label',"Correo:"));
		specs.appendChild(e('label',profe[i]['correo']));
	}
}

//Obtener un arreglo de 
function ObtIdIns(responseText ) {
	var arraIDsInst=new Array();
	var arraNameIns=new Array();
	var obj=JSON.parse(responseText);	

	for (var i = 0; i <obj.length; i++) {
		arraIDsInst[i]=(obj[i]['id']);
		arraNameIns[i]=(obj[i]['nombre']);
	}

	get3(urlProf,myFunction,arraIDsInst,arraNameIns);
}


function myFunction(responseText,ArraIDsIns,ArraNameIns) {
    var i;
    var Process;
    var arraFrecuency=new Array();
    
    for(i = 0; i < ArraIDsIns.length; i++) {
        Process= JSON.parse(responseText).filter(function(data){
			return data.instituto_id == ArraIDsIns[i];
		});
		arraFrecuency[i]=Process.length;
    }
    var datos="Profesores"
    Graficar(arraFrecuency,ArraNameIns,datos);
}


function Graficar(ArregloDatos,Etiquetas,Datos) {
	var select = $('pintar');

	while(select.hasChildNodes())
		select.removeChild(select.firstChild);

	var lienzo = document.createElement("canvas");
		lienzo.setAttribute('id','canvas');
		lienzo.setAttribute('height','700');
		lienzo.setAttribute('width','900');
		select.appendChild(lienzo);
		console.log(lienzo);

	var color = Chart.helpers.color;
	var horizontalBarChartData = {
            labels: Etiquetas,
            datasets: [{
                label: Datos,
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                borderWidth: 1,
                data: ArregloDatos
                    
        
            }]
        };


	var ctx = document.getElementById("canvas").getContext("2d");
            window.myHorizontalBar = new Chart(ctx, {
                type: 'horizontalBar',
                data: horizontalBarChartData,
                options: {
                    // Elements options apply to all of the options unless overridden in a dataset
                    // In this case, we are setting the border of each horizontal bar to be 2px wide
                    elements: {
                        rectangle: {
                            borderWidth: 2,
                        }
                    },
                    responsive: true,
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: ''
                    }
                }
            });

}


function RemoveGraphics() {
	var select = $('pintar');

	while(select.hasChildNodes())
		select.removeChild(select.firstChild);
}

function GraphicsPI(){
	get(urlIns,ObtIdIns);
}


function InfoProf(evt) {
	var pid=evt.target.value;
	get2(urlProf,MosInfoProfe,pid);
}


function ProfIns() {
	//get(url+'profesor',MostrarProfs);
	get(urlProf,MostrarProfs);
	
}




var url = 'http://edutm.utm.mx:9000/?/db/';
var urlIns='js/instituto.json';
var urlProf='js/profesor.json';
var urlCarrera='js/carrera.json';
var urlGrupo='js/grupo.json';
var urlAnio='js/anio.json';

//get(url+'instituto',SelectInstituto);
get(urlIns,SelectInstituto);
get(urlAnio,SelectAnio);

$('institutos').addEventListener('change',ProfIns);
