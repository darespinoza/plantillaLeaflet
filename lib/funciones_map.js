// Leaflet var map 
var map;
// Variables globales
var markersJSON = [];
var markersMap = [];

// Valores por defecto
const max_zoom = 18;
const min_zoom = 12;
const latDef = -2.9005499;
const lonDef = -79.0045319;

// Base Map Tiles Layers
var esri_wtm = L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
});
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
});
var esri_wi = L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
});
var baseMaps = {
    "ArcGIS World Topo Map": esri_wtm,
    "OpenStreetMap": osm,
    "ESRI World Imagery": esri_wi,
};

// _______________ Datos de ejemplo
var markersJSON = [
    {
        codigo: "LOC01",
        latitud: -2.918496,
        longitud: -78.999834,
        descripcion: "Rectorado de la Universidad del Azuay",
    },
    {
        codigo: "LOC02",
        latitud: -2.885138,
        longitud: -78.98001,
        descripcion: "Aeropuerto Internacional Mariscal Lamar",
    },
    {
        codigo: "LOC03",
        latitud: -2.9016783144841307,
        longitud: -79.00442188907323,
        descripcion: "Casa de Servicio a la Sociedad de la Universidad del Azuay",
    },
    {
        codigo: "LOC04",
        latitud: -2.905497546283453,
        longitud: -79.01160042466029,
        descripcion: "Escalinata Juana de Oro, Calle Larga",
    }
];

// _______________ Ejecutar luego de la carga de la pagina
window.addEventListener('load', function() {
    // Iniiciar mapa
    init();
});

// _______________ Funcion ejecutada luego de click en marcador
function onMarkerClick(e) {
    // Obtener marcador clickeado
    var clickedMarker = e.target;

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
        var o = JSON.parse(jsonString);

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
    var sidebar = L.control.sidebar({ 
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
                enableHighAccuracy: true
            },        
    }).addTo(map);

    // _______________ Leaflet Screenshot Control
    L.simpleMapScreenshoter().addTo(map);

    // _______________ Cargar Marcadores
    cargarMarcadores_Example();
}

// _______________ Cargar marcadores consultando desde base de datos
function cargarMarcadores_DB(){

    // Borrar <options> del select de marcadores
    var select = document.getElementById("markerSelect");
    var length = select.options.length;
    for (let i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }

    try{
		// AJAX config
		$.ajax({
			type: 'GET',
			url: 'lib/getinfo_markersJSON.php',
			success: function(response){
				var markersArray = JSON.parse(response);
                var flagDraw = false;

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

					// _______________ Guardar resultado en variable global
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
                        var tmpMark =  markersJSON[index];
                        var markNow;

                        // Colores e Icono
                        var customIcon = L.icon({
                            iconUrl: "img/markejemplo.png",        
                            iconSize:     [33, 33],
                            popupAnchor:  [0, -10],
                            tooltipAnchor: [10, -10],
                        });

                        // Opciones de PopUp
                        var customOptions = {
                            'maxWidth': '250',
                            'maxHeight': '250',
                            'className' : 'custom',                            
                        }

                        // Crear PopUp
                        var customPopup = 
                            // Contenedor PopUp
                            "<div class='popup-container'>" +
                                // Titulo PopUp
                                "<div class='popup-title'>" + tmpMark.codigo + "</div>" +
                                // Contenido PopUp
                                "<div class='popup-content'>" +
                                    // Descripccion
                                    "<p>" + tmpMark.descripcion + "</p>" +
                                "</div>";
                            "</div>";

                        // Crear marcador
                        markNow = L.marker([tmpMark.latitud, tmpMark.longitud], {icon: customIcon}).bindPopup(customPopup, customOptions).bindTooltip(tmpMark.codigo).addTo(map);

                        // Enlazar listener cuando se hace click a marcador
                        markNow.on('click', onMarkerClick);

                        // Guardar marcador en arreglos
                        markersMap.push(markNow);

                        // Anadir <options> de marcadores en <select>
                        var option = document.createElement("option");
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
    var select = document.getElementById("markerSelect");
    var length = select.options.length;
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
            var tmpMark =  markersJSON[index];
            var markNow;

            // Colores e Icono
            var customIcon = L.icon({
                iconUrl: "img/markejemplo.png",        
                iconSize:     [33, 33],
                popupAnchor:  [0, -10],
                tooltipAnchor: [10, -10],
            });

            // Opciones de PopUp
            var customOptions = {
                'maxWidth': '250',
                'maxHeight': '250',
                'className' : 'custom',                            
            }

            // Crear PopUp
            var customPopup = 
                // Contenedor PopUp
                "<div class='popup-container'>" +
                    // Titulo PopUp
                    "<div class='popup-title'>" + tmpMark.codigo + "</div>" +
                    // Contenido PopUp
                    "<div class='popup-content'>" +
                        // Descripccion
                        "<p>" + tmpMark.descripcion + "</p>" +
                    "</div>";
                "</div>";

            // Crear marcador
            markNow = L.marker([tmpMark.latitud, tmpMark.longitud], {icon: customIcon}).bindPopup(customPopup, customOptions).bindTooltip(tmpMark.codigo).addTo(map);

            // Enlazar listener para cuando se haga click en marcador
            markNow.on('click', onMarkerClick);

            // Guardar marcador en arreglo
            markersMap.push(markNow);

            // Anadir <options> de marcadores en <select>
            var option = document.createElement("option");
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

// _______________ Funcion para buscar el indice de una estacion en el arreglo markers[] usando su codigo
function buscaridxMark(cod){
	var idx = -1;
	for(let i = 0; i < markersJSON.length; i++) {
		var tempMarker = markersJSON[i];
		if (cod === tempMarker.codigo){
            idx = i;
            break;
        }			
	}
	return idx;
}

// _______________ Flyto a estacion y abrir PopUp
function trgMarker(){
	// Buscar indice correspondiente en el arreglo de estaciones
	var idxMark = buscaridxMark(document.getElementById('markerSelect').value);

    // Si existe estacion, flyto y abrir popup
    if (idxMark >=  0){
        // Cerrar todos los Popups antes de hacer Flyto
        map.closePopup();

        // Obtener coordenadas y marcador
        var markerPop = markersMap[idxMark];
        var markerInf = markersJSON[idxMark];

        // Flyto a estacion        
        map.flyTo([markerInf.latitud, markerInf.longitud], max_zoom, {
            animate: true,            
        });

        // Open popup after zoomend
        // Once, after its triggered it removes listener
        map.once('zoomend ', function () {
            map.panTo([markerInf.latitud, markerInf.longitud]);
            markerPop.openPopup();
        });        
    }else{
        console.log("[ERROR] No se ha encontrado estación");
    }
}