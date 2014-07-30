var exp = module.exports;

var DateEx = function() {
	var date = new Date();
	this.set(date);
}

var _mem2str = function(i) {
	if(i.length == 1)
		return ('0'+i);
	else if(i.length < 1 || i.length > 2)
		return ('00');
	else return (''+i);
}

DateEx.prototype.set = function(date) {
	this.year = date.getFullYear();
	this.month = date.getMonth()+1;
	this.day = date.getDate()+1;
	this.h = date.getHours()+1;
	this.m = date.getMinutes()+1;
	this.s = date.getSeconds()+1;
}

DateEx.prototype.format = function(str) {
	str = str.replace(/YYYY/ig,_mem2str(this.year));
	str = str.replace(/MM/ig,_mem2str(this.month));
	str = str.replace(/DD/ig,_mem2str(this.day));
	str = str.replace(/HH/ig,_mem2str(this.h));
	str = str.replace(/MI/ig,_mem2str(this.m));
	str = str.replace(/SS/ig,_mem2str(this.s));
	return str;
};

DateEx.prototype.toString = function() {
	return this.format('yyyymmddmiss');
}

module.exports = DateEx;