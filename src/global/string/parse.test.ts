import test from 'ava';
import './parseInt.js';
import './parseFloat.js';

test(`parseInt`, (t) => {
	t.is('0.9t'.parseInt(), 0);
	t.is('-0.9t'.parseInt(), -0);
});

test(`parseFloat`, (t) => {
	t.is('0.9t'.parseFloat(), 0.9);
	t.is('-0.9t'.parseFloat(), -0.9);
});
