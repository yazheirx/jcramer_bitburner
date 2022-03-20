let serverArray = ["home"];
let serverPaths = [""];

/** @param {NS} ns **/
export async function getAllServers(ns) {
	await getChildNodes(ns, "home", "");
	// ns.tprint(serverArray);
	return serverArray;
}

export async function getAllPaths(ns) {
	await getChildNodes(ns, "home", "");
	// ns.tprint(serverPaths);
	return serverPaths;
}

async function getChildNodes(ns, parent, path) {
	let depth = 0;
	if(depth < 30){
		depth++
		let targets = ns.scan(parent);
		for (let i = 0; i < targets.length; i++) {
			let target = targets[i];
			if(!serverArray.includes(target))	{
				serverArray.push(target);
				let fullPath = path + "/" + target
				serverPaths.push(fullPath);
				await getChildNodes(ns, target, fullPath)
			}
		}
	}
}