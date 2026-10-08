<?php
require_once '../conexao.php';

require '../../PHPMailer/src/Exception.php';
require '../../PHPMailer/src/PHPMailer.php';
require '../../PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');

    if (empty($email)) {
        die("Por favor, informe o e-mail.");
    }

    $stmt = $pdo->prepare("SELECT id FROM usuario WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $usuario = $stmt->fetch();

    if ($usuario) {
        $token = bin2hex(random_bytes(32));
        $expira = date('Y-m-d H:i:s', strtotime('+30 minutes'));

        $sql = "UPDATE usuario SET reset_token = :token, reset_expira = :expira WHERE email = :email";
        $stmtUpdate = $pdo->prepare($sql);
        $stmtUpdate->execute([
            ':token'  => $token,
            ':expira' => $expira,
            ':email'  => $email
        ]);

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'seu-email@gmail.com';
            $mail->Password   = 'sua-senha-de-aplicativo';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;
            $mail->CharSet    = 'UTF-8';

            $mail->setFrom('seu-email@gmail.com', 'IFCE Iventus');
            $mail->addAddress($email);

            $link = "http://localhost/ifce-iventus/front/pages(html)/auth/redefinir-senha.html?token=" . $token;

            $mail->isHTML(true);
            $mail->Subject = 'Recuperação de Senha - IFCE Iventus';
            $mail->Body    = "Olá,<br><br>Recebemos uma solicitação para redefinir sua senha no IFCE Iventus.<br>Clique no link abaixo para cadastrar uma nova senha (válido por 30 minutos):<br><br><a href='{$link}'>{$link}</a>";

            $mail->send();
            header("Location: ../../front/pages(html)/auth/recuperar-senha.html?status=enviado");
            exit;

        } catch (Exception $e) {
            echo "Erro ao enviar o e-mail: {$mail->ErrorInfo}";
        }
    } else {
        header("Location: ../../front/pages(html)/auth/recuperar-senha.html?status=enviado");
        exit;
    }
}
?>