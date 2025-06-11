import React, { useContext, useState } from "react";
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Navigate, useNavigate, useNavigation } from "react-router-dom"; // For navigating after logout
import { UserContext } from "../Context/UserContext";
import { BusinessContext } from "../Context/BusinessContext";
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import uniqueFieldsData from './uniqueFieldsOutput.json';
import { toast } from "react-toastify";

const uniqueApplicantTypes = [...new Set(uniqueFieldsData.applicantTypes)];
const uniqueSectors = [...new Set(uniqueFieldsData.sectors)];

const US_STATES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'NT', label: 'Northwest Territories' }
];

const COUNTRY_OPTIONS = [
  { value: 'Canada', label: 'Canada' }
];

// Step 1 Validation Schema
const step1ValidationSchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  firstName: Yup.string()
    .required("First name is required")
    .matches(/^[a-zA-Z]+$/, "Only letters are allowed"),
  lastName: Yup.string()
    .required("Last name is required")
    .matches(/^[a-zA-Z]+$/, "Only letters are allowed"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  website: Yup.string()
    .url("Please enter a valid URL (include http:// or https://)")
    .required("Company website is required"),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, "Phone number must be numeric")
    .required("Phone number is required"),
  country: Yup.string()
    .required("Country is required")
    .oneOf(['Canada'], "Must be Canada"),
  headquartered: Yup.string()
    .required("State is required")
    .oneOf(US_STATES.map(state => state.value)),
});
const step2ValidationSchema = Yup.object().shape({
  businessType: Yup.string().required("Business type is required"),
  keyBusinessGoals: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one key business goal"),
  incorporationDate: Yup.number()
    .typeError("Must be a valid year")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear(), `Year cannot be in the future`)
    .required("Year of incorporation is required"),
  additionalIndustries: Yup.array()
    .min(1, "Select at least one industry")
    .of(Yup.string())
    .max(5, "You can select up to 5 additional industries")
    .nullable(),
});

// Step 2 Validation Schema
const step3ValidationSchema = Yup.object().shape({
  employeeCount: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be 0 or more")
    .required("Employee count is required"),
  annualRevenue: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be 0 or more")
    .required("Annual revenue is required"),
  industry: Yup.string().required("Primary industry is required"),
  grantFunding: Yup.boolean()
    .typeError("Must select yes or no")
    .required("Please specify if you accessed grants"),
  founderDemographics: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one founder demographic")
    .max(6, "Maximum 6 selections allowed"),

});
const step4ValidationSchema = Yup.object().shape({
  language: Yup.string().required("Preferred language is required"),
  researchDevelopment: Yup.string()
    .required("Research Development is required")
    .test('is-boolean', 'Must be Yes or No', value =>
      value && (value.toLowerCase() === "true" || value.toLowerCase() === "false")
    ),
  payrollSystem: Yup.string().required("Pay Roll System is required"),
});

const BusinessRegistration = () => {
  const navigate = useNavigate(); // For redirecting after logout
  const [step, setStep] = useState(1); // Step tracker
  const [formData, setFormData] = useState({}); // Store form data
  const { handleUploadBusinessDetails } = useContext(BusinessContext);
  const { user, logout } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [companyTypeInput, setCompanyTypeInput] = useState('');
  const [sortedCompanyTypes, setSortedCompanyTypes] = useState(
    uniqueFieldsData.applicantTypes.map(type => ({ value: type, label: type }))
  );
  const [primaryIndustryInput, setPrimaryIndustryInput] = useState('');
  const [sortedPrimaryIndustries, setSortedPrimaryIndustries] = useState(
    uniqueSectors.map(sector => ({ value: sector, label: sector }))
  );

  const [additionalIndustriesInput, setAdditionalIndustriesInput] = useState('');
  const [sortedAdditionalIndustries, setSortedAdditionalIndustries] = useState(
    uniqueSectors.map(sector => ({ value: sector, label: sector }))
  );


  const sortOptions = (inputValue, options) => {
    if (!inputValue) return options;

    const inputLower = inputValue.toLowerCase();

    return [...options].sort((a, b) => {
      const aLower = a.label.toLowerCase();
      const bLower = b.label.toLowerCase();

      // 1. Exact match comes first
      if (aLower === inputLower) return -1;
      if (bLower === inputLower) return 1;

      // 2. Starts with input comes next
      const aStartsWith = aLower.startsWith(inputLower);
      const bStartsWith = bLower.startsWith(inputLower);
      if (aStartsWith !== bStartsWith) {
        return aStartsWith ? -1 : 1;
      }

      // 3. Earlier occurrence comes next
      const aIndex = aLower.indexOf(inputLower);
      const bIndex = bLower.indexOf(inputLower);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }

      // 4. Shorter matches come first
      if (aLower.length !== bLower.length) {
        return aLower.length - bLower.length;
      }

      // 5. Finally, alphabetical order
      return a.label.localeCompare(b.label);
    });
  };

  const onInputChange = (inputValue) => {
    setCompanyTypeInput(inputValue);

    const types = uniqueFieldsData?.applicantTypes || [];

    if (!inputValue) {
      setSortedCompanyTypes(
        types.map(type => ({ value: type, label: type }))
      );
      return;
    }

    const filtered = types
      .filter(type => type.toLowerCase().includes(inputValue.toLowerCase()))
      .map(type => ({ value: type, label: type }));

    const sorted = sortOptions(inputValue, filtered);
    setSortedCompanyTypes(sorted);
  };

  const onPrevious = () => {
    setStep(step - 1); // Move to the previous step
  };



  // Initialize form with validation based on the current step
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(step === 1 ? step1ValidationSchema : step === 2 ? step2ValidationSchema : step === 3 ? step3ValidationSchema : step4ValidationSchema),
    defaultValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      website: "",
      phoneNumber: "",
      country: "",
      headquartered: "",
      businessType: "",
      keyBusinessGoals: [],
      additionalIndustries: [],
      founderDemographics: [],
      incorporationDate: "",
      employeeCount: "",
      annualRevenue: "",
      industry: "",
      grantFunding: null,
      researchDevelopment: false,
      language: "",
      payrollSystem: "",
    },
  });
  console.log(errors);

  const onNext = (data) => {

    // Merge the data from the first page with formData and move to the next step
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
    reset({ ...data }); // Keep the current form data
    setStep(step + 1); // Move to the next step
  };

  const onSubmit = async (data) => {
    // Convert data properly
    const finalData = {
      ...formData,
      ...data,
      researchDevelopment: data.researchDevelopment === "true",
      grantFunding: data.grantFunding === "true",
      employeeCount: Number(data.employeeCount),
      annualRevenue: Number(data.annualRevenue),
      // Ensure arrays are properly formatted
      keyBusinessGoals: Array.isArray(data.keyBusinessGoals) ? data.keyBusinessGoals : [],
      founderDemographics: Array.isArray(data.founderDemographics) ? data.founderDemographics : [],
      additionalIndustries: Array.isArray(data.additionalIndustries) ? data.additionalIndustries : []
    };

    console.log("Final data being sent:", JSON.stringify(finalData, null, 2));

    try {
      const response = await handleUploadBusinessDetails(user._id, finalData);
      console.log("Success:", response);
      
      toast.success("Business details submitted successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
        stack: error.stack
      });

      if (error.response) {
        // Backend validation errors
        toast.error(`Submission failed: ${error.response.data?.message || "Invalid data provided"}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        // Network/other errors
        toast.error("Network error. Please check your connection and try again.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  const handleLogout = () => {
    // Perform logout logic here, for example, clear user session
    // Then navigate to login page
    logout();
    // navigate("/login");
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#F6732E] text-white p-2 rounded"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed md:static z-40 inset-y-0 left-0 w-64 bg-white text-gray-800 p-4 border-r transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 pt-20' : '-translate-x-full'} md:translate-x-0`}>
        <h2 className="text-2xl font-bold mb-6 text-[#F6732E]">Business Registration</h2>
        <ul>
          <li>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-[#F6732E] text-white rounded hover:bg-[#e56727] transition-colors duration-200"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:pt-6 p-6 pt-10">
        <div className="p-4 card__progress w-full">
          <span className="font-bold text-green-700">{step * 25}%</span>
          <progress className="w-full h-3" max="100" value={step * 25}></progress></div>
        <h1 className="text-xl font-bold mb-4">
          {step === 1 ? "Step 1: Basic Details" : step === 2 ? "Step 2: Types and goals" : step === 3 ? "Step 3: Company Information" : "Final step: Preferences & Systems"}
        </h1>
        <form onSubmit={handleSubmit(step < 4 ? onNext : onSubmit)} className="space-y-4">
          {step === 1 && (
            <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#F99662] mb-6">Business Information</h2>

              <div className="space-y-4">
                {/* Company Name with Building Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Controller
                      name="companyName"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                          placeholder="Enter company name"
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.companyName?.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                            placeholder="John"
                          />
                        )}
                      />
                    </div>
                    <p className="text-red-500 text-xs mt-1">{errors.firstName?.message}</p>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                            placeholder="Doe"
                          />
                        )}
                      />
                    </div>
                    <p className="text-red-500 text-xs mt-1">{errors.lastName?.message}</p>
                  </div>
                </div>

                {/* Email Address with Envelope Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                          placeholder="your@email.com"
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
                </div>

                {/* Website with Link Icon */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Website*
                    <span className="text-gray-400 ml-1"></span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Controller
                      name="website"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="url"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                          placeholder="https://example.com"
                        />
                      )}
                    />
                  </div>
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                {/* Phone Number with Phone Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                          placeholder="+1 416 123 4567"
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.phoneNumber?.message}</p>
                </div>

                {/* Country with Map Pin Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province of registration*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={COUNTRY_OPTIONS}
                          value={COUNTRY_OPTIONS.find(option => option.value === field.value) || null}
                          onChange={(selected) => field.onChange(selected?.value || '')}
                          className="react-select-container pl-10"
                          classNamePrefix="react-select"
                          placeholder="Select country..."
                          isSearchable
                          defaultValue={COUNTRY_OPTIONS[0]} // Default to Canada
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              paddingLeft: '2.5rem'
                            })
                          }}
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.country?.message}</p>
                </div>

                {/* Headquarters with Office Building Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province of operation*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                      </svg>
                    </div>
                    <Controller
                      name="headquartered"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={US_STATES}
                          value={US_STATES.find(option => option.value === field.value) || null}
                          onChange={(selected) => field.onChange(selected?.value || '')}
                          className="react-select-container pl-10" // Added pl-10 for icon spacing
                          classNamePrefix="react-select"
                          placeholder="Select state..."
                          isSearchable
                          noOptionsMessage={() => "No matching states found"}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              paddingLeft: '2.5rem' // Match the icon spacing
                            })
                          }}
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.headquartered?.message}</p>
                </div>


              </div>
            </div>
          )}
          {step === 2 && (
            <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#F99662] mb-6">Business Details</h2>

              <div className="space-y-4">
                {/* Company Type with Building Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Type*</label>
                  <Controller
                    name="businessType"
                    control={control}
                    rules={{
                      validate: (value) =>
                        uniqueFieldsData.applicantTypes.includes(value) || "Invalid business type"
                    }}
                    render={({ field }) => (
                      <Select
                        options={sortedCompanyTypes}
                        value={field.value ? { value: field.value, label: field.value } : null}
                        onChange={(selected) => {
                          field.onChange(selected?.value || '');
                        }}
                        onInputChange={(inputValue) => {
                          setCompanyTypeInput(inputValue);

                          // Filter and sort options
                          const filtered = uniqueFieldsData.applicantTypes
                            .filter(type =>
                              type.toLowerCase().includes(inputValue.toLowerCase())
                            )
                            .map(type => ({ value: type, label: type }));

                          // Apply custom sorting
                          const sorted = sortOptions(inputValue, filtered);
                          setSortedCompanyTypes(sorted);

                          return inputValue;
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Search company type..."
                        isSearchable
                        noOptionsMessage={() => "No matching types found"}
                      />
                    )}
                  />
                  <p className="text-red-500 text-xs mt-1">{errors.businessType?.message}</p>
                </div>

                {/* Nature of Business with Target Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Business*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Controller
                      name="keyBusinessGoals"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent appearance-none"
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map(
                              (option) => option.value
                            );
                            field.onChange(selectedOptions);
                          }}
                          value={field.value || []}
                        >
                          <option value="">Select Key Business Goals</option>
                          <option value="Hiring">Hiring</option>
                          <option value="Internship">Internship</option>
                          <option value="Market Expansion">Market Expansion</option>
                          <option value="Research and Development">Research and Development</option>
                          <option value="Training">Training</option>
                        </select>
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.keyBusinessGoals?.message}</p>
                </div>

                {/* Founded Year with Calendar Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Founded*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Controller
                      name="incorporationDate"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent"
                          placeholder="Enter year (e.g., 2020)"
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.incorporationDate?.message}</p>
                </div>

                {/* Additional Industries with Tag Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Industries*</label>
                  <Controller
                    name="additionalIndustries"
                    control={control}
                    render={({ field }) => (
                      <Select
                        isMulti
                        options={sortedAdditionalIndustries}
                        value={field.value?.map(val => ({ value: val, label: val })) || []}
                        onChange={(selected) => {
                          field.onChange(selected?.map(option => option.value) || []);
                        }}
                        onInputChange={(inputValue) => {
                          setAdditionalIndustriesInput(inputValue);

                          // Filter and sort options
                          const filtered = uniqueSectors
                            .filter(sector =>
                              sector.toLowerCase().includes(inputValue.toLowerCase())
                            )
                            .map(sector => ({ value: sector, label: sector }));

                          // Apply custom sorting
                          const sorted = sortOptions(inputValue, filtered);
                          setSortedAdditionalIndustries(sorted);

                          return inputValue;
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Search and select industries..."
                        closeMenuOnSelect={false}
                        isSearchable
                      />
                    )}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {watch('additionalIndustries')?.length || 0} selected
                  </p>
                  <p className="text-red-500 text-xs mt-1">
                    {errors.additionalIndustries?.message}
                  </p>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#F99662] mb-6">Financial & Demographic Information</h2>

              <div className="space-y-4">
                {/* Number of Employees with People Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <Controller
                      name="employeeCount"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                          placeholder="Enter number of employees"
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.employeeCount?.message}</p>
                </div>

                {/* Annual Revenue with Currency Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Gross Revenue*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Controller
                      name="annualRevenue"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                          placeholder="Enter annual revenue"
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.annualRevenue?.message}</p>
                </div>

                {/* Primary Industry with Building Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Industry*</label>
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={sortedPrimaryIndustries}
                        value={uniqueSectors.includes(field.value)
                          ? { value: field.value, label: field.value }
                          : null
                        }
                        onChange={(selected) => {
                          field.onChange(selected?.value || '');
                        }}
                        onInputChange={(inputValue) => {
                          setPrimaryIndustryInput(inputValue);

                          // Filter and sort options
                          const filtered = uniqueSectors
                            .filter(sector =>
                              sector.toLowerCase().includes(inputValue.toLowerCase())
                            )
                            .map(sector => ({ value: sector, label: sector }));

                          // Apply custom sorting
                          const sorted = sortOptions(inputValue, filtered);
                          setSortedPrimaryIndustries(sorted);

                          return inputValue;
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Search primary industry..."
                        isSearchable
                        noOptionsMessage={() => "No matching industries found"}
                      />
                    )}
                  />
                  <p className="text-red-500 text-xs mt-1">{errors.industry?.message}</p>
                </div>

                {/* Loan Interest with Question Mark Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interested in Loan?*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Controller
                      name="grantFunding"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent appearance-none"
                        >
                          <option value="">Select an option</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.grantFunding?.message}</p>
                </div>

                {/* Founder Demographics with Diversity Icon */}
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founder Demographics*</label>
                  <div className="p-4 border border-gray-300 rounded-md">
                    <Controller
                      name="founderDemographics"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { value: "Black", label: "Black", icon: "👨🏿" },
                            { value: "Female", label: "Female", icon: "👩" },
                            { value: "LGBTQ+", label: "LGBTQ+", icon: "🏳️‍🌈" },
                            { value: "Youth", label: "Youth (under 30)", icon: "🧒" },
                            { value: "Veteran", label: "Veteran", icon: "🎖️" },
                            { value: "Newcomer", label: "Newcomer to country", icon: "🌎" },
                            { value: "None", label: "None of the above", icon: "🚫" },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${field.value?.includes(option.value)
                                ? 'bg-[#F99662]/10 border border-[#F99662]'
                                : 'hover:bg-gray-50'
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={field.value?.includes(option.value) || false}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...(field.value || []), option.value]
                                    : field.value?.filter((v) => v !== option.value);
                                  field.onChange(newValue);
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-[#F99662] focus:ring-[#F99662]"
                              />
                              <span className="text-lg">{option.icon}</span>
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    <div className="mt-2">
                      <p className="text-red-500 text-xs">
                        {errors.founderDemographics?.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Selected: {watch('founderDemographics')?.join(', ') || 'None'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#F99662] mb-6">Preferences & Systems</h2>

              <div className="space-y-4">
                {/* Research & Development with Flask Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Do you engage in research and development?*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Controller
                      name="researchDevelopment"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent appearance-none"
                        >
                          <option value="">Select an option</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.researchDevelopment?.message}</p>
                </div>

                {/* Preferred Language with Language Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.902.902 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Controller
                      name="language"
                      control={control}
                      rules={{ required: "Preferred language is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                          placeholder="Enter preferred language"
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.language?.message}</p>
                </div>

                {/* Payroll System with Document Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payroll System*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Controller
                      name="payrollSystem"
                      control={control}
                      rules={{ required: "Payroll system is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F99662] focus:border-transparent placeholder-gray-400"
                          placeholder="Enter payroll system name"
                        />
                      )}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1">{errors.payrollSystem?.message}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            {step === 4 ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium text-sm sm:text-base shadow-sm"
                  >
                    ← Previous
                  </button>
                  <button
                    type="submit"
                    className="w-full p-2 bg-[#FF5800] text-white rounded"
                  >
                    Submit
                  </button>

                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={onPrevious}
                      className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium text-sm sm:text-base shadow-sm"
                    >
                      ← Previous
                    </button>
                  )}
                  <button
                    type={step === 4 ? "submit" : "button"}
                    onClick={step < 4 ? handleSubmit(onNext) : null}
                    className={`w-full px-6 py-3 rounded-lg font-medium text-sm sm:text-base shadow-sm transition-colors duration-200 ${step === 4
                      ? "bg-[#FF5800] hover:bg-[#E04D00] text-white"
                      : "bg-[#F6732E] hover:bg-[#E56727] text-white"
                      }`}
                  >
                    {step === 4 ? "Submit Application" : "Next →"}
                  </button>
                </div>
              </>

            )}
          </div>


        </form>
      </div>
    </div >
  );
};

export default BusinessRegistration;
