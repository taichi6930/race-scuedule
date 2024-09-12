import { NarRaceCourse, NarRaceCourseType } from './data/raceSpecific';

type NarRaceDataForRaceName = {
    name: string;
    place: NarRaceCourse;
    grade: string;
    date: Date;
    surfaceType: NarRaceCourseType;
    distance: number;
};
export const processNarRaceName = (
    raceInfo: NarRaceDataForRaceName,
): string => {
    // 共通系
    let newRaceName = raceInfo.name
        .replace(/[！-～]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        )
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        )
        .replace(/ステークス/, 'S')
        .replace(/カップ/, 'C')
        .replace(/J(認|交|指) /g, '')
        .replace(/　/g, ' ');
    // 帯広競馬
    if (['帯広ば'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                /(?:[2-5])?(?:・)?(?:[3-5])?(?:歳)?(?:以上)?(?:牡馬|牝馬)?(オープ(?:ン)?|選抜).*/,
                '',
            )
            .replace(
                /.*ヤングチャンピオンシップ.*/,
                'ヤングチャンピオンシップ',
            );
    }
    // 門別競馬
    if (['門別'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                /(?:[2-4])?(?:歳)?(?:一般)?(?:牝馬)?(オー(?:プ(?:ン)?)?)$/,
                '',
            )
            .replace(
                /.*ブリーダーズゴールドジュニア.*/,
                'ブリーダーズゴールドジュニアC',
            )
            .replace(/〔準重賞〕.*/, '');
    }
    // 岩手競馬
    if (['水沢', '盛岡'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/(オープン|([2-3])歳)(?:牝馬)?.*/, '')
            .replace(/.*岩手県知事杯ORO.*/, '岩手県知事杯OROカップ')
            .replace(/.*南部杯.*/, 'MCS南部杯')
            .replace(/.*スプリング.*/, 'スプリングC（岩手）');
    }
    // 浦和、船橋競馬
    if (['浦和', '船橋'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/3歳未格選抜馬/, '')
            .replace(/([2-4])(?:歳|上)?(?:牝馬)?(オープン).*/, '')
            .replace(/(A2|B1).*/, '')
            .replace(/オープン4上$/, 'オープン');
    }
    // 川崎競馬
    if (['川崎'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/【地方交流3歳/, '')
            .replace(/([2-4])(?:歳|上)?(?:牝馬)?(?:1)?(オープン).*/, '')
            .replace(/\【(国際|指定|地方|JRA・地方)交(?:流\】).*/g, '')
            .replace(/ホクト.*/g, '')
            .replace(/(A2|2歳1).*/, '')
            .replace(/4歳上*/g, '');
    }
    // 大井競馬
    if (['大井'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                /(?:[2-4])?(?:歳|上)?(選定馬|(?:牝馬)?(オー(?:プ(?:ン)?)?)).*/,
                '',
            )
            .replace(/.*ゴールドジュニア.*/, 'ゴールドジュニア（大井）')
            .replace(/メイカA2B1/, 'メイC');
    }
    // 金沢競馬
    if (['金沢'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                '移転50周年記念金沢ファ',
                '移転50周年記念金沢ファンセレクトC',
            )
            .replace(
                /(\【|((?:[2-4])?歳(?:以上)?(?:牝馬)?(?:オープン)?)).*/,
                '',
            )
            .replace(/((A|B1)級|A1二A2)$/, '');
    }
    // 名古屋競馬
    if (['名古屋'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/(?:[2-3])?(?:歳)?(?:牝馬)?(オープン).*/, '')
            .replace(/.*スプリング.*/, 'スプリングC（名古屋）')
            .replace(/.*尾張名古屋杯.*/, '尾張名古屋杯')
            .replace(/.*あすなろ杯.*/, 'あすなろ杯')
            .replace(/(B(?:C)?)$/, '');
    }
    // 笠松競馬
    if (['笠松'].includes(raceInfo.place)) {
        if (newRaceName.includes('ゴールドジュニア')) {
            newRaceName = 'ゴールドジュニア（笠松）';
        }
        if (newRaceName.includes('東海ゴールド')) {
            newRaceName = '東海ゴールドC';
        }
        // それ以外の場合は不要な部分を削除
        newRaceName = newRaceName.replace(
            /(オープン|([2-4])歳)(?:以上)?(?:牡馬|牝馬|牡牝)?(?:・)?(オープン).*/,
            '',
        );
    }
    // 園田、姫路競馬
    if (['園田', '姫路'].includes(raceInfo.place)) {
        newRaceName = newRaceName.replace(/([2-4])歳(?:以上)?(?:牝馬)?.*/, '');
    }
    // 高知競馬
    if (['高知'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/([2-4])(?:歳)?(?:以上)?(?:牝馬)?.*/, '')
            .replace(/((B|C)級以下)$/, '');
    }
    // 佐賀競馬
    if (['佐賀'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                /(?:[2-4])?(?:歳)?(?:牝馬)?(九州産|オー(?:プ(?:ン)?)?)$/,
                '',
            )
            .replace(/(A1・B)$/, '')
            .replace(/(A1(?:・A2)?|B|3歳|2歳)$/, '');
    }
    return newRaceName;
};
