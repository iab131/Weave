"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [showCard, setShowCard] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerms, setSearchTerms] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    handle: "",
    comments: "",
    profilePicture: null,
  });
  const [errors, setErrors] = useState({ firstName: "", lastName: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
  };

  const getRandomPosition = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    let x, y;
    do {
      x = Math.floor(Math.random() * (window.innerWidth - 320));
      y = Math.floor(Math.random() * (window.innerHeight - 200));
    } while (
      x > centerX - 140 && x < centerX + 140 && y > centerY - 70 && y < centerY + 70
    );
    return { x, y };
  };

  const handleSave = async () => {
    const { firstName, lastName, handle } = formData;
    
    // Check for required fields
    if (!firstName || !lastName) {
      setErrors({
        firstName: !firstName ? "First Name is required" : "",
        lastName: !lastName ? "Last Name is required" : "",
      });
      return;
    }
  
    // If the handle is available, create the LinkedIn profile URL
    let profileLink = '';
    if (handle) {
      profileLink = handle.startsWith("https://") ? handle : `https://www.linkedin.com/in/${handle}`;
    } else {
      // If there's no handle, you can return a message or use the name for search
      profileLink = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(firstName + " " + lastName)}`;
    }
  
    // Log and update state with new profile data
    const position = getRandomPosition();
    if (editIndex !== null) {
      setSavedCards((prev) => {
        const updatedCards = [...prev];
        updatedCards[editIndex] = { ...formData, position, profileLink };
        return updatedCards;
      });
      setEditIndex(null);
    } else {
      setSavedCards((prev) => [
        ...prev,
        { ...formData, position, profileLink }
      ]);
    }
  
    // Optionally, open the LinkedIn profile page in a new tab if a direct link exists
    if (profileLink && profileLink !== "Not found") {
      window.open(profileLink, "_blank");
    }
  
    // Close the form and reset form data
    setShowCard(false);
    setFormData({
      firstName: "",
      lastName: "",
      company: "",
      handle: "",
      comments: "",
      profilePicture: null,
    });
  };

  const handleEdit = (index) => {
    const card = savedCards[index];
    setFormData(card);
    setShowCard(true);
    setEditIndex(index);
  };

  const handleCancel = () => {
    setShowCard(false);
    setEditIndex(null);
  };

  const handleSearchClick = () => {
    setShowSearchBar((prev) => !prev);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const searchLinkedInProfiles = async (query) => {
    // Replace with your LinkedIn API credentials and endpoint
    const accessToken = "YOUR_ACCESS_TOKEN";
    const apiUrl = `https://api.linkedin.com/v2/search?q=${encodeURIComponent(query)}&type=PEOPLE`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch LinkedIn profiles");
    }

    const data = await response.json();
    return data.elements;
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      try {
        const results = await searchLinkedInProfiles(searchInput.trim());
        setSearchResults(results);
        setShowSearchPopup(true);
      } catch (error) {
        console.error("Error searching LinkedIn profiles:", error);
      }
    }
  };

  const handleProfileSelect = (profile) => {
    setFormData((prev) => ({
      ...prev,
      handle: `https://www.linkedin.com/in/${profile.handle}`,
      profileLink: `https://www.linkedin.com/in/${profile.handle}`,
    }));
    setShowSearchPopup(false);
  };

  useEffect(() => {}, []);

  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-10 left-10 flex flex-col gap-4 items-start">
        <div className="flex gap-4 items-center">
          <button
            className="bg-[#60677a] text-white p-4 rounded-lg w-30 h-30 flex items-center justify-center text-2xl"
            onClick={() => setShowCard(true)}
          >
            +
          </button>
          <div className="relative flex items-center">
            <button
              className="bg-[#60677a] text-white p-4 rounded-lg w-30 h-30 flex items-center justify-center"
              onClick={handleSearchClick}
            >
              <Image
                src="/expandicon.png"
                alt="expand icon"
                width={30}
                height={30}
              />
            </button>
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="Enter Key Words..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className={`ml-4 p-2 border border-gray-300 rounded transition-all duration-500 ease-in-out ${
                  showSearchBar ? "w-64 opacity-100" : "w-0 opacity-0"
                }`}
                style={{
                  backgroundColor: "rgba(96, 103, 122, 0.5)",
                  color: "white",
                }}
              />
              {showSearchBar && (
                <svg
                  className="ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </form>
          </div>
          <div className="flex gap-2 flex-wrap">
            {searchTerms.map((term, index) => (
              <div
                key={index}
                className="bg-gray-700 text-white p-2 rounded-lg shadow-lg"
              >
                {term}
              </div>
            ))}
          </div>
        </div>
      </div>
      {savedCards.map((card, index) => (
        <div
          key={index}
          className="absolute bg-black text-white p-4 rounded-lg shadow-lg w-80 animate-float opacity-30 hover:opacity-100 transition-opacity duration-300"
          style={{ top: card.position.y, left: card.position.x }}
        >
          <div className="relative">
            <h2 className="text-xl mb-2">Node</h2>
            <button
              className="absolute top-2 right-2"
              onClick={() => handleEdit(index)}
            >
              <Image
                src="/pencil.png"
                alt="Edit"
                width={40}
                height={40}
              />
            </button>
          </div>
          <p><strong>First Name:</strong> {card.firstName}</p>
          <p><strong>Last Name:</strong> {card.lastName}</p>
          <p><strong>Company:</strong> {card.company}</p>
          <p><strong>Handle:</strong> {card.handle}</p>
          <p><strong>Comments:</strong> {card.comments}</p>
          {card.profileLink && (
          <p className="truncate"><strong>Profile:</strong> <a href={card.profileLink} target="_blank" className="break-all">{card.profileLink}</a></p>
          )}  
          {card.profilePicture && (
            <p><strong>Profile Picture:</strong> {card.profilePicture.name}</p>
          )}
        </div>
      ))}
      {showCard && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 text-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-xl mb-4">{editIndex !== null ? "Edit Node" : "Add New Node"}</h2>
          <form>
            <div className="mb-4">
              <label className="block text-white">First Name*</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
              {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-white">Last Name*</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
              {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-white">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Linkedin/Instagram Handle</label>
              <input
                type="text"
                name="handle"
                value={formData.handle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Comments</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Profile Picture (optional)</label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-700 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-900 text-white p-2 rounded"
              >
                {editIndex !== null ? "Update Node" : "Save Node"}
              </button>
            </div>
          </form>
        </div>
      )}
      {showSearchPopup && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-xl mb-4">Select LinkedIn Profile</h2>
            <ul>
              {searchResults.map((profile) => (
                <li key={profile.id} className="mb-2">
                  <button
                    className="text-blue-500 underline"
                    onClick={() => handleProfileSelect(profile)}
                  >
                    {profile.firstName} {profile.lastName}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-gray-700 text-white p-2 rounded"
              onClick={() => setShowSearchPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <Image
          src="/centeruser.png"
          alt="centerweave"
          width={280}
          height={138}
          priority
        />
        <div className="flex gap-4 items-center flex-col sm:flex-row">
       
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      
      </footer>
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .break-all {
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}