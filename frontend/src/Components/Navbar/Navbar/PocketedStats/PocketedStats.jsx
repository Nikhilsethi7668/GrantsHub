import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { FiArrowRight } from 'react-icons/fi';

const PocketedStats = () => {
  const stats = [
    { label: "in available funding", value: "Billions" },
    { label: "active users", value: 15000 },
    { label: "grants available", value: 4000 },
    { label: "applications processed", value: 1000000 },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (inView) setStartCount(true);
  }, [inView]);

  return (
    <div ref={ref} className="bg-white py-24 px-6">
      <div className="container mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            GrantsHub <span className="text-[#EA580C]">By The Numbers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our impact in real-time metrics that showcase our platform's growth and success
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-md h-full"
            >
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                {typeof stat.value === "number" ? (
                  <CountUp
                    start={startCount ? 0 : null}
                    end={stat.value}
                    duration={2.5}
                    separator=","
                  />
                ) : (
                  <span className="text-[#EA580C]">{stat.value}</span>
                )}
              </h3>
              <p className="text-gray-600 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <a href="/login">
            <button className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-[#EA580C] hover:bg-orange-700 transition-colors duration-300 shadow-lg">
              Get Started with GrantsHub
              <FiArrowRight className="h-5 w-5" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PocketedStats;
