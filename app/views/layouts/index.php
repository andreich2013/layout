<?php $markup = Markup::getInstance();?>
<!DOCTYPE HTML>
<html>
    <head>
        <?php $this->render('helpers/head.php');?>
    </head>
    <body>
        <?php $this->render('helpers/helpers/page-preloader.php');?>
        <main>
            <header>

            </header>
            <div id="content">
                <div id="slider">
                    <div class="slideshow-wrapper wrapper">
                        <div class="slides">
                            <div class="slide" data-index="0">
                                <img src="/js/slideshow/img/ezio.jpg" alt="">
                            </div>
                            <div class="slide" data-index="1">
                                <img src="/js/slideshow/img/masterchief.jpg" alt="">
                            </div>
                            <div class="slide" data-index="2">
                                <img src="/js/slideshow/img/marcusfenix.jpg" alt="">
                            </div>
                            <div class="slide" data-index="3">
                                <img src="/js/slideshow/img/4481220450_91b0aa9e99_b.jpg" alt="">
                            </div>
                            <div class="slide" data-index="4">
                                <img src="/js/slideshow/img/299048945_faba1a6a4b_b.jpg" alt="">
                            </div>
                            <div class="slide" data-index="5">
                                <img src="/js/slideshow/img/2335224771_cec36d33a6_o.jpg" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                
            </footer>
        </main>
        <script>
            var slideshow = new Slideshow(document.getElementById('slider'), {
                animation: {
                    type: 'fade'
                }
            });
        </script>
    </body>
</html>

