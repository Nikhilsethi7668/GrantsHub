"use client";

import React, { useContext } from "react";
import { FaAward, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { GrantsContext } from "../../Context/GrantsContext";
// import { UserContext } from "../Context/UserContext";

import { UserContext } from "../../Context/UserContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useContext(UserContext);
  const { matchedGrants } = useContext(GrantsContext);
  const recentGrants = matchedGrants?.slice(0, 3) || [];

  return (
    <div className="container mx-auto px-4 md:px-16 py-8">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">
          Welcome back, {user?.firstName} {user?.lastName}!
        </h1>
        <p className="text-xl text-gray-600">
          Explore funding opportunities and manage your grants.
        </p>
      </header>

      {/* Statistics Section */}
      <div className=" flex justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <StatCard
          icon={<FaAward className="text-4xl text-orange-400" />}
          title="Active Grants"
          value="12000+"
        />
        <StatCard
          icon={<FaChartLine className="text-4xl text-green-500" />}
          title="Success Rate"
          value="75%"
        />
      </div>

      {/* Recent Opportunities Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Recent Opportunities</h2>
        <ul className="space-y-4">
          {recentGrants.length > 0 ? (
            recentGrants.map((grant, idx) => (
              <GrantItem
                key={grant.programName + idx}
                title={grant.programName}
                org={grant.sectors}
                amount={grant.maxAmount}
                deadline={grant.deadline || "Rolling"}
              />
            ))
          ) : (
            <li className="text-gray-500">No recent opportunities found.</li>
          )}
        </ul>
        <div className="mt-6 text-center">
          <Link to={"/profile/explore-funding"}>
            <button className="px-6 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition">
              View All Opportunities
            </button>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Want to win more funding?</h2>
        <p className="text-xl mb-6">Book a consultation to get started with grants!</p>
        <button className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition">
          Book a Consultation
        </button>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold text-purple-600">{value}</p>
    </div>
  );
}

// GrantItem Component
function GrantItem({ title, org, amount, deadline }) {
  return (
    <li className="border-b last:border-b-0 pb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{org}</p>
      <div className="flex justify-between mt-2">
        <span className="text-green-600 font-semibold">{amount}</span>
        <span className="text-gray-500">Deadline: {deadline}</span>
      </div>
    </li>
  );
}
