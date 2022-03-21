/** @param {NS} ns **/
export async function main(ns, overWright = false) {

	let target = ns.args[0];

	var scriptNames = ["roboFarm.js", "utils.js"];
	var scriptName = "";
	var targetServerID = 0;
	var targetScriptID = 0;
	var runningServers = true;
	var runningScripts = true;
	// ns.tprint("Checking: ", target);
	targetScriptID = 0;
	runningScripts = true;
	if (ns.hasRootAccess(target) == true) {
		while (runningScripts) {
			if (targetScriptID < scriptNames.length) {
				scriptName = scriptNames[targetScriptID];
				// ns.tprint("Script #", targetScriptID, " : ", scriptName)
				if (ns.fileExists(scriptName, target)) {
					if (overWright) {
						ns.tprint(scriptName, " found on ", target);
						if (ns.isRunning(scriptName, target)) {
							ns.tprint(scriptName, " running on ", target);
							ns.scriptKill(scriptName, target);
						}
						await ns.sleep(500);
						await writeThis(ns, scriptName, target)
					}
				} else {
					await ns.sleep(500);
					await writeThis(ns, scriptName, target)
				};
				targetScriptID++
			} else {
				runningScripts = false;
			}
		};
	} else {
		ns.tprint("No access to: ", target);
	};
}

async function writeThis(ns, scriptName, target) {
	if (await ns.scp(scriptName, target)) {
		ns.tprint(scriptName, " moved to ", target);
	} else {
		ns.tprint(scriptName, " failed to copy on ", target);
	};
}