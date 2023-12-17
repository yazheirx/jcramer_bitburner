/*
manage money on hacked servers
*/

import { getAllServers } from "./utils.js";

let serverArray = [];
let currentHackingLevel = 0;
let moneyThresh = 100000;

/** @param {NS} ns **/
export async function main(ns) {
	serverArray = await getAllServers(ns); // recursion has ben moved to the utility file so it only needs to be written once
	/* 
	TODO: replace below by getting only non-hacked servers to hack
	*/
    while(true){
	    currentHackingLevel = ns.getHackingLevel();
        for(let targetID=0; targetID < serverArray.length; targetID++){
            let target = serverArray[targetID];
            // let requiredHackingLevel = ns.getServerRequiredHackingLevel(target)
            if (ns.hasRootAccess(target)) {
                if (ns.getServerSecurityLevel(target) > currentHackingLevel) {
                    // If the server's security level is above our threshold, weaken it
                    await ns.weaken(target);
                } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
                    // If the server's money is less than our threshold, grow it
                    await ns.grow(target);
                } else {
                    // Otherwise, hack it
                    await ns.hack(target);
                }
            } else {
                // do nothing this server is not yet hacked
            }
        }
    }
}
