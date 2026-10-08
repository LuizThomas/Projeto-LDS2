<?php

$host = "127.0.0.1";
$port = "3306";
$db = "IventusBD";
$user = "root";
$senha = "aluno";

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
        $user,
        $senha
    );

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    echo "Conectado!";

} catch (PDOException $e) {
    die("Erro: " . $e->getMessage());
}