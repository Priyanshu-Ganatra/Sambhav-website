"use client"
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [pressReleasesCount, setPressReleasesCount] = useState(0);
  const [socialMediaLinksCount, setSocialMediaLinksCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dashboard',{ cache: 'no-store', next: { revalidate: 10 } });
      const data = await response.json();
      if (response.ok) {
        // Set data counts
        setProjectsCount(data.projects.length);
        setPressReleasesCount(data.pressReleases.length);
        setSocialMediaLinksCount(data.socialMediaLinks.length);
      } else {
        toast.error(data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      // console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    }
  };

  // Chart data
  const chartData = {
    labels: ['Projects', 'Press Releases', 'Social Media Links'],
    datasets: [
      {
        label: 'Counts',
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
        data: [projectsCount, pressReleasesCount, socialMediaLinksCount],
      },
    ],
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Data Counts */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Projects Count</h2>
          <p>{projectsCount}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Press Releases Count</h2>
          <p>{pressReleasesCount}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Social Media Links Count</h2>
          <p>{socialMediaLinksCount}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8">
        {/* <h2 className="text-xl font-semibold mb-2">Data Distribution</h2> */}
        {/* <Bar data={chartData} /> */}
      </div>
    </div>
  );
};

export default Dashboard;
