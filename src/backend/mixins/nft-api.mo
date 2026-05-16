import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Storage "mo:caffeineai-object-storage/Storage";
import NftTypes "../types/nft";
import NftLib "../lib/nft";

mixin (
  accessControlState : AccessControl.AccessControlState,
  nfts : Map.Map<NftTypes.NftId, NftTypes.Nft>,
  nftState : NftLib.NftState,
) {
  public shared ({ caller }) func mintNFT(
    title : Text,
    description : Text,
    imageKey : Storage.ExternalBlob,
  ) : async NftTypes.NftId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in to mint NFTs");
    };
    NftLib.mint(nfts, nftState, caller, title, description, imageKey);
  };

  public query func listAllNFTs() : async [NftTypes.Nft] {
    NftLib.listAll(nfts);
  };

  public query ({ caller }) func listMyNFTs() : async [NftTypes.Nft] {
    NftLib.listByOwner(nfts, caller);
  };

  public query func getNFT(id : NftTypes.NftId) : async ?NftTypes.Nft {
    NftLib.get(nfts, id);
  };

  public shared ({ caller }) func updateNFT(
    id : NftTypes.NftId,
    title : Text,
    description : Text,
  ) : async () {
    NftLib.update(nfts, caller, id, title, description);
  };

  public shared ({ caller }) func deleteNFT(id : NftTypes.NftId) : async () {
    NftLib.delete(nfts, caller, id);
  };
};
