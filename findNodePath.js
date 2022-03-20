import { getAllServers, getAllPaths } from "./utils.js";
/* 
I like to use this script to tell me the path of any server, including servers that are greater than 10 levels deep from home
*/

/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0]; // get target serer name
	if (target == null) {
		ns.tprint('Arguments:')
		ns.tprint('* - returns all node names')
		ns.tprint('[node name] - returns the path of the node if found');
		return;	
	}
	let serverArray = await getAllServers(ns); // get all the server names
	let targetID = serverArray.indexOf(target); // get the position of the server with that name
	if (targetID > -1){
		let pathArray = await getAllPaths(ns); // get all the server paths
		ns.tprint(pathArray[targetID]); // print the path of the target server
	} else if(target == "*") {
		serverArray.forEach(element => ns.tprint(element))
	} else {
		ns.tprint(target, " not found in server list.") // inform user that target is not found in server list
	}
}