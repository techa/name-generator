import test from 'ava';
import './capitalize.js';
import './camel.js';
import './pascal.js';
import './snake.js';
import './kebab.js';

test(`String.{capitalize,camel,pascal,snake,kebab}`, (t) => {
	t.is('test-title'.capitalize(), 'Test-title');
	t.is('test-title'.camel(), 'testTitle');
	t.is('test-title'.pascal(), 'TestTitle');
	t.is('test-title'.snake(), 'test_title');
	t.is('test_title'.kebab(), 'test-title');

	t.is('TestTitle'.camel(), 'testTitle');
	t.is('TestTitle'.kebab(), 'test-title');
	t.is('testTitle'.snake(), 'test_title');
	t.is('testTitle'.pascal(), 'TestTitle');
});
