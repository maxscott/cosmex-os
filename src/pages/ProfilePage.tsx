import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { User, Mail, CheckCircle, XCircle, LogOut } from "lucide-react";

interface UserData {
  email?: string;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userData = user as UserData | null;

  const handleSignOut = () => {
    logout();
    navigate("/auth/login");
  };

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Loading user information...</p>
        </div>
      </div>
    );
  }

  const fullName = [userData.firstName, userData.lastName]
    .filter(Boolean)
    .join(" ") || "User";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Profile Picture and Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="relative">
              {userData.profilePictureUrl ? (
                <img
                  src={userData.profilePictureUrl}
                  alt={fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-amber-300 saturate-70 flex items-center justify-center border-4 border-gray-100">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {fullName}
              </h2>
              {userData.email && (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* User Information Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Personal Information
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userData.firstName && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      First Name
                    </dt>
                    <dd className="text-base text-gray-900">
                      {userData.firstName}
                    </dd>
                  </div>
                )}
                {userData.lastName && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      Last Name
                    </dt>
                    <dd className="text-base text-gray-900">
                      {userData.lastName}
                    </dd>
                  </div>
                )}
                {userData.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      Email
                    </dt>
                    <dd className="text-base text-gray-900">
                      {userData.email}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">
                    Email Verified
                  </dt>
                  <dd className="flex items-center gap-2">
                    {userData.emailVerified ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-base text-gray-900">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-base text-gray-900">
                          Not Verified
                        </span>
                      </>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Sign Out Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

