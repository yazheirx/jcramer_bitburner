let waitTime = 60000;
let targetNodeNum = 9;
let maxNodeNum = 25;
let targetPrchServerNum = 20;
let targetPrchServerRAM = 16;
let targetPrchServerName = "";
let oneBillion = 1000000000;
let currentNodeCount = 0;
let maxLevel = 200;
let maxRAM = 32;
let maxCores = 16;
let targetLevel = 0;
let targetRAMCount = 0;
let targetCPUCount = 0;
let targetBuyNode = -1;
let targetBuyCost = 999999999999;
let targetBuyAttribute = "";
let myMoney = 0;
// let programList = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe", "ServerProfiler.exe", "DeepscanV1.exe", "DeepscanV2.exe", "AutoLink.exe", "Formulas.exe"]
// let programCostList = [4999997, 4999998, 5000000, 30000000, 250000000, 500000, 500000, 250000000., 1000000, 5000000000]


/** @param {NS} ns **/
export async function main(ns) {
	ns.toast("Gardening Hardware", "info", 1000)
	while (true) {
		ns.toast("Gardening Hardware", "info", waitTime / 10)
		targetBuyNode = -1;
		targetBuyCost = 999999999999;
		targetBuyAttribute = "";
		currentNodeCount = ns.hacknet.numNodes();
		myMoney = ns.getServerMoneyAvailable("home")
		ns.print(currentNodeCount, " Hacknet Nodes running");
		for (let node = 0; node < currentNodeCount; node++) {
			// get the Leve, RAM, and Core count of the current Hacknode
			targetLevel = ns.hacknet.getNodeStats(node).level
			targetRAMCount = ns.hacknet.getNodeStats(node).ram
			targetCPUCount = ns.hacknet.getNodeStats(node).cores
			// check if current node is maxed out
			if (targetLevel >= maxLevel && targetRAMCount >= maxRAM && targetCPUCount >= maxCores) {
				//don't waste the cycles attempting to evaluate a maxed out hacknode
				ns.print("Node-", node, " maxed out at level: ", targetLevel, " RAM: ", targetRAMCount, " CPU's: ", targetCPUCount);
			} else {
				// only evaluate hacknet servers that are not maxed out
				ns.print("Node-", node, " level: ", targetLevel, " RAM: ", targetRAMCount, " CPU's: ", targetCPUCount);
				let nodeLevelCost = ns.hacknet.getLevelUpgradeCost(node, 1);
				let nodeRAMCost = ns.hacknet.getRamUpgradeCost(node, 1);
				let nodeCoreCost = ns.hacknet.getCoreUpgradeCost(node, 1);
				ns.print("Node-", node, " level: $", nodeLevelCost, " RAM: $", nodeRAMCost, " CPU's: $", nodeCoreCost);
				// check the options to see if any of them cost less than the current option
				compareOptions(nodeLevelCost, nodeRAMCost, nodeCoreCost, node, ns)
			}
		}
		// Check the costs of more Hacknet servers
		let addtionalNodeCost = ns.hacknet.getPurchaseNodeCost();
		if (currentNodeCount < targetNodeNum) {
			// check if an additional node is cheaper than the lowest cost upgrade
			setOption(addtionalNodeCost, "NODE", 0, ns)
		} else {
			if (currentNodeCount >= targetNodeNum && targetBuyAttribute == "" && currentNodeCount < maxNodeNum) {
				// if all nodes are maxed out, check to see if there is enough money to expand further
				// figure out how much money is available and only by a new node if money has built up an extra billion
				let nodeMultiplyer = currentNodeCount - targetNodeNum + 1
				let upgradeFloor = oneBillion * nodeMultiplyer
				ns.print(currentNodeCount, " of ", targetNodeNum, " to ", maxNodeNum, ".  Need ", formatMoney(upgradeFloor), " to upgrade.  Have ", formatMoney(myMoney))
				if (upgradeFloor < myMoney) {
					ns.print("Buy another HackNode")
					setOption(addtionalNodeCost, "NODE", 0, ns)
				}
			}
		}
		// Check the costs of purchased servers
		let prchServers = ns.getPurchasedServers();
		if (prchServers.length < targetPrchServerNum) {
			// TODO: improve logic to replace servers at higher bank values
			let additionalPrchServerCost = ns.getPurchasedServerCost(targetPrchServerRAM)
			targetPrchServerName = "purch-server-" + prchServers.length;
			// check if an additional purchased server is cheaper than the lowest cost upgrade
			setOption(additionalPrchServerCost, "SRVR", 0, ns)
		}
		// Check the cost of programs
		/*
		for (let program = 0; program < programList.length; program++) {
			let targetProgram = programList[program]
			if (!ns.fileExists(targetProgram)) {
				//get cost
				let targetProgramCosts = programCostList[program]
				// compare with other options
				setOption(targetProgramCosts, targetProgram, 0, ns)
			}
		}
		*/

		// Check if we can afford the cheapest item this itteration
		if (targetBuyAttribute != "" && targetBuyCost <= myMoney) {
			// buy
			ns.print("Buy a ", targetBuyAttribute)
			switch (targetBuyAttribute) {
				case "NODE":
					ns.hacknet.purchaseNode()
					ns.toast("New Hacknode Purchased", "success", 3000)
					break;
				case "LVL":
					ns.hacknet.upgradeLevel(targetBuyNode, 1);
					ns.toast("New Level Purchased", "success", 500)
					break;
				case "RAM":
					ns.hacknet.upgradeRam(targetBuyNode, 1)
					ns.toast("New RAM Purchased", "success", 3000)
					break;
				case "CORE":
					ns.hacknet.upgradeCore(targetBuyNode, 1)
					ns.toast("New Core Purchased", "success", 3000)
					break;
				case "SRVR":
					ns.purchaseServer(targetPrchServerName, targetPrchServerRAM)
					break;
					/*
				case "BruteSSH.exe":
					ns.purchaseProgram("BruteSSH.exe")
					ns.toast("BruteSSH Purchased", "success", 300000)
					break;
				case "FTPCrack.exe":
					ns.purchaseProgram("FTPCrack.exe")
					ns.toast("FTPCrack Purchased", "success", 300000)
					break;
				case "relaySMTP.exe":
					ns.purchaseProgram("relaySMTP.exe")
					ns.toast("relaySMTP Purchased", "success", 300000)
					break;
				case "HTTPWorm.exe":
					ns.purchaseProgram("HTTPWorm.exe")
					ns.toast("HTTPWorm Purchased", "success", 300000)
					break;
				case "SQLInject.exe":
					ns.purchaseProgram("SQLInject.exe")
					ns.toast("New Hacknode Purchased", "success", 300000)
					break;
				case "ServerProfiler.exe":
					ns.purchaseProgram("ServerProfiler.exe")
					ns.toast("ServerProfiler Purchased", "success", 300000)
					break;
				case "DeepscanV1.exe":
					ns.purchaseProgram("DeepscanV1.exe")
					ns.toast("DeepscanV1 Purchased", "success", 300000)
					break;
				case "DeepscanV2.exe":
					ns.purchaseProgram("DeepscanV2.exe")
					ns.toast("DeepscanV2 Purchased", "success", 300000)
					break;
				case "AutoLink.exe":
					ns.purchaseProgram("AutoLink.exe")
					ns.toast("AutoLink Purchased", "success", 300000)
					break;
				case "Formulas.exe":
					ns.purchaseProgram("Formulas.exe")
					ns.toast("Formulas Purchased", "success", 300000)
					break;
					*/
			}
			waitTime = 500;

		} else {
			ns.print("Cant afford to get an addtional ", targetBuyAttribute, " for ", targetBuyCost, " only have ", myMoney)
			waitTime = 60000;
		}

		ns.print("recommend buing ", targetBuyAttribute, " for node:", targetBuyNode, " at $", targetBuyCost)
		await ns.sleep(waitTime)
	}
}

function compareOptions(levelCost, costOfRAM, coreCost, node, ns) {
	// skip anything that costs infinity... nothing costs more than $400,000,000 so I will use $999,999,999,999
	// find the lowest cost attribute
	if (coreCost < 999999999999) {
		if (costOfRAM < coreCost) {
			if (levelCost < costOfRAM) {
				setOption(levelCost, "LVL", node, ns);
			} else {
				// costOfRAM is the cheapest
				setOption(costOfRAM, "RAM", node, ns);
			}
		} else {
			if (levelCost < coreCost) {
				setOption(levelCost, "LVL", node, ns);
			} else {
				// coreCost is the cheapest
				setOption(coreCost, "CORE", node, ns);
			}
		}
	} else {
		// coreCost is infinity
		// need to check if levelCost or costOfRAM is cheaper
		if (levelCost < costOfRAM) {
			setOption(levelCost, "LVL", node, ns);
		} else {
			// costOfRAM is the cheapest
			setOption(costOfRAM, "RAM", node, ns);
		}
	}
}

function setOption(optionCost, optionAttribute, node, ns) {
	ns.print("SetOptoin - Node:", node, " Attribut:", optionAttribute, " Cost:", optionCost)
	if (optionCost < 999999999999) {
		// deal with that it might be the first attribut assigned to targetBuy
		if (targetBuyAttribute == "") {
			// first target cost
			ns.print("SetOptoin - First set")
			targetBuyAttribute = optionAttribute;
			targetBuyCost = optionCost;
			targetBuyNode = node;
		} else {
			// compare
			if (optionCost < targetBuyCost) {
				ns.print("SetOptoin - Cheaper set")
				targetBuyAttribute = optionAttribute;
				targetBuyCost = optionCost;
				targetBuyNode = node;
			} else {

				ns.print("SetOptoin - keep existing option")
			}
		}
	} else {
		ns.print("SetOptoin - Infinity")
	}
}

function formatMoney(number) {
	return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}