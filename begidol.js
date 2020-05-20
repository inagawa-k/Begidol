javascript:(function(){

    /******** 汎用関数 ********/

    /* ID をもとに elem を取得 */
    function getById(obj, id) {
        var elem = obj.getElementById(id);
        if(elem != null) {
            return elem.value;
        } else {
            return null;
        }
    };

    /* xml の elem 作成 */
    function createElem(name, text) {
        var elem = document.createElement('data');
        elem.setAttribute('name', name);
        elem.innerText = text;
        return elem;
    }

    /* numberResource である xml elem 作成 */
    function createNumRcElem(name, maxValue, currentValue) {
        var elem = document.createElement('data');
        elem.setAttribute('name', name);
        elem.innerText = maxValue;
        elem.setAttribute('type', 'numberResource');
        elem.setAttribute('currentValue', currentValue);
        return elem;
    }

    /* source から指定された id を取得し，xml elem を作成 */
    function createElemById(source, id, name) {
        return createElem(name, getById(source, id));
    }

    /******** 各ブロックの作成処理 ********/

    function createImgBlock() {
        var img = document.createElement('data');
        img.setAttribute('name', 'image');
        var elem = document.createElement('data');
        elem.setAttribute('type', 'image');
        elem.setAttribute('name', 'imageIdentifier');
        elem.innerText = 'null';
        img.appendChild(elem);

        return img;
    }

    function createCommonBlock(source) {
        var common = document.createElement('data');
        common.setAttribute('name', 'common');      
        common.appendChild(createElemById(source, 'base.name', 'name' ));
        common.appendChild(createElemById(source, 'base.nameKana', 'カナ' ));
        common.appendChild(createElemById(source, 'base.player', 'プレイヤー名' ));
        common.appendChild(createElem('size', '1' ));

        return common;
    }

    function createResourceBlock(source) {
        /* キャラシートからパラメータPを取得 */
        var getfan = getById(source, 'base.idolrank.getfan');
        /*var totalfan = getById(source, 'base.idolrank.totalfan');*/
        var mental = getById(source, 'base.mental');

        var resource = document.createElement('data');
        resource.setAttribute('name', 'リソース');
        resource.appendChild(createNumRcElem('獲得ファン人数', parseInt(100) + parseInt(getfan), getfan));
        /*resource.appendChild(createNumRcElem('合計ファン人数', totalfan, totalfan));*/
        resource.appendChild(createNumRcElem('メンタル', 50, mental));

        return resource;
    }

    function createAbilityBlock(source) {
        /* キャラシートからパラメータPを取得 */
        var voice = getById(source, 'base.idolskills.voice');
        var physical = getById(source, 'base.idolskills.physical');
        var visual = getById(source, 'base.idolskills.visual');

        var ability = document.createElement('data');
        ability.setAttribute('name', '能力値');
        ability.appendChild(createNumRcElem('ボイス', 10, voice));
        ability.appendChild(createNumRcElem('フィジカル', 10, physical));
        ability.appendChild(createNumRcElem('ビジュアル', 10, visual));

        return ability;
    }

    function createProfileBlock(source) {
        var profile = document.createElement('data');
        profile.setAttribute('name', 'プロフィール');
        profile.appendChild(createElemById(source, 'base.background', '背景'));
        profile.appendChild(createElemById(source, 'base.production', '所属プロダクション'));
        profile.appendChild(createElemById(source, 'base.unitname', 'ユニット名'));
        profile.appendChild(createElemById(source, 'base.idolclass', 'アイドルクラス'));
        profile.appendChild(createElemById(source, 'base.age', '年齢'));
        profile.appendChild(createElemById(source, 'base.idolrank.rank', 'アイドルランク'));
        profile.appendChild(createElemById(source, 'base.idolrank.coefficient', 'ランク係数'));
        profile.appendChild(createElemById(source, 'base.idolrank.chance', 'チャンス'));
        profile.appendChild(createElemById(source, 'base.idolrank.sessioncount', 'セッション回数'));
        profile.appendChild(createElemById(source, 'base.imagecolor', 'イメージカラー'));
        profile.appendChild(createElemById(source, 'base.bodyfeature', '身体的特徴'));
        profile.appendChild(createElemById(source, 'base.fashionfeature', 'ファッション特徴'));
        profile.appendChild(createElemById(source, 'base.like', '好きなもの'));
        profile.appendChild(createElemById(source, 'base.dislike', '嫌いなもの'));

        return profile;
    }

    function createChatPaletteBlock() {
        var cpd = document.createElement('chat-palette');

        var txt = '';
        cpd.innerText = txt;

        return cpd;
    }

    /******** ここからメイン処理 ********/
    function main() {
        var source = window.document;
        var sourceURL = window.document.location;
        var validPattern = /^http(s)?:\/\/character-sheets\.appspot\.com\//;
        if(validPattern.test(sourceURL) == false) {
            return;
        }
        
        /* xml 作成 */
        var xml = document.createElement('character');
        xml.setAttribute('location.x', '0');
        xml.setAttribute('location.y', '0');
        xml.setAttribute('posZ', '0');

        /* xml の root に char 要素を作成する */
        var char = document.createElement('data');
        char.setAttribute('name', 'character');

        /* img ブロックを作成し，char の子ノードとする */
        char.appendChild(createImgBlock());

        /* common (キャラクター名，プレイヤー名など) ブロックを作成し，char の子ノードとする */
        char.appendChild(createCommonBlock(source));

        /* detail (能力値など) ブロックを作成し，char の子ノードとする */
        var detail = document.createElement('data');
        detail.setAttribute('name', 'detail');
        char.appendChild(detail);

        /* resource (メンタル，獲得ファン人数)ブロックを作成し，detail の子ノードとする */
        detail.appendChild(createResourceBlock(source));

        /* ability (ボイス，フィジカル，ビジュアル)ブロックを作成し，detail の子ノードとする */
        detail.appendChild(createAbilityBlock(source));

        /* profile (背景など)ブロックを作成し，detail の子ノードとする */
        detail.appendChild(createProfileBlock(source));

        /* 雛形にキャラデータとチャットパレットを設定 */
        xml.appendChild(char);
        xml.appendChild(createChatPaletteBlock());

        /* xml を zip 圧縮 */
        var char_name = getById(source, 'base.name');
        var s = new XMLSerializer();
        var out = s.serializeToString(xml);
        out = out.replace(/xmlns=.http:\/\/www\.w3\.org\/1999\/xhtml../, '');
        out = out.replace(/<br \/>/g, '\n');
        out = out.replace(/currentvalue/g, 'currentValue');
        var zip = new JSZip();
        zip.file(`${char_name}.xml`, out);

        /* ファイル保存 */
        zip.generateAsync({type:'blob'})
        .then(function(blob) {
            saveAs(blob, `${char_name}.zip`);
        });
    }

    /* 最初に jszip をロード */
    var scrJsZip = document.createElement('script');
    scrJsZip.src = 'https://js.cybozu.com/jszip/v3.1.5/jszip.min.js';
    document.body.appendChild(scrJsZip);

    /* 次に FileSaver をロード */
    var scrFileSaver = document.createElement('script');
    scrFileSaver.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js';
    scrFileSaver.onload=function(){main()}; /* 読み込み終了を待って main() を実行 */
    document.body.appendChild(scrFileSaver);

})();