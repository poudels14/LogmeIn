var Encryption = {
	"ASCII" : {
		"encode" : function(data){
			if (data.length == 0) return null;
			var N = 7 * data.length;
			var out = [];

			for(var i = 0; i < data.length; i++) {
				var x = data.charCodeAt(i);

				for(var j = 0; j < 7; j++) {
					var k = (7 * i) + 6 - j;
					if(x % 2 != 0)
						out[k] = true;
					else
						out[k] = false;
					x = parseInt(x / 2);
				}
			}
			return out;
		},

		"decode" : function(bits){
			if (bits.length == 0) return null;
			var N = parseInt(bits.length);
			var out = "";
			var b = "";
			for(var i = 0; i < N; i += 7) {
				var x = 0;
				for (var j = 0; j < 7; j++) {
					b += bits[i + j] + " -> ";
					var n = 0;
					if (bits[i + j])
						n = 1;
					x += (n * parseInt(Math.pow(2, 6 - j)));
				}
				out += String.fromCharCode(x);
			}
			return out;
		},

		"encrypt" : function(){
			
		}

	},

}