<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create a New Aurora</title>
    <link rel="stylesheet" href="-template/css/footer.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0;
            background-color: #f0f0f0;
            padding-bottom: 50px;
        }

        .form-container,
        .search-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            text-align: center;
            margin: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .form-container h1,
        .search-container h2 {
            margin-top: 0;
            color: #333;
        }

        .form-container p,
        .search-container p {
            color: #666;
        }

        .form-container form,
        .search-container form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form-container input[type="text"],
        .search-container input[type="text"] {
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }

        .form-container input[type="submit"],
        .search-container input[type="submit"] {
            padding: 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        .form-container input[type="submit"]:hover,
        .search-container input[type="submit"]:hover {
            background-color: #0056b3;
        }

        .auroras-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            max-width: 1200px;
            width: 100%;
        }

        .aurora-tile {
            background: white;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            text-align: left;
            width: 100%;
            max-width: 300px;
            transition: box-shadow 0.3s ease, transform 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .aurora-tile:hover {
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
            transform: translateY(-5px);
        }

        .aurora-tile:hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: -75%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.1) 100%);
            transform: skewX(-25deg);
            transition: left 0.75s ease-in-out;
        }

        .aurora-tile:hover::before {
            left: 125%;
        }

        .aurora-tile h3 {
            margin-top: 0;
            color: #333;
        }

        .aurora-tile p {
            color: #666;
        }

        .footer-bottom {
            margin-top: 20px;
            text-align: center;
            color: #666;
        }
    </style>
    <script>
        function filterAuroras() {
            const searchInput = document.querySelector("#search-input").value.toLowerCase();
            const auroraTiles = document.querySelectorAll(".aurora-tile");
            auroraTiles.forEach(tile => {
                const name = tile.querySelector("a").textContent.toLowerCase();
                const keywords = tile.querySelector(".keywords").textContent.toLowerCase();
                const description = tile.querySelector(".description").textContent.toLowerCase();
                if (name.includes(searchInput) || keywords.includes(searchInput) || description.includes(searchInput)) {
                    tile.style.display = "block";
                } else {
                    tile.style.display = "none";
                }
            });
        }
    </script>
</head>

<body>
    <div class="form-container">
        <h1>Create a New Aurora</h1>
        <p>An Aurora is a personalized, instanced website. You can create and configure the instance using a
            configuration interface. Start by
            providing
            a unique name for
            your new
            Aurora below to get started.</p>
        <form action="post-starter.php" method="post">
            <input type="text" name="aurora_name" placeholder="Enter name" required>
            <input type="submit" value="Create">
        </form>
    </div>

    <h2>Discover Auroras</h2>
    <div class="search-container">
        <form onsubmit="return false;">
            <input type="text" id="search-input" placeholder="Search by name, keywords, or description"
                oninput="filterAuroras()">
        </form>
    </div>
    <div class="auroras-container">
        <?php include 'list-auroras.php'; ?>
    </div>
    <div class="footer-bottom">
        &copy; 2024 Aurora TT. All rights reserved.
    </div>
</body>

</html>