import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Mail, MapPin, Phone, User, Globe, Pencil, Send
} from "lucide-react";
import Axios from '../lib/axios';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      const res = await Axios.post('/contact', { ...formData });

      if (!res.data.success) throw new Error('Failed to submit');

      setFormStatus('Message sent successfully!');
      setFormData({ name: '', email: '', website: '', message: '' });
    } catch (err) {
      console.log(err);
      setFormStatus('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Banner Section */}
      <section
        className="relative bg-cover bg-center h-[300px] flex items-center justify-center pt-5 mt-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1672917187338-7f81ecac3d3f?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-2">Contact Us</h1>
          <p className="text-lg">
            <span className="text-gray-300 text-xl">Home</span> &nbsp;•&nbsp; <span>Contact Us</span>
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <div className="py-12 bg-white text-center">
        <h5 className="text-[#EA580C] font-semibold mb-2 text-xl">CONTACT INFO</h5>
        <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10'>
          Our dedicated team is ready to help you navigate funding opportunities and answer your questions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="border p-6 rounded-lg shadow-sm hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <div className="bg-[#FFF8F5] p-4 rounded-full">
                <Mail className="text-[#EA580C] w-6 h-6" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Mail Here</h3>
            <p className="text-gray-600">support@grantshub.ca</p>
          </div>
          <div className="border p-6 rounded-lg shadow-sm hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <div className="bg-[#FFF8F5] p-4 rounded-full">
                <MapPin className="text-[#EA580C] w-6 h-6" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Visit Here</h3>
            <p className="text-gray-600">123 Funding Avenue</p>
            <p className="text-gray-600">Toronto, ON M5G 1R3</p>
          </div>
          <div className="border p-6 rounded-lg shadow-sm hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <div className="bg-[#FFF8F5] p-4 rounded-full">
                <Phone className="text-[#EA580C] w-6 h-6" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Call Here</h3>
            <p className="text-gray-600">+1 (800) 123-4567</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white py-16 px-4 text-center">
        <h5 className="text-[#EA580C] font-semibold mb-2">MESSAGE US</h5>
        <h2 className="text-3xl font-bold mb-10">
          Don't Hesitate To Contact <br /> With Us
        </h2>

        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Your Name...."
                className="w-full border border-gray-300 rounded-md py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#EA580C] w-5 h-5" />
            </div>
            <div className="relative">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Your Email...."
                className="w-full border border-gray-300 rounded-md py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#EA580C] w-5 h-5" />
            </div>
            <div className="relative">
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                type="text"
                placeholder="Your Website...."
                className="w-full border border-gray-300 rounded-md py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#EA580C] w-5 h-5" />
            </div>
          </div>
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Comments...."
              rows={6}
              className="w-full border border-gray-300 rounded-md py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <Pencil className="absolute left-4 top-5 text-[#EA580C] w-5 h-5" />
          </div>

          {/* Form Status */}
          {formStatus && (
            <p className={`text-sm ${formStatus.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
              {formStatus}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-[#EA580C] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md flex items-center justify-center mx-auto gap-2 transition disabled:opacity-50"
          >
            {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
