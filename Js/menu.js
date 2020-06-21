$(document).ready(main);
// variables
var main_productos = [];
var categoria_menu_array = [];
var id_obj,descripcion_obj,categoria_obj,menu_obj;
var nombre_menu , descripcion_menu , valor_menu , id_menu, cantida_menu;
var check_Cart = 0;
var num_band = 0;

function main (){
    // Obtener los datos de JSON
     get_data(); 
     verify_(); 
    
    $('body').on('change', '#categoria-menu-combobox', function(){
        cargar_categorias_menu();
    });

     //-------------------Llamada a la funcion de Mostrar carrito 
     $('body').on('click', '#button-tiket', function(){
        if (check_Cart==0) {
            $('.pedido-tiket').addClass('Active');
            check_Cart=1;
        }
        else{
            $('.pedido-tiket').removeClass('Active');
            check_Cart=0;
        }      
    })

    // --------------------------Llamada a la funcion de Añadir a Pedido
    $('body').on('click', '.pedido-anadir-butt', function(){
        var id_desc_menu = $(this).attr('id_desc_menu');
        // enlistar_producto_menu(id_desc_menu);
        GuardarDatosLS(id_desc_menu);
        pintar_cantidad_carrito();
    }) 

    // -----------------------------Limpiar Tiket 
    $('body').on('click','#limpiar-tiket-button',function(){
        localStorage.removeItem('product_cart_menu');
        CargarDatosLS();
        pintar_cantidad_carrito();
    })

     // -----------------------------Solicitud de envio 
     $('body').on('click','.button-tiket',function(){
        SendMessageTiket();
    })

    
}
// ----------------------------------------------- Obtener datos de DB
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

// ----------------------------------------------- Cargar datos de empresas 
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

// ----------------------------------------------- Cargar las categorias en el combobox principal 
function cargar_categorias_menu_combobox (){ 
    categoria_menu_array = main_productos[0].menu_obj;
    var selector = document.querySelector('#categoria-menu-combobox');

        if (categoria_menu_array != undefined) {
            for (let i = 0; i < (categoria_menu_array.length); i++) {               
                selector.options[i] = new Option(`${categoria_menu_array[i].categoria_menu}`.replace(/\b[a-z]/g,c=>c.toUpperCase())); 
            }
            cargar_categorias_menu();
        }           
}

//------------------------------------------------ Cargar el menu de la empresa
function cargar_categorias_menu (){
    
    var productos_menu = document.getElementById('productos-menu');
    var selec = document.querySelector('#categoria-menu-combobox');
    var html = "";
    var band = 0;
    var arra_temp_menu =[];

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
                                    <button class="pedido-anadir-butt" id_desc_menu="${arra_temp_menu[i].id_descripcion_menu}" >Añadir a Pedido</button>
                                </div>
                            </div>
                                `;
                    }
                }        
       }
    }

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

// ----------------------------------------------- GUARDAR DATOS AL LS
function GuardarDatosLS(id_del_producto){

    var url = window.location.search;
    var url_id = url.split(`?id=`).join("");
    var selec = document.querySelector('#categoria-menu-combobox');
    var band = 0;
    var arra_temp_menu =[];
    var productos_Carro;
    var id_repetido;
    
    for (let i = 0; i < categoria_menu_array.length; i++) {
        if (selec.value.toLowerCase() == categoria_menu_array[i].categoria_menu) {
             arra_temp_menu = categoria_menu_array[i].descripcion_menu;
             if (arra_temp_menu == undefined) {
                 band = 1;
             }
             else
             {
                 for (let i = 0; i < arra_temp_menu.length; i++) {
                     if (arra_temp_menu[i].id_descripcion_menu == id_del_producto) {
                         productos_Carro = 
                            {
                                id_category: url_id*1,
                                id_menu: `${selec.value.toLowerCase()}${arra_temp_menu[i].id_descripcion_menu}`,
                                nombre_menu: arra_temp_menu[i].nombre,
                                descripcion_menu: arra_temp_menu[i].descripcion,
                                valor_menu: arra_temp_menu[i].valor,
                                cantida_menu: 1
                            }
                            // console.log(productos_Carro);
                            id_repetido = productos_Carro.id_menu;
                            // console.log(id_repetido);
                            // var prueba = productos_Carro.id_menu.split(`${selec.value.toLowerCase()}`).join("");
                            // console.log(prueba);
                     }
                 }
             }            
         }
     }

        if (localStorage.getItem('product_cart_menu') === null) {
            let product_cart_menu = [];
            product_cart_menu.push(productos_Carro);
            localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
                CargarDatosLS();
        }else{
            let product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
            var verificar = buscarRepetido(id_repetido);

            // console.log(verificar)
            if (verificar == 0) {
                product_cart_menu.push(productos_Carro);
                localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
                CargarDatosLS();
            }   
        }
} 

//------------------------------------------------ Cargar Datos del Carrito de Compras en el LS
function CargarDatosLS(){
    
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    let principal_tiket_scroll = document.getElementById('principal-tiket-scroll');
    // console.log(product_cart_menu.length);
    if (product_cart_menu==null) {
        principal_tiket_scroll.innerHTML = "";
    }else{
        principal_tiket_scroll.innerHTML = "";
        for (let i = 0; i < product_cart_menu.length; i++) {
            var valor_producto = (product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu);
            principal_tiket_scroll.innerHTML += 
                    `
                    <div class="productos-enlistados">
                        <div class="productos-enlistados-header">
                            <div class="delete-enlistado">
                                <button id="" onclick="EliminarDatos('${product_cart_menu[i].id_menu}')">Eliminar de Pedido</button>
                            </div>
                            <div class="title-enlistado">
                                <strong>${product_cart_menu[i].nombre_menu.replace(/\b[a-z]/g,c=>c.toUpperCase())}</strong>
                            </div>
                        </div>
                        <div class="productos-enlistados-descripcion">
                            <p>
                                <span>${product_cart_menu[i].descripcion_menu}</span>
                            </p>
                        </div>
                        <div class="prod-list-precio-cantidad">
                            <div class="precio-cantidad">
                                Precio: <span>$ ${new Intl.NumberFormat().format(valor_producto)}</span> <br>
                                Cantidad: <span>${product_cart_menu[i].cantida_menu}</span>
                            </div>
                            <div class="button-cantidad">
                                <button onclick="quitarCantidad('${product_cart_menu[i].id_menu}')">-</button>
                                <input type="text" value="${product_cart_menu[i].cantida_menu}" disabled/>
                                <button onclick="agregarCantidad('${product_cart_menu[i].id_menu}')">+</button>
                            </div>
                        </div>
                </div>
                    `;
        }
    }  
    calcular_total_tiket();
}

//------------------------------------------------ Funcion patra Evaluar el total
function calcular_total_tiket(){
    var total=0;
    var total_tiket = document.getElementById('total-tiket-value');

    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));

    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
               total = total + ((product_cart_menu[i].cantida_menu)*product_cart_menu[i].valor_menu);
        }
    }  
    // console.log(total);
    total_tiket.innerHTML = new Intl.NumberFormat().format(total);
}

//------------------------------------------------ Funcion para agreagar cantidad a el pedido
function agregarCantidad (id_ls){
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            if (product_cart_menu[i].id_menu == id_ls) {
                product_cart_menu[i].cantida_menu = product_cart_menu[i].cantida_menu + 1;
            }
        }
    } 
    localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
    CargarDatosLS();
    calcular_total_tiket();
}

//------------------------------------------------ Funcion para Quitar cantidad a el pedido
function quitarCantidad (id_ls){
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    

    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            if (product_cart_menu[i].id_menu == id_ls) {
                if (product_cart_menu[i].cantida_menu > 1) {
                    product_cart_menu[i].cantida_menu = product_cart_menu[i].cantida_menu - 1;
                }else{
                    num_band = num_band + 1;
                    if (num_band > 5) {
                        alert('No Puede ser menor que 1')   
                        num_band = 0;
                    }
                }
            }
        }
    } 
    localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
    CargarDatosLS();
    calcular_total_tiket();
}

// ----------------------------------------------- Funcion para enviar mensaje en Whatsapp
function SendMessageTiket (){

    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var message = "";
    var number = "573103368887";
    var valor_total = 0;

    if (product_cart_menu==null) {
        
    }else{
        for (let i= 0; i < product_cart_menu.length; i++) {
                valor_total = valor_total + (product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu);
                message += ` 
                            | - PRODUCTO ${i+1}
                            - Categoria: ${product_cart_menu[i].nombre_menu.replace(/\b[a-z]/g,c=>c.toUpperCase())}
                            - Descripcion: ${product_cart_menu[i].descripcion_menu}
                            - Cantidad: ${product_cart_menu[i].cantida_menu}
                            - Valor: $ ${new Intl.NumberFormat().format((product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu))} - |
                             `;
        }
        message += ` ---------- Valor Total: ${new Intl.NumberFormat().format(valor_total)}`;
    }   

    // console.log(message);
    
    var url = `https://api.whatsapp.com/send?phone=${number}&text=${message}`;

    window.open(url);
}

//-----------------------Eliminar tareas de Tiket de compras 
function EliminarDatos(id_menu){
    
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));

    for (let i = 0; i < product_cart_menu.length; i++) {
        if (product_cart_menu[i].id_menu == id_menu) {
            product_cart_menu.splice(i,1);
        }
    }
    localStorage.setItem('product_cart_menu',JSON.stringify(product_cart_menu));
    CargarDatosLS();
    calcular_total_tiket();
    pintar_cantidad_carrito();
}

//------------------------------------------------ Funcion para Buscar si hay productos repetidos 
function  buscarRepetido(id_del_producto){
    var bol = 0;
    var dos = id_del_producto;
    let product_cart = JSON.parse(localStorage.getItem('product_cart_menu'));

    for (let i = 0; i < product_cart.length; i++) {
        var uno = product_cart[i].id_menu;
        
        if (uno == dos) {
            // console.log('No haga nada')
            bol=1;
        }else{
            // console.log('Ingrese Nuevo Producto')
        }
    }

    return bol;
}

// ----------------------------------------------- Verificar tiket de pagina 
function verify_ (){
    if (verify_category() == 0) {
        localStorage.removeItem('product_cart_menu');
        CargarDatosLS();
     }else{
        CargarDatosLS();
     }
     pintar_cantidad_carrito();
}

// ----------------------------------------------- Verificar en que pagina se encuentra para borrar el tiket
function verify_category (){

    var url = window.location.search;
    var url_id = url.split(`?id=`).join("");
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var retu = 0;

    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            
            if (product_cart_menu[i].id_category == (url_id*1)) {
                retu = 1;
                break;
            }
        }
    }   
    return retu;
}

// ----------------------------------------------- Pintar Cantidad de Carrito 
function pintar_cantidad_carrito (){
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var cantidad_pedido_mostrar = document.querySelector('.cantidad-pedido-mostrar'); 

    if (product_cart_menu == null || product_cart_menu.length == 0) {
        cantidad_pedido_mostrar.innerHTML = "0";
        $('.cantidad-pedido-mostrar').removeClass('Active-cantidad-pedido');
    }else{
        cantidad_pedido_mostrar.innerHTML = "1";
        $('.cantidad-pedido-mostrar').addClass('Active-cantidad-pedido');
    }
}

