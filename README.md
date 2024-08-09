# Blissful Hooks

Deep extensibility for all!

A spinoff from ye olde [BlissfulJS](https://blissfuljs.com) project.
A [precursor of this code](https://github.com/PrismJS/prism/blob/59e5a3471377057de1f401ba38337aca27b80e03/components/prism-core.js#L717) powers the plugin system of [PrismJS](https://prismjs.com).

- ✅ Tiny, dependency-free codebase. Literally < 50 loc.
- ✅ Works everywhere, browsers, JS runtimes, you name it

## Usage

### For Library Authors

First, create a new `Hooks` instance, and expose it to third-party code.
E.g. if your library is a class, it can be a static property:

```js
// In a browser? Just import src/index.js instead
import Hooks from "blissful-hooks";

class MyAwesomeClass {
	static hooks = new Hooks();
}
```

If your library is a set of modules, it can just be an export:

```js
import Hooks from "blissful-hooks";
export const hooks = new Hooks();
```

Or, if you don’t care about potential name clashes across other libraries using this module, you can just use/export the `hooks` singleton:

```js
import { hooks } from "blissful-hooks";
export { hooks };
```

Now, at the places in your code where you want to allow extensions, call `hooks.run(hookName, env)`.

```javascript
hooks.run("hook-name", this);
```

Plugin code will now be executed with the same context as your code.

Instead of the current context, you can pass variables that plugins can read and manipulate!
Ideally, it would be exposing local variables, and you'd be reading and writing directly from it.
Then, you pass can still pass the current context to the plugin as a special `this` or `context` property (if both are present, `this` wins).
For example, here’s how a syntax highlighter might use it:

```js
let env = {
	callback,
	container,
	selector: 'code[class*="language-"], [class*="language-"] code',
	this: this,
};

hooks.run('before-highlightall', env);

env.elements = env.container.querySelectorAll(env.selector);

hooks.run('before-all-elements-highlight', env);

for (let element of env.elements) {
	highlightElement(element, env.callback);
}

hooks.run('after-all-elements-highlight', env);
```

### For Plugin Authors

Plugin authors use `hooks.add()` to schedule code to run at a given hook.
For example, suppose we wanted to change the selector above to also accept `lang-*` classes.
It would be as simple as:

```js
hooks.add("before-highlightall", function(env) {
	env.selector += ', code[class*="lang-"], [class*="lang-"] code';
});
```

You can also add multiple hooks at one:

```js
hooks.add({
	"before-highlightall": function(env) {
		env.selector += ', code[class*="lang-"], [class*="lang-"] code';
	},
	"before-all-elements-highlight": function(env) {
		env.elements = Array.from(env.elements).filter(e => !e.classList.contains("no-highlight"));
	}
});
```

Or the same callback to multiple hooks:

```js
hooks.add(["before-highlightall", "some-other-hook"], function(env) {
	env.selector += ', code[class*="lang-"], [class*="lang-"] code';
});
```

## FAQ

### Can a hook cause a function to early return?

Yes, but only with the consent of the library author.
Simply returning a value from your hook callback will do nothing (duh).
However, the library author can designate that a certain property holds a return value,
and if that property is non-empty, they can choose to honor it:

```js
let env = {this: this}
hooks.run("hook-name", env);

if (env.returnValue) {
	return env.returnValue;
}
```

### What happens if I add code to a hook that doesn't exist?

Nothing happens. The code simply never gets executed.
Libraries don't need to declare their hooks upfront (by design),
so there is no way for Blissful Hooks to know the difference between a hook that hasn't run yet and a hook that never will.

## Used By

It took 12 years of usage before I released this as a separate package, but precursors of it are used in several libraries:

- [PrismJS](https://github.com/PrismJS/prism/blob/59e5a3471377057de1f401ba38337aca27b80e03/components/prism-core.js#L717)
- [Colorjs.io](https://github.com/color-js/color.js/blob/main/src/hooks.js)
- [Inspire.js](https://github.com/LeaVerou/inspire.js/blob/master/src/util.js)
- [JSEP](https://github.com/EricSmekens/jsep/blob/0497757d90b81b172303ac8233548fbe5e4216aa/src/hooks.js)
- [Madata](https://github.com/madatajs/madata/blob/e1d0e3eba05be13d1cf022967217d9b013af2d4f/src/hooks.js)
- [Mavo](https://github.com/mavoweb/mavo/blob/7143d5ff9245809e9e9fdd68c30afec77548b80a/src/mavo.js#L904)
- [Nude Element](https://github.com/nudeui/element/blob/f6bc59a364b0b2899e1622fa0f1fd55f935d9583/src/mixins/hooks.js)
- [hTest](https://github.com/LeaVerou/htest/blob/2ea1ed079c7e44d09af6033d26b0de69dcaf2f0d/src/hooks.js)
