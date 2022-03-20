/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0];
	let ckBruteSSH = ns.fileExists("BruteSSH.exe");
	let ckFTPCrack = ns.fileExists("FTPCrack.exe");
	let ckrelaySMTP = ns.fileExists("relaySMTP.exe");
	let ckHTTPWorm = ns.fileExists("HTTPWorm.exe");
	let ckSQLInject = ns.fileExists("SQLInject.exe")
	let portsHacked = 0;
	let numerOfPorts = ns.getServerNumPortsRequired(target);
	if (ns.hasRootAccess(target) != true) {
		if (ckBruteSSH) {
			ns.brutessh(target);
			ns.print("Running BruteSSH on ", target);
			portsHacked++;
		}
		if (ckFTPCrack) {
			ns.ftpcrack(target);
			ns.print("Running FTPcrack on ", target);
			portsHacked++;
		}
		if (ckrelaySMTP) {
			ns.relaysmtp(target);
			ns.print("Running relaySMTP on ", target);
			portsHacked++;
		}
		if (ckHTTPWorm) {
			ns.httpworm(target)
			ns.print("Running HTTPWorm on ", target);
			portsHacked++;
		}
		if (ckSQLInject) {
			ns.sqlinject(target)
			ns.print("Running HTTSQLInjectPWorm on ", target);
			portsHacked++;
		}
		if (numerOfPorts <= portsHacked) {
			ns.nuke(target);
		} else {
			ns.print("~", target, " unable to hack with ", numerOfPorts, "/", portsHacked, " ports")
		}
	};
}