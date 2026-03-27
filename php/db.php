<?php

$host = "localhost";
$username = "a175911e";
$password = "MakeMoney2025";
$database = "a175911e_opera";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>