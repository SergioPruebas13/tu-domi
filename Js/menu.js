$(document).ready(main);
// variables
var main_productos = [];
var categoria_menu_array = [];
var id_obj,descripcion_obj,categoria_obj,menu_obj;

function main (){
    // Obtener los datos de JSON
     get_data();   
    
    // Seleccionar menu de categoria  
     $('body').on('click', '#categoria-menu-but', function(){
        cargar_categorias_menu();
    }) 
}

function get_data (){
    var array_temp =[];
    var url = window.location.search;
    var url_id = url.split(`?id=`).join("");
   
    var url = "http://127.0.0.1:5500/Data/data-base.json";
        fetch(url)
        .then(function(res){
            return res.json();
        })
        .then(function(respuesta){
            for (let i = 0; i < respuesta.comidas.length; i++) {
                
                if (respuesta.comidas[i].id == url_id) {
                    id_obj =  respuesta.comidas[i].id;
                    descripcion_obj =  respuesta.comidas[i].descripcion;
                    categoria_obj = respuesta.comidas[i].descripcion.categoria;
                    menu_obj = respuesta.comidas[i].menu;
                    
                    var obj = {id_obj,descripcion_obj,categoria_obj,menu_obj};
                    array_temp.push(obj);
                }
            }
           cargar_data(array_temp);  
        })    
        array_temp = main_productos;  
}

function cargar_data (data){
    var info_tienda= document.getElementById('info-tienda');
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
                </div>
                `;
    }
    info_tienda.innerHTML += html;
    cargar_categorias_menu_combobox();
}

function cargar_categorias_menu_combobox (){ 
    categoria_menu_array = main_productos[0].menu_obj;
    var bandera = 0;
    var bandera2 = 0;
    var selector = document.querySelector('#categoria-menu-combobox');

           for (let i = 0; i < (categoria_menu_array.length); i++) {               
                   selector.options[i] = new Option(`${categoria_menu_array[i].categoria_menu}`.replace(/\b[a-z]/g,c=>c.toUpperCase())); 
           }
           cargar_categorias_menu();
}

function cargar_categorias_menu (){
    
    var productos_menu = document.getElementById('productos-menu');
    var selec = document.querySelector('#categoria-menu-combobox');
    var html = "";
    var band = 0;
    var arra_temp_menu =[];

    console.log(selec.value);
    console.log(categoria_menu_array);

    for (let i = 0; i < categoria_menu_array.length; i++) {
       if (selec.value.toLowerCase() == categoria_menu_array[i].categoria_menu) {
        //  console.log(categoria_menu_array[i].descripcion_menu);
            arra_temp_menu = categoria_menu_array[i].descripcion_menu;
                
                if (arra_temp_menu == undefined) {
                    band = 1;
                }
                else
                {
                    for (let i = 0; i < arra_temp_menu.length; i++) {
                        html += `
                            <div class="productos-menu">
                                <div class="productos-menu-descripcion">
                                    <p>
                                        <strong>${arra_temp_menu[i].nombre.replace(/\b[a-z]/g,c=>c.toUpperCase())}</strong> <br><br>
                                        <span>${arra_temp_menu[i].descripcion}</span>
                                    </p>
                                </div>
                                <div class="pedido-anadir">
                                    <h4>Precio: <span>$ ${new Intl.NumberFormat().format(arra_temp_menu[i].valor)}</span></h4>
                                    <button id="pedido-anadir-butt">Añadir a Pedido</button>
                                </div>
                            </div>
                                `;
                    }
                }        
       }
    }

    console.log(band);

    if (band == 1) {
        productos_menu.innerHTML = 
                `<div class="no-menu">
                    <p>No Hay Menú Que Mostrar</p>
                 </div>
                `;
    }else{
        productos_menu.innerHTML = "";
        productos_menu.innerHTML += html;

    }

     
}

