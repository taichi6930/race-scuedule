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

<title>2024年10月11日(金) 川崎 全レース出走表｜競輪（KEIRIN）ならオッズパーク競輪</title>
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


		<li><a href="/keirin/KeirinTop.do?SSO_FORCE_LOGIN=1&amp;SSO_URL_RETURN=https://www.oddspark.com/keirin/AllRaceList.do?joCode%3D34%26kaisaiBi%3D20241011">ログイン</a></li>
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
				ミッドナイト開催　宇都宮、松阪競輪　通常賭式発売中！　　　　　川崎競輪「大阪・関西万博協賛(GIII)」　Dokanto!・通常賭式発売中！　　西武園、福井競輪　通常賭式発売中！</marquee>
		</div>



    <div id="content">



<!-- パンくずリスト -->

<ul id="bcrumb">
<li><a href="/">オッズパークTOP</a></li>
<li><a href="/keirin/">競輪TOP</a></li>
<li><a href="/keirin/RaceListInfo.do?kaisaiBi=20241011">レース情報</a></li>
<li><a href='/keirin/racetrack/info-7176.html'>川崎競輪場</a></li>
<li>川崎競輪場 Ｇ３ 大阪・関西万博協賛</li>
</ul>


<!-- レース名 -->
<h2>
川崎競輪場
<img src="/keirin/s_shared/images/ico_g3_a.gif?20220318165305" width="22" height="14" alt="G3"/>
大阪・関西万博協賛
</h2>
<div class="raceList"><a href="/keirin/RaceListInfo.do?kaisaiBi=20241011">10/11のレース情報へ</a>



<a href="/keirin/RaceProgram.do?joCode=34&amp;shonichi=20241011">レースプログラム</a>


</div>
<!-- 開催日数分 -->
<ul id="raceDay">

<li class="active"><a href="/keirin/AllRaceList.do?joCode=34&amp;kaisaiBi=20241011">初日(本日10/11)</a></li>

<li><a href="/keirin/AllRaceList.do?joCode=34&amp;kaisaiBi=20241012">2日目(10/12)</a></li>

<li><a href="/keirin/AllRaceList.do?joCode=34&amp;kaisaiBi=20241013">3日目(10/13)</a></li>

<li><a href="/keirin/AllRaceList.do?joCode=34&amp;kaisaiBi=20241014">最終日(10/14)</a></li>

</ul>

<!-- AI予想リンク -->

<div class="ai_yb">
<a href="/keirin/yosou/ai/RaceList.do?jo_code=34&amp;race_date=20241011">AI予想はコチラ▶</a>
</div>



<!-- タブ出走表・オッズ・結果｜映像・投票・LOTO -->
<div id="tab">
<ul>



	    <li class="active">
    	<a href="/keirin/AllRaceList.do?joCode=34&amp;kaisaiBi=20241011" class="tab1">出走表</a></li>
    	<li>
	    <a href="/keirin/Odds.do?joCode=34&amp;kaisaiBi=20241011" class="tab2">オッズ</a></li>
   	<li>
    	<a href="/keirin/ALLRaceResult.do?joCode=34&amp;kaisaiBi=20241011" class="tab3">結果</a></li>



</ul>
</div>




<ul id="racenum">


<li class="active"><a href="./AllRaceList.do?joCode=34&amp;kaisaiBi=20241011">全R</a></li>


<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=1">1R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=2">2R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=3">3R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=4">4R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=5">5R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=6">6R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=7">7R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=8">8R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=9">9R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=10">10R</a>

</li>

<li>




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=11">11R</a>

</li>

<li class=" r12">




<a href="/keirin/RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=12">12R</a>

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

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=1">第1R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>10:50</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>10:45</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015546">山根　将太</a>


                </td>

                <td>119</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013628">石毛　克幸</a>


                </td>

                <td>84</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013762">吉田　勇人</a>


                </td>

                <td>86</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013996">丸山　貴秀</a>


                </td>

                <td>89</td>

                <td>秋田</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013737">筒井　敦史</a>


                </td>

                <td>85</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015339">土田　武志</a>


                </td>

                <td>115</td>

                <td>茨城</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015262">内山　雅貴</a>


                </td>

                <td>113</td>

                <td>静岡</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014867">巴　　直也</a>


                </td>

                <td>101</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013439">青井　賢治</a>


                </td>

                <td>81</td>

                <td>徳島</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">副島　和人</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=2">第2R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>11:15</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>11:10</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012474">小川　圭二</a>


                </td>

                <td>68</td>

                <td>徳島</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014833">高久保雄介</a>


                </td>

                <td>100</td>

                <td>京都</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015428">藤田　周磨</a>


                </td>

                <td>117</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013240">小林　大介</a>


                </td>

                <td>79</td>

                <td>群馬</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014421">松川　高大</a>


                </td>

                <td>94</td>

                <td>熊本</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012487">紺野　哲也</a>


                </td>

                <td>69</td>

                <td>宮城</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013685">岡田　征陽</a>


                </td>

                <td>85</td>

                <td>東京</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015572">田村　　大</a>


                </td>

                <td>119</td>

                <td>宮崎</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014767">藤井　栄二</a>


                </td>

                <td>99</td>

                <td>兵庫</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">成田　健児</td>

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

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=3">第3R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>11:40</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>11:35</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015354">齋木　翔多</a>


                </td>

                <td>115</td>

                <td>静岡</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013990">荻原　尚人</a>


                </td>

                <td>89</td>

                <td>宮城</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013803">三ツ石康洋</a>


                </td>

                <td>86</td>

                <td>徳島</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014361">真船圭一郎</a>


                </td>

                <td>94</td>

                <td>福島</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013821">中村　圭志</a>


                </td>

                <td>86</td>

                <td>熊本</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013985">高橋　陽介</a>


                </td>

                <td>89</td>

                <td>青森</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014458">近藤　　保</a>


                </td>

                <td>95</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013188">山田　幸司</a>


                </td>

                <td>78</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014606">稲毛　健太</a>


                </td>

                <td>97</td>

                <td>和歌</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">森川　　剛</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=4">第4R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>12:10</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>12:05</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013252">中村　浩士</a>


                </td>

                <td>79</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014268">山口　貴弘</a>


                </td>

                <td>92</td>

                <td>佐賀</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013495">友定　祐己</a>


                </td>

                <td>82</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015616">齋藤　雄行</a>


                </td>

                <td>121</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015477">兼本　将太</a>


                </td>

                <td>117</td>

                <td>熊本</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013146">八谷　誠賢</a>


                </td>

                <td>77</td>

                <td>福岡</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013436">中村　昌弘</a>


                </td>

                <td>81</td>

                <td>広島</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014164">田中　孝彦</a>


                </td>

                <td>91</td>

                <td>静岡</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014879">月森　亮輔</a>


                </td>

                <td>101</td>

                <td>岡山</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">伊藤　彰規</td>

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

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=5">第5R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>12:40</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>12:35</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014148">岸澤　賢太</a>


                </td>

                <td>91</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014982">坂本　周作</a>


                </td>

                <td>105</td>

                <td>青森</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014599">松岡　篤哉</a>


                </td>

                <td>97</td>

                <td>岐阜</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014339">成松　春樹</a>


                </td>

                <td>93</td>

                <td>佐賀</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014130">竹山　陵太</a>


                </td>

                <td>91</td>

                <td>宮城</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015536">疋田　力也</a>


                </td>

                <td>119</td>

                <td>愛知</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012939">伏見　俊昭</a>


                </td>

                <td>75</td>

                <td>福島</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014044">八尋　英輔</a>


                </td>

                <td>89</td>

                <td>福岡</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014580">久木原　洋</a>


                </td>

                <td>97</td>

                <td>埼玉</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">副島　和人</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=6">第6R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>13:10</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>13:05</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013306">齋藤登志信</a>


                </td>

                <td>80</td>

                <td>宮城</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015291">山口　敦也</a>


                </td>

                <td>113</td>

                <td>佐賀</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014750">今藤　康裕</a>


                </td>

                <td>99</td>

                <td>岐阜</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015517">橋本　壮史</a>


                </td>

                <td>119</td>

                <td>茨城</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014769">坂本　修一</a>


                </td>

                <td>99</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015101">松岡晋乃介</a>


                </td>

                <td>109</td>

                <td>岐阜</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013670">小橋　秀幸</a>


                </td>

                <td>85</td>

                <td>青森</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014161">藤田　大輔</a>


                </td>

                <td>91</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015385">立部　楓真</a>


                </td>

                <td>115</td>

                <td>佐賀</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">成田　健児</td>

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

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=7">第7R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>13:40</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>13:35</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015342">福田　　滉</a>


                </td>

                <td>115</td>

                <td>栃木</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015067">瀬戸　晋作</a>


                </td>

                <td>107</td>

                <td>長崎</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015620">纐纈　洸翔</a>


                </td>

                <td>121</td>

                <td>愛知</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014249">鷲田　幸司</a>


                </td>

                <td>92</td>

                <td>福井</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014958">新納　大輝</a>


                </td>

                <td>103</td>

                <td>鹿児</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014486">大瀬戸潤一</a>


                </td>

                <td>95</td>

                <td>広島</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014863">一戸　康宏</a>


                </td>

                <td>101</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014716">猪狩　祐樹</a>


                </td>

                <td>99</td>

                <td>福島</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014472">坂口　晃輔</a>


                </td>

                <td>95</td>

                <td>三重</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">三住　博昭</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=8">第8R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>14:10</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>14:05</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015268">山田　　諒</a>


                </td>

                <td>113</td>

                <td>岐阜</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012826">渡邉　晴智</a>


                </td>

                <td>73</td>

                <td>静岡</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013808">坂本健太郎</a>


                </td>

                <td>86</td>

                <td>福岡</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015254">鈴木　輝大</a>


                </td>

                <td>113</td>

                <td>東京</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015211">平尾　一晃</a>


                </td>

                <td>111</td>

                <td>長崎</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013766">武井　大介</a>


                </td>

                <td>86</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014511">内藤　高裕</a>


                </td>

                <td>96</td>

                <td>東京</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015594">金田　涼馬</a>


                </td>

                <td>119</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014028">山口　泰生</a>


                </td>

                <td>89</td>

                <td>岐阜</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">森川　　剛</td>

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

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=9">第9R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>14:45</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>14:40</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014208">安部　貴之</a>


                </td>

                <td>92</td>

                <td>宮城</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014864">土屋　壮登</a>


                </td>

                <td>101</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015282">宮本　隼輔</a>


                </td>

                <td>113</td>

                <td>山口</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015595">邊見　光輝</a>


                </td>

                <td>119</td>

                <td>福島</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014605">中井　太祐</a>


                </td>

                <td>97</td>

                <td>奈良</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014157">原田　泰志</a>


                </td>

                <td>91</td>

                <td>新潟</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014551">山下　一輝</a>


                </td>

                <td>96</td>

                <td>山口</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013230">開坂　秀明</a>


                </td>

                <td>79</td>

                <td>青森</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015369">谷　　和也</a>


                </td>

                <td>115</td>

                <td>大阪</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">伊藤　彰規</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=10">第10R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>15:20</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>15:15</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013945">福田　知也</a>


                </td>

                <td>88</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014144">石川　雅望</a>


                </td>

                <td>91</td>

                <td>群馬</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015066">原口　昌平</a>


                </td>

                <td>107</td>

                <td>福岡</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012819">齊藤　竜也</a>


                </td>

                <td>73</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014617">西岡　拓朗</a>


                </td>

                <td>97</td>

                <td>広島</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013014">江連　和洋</a>


                </td>

                <td>76</td>

                <td>栃木</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015169">野口　裕史</a>


                </td>

                <td>111</td>

                <td>千葉</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014811">笠松　将太</a>


                </td>

                <td>100</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014558">松尾　　透</a>


                </td>

                <td>96</td>

                <td>福岡</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">副島　和人</td>

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

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=11">第11R&nbsp;&nbsp;Ｓ級一予選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>15:55</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>15:50</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014946">元砂　勇雪</a>


                </td>

                <td>103</td>

                <td>奈良</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014881">山崎　泰己</a>


                </td>

                <td>101</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015608">山口　多聞</a>


                </td>

                <td>121</td>

                <td>埼玉</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015461">土生　敦弘</a>


                </td>

                <td>117</td>

                <td>大阪</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014409">山本　　奨</a>


                </td>

                <td>94</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013885">柳谷　　崇</a>


                </td>

                <td>87</td>

                <td>岡山</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014804">横山　尚則</a>


                </td>

                <td>100</td>

                <td>茨城</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014176">笹倉　慎也</a>


                </td>

                <td>91</td>

                <td>富山</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013394">飯嶋　則之</a>


                </td>

                <td>81</td>

                <td>栃木</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">三住　博昭</td>

            <td></td>

            <td></td>
            </tr>
          </table>
        </div>
        <!-- w480px -->





          <div class="w480px bl-left clearfix ">

            <div class="p3"><strong><a href="./RaceList.do?joCode=34&amp;kaisaiBi=20241011&amp;raceNo=12">第12R&nbsp;&nbsp;Ｓ級初特選</a></strong>




            <br />
            <span class="tx_blue">発走時間</span>&nbsp;
            <strong>16:35</strong>&nbsp;&nbsp;

              <span class="tx_red">締切予定</span>&nbsp;
              <strong>16:30</strong>

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



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014113">北津留　翼</a>


                </td>

                <td>90</td>

                <td>福岡</td>
              </tr>

              <tr class="bg-2-pl">




                <td rowspan="1" class="bg-1">
                2
                  </td>


                <td class="no2">



                    2

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=013249">諸橋　　愛</a>


                </td>

                <td>79</td>

                <td>新潟</td>
              </tr>

              <tr class="bg-3-pl">




                <td rowspan="1" class="bg-1">
                3
                  </td>


                <td class="no3">



                    3

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014744">和田真久留</a>


                </td>

                <td>99</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-4-pl">




                <td rowspan="2" class="bg-1">
                4
                  </td>


                <td class="no4">



                    4

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015439">佐々木眞也</a>


                </td>

                <td>117</td>

                <td>神奈</td>
              </tr>

              <tr class="bg-5-pl">





                <td class="no5">



                    5

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015356">藤井　侑吾</a>


                </td>

                <td>115</td>

                <td>愛知</td>
              </tr>

              <tr class="bg-6-pl">




                <td rowspan="2" class="bg-1">
                5
                  </td>


                <td class="no6">



                    6

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=015038">山岸　佳太</a>


                </td>

                <td>107</td>

                <td>茨城</td>
              </tr>

              <tr class="bg-7-pl">





                <td class="no7">



                    7

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014182">大川　龍二</a>


                </td>

                <td>91</td>

                <td>広島</td>
              </tr>

              <tr class="bg-8-pl">




                <td rowspan="2" class="bg-1">
                6
                  </td>


                <td class="no8">



                    8

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=012450">山口　富生</a>


                </td>

                <td>68</td>

                <td>岐阜</td>
              </tr>

              <tr class="bg-9-pl">





                <td class="no9">



                    9

                </td>



                <td class="al-left"><a href="./PlayerDetail.do?playerCd=014809">恩田　淳平</a>


                </td>

                <td>100</td>

                <td>群馬</td>
              </tr>




            <tr>

            <td colspan="2">誘導</td>



            <td class="al-left">成田　健児</td>

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
<script type="text/javascript"  src="/U0xOPB-b4/mHXDaX/DJA/XYuccQc7iDDcJ7/DUgiAQ/dydE/Gm96fCMB"></script></body>

</html>
`;
}
