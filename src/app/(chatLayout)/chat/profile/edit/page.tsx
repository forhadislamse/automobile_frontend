import TechnicianEdit from "@/components/module/Chat/Edit";

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          {/* Optional Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Edit Profile
            </h1>
            <p className="text-sm text-gray-500">
              Update your personal information
            </p>
          </div>

          <TechnicianEdit />
        </div>
      </div>
    </div>
  );
};

export default Page;
