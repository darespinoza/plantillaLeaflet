<?php
	try {
		// Parametros de conexion a base de datos
		require_once("connectDB.php");

		// Sentencias SQL
        $sql = "SELECT codigo, latitud, longitud, descripcion
            FROM marcadores";

		// Ejecutar consulta
        $results = pg_query($conn, $sql);

		// Fetch Associative array
		$res_array = pg_fetch_all($results);

		// Liberar result set
		pg_free_result($results);

		// Cerrar conexion a base de datos
		pg_close($conn);

		// Codificar array en formato JSON
		echo json_encode($res_array);
    }catch (Exception $exception){
        die("Error al consultar datos de marcadores. " . $exception->getMessage());
    }
?>