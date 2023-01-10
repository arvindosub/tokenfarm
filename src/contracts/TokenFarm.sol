pragma solidity ^0.5.0;
import "./LPToken.sol";
import "./CropToken.sol";

contract TokenFarm {
    address public owner;
    string public name = "Token Farm";
    LPToken public lpToken;
    CropToken public cropToken;

    address[] public stakeholders;
    mapping(address => uint) public stakeBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(LPToken _lpToken, CropToken _cropToken) public {
        lpToken = _lpToken;
        cropToken = _cropToken;
        owner = msg.sender;
    }

    // user stakes lp tokens (deposit)
    function stakeLP(uint _quantity) public {
        require(_quantity > 0, "quantity must be greater than 0");
        // transfer
        lpToken.transferFrom(msg.sender, address(this), _quantity);
        // update balance record       
        stakeBalance[msg.sender] = stakeBalance[msg.sender] + _quantity;
        // update stakeholding records
        if (!hasStaked[msg.sender]) {
            stakeholders.push(msg.sender);
        }     
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;                              
    }

    // owner issues user with reward crop tokens (interest)
    function issueCROP() public {
        require(msg.sender == owner, "only contract owner can issue crop rewards!");
        uint interest;
        // loop through list of stakeholders and pay everyone their interest
        for (uint i=0; i<stakeholders.length; i++) {
            require(isStaking[stakeholders[i]], "user is currently not staking");
            interest = stakeBalance[stakeholders[i]];   // can set any interest function here
            if (interest > 0) {
                cropToken.transfer(stakeholders[i], interest);
            }
        }
    }

    // user unstakes lp tokens (withdraw)
    function withdrawLP() public {
        // check balance
        uint balance = stakeBalance[msg.sender];
        require(balance > 0, "balance is 0");
        // transfer to stakeholder
        lpToken.transfer(msg.sender, balance);
        // update staking status
        stakeBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    // add some modifiers

}