<?php
    // Parametros de conexion
    $port_num = 5432;
	$basededatos = 'BaseDeDatos';
	$host_pg = 'localhost';
	$nombre_pg = 'usuario';
	$contra_pg = 'contrasena';

    try {
        // Conectar a Base de datos
        $conn = pg_connect(
            "host=".$host_pg.
            " port=".$port_num.
            " dbname=".$basededatos.
            " user=".$nombre_pg.
            " password=".$contra_pg);
    }catch (Exception $exception){
        die("No se pudo establecer la conexi&oacute;n con la base de datos. " . $exception->getMessage());
    }
?>