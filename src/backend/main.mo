import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import NftTypes "types/nft";
import NftLib "lib/nft";
import NftMixin "mixins/nft-api";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinObjectStorage();

  let nfts = Map.empty<NftTypes.NftId, NftTypes.Nft>();
  let nftState : NftLib.NftState = { var nextId = 0 };
  include NftMixin(accessControlState, nfts, nftState);
};
