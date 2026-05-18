<?php
/**
 * SHEFA — shefa.php
 * Traitement du formulaire de contact + redirection WhatsApp
 */

define('SHEFA_WHATSAPP', '2250759582002');

// Nettoyage des données
function clean(string $input): string {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Si ce n'est pas une soumission POST, on redirige vers le formulaire
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// Récupération des champs
$nom         = clean($_POST['nom']         ?? '');
$prenom      = clean($_POST['prenom']      ?? '');
$tel         = clean($_POST['tel']         ?? '');
$email       = clean($_POST['email']       ?? '');
$description = clean($_POST['description'] ?? '');

// Validation
$errors = [];
if (empty($nom))         $errors[] = 'Le nom est obligatoire.';
if (empty($prenom))      $errors[] = 'Le prénom est obligatoire.';
if (empty($tel))         $errors[] = 'Le numéro de téléphone est obligatoire.';
if (empty($email))       $errors[] = "L'adresse e-mail est obligatoire.";
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL))
                         $errors[] = "L'adresse e-mail n'est pas valide.";
if (empty($description)) $errors[] = 'La description du projet est obligatoire.';

// S'il y a des erreurs → retour au formulaire avec message
if (!empty($errors)) {
    $errorMsg = urlencode(implode(' | ', $errors));
    header("Location: index.html?errors={$errorMsg}#contact");
    exit;
}

// Construction du message WhatsApp
$message  = "*Bonjour SHEFA !* 👋\n\n";
$message .= "Je souhaite discuter d'un projet avec vous.\n\n";
$message .= "*Nom :* {$nom}\n";
$message .= "*Prénom :* {$prenom}\n";
$message .= "*Téléphone :* {$tel}\n";
$message .= "*E-mail :* {$email}\n\n";
$message .= "*Description du projet :*\n{$description}\n\n";
$message .= "_Message envoyé depuis le site SHEFA_";

// Redirection directe vers WhatsApp
$whatsappURL = "https://wa.me/" . SHEFA_WHATSAPP . "?text=" . urlencode($message);
header("Location: {$whatsappURL}");
exit;
?>
