import BillingTable from "./RecentBilling";
import ShopOwnerCard from "./UserCard";

const ShopOwnerProfile = () => {
  return (
    <div className="mt-[54px] mx-10">
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <ShopOwnerCard />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border-0 rounded-2xl">
            <BillingTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerProfile;
