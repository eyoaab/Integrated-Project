import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { Mail, Phone, Building2, UserCircle } from "lucide-react";
import type { EmergencyContact } from "../types";

export const EmergencyPage = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOfficeType, setSelectedOfficeType] = useState<string>("all");

  const officeTypes = [
    "all",
    "Fire Department",
    "Police Department",
    "Ambulance Service",
    "Vehicle Owner Services",
  ];

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://integrated-project-mf1f.onrender.com/api/emergency-offices"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch emergency contacts");
      }
      const data = await response.json();
      setContacts(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch emergency contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.office_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.office_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedOfficeType === "all" ||
      contact.office_type.toLowerCase() === selectedOfficeType.toLowerCase();

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="w-72 h-10 bg-[#1E1E1E] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-[#1E1E1E] rounded-lg p-6 h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error loading contacts</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getOfficeTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "fire department":
        return "bg-red-500/20 text-red-500";
      case "police department":
        return "bg-blue-500/20 text-blue-500";
      case "ambulance service":
        return "bg-green-500/20 text-green-500";
      case "vehicle owner services":
        return "bg-purple-500/20 text-purple-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors />

      {/* Search and Filter Section */}
      <div className="flex items-center gap-4 mb-6 justify-between">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 px-4 py-2 bg-[#1E1E1E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={selectedOfficeType}
          onChange={(e) => setSelectedOfficeType(e.target.value)}
          className="px-4 py-2 bg-[#1E1E1E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          {officeTypes.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? "All Office Types" : type}
            </option>
          ))}
        </select>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div
            key={contact._id}
            className="bg-[#1E1E1E] rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm ${getOfficeTypeColor(
                    contact.office_type
                  )}`}
                >
                  {contact.office_type}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{contact.name}</h3>
                    <p className="text-gray-400 text-sm">{contact.role}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span className="text-sm truncate">
                      {contact.office_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="p-4 bg-[#252525] flex justify-end gap-2">
              <button
                onClick={() => (window.location.href = `tel:${contact.phone}`)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Call
              </button>
              <button
                onClick={() =>
                  (window.location.href = `mailto:${contact.email}`)
                }
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
              >
                Email
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};
