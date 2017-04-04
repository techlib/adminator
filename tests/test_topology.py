import flexmock
from adminator.topology_agent import ConMapHTMLParser, AGUpdater

real_html = '''
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>AMPTRAC Analyzer (ID=1)</title>
<link media="all" href="/FS/analyzer1.css" type="text/css" rel="stylesheet">
<link media="all" href="/FS/analyzer2.css" type="text/css" rel="stylesheet">
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
<link type="image/x-icon" href="/FS/favicon.ico" rel="SHORTCUT ICON">
<script type="text/javascript">

function reload_page()
{
	window.location.reload(true);
}

function download_file(fileURL)
{
    window.location.assign(fileURL);
}

</script>

<style media="all" type="text/css">

/* Styles for the ConnMap table elements */

td.connmap-na   { cursor: pointer; background-color: lightGray; }
td.connmap-clr  { cursor: pointer; background-color: white; }
td.connmap-con  { cursor: pointer; background-color: lime; }
td.connmap-dis  { cursor: pointer; background-color: red; }
td.connmap-lock { cursor: pointer; background-color: yellow; }
td.connmap-err  { background-color: blue; }
td.connmap-db25 { background-color: beige; }

</style></head>
<body>
<table id="frame" cellspacing="0" cellpadding="0" border="0">
<thead>
<tr>
<td rowspan="2">
<img style="margin: 5px 0pt 5px 5px;" src="/FS/TELogo.gif"/>
</td>
<td id="naviTop" colspan="2">
<a href="http://www.te.com/industry/enterprisenetworks/">Go to Enterprise Networks Web Site</a>
<a href="/Logout.html" style="position: absolute; right: 10px;" >Log Out</a>
</td>
</tr>
<tr>
<td id="naviMain" colspan="2">
<ul>
<li>
<a href="/index.html">Home</a>
</li>
<li>
<a href="/NetworkSettings.html">Settings</a>
</li>
<li>
<a class="selected" href="/ConnMap.html">Maps</a>
</li>
<li>
<a href="/AlarmsLog.html">Logs</a>
</li>
</ul>
</td>
</tr>
<tr id="lines">
<td id="left">
<img align="middle" src="/FS/shadow-navi-top.gif"/>
</td>
<td id="centre">
</td>
<td style="vertical-align: top;">
<img align="middle" src="/FS/lines-right.gif"/>
</td>
</tr>
</thead>
<tbody>
<tr>
<td id="naviSide" style="text-align: center;">
<table cellspacing="0" cellpadding="0" style="display: inline;">
<tbody>
<tr>
<td colspan="2" class="leftHeader" height="22">
Maps
</td>
</tr>
<tr>
<td colspan="2" class="blueLine" height="2">
</td>
</tr>
<tr>
<td width="12" height="24">
<a href="/ConnMap.html">
<img border="0" src="/FS/dots.gif"/>
</a>
</td>
<td>
<a class="boldTxtGlobal" href="/ConnMap.html">
Connection Map</a>
</td>
</tr>
<tr>
<td width="12" height="24">
<a href="/ZoneMap.html">
<img border="0" src="/FS/arrow.gif"/>
</a>
</td>
<td>
<a class="txtGlobal" href="/ZoneMap.html">
Zone Map</a>
</td>
</tr>
</tbody>
</table>
</td>
<td id="content" rowspan="2" colspan="2">
<form action="/ProcessForm/ConnMap.html" method="post">
<table cellpadding="1" border="0" style="text-align: center; width: 80%;" title="Connection Map">
<tr>
<td align="center">
<table cellpadding="5" border="0" style="text-align: center; width: 70%;">
<tr style="text-align: center; width: 100%;">
<td colspan="2">&nbsp;</td></tr>
<tr>
<td class="header2Bg" colspan="2">
<span class="boldText">
Connection Map</span>
</td>
</tr>
<tr>
<td colspan="2">&nbsp;</td></tr>
<tr>
<td colspan="2">
<table border="1" style="border-collapse: collapse; text-align: center;" cellpadding="0px">
<tr>
<td>
<table border="1" style="border-collapse: collapse; text-align: center;" cellpadding="3px">
<tr>
<td class="connmap-db25">&nbsp;DB#01&nbsp;</td>
</tr>
<tr>
<td class="connmap-db25">&nbsp;DB#02&nbsp;</td>
</tr>
<tr>
<td class="connmap-db25">&nbsp;DB#03&nbsp;</td>
</tr>
<tr>
<td class="connmap-db25">&nbsp;DB#04&nbsp;</td>
</tr>
<tr>
<td class="connmap-db25">&nbsp;DB#05&nbsp;</td>
</tr>
<tr>
<td class="connmap-db25">&nbsp;DB#06&nbsp;</td>
</tr>
<tr>
<td class="connmap-db25">&nbsp;DB#07&nbsp;</td>
</tr>
</table>
</td>
<td>
<table border="1" style="border-collapse: collapse; text-align: center;" cellpadding="3px">
<tr>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 06">01</td>
<td class="connmap-clr" title="No Connection">02</td>
<td class="connmap-clr" title="No Connection">03</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 11">04</td>
<td class="connmap-clr" title="No Connection">05</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 05">06</td>
<td class="connmap-clr" title="No Connection">07</td>
<td class="connmap-clr" title="No Connection">08</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 20">09</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 10">10</td>
<td class="connmap-clr" title="No Connection">11</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 12">12</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 09">13</td>
<td class="connmap-clr" title="No Connection">14</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 08">15</td>
<td class="connmap-clr" title="No Connection">16</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 07">17</td>
<td class="connmap-clr" title="No Connection">18</td>
<td class="connmap-clr" title="No Connection">19</td>
<td class="connmap-clr" title="No Connection">20</td>
<td class="connmap-clr" title="No Connection">21</td>
<td class="connmap-clr" title="No Connection">22</td>
<td class="connmap-clr" title="No Connection">23</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 04">24</td>
</tr>
<tr>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 14">01</td>
<td class="connmap-clr" title="No Connection">02</td>
<td class="connmap-clr" title="No Connection">03</td>
<td class="connmap-clr" title="No Connection">04</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 03">05</td>
<td class="connmap-clr" title="No Connection">06</td>
<td class="connmap-clr" title="No Connection">07</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 17">08</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 22">09</td>
<td class="connmap-clr" title="No Connection">10</td>
<td class="connmap-clr" title="No Connection">11</td>
<td class="connmap-clr" title="No Connection">12</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 13">13</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 01">14</td>
<td class="connmap-clr" title="No Connection">15</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 19">16</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 21">17</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 18">18</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 15">19</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#04 Port 16">20</td>
<td class="connmap-clr" title="No Connection">21</td>
<td class="connmap-clr" title="No Connection">22</td>
<td class="connmap-clr" title="No Connection">23</td>
<td class="connmap-clr" title="No Connection">24</td>
</tr>
<tr>
<td class="connmap-clr" title="No Connection">01</td>
<td class="connmap-clr" title="No Connection">02</td>
<td class="connmap-clr" title="No Connection">03</td>
<td class="connmap-clr" title="No Connection">04</td>
<td class="connmap-clr" title="No Connection">05</td>
<td class="connmap-clr" title="No Connection">06</td>
<td class="connmap-clr" title="No Connection">07</td>
<td class="connmap-clr" title="No Connection">08</td>
<td class="connmap-clr" title="No Connection">09</td>
<td class="connmap-clr" title="No Connection">10</td>
<td class="connmap-clr" title="No Connection">11</td>
<td class="connmap-clr" title="No Connection">12</td>
<td class="connmap-clr" title="No Connection">13</td>
<td class="connmap-clr" title="No Connection">14</td>
<td class="connmap-clr" title="No Connection">15</td>
<td class="connmap-clr" title="No Connection">16</td>
<td class="connmap-clr" title="No Connection">17</td>
<td class="connmap-clr" title="No Connection">18</td>
<td class="connmap-clr" title="No Connection">19</td>
<td class="connmap-clr" title="No Connection">20</td>
<td class="connmap-clr" title="No Connection">21</td>
<td class="connmap-clr" title="No Connection">22</td>
<td class="connmap-clr" title="No Connection">23</td>
<td class="connmap-clr" title="No Connection">24</td>
</tr>
<tr>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 14">01</td>
<td class="connmap-clr" title="No Connection">02</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 05">03</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 24">04</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 06">05</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 01">06</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 17">07</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 15">08</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 13">09</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 10">10</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 04">11</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 12">12</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 13">13</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 01">14</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 19">15</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 20">16</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 08">17</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 18">18</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 16">19</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#01 Port 09">20</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 17">21</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#02 Port 09">22</td>
<td class="connmap-clr" title="No Connection">23</td>
<td class="connmap-clr" title="No Connection">24</td>
</tr>
<tr>
<td class="connmap-clr" title="No Connection">01</td>
<td class="connmap-clr" title="No Connection">02</td>
<td class="connmap-clr" title="No Connection">03</td>
<td class="connmap-clr" title="No Connection">04</td>
<td class="connmap-clr" title="No Connection">05</td>
<td class="connmap-clr" title="No Connection">06</td>
<td class="connmap-clr" title="No Connection">07</td>
<td class="connmap-clr" title="No Connection">08</td>
<td class="connmap-clr" title="No Connection">09</td>
<td class="connmap-clr" title="No Connection">10</td>
<td class="connmap-clr" title="No Connection">11</td>
<td class="connmap-clr" title="No Connection">12</td>
<td class="connmap-clr" title="No Connection">13</td>
<td class="connmap-clr" title="No Connection">14</td>
<td class="connmap-clr" title="No Connection">15</td>
<td class="connmap-clr" title="No Connection">16</td>
<td class="connmap-clr" title="No Connection">17</td>
<td class="connmap-clr" title="No Connection">18</td>
<td class="connmap-clr" title="No Connection">19</td>
<td class="connmap-clr" title="No Connection">20</td>
<td class="connmap-clr" title="No Connection">21</td>
<td class="connmap-clr" title="No Connection">22</td>
<td class="connmap-clr" title="No Connection">23</td>
<td class="connmap-clr" title="No Connection">24</td>
</tr>
<tr>
<td class="connmap-clr" title="No Connection">01</td>
<td class="connmap-clr" title="No Connection">02</td>
<td class="connmap-clr" title="No Connection">03</td>
<td class="connmap-clr" title="No Connection">04</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#06 Port 11">05</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#06 Port 12">06</td>
<td class="connmap-clr" title="No Connection">07</td>
<td class="connmap-clr" title="No Connection">08</td>
<td class="connmap-clr" title="No Connection">09</td>
<td class="connmap-clr" title="No Connection">10</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#06 Port 05">11</td>
<td class="connmap-con" title="Connected to: Analyzer 1 DB#06 Port 06">12</td>
<td class="connmap-clr" title="No Connection">13</td>
<td class="connmap-clr" title="No Connection">14</td>
<td class="connmap-clr" title="No Connection">15</td>
<td class="connmap-clr" title="No Connection">16</td>
<td class="connmap-clr" title="No Connection">17</td>
<td class="connmap-clr" title="No Connection">18</td>
<td class="connmap-clr" title="No Connection">19</td>
<td class="connmap-clr" title="No Connection">20</td>
<td class="connmap-clr" title="No Connection">21</td>
<td class="connmap-clr" title="No Connection">22</td>
<td class="connmap-clr" title="No Connection">23</td>
<td class="connmap-clr" title="No Connection">24</td>
</tr>
<tr>
<td class="connmap-clr" title="No Connection">01</td>
<td class="connmap-clr" title="No Connection">02</td>
<td class="connmap-clr" title="No Connection">03</td>
<td class="connmap-clr" title="No Connection">04</td>
<td class="connmap-clr" title="No Connection">05</td>
<td class="connmap-clr" title="No Connection">06</td>
<td class="connmap-clr" title="No Connection">07</td>
<td class="connmap-clr" title="No Connection">08</td>
<td class="connmap-clr" title="No Connection">09</td>
<td class="connmap-clr" title="No Connection">10</td>
<td class="connmap-clr" title="No Connection">11</td>
<td class="connmap-clr" title="No Connection">12</td>
<td class="connmap-clr" title="No Connection">13</td>
<td class="connmap-clr" title="No Connection">14</td>
<td class="connmap-clr" title="No Connection">15</td>
<td class="connmap-clr" title="No Connection">16</td>
<td class="connmap-clr" title="No Connection">17</td>
<td class="connmap-clr" title="No Connection">18</td>
<td class="connmap-clr" title="No Connection">19</td>
<td class="connmap-clr" title="No Connection">20</td>
<td class="connmap-clr" title="No Connection">21</td>
<td class="connmap-clr" title="No Connection">22</td>
<td class="connmap-clr" title="No Connection">23</td>
<td class="connmap-clr" title="No Connection">24</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td colspan="2">&nbsp;</td></tr>
<tr>
<td class="errorText" colspan="2">
<input type="button"  value=" Refresh " onClick="reload_page();" />
</td>
</tr>
</table>
</td>
</tr>
</table>
</form>
</td>
</tr>
<tr>
<td id="naviFooter"> </td>
</tr>
</tbody>
</table>
</body>
</html>'''

real_table = [[
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 06'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 11'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 05'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 20'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 10'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 12'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 09'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 08'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 07'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 04'}
    ], [
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 14'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 03'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 17'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 22'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 13'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 01'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 19'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 21'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 18'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 15'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#04 Port 16'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'}
    ], [
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'}
    ], [
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 14'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 05'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 24'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 06'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 01'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 17'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 15'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 13'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 10'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 04'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 12'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 13'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 01'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 19'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 20'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 08'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 18'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 16'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 09'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 17'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 09'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'}
    ], [
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'}
    ], [
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#06 Port 11'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#06 Port 12'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#06 Port 05'},
        {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#06 Port 06'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'}
    ], [
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'},
        {'class': 'connmap-clr', 'title': 'No Connection'}
    ]]

real_connections = {
    1: {
        1: {
            1: (1, 4, 6), 2: None, 3: None, 4: (1, 4, 11), 5: None, 6: (1, 4, 5),
            7: None, 8: None, 9: (1, 4, 20), 10: (1, 4, 10), 11: None, 12: (1, 4, 12),
            13: (1, 4, 9), 14: None, 15: (1, 4, 8), 16: None, 17: (1, 4, 7), 18: None,
            19: None, 20: None, 21: None, 22: None, 23: None, 24: (1, 4, 4)
        },
        2: {
            1: (1, 4, 14), 2: None, 3: None, 4: None, 5: (1, 4, 3), 6: None,
            7: None, 8: (1, 4, 17), 9: (1, 4, 22), 10: None, 11: None, 12: None,
            13: (1, 4, 13), 14: (1, 4, 1), 15: None, 16: (1, 4, 19), 17: (1, 4, 21), 18: (1, 4, 18),
            19: (1, 4, 15), 20: (1, 4, 16), 21: None, 22: None, 23: None, 24: None
        },
        3: {
            1: None, 2: None, 3: None, 4: None, 5: None, 6: None,
            7: None, 8: None, 9: None, 10: None, 11: None, 12: None,
            13: None, 14: None, 15: None, 16: None, 17: None, 18: None,
            19: None, 20: None, 21: None, 22: None, 23: None, 24: None
        },
        4: {
            1: (1, 2, 14), 2: None, 3: (1, 2, 5), 4: (1, 1, 24), 5: (1, 1, 6), 6: (1, 1, 1),
            7: (1, 1, 17), 8: (1, 1, 15), 9: (1, 1, 13), 10: (1, 1, 10), 11: (1, 1, 4), 12: (1, 1, 12),
            13: (1, 2, 13), 14: (1, 2, 1), 15: (1, 2, 19), 16: (1, 2, 20), 17: (1, 2, 8), 18: (1, 2, 18),
            19: (1, 2, 16), 20: (1, 1, 9), 21: (1, 2, 17), 22: (1, 2, 9), 23: None, 24: None
        },
        5: {
            1: None, 2: None, 3: None, 4: None, 5: None, 6: None,
            7: None, 8: None, 9: None, 10: None, 11: None, 12: None,
            13: None, 14: None, 15: None, 16: None, 17: None, 18: None,
            19: None, 20: None, 21: None, 22: None, 23: None, 24: None
        },
        6: {
            1: None, 2: None, 3: None, 4: None, 5: (1, 6, 11), 6: (1, 6, 12),
            7: None, 8: None, 9: None, 10: None, 11: (1, 6, 5), 12: (1, 6, 6),
            13: None, 14: None, 15: None, 16: None, 17: None, 18: None,
            19: None, 20: None, 21: None, 22: None, 23: None, 24: None
        },
        7: {
            1: None, 2: None, 3: None, 4: None, 5: None, 6: None,
            7: None, 8: None, 9: None, 10: None, 11: None, 12: None,
            13: None, 14: None, 15: None, 16: None, 17: None, 18: None,
            19: None, 20: None, 21: None, 22: None, 23: None, 24: None
        }
    }
}

multi_an_tables = {
    1: [
        [
            {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 03'},
            {'class': 'connmap-clr', 'title': 'No Connection'},
            {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 01'},
            {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 01'},
        ],
        [
            {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#01 Port 04'},
            {'class': 'connmap-clr', 'title': 'No Connection'},
            {'class': 'connmap-con', 'title': 'Connected to: Analyzer 2 DB#01 Port 04'},
            {'class': 'connmap-con', 'title': 'Connected to: Analyzer 2 DB#01 Port 03'},
        ],
    ],
    2: [
        [
            {'class': 'connmap-clr', 'title': 'No Connection'},
            {'class': 'connmap-clr', 'title': 'No Connection'},
            {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 04'},
            {'class': 'connmap-con', 'title': 'Connected to: Analyzer 1 DB#02 Port 03'},
        ],
    ],
}

multi_an_connections = {
    1: {
        1: {
            1: (1, 1, 3), 2: None, 3: (1, 1, 1), 4: (1, 2, 1)
        },
        2: {
            1: (1, 1, 4), 2: None, 3: (2, 1, 4), 4: (2, 1, 3)
        }
    },
    2: {
        1: {
            1: None, 2: None, 3: (1, 2, 4), 4: (1, 2, 3)
        }
    }
}

analyzer1 = flexmock(analyzer_id_in_group = 1)
analyzer2 = flexmock(analyzer_id_in_group = 2)
analyzer_group1 = [analyzer1]
analyzer_group2 = [analyzer1, analyzer2]

def test_real_html_parse():
    p = ConMapHTMLParser()
    p.feed(real_html)
    assert p.get_table() == real_table

def test_real_get_connections():
    agu = AGUpdater(None, None)
    assert agu.get_connections(analyzer_group1, {1: real_table} ) == real_connections

def test_multi_an_get_connections():
    agu = AGUpdater(None, None)
    assert agu.get_connections(analyzer_group2, multi_an_tables) == multi_an_connections
