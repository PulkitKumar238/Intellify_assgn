"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import ChartWidget from "../../components/ChartWidget";
import { CSVLink } from "react-csv";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState({
    category: "",
    value: "",
    type: "line",
  });
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push("/login");
      }
    };
    getUser();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dashboard-data");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/dashboard-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (!response.ok) throw new Error("Failed to add data");
      setNewData({ category: "", value: "", type: "line" });
      fetchData();
    } catch (error) {
      console.error("Error adding new data:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          handleSignOut={handleSignOut}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <ChartWidget
                title="Line Chart"
                type="line"
                data={data.filter((item) => item.type === "line")}
              />
              <ChartWidget
                title="Bar Chart"
                type="bar"
                data={data.filter((item) => item.type === "bar")}
              />
              <ChartWidget
                title="Pie Chart"
                type="pie"
                data={data.filter((item) => item.type === "pie")}
              />
            </div>

            {/* Export Button */}
            <CSVLink
              data={data}
              filename={"dashboard-data.csv"}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Export Data
            </CSVLink>

            {/* Form for new data input */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white">
                Add New Data
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={newData.category}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
                    htmlFor="value"
                  >
                    Value
                  </label>
                  <input
                    type="number"
                    id="value"
                    name="value"
                    value={newData.value}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
                    htmlFor="type"
                  >
                    Chart Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={newData.type}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Data
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
