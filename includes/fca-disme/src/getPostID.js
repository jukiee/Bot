module.exports = () => {
    async function getPostID(url) {
        function isUrlValid(link) {
            var res = link.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            if (res == null)
                return !1;
            else return !0
        };
        if (!isUrlValid(url)) return {
            error: 1,
            message: "Link không hợp lệ"
        }
        const regexList = [
            /.*\/posts\/([0-9]{8,})/,
            /.*\/photo.php\?fbid=([0-9]{8,})/,
            /.*\/photo\/\?fbid=([0-9]{8,})/,
            /.*\/photo\?fbid=([0-9]{8,})/,
            /.*\/video.php\?v=([0-9]{8,})/,
            /.*\/story.php\?story_fbid=([0-9]{8,})/,
            /.*\/permalink.php\?story_fbid=([0-9]{8,})/,
            /.*\/([0-9]{8,})/,
            /.*comment_id=([0-9]{8,})/,
            /.*media\/set\/\?set=a\.([0-9]{8,})/,
            /.*\/watch\/\?v=([0-9]{8,})/,
            /.*\/reel\/([0-9]{8,})/
        ];
        var idFacebook = null;
        for (let regex of regexList) {
            const match = url.match(regex);
            if (match) {
                idFacebook = match[1];
                if (regex === regexList[0]) {
                    idFacebook = `${idFacebook}`;
                }
            }
        }
        if (url.includes('multi_permalinks')) {
            const match = url.match(/multi_permalinks=([0-9]{8,})/);
            if (match) {
                idFacebook = match[1];
            }
        }
        if (url.includes('comment_id')) {
            const match = url.match(/comment_id=([0-9]{8,})/);
            if (match) {
                idFacebook = match[1];
            }
        }
        if (!idFacebook) {
            const { data } = await axios.get(url);
            const match = data.match(/subscription_target_id:"([0-9]{8,})"/) || data.match(/"story_token":"([0-9]{8,})"/);
            idFacebook = match ? match[1] : null;
        }
        return {
            id: idFacebook,
            url: "https://www.facebook.com/" + idFacebook
        }
    }
    return getPostID;
}
