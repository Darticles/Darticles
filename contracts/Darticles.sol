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
        string imageLink;   // IPFS link
        bytes32 firstName;
        bytes32 lastName;
        bytes32 nickName;
    }
    
    /**
        Artworks can't be auctioned if they are currently 
        in another auction.
     */
    enum ArtworkState { Available, InAuction }

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
        
        string imageLink;       // IPFS link
        bytes32 title;          // The name of this piece
        bytes32 description;    // Some explanatory notes
        ArtworkState state;     // Artwork state
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
    uint256 private artworkCount = 0;
    uint256 private auctionsCount = 0;
    
    mapping(uint256 => Artwork) private artwork;                 // This allows us to get an artwork from its id
    mapping(address => uint256[]) private portfolioOf;           // This allows us to get the ids of the artwork of a specific user
    mapping(address => Profile) private profileOf;               // Profiles for each address
    mapping(address => uint256) private refundsFor;              // Ether that people can withdraw
    mapping(uint256 => Auction) private auctionWithID;           //
    mapping(address => uint256[]) private auctionsOf;            //
    mapping(uint256 => Bid) private currentBidForAuctionWithID;  //

    uint256[] private activeAuctions;                                  //
    uint256[] private endedAuctions;

    address owner;
    
    // ==================================
    //          EVENTS
    // ==================================
    
    event LogNewBid(uint256 auctionID, address sender, uint256 value);
    event LogOpenedAuction(uint256 auctionID);
    event LogEndedAuction(uint256 auctionID);
    event LogNumber(uint256 number);
    event LogText(string text);
    
    // ==================================
    //          CONSTRUCTORS
    // ==================================
    
    function Darticles() public {
        owner = msg.sender;
    }
    
    // ==================================
    //          MUTATING FUNCTIONS
    // ==================================
    
    /**
        
    */
    function setProfile 
    (
        string _profileImageLink, 
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
        refundsFor[msg.sender] -= _amount;
        msg.sender.transfer(_amount);
        return true;
    }
    
    // OK
    function addArtwork(string _imageLink, bytes32 _title, bytes32 _description) public {
        uint256 _id = artworkCount++;
        var _artwork = Artwork({
            creator         : msg.sender, 
            owner           : msg.sender, 
            imageLink       : _imageLink, 
            title           : _title, 
            description     : _description,
            state           : ArtworkState.Available
        });
        artwork[_id] = _artwork;
        portfolioOf[msg.sender].push(_id);
    }
    

    function transferArtwork(address _from, address _to, uint256 _id) public {
        var index = getIndexForArtworkInSenderPortfolio(_from, _id);
        require (index < portfolioOf[_from].length); // The artwork was not found
        artwork[_id].owner = _to;
        portfolioOf[_to].push(_id);
        delete(portfolioOf[_from][index]);
    }
    
    function getIndexForArtworkInSenderPortfolio(address _sender, uint256 _id) private view returns (uint256) {
        var idsForSender = portfolioOf[_sender]; // Los ids de las obras del sender
        uint256 index = 0;
        while (idsForSender[index] != _id && index < idsForSender.length) { // aca recorro los ids de las obras
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
        artworkIDIsAvailableForAuction(_artworkID)
    {
        var auction = Auction({
            owner           : msg.sender,
            artworkID       : _artworkID,
            initialPrice    : _initialPrice,
            endTimestamp    : _endTimestamp,
            state           : AuctionState.Active
        });
        
        uint256 auctionID = auctionsCount++;
        currentBidForAuctionWithID[auctionID] = createEmptyBid();
        activeAuctions.push(auctionID);
        auctionsOf[msg.sender].push(auctionID);
        auctionWithID[auctionID] = auction;

        var _artwork = artwork[_artworkID];
        _artwork.state = ArtworkState.InAuction;

        LogOpenedAuction(auctionID);
    }

    function getIndexForAuctionInActiveArray(uint256 _auctionID) private view returns (uint256) {
        uint256 index = 0;
        while (activeAuctions[index] != _auctionID && index < activeAuctions.length) {
            index++;
        }
        return index;
    }
    
    function endAuction(uint256 _auctionID) public {
        var auction = auctionWithID[_auctionID];

        uint256 index = getIndexForAuctionInActiveArray(_auctionID);
        require(index != activeAuctions.length); 

        require(currentBidForAuctionWithID[_auctionID].sender == msg.sender);
        require(auction.state == AuctionState.Active);
        require(now > auction.endTimestamp);
        auction.state = AuctionState.Ended;
        
        var bidValue = currentBidForAuctionWithID[_auctionID].value;
        
        endedAuctions.push(_auctionID);
        if (activeAuctions.length > 1) {
            activeAuctions[index] = activeAuctions[activeAuctions.length - 1];
            delete activeAuctions[activeAuctions.length - 1];
            activeAuctions.length--;
        } else {
            activeAuctions = new uint256[](0);
        }

        var _artwork = artwork[auction.artworkID];
        _artwork.state = ArtworkState.Available;
        refundsFor[_artwork.creator] += bidValue * 10 / 100;
        refundsFor[_artwork.owner] += bidValue * 85 / 100;
        refundsFor[owner] += bidValue * 5 / 100;
        transferArtwork(_artwork.owner, msg.sender, auction.artworkID);

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
    function getProfile() public view returns (string, bytes32, bytes32, bytes32) {
        return (profileOf[msg.sender].imageLink, profileOf[msg.sender].firstName, profileOf[msg.sender].lastName, profileOf[msg.sender].nickName);
    }

    function getAuctionWithID(uint256 _auctionID) public view returns (address, uint256, uint256, uint256, bytes32) {
        var auction = auctionWithID[_auctionID];
        bytes32 auctionState = "";
        if (auction.state == AuctionState.Active) {
            auctionState = "Active";
        } else {
            auctionState = "Ended";
        }
        return (auction.owner, auction.artworkID, auction.initialPrice, auction.endTimestamp, auctionState);
    }

    function getActiveAuctions() public view returns (uint256[]) {
        return activeAuctions;
    }

    function getEndedAuctions() public view returns (uint256[]) {
        return endedAuctions;
    }

    function getArtworkWithID(uint256 _artworkID) public view returns (address, address, string, bytes32, bytes32, bytes32) {
        var _artwork = artwork[_artworkID];
        return (_artwork.creator, _artwork.owner, _artwork.imageLink, _artwork.title, _artwork.description, getDescriptionForArtworkState(_artwork.state));
    }

    function getPortfolio() public view returns (uint256[]) {
        return portfolioOf[msg.sender];
    }

    function getCurrentBidForAuctionWithID(uint256 _auctionID) public view returns (address, uint256) {
        var _bid = currentBidForAuctionWithID[_auctionID];
        return (_bid.sender, _bid.value);
    }
    
    function getRefundsFor(address _participant) public view returns (uint256) {
        return refundsFor[_participant];
    }

    function getDescriptionForArtworkState(ArtworkState _state) private pure returns (bytes32) {
        if (_state == ArtworkState.Available) {
            return "Available";
        } else {
            return "In Auction";
        }
    }

    // ==================================
    //              MODIFIERS
    // ==================================
    
    modifier senderHasArtworkWithID(uint256 _id) {
        require(getIndexForArtworkInSenderPortfolio(msg.sender, _id) != portfolioOf[msg.sender].length);
        _;
    }

    modifier artworkIDIsAvailableForAuction(uint256 _artworkID) {
        var _artwork = artwork[_artworkID];
        require(_artwork.state == ArtworkState.Available);
        _;
    }
    
}