<!DOCTYPE html>
<html>
<head>
    <?php $base = "" ?>
    <base href="">
    <script src="js/jquery-2.2.4.min.js"></script>
    <script src="js/facebox.js"></script>
    <script src="js/gameSettings.js"></script>
    <link rel="stylesheet" type="text/css" href="css/facebox.css"/>
    <link rel="stylesheet" type="text/css" href="css/main.css"/>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
    <script type="text/javascript">
jQuery(document).ready(function($) {
                $('a[rel*=facebox]').facebox()
                            
})
    </script>
    </head>
<body>
    <div class="container">
        <?php include $base."header.php"; ?>
        <nav>
            <ul>
                <li><a href="">Home</a></li>
            </ul>
            
        </nav>
        <article>
            <h1 id="gameName"></h1>
            <h3 id="groupName"></h3>
            <div id="gameDesc"></div>
            <h4>Instructions:</h4>
            <div class="jumbotron">
                <p> <b>1v1 Play: Play both as Hider and Seeker. </b></p>
                <p> (Both players want to) Hit the target (as close as possible) while dogding the planets! </p>
                <p> Round 1. P1 (Hider) vs P2(Seeker) 
                <ul>
                    <li>P1 selects location of planets [and press submit]</li>
                    <li>P2 selects angle of fire [submit], gets 5 turns (planets hidden)</li>
                    <li>P1 selects angle of fire [submit], gets 5 turns (planets visible)</li>
                    <li>(Both players) can use one boost each</li>
                </ul>
                <p>Round 2. P2(Hider) vs P1(Seeker) </p>
            </div>
            <h4>Leaderboard:</h4>
            <div id="scoreArea", class="jumbotron">
            </div>
            <h3>Play game in pop up window:</h3>
            <form id="gameSettings" class="well"></form>
<!--            <iframe src="games/gravity_game/blank.html" class="game" width="1" height="1"></iframe>-->
        </article>
        <?php include $base."footer.php"; ?>
    </div>
    <script type="text/javascript">
        initInfo("Space Wars", "Team Greedy God", "");
        var modeChoices = ['PvP'];
        newSelect('Game Mode',modeChoices,'modeSelect');
        newTextBox('AI Placement Seed (blank for random)','seed');
        newWindowBtn(screen.availWidth, screen.availHeight,"game.html", ['modeSelect', 'seed']);
    </script>
</body>
</html>
