/* 
Next action recomeder. 
*/

let totalServers = 0;
let pwned = 0;
let serverArray = [];
let serverTargetArray = [];
let targetScript = "roboFarm.js";
let currentHackingLevel = 0;
let message = "";

/** @param {NS} ns **/
export async function main(ns) {
	totalServers = 0;
	pwned = 0;
	serverArray = [];
	serverTargetArray = [];
	currentHackingLevel = ns.getHackingLevel();
	await exploreLevel(ns, "home", "home", "", 0);
	let scriptRam = ns.getScriptRam("farmAll.js");
	message = "next: " + pwned + "/" + totalServers + " servers rooted"
	ns.toast(message, "success", 30000)
	ns.print("Targets = ", serverArray);
	ns.print("Targets = ", serverTargetArray);
	for (let serverID = 0; serverID < serverArray.length; serverID++) {
		let target = serverArray[serverID];
		ns.print(target)
		let hasScript = ns.fileExists(targetScript, target)
		let runningScript = false;
		let targetRam = ns.getServerMaxRam(target);
		if (hasScript) {
			runningScript = ns.scriptRunning(targetScript, target)
		}
		if (!hasScript) {
			message = "next: " + target + " needs " + targetScript
			ns.toast(message, "error", 10000)
			ns.print(serverTargetArray[serverID])
			continue;
		}
		if (!runningScript) {
			if (targetRam >= scriptRam) {
				message = "next: " + target + " is not running " + targetScript
				ns.toast(message, "error", 10000)
				ns.print(serverTargetArray[serverID])
				let threadNums = Math.floor(targetRam / scriptRam);
				ns.print("runing ", targetScript, " -t ", threadNums);
				ns.exec(targetScript, target, threadNums)
				continue;
			}
		}
	}
	ns.print("End");
}

/** @param {NS} ns **/
async function exploreLevel(ns, parent, grandparent, path, depth = 0) {
	if (depth < 30) {
		// Infinite loop protection
		depth++
		let targets = ns.scan(parent);
		//ns.tprint(parent, " = ", targets)
		for (let i = 0; i < targets.length; i++) {
			let target = targets[i];
			//ns.tprint(target, " vs home or ", parent, " or ", grandparent);
			if (target == "home" || target == parent || target == grandparent) {
				//ns.tprint("did nothing");
			} else {
				totalServers++;
				let targetPath = path + ">" + target;
				ns.print(totalServers, " ", targetPath);
				if (ns.hasRootAccess(target)) {
					let requiredHackingLevle = ns.getServerRequiredHackingLevel(target)
					if (requiredHackingLevle <= currentHackingLevel) {
						ns.print(target, " hacked (", requiredHackingLevle, "/", currentHackingLevel, ")")
						serverArray[serverArray.length] = target
						serverTargetArray[serverTargetArray.length] = targetPath;
						pwned++
					} else {
						ns.print(target, "not hacked (", requiredHackingLevle, "/", currentHackingLevel, ")")
					}
				}
				await exploreLevel(ns, target, parent, targetPath, depth);
			}
		}
	}
}