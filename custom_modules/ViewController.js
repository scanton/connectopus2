module.exports = class ViewController {

	constructor() {
		this.views = {};
	}

	callViewMethod(type, methodName, data) {
		if(Array.isArray(type)) {
			for(let t in type) {
				let v = this.getViews(type[t]);
				if(!v) {
					setTimeout(() => {
						this.callViewMethod(type[t], methodName, data);
					}, 750);
				}
				for(let i in v) {
					v[i][methodName](data);
				}
			}
		} else {
			let v = this.getViews(type);
			if(!v) {
				setTimeout(() => {
					this.callViewMethod(type, methodName, data);
				}, 750);
			}
			for(let i in v) {
				v[i][methodName](data);
			}
		}
	}

	registerView(type, instance) {
		if(!this.views[type]) {
			this.views[type] = [];
		}
		this.views[type].push(instance);
	}

	getViews(type) {
		return this.views[type];
	}
}
