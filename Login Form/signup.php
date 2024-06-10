<?php
require_once "C:\xampp\htdocs\connection.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["signup"])) {
        // Signup process
        $username = mysqli_real_escape_string($conn, $_POST["Username"]);
        $email = mysqli_real_escape_string($conn, $_POST["Email"]);
        $password = mysqli_real_escape_string($conn, $_POST["Password"]);

        $sql = "INSERT INTO login (Username, Email, Password) VALUES ('$username', '$email', '$password')";
        if (mysqli_query($conn, $sql)) {
            header("Location: login.html");
            exit();
        } else {
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }
    } elseif (isset($_POST["signin"])) {
        // Signin process
        $username = mysqli_real_escape_string($conn, $_POST["Username"]);
        $password = mysqli_real_escape_string($conn, $_POST["Password"]);

        $sql = "SELECT * FROM login WHERE Username='$username'";
        $result = mysqli_query($conn, $sql);
        
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            echo "Retrieved user data: ";
            print_r($row); // Debug statement
            if (password_verify($password, $row["Password"])) {
                header("Location:index.html");
                exit();
            } else {
                echo "Invalid password";
            }
        } else {
            echo "User not found";
        }
    }
}

mysqli_close($conn);
?>
