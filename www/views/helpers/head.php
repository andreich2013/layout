<title>Главная страница</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">

<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<link rel="icon" href="/favicon.ico" type="image/x-icon">

<!--[if lt IE 9]>
    <script type="text/javascript" src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
<![endif]-->

<style type="text/css">
    @-webkit-viewport{width:device-width}
    @-moz-viewport{width:device-width}
    @-ms-viewport{width:device-width}
    @-o-viewport{width:device-width}
    @viewport{width:device-width}
</style>
<script type="text/javascript">
    /*
     * hack for IEMobile 10
     */
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode(
                "@-ms-viewport{width:auto!important}"
            )
        );
        document.getElementsByTagName("head")[0].
            appendChild(msViewportStyle);
    }
</script>

<link rel="stylesheet" type="text/css" href="/css/style.css">
<!--[if IE]>
    <link rel="stylesheet" type="text/css" href="/css/style_ie.css" >
<![endif]-->
<!--[if lte IE 8]>
    <link rel="stylesheet" type="text/css" href="/css/style_ie8.css" >
<![endif]-->


<script type="text/javascript">
    /*
     * data for javascript from PHP
     */
    <?php foreach ($js as $key=>$value) {?>
            window["<?php echo $key?>"] = JSON.parse('<? echo $js[$key]?>');
    <?php }?>
</script>
<script type="text/javascript" src="/js/matchMedia/matchMedia.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.js"></script>
<script type="text/javascript" src="/js/lib.js"></script>
<script type="text/javascript" src="/js/start.js"></script>