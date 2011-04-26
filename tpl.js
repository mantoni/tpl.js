/*
 * Copyright 2010 Maximilian Antoni
 *
 * The smallest possible JavaScript template "engine".
 */
Tpl = (function() {
	var templates = {};
	var data = {};
	
	function toHtml(name, data) {
		var template = templates[name];
		if(!template) throw new Error("Template \"" + name + "\" not found");
		return template.replace(/\{([\w\.\|\*]+)(?:\(([^\)]+)\))?\}/g,
				function(match, key, separator) {
			var keys = key.split("|") || [key], value, type;
			while(keys.length) {
				key = keys.shift();
				if(key === "*")
					return data;
				if(value = data[key])
					break;
			}
			if(Object.prototype.toString.call(value) === "[object Array]") {
				var html = [];
				for(var l=value.length, i=0; i<l; i++) {
					value[i].index = i;
					html.push(toHtml(key, value[i]));
				}
				return html.join(separator || "");
			}
			return templates[key] ? toHtml(key, value) : value;
		});
	}
	
	return {
		def: function(t, d) {
			for(var k in t)
				templates[k] = t[k];
			if(d) {
				for(var k in d)
					data[k] = d[k];
			}
		},
		
		apply: function(nodeOrId, name, keyOrData) {
			if(typeof nodeOrId === "string")
				nodeOrId = document.getElementById(nodeOrId);
			var d;
			if(!keyOrData)
				d = data[name];
			else if(typeof keyOrData === "string")
				d = data[keyOrData];
			else
				d = keyOrData;
			nodeOrId.innerHTML = toHtml(name, d);
		}
	};
	
})();