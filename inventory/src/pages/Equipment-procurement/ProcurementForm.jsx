import React, { useState } from "react";

const ProcurementForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

 const handleSubmit = (e) => {
    e.preventDefault();
    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);
      setIsRegistered(true);

      setTimeout(() => setIsRegistered(false), 2500);
    }, 2000);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-pink-200 p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden p-10">
        <h2 className="text-3xl font-semibold text-center mb-4">Register</h2>
        <p className="text-center mb-6 text-gray-600">
          Create your account. It's free and only takes a minute.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            <input
              type="text"
              name="firstname"
              placeholder="Firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="border border-gray-300 rounded-md py-2 px-3 w-full text-slate-900 dark:text-white"
            />
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              value={formData.surname}
              onChange={handleChange}
              className="border border-gray-300 rounded-md py-2 px-3 w-full text-slate-900 dark:text-white"
            />
          </div>

          <div className="mt-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md py-2 px-3 w-full text-slate-900 dark:text-white"
            />
          </div>

          <div className="mt-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md py-2 px-3 w-full text-slate-900 dark:text-white"
            />
          </div>

          <div className="mt-4">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border border-gray-300 rounded-md py-2 px-3 w-full text-slate-900 dark:text-white"
            />
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="border border-gray-400 rounded-sm mr-2"
            />
            <span className="text-gray-600">
              I accept the{" "}
              <a href="#" className="text-purple-500 font-semibold">Terms of Use</a> &{" "}
              <a href="#" className="text-purple-500 font-semibold">Privacy Policy</a>
            </span>
          </div>

          <div className="mt-6">
<button
              type="submit"
              className={`relative flex items-center gap-3 h-14 w-52 px-6 rounded-full text-white bg-pink-500 hover:bg-pink-600 font-semibold transition-all duration-500 ease-in-out overflow-hidden ${
                isRegistering || isRegistered ? "registering" : ""
              }`}
            >
              <span
                className={`text-2xl transition-transform duration-[2s] ${
                  isRegistering ? "translate-x-[-250px]" : isRegistered ? "translate-x-[34px]" : ""
                }`}
              >
                {isRegistered ? "✔" : "📩"}
              </span>
              <span
                className={`text-lg font-semibold transition-transform duration-[2s] ${
                  isRegistering
                    ? "translate-x-[300px]"
                    : isRegistered
                    ? "translate-x-[34px]"
                    : "translate-x-0"
                }`}
              >
                {isRegistering ? "Registering..." : isRegistered ? "Registered" : "Register"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcurementForm;
