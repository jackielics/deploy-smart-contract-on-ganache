const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
    // 1. 使用更健壮的方式读取文件
    const readFileSafely = (path) => {
        try {
            const data = fs.readFileSync(path, "utf8");
            console.log(`成功读取文件: ${path}, 长度: ${data.length}`);
            return data;
        } catch (err) {
            console.error(`读取文件失败: ${path}`, err);
            throw err;
        }
    };

    // 2. 增加详细的网络信息检查
    const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/APmovFDdvhl4W-uzKM-GjCd6K9n4DGc6");
    const network = await provider.getNetwork();
    console.log(`连接到网络: ${network.name}, chainId: ${network.chainId}`);

    const privateKey = "";

    const wallet = new ethers.Wallet(privateKey, provider);


    // 3. 安全地初始化钱包
    const balance = await wallet.getBalance();
    console.log(`钱包地址: ${wallet.address}, 余额: ${ethers.utils.formatEther(balance)} ETH`);

	// 4. 读取ABI和二进制文件
    const abi = readFileSafely("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    binary = readFileSafely("./SimpleStorage_sol_SimpleStorage.bin", "utf8");
	const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");

	// let wallet = new ethers.Wallet.fromEncryptedJsonSync(
	// 	encryptedJson,
	// 	process.env.PRIVATE_KEY_PASSWORD
	// )

    // 5. 验证二进制文件格式
    if (!binary.startsWith("0x")) {
        console.log("二进制文件缺少'0x'前缀，添加中...");
        binary = "0x" + binary;
    }

    // 6. 部署合约并添加详细日志
    console.log("开始部署合约...");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);


    try {
        const contract = await contractFactory.deploy({
            gasLimit: 1000000 // 增加gasLimit以避免因气体不足导致的问题
        });
        
        // const contract = await contractFactory.deploy(tx);

        console.log("等待合约部署确认...");
        const deploymentReceipt = await contract.deployTransaction.wait();
        console.log(`合约已部署到地址: ${contract.address}`);
        console.log(`部署交易哈希: ${deploymentReceipt.transactionHash}`);
        console.log(`消耗的Gas: ${deploymentReceipt.gasUsed.toString()}`);
        
		const currentFavoriteNumber = await contract.retrieve();
		console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
		const transactionResponse = await contract.store("7");
		const transactionReceipt = await transactionResponse.wait(1);
		const updatedFavoriteNumber = await contract.retrieve();
		console.log(`Updated favorite number is: ${updatedFavoriteNumber}`)


        return contract;
    } catch (deployError) {
        console.error("合约部署失败:", deployError);
        
        // 检查是否是构造函数执行失败
        if (deployError.reason && deployError.reason.includes("execution reverted")) {
            console.log("可能是合约构造函数执行失败，请检查构造函数代码");
        }
        
        throw deployError;
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("程序执行出错:", error);
    process.exit(1);
  });
