let beurl = "http://localhost:8080";
exports.install = function(Vue){
    Vue.prototype.beurl = beurl;
    Vue.prototype.patchUrl = function(url){
        return beurl + url;
    }
    Vue.prototype.Jset = function(key, value){
        localStorage.setItem(key, JSON.stringify(value));
    }
    Vue.prototype.Jget = function(key){
        return JSON.parse(localStorage.getItem(key));
    }
    Vue.prototype.deepCopy = function(obj){
        return JSON.parse(JSON.stringify(obj));
    }
}