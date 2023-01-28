export class Random {
	next() {
		return Math.random();
	}
	int(max: number, min = 0): number {
		if (max < min) {
			[max, min] = [min, max];
		}
		return Math.floor((max - min + 1) * this.next() + min);
	}
	float(max = 1, min = 0): number {
		if (max < min) {
			[max, min] = [min, max];
		}
		return (max - min) * this.next() + min;
	}
	bool(likelihood = 0.5): boolean {
		return this.next() <= likelihood;
	}
	pick<T>(array: ArrayLike<T>): T {
		return array[this.int(array.length - 1)];
	}
	picks<T>(
		array: ArrayLike<T>,
		numPicks: number,
		allowDuplicates = false,
	): T[] {
		if (!Number.isFinite(numPicks) || numPicks < 0) {
			throw new Error(
				'Invalid number of elements to pick, must pick a value 0 <= n',
			);
		}
		if (numPicks === 0) {
			return [];
		}

		const result: T[] = [];

		if (allowDuplicates) {
			while (result.length < numPicks) {
				result.push(this.pick(array));
			}
			return result;
		}

		if (numPicks > array.length) {
			throw new Error(
				'Invalid number of elements to pick, must pick a value n <= length',
			);
		}

		const temp = Array.from(array);
		while (result.length < numPicks) {
			const index = this.int(0, temp.length - 1);
			result.push(temp.splice(index, 1)[0]);
		}

		return result;
	}

	shuffle<T>(array: Array<T>): Array<T> {
		const tempArray = array.slice(0);
		let swap: T = null;
		for (let i = 0; i < tempArray.length - 2; i++) {
			const randomIndex = this.int(i, tempArray.length - 1);
			swap = tempArray[i];
			tempArray[i] = tempArray[randomIndex];
			tempArray[randomIndex] = swap;
		}

		return tempArray;
	}

	/**
	 * @param sided the number of faces of each dice, 2 <= sided
	 * @param times the number of dice to be rolled, 1 <= times
	 */
	dice(sided: number, times = 1): number {
		if (sided < 2 || times < 1) {
			throw new Error(
				'Invalid number, must sided a value 2 <= n, must times a value 1 <= n.',
			);
		}
		let result = 0;
		while (times--) {
			result += this.int(1, sided);
		}
		return result;
	}
	/**
	 * @see https://en.wikipedia.org/wiki/Dice_notation
	 * @param dice `1d6`, `3d10`
	 */
	rpg(dice: `${number}${'d' | 'D'}${number}`): number {
		const [times, sided] = dice.split(/d/i).map((n) => +n || 1);
		return this.dice(sided, times);
	}

	/**
	 * @param obj `[3,4,5]`, `{a:3,b:4,c:5}`, `{a:{odds: 3},b:{odds: 4},c:{odds: 5}}`
	 */
	byOdds(obj: number[]): number;
	byOdds(obj: { [s: string]: number }): string;
	byOdds<T>(obj: { [s: string]: T }, oddsKey?: string): [string, T];
	byOdds<T>(
		obj:
			| number[]
			| {
					[s: string]: number;
			  }
			| {
					[s: string]: T;
			  },
		oddsKey = 'odds',
	): number | string | [string, T] {
		const entries = Object.entries(obj);
		let retuenIndex = true;
		let total = 0;
		for (const [key, value] of entries) {
			if (typeof value === 'number') {
				total += value;
			} else if (value && typeof value[oddsKey] === 'number') {
				total += value[oddsKey];
				retuenIndex = false;
			} else {
				throw new Error(
					`byOdds: obj[${key}][${oddsKey}]=${value} or ${value[oddsKey]}`,
				);
			}
		}

		const rate = total * this.float();
		let border = 0;
		for (const [key, value] of entries) {
			border += (retuenIndex ? value : value[oddsKey]) as number;
			if (rate < border) {
				return retuenIndex
					? Array.isArray(obj)
						? +key
						: key
					: [key, value];
			}
		}
	}
}

export const random = new Random();
