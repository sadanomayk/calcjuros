<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $to = "artvin.stud@gmail.com";  // Substitua pelo seu e-mail
    $subject = "Solicite uma ferramenta";
    $body = "Nome: $name\nE-mail: $email\n\nMensagem:\n$message";

    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "E-mail enviado com sucesso!";
    } else {
        echo "Erro ao enviar o e-mail.";
    }
} else {
    echo "Método inválido.";
}
?>
