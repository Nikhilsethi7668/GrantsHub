import React, { useContext, useDebugValue, useEffect, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import { BusinessContext } from "../../Context/BusinessContext";
import {
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "lucide-react";
import Axios from "../../lib/axios";
import { toast } from "react-toastify";
import Select from 'react-select';
import uniqueFieldsData from '../uniqueFieldsOutput.json';

// Helper function to capitalize words
const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Helper function to format field names
const formatFieldName = (key) => {
  return key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function MyProfile() {
  const { user } = useContext(UserContext);
  const { businessDetails,setBusinessDetails } = useContext(BusinessContext);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const excludedFields = ["_id","__v", "user", "incorporationDate", "keyBusinessGoals", "createdAt", "updatedAt"];
  const [loading,setLoading]=useState(false)
  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(()=>{
    if(businessDetails){setFormData(businessDetails)}
  },[businessDetails])

  const handleSave = async () => {
    try {
        setLoading(true);
        const response = await Axios.put(
            `/business/edit-business-form/${formData._id}`,
            formData,
            { withCredentials: true }
        );

        if (response.status === 200) {
            setBusinessDetails(response.data.business);
            setOpen(false);
            alert(response.data.message)
            toast.success(response.data.message, {
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
            console.error("Unexpected response:", response);
            toast.success("Failed to update")
        }
    } catch (error) {
        console.error("Error updating business details:", error);
        alert("Failed to update business details. Please try again.");
    } finally {
        setLoading(false);
    }
};

  const DetailItem = ({ icon: Icon, label, value, className = "", formatValue = false }) => (
    <div
      className={`flex items-start gap-3 p-3 hover:bg-orange-50 rounded-lg transition-colors ${className}`}
    >
      <Icon className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-gray-500 ">{label}</p>
        <p className="text-gray-700 text-wrap">
          {formatValue && typeof value === 'string' ? toTitleCase(value) : (value || "-")}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 p-2 sm:p-4 lg:p-8">
      <div className="md:max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Profile
          </h1>
          <p className="text-lg text-gray-600">
            Manage your profile and preferences
          </p>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <UserIcon className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DetailItem
                icon={UserIcon}
                label="First Name"
                value={user.firstName}
              />
              <DetailItem
                icon={UserIcon}
                label="Last Name"
                value={user.lastName}
              />
              <DetailItem
                icon={EnvelopeIcon}
                label="Email"
                value={user.email}
              />
              <DetailItem icon={ChartBarIcon} label="Role" value={user.role} />
              <DetailItem
                icon={CalendarIcon}
                label="Last Login"
                value={
                  user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "-"
                }
              />
              <DetailItem
                icon={BuildingOfficeIcon}
                label="Business Account"
                value={user.business ? "Active" : "Not Active"}
              />
            </div>
          </div>

          {/* Business Details Card */}
          {user.business && businessDetails && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="w-8 h-8 text-orange-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Business Profile
                  </h2>
                  </div>
                <button
                  onClick={() => setOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <PencilIcon className="w-5 h-5 text-gray-600" />
                </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    icon={BuildingOfficeIcon}
                    label="Company Name"
                    value={businessDetails.companyName}
                    formatValue={true}
                  />
                  <DetailItem
                    icon={GlobeAltIcon}
                    label="Website"
                    value={
                      <a
                        href={businessDetails.website}
                        target="#"
                        className="text-orange-600 hover:underline"
                      >
                        {businessDetails.website}
                      </a>
                    }
                  />
                  <DetailItem
                    icon={PhoneIcon}
                    label="Phone Number"
                    value={businessDetails.phoneNumber}
                  />
                  <DetailItem
                    icon={GlobeAltIcon}
                    label="Country"
                    value={businessDetails.country}
                  />
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Financial Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      icon={ChartBarIcon}
                      label="Employee Count"
                      value={businessDetails.employeeCount}
                    />
                    <DetailItem
                      icon={ChartBarIcon}
                      label="Annual Revenue"
                      value={`$${businessDetails.annualRevenue?.toLocaleString()}`}
                    />
                    
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      icon={CalendarIcon}
                      label="Incorporation Date"
                      value={new Date(
                        businessDetails.incorporationDate
                      ).toLocaleDateString()}
                    />
                    <DetailItem
                      icon={ChartBarIcon}
                      label="Industry"
                      value={businessDetails.industry}
                    />
                    
                    <DetailItem
                      icon={ChartBarIcon}
                      label="Payroll System"
                      value={businessDetails.payrollSystem}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {open&& businessDetails && (
          <div className="fixed inset-0 flex items-center justify-center top-0 h-[100vh] bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg h-[80%] overflow-y-auto shadow-lg w-[90%] lg:w-[50%]">
              <h2 className="text-lg font-semibold mb-4">
                Edit Business Profile
              </h2>
              <div className="space-y-4 flex gap-3 items-center flex-wrap">
              {Object.keys(formData)?.filter(key => !excludedFields.includes(key)).map((key) => (
                <div key={key} className="block md:w-[40%]">
                    <span className="text-gray-700">{formatFieldName(key)}</span>
                    {key === 'businessType' ? (
                        <Select
                            options={uniqueFieldsData.applicantTypes.map(type => ({
                                value: type,
                                label: type
                            }))}
                            value={formData[key] ? { value: formData[key], label: formData[key] } : null}
                            onChange={(selected) => handleSelectChange(key, selected?.value || '')}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Search company type..."
                            isSearchable
                            noOptionsMessage={() => "No matching types found"}
                        />
                    ) : key === 'industry' ? (
                        <Select
                            options={uniqueFieldsData.sectors.map(sector => ({
                                value: sector,
                                label: sector
                            }))}
                            value={formData[key] ? { value: formData[key], label: formData[key] } : null}
                            onChange={(selected) => handleSelectChange(key, selected?.value || '')}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select industry..."
                            isSearchable
                            noOptionsMessage={() => "No matching industries found"}
                        />
                    ) : key === 'additionalIndustries' ? (
                        <Select
                            isMulti
                            options={uniqueFieldsData.sectors.map(sector => ({
                                value: sector,
                                label: toTitleCase(sector)
                            }))}
                            value={formData[key]?.map(val => ({ 
                                value: val, 
                                label: toTitleCase(val) 
                            })) || []}
                            onChange={(selected) => {
                              handleSelectChange(
                                key, 
                                selected ? selected.map(option => option.value) : []
                              );
                            }}
                           
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Search and select industries..."
                            closeMenuOnSelect={false}
                            isSearchable
                        />
                    ) : key === 'grantFunding' ? (
                        <select
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 mt-1"
                        >
                            <option value="">Select an option</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    ) : key === 'companyStatus' ? (
                        <select
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 mt-1"
                        >
                            <option value="">Select status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                        </select>
                    ) : key === 'payrollSystem' ? (
                        <select
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 mt-1"
                        >
                            <option value="">Select payroll system</option>
                            <option value="Manual">Manual</option>
                            <option value="Automated">Automated</option>
                            <option value="Outsourced">Outsourced</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            name={key}
                            value={key === 'companyName' ? toTitleCase(formData[key] || '') : (formData[key] || '')}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    )}
                </div>
              ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}