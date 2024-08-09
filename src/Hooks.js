export default class Hooks {
	/**
	 * Add code to be executed at a given hook
	 * @param {*} name
	 * @param {*} callback
	 * @param {*} options
	 * @returns {void}
	 */
	add (name, callback, options) {
		if (typeof name != "string") {
			let hooks = name;
			// Multiple hooks
			for (let name in hooks) {
				this.add(name, hooks[name], arguments[1]);
			}

			return;
		}

		if (Array.isArray(name)) {
			for (let n of name) {
				return this.add(n, callback, options);
			}
		}

		if (callback) {
			let existing = this[name];
			if (!(name in this)) {
				existing = this[name] = [];
			}

			let index;
			if (options === true) {
				index = 0;
			}

			// TODO implement relative order

			if (index === 0) {
				existing.splice(index, 0, callback);
			}
			else {
				existing.push(callback);
			}
		}
	}

	run (name, env) {
		if (!this[name]) {
			return;
		}
		// TODO stats on which hooks have already ran?

		for (let callback in this[name]) {
			callback.call(env?.this ?? env?.context ?? env, env);
		}
	}
}