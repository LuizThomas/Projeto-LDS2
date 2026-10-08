<?php
session_start();

require_once '../conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['password'] ?? $_POST['senha'] ?? '';

    if (empty($email) || empty($senha)) {
        die("Erro: Por favor, preencha o e-mail e a senha.");
    }

    try {
        $sql = "SELECT id_usuario, nome, email, senha_hash, perfil FROM usuario WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':email' => $email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && password_verify($senha, $usuario['senha_hash'])) {
            $_SESSION['usuario_id']    = $usuario['id_usuario'];
            $_SESSION['usuario_nome']  = $usuario['nome'];
            $_SESSION['usuario_email'] = $usuario['email'];
            header("Location: ../../front/pages(html)/participante/dashboard.html");
            exit;

        } else {
            echo "Erro: E-mail ou senha incorreta.";
        }
        
    } catch (PDOException $e) {
        echo "Erro no banco de dados: " . $e->getMessage();
    }
}
?>