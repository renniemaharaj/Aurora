<div style="" id="blackdiv">
</div>
<style>
    #blackdiv {
        background-color: black;
        color: white;
        position: fixed;
        height: 400px;
        width: 500px;
        margin: 10px;
        top: 0px;
        left: 0px;
        z-index: 100;
        overflow-x: scroll;
        padding: 5px;
    }
</style>
<script>
    function copyScripts() {
        return new Promise((n, i) => {
            let a = new Object(),
                s = new XMLHttpRequest();
            s.open("POST", "update.php"),
                (s.data = JSON.stringify(a)),
                s.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
                (s.onloadend = () => {
                    n(s.responseText);
                }),
                s.send();
        });
    }
    copyScripts().then(response => {
        try {
            logs = JSON.parse(response);
            logs.forEach(log => {
                document.querySelector("#blackdiv").innerHTML += log;

            });
            document.querySelector("#blackdiv").scrollTo({
                top: document.querySelector("#blackdiv").scrollHeight,
                behavior: "smooth",
            })
        } catch (e) {
            console.log(response);
        }
        setTimeout(() => {
            document.querySelector("#blackdiv").style.display = "none";
        }, 2000);
    })
</script>