import { expect, test } from 'vitest';
import './capitalize.js';
import './camel.js';
import './pascal.js';
import './snake.js';
import './kebab.js';

test(`String.{capitalize,camel,pascal,snake,kebab}`, () => {
	expect('test-title'.capitalize()).toBe('Test-title');
	expect('test-title'.camel()).toBe('testTitle');
	expect('test-title'.pascal()).toBe('TestTitle');
	expect('test-title'.snake()).toBe('test_title');
	expect('test_title'.kebab()).toBe('test-title');

	expect('TestTitle'.camel()).toBe('testTitle');
	expect('TestTitle'.kebab()).toBe('test-title');
	expect('testTitle'.snake()).toBe('test_title');
	expect('testTitle'.pascal()).toBe('TestTitle');
});
