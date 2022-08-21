// https://otcatchup.util.repl.co/

type operation = "skip" | "insert" | "delete";

interface OT {
	op: operation;
	count: number;
	chars: string;
}

function isValid(stale: string, latest: string, otjson: string) {
	let ots: OT[] = JSON.parse(otjson);
	let cursorPos: number = 0;
	let str: string = stale;
	let valid: boolean = true;

	for( let ot of ots){
		switch(ot.op) { 
			case "skip": { 
				if(ot.count == undefined){
					return false;
				}
				[ valid, cursorPos ] = skipChar(str, cursorPos, ot.count);
				break; 
			} 
			case "insert": {
				if(ot.chars == undefined){
					return false;
				}
				[ valid, str, cursorPos ] = insertChar(str, cursorPos, ot.chars);
				break; 
			}
			case "delete": {
				if(ot.count == undefined){
					return false;
				}
				[ valid, str, cursorPos ] = deleteChar(str, cursorPos, ot.count);
				break; 
			}
		}
		if(!valid){
			break;
		}
	};

	if( str != latest ){
		valid = false;
	}

	console.log(valid);
	return valid;
}

//returns the validity of the operation, the result string, and the cursor position
function skipChar(str: string, cursorPos: number, count: number): [boolean, number] {
	if( count > 0 ){
		let newCursorPos: number = cursorPos + count;
		if( newCursorPos <= str.length){
			return [true, newCursorPos];
		}
	}

	return [false, cursorPos];
}

function insertChar(str: string, cursorPos: number, addString: string): [boolean, string, number] {
	if( addString.length == 0 ){
		return [true, str, cursorPos];	
	}

	let resultString: string = [str.slice(0, cursorPos), addString, str.slice(cursorPos)].join('');
	let newCursorPos: number = cursorPos + addString.length;

	return [true, resultString, newCursorPos];
}

function deleteChar(str: string, cursorPos: number, count: number): [boolean, string, number] {
	if( count < 0 || ( cursorPos+count > str.length ) ){
		return [false, str, cursorPos];
	}

	let resultString: string = [str.slice(0, cursorPos), str.slice(cursorPos+count)].join('');

	return [true, resultString, cursorPos];
}

isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'Repl.it uses operational transformations.',
	'[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]'
);
// true

isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'Repl.it uses operational transformations.',
	'[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]'
);
// false, delete past end

isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'Repl.it uses operational transformations.',
	'[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]'
);
// false, skip past end

isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'We use operational transformations to keep everyone in a multiplayer repl in sync.',
	'[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
);
// true

isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'We can use operational transformations to keep everyone in a multiplayer repl in sync.',
	'[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
);
// false

isValid(
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
	'[]'
);
// true