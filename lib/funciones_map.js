// Leaflet let map 
let map;
// letiables globales
let markersJSON = [];
let markersMap = [];

// Valores por defecto
const max_zoom = 18;
const min_zoom = 12;
const latDef = -2.9005499;
const lonDef = -79.0045319;

// Base Map Tiles Layers
let esri_wtm = L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
});
let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
});
let esri_wi = L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
});
let baseMaps = {
    "ArcGIS World Topo Map": esri_wtm,
    "OpenStreetMap": osm,
    "ESRI World Imagery": esri_wi,
};

// _______________ Datos de ejemplo
markersJSON = [
    {
        codigo: "LOC01",
        latitud: -2.918496,
        longitud: -78.999834,
        descripcion: "Campus de la Universidad del Azuay",
        imgSmall: "/img/default_bg_small.jpg",
        imgBig: "/img/default_bg.jpg",
    },
    {
        codigo: "LOC02",
        latitud: -2.885138,
        longitud: -78.98001,
        descripcion: "Aeropuerto Internacional Mariscal Lamar",
        imgSmall: "/img/default_bg_small.jpg",
        imgBig: "/img/default_bg.jpg",
    },
    {
        codigo: "LOC03",
        latitud: -2.9016783144841307,
        longitud: -79.00442188907323,
        descripcion: "Casa de Servicio a la Sociedad de la Universidad del Azuay",
        imgSmall: "/img/default_bg_small.jpg",
        imgBig: "/img/default_bg.jpg",
    },
    {
        codigo: "LOC04",
        latitud: -2.905497546283453,
        longitud: -79.01160042466029,
        descripcion: "Escalinata Juana de Oro, Calle Larga",
        imgSmall: "/img/default_bg_small.jpg",
        imgBig: "/img/default_bg.jpg",
    }
];

// _______________ Ejecutar luego de la carga de la pagina
window.addEventListener('load', function() {
    // Iniiciar mapa
    init();
});

// _______________ jQuery iniciar funciones y prevenir su ejecucion antes de que el documento se cargue
$(document).ready(function(){
	/** _______________ Imagen de marcador dentro del PopUp de cada marcador, dentro del div donde se dibuja el mapa
	 * Delegar los eventos al div en donde se crearan los elementos, en lugar de los elementos creados dinamicamente
	 * https://stackoverflow.com/questions/9484295/jquery-click-not-working-for-dynamically-created-items
	 */
	$('#my_map').on( 'click', '.btn', function () {
		
		$("#titModal").text($(this).attr("title"));
		$("#myModImg").attr("src", $(this).attr("alt"));
		// Abrir modal con datos de marcador seleccionada
		$("#myModal").modal();
	});
});


// _______________ Funcion ejecutada luego de click en marcador
function onMarkerClick(e) {
    // Obtener marcador clickeado
    let clickedMarker = e.target;

    // Buscar en arreglo de marcadores
    for (let index = 0; index < markersMap.length; index++) {
        // Si se encuentra y no está seleccionado, seleccionar
        if(clickedMarker == markersMap[index]){
            if (markersJSON[index].codigo !== document.getElementById('markerSelect').value){
                document.getElementById('markerSelect').value = markersJSON[index].codigo;       
            }
        }
    }
}

/** _______________ Verificar si un objeto es del tipo JSON
 * If you don't care about primitives and only objects then this function
 * is for you, otherwise look elsewhere.
 * This function will return `false` for any valid json primitive.
 * EG, 'true' -> false
 *     '123' -> false
 *     'null' -> false
 *     '"I'm a string"' -> false
 * 
 * https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string
 */
function tryParseJSONObject (jsonString){
    try {
        let o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};

// _______________ Leaflet Setup
function init(){
    // _______________ Inicializar mapa
    map = L.map('my_map', {
        fullscreenControl: true,
        center: [latDef, lonDef],
        zoom: min_zoom,
        layers: [esri_wtm],
    });

    // _______________ Leaflet Sidebarv2
    let sidebar = L.control.sidebar({
        container: 'sidebar',
        closeButton: true,
        position: 'right', 
    }).addTo(map);

    // _______________ Add layer control
    L.control.layers(baseMaps).addTo(map);

    // _______________ Easy Button
    L.easyButton('fa-crosshairs fa-lg', function(btn, map){
        map.flyTo([latDef, lonDef], min_zoom);
    }).addTo(map);

    // _______________ Leaflet Locate Control
    L.control.locate({
        flyTo: true,
        strings: {
                title: "Ubicarme en el mapa",
                popup: "Esta es su ubicación aproximada",
                outsideMapBoundsMsg: "Estás fuera de los límites",
            },
        locateOptions: {
                enableHighAccuracy: true,
            },
    }).addTo(map);

    // _______________ Cargar Marcadores
    cargarMarcadores_Example();
}

// _______________ Cargar marcadores consultando desde base de datos
function cargarMarcadores_DB(){

    // Borrar <options> del select de marcadores
    let select = document.getElementById("markerSelect");
    let length = select.options.length;
    for (let i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }

    try{
		// AJAX config
		$.ajax({
			type: 'GET',
			url: 'lib/getinfo_markersJSON.php',
			success: function(response){
				let markersArray = JSON.parse(response);
                let flagDraw = false;

                // Comprobar si es un objeto JSON válido
                if(tryParseJSONObject(response)){
					markersArray = JSON.parse(response);
					flagDraw = true;
				}

                // Si la respuesta es un objeto JSON válido, agregar marcadores al mapa
				if(flagDraw) {
                    /*
						arregloMarcadores
						[0] codigo, 
						[1] latitud, 
						[2] longitud, 
						[3] descripcion, 
					*/

					// _______________ Guardar resultado en letiable global
					markersJSON = markersArray;

					// _______________ Posicionar marcadores
                    // Retirar marcadores existentes en el mapa
                    for (let index = 0; index < markersMap.length; index++) {
                        map.removeLayer(markersMap[index]);
                    }
                    // Vaciar arreglo de marcadores
                    markersMap.length = 0

                    // Crear marcadores nuevos
                    for (let index = 0; index < markersJSON.length; index++) {
                        // Anadir marcadores al mapa
                        let tmpMark =  markersJSON[index];
                        let markNow;

                        // Icono personalizado
                        let customIcon = L.icon({
                            iconUrl: "img/markejemplo.png",
                            iconSize:     [33, 33],
                            popupAnchor:  [0, -10],
                            tooltipAnchor: [10, -10],
                        });

                        // Opciones de PopUp
                        let customOptions = {
                            'maxWidth': '250',
                            'maxHeight': '250',
                            'className' : 'custom',
                        }

                        // Crear PopUp
                        let customPopup = 
                            // Contenedor PopUp
                            "<div class='popup-container'>" +
                                // Titulo PopUp
                                "<div class='popup-title'>" + tmpMark.codigo + "</div>" +
                                // Contenido PopUp
                                "<div class='popup-content'>" +
                                    // Descripccion
                                    "<p>" + tmpMark.descripcion + "</p>" +
                                    "<img class='btn popup-img' data-bs-toggle='modal' data-bs-target='#myModal' src='" + tmpMark.imgSmall + "' alt='" + tmpMark.imgBig + "' title='" + tmpMark.descripcion +"'>" +
                                "</div>";
                            "</div>";

                        // Crear marcador
                        markNow = L.marker([tmpMark.latitud, tmpMark.longitud], {icon: customIcon}).bindPopup(customPopup, customOptions).bindTooltip(tmpMark.codigo).addTo(map);

                        // Enlazar listener cuando se hace click a marcador
                        markNow.on('click', onMarkerClick);

                        // Guardar marcador en arreglos
                        markersMap.push(markNow);

                        // Anadir <options> de marcadores en <select>
                        let option = document.createElement("option");
                        option.text = tmpMark.descripcion;
                        option.value = tmpMark.codigo;
                        select.add(option);
                    }

                    // _______________ Mostrar numero de marcadores
                    document.getElementById("numMarkers").innerHTML = markersJSON.length + " marcadores";
				} else {
					console.log("No se han encontrado marcadores. Error en consulta." );
				}
			},
			error: function(){
				console.log("Error al consultar datos de marcadores");
			},
			complete: function(){
				console.log("Se completo la consulta de marcadores");
			}
		});
	}catch(err){
		console.log("Se ha producido un error al consultar marcadores. " + err.message);
	}
}

// _______________ Cargar marcadores consultando desde base de datos
function cargarMarcadores_Example(){

    // Borrar <options> del select de marcadores
    let select = document.getElementById("markerSelect");
    let length = select.options.length;
    for (let i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }

    try{
        // _______________ Posicionar marcadores
        // Retirar marcadores existentes en el mapa
        for (let index = 0; index < markersMap.length; index++) {
            map.removeLayer(markersMap[index]);
        }
        // Vaciar arreglo de marcadores
        markersMap.length = 0

        // Crear marcadores nuevos
        for (let index = 0; index < markersJSON.length; index++) {
            // Anadir marcadores al mapa
            let tmpMark =  markersJSON[index];
            let markNow;

            // Icono personalizado
            let customIcon = L.icon({
                iconUrl: "img/markejemplo.png",
                iconSize:     [33, 33],
                popupAnchor:  [0, -10],
                tooltipAnchor: [10, -10],
            });

            // Opciones de PopUp
            let customOptions = {
                'maxWidth': '250',
                'maxHeight': '250',
                'className' : 'custom',                            
            }

            // Crear PopUp
            let customPopup = 
                // Contenedor PopUp
                "<div class='popup-container'>" +
                    // Titulo PopUp
                    "<div class='popup-title'>" + tmpMark.codigo + "</div>" +
                    // Contenido PopUp
                    "<div class='popup-content'>" +
                        // Descripccion
                        "<p>" + tmpMark.descripcion + "</p>" +
                        "<img class='btn popup-img' data-bs-toggle='modal' data-bs-target='#myModal' src='" + tmpMark.imgSmall + "' alt='" + tmpMark.imgBig + "' title='" + tmpMark.descripcion +"'>" +
                    "</div>";
                "</div>";

            // Crear marcador
            markNow = L.marker([tmpMark.latitud, tmpMark.longitud], {icon: customIcon}).bindPopup(customPopup, customOptions).bindTooltip(tmpMark.codigo).addTo(map);

            // Enlazar listener para cuando se haga click en marcador
            markNow.on('click', onMarkerClick);

            // Guardar marcador en arreglo
            markersMap.push(markNow);

            // Anadir <options> de marcadores en <select>
            let option = document.createElement("option");
            option.text = tmpMark.descripcion;
            option.value = tmpMark.codigo;
            select.add(option);
        }

        // _______________ Mostrar numero de marcadores
        document.getElementById("numMarkers").innerHTML = markersJSON.length + " marcadores";
	}catch(err){
		console.log("Se ha producido un error al consultar marcadores. " + err.message);
	}
}

// _______________ Funcion para buscar el indice de un marcador en el arreglo markersJSON[] usando su codigo
function buscaridxMark(cod){
	let idx = -1;
	for(let i = 0; i < markersJSON.length; i++) {
		let tempMarker = markersJSON[i];
		if (cod === tempMarker.codigo){
            idx = i;
            break;
        }
	}
	return idx;
}

// _______________ Flyto a marcador y abrir PopUp
function trgMarker(){
	// Buscar indice correspondiente en el arreglo de marcadores
	let idxMark = buscaridxMark(document.getElementById('markerSelect').value);

    // Si existe marcador, flyto y abrir popup
    if (idxMark >=  0){
        // Cerrar todos los Popups antes de hacer Flyto
        map.closePopup();

        // Obtener coordenadas y marcador
        let markerPop = markersMap[idxMark];
        let markerInf = markersJSON[idxMark];

        // Flyto a marcador        
        map.flyTo([markerInf.latitud, markerInf.longitud], max_zoom, {
            animate: true,
        });

        // Abrir PopUp y al finalizar zoom quitar listener
        map.once('zoomend ', function () {
            markerPop.openPopup();
        });
    }else{
        console.log("[ERROR] No se ha encontrado marcador");
    }
}