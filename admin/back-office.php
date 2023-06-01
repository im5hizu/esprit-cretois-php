<?php
require_once("../include/_connection.php");
require_once("../include/functions.php");

ob_start();
session_start();
error_reporting(E_ALL);

$compared = sessionCookieCompare();
if ($compared == 1) {

    $username = $_COOKIE['userLoggedIn'];
    $hello = 'Bonjour '.$username;

    $sql = "SELECT `role` FROM `admin` 
            WHERE `ident` = :ident";

    $sth = $dbh->prepare($sql);
    $sth->bindParam(':ident', $username, PDO::PARAM_STR);
    $sth->execute();

    $adminLevel = $sth->fetchAll(PDO::FETCH_ASSOC);
    $adminLevel = $adminLevel['0']['role'];

    $itemList = showProducts($dbh);
    $nbrOfItems = count($itemList);


} else {
    $hello = "Vous n'êtes pas connecté!";
}

if($_POST) {
    foreach($_POST as $key => $value) {
        ${$key} = $value;
    }
    $tab_return_errors = valid_form();

    if($tab_return_errors[0] === 5) {
        $upload_path = $tab_return_errors[1];


        // selection de l'id de la catégorie pour l'insertion dans la table produits
        $sql = "SELECT `id`  FROM `categories`
                WHERE `nom_categorie` = '$category'";

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $categoryIdArray = $sth->fetch(PDO::FETCH_ASSOC);
        $categoryId = $categoryIdArray['id'];


        // selection de l'id du ou des tags pour l'insertion dans la table produits
        $tabTags = array(); // Tableau vide pour stocker les tags
        foreach ($tab_tags as $tagPicked) {
            $sql = "SELECT id FROM `tags` WHERE tags = :tag";
            $sth = $dbh->prepare($sql);
            $sth->bindParam(':tag', $tagPicked, PDO::PARAM_STR);
            $sth->execute();
            $tagsIdArray = $sth->fetch(PDO::FETCH_ASSOC);
            if ($tagsIdArray) {
                $tagsId = $tagsIdArray['id'];
                $tabTags[] = $tagsId;
            }
        }

        $sql = "INSERT INTO `produits` (image, titre, stock, prix, prix_promo, id_categorie, id_tags, createur)
                VALUES (:image, :titre, :stock, :prix, :prix_promo, :id_categorie, :id_tags, :createur)";

        $sth = $dbh->prepare($sql);
        $sth->bindParam(':image', $upload_path, PDO::PARAM_STR);
        $sth->bindParam(':titre', $name, PDO::PARAM_STR);
        $sth->bindParam(':stock', $stock, PDO::PARAM_INT);
        $sth->bindParam(':prix', $price, PDO::PARAM_INT);
        $sth->bindParam(':prix_promo', $pricePromo, PDO::PARAM_INT);
        $sth->bindParam(':id_categorie', $categoryId, PDO::PARAM_STR);

        $tagIds = implode(',', $tabTags); // Convertir le tableau de tags en une chaîne séparée par des virgules
        $sth->bindParam(':id_tags', $tagIds, PDO::PARAM_STR);

        $sth->bindParam(':createur', $username, PDO::PARAM_STR);
        $sth->execute();


        $_SESSION['username'] = $username;
        header('Location: back-office.php');
        ob_end_flush();
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Back office</title>
    <style>
        .error{
            background: red;
            color: white
        }

        img#itemPhoto {
            width: 250px;
            height: 150px
        }

        table.customTable {
        width: 100%;
        background-color: #FFFFFF;
        border-collapse: collapse;
        border-width: 2px;
        border-color: black;
        border-style: solid;
        color: #000000;
        text-align: center;
        }

        table.customTable td, table.customTable th {
        border-width: 2px;
        border-color: black;
        border-style: solid;
        padding: 5px;
        }

        table.customTable thead {
        background-color: #7EA8F8;
        }
    </style>
</head>
<body>
    <h1><?php echo $hello ?></h1>
<?php if(isset($username)):?>
    <h3>Niveau d'administration: <?php echo $adminLevel ?> </h3>
    <div id='addProductDiv'>
        <?php if ($_POST) : ?>
            <?php foreach($_POST as $key => $value) {
                ${$key} = $value;
            } ?>
                <?php if(isset($tab_return_errors) && $tab_return_errors[0] === true) : ?>
                    <p class="error"><?= $tab_return_errors[1]; ?></p>
                <?php endif;?>
        <?php endif; ?>

        <h3>Ajouter un produit:</h3>
        <form action="" method="post" enctype="multipart/form-data" id='formAdd'>
            <fieldset style="display: grid; width: fit-content;">
                <label for="name">Titre du produit:</label>
                <input type="text" name="name" id="name" value='<?php if(isset($name)) {
                    echo $name;
                }?>'>

                <label for="image">Image:</label>
                <input type="file" name="image" id="image">

                <label for="stock">Quantité en stock:</label>
                <input type="number" name="stock" id="stock" value="<?php if(isset($stock)) {
                    echo $stock;
                } ?>">

                <label for="price">Prix du produit:</label>
                <input type="number" name='price' id='price' step="any" value="<?php if(isset($price)) {
                    echo $price;
                } ?>">

                <label for="pricePromo">Prix en promotion (optionnel):</label>
                <input type="number" name="pricePromo" id="pricePromo" step="any" value="<?php if(isset($pricePromo)) {
                    echo $pricePromo;
                } ?>">

                <label for="category">Catégorie:</label>
                <?php $data_categories = ['alcools', 'aperitifs', 'confitures-miels', 'douceurs', 'huile-olive']; ?>

                <select id='category' name='category'>
                <?php if (isset($category)) : ?>
                            <option value="<?= $category; ?>"><?= $category; ?></option>
                        <?php else : ?>
                            <option value="">--Catégories--</option>
                        <?php endif; ?>

                        <?php foreach ($data_categories as $categ) : ?>
                            <option value="<?= $categ; ?>"><?= $categ; ?></option>
                        <?php endforeach; ?>
                </select>
                <fieldset style="display: flex; justify-content: space-around">
                    <legend>Tags:</legend>
                    <?php $data_tags = ['Sale', 'Sucre', 'Bio']; ?>
                    <?php foreach ($data_tags as $key => $tag) : ?>
                        <p><?= $tag ?></p>

                        <?php if (isset($tab_tags)) {
                            $checked = "";
                            foreach ($tab_tags as $tag_choice) {
                                if ($tag == $tag_choice) {
                                    $checked = 'checked';
                                }
                            }
                        } else {
                            $checked = "";
                        }

                        ?>
                        <input type="checkbox" name="tab_tags[]" id="<?= $tag; ?>" value="<?= $tag; ?>" <?= $checked ?>>
                    <?php endforeach; ?>
                </fieldset>
                <input type="submit" value="Ajouter un produit" style="width: 50%; justify-self: center; margin-top: 10px;">
            </fieldset>
            

            <input type="hidden" name="creator" value='<?= $username?>'>
        </form>
    </div>
    
    <?php if(!empty($itemList)):?>
                <h3>Produit(s) existant(s) <?= $nbrOfItems;?>:</h3>
                <table style='margin-bottom: 50px' class='customTable'>
                    <tr>
                        <th>Id</th>
                        <th>Image</th>
                        <th>Titre</th>
                        <th>Stock</th>
                        <th>Prix</th>
                        <th>Prix en promotion</th>
                        <th>Catégorie</th>
                        <th>Tags</th>
                        <th>Créateur</th>
                    </tr>
                <?php foreach($itemList as $item): ?>
                    <tr>
                <?php foreach($item as $fieldType => $value): ?>
                <?php if($fieldType == 'image'): ?>
                    <td><?php echo '<img src='."$value".' id="itemPhoto" >'; ?></td>
                <?php else:?>
                    <td><?php echo $value; ?></td>
                <?php endif; ?>
            <?php endforeach; ?>
        </tr>
            <?php endforeach; ?>

                </table>
    <?php endif;?>

<?php endif;?>
</body>
</html>