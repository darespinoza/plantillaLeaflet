<!DOCTYPE html>
<html lang="es">
<head>
	<title>Plantilla Leaflet - IERSE Universidad del Azuay</title>
	<link rel="shortcut icon" href="../../common/img/udalogo_32x32.png" type="image/png" />
    <meta name="theme-color" content="#0070b4">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

	<!-- Bootstrap 5.1.3   -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- jQuery 3.5.1   -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.1/jquery-ui.js"></script>

	<!-- Funciones y estilos para barras   -->
    <!-- <script src="../../common/function_bars_bs5.js"></script> -->
    <!-- <link rel="stylesheet" href="../../common/style_bar_bs5.css"> -->

    <!-- Estilos pagina -->
    <link rel="stylesheet" href="style/style_pl.css">

	<!-- Estilos Leaflet, FontAwesome, EasyButton, LocateControl, FullScreen -->
    <link rel="stylesheet" href="lib/leaflet/leaflet.css"/>
	<link rel="stylesheet" href="lib/leaflet-sidebar-v2/css/leaflet-sidebar.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="lib/Leaflet-EasyButton/src/easy-button.css">
	<link rel="stylesheet" href="lib/leaflet-locatecontrol-gh-pages/dist/L.Control.Locate.min.css">
	<link rel="stylesheet" href="lib/leaflet.fullscreen-master/Control.FullScreen.css">
</head>

<body>

	<!-- BARRAS CABECERA -->
    <?php
        // include_once("../../common/barras_cabecera_bs5.html");
    ?>

	<div class="container">
		<!-- BOOTSTRAP MODAL-->
		<div class="modal fade" id="myModal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title" id="titModal">Modal Header</h4>
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body d-flex justify-content-center">
						<p id="content"><img id="myModImg" class="img-fluid"></p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
					</div>
				</div>
			</div>
		</div>


		<!-- ENCABEZADO, FONDO -->
		<div class="mt-4 p-5 rounded" style="background-image: url('img/default_bg.jpg'); background-size: cover;">
			<div style="background-image: linear-gradient(to left, rgba(0,153,255,0), rgba(0,153,255,1)); border-radius: 3px; padding-left: 10px; padding-right: 10px;">
				<h2 style="color: white; font-weight: bold; font-size: 36px;">Título</h2>
				<h2 style="color: white; font-weight: bold;">Subtítulo</h2>
			</div>
		</div>
		
		<!-- BARRA UD ESTA EN -->
		<div class="mt-4 rounded" style="background:#D1F9FF;">
            <p style="color:#005bb8; padding: 5px;"><b>Usted está en:</b><br>TÍTULO</p>
		</div>

        <!-- Control para selección de marcador -->
		<form>
			<div class="row mt-4">
				<div class="col">
					<p style="font-weight: bold; font-size: 16px;">Seleccione un marcador: </p>
					<select class="form-control" id="markerSelect" onchange="trgMarker();" style="font-size: 16px;">
						<option>Cargando marcadores...</option>
					</select>
				</div>
			</div>
		</form>

		<!-- Sidebarv2 -->
		<div id="sidebar" class="leaflet-sidebar collapsed">
			<!-- Nav tabs -->
			<div class="leaflet-sidebar-tabs">
				<!-- Top aligned tabs -->
				<ul role="tablist">
					<li><a href="#home" role="tab"><i class="fa fa-bars active"></i></a></li>
				</ul>
			</div>

			<!-- Panel content -->
			<div class="leaflet-sidebar-content">
				<div class="leaflet-sidebar-pane" id="home">
					<h1 class="leaflet-sidebar-header">
						Leaflet SidebarV2
						<span class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></span>
					</h1>
				</div>
			</div>
		</div>

		<!-- Mapa Leaflet -->
		<div class="row mt-4" id="map_container">
			<!-- Numero de marcadores -->
			<div id="numMarkers" style="background:#D1F9FF; text-align: center;"></div>
			<!-- Mapa -->
			<div class="d-flex justify-content-center align-items-center" id="my_map" style="height: 640px;"></div>
		</div>

		<!-- Librerias Leaflet, Sidebar, EasyButton, LocateControl   -->
        <script src="lib/leaflet/leaflet.js"></script>
		<script src="lib/leaflet-sidebar-v2/js/leaflet-sidebar.js"></script>
		<script src="lib/Leaflet-EasyButton/src/easy-button.js"></script>
		<script src="lib/leaflet-locatecontrol-gh-pages/dist/L.Control.Locate.min.js" charset="utf-8"></script>
		<script src="lib/leaflet.fullscreen-master/Control.FullScreen.js"></script>
		<script src="lib/leaflet-simple-map-screenshoter-master/dist/leaflet-simple-map-screenshoter.js"></script>

		<!-- Funciones para manejo de mapas-->
		<script src="lib/funciones_map.js"></script>

		<!-- CREDITOS, RESPONSABLES Y COLABORADORES -->
		<div class="row mt-4 d-flex justify-content-center">
            <div class="col-sm-4 d-flex justify-content-center">
                <div>
                    <h2>Título</h2>
                    <h4>Subtítulo</h4>
                    <p style="font-weight: bold;">
                        &#169; <span id="yearIERSE"> - </span> IERSE - UNIVERSIDAD DEL AZUAY 
                    </p>
                    <p>
                        <img style="height: 75px;" src="img/logo-interno_IERSE.png" title="Instituto de Estudios de R&eacute;gimen Seccional del Ecuador">
                    </p>
                </div>
            </div>
            <div class="col-sm-4 d-flex justify-content-center">
                <div>
                    <p>
                        <span style="font-weight: bold;">Responsable del proyecto:</span><br>
                        JOSÉ GRUESO, MSC.<br>
                    </p>
                    <p>
                        <span style="font-weight: bold;">Colaboradores:</span><br>
                        JUAN LOPEZ, MSC.<br>
                        ZOILA VACA, MSC.<br>
                        AQUILES BAILO, MSC.<br>
                    </p>
                </div>
            </div>
            <script type="text/javascript">
				// Set current year on  IERSE <div>
				const currentYear = new Date().getFullYear();
				const spanYear = document.getElementById("yearIERSE");
				spanYear.innerHTML = currentYear;
			</script>
		</div>
	</div>

	<!-- PIE UDA-IERSE -->
    <?php
        // include_once("../../common/barra_pie_bs5.html");
    ?>

</body>
</html>
