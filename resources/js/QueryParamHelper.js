

export default {
    methods: {
        updateUrl(key, value) {
            let url = window.location.href;

            if(value!==undefined){
                value = encodeURI(value);
            }
            var urls = url.split('?');
            var baseUrl = urls[0];
            var parameters = '';
            var outPara = {};
            if(urls.length>1){
                parameters = urls[1];
            }
            if(parameters!=''){
                parameters = parameters.split('&');
                for(k in parameters){
                    var keyVal = parameters[k];
                    keyVal = keyVal.split('=');
                    var ekey = keyVal[0];
                    var temp = '';
                    if(keyVal.length>1){
                        temp = keyVal[1];
                    }
                    outPara[ekey] = temp;
                }
            }

            if(value!=undefined){
                outPara[key] = value;
            }else{
                delete outPara[key];
            }
            parameters = [];
            for(var k in outPara){
                parameters.push(k + '=' + outPara[k]);
            }

            var finalUrl = baseUrl;

            if(parameters.length>0){
                finalUrl += '?' + parameters.join('&');
            }

            window.history.pushState({}, "SayHiDog", finalUrl);
        },

        getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        },

        removeURLParameter(key) {
            let url = window.location.href;

            key = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

            if (!url) url = window.location.href;

            var hashParts = url.split('#');

            var regex = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");

            if (hashParts[0].match(regex)) {
                //REMOVE KEY AND VALUE
                url = hashParts[0].replace(regex, '$1');

                //REMOVE TRAILING ? OR &
                url = url.replace(/([?&])$/, '');

                //ADD HASH
                if (typeof hashParts[1] !== 'undefined' && hashParts[1] !== null)
                    url += '#' + hashParts[1];
            }

            window.history.pushState({}, "SayHiDog", url);
        }
    }
}