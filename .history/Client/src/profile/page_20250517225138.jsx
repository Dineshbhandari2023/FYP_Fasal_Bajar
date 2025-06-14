import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser, updateUser } from "../Redux/slice/userSlice";
import { User, Phone, MapPin, Mail, Camera, Edit, Save } from "lucide-react";

// Set your server's base URL (ensure REACT_APP_SERVER_URL is defined in your .env file if needed)
const SERVER_URL = "http://localhost:8000";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // On mount, fetch current user data if not already loaded
  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchCurrentUser());
    } else {
      // Once user info is available, update the local states
      setUserData(userInfo);
      setFormData(userInfo);
    }
  }, [userInfo, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create FormData so we can send file and text fields
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("contact_number", formData.contact_number);
    data.append("location", formData.location);
    // Append the image file if a new file is selected
    if (newProfileImage) {
      data.append("image", newProfileImage);
    }
    dispatch(updateUser(data))
      .unwrap()
      .then((updatedUser) => {
        setUserData(updatedUser);
        setFormData(updatedUser);
        setIsEditing(false);
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        alert("Failed to update profile: " + err);
      });
  };

  // Build the full URL for the profile image using the stored profileImage field.
  const profileImageUrl =
    userData && userData.profileImage
      ? `${SERVER_URL}${userData.profileImage}`
      : "/placeholder.svg";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">Error: {error}</div>
        ) : userData ? (
          <div className="max-w-4xl mx-auto">
            {/* Header with profile image and basic info */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              <div className="relative">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={profileImageUrl}
                    alt={userData.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profileImageInput"
                    />
                    <label
                      htmlFor="profileImageInput"
                      className="p-1.5 bg-green-600 text-white rounded-full cursor-pointer hover:bg-green-700"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{userData.username}</h1>
                <p className="text-gray-500">{userData.role}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{userData.contact_number}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{userData.location}</span>
                  </div>
                </div>
              </div>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <Save className="inline-block mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="inline-block mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
              <div className="flex border-b overflow-x-auto">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "profile"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "orders"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  Orders
                </button>
                {userData.role === "Farmer" && (
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "listings"
                        ? "border-b-2 border-green-600 text-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("listings")}
                  >
                    My Listings
                  </button>
                )}
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "settings"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Active Tab Content */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                </div>
                <div className="p-6">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Username
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Role</label>
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          >
                            <option value="Farmer">Farmer</option>
                            <option value="Buyer">Buyer</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Contact Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="tel"
                              name="contact_number"
                              value={formData.contact_number}
                              onChange={handleInputChange}
                              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                              pattern="[0-9]{10,15}"
                              title="Phone number must be between 10 and 15 digits"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">
                            Location
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
                          onClick={() => {
                            setFormData(userData);
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Username
                          </h3>
                          <p className="mt-1">{userData.username}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Email
                          </h3>
                          <p className="mt-1">{userData.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Role
                          </h3>
                          <p className="mt-1">{userData.role}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Contact Number
                          </h3>
                          <p className="mt-1">{userData.contact_number}</p>
                        </div>
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">
                            Location
                          </h3>
                          <p className="mt-1">{userData.location}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Account Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full mt-1 rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full mt-1 rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full mt-1 rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">
                      Notification Preferences
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span>Email notifications for new orders</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span>SMS notifications for order updates</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span>Promotional emails and offers</span>
                      </label>
                    </div>
                  </div> */}

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4 text-red-600">
                      Danger Zone
                    </h3>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
