import Hooks from "../src/Hooks.js";

export default {
	data: {
		hooks: new Hooks(),
	},
	tests: [
		{
			name: "run before add",
			run () {
				let hooks = new Hooks();
				let env = {};
				hooks.run("test", env);
				hooks.add("test", env => env.foo = true);
				return env.foo;
			},
			args: [],
			expect: undefined,
		},
		{
			name: "add before run",
			run () {
				let hooks = new Hooks();
				hooks.add("test", env => env.foo = true);
				let env = {};
				hooks.run("test", env);
				return env.foo;
			},
			args: [],
			expect: true,
		},
		{
			name: "add multiple callbacks to the same hook",
			run () {
				let hooks = new Hooks();
				hooks.add("test", env => env.foo = true);
				hooks.add("test", env => env.bar = true);
				let env = {};
				hooks.run("test", env);
				return env;
			},
			expect: {foo: true, bar: true}
		},
		{
			name: "add one callback to multiple hooks",
			run () {
				let hooks = new Hooks();
				hooks.add(["foo", "bar"], env => env.count = env.count ? env.count + 1 : 1);
				let env = {};
				hooks.run("foo", env);
				hooks.run("bar", env);
				return env.count;
			},
			expect: 2,
		},
		{
			name: "add multiple callbacks to multiple hooks",
			run () {
				let hooks = new Hooks();
				hooks.add({
					foo: env => env.foo = true,
					bar: env => env.bar = true,
				});
				let env = {};
				hooks.run("foo", env);
				hooks.run("bar", env);
				return env;
			},
			expect: {foo: true, bar: true},
		},
		{
			name: "add non-function callback",
			run () {
				let hooks = new Hooks();
				hooks.add("test", "foo");
			},
			throws: true,
		}
	],
}