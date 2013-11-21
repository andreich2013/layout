<?php $markup = Markup::getInstance();?>
<title>Главная страница</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">

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
    (function() {
        
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
        
    })();
</script>

<link rel="stylesheet" type="text/css" href="/fonts/font-awesome/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="/css/style.css">
<!--[if IE]>
    <link rel="stylesheet" type="text/css" href="/css/style_ie.css" >
<![endif]-->
<!--[if IE 8]>
    <link rel="stylesheet" type="text/css" href="/css/style_ie8.css" >
<![endif]-->
<!--[if IE 7]>
    <link rel="stylesheet" type="text/css" href="/fonts/font-awesome/css/font-awesome-ie7.min.css">
<![endif]-->

<script type="text/javascript">
    var markup = {};
    <?php foreach ($markup->exportToJS as $key => $value) {?>
        markup["<?php echo $key?>"] = JSON.parse('<?php echo $value?>');
    <?php }?>
        
</script>
<script type="text/javascript" src="/js/matchMedia/matchMedia.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="/js/lib/lib.js"></script>
<script type="text/javascript" src="/js/app/common.js"></script>
<script type="text/javascript" src="/js/app/index.js"></script>