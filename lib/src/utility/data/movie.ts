/**
 * 地方競馬ライブのURL
 */
export const CHIHO_KEIBA_LIVE_URL = 'http://keiba-lv-st.jp/';

/**
 * YoutubeのライブURLを取得する
 * @param userId
 * @returns
 */
export const getYoutubeLiveUrl = (userId: string): string =>
    `https://www.youtube.com/@${userId}/stream`;

/**
 * 地方競馬のYoutubeのユーザーID
 */
export const CHIHO_KEIBA_YOUTUBE_USER_ID: Record<string, string> = {
    門別: 'live2820',
    帯広ば: 'user-di2dh2dc4q',
    水沢: 'IwateKeibaITV',
    盛岡: 'IwateKeibaITV',
    浦和: 'user-vh3fg5mt1c',
    大井: 'tckkeiba',
    船橋: 'funabashi-keiba',
    川崎: 'user-se7me6tw7q',
    金沢: 'user-dx7rm6oz6r',
    笠松: 'user-lm8ln1kk9j',
    名古屋: 'user-sx4xe4bs5r',
    園田: 'sonodahimejiweb',
    姫路: 'sonodahimejiweb',
    高知: 'KeibaOrJp',
    佐賀: 'sagakeibaofficial',
};
