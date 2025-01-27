<div className="mb-3">
  <label
    htmlFor="name"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    User Name
  </label>
  <input
    type="text"
    id="name"
    name="name" // Correct name attribute
    value={formData.name}
    onChange={handleInputChange}
    placeholder="Enter your username"
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {errors.name && (
    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
  )}
</div>

<div className="mb-3">
  <label
    htmlFor="contact_number"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    Contact Number
  </label>
  <input
    type="text"
    id="contact_number"
    name="contact_number" // Correct name attribute
    value={formData.contact_number}
    onChange={handleInputChange}
    placeholder="Enter your contact number"
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {errors.contact_number && (
    <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
  )}
</div>

<div className="mb-4">
  <label
    htmlFor="email"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    Email address
  </label>
  <input
    type="email"
    id="email"
    name="email" // Correct name attribute
    value={formData.email}
    onChange={handleInputChange}
    placeholder="Enter your email"
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {errors.email && (
    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
  )}
</div>

<div className="mb-4">
  <label
    htmlFor="password"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    Password
  </label>
  <input
    type="password"
    id="password"
    name="password" // Correct name attribute
    value={formData.password}
    onChange={handleInputChange}
    placeholder="Enter your password"
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {errors.password && (
    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
  )}
</div>

<div className="mb-4">
  <label
    htmlFor="confirmPassword"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    Confirm Password
  </label>
  <input
    type="password"
    id="confirmPassword"
    name="confirmPassword" // Correct name attribute
    value={formData.confirmPassword}
    onChange={handleInputChange}
    placeholder="Confirm your password"
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {errors.confirmPassword && (
    <p className="text-red-500 text-sm mt-1">
      {errors.confirmPassword}
    </p>
  )}
</div>
