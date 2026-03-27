<?php
require "db.php";

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Collect POST data and sanitize
$name = trim($_POST['name']);
$email = trim($_POST['email']);
$phone = trim($_POST['phone']);
$company = !empty($_POST['company']) ? $_POST['company'] : NULL;
$details = trim($_POST['details']);

$stmt = $conn->prepare("INSERT INTO contact_us (name, email, phone, company, details) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $email, $phone, $company, $details);

// Execute statement
if ($stmt->execute()) {
    echo "<script>
            alert('Thank you! Your request has been submitted.');
            window.location.href='/index.html'; // Redirect to homepage after submit
          </script>";
} else {
    echo "Error: " . $stmt->error;
}

// Close connections
$stmt->close();
$conn->close();
?>