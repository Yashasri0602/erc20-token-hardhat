
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

//@dev - This contract mdefines the token name and symbol and we have getters to get the same


contract tokenDetails{
    uint public _totalBalance;
    string private Name;
    string private Symbol;
    address public owner;

    mapping(address => uint) public _balances;
    mapping(address => mapping(address => uint)) public allowance;

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
    constructor(string memory _tokenName, string memory _tokenSymbol) {
        Name = _tokenName;
        Symbol = _tokenSymbol;
        owner = msg.sender;
    }

    modifier onlyOwner{
        require(owner == msg.sender, "Only owner can call this function");
        _;
    }

    function name() public view returns(string memory){
        return Name;
    }

    function symbol() public view returns(string memory){
        return Symbol;
    }

    function decimals() public view virtual returns(uint){
        return 18;
    }
    function balanceOf(address account) public view returns(uint){
        return  _balances[account];
    }

    function _mint(address to, uint amount) public onlyOwner {
        require(to != address(0), "Invalid Address");
        uint scaled = amount * 10 ** 18;
        _totalBalance += scaled;
        _balances[to] += scaled;
        emit Transfer(address(0), to, amount);
    }


    function transfer(address to, uint value) public virtual {
        uint scaled = value * 10 ** 18;
        address from = msg.sender;
        require(scaled <= _balances[from], "Insufficient balance");
        require(to != address(0), "Invalid to address");
        _balances[to] += scaled;
        _balances[from] -= scaled;
        emit Transfer(from, to, value);
    }

    function approve(address spender, uint value) public {
        require(spender != address(0), "Invalid to address");
        uint scaled = value *10 ** 18;
        allowance[msg.sender][spender] = scaled;
        emit Approval(msg.sender, spender , value);
    }

    function transferFrom(address _from, address _to, uint _value) public returns(bool){
        uint scaledValue = _value * 10 ** 18;
        require(allowance[_from][msg.sender] >= scaledValue, "Insufficient allowance");
        require(_balances[_from] >= scaledValue , "Insufficient Balance");
        require(_to != address(0) , "Invalid to address");
        allowance[_from][msg.sender] -= scaledValue;
        _balances[_from] -= scaledValue;
        _balances[_to] += scaledValue;
        emit Transfer(_from, _to, _value);
        return true;
    }
}





/*

pragma solidity ^0.8.9;

contract ERC20 {
    string public name;
    string public symbol;
    uint8 public immutable decimals;
    uint256 public immutable totalSupply;
    mapping(address => uint256) _balances;
    mapping(address => mapping(address => uint256)) _allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = 18;
        totalSupply = _totalSupply;
        _balances[msg.sender] = _totalSupply;
    }

    function balanceOf(address _owner) public view returns(uint256) {
        require(_owner != address(0), "!ZA");
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns(bool) {
        require((_balances[msg.sender] >= _value) && (_balances[msg.sender] != 0), "!Bal");
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool) {
        require(_allowances[msg.sender][_from] >= _value, "!Alw");
        require((_balances[_from] >= _value) && (_balances[_from] != 0), "!Bal");
        _balances[_from] -= _value;
        _balances[_to] += _value;
        _allowances[msg.sender][_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns(bool) {
        require(_balances[msg.sender] >= _value, "!Bal");
        _allowances[_spender][msg.sender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns(uint256) {
        return _allowances[_spender][_owner];
    }
}
*/