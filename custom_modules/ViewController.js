module.exports = class ViewController {

	constructor() {
    this.views = {};
	}

  callViewMethod(type, methodName, data) {
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
