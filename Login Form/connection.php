<?php

// Database configuration
$host = "localhost"; // Change this to your MySQL host
$username = "root"; // Change this to your MySQL username
$password = ""; // Change this to your MySQL password
$database = "weather"; // Change this to your MySQL database name

// Establish a connection to the database
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to handle feedback submissions
function submitFeedback($feedback) {
    global $conn;

    // Insert feedback into the database
    $sql = "INSERT INTO login (feedback) VALUES ('$feedback')";
    if ($conn->query($sql) === TRUE) {
        header("Location: index.html");
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the form is for signup or signin
    if (isset($_POST["signup"])) {
        // Handle signup form submission
        // Retrieve form data
        $username = $_POST["Username"];
        $email = $_POST["Email"];
        $password = $_POST["Password"];

        // Insert user data into the database
        $sql = "INSERT INTO login (Username, Email, Password) VALUES ('$username', '$email', '$password')";
        if ($conn->query($sql) === TRUE) {
            header("Location: login.html");
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif (isset($_POST["signin"])) {
        // Handle signin form submission
        // Retrieve form data
        $username = $_POST["Username"];
        $password = $_POST["Password"];

        // Retrieve user data from the database
        $sql = "SELECT * FROM login WHERE Username='$username'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // User found, verify password
            $row = $result->fetch_assoc();
            if ($password === $row["Password"]) {
                // Password verified, redirect to dashboard or homepage
                header("Location: index.html");
                exit;
            } else {
                echo "Invalid username or password";
                header("Location: login.html");
            }
        } else {
            echo "Invalid username or password";
        }
    } elseif (isset($_POST["submit_feedback"])) {
        // Handle feedback form submission
        $feedback = $_POST["feedback"];
        submitFeedback($feedback);
    }
}

$conn->close();

?>
