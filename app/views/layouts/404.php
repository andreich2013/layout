<?php $markup = Markup::getInstance();?>
<!DOCTYPE HTML>
<html>
    <head>
        <?php echo $this->render('helpers/head.php');?>
    </head>
    <body>
        <?php echo $this->render('helpers/page-preloader.php');?>
        <main>
            <header>

            </header>
            <div id="content">
                <form action="action">
                    <input type='checkbox' checked name='dsd' value=''>
                    <input placeholder="ololo" required type='text' name='as'>
                    <input type='radio' name='1' value=''>
                    <input type='radio' name='1' value=''>
                    <input type='radio' name='1' value=''>
                    <input type='submit' value=''>
                    <textarea name="lol"></textarea>
                </form>
            </div>
            <footer>
                
            </footer>
        </main>
    </body>
</html>

