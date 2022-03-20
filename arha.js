/* 
Automated Recursive Hacking Assistant
*/
import { getAllServers } from "./utils.js";

let pwned = 0;
let serverArray = [];
let currentHackingLevel = 0;
let overWright = false;
let nextHackAt = 99999;

/** @param {NS} ns **/
export async function main(ns) {
	currentHackingLevel = ns.getHackingLevel();
	serverArray = await getAllServers(ns); // recursion has ben moved to the utility file so it only needs to be written once
	/* 
	TODO: replace below by getting only non-hacked servers to hack
	*/
	for(let targetID=0; targetID < serverArray.length; targetID++){
		let target = serverArray[targetID];
		let requiredHackingLevel = ns.getServerRequiredHackingLevel(target)
		if (ns.hasRootAccess(target)) {
			if (requiredHackingLevel <= currentHackingLevel) {
				ns.print(target, " hacked (", requiredHackingLevel, "/", currentHackingLevel, ")")
				ns.run("updateTarget.js", 1, target, overWright);
				pwned++
			} else {
				let message = target + "not hacked (" + requiredHackingLevel + "/" + currentHackingLevel + ")";
				ns.toast(message, "error", 10000)
			}
		} else {
			if (requiredHackingLevel < nextHackAt) {
				nextHackAt = requiredHackingLevel;
				ns.tprint(target, " has a required hacking level of ", requiredHackingLevel, " of ", nextHackAt)
			}
			ns.run("hackTarget.js", 1, target);
		}
	}
	let message = "arha: " + pwned + "/" + serverArray.length + " servers rooted. Next hack at: " + nextHackAt
	ns.toast(message, "info", 10000)
	pwned = 0;
	serverArray = [];
};