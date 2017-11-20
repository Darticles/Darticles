pragma solidity ^0.4.18;

contract Darticles {
    
    // ==================================
    //          DATA STRUCTURES
    // ==================================
    
    /**
        Profile represents user's information,
        No matter if he/she is an artist or
        an art collectionist
    */
    struct Profile {
        bytes32 imageLink;   // IPFS link
        bytes32 firstName;
        bytes32 lastName;
        bytes32 nickName;
    }
    
    /**
        The artwork represents the art pieces that 
        and artist created.
        
        An artwork can be auctioned.
    */
    struct Artwork {
        // It is important to always keep track of the artwork creator, 
        // since this address can be rewarded on every auction 
        // in which this artwork is being transfered
        // 
        // The creator property must never be changed. It is immutable
        address creator;    
        
        // The owner can change because the artwork can be transfered.
        address owner;
        
        bytes32 imageLink;      // IPFS link
        bytes32 title;          // The name of this piece
        bytes32 description;    // Some explanatory notes
    }
    
    /**
        This represents bids that can be done during 
        an auction
    */
    struct Bid {
        address sender;
        uint256 value;
    }
    
    enum AuctionState { Active, Ended }
    
    struct Auction {
        address owner;          // The person that started the auction
        uint256 artworkID;      // The id of the art piece that is being auctioned
        uint256 initialPrice;   // The initial price to start bidding
        uint256 endTimestamp;   // The endtime of the auction
        AuctionState state;     // The current auction state
    }
    
    // ==================================
    //          ATTRIBUTES
    // ==================================
    
    // This is important because we need every artwork to be unique.
    // So every artwork has an 'id' property that is equal to the 
    // number of artworks in this contract
    uint256 public artworkCount;
    uint256 public auctionsCount;
    
    mapping(uint256 => Artwork) public artwork;                 // This allows us to get an artwork from its id
    mapping(address => uint256[]) public portfolioOf;           // This allows us to get the ids of the artwork of a specific user
    mapping(address => Profile) public profileOf;               // Profiles for each address
    mapping(address => uint256) public refundsFor;              // Ether that people can withdraw
    mapping(uint256 => Auction) public auctionWithID;           //
    mapping(address => uint256[]) public auctionsOf;            //
    mapping(uint256 => Bid) public currentBidForAuctionWithID;  //

    uint256[] public auctions;                                  //
    
    // ==================================
    //          EVENTS
    // ==================================
    
    event LogNewBid(uint256 auctionID, address sender, uint256 value);
    event LogOpenedAuction(uint256 auctionID);
    event LogEndedAuction(uint256 auctionID);
    
    // ==================================
    //          CONSTRUCTORS
    // ==================================
    
    function Darticles() public {}
    
    // ==================================
    //          MUTATING FUNCTIONS
    // ==================================
    
    /**
        
    */
    function setProfile 
    (
        bytes32 _profileImageLink, 
        bytes32 _firstName, 
        bytes32 _lastName, 
        bytes32 _nickName
    )   
        public 
    {
        var profile = Profile(_profileImageLink, _firstName, _lastName, _nickName);
        profileOf[msg.sender] = profile;
    }
    
    /**
        This contract implements the withdraw pattern,
        in order to avoid issues related with send/transfer done in place
    */
    function withdraw(uint256 _amount) public returns (bool) {
        require(refundsFor[msg.sender] >= _amount);
        msg.sender.transfer(_amount);
        refundsFor[msg.sender] -= _amount;
        return true;
    }
    
    function addArtwork(bytes32 _imageLink, bytes32 _title, bytes32 _description) public {
        uint256 _id = ++artworkCount;
        var _artwork = Artwork({
            creator         : msg.sender, 
            owner           : msg.sender, 
            imageLink       : _imageLink, 
            title           : _title, 
            description     : _description
        });
        artwork[_id] = _artwork;
        portfolioOf[msg.sender].push(_id);
    }
    
    function transferArtwork(address _to, uint256 _id) public {
        uint256 index = getIndexForArtworkInSenderPortfolio(_id);
        require (index != portfolioOf[msg.sender].length); // The artwork was not found
        artwork[_id].owner = _to;
        portfolioOf[_to].push(_id);
        delete(portfolioOf[msg.sender][index]);
    }
    
    function getIndexForArtworkInSenderPortfolio(uint256 _id) private view returns (uint256) {
        var idsForSender = portfolioOf[msg.sender];
        uint256 index = 0;
        while (idsForSender[index] != _id && index < idsForSender.length) {
            index++;
        }
        return index;
    }
    
    function createEmptyBid() private pure returns (Bid) {
        return Bid({
            sender: address(0),
            value: 0
        });
    }
    
    function startAuction(
        uint256 _artworkID, 
        uint256 _initialPrice, 
        uint256 _endTimestamp
    )   
        public 
        senderHasArtworkWithID(_artworkID)
    {
        var auction = Auction({
            owner: msg.sender,
            artworkID       : _artworkID,
            initialPrice    : _initialPrice,
            endTimestamp    : _endTimestamp,
            state           : AuctionState.Active
        });
        
        uint256 auctionID = ++auctionsCount;
        currentBidForAuctionWithID[auctionID] = createEmptyBid();
        auctions.push(auctionID);
        auctionsOf[msg.sender].push(auctionID);
        auctionWithID[auctionID] = auction;
        LogOpenedAuction(auctionID);
    }
    
    function endAuction(uint256 _auctionID) public {
        var auction = auctionWithID[_auctionID];
        require(currentBidForAuctionWithID[_auctionID].sender == msg.sender);
        require(auction.state == AuctionState.Active);
        require(now > auction.endTimestamp);
        auction.state = AuctionState.Ended;
        
        var bidValue = currentBidForAuctionWithID[_auctionID].value;
        
        var _artwork = artwork[auction.artworkID];
        refundsFor[_artwork.creator] = bidValue * 15 / 100;
        refundsFor[_artwork.owner] = bidValue * 85 / 100;

        LogEndedAuction(_auctionID);
    }
    
    function makeBid(uint256 _auctionID) public payable {
        var _auction = auctionWithID[_auctionID];
        
        require(msg.value >= _auction.initialPrice);
        require(msg.value > currentBidForAuctionWithID[_auctionID].value);
        
        refundsFor[currentBidForAuctionWithID[_auctionID].sender] = currentBidForAuctionWithID[_auctionID].value;
        
        var bid = Bid({
            sender: msg.sender,
            value: msg.value
        });
        
        currentBidForAuctionWithID[_auctionID] = bid;
        LogNewBid(_auctionID, msg.sender, msg.value);
    }
    
    // ==================================
    //          CONSTANT FUNCTIONS
    // ==================================
    
    /**
        Returns the profile of the caller.
    */
    function getProfile() public view returns (Profile) {
        return profileOf[msg.sender];
    }

    function getAuctions() public view returns (uint256[]) {
        return auctions;
    }

    function getArtwork() public view returns (uint256[]) {
        return portfolioOf[msg.sender];
    }
    
    // ==================================
    //              MODIFIERS
    // ==================================
    
    modifier senderHasArtworkWithID(uint256 _id) {
        require(getIndexForArtworkInSenderPortfolio(_id) != portfolioOf[msg.sender].length);
        _;
    }
    
}