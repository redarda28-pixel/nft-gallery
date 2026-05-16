import Map "mo:core/Map";
import Time "mo:core/Time";
import NftTypes "../types/nft";
import Storage "mo:caffeineai-object-storage/Storage";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  public type NftMap = Map.Map<NftTypes.NftId, NftTypes.Nft>;
  public type NftState = { var nextId : Nat };

  public func mint(
    nfts : NftMap,
    state : NftState,
    caller : Principal,
    title : Text,
    description : Text,
    imageKey : Storage.ExternalBlob,
  ) : NftTypes.NftId {
    let id = state.nextId;
    state.nextId += 1;
    let nft : NftTypes.Nft = {
      id;
      title;
      description;
      imageKey;
      owner = caller;
      createdAt = Time.now();
    };
    nfts.add(id, nft);
    id;
  };

  public func listAll(nfts : NftMap) : [NftTypes.Nft] {
    nfts.values().toArray();
  };

  public func listByOwner(nfts : NftMap, owner : Principal) : [NftTypes.Nft] {
    nfts.values().filter(func(n) { Principal.equal(n.owner, owner) }).toArray();
  };

  public func get(nfts : NftMap, id : NftTypes.NftId) : ?NftTypes.Nft {
    nfts.get(id);
  };

  public func update(
    nfts : NftMap,
    caller : Principal,
    id : NftTypes.NftId,
    title : Text,
    description : Text,
  ) : () {
    switch (nfts.get(id)) {
      case (?nft) {
        if (not Principal.equal(nft.owner, caller)) {
          Runtime.trap("Unauthorized: only the owner can update this NFT");
        };
        nfts.add(id, { nft with title; description });
      };
      case null { Runtime.trap("NFT not found") };
    };
  };

  public func delete(nfts : NftMap, caller : Principal, id : NftTypes.NftId) : () {
    switch (nfts.get(id)) {
      case (?nft) {
        if (not Principal.equal(nft.owner, caller)) {
          Runtime.trap("Unauthorized: only the owner can delete this NFT");
        };
        nfts.remove(id);
      };
      case null { Runtime.trap("NFT not found") };
    };
  };
};
