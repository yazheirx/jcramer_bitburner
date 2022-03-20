let gardenerSrcipt = "garden.js";
let roboFarmScript = "roboFarm.js"
let roboFrarmThreads = 1024;
let arhaScript = "arha.js";
let nextScript = "next.js";

/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		ns.toast("Jarvis Thinking", "info", 1000)
		if (!ns.scriptRunning(gardenerSrcipt, "home")) {
			ns.toast("Starting Hacknet Gardener", "info", 1000)
			ns.exec(gardenerSrcipt, "home", 1)
		} else {
			// cascading my if's to start one script per minute
			if (!ns.scriptRunning(roboFarmScript, "home")) {
				ns.toast("Starting Robo Farming", "info", 1000)
				ns.exec(roboFarmScript, "home", roboFrarmThreads)
			} else {
				if (!ns.scriptRunning(arhaScript, "home")) {
					ns.toast("Starting Automated Recursive Hacking Assistant", "info", 1000)
					ns.exec(arhaScript, "home", 1)
				}
				await ns.sleep(30000);
				if (!ns.scriptRunning(nextScript, "home")) {
					ns.toast("Starting Next", "info", 1000)
					ns.exec(nextScript, "home", 1)
				}
			}
		}
		await ns.sleep(60000)
	}
}