module.exports = function Database() {
	this.mobile = {
		devices : [
			{"username" : "poudels", "d" : []},
			{"username" : "poudels14", "d" : []}
		],

		addCellphone : function(username, socketId) {
			for (var i = 0; i < this.devices.length; i++) {
				if (this.devices[i].username == username) {
					this.devices[i].d.push(socketId); //this adds a new device to the end of array.
					break;
				}
			}

			var usr = {"username" : username, "d" : [socketId]};
			this.devices.push(usr); //this adds a new device to the end of array.
		},

		removeCellphone : function(username, socketId){
			for (var i = 0; i < this.devices.length; i++) {
				if (this.devices[i].username == username) {
					var n = devices[i].d.indexOf(socketId);
					this.devices[i].d.splice(n, 1);     //remove the device
					break;
				}
			}
		},

		getCellphones : function(username) {
			for (var i = 0; i < this.devices.length; i++) {
				if (this.devices[i].username == username) {
					return this.devices[i].d;
				}
			}
			return [];
		},
	};


	this.activeConnection =  {
		connections : [
				//{"username" : "poudels", "socketId" : ["my_first_deive"]},
				//{"username" : "poudels14", "socketId" : ["unknown_device"]}
			],


		addConnection : function(username, socketId, IPaddress) {
			if (this.getSocketId(username) == socketId) {
				console.log(socketId +' connection already exists.')
				return;
			}

			console.log(socketId +' saved as active connection.')
			for (var i = 0; i < this.connections.length; i++) {
				if (this.connections[i].username == username) {
					this.connections[i].socketId.push(socketId);
					return;
				}
			}
			var c = {"username" : username, "socketId" : [socketId]};
			this.connections.push(c); //this adds a new device to the end of array.
		},

		closeConnection : function(socketId) {
			for(var i = 0; i < this.connections.length; i++) {
				if (socketId == this.connections[i].socketId) {
					this.connections.splice(i, 1);
				}
			}
		},

		getSocketId : function(username) {
			for (var i = 0; i < this.connections.length; i++) {
				if (this.connections[i].username == username) {
					return this.connections[i].socketId;
				}
			}
			return "error";
		}
	}
}