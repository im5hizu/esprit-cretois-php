<?php
declare(strict_types=1);
require_once("../include/_connection.php");
require_once("../include/functions.php");

ob_start();
session_start();
error_reporting(E_ALL);

if($_POST) {
    $ident = $_POST['username'];
    $postPw = $_POST['password'];

    $sql = "SELECT ident, mdp FROM `admin`
    WHERE ident = :ident
    ";

    $sth = $dbh->prepare($sql);
    $sth->bindParam(':ident', $ident, PDO::PARAM_STR);
    $sth->execute();

    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    $result_nbr = $sth->rowCount();

    if(isset($result[0]['mdp'])){
        $hashedPw = $result[0]['mdp'];
    }else{
        $hashedPw = '';
    }
    
    if(empty($ident) || empty($postPw)) {
        $msg_error = "Merci de rentrer vos identifiants";
    } else {
        if(password_verify($postPw, $hashedPw)) {           
            $_SESSION['username'] = $ident;

            $expiration = time() + (30 * 60);
            $cookie_name = "userLoggedIn";
            $cookie_value = $ident;
            setcookie($cookie_name, $cookie_value, $expiration, "/");

            header('Location: back-office.php');
            exit(); // Ajout d'un exit après la redirection
        } elseif($result_nbr < 1) {
            $msg_error = "Identifiant ou mot de passe incorrect";
        }else {
            $msg_error = "Mot de passe incorrect";
        }
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
</head>
<body>
    <?php if(isset($msg_error)):?>
        <p><?= $msg_error?></p>
    <?php endif; ?>
    <form action="<?= $_SERVER['PHP_SELF']?>" method="POST">
        <label for="username">Nom d'utilisateur:</label>
        <input type="text" name="username" id="username">
        <label for="password">Mot de passe:</label>
        <input type="password" name="password" id="password">
        <input type="submit" value="Connexion" id="adminConnect">
    </form>
</body>
</html>
