function isValid(staleContents, latestContents, data) {
	try {
		const operations = JSON.parse(data);

		const result = operations.reduce(({ updatedContents, position, isValid }, operation) => {
			if (!isValid) {
				return { updatedContents, position, isValid };
			};

			const { op, count, chars } = operation;

			switch (op) {
				case "skip":
					if (position + count > staleContents.length) {
						return { isValid: false };

					} else {
						const skippedContent = staleContents.substring(position, position + count);

						return {
							updatedContents: updatedContents + skippedContent,
							position: position + count,
							isValid,
						};
					};

				case "delete":
					if (position + count > staleContents.length) {
						return { isValid: false };

					} else {
						return { 
							updatedContents,
							position: position + count,
							isValid };
					};

				case "insert":
					return {
						updatedContents: updatedContents + chars,
						position, isValid
					};

				default:
					return { isValid: false };
			}
		}, {
			updatedContents: "",
			position: 0,
			isValid: true
		});

		const finalContents = result.updatedContents + staleContents.substring(result.position);

		return result.isValid && finalContents === latestContents;

	} catch (error) {
		return false;
	};
};

// tests

console.log('should be T F F T F T')
console.log(isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'Repl.it uses operational transformations.',
	'[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]'
)); // true

console.log(isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'Repl.it uses operational transformations.',
	'[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]'
)); // false, delete past end

console.log(isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'Repl.it uses operational transformations.',
	'[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]'
)); // false, skip past end

console.log(isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'We use operational transformations to keep everyone in a multiplayer repl in sync.',
	'[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
)); // true

console.log(isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'We can use operational transformations to keep everyone in a multiplayer repl in sync.',
	'[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
)); // false

console.log(isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'[]'
)); // true
