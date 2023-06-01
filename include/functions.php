<?php
require_once('define.php');
require_once('_connection.php');

function valid_form() : array {

    if ($_POST) {
        $msg_error = "Veuillez renseigner les champs suivant(s)<br>";
        // traitement des input, select, textarea
        foreach ($_POST as $key => $value) {
            ${$key} = $value;
            if (empty($value)) {
                if($key == 'pricePromo') {
                    continue;
                }
                $key = display_label($key);
                $msg_error .= $key;
                $msg_error .= "<br>";
                $error = true;
            }
        }

        if(empty($tab_tags)){
            $error = true;
            $msg_error .= 'Tag(s) <br>';
        }


        // traitement de l'upload du fichier
        if (isset($_FILES)) {

            if (empty($_FILES['image']['tmp_name'])) {
                $msg_error .= 'Votre photo? ';
                $error = true;
            } else {
                $tab_response = upload_photo('image');
            }

            // reponse de la fonction upload_photo ds functions.php
            if (isset($tab_response) && $tab_response[0] === false) {
                $error = true;
                $msg_error .= $tab_response[1];
            }
        } // fin if isset $_FILES



        // traitement du formulaire si pas d'erreur
        if (empty($error) && isset($tab_response) && $tab_response[0] === true) {
            $tab_return_errors = [5, $tab_response[1]];
            // recup de l'url de la photo du tableau de retour de la fonction upload_photo
            $url_upload = $tab_response[1];
            // mises en session
            $_SESSION = $_POST;
            $_SESSION['photo'] = $url_upload;


        } else {
            $tab_return_errors = [$error, $msg_error];
        }
    } // end if POST

    return $tab_return_errors;
}


function upload_photo(string $name) : array {    
    // var_dump($_SESSION['photo']); 
    
     // Gestion des erreurs
     $error_upload = $_FILES[$name]['error'];
   
     switch($error_upload) {
         case 1:
             $error = true;
             $msg_error = "Taille max du fichier 2M ( upload_max_filesize directive in php.ini";
             break;
             // ne pas se servir de MAX_FILE_SIZE: facilement detounable
         case 2:
             $error = true;
             $msg_error = "The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.";
             break;
         case 3:
             $error = true;
             $msg_error = "The uploaded file was only partially uploaded. ";
             break;
         case 4:
             $error = true;
             $msg_error = "No file was uploaded.";
             break;
         case 6:
             $error = true;
             $msg_error = "Missing a temporary folder. ";
             break;
         case 7:
             $error = true;
             $msg_error = " Failed to write file to disk";
             break;
         case 8:
             $error = true;
             $msg_error = " A PHP extension stopped the file upload";
             break;

         /* ou bien
         case 2:
         case 3:
         case 4:
         case 6:
         case 7:
         case 8:
            $error = true;
            $msg_error = "Problème de téléchargement";
            break;
         */
        
         // Pas d'erreur
         case 0:
             // controle de la taille du fichier
             $size = $_FILES[$name]['size'];
             if($size > MAX_SIZE_UPLOAD) {
                 $error = true;
                 $msg_error = "La taille de votre fichier ne doit pas dépasser ". round(MAX_SIZE_UPLOAD/1024, 0). "Ko";
             }

             // controle de la dimension
             $photo_tmp = $_FILES[$name]['tmp_name'];            
             // destructuration
             list($width, $height) = getimagesize($photo_tmp);             

             if($width > MAX_WIDTH) {
                 $error = true;
                 $msg_error = "La photo est trop grande(".$width."px) <br> Largeur max autorisée:".MAX_WIDTH."px";
             }         

     } // fin switch 

     // Enregistrement de la photo
     if(empty($error)) {
         // creation d'un dossier s'il n'existe pas
         if(!file_exists('upload')) {
             //var_dump('upload don\'t exist');
             $upload = mkdir('upload/', 0777); // renvoie true si ok
             if(!$upload) {
                 $error = true;
                 die("Dossier d'upload non créé"); // die stop l'execution du script;
                 $msg_error = "Dossier d'upload non créé";
             }

         } else {
             $upload_dir = "upload/";
             // on recupere le nom du fichier
             $photo_name = basename($_FILES[$name]['name']);
             // tout en minuscule
             $photo_name = strtolower($photo_name);
             // on supprime les espaces
             $photo_name = str_replace(' ', '', $photo_name);
             // traitement des caractères spéciaux
             $photo_name = replace_special_caract($photo_name);             
             // URL de la photo
             $upload_file = $upload_dir.$photo_name;
             
             // si on modifie la photo: on supprime l'ancienne
             /*
             if(isset($_SESSION['photo'])) {                
                if($upload_file !== $_SESSION['upload_photo']) {
                    unlink($_SESSION['photo']);
                }
             }
             */

             // deplacement de la photo du dossier temporaire vers le dossier créé
             $move = move_uploaded_file($_FILES[$name]['tmp_name'], $upload_file);
             // controle du deplacement
             if($move) { 
                $tab_response = [true, $upload_file ];
             } else {                
                die( "Problème de téléchargement");               
             }
         }         
     // si erreurs
     } else {
        $tab_response = [$error, $msg_error];       
     }

     return $tab_response;
}

function display_label(string $key): string
    {
        switch ($key) {
            case 'name':
                $key = 'Titre du produit';
                break;
            case 'stock':
                $key = 'Quantité en stock';
                break;
            case 'price':
                $key = 'Prix de l\'article';
                break;
            case 'category':
                $key = 'Catégorie';
                break;
            case 'image':
                $key = 'image';
                break;
            default:
                $key = "";
        }
        return $key;
    }

    function replace_special_caract(string $string) : string {
        $search  = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ');
        $replace = array('A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y');
        $MaChaine = str_replace($search, $replace, $string);
        //return utf8_encode($string); // attention methode deprecié dpuis PHP 8.2.0.
        return iconv('ISO-8859-1', 'UTF-8', $string);
    }

function sessionCookieCompare(): bool {
    if(isset($_COOKIE['userLoggedIn']) && isset($_SESSION['username'])){
        $cookieValue = $_COOKIE['userLoggedIn'];
        $sessionValue = $_SESSION['username'];
    }else{
        $sessionValue = '1';
        $cookieValue = '2';
        $compared = false;
    }

    if($cookieValue === $sessionValue){
        $compared = true;
    }else {
        $compared = false;
    }
return $compared;
}

function showProducts($string) :array {
    $sql = "SELECT p.id, p.image, p.titre, p.stock, p.prix, p.prix_promo, c.nom_categorie, GROUP_CONCAT(t.tags) AS tags, p.createur
            FROM produits p
            INNER JOIN categories c ON p.id_categorie = c.id
            INNER JOIN tags t ON FIND_IN_SET(t.id, p.id_tags) > 0
            GROUP BY p.id";

    $sth = $string->prepare($sql);
    $sth->execute();

    $itemList = $sth->fetchAll(PDO::FETCH_ASSOC);
    return $itemList;
}