/* eslint-disable no-irregular-whitespace */
import { KeirinRaceCourse } from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { IKeirinRaceDataHtmlGateway } from '../interface/iKeirinRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class MockKeirinRaceDataHtmlGateway
    implements IKeirinRaceDataHtmlGateway
{
    /**
     * レースデータのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(
        date: Date,
        place: KeirinRaceCourse,
    ): Promise<string> {
        console.log(date, place);
        return Promise.resolve(this.html);
    }

    html = `


<?xml version="1.0" encoding="utf-8"?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="ja" xml:lang="ja">

<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta http-equiv="content-style-type" content="text/css" />
<meta http-equiv="content-script-type" content="text/javascript" />
<meta http-equiv="content-language" content="ja" />


<?xml version="1.0" encoding="utf-8"?>
<meta name="author" content="Odds Park Corp." />
<meta name="Keywords" content="競輪,KEIRIN,ケイリン,ライブ中継,無料予想" />
<meta name="Description" content="オッズパークでは、競輪（KEIRIN）の車券をインターネットで購入することができます。レースの予想情報やライブ映像も【無料】でご覧いただけます。またオッズパークLOTOでは最高12億円の重勝式投票券も販売しています。" />
<meta name="copyright" content="Copyright (C) Odds Park Corp. Co., Ltd. All Rights Reserved." lang="en" xml:lang="en" />
<meta http-equiv="pragma" content="no-cache" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="-1" />

<title>2024年6月12日(水) 松戸 全レース出走表｜競輪（KEIRIN）ならオッズパーク競輪</title>
<link rel="stylesheet" type="text/css" media="screen,print" href="/keirin/s_shared/css/main.css?20130801&20220318165305" />
<link rel="stylesheet" type="text/css" media="screen,print" href="/keirin/s_shared/css/lib.css?20230209103603" />
<link rel="stylesheet" type="text/css" media="screen,print" href="/keirin/yosou/css/ai_yosou_rtable_1d.css?20240205094736" />
<script type="text/javascript" src="/s_shared/js/jquery.js?20220318165305"></script>
<script type="text/javascript" src="/keirin/s_shared/js/info-util.js?20130801&20220318165305"></script>
<script type="text/javascript" src="/keirin/s_shared/js/lib.js?201505&20220318165305"></script>
<script type="text/javascript" src="/s_shared/js/jquery.cluetip.js?20220318165305"></script>
<script type="text/javascript" src="/keirin/s_shared/js/baloon.js?20220318165305"></script>
</head>

<body id="info">
  <div id="wrap">



	<div id="header">
		<div id="headerInner">
		<a href="/keirin/"><h1>競輪（KEIRIN・ケイリン）ならオッズパーク競輪｜予想情報も充実！</h1></a>
		&nbsp;<h2>車券が買える！競輪を楽しむならオッズパーク</h2>
		&nbsp;<ul id="nav1">


		<li><a href="/keirin/KeirinTop.do?SSO_FORCE_LOGIN=1&amp;SSO_URL_RETURN=https://www.oddspark.com/keirin/AllRaceList.do?kaisaiBi%3D20240612%26joCode%3D31">ログイン</a></li>
		<li><a href="/user/new/RegTop.do?src=31">新規会員登録(無料)</a></li>

		<li><a href="https://faq.oddspark.com/" target="_blank">よくあるご質問</a></li>
		<li><a href="/">総合TOP</a></li>
		</ul>
		<ul id="nav2">
		    <li><a href="/keiba/" class="nv1">競馬</a></li>
		    <li class="active"><a href="/keirin/" class="nv2">競輪</a></li>
		    <li><a href="/autorace/" class="nv8">オートレース</a></li>
		    <li><a href="/loto/" class="nv3">LOTO</a></li>
		    <li><a href="/keirin/auth/VoteKeirinTop.do?gamenId=P602&amp;gamenKoumokuId=topVote" onclick="openFullWindow(this.href); return false;" class="nv4">投票する</a></li>
			<li><a class="nv5" href="/auth/NyukinMenu.do" onclick="openFullWindow(this.href); return false;">入金・精算</a></li>
		    <li><a href="/auth/InqTop.do" onclick="openFullWindow(this.href); return false;" class="nv6">照会</a></li>
		    <li><a href="/user/my/Index.do" class="nv7">マイページ</a></li>
		</ul>
		</div>
	</div>
	<!-- //header -->





	<div id="nav">
	<ul>
	<li><a href="/keirin/" class="nv1">TOP</a></li>
	<li class="active"><a href="/keirin/RaceListInfo.do" class="nv2">レース情報</a></li>
	<li><a href="/keirin/yosou/" class="nv3">予想情報</a></li>

	<li><a href="/keirin/KaisaiCalendar.do" class="nv4">スケジュール</a></li>
	<li><a href="/keirin/SearchPlayer.do" class="nv5">データベース</a></li>
	<li><a href="/keirin/campaign/" class="nv6">キャンペーン</a></li>
	</ul>
	</div>
	<!-- //nav -->

		<div id="marq">
			<marquee behavior="scroll">
				ミッドナイト開催　いわき平、松山競輪　通常賭式発売中！　　　　　川崎競輪「大阪・関西万博協賛(GIII)」　Dokanto!・通常賭式発売中！　　西武園、名古屋、富山、玉野競輪　通常賭式発売中！</marquee>
		</div>



    <div id="content">



<!-- パンくずリスト -->

<ul id="bcrumb">
<li><a href="/">オッズパークTOP</a></li>
<li><a href="/keirin/">競輪TOP</a></li>
<li><a href="/keirin/RaceListInfo.do?kaisaiBi=20240612">レース情報</a></li>
<li><a href='/keirin/racetrack/info-7174.html'>松戸競輪場</a></li>
<li>松戸競輪場 Ｆ１ </li>
</ul>


<!-- レース名 -->
<h2>
松戸競輪場
<img src="/keirin/s_shared/images/ico_f1_a.gif?20220318165305" width="22" height="14" alt="F1"/>

</h2>
<div class="raceList"><a href="/keirin/RaceListInfo.do?kaisaiBi=20240612">6/12のレース情報へ</a>



<a href="/keirin/RaceProgram.do?joCode=31&amp;shonichi=20240610">レースプログラム</a>


</div>
<!-- 開催日数分 -->
<ul id="raceDay">

<li><a href="/keirin/AllRaceList.do?joCode=31&amp;kaisaiBi=20240610">初日(6/10)<img src="/keirin/s_shared/images/ico-night3.gif?20220318165305" width="16" height="16" alt="ナイター" /></a></li>

<li><a href="/keirin/AllRaceList.do?joCode=31&amp;kaisaiBi=20240611">2日目(6/11)<img src="/keirin/s_shared/images/ico-night3.gif?20220318165305" width="16" height="16" alt="ナイター" /></a></li>

<li class="active"><a href="/keirin/AllRaceList.do?joCode=31&amp;kaisaiBi=20240612">最終日(6/12)<img src="/keirin/s_shared/images/ico-night3.gif?20220318165305" width="16" height="16" alt="ナイター" /></a></li>

</ul>

<!-- AI予想リンク -->

<div class="ai_yb">
<a href="/keirin/yosou/ai/RaceList.do?jo_code=31&amp;race_date=20240612">AI予想はコチラ▶</a>
</div>



<!-- タブ出走表・オッズ・結果｜映像・投票・LOTO -->
<div id="tab">
<ul>



	    <li class="active">
    	<a href="/keirin/AllRaceList.do?joCode=31&amp;kaisaiBi=20240612" class="tab1">出走表</a></li>
    	<li>
	    <a href="/keirin/Odds.do?joCode=31&amp;kaisaiBi=20240612" class="tab2">オッズ</a></li>
   	<li>
    	<a href="/keirin/ALLRaceResult.do?joCode=31&amp;kaisaiBi=20240612" class="tab3">結果</a></li>



</ul>
</div>




<ul id="racenum">


<li class="active"><a href="./AllRaceList.do?joCode=31&amp;kaisaiBi=20240612">全R</a></li>


<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=1">1R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=2">2R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=3">3R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=4">4R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=5">5R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=6">6R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=7">7R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=8">8R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=9">9R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=10">10R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=11">11R</a>

</li>

<li class=" r12">




<a href="/keirin/RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=12">12R</a>

</li>

</ul>


      <!-- 全R出走表 -->
      <h3>全レース出走表</h3>









          <span class="message">
投票会員の皆様には、「情報提供元」提供の予想情報を提供しております。<br/>
閲覧方法は、投票会員のIDでログイン→「レース情報」から開催を選択してください。
          </span>
          <!-- //notice -->




          <div class="section1">

          <div class="w480px  bl-left10 ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=1">第1R&nbsp;&nbsp;Ａ級一般</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>15:28</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>15:23</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014030">藤木　　裕</a>


                </td>

                <td>89</td>

                <td>京都</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012618">武智　尚之</a>


                </td>

                <td>70</td>

                <td>愛媛</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015155">三浦　大輝</a>


                </td>

                <td>111</td>

                <td>宮城</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014603">佐野　洋継</a>


                </td>

                <td>97</td>

                <td>京都</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014393">柴田　祐也</a>


                </td>

                <td>94</td>

                <td>岐阜</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014288">佐藤　　学</a>


                </td>

                <td>93</td>

                <td>栃木</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013232">柳　　　充</a>


                </td>

                <td>79</td>

                <td>青森</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">須藤　雄太</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=2">第2R&nbsp;&nbsp;Ａ級一般</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>15:52</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>15:47</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015610">永井　哉多</a>


                </td>

                <td>121</td>

                <td>東京</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013512">長野　和弘</a>


                </td>

                <td>82</td>

                <td>福岡</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012436">渡邊　秀明</a>


                </td>

                <td>68</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015559">神開　一輝</a>


                </td>

                <td>119</td>

                <td>福岡</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013148">小野　俊之</a>


                </td>

                <td>77</td>

                <td>大分</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=011733">中村　秀幸</a>


                </td>

                <td>60</td>

                <td>高知</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014738">櫻川　雅彦</a>


                </td>

                <td>99</td>

                <td>千葉</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">須藤　　誠</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->


          　</div ><!--  //section1 -->
          <div class="goTop"><a href="#top">ページの先頭へ</a></div>



          <div class="section1">

          <div class="w480px  bl-left10 ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=3">第3R&nbsp;&nbsp;Ａ級特選</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>16:16</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>16:11</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013494">土井　　勲</a>


                </td>

                <td>82</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015338">土田　栄二</a>


                </td>

                <td>115</td>

                <td>茨城</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014422">前田　義和</a>


                </td>

                <td>94</td>

                <td>鹿児</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013736">榊原　　洋</a>


                </td>

                <td>85</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013550">安部　達也</a>


                </td>

                <td>83</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014489">高鍋　邦彰</a>


                </td>

                <td>95</td>

                <td>福岡</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015454">小松原正登</a>


                </td>

                <td>117</td>

                <td>福井</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">河上　陽一</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=4">第4R&nbsp;&nbsp;Ａ級特選</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>16:42</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>16:37</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014818">田口　裕一</a>


                </td>

                <td>100</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015534">牛田樹希斗</a>


                </td>

                <td>119</td>

                <td>愛知</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015550">山崎　　航</a>


                </td>

                <td>119</td>

                <td>山口</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013491">近藤　範昌</a>


                </td>

                <td>82</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015159">坂本　拓也</a>


                </td>

                <td>111</td>

                <td>福島</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012202">望月裕一郎</a>


                </td>

                <td>65</td>

                <td>静岡</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013042">渡邊　　健</a>


                </td>

                <td>76</td>

                <td>愛知</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">須藤　雄太</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->


          　</div ><!--  //section1 -->
          <div class="goTop"><a href="#top">ページの先頭へ</a></div>



          <div class="section1">

          <div class="w480px  bl-left10 ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=5">第5R&nbsp;&nbsp;Ｓ級一般</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>17:08</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>17:03</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013604">庄子　信弘</a>


                </td>

                <td>84</td>

                <td>宮城</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014313">小谷　　実</a>


                </td>

                <td>93</td>

                <td>京都</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014051">早坂　秀悟</a>


                </td>

                <td>90</td>

                <td>茨城</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014455">小野　裕次</a>


                </td>

                <td>95</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013670">小橋　秀幸</a>


                </td>

                <td>85</td>

                <td>青森</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013332">吉村　和之</a>


                </td>

                <td>80</td>

                <td>岐阜</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013394">飯嶋　則之</a>


                </td>

                <td>81</td>

                <td>栃木</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">栗本　尚宗</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=6">第6R&nbsp;&nbsp;Ｓ級一般</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>17:35</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>17:30</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012881">白戸淳太郎</a>


                </td>

                <td>74</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013642">西岡　正一</a>


                </td>

                <td>84</td>

                <td>和歌</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014230">山田　義彦</a>


                </td>

                <td>92</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014606">稲毛　健太</a>


                </td>

                <td>97</td>

                <td>和歌</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014819">太刀川一成</a>


                </td>

                <td>100</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014862">坂本将太郎</a>


                </td>

                <td>101</td>

                <td>栃木</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015446">林　　敬宏</a>


                </td>

                <td>117</td>

                <td>愛知</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">河上　陽一</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->


          　</div ><!--  //section1 -->
          <div class="goTop"><a href="#top">ページの先頭へ</a></div>



          <div class="section1">

          <div class="w480px  bl-left10 ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=7">第7R&nbsp;&nbsp;Ｓ級一般</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>18:02</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>17:57</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015184">中野　雄喜</a>


                </td>

                <td>111</td>

                <td>京都</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014452">長井　優斗</a>


                </td>

                <td>95</td>

                <td>東京</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013354">國村　　洋</a>


                </td>

                <td>80</td>

                <td>山口</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013471">松坂　英司</a>


                </td>

                <td>82</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014148">岸澤　賢太</a>


                </td>

                <td>91</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013810">良永　浩一</a>


                </td>

                <td>86</td>

                <td>福岡</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014478">内山　貴裕</a>


                </td>

                <td>95</td>

                <td>京都</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">須藤　雄太</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=8">第8R&nbsp;&nbsp;Ｓ級特選</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>18:30</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>18:25</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015195">久保田泰弘</a>


                </td>

                <td>111</td>

                <td>山口</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015041">伊藤慶太郎</a>


                </td>

                <td>107</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015441">鈴木　陸来</a>


                </td>

                <td>117</td>

                <td>静岡</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013054">石丸　寛之</a>


                </td>

                <td>76</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013766">武井　大介</a>


                </td>

                <td>86</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014378">加賀山　淳</a>


                </td>

                <td>94</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014370">阿部　大樹</a>


                </td>

                <td>94</td>

                <td>埼玉</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">本多　哲也</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->


          　</div ><!--  //section1 -->
          <div class="goTop"><a href="#top">ページの先頭へ</a></div>



          <div class="section1">

          <div class="w480px  bl-left10 ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=9">第9R&nbsp;&nbsp;Ｓ級特選</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>18:58</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>18:53</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015289">橋本　瑠偉</a>


                </td>

                <td>113</td>

                <td>栃木</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015466">久田　裕也</a>


                </td>

                <td>117</td>

                <td>徳島</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012826">渡邉　晴智</a>


                </td>

                <td>73</td>

                <td>静岡</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014631">佐方　良行</a>


                </td>

                <td>97</td>

                <td>熊本</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014551">山下　一輝</a>


                </td>

                <td>96</td>

                <td>山口</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015173">格清　洋介</a>


                </td>

                <td>111</td>

                <td>静岡</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013762">吉田　勇人</a>


                </td>

                <td>86</td>

                <td>埼玉</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">栗本　尚宗</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=10">第10R&nbsp;&nbsp;Ｓ級特選</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>19:29</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>19:24</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014996">岡本　　総</a>


                </td>

                <td>105</td>

                <td>愛知</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015528">新村　　穣</a>


                </td>

                <td>119</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012939">伏見　俊昭</a>


                </td>

                <td>75</td>

                <td>福島</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014796">保科　千春</a>


                </td>

                <td>100</td>

                <td>宮城</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015572">田村　　大</a>


                </td>

                <td>119</td>

                <td>宮崎</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014592">小島　　歩</a>


                </td>

                <td>97</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015050">堀内　俊介</a>


                </td>

                <td>107</td>

                <td>神奈</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">須藤　　誠</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->


          　</div ><!--  //section1 -->
          <div class="goTop"><a href="#top">ページの先頭へ</a></div>



          <div class="section1">

          <div class="w480px  bl-left10 ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=11">第11R&nbsp;&nbsp;Ａ級決勝</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>20:00</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>19:55</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015616">齋藤　雄行</a>


                </td>

                <td>121</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015602">比佐　宝太</a>


                </td>

                <td>121</td>

                <td>福島</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014869">泉谷　元樹</a>


                </td>

                <td>101</td>

                <td>愛知</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014439">山崎　　司</a>


                </td>

                <td>95</td>

                <td>福島</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015646">塩崎　隼秀</a>


                </td>

                <td>121</td>

                <td>愛媛</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014695">山口　　茂</a>


                </td>

                <td>98</td>

                <td>福島</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012813">成清　貴之</a>


                </td>

                <td>73</td>

                <td>千葉</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">本多　哲也</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=31&amp;kaisaiBi=20240612&amp;raceNo=12">第12R&nbsp;&nbsp;Ｓ級決勝</a></strong>


              &nbsp;<span class="isprite" id="night">ナイター</span>



            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>20:35</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>20:30</strong>

          </div>

          <table class="tb61" summary="出走表">
            <tr>

              <th rowspan="2">枠</th>

              <th rowspan="2">車番</th>



              <th rowspan="2">選手名</th>

              <th rowspan="2">期別</th>

              <th rowspan="2">府県</th>
            </tr>



              <tr></tr>





              <tr class="bg-1-pl">




                <td rowspan="1" class="bg-1">
                1
                  </td>


                <td class="no1">



                    1

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013850">山賀　雅仁</a>


                </td>

                <td>87</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014208">安部　貴之</a>


                </td>

                <td>92</td>

                <td>宮城</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014441">芦澤　辰弘</a>


                </td>

                <td>95</td>

                <td>茨城</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="1" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014222">木暮　安由</a>


                </td>

                <td>92</td>

                <td>群馬</td>
              </tr>

              <tr class="bg-5-pl">




                <td rowspan="1" class="bg-1">
                5
                  </td>


                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014981">磯島　康祐</a>


                </td>

                <td>105</td>

                <td>青森</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015236">藤根　俊貴</a>


                </td>

                <td>113</td>

                <td>岩手</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014554">山形　一気</a>


                </td>

                <td>96</td>

                <td>徳島</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">栗本　尚宗</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->


          　</div ><!--  //section1 -->
          <div class="goTop"><a href="#top">ページの先頭へ</a></div>




    </div>
    <!-- //content -->

    <!-- 情報画面共通フッター -->

	<div id="footer">
	<div id="footerInner">
	<p id="copy">Copyright (C) Odds Park Corp. All Rights Reserved.</p>
	<ul id="footerNav">
	<li><a href="/service/company.html" onclick="window.open(this.href, '', 'width=631, height=500, menubar=no, toolbar=no, scrollbars=yes'); return false;">会社案内</a></li>
	<li><a href="/service/toiawase.pdf" target="_blank">特定商取引法に基づく表示</a></li>
	<li><a href="/service/sitepolicy.html" onclick="window.open(this.href, '', 'width=631, height=500, menubar=no, toolbar=no, scrollbars=yes'); return false;">サイトポリシー</a></li>
	<li><a href="/service/privacy.html" onclick="window.open(this.href, '', 'width=631, height=500, menubar=no, toolbar=no, scrollbars=yes'); return false;">個人情報保護方針</a></li>
	<li><a href="/service/information-security.html" onclick="window.open(this.href, '', 'width=631, height=500, menubar=no, toolbar=no, scrollbars=yes'); return false;">情報セキュリティ方針</a></li>
	<li><a href="/service/rule.html" onclick="window.open(this.href, '', 'width=631, height=500, menubar=no, toolbar=no, scrollbars=yes'); return false;">免責事項</a></li>
	<li><a href="/user/new/GoiInp.do" onclick="window.open(this.href, '', 'width=1020, height=740, menubar=no, toolbar=no, scrollbars=yes'); return false;">ご意見・ご要望</a></li>
	<li><a href="/service/link.html" onclick="window.open(this.href, '', 'width=1020, height=740, menubar=no, toolbar=no, scrollbars=yes'); return false;">リンク</a></li>
	</ul>
	</div>
	<!-- //footerInner -->
	</div>
	<!-- //footer -->

	<script type="text/javascript" src="/keirin/s_shared/js/trace.js?20150326&20220318165305"></script>

	<!-- Google Tag Manager -->
	<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-M5GLNZ"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-M5GLNZ');</script>
	<!-- End Google Tag Manager -->

	<script type="text/javascript">
	  (function () {
	    var tagjs = document.createElement("script");
	    var s = document.getElementsByTagName("script")[0];
	    tagjs.async = true;
	    tagjs.src = "//s.yjtag.jp/tag.js#site=mw1D83P";
	    s.parentNode.insertBefore(tagjs, s);
	  }());
	</script>
	<noscript>
	  <iframe src="//b.yjtag.jp/iframe?c=mw1D83P" width="1" height="1" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
	</noscript>

  </div>
<!-- //wrap -->
<script type="text/javascript"  src="/iOYKcE2VAMsj4t8XvcOo/9fYSXbb3XaDGiku1/OXl6GHI5AQ/Ex/1iIV1iDh8B"></script></body>

</html>
`;
}
