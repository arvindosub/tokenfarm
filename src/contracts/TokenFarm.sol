pragma solidity ^0.5.0;
import "./LP0Token.sol";
import "./LP1Token.sol";
import "./LP2Token.sol";
import "./CropToken.sol";

contract TokenFarm {
    address public owner;
    string public name = "Token Farm";
    LP0Token public lp0Token;
    LP1Token public lp1Token;
    LP2Token public lp2Token;
    CropToken public cropToken;
    uint public lp0Share = 50;
    uint public lp1Share = 30;
    uint public lp2Share = 20;
    uint public rewardQuantity = 200000000000000000000;

    struct Stakeholder {
        uint lp0Count;
        uint lp1Count;
        uint lp2Count;
        uint cropCount;
        bool isStaking;
        bool isOnboarded;
    }

    struct Pool {
        uint lastBlock;
        uint lp0Total;
        uint lp1Total;
        uint lp2Total;
    }

    Pool public pool = Pool({
        lastBlock: 0,
        lp0Total: 0,
        lp1Total: 0,
        lp2Total: 0
    });
    address[] public allStakeholders;
    mapping(address => Stakeholder) public stakeholders;

    constructor(LP0Token _lp0Token, LP1Token _lp1Token, LP2Token _lp2Token, CropToken _cropToken) public {
        lp0Token = _lp0Token;
        lp1Token = _lp1Token;
        lp2Token = _lp2Token;
        cropToken = _cropToken;
        owner = msg.sender;
        pool.lastBlock = block.number;
    }

    // add stakeholder if not added already
    function addStakeholder() public {
        if (!stakeholders[msg.sender].isOnboarded) {
            Stakeholder memory myStakeholder = Stakeholder({
                lp0Count: 0,
                lp1Count: 0,
                lp2Count: 0,
                cropCount: 0,
                isStaking: false,
                isOnboarded: true
            });
            stakeholders[msg.sender] = myStakeholder;
            allStakeholders.push(msg.sender);
        }
    }

    // user stakes lp tokens (deposit)
    function stakeLP0(uint _quantity) public {
        require(_quantity > 0, "quantity must be greater than 0");
        // add stakeholder if not onboarded yet
        addStakeholder();
        // transfer
        lp0Token.transferFrom(msg.sender, address(this), _quantity);
        // update balance record       
        stakeholders[msg.sender].lp0Count = stakeholders[msg.sender].lp0Count + _quantity;
        // update stakeholding records
        if (!stakeholders[msg.sender].isStaking) {
            stakeholders[msg.sender].isStaking = true;
        }
        // update pool
        pool.lp0Total = pool.lp0Total + _quantity;
        // update rewards
        issueCROP();               
    }

    function stakeLP1(uint _quantity) public {
        require(_quantity > 0, "quantity must be greater than 0");
        // add stakeholder if not onboarded yet
        addStakeholder();
        // transfer
        lp1Token.transferFrom(msg.sender, address(this), _quantity);
        // update balance record       
        stakeholders[msg.sender].lp1Count = stakeholders[msg.sender].lp1Count + _quantity;
        // update stakeholding records
        if (!stakeholders[msg.sender].isStaking) {
            stakeholders[msg.sender].isStaking = true;
        }
        // update pool
        pool.lp1Total = pool.lp1Total + _quantity;
        // update rewards
        issueCROP(); 
    }

    function stakeLP2(uint _quantity) public {
        require(_quantity > 0, "quantity must be greater than 0");
        // add stakeholder if not onboarded yet
        addStakeholder();
        // transfer
        lp2Token.transferFrom(msg.sender, address(this), _quantity);
        // update balance record       
        stakeholders[msg.sender].lp2Count = stakeholders[msg.sender].lp2Count + _quantity;
        // update stakeholding records
        if (!stakeholders[msg.sender].isStaking) {
            stakeholders[msg.sender].isStaking = true;
        }
        // update pool
        pool.lp2Total = pool.lp2Total + _quantity;
        // update rewards
        issueCROP(); 
    }

    // user unstakes lp tokens (withdraw)
    function withdrawLP0(uint _quantity) public {
        // check balance
        uint balance = stakeholders[msg.sender].lp0Count;
        require(balance > 0, "balance is 0");
        require(balance >= _quantity, "you do not have enough tokens!");
        // transfer to stakeholder
        lp0Token.transfer(msg.sender, _quantity);
        // update staking status
        stakeholders[msg.sender].lp0Count = stakeholders[msg.sender].lp0Count - _quantity;
        pool.lp0Total -= _quantity;
        if (stakeholders[msg.sender].lp0Count == 0 && stakeholders[msg.sender].lp1Count == 0 && stakeholders[msg.sender].lp2Count == 0) {
            stakeholders[msg.sender].isStaking = false;
        }
        // update rewards
        issueCROP(); 
    }

    function withdrawLP1(uint _quantity) public {
        // check balance
        uint balance = stakeholders[msg.sender].lp1Count;
        require(balance > 0, "balance is 0");
        require(balance >= _quantity, "you do not have enough tokens!");
        // transfer to stakeholder
        lp1Token.transfer(msg.sender, _quantity);
        // update staking status
        stakeholders[msg.sender].lp1Count = stakeholders[msg.sender].lp1Count - _quantity;
        pool.lp1Total -= _quantity;
        if (stakeholders[msg.sender].lp0Count == 0 && stakeholders[msg.sender].lp1Count == 0 && stakeholders[msg.sender].lp2Count == 0) {
            stakeholders[msg.sender].isStaking = false;
        }
        // update rewards
        issueCROP(); 
    }

    function withdrawLP2(uint _quantity) public {
        // check balance
        uint balance = stakeholders[msg.sender].lp2Count;
        require(balance > 0, "balance is 0");
        require(balance >= _quantity, "you do not have enough tokens!");
        // transfer to stakeholder
        lp2Token.transfer(msg.sender, _quantity);
        // update staking status
        stakeholders[msg.sender].lp2Count = stakeholders[msg.sender].lp2Count - _quantity;
        pool.lp2Total -= _quantity;
        if (stakeholders[msg.sender].lp0Count == 0 && stakeholders[msg.sender].lp1Count == 0 && stakeholders[msg.sender].lp2Count == 0) {
            stakeholders[msg.sender].isStaking = false;
        }
        // update rewards
        issueCROP(); 
    }

    // owner issues stakeholders with reward crop tokens (interest)
    function issueCROP() public {
        //require(msg.sender == owner, "only contract owner can issue crop rewards!");
        if (block.number <= pool.lastBlock) {
            return;
        }
        uint lp0Interest;
        uint lp1Interest;
        uint lp2Interest;
        uint totalInterest;

        // loop through list of stakeholders and pay everyone their interest if they are staking
        for (uint i=0; i<allStakeholders.length; i++) {
            if (stakeholders[allStakeholders[i]].isStaking) {
                // calculate interest - can set any interest function here
                if (pool.lp0Total > 0) {
                    lp0Interest = (rewardQuantity * stakeholders[allStakeholders[i]].lp0Count * lp0Share) / (pool.lp0Total * 100);
                } else {
                    lp0Interest = 0;
                }
                if (pool.lp1Total > 0) {
                    lp1Interest = (rewardQuantity * stakeholders[allStakeholders[i]].lp1Count * lp1Share) / (pool.lp1Total * 100);
                } else {
                    lp1Interest = 0;
                }
                if (pool.lp2Total > 0) {
                    lp2Interest = (rewardQuantity * stakeholders[allStakeholders[i]].lp2Count * lp2Share) / (pool.lp2Total * 100);
                } else {
                    lp2Interest = 0;
                }
                totalInterest = lp0Interest + lp1Interest + lp2Interest;
                // allocate interest and update records
                if (totalInterest > 0) {
                    stakeholders[allStakeholders[i]].cropCount = stakeholders[allStakeholders[i]].cropCount + totalInterest;
                }
            }
        }
        pool.lastBlock = block.number;
    }

    // harvest crops
    function harvestCROP(uint _quantity) public {
        require(_quantity <= stakeholders[msg.sender].cropCount, "you do not have enough tokens!");
        cropToken.transfer(msg.sender, _quantity);
        stakeholders[msg.sender].cropCount -= _quantity;
    }

    // buy LP tokens - in reality, this should be a payable function with actual liquidity cost
    function buyLP(uint _id, uint _quantity) public {
        if (_id == 0) {
            lp0Token.transfer(msg.sender, _quantity);
        } else if (_id == 1) {
            lp1Token.transfer(msg.sender, _quantity);
        } else if (_id == 2) {
            lp2Token.transfer(msg.sender, _quantity);
        }
    }

    // add some modifiers

}