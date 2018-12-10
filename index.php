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
                <p>In this game, one side (the seeker) tries to send a projectile to a target in a known location but in an unknown gravitational field. The hider gets to place two planets of a certain total weight of 1000 in any location the hider wants. Then the seeker has 5 chances to shoot a projectile from a certain location but at any velocity (such that the total speed is 10). The hider also has 1 chance to shoot a projectile from that same location under the same speed constraint. In a game, each player plays both the hider and the seeker. Score of each player P is the closest distance to the target when P is the hider + cloest distance to the target when P is the seeker. The winner has the lowest score.</p>
                <p>The game is played entirely with the mouse. You will click to select planet size (split is determined by mouse horizontal position) as well as to place the planets themselves and to launch your spaceship.</p>
                <p>If you would like to take turns playing against an AI which will place planets in the same places game-over-game, supply the same random seed and mode values across multiple games.</p>
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
        initInfo("Gravity Game", "Team Reptar", "");
        var modeChoices = ['PvP','PvAI'];
        newSelect('Game Mode',modeChoices,'modeSelect');
        newTextBox('AI Placement Seed (blank for random)','seed');
        newWindowBtn(screen.availWidth, screen.availHeight,"games/gravity_game/game.html", ['modeSelect', 'seed']);
    </script>
</body>
</html>

