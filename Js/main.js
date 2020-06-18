$(document).ready(main);
// variables
var main_productos = [];

var id_obj,descripcion_obj,categoria_obj;


function main (){
    // Obtener los datos de JSON
     get_data();
    
     $('body').on('click', '#buscar-categoria', function(){
        caragar_categoria();
    }) 
}

// Cargar data
function get_data (){
    var array_temp =[];
    
   
    var url = "http://127.0.0.1:5500/Data/data-base.json";
    
        fetch(url)
        .then(function(res){
            return res.json();
        })
        .then(function(rep){
           for (let i = 0; i < rep.comidas.length; i++) {
                id_obj =  rep.comidas[i].id;
                descripcion_obj =  rep.comidas[i].descripcion;
                categoria_obj = rep.comidas[i].descripcion.categoria;
                
                var obj = {id_obj,descripcion_obj,categoria_obj};
                array_temp.push(obj);
           }
           cargar_data(array_temp);
           cargar_categorias_combobox();        
        })    
        array_temp = main_productos;  
}

function cargar_data (data){
    var empresas_reciente = document.getElementById('empresas_reciente');
    var html = "";

    for (let i = 0; i < data.length; i++) {
        html += `
                <div class="card-empresas">
                    <div class="card-opciones"></div>
                    <div class="card-image">
                        <img src="${data[i].descripcion_obj.img}">
                    </div>
                    <div class="card-descripcion">
                        <p>
                            <strong>Nombre:</strong> ${data[i].descripcion_obj.nombre} <br>
                            <strong>Producto:</strong> ${data[i].descripcion_obj.producto} <br>
                            <strong>Local:</strong> ${data[i].descripcion_obj.local}
                        </p>
                    </div>
                    <div class="ver-menu">
                        <a href="/Menu/menu.html?id=${data[i].id_obj}">Ver Menú</a>
                    </div>
                </div>
                `;
    }
     
    empresas_reciente.innerHTML += html;
}

function cargar_categorias_combobox (){
     var newArray = removeDuplicates(main_productos,"categoria_obj");
     var bandera = 0;
     var bandera2 = 0;
     var selector = document.querySelector('#categorias-productos');

            for (let i = 0; i < (newArray.length+2); i++) {

                if (bandera==0) {
                    if (bandera2==0) {
                        selector.options[i] = new Option(`Selecciona una categoria`);
                        bandera2=1;
                    }else{
                        selector.options[i] = new Option(`Todas`);
                        bandera=1;
                    }                                   
                }else{
                    selector.options[i] = new Option(`${newArray[i-2].categoria_obj}`.replace(/\b[a-z]/g,c=>c.toUpperCase()));
                }  
                            
            }
}

function removeDuplicates(originalArray, prop) {//Eliminar Duplicados de JSON
    var newArray = [];
    var lookupObject  = {};
    
    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

function caragar_categoria (){
    var num_filtro = 0;
    var filtroArray = [];
    var selec = document.querySelector('#categorias-productos');
    var title = document.querySelector('#titulo-recientes');
    var empresas_reciente = document.querySelector('#empresas_reciente');
    

            for (let i = 0; i < main_productos.length; i++) {
                if (selec.value.toLowerCase() == main_productos[i].categoria_obj ) {
                    filtroArray[num_filtro] =  main_productos[i];
                    num_filtro++;
                }
            }
            if (selec.value == 'Selecciona una categoria' || selec.value == 'Todas') {
                  filtroArray = main_productos;
            }
            empresas_reciente.innerHTML = "";
            if (selec.value == 'Selecciona una categoria') {
                title.innerHTML = ` <h3>Recientes</h3>`;
            }else{
                title.innerHTML = ` <h3>${selec.value}</h3>`;
            }
            cargar_data(filtroArray);
}

