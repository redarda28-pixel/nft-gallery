import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type NftId = Nat;

  public type Nft = {
    id : NftId;
    title : Text;
    description : Text;
    imageKey : Storage.ExternalBlob;
    owner : Principal;
    createdAt : Time.Time;
  };
};
