/**
 * jsdiff
 *
 * BSD License: Copyright (c) 2009-2015, Kevin Decker
 * https://github.com/kpdecker/jsdiff
 */

/** */
interface ComponentDraft {
	count: number;
	value?: string;
	added?: boolean;
	removed?: boolean;
}
interface Component {
	count: number;
	value: string;
	added?: boolean;
	removed?: boolean;
}
interface Path {
	newPos: number;
	components: ComponentDraft[];
}
interface DiffOptions {
	ignoreCase?: boolean;
	comparator?: (left: string, right: string) => boolean;
}

export class Diff {
	useLongestToken = false;

	options: DiffOptions = {
		ignoreCase: false,
	};

	comp(oldString: string, newString: string) {
		const longer =
			oldString.length > newString.length ? oldString : newString;
		const shorter =
			oldString.length > newString.length ? newString : oldString;
		let searchStartIndex = -1;

		const result = Array(longer.length).fill(' ');

		for (let j = 0; j < shorter.length; j++) {
			const sChar = shorter[j];
			for (let i = searchStartIndex; i < longer.length; i++) {
				const lChar = longer[i];
				if (this.equals(lChar, sChar)) {
					searchStartIndex++;
					break;
				}
			}
			if (searchStartIndex > -1) {
				result[searchStartIndex] = sChar;
			}
		}
	}

	diff(oldString: string, newString: string): Component[] {
		// Allow subclasses to massage the input prior to running
		oldString = this.castInput(oldString);
		newString = this.castInput(newString);

		const oldToken = this.removeEmpty(this.tokenize(oldString));
		const newToken = this.removeEmpty(this.tokenize(newString));

		const newLen = newToken.length;
		const oldLen = oldToken.length;
		let editLength = 1;

		const bestPath: Path[] = [{ newPos: -1, components: [] }];

		// Seed editLength = 0, i.e. the content starts with the same values
		const oldPos = this.extractCommon(bestPath[0], newToken, oldToken, 0);

		if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
			// Identity per the equality and tokenizer
			return [{ value: this.join(newToken), count: newToken.length }];
		}

		// Main worker method. checks all permutations of a given edit length for acceptance.
		const execEditLength = () => {
			for (
				let diagonalPath = -1 * editLength;
				diagonalPath <= editLength;
				diagonalPath += 2
			) {
				let basePath: Path;
				const addPath = bestPath[diagonalPath - 1];
				const removePath = bestPath[diagonalPath + 1];
				let oldPos =
					(removePath ? removePath.newPos : 0) - diagonalPath;
				if (addPath) {
					// No one else is going to attempt to use this value, clear it
					bestPath[diagonalPath - 1] = undefined;
				}

				const canAdd = addPath && addPath.newPos + 1 < newLen;
				const canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
				if (!canAdd && !canRemove) {
					// If this path is a terminal then prune
					bestPath[diagonalPath] = undefined;
					continue;
				}

				// Select the diagonal that we want to branch from. We select the prior
				// path whose position in the new string is the farthest from the origin
				// and does not pass the bounds of the diff graph
				if (
					!canAdd ||
					(canRemove && addPath.newPos < removePath.newPos)
				) {
					basePath = clonePath(removePath);
					this.pushComponent(basePath.components, false, true);
				} else {
					basePath = addPath; // No need to clone, we've pulled it from the list
					basePath.newPos++;
					this.pushComponent(basePath.components, true, false);
				}

				oldPos = this.extractCommon(
					basePath,
					newToken,
					oldToken,
					diagonalPath,
				);

				// If we have hit the end of both strings, then we are done
				if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
					return this.buildValues(
						basePath.components,
						newToken,
						oldToken,
						this.useLongestToken,
					);
				} else {
					// Otherwise track this path as a potential candidate and continue.
					bestPath[diagonalPath] = basePath;
				}
			}

			editLength++;
		};

		const maxEditLength = newLen + oldLen;
		while (editLength <= maxEditLength) {
			const ret = execEditLength();
			if (ret) {
				return ret;
			}
		}
	}

	pushComponent(
		components: ComponentDraft[],
		added: boolean,
		removed: boolean,
	): void {
		const last = components[components.length - 1];
		if (last && last.added === added && last.removed === removed) {
			// We need to clone here as the component clone operation is just
			// as shallow array clone
			components[components.length - 1] = {
				count: last.count + 1,
				added: added,
				removed: removed,
			};
		} else {
			components.push({ count: 1, added, removed });
		}
	}

	extractCommon(
		basePath: Path,
		newToken: string[],
		oldToken: string[],
		diagonalPath: number,
	): number {
		const newLen = newToken.length;
		const oldLen = oldToken.length;
		let newPos = basePath.newPos;
		let oldPos = newPos - diagonalPath;
		let commonCount = 0;
		while (
			newPos + 1 < newLen &&
			oldPos + 1 < oldLen &&
			this.equals(newToken[newPos + 1], oldToken[oldPos + 1])
		) {
			newPos++;
			oldPos++;
			commonCount++;
		}

		if (commonCount) {
			basePath.components.push({ count: commonCount });
		}

		basePath.newPos = newPos;
		return oldPos;
	}

	buildValues(
		components: ComponentDraft[],
		newToken: string[],
		oldToken: string[],
		useLongestToken?: boolean,
	): Component[] {
		const componentLen = components.length;
		let componentPos = 0,
			newPos = 0,
			oldPos = 0;

		for (; componentPos < componentLen; componentPos++) {
			const component = components[componentPos];
			if (!component.removed) {
				if (!component.added && useLongestToken) {
					let value = newToken.slice(
						newPos,
						newPos + component.count,
					);
					value = value.map((value, i) => {
						const oldValue = oldToken[oldPos + i];
						return oldValue.length > value.length
							? oldValue
							: value;
					});

					component.value = this.join(value);
				} else {
					component.value = this.join(
						newToken.slice(newPos, newPos + component.count),
					);
				}
				newPos += component.count;

				// Common case
				if (!component.added) {
					oldPos += component.count;
				}
			} else {
				component.value = this.join(
					oldToken.slice(oldPos, oldPos + component.count),
				);
				oldPos += component.count;

				// Reverse add and remove so removes are output first to match common convention
				// The diffing algorithm is tied to add then remove output and this is the simplest
				// route to get the desired output with minimal overhead.
				if (componentPos && components[componentPos - 1].added) {
					const tmp = components[componentPos - 1];
					components[componentPos - 1] = components[componentPos];
					components[componentPos] = tmp;
				}
			}
		}

		// Special case handle for when one terminal is ignored (i.e. whitespace).
		// For this case we merge the terminal into the prior string and drop the change.
		// This is only available for string mode.
		const lastComponent = components[componentLen - 1];
		if (
			componentLen > 1 &&
			typeof lastComponent.value === 'string' &&
			(lastComponent.added || lastComponent.removed) &&
			this.equals('', lastComponent.value)
		) {
			components[componentLen - 2].value += lastComponent.value;
			components.pop();
		}

		return components as Component[];
	}

	equals(left: string, right: string): boolean {
		if (this.options.comparator) {
			return this.options.comparator(left, right);
		} else {
			return (
				left === right ||
				(this.options.ignoreCase &&
					left.toLowerCase() === right.toLowerCase())
			);
		}
	}
	removeEmpty(array: string[]): string[] {
		const ret: string[] = [];
		for (let i = 0; i < array.length; i++) {
			if (array[i]) {
				ret.push(array[i]);
			}
		}
		return ret;
	}
	castInput(value: string): string {
		return value;
	}
	tokenize(value: string): string[] {
		return value.split('');
	}
	join(chars: string[]): string {
		return chars.join('');
	}
}

function clonePath(path: Path): Path {
	return { newPos: path.newPos, components: path.components.slice(0) };
}

const _diff = new Diff();
export const diff = (oldString: string, newString: string) =>
	_diff.diff(oldString, newString);
